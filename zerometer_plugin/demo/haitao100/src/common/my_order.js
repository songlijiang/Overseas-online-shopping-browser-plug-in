// ==UserScript==
// @name my_order Script
// @namespace my_order
// @include ^http://localhost/haitao100/index.php\?app=my_order
// @include ^http://www.haitao100.cn/index.php\?app=my_order
// @require jquery.js
// @require config.js
// @require plugin_my.js
// ==/UserScript==

var plugin_my = new PluginMy();
var _this = plugin_my.get_this();
plugin_my.cart_page = 1;//默认显示第一页

//页面初始化
plugin_my.content_init = function(){
	//加载插件内容
	var no_plugin = $('#no_plugin').hide();
	$(Plugin_cart).insertAfter(no_plugin).show();
	_this.refresh_cart_list();
}

//绑定事件
plugin_my.bind_event = function(){
	//提交运单号
	$('#'+PluginConf.css_refix+'cart_table .'+PluginConf.css_refix+'shipping_num_submit a').live('click',function(){
		var this_obj = $(this);
		var shipping_num_obj = $(this).parent().siblings('.'+PluginConf.css_refix+'shipping_num_text').find('input');
		var shipping_num = $.trim(shipping_num_obj.val());
		var order_id_obj = $(this).parents('tr');
		var order_id = order_id_obj.attr('order_id');
		if(shipping_num!=''){
			var details = {
				url: PluginConf.get_interface_file('update_shipping_num'),
				method: 'POST',
				async: true,
				params: {'order_id':order_id,'shipping_num':shipping_num},
				contentType: 'json'
			};
			kango.xhr.send(details, function(data) {
				if (data.status == 200 && data.response != null) {
					var result_obj = data.response;
					var status = result_obj.status;
					if(status==1){
						this_obj.parents('.'+PluginConf.css_refix+'shipping_num_main').hide();
					}else{
						alert(result_obj.message);
					}
				}else { // something went wrong
					
				}
			});
		}
	});
	//删除购物车商品
	$('#'+PluginConf.css_refix+'cart_table .'+PluginConf.css_refix+'cart_goods_delete').live('click',function(){
		if(confirm('确定要删除这个商品吗？')){
			var parent_tr = $(this).parents('tr');
			var order_id = parent_tr.attr('order_id');
			var details = {
				url: PluginConf.get_interface_file('transport_order_delete'),
				method: 'POST',
				async: true,
				params: {'order_id':order_id,},
				contentType: 'json'
			};
			kango.xhr.send(details, function(data) {
				if (data.status == 200 && data.response != null) {
					var result_obj = data.response;
					var status = result_obj.status;
					if(status==1){
						var cart_count = parseInt($('#'+PluginConf.css_refix+'cart_count').text());
						$('#'+PluginConf.css_refix+'cart_count').text(cart_count-1);
						_this.cart_page = 1;
						_this.refresh_cart_list();
					}else{
						alert(result_obj.message);
					}
				}else { // something went wrong
					
				}
			});
		}
	});
	//显示打包窗口
	$('#'+PluginConf.css_refix+'cart_package_button').click(function(){
		_this.refresh_package_list();
	});
	//可以打包的运单全选反选
	$('#'+PluginConf.css_refix+'package_check_all').click(function(){
		$('#'+PluginConf.css_refix+'package_main .'+PluginConf.css_refix+'package_cart_check').attr('checked',$(this).is(':checked'));
		_this.refresh_package_checked_num();
	});
	$('#'+PluginConf.css_refix+'package_main .'+PluginConf.css_refix+'package_cart_check').live('click',function(){
		_this.refresh_package_checked_num();
	});
	//确定打包
	$('#'+PluginConf.css_refix+'package_ok').click(function(){
		//获取选中的运单id
		var checked_id_obj = $('#'+PluginConf.css_refix+'package_main .'+PluginConf.css_refix+'package_cart_check:checked');
		if(checked_id_obj.length==0){
			$('#'+PluginConf.css_refix+'package_error').show().find('span').text('请选择需要打包的订单！');
		}else if(checked_id_obj.length==1){
			$('#'+PluginConf.css_refix+'package_error').show().find('span').text('至少需要两个订单才能打包！');
		}else{
			var order_id_list = '';
			checked_id_obj.each(function(){
				order_id_list += $(this).val()+',';
			});
			order_id_list = order_id_list.replace(/,$/,'');
			var details = {
				url: PluginConf.get_interface_file('order_package_submit'),
				method: 'POST',
				async: true,
				params: {'user_id':_this.user_id,'order_id_list':order_id_list},
				contentType: 'json'
			};
			kango.xhr.send(details, function(data) {
				if (data.status == 200 && data.response != null) {
					var result_obj = data.response;
					var status = result_obj.status;
					if(status==1){
						_this.refresh_cart_list();
					}else{
						$('#'+PluginConf.css_refix+'package_error').show().find('span').text(result_obj.message);
					}
				}else { // something went wrong
					
				}
			});
		}
	});
	//取消打包
	$('#'+PluginConf.css_refix+'package_cancle').click(function(){
		_this.show_cart_list();
	});
}

