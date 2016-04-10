var extension = new PopupExtension();
var _this = extension.get_this();
extension.favorite_page = 1;//默认显示第一页

//页面初始化
extension.content_init = function(){
	_this.get_favorite_goods();
}

//绑定事件
extension.bind_event = function(){
	//新标签页打开关注商品
	$("#popup_content_main .haitao_favorite_list .haitao_favorite_img a,#popup_content_main .haitao_favorite_list .haitao_favorite_name a").live('click',function(){
		var tab_url = $(this).attr('tab_url');
		if(tab_url){
			kango.browser.tabs.create({url: tab_url});
			KangoAPI.closeWindow();
		}
		return false;
	});
	//取消关注商品
	$('#popup_content_main .haitao_favorite_delete i').live('click',function(){
		var this_obj = $(this);
		var goods_id = $(this).attr('goods_id');
		var details = {
			url: PluginConf.get_interface_file('delete_favorite_goods'),
			method: 'POST',
			async: true,
			params: {'goods_id':goods_id},
			contentType: 'json'
		};
		kango.xhr.send(details, function(data) {
			if (data.status == 200 && data.response != null) {
				var result_obj = data.response;
				if(result_obj.status==1){
					//获取关注商品列表
					_this.favorite_page = 1;
					_this.get_favorite_goods();
				}else{
					alert(result_obj.message);
				}
			}else { // something went wrong
				
			}
		});
		return false;
	});
	//关注列表翻页
	$('#favorite_page_pre').click(function(){
		_this.page_change('pre');
	});
	$('#favorite_page_next').click(function(){
		_this.page_change('next');
	});
}

//获取关注商品列表
extension.get_favorite_goods = function(){
	kango.invokeAsync('kango.storage.getItem', 'exchange_rate', function(data) {
		var exchange_rate = data;
		kango.invokeAsync('kango.storage.getItem', 'user_id', function(data) {
			var user_id = data;
			var details = {
				url: PluginConf.get_interface_file('get_favorite_goods',{'user_id':user_id,'page':_this.favorite_page}),
				method: 'get',
				async: true,
				contentType: 'json'
			};
			kango.xhr.send(details, function(data) {
				if (data.status == 200 && data.response != null) {
					var result_obj = data.response;
					if(result_obj.status==1){
						var attach = result_obj.attach;
						var favorite_goods = attach.favorite_list;
						var list_length = favorite_goods.length;
						var favorite_list = '<div class="popup_window_tip"><span>您还没有关注的商品！</span></div>';
						for(var i=0;i<list_length;i++){
							favorite_list += '<div class="haitao_favorite_list" title="'+favorite_goods[i].goods_name+'">'+
												'<div class="haitao_favorite_img">'+
													'<a href="javascript:;" tab_url="'+favorite_goods[i].goods_url+'"><img src="'+favorite_goods[i].goods_img+'"/></a>'+
												'</div>'+
												'<div class="haitao_favorite_delete"><i goods_id="'+favorite_goods[i].goods_id+'"></i></div>'+
												'<div class="haitao_favorite_info">'+
													'<div class="haitao_favorite_name"><a href="javascript:;" tab_url="'+favorite_goods[i].goods_url+'">'+favorite_goods[i].goods_name+'</a></div>'+
													'<div class="haitao_favorite_price">$'+(favorite_goods[i].goods_price/exchange_rate).toFixed(2)+'(￥'+favorite_goods[i].goods_price+')<span>来源网站：'+(favorite_goods[i].site_name?favorite_goods[i].site_name:'官网首页')+'</span></div>'+
												'</div>'+
											'</div>';
						}
						$('#popup_content_main').empty().append(favorite_list);
						if(list_length==0){
							$('#popup_content_main .popup_window_tip').show();
						}
						if(_this.favorite_page<=1){
							$('#favorite_page_pre').hide();
						}else{
							$('#favorite_page_pre').show();
						}
						if(_this.favorite_page>=attach.favorite_count){
							$('#favorite_page_next').hide();
						}else{
							$('#favorite_page_next').show();
						}
						$('#popup_content_main').scrollTop(0);
					}
				}else { // something went wrong
					var error_html = '<div class="popup_error_tip"><i></i><span>获取关注商品列表失败！</span></div>';
					$('#popup_content_main').empty().append(message_list);
				}
				$('#popup_content_main').removeClass('window_loading');
			});
		});
	});
}

//关注列表翻页
extension.page_change = function(page_tag){
	if(page_tag=='pre'){
		_this.favorite_page -= 1;
	}else if(page_tag=='next'){
		_this.favorite_page += 1;
	}
	_this.get_favorite_goods();
}
extension.init();