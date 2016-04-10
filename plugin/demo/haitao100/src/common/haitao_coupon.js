var extension = new PopupExtension();
var _this = extension.get_this();

//页面初始化
extension.content_init = function(){
	_this.get_discount_goods();
}

//绑定事件
extension.bind_event = function(){
	//新标签页打开优惠商品详情
	$("#popup_content_main .haitao_coupon_list").live('click',function(){
		var tab_url = $(this).attr('tab_url');
		if(tab_url){
			kango.browser.tabs.create({url: tab_url});
			KangoAPI.closeWindow();
		}
		return false;
	});
}

//获取优惠商品列表
extension.get_discount_goods = function(){
	kango.invokeAsync('kango.storage.getItem', 'exchange_rate', function(data) {
		var exchange_rate = data;
		var details = {
			url: PluginConf.get_interface_file('get_discount_goods'),
			method: 'get',
			async: true,
			contentType: 'json'
		};
		kango.xhr.send(details, function(data) {
			if (data.status == 200 && data.response != null) {
				var result_obj = data.response;
				if(result_obj.status==1){
					var discount_goods = result_obj.attach;
					var list_length = discount_goods.length;
					var coupon_list = '<div class="popup_window_tip"><span>暂无优惠信息！</span></div>';
					for(var i=0;i<list_length;i++){
						coupon_list += '<a class="haitao_coupon_list" tab_url="'+discount_goods[i].goods_url+'" title="'+discount_goods[i].goods_name+'">'+
											'<div class="haitao_coupon_img">'+
												'<img src="'+discount_goods[i].goods_img+'"/>'+
											'</div>'+
											'<div class="haitao_coupon_info">'+
												'<div class="haitao_coupon_name">'+_this.sub_str(discount_goods[i].goods_name,40)+'</div>'+
												'<div class="haitao_coupon_price">$'+(discount_goods[i].goods_price/exchange_rate).toFixed(2)+'(￥'+discount_goods[i].goods_price+')</div>'+
											'</div>'+
										'</a>';
					}
					$('#popup_content_main').empty().append(coupon_list);
					if(list_length==0){
						$('#popup_content_main .popup_window_tip').show();
					}
				}
			}else { // something went wrong
				var error_html = '<div class="popup_error_tip"><i></i><span>获取优惠信息失败！</span></div>';
				$('#popup_content_main').empty().append(error_html);
			}
			$('#popup_content_main').removeClass('window_loading');
		});
	});
}
extension.init();