//刷新已选择的运单数量
plugin_my.refresh_package_checked_num = function(){
	var checked_num = $('#'+PluginConf.css_refix+'package_main .'+PluginConf.css_refix+'package_cart_check:checked').length;
	$('#'+PluginConf.css_refix+'package_checked_num').text(checked_num);
}

//显示运单列表
plugin_my.show_cart_list = function(){
	$('#'+PluginConf.css_refix+'cart_list_tab').show();
	$('#'+PluginConf.css_refix+'cart_package_tab').hide();
}

//刷新用户运单
plugin_my.refresh_cart_list = function(){
	_this.show_cart_list();
	var details = {
		url: PluginConf.get_interface_file('get_transport_order',{'user_id':_this.user_id,'page':_this.cart_page}),
		method: 'GET',
		async: true,
		contentType: 'json'
	};
	kango.xhr.send(details, function(data) {
		if (data.status == 200 && data.response != null) {
			var result_obj = data.response;
			var status = result_obj.status;
			if(status==1){
				var message = result_obj.message;
				var attach = result_obj.attach;
				var order_list = attach.order_list;
				var cart_length = order_list.length;
				if(cart_length>0){
					var cart_html = '';
					for(var i=0;i<cart_length;i++){
						var cart_list = order_list[i];
						var status_id = cart_list.status_id;
						if(status_id==1){
							var opera_html = '<div class="'+PluginConf.css_refix+'shipping_num_div">'+
												'<span class="'+PluginConf.css_refix+'add_shipping_num">运单号<i></i></span>'+
												'<div class="'+PluginConf.css_refix+'shipping_num_main">'+
													'<div class="'+PluginConf.css_refix+'shipping_num_content">'+
														'<i class="'+PluginConf.css_refix+'top_border_ico"></i>'+
														'<div class="'+PluginConf.css_refix+'shipping_num_text"><input type="text" class="'+PluginConf.css_refix+'plugin_text" value="'+cart_list.shipping_num+'"></div>'+
														'<div class="'+PluginConf.css_refix+'shipping_num_submit"><a>提交</a></div>'+
													'</div>'+
												'</div>'+
											'</div>'+
											'<p><a class="'+PluginConf.css_refix+'cart_goods_delete">删除订单</a></p>';
						}else if(status_id==2){
							var opera_html = '<p><a class="'+PluginConf.css_refix+'order_pay" href="'+PluginConf.source_url+'action.php?act=alipay_request&order_id='+cart_list['order_id']+'" target="_blank">去付款</a></p>';
						}else if(status_id==3){
							var opera_html = '<p><a>申请退款</a></p>';
						}else{
							var opera_html = '';
						}
						var pre_package_id = i==0?'':order_list[i-1].package_id;
						var current_package_id = cart_list.package_id;
						var next_package_id = typeof(order_list[i+1])=='undefined'?'':order_list[i+1].package_id;
						if(pre_package_id!=current_package_id && current_package_id!=''){
							cart_html += '<tbody class="'+PluginConf.css_refix+'package_tbody"><tr><td colspan="6" class="'+PluginConf.css_refix+'package_td">合包单号：'+current_package_id+'　　合包时间：'+cart_list.package_time+'</td></tr>';
						}
						cart_html += '<tr class="'+PluginConf.css_refix+'cart_list" order_id="'+cart_list['order_id']+'">'+
										'<td align="center"><a href="'+cart_list['goods_url']+'" target="_blank" class="'+PluginConf.css_refix+'cart_goods_img"><img src="'+cart_list['goods_img']+'"/></a></td>'+
										'<td align="center"><a class="'+PluginConf.css_refix+'cart_goods_name" href="'+cart_list['goods_url']+'" target="_blank" title="'+cart_list['goods_name']+'">'+_this.sub_str(cart_list['goods_name'],30)+'</a></td>'+
										'<td align="center"><span class="'+PluginConf.css_refix+'cart_goods_num">'+cart_list['goods_num']+'</span></td>'+
										'<td align="center"><span class="'+PluginConf.css_refix+'cart_goods_time" title="'+cart_list['add_time']+'">'+_this.get_date(cart_list['add_time'])+'</span></td>'+
										'<td align="center"><span class="'+PluginConf.css_refix+'cart_goods_state">'+cart_list['status_name']+'</span></td>'+
										'<td align="center">'+opera_html+'</td>'+
									'</tr>';
						if(next_package_id!=current_package_id && current_package_id!=''){
							cart_html += '</tbody>';
						}
					}
					$("#"+PluginConf.css_refix+"cart_count").text(attach.record_count);
					$('#'+PluginConf.css_refix+'cart_table .'+PluginConf.css_refix+'package_tbody').remove();
					$('#'+PluginConf.css_refix+'cart_table .'+PluginConf.css_refix+'cart_list').remove();
					$('#'+PluginConf.css_refix+'cart_table').append(cart_html).find('.'+PluginConf.css_refix+'shipping_num_div').hover(function(){
						$(this).find('.'+PluginConf.css_refix+'shipping_num_main').show();
					},function(){
						$(this).find('.'+PluginConf.css_refix+'shipping_num_main').hide();
					});
					//加载分页html
					var page_html = attach.page_html;
					page_html = page_html.replace(/(id|class)="([^"]+)"/g,"$1"+'="'+PluginConf.css_refix+"$2"+'"');
					var page_obj = $(page_html);
					page_obj.find('a').click(function(){
						_this.cart_page = $(this).attr('page');
						_this.refresh_cart_list();
						return false;
					});
					$('#'+PluginConf.css_refix+'cart_page').empty().append(page_obj);
					$('#'+PluginConf.css_refix+'no_cart_info').hide();
					$('#'+PluginConf.css_refix+'cart_main').show();
				}else{
					$('#'+PluginConf.css_refix+'no_cart_info').show();
					$('#'+PluginConf.css_refix+'cart_main').hide();
				}
			}else{
				alert(result_obj.message);
			}
		}else { // something went wrong
			
		}
	});
}

//刷新可以打包的运单
plugin_my.refresh_package_list = function(){
	var details = {
		url: PluginConf.get_interface_file('get_packageable_order',{'user_id':_this.user_id}),
		method: 'GET',
		async: true,
		contentType: 'json'
	};
	kango.xhr.send(details, function(data) {
		if (data.status == 200 && data.response != null) {
			var result_obj = data.response;
			var status = result_obj.status;
			if(status==1){
				var message = result_obj.message;
				var attach = result_obj.attach;
				var order_list = attach.order_list;
				var cart_length = order_list.length;
				if(cart_length>0){
					var cart_html = '';
					for(var i=0;i<cart_length;i++){
						var cart_list = order_list[i];
						cart_html += '<tr class="'+PluginConf.css_refix+'cart_list" order_id="'+cart_list['order_id']+'">'+
										'<td style="text-align:left;"><input type="checkbox" class="'+PluginConf.css_refix+'package_cart_check" name="'+PluginConf.css_refix+'package_cart_check" value="'+cart_list['order_id']+'"/></td>'+
										'<td align="center"><a href="'+cart_list['goods_url']+'" target="_blank" class="'+PluginConf.css_refix+'cart_goods_img"><img src="'+cart_list['goods_img']+'"/></a></td>'+
										'<td align="center"><a class="'+PluginConf.css_refix+'cart_goods_name" href="'+cart_list['goods_url']+'" target="_blank" title="'+cart_list['goods_name']+'">'+_this.sub_str(cart_list['goods_name'],30)+'</a></td>'+
										'<td align="center"><span class="'+PluginConf.css_refix+'cart_goods_num">'+cart_list['goods_num']+'</span></td>'+
										'<td align="center"><span class="'+PluginConf.css_refix+'cart_goods_time" title="'+cart_list['add_time']+'">'+_this.get_date(cart_list['add_time'])+'</span></td>'+
										'<td align="center"><span class="'+PluginConf.css_refix+'cart_goods_state">'+cart_list['status_name']+'</span></td>'+
									'</tr>';
					}
					$('#'+PluginConf.css_refix+'package_table .'+PluginConf.css_refix+'cart_list').remove();
					$('#'+PluginConf.css_refix+'package_check_all').attr('checked',false);
					$('#'+PluginConf.css_refix+'package_checked_num').text(0);
					$('#'+PluginConf.css_refix+'package_error').hide();
					$(cart_html).insertBefore($("#"+PluginConf.css_refix+"package_check"));
					$('#'+PluginConf.css_refix+'no_package_info').hide();
					$('#'+PluginConf.css_refix+'package_main').show();
				}else{
					$('#'+PluginConf.css_refix+'no_package_info').show();
					$('#'+PluginConf.css_refix+'package_main').hide();
				}
			}else{
				alert(result_obj.message);
			}
		}else { // something went wrong
			
		}
		$('#'+PluginConf.css_refix+'cart_list_tab').hide();
		$('#'+PluginConf.css_refix+'cart_package_tab').show();
	});
}

plugin_my.init();