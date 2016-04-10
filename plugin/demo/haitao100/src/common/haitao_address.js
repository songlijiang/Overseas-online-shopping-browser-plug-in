var extension = new PopupExtension();
var _this = extension.get_this();
var address_timer;

//页面初始化
extension.content_init = function(){
	_this.get_transport_address();
}

//绑定事件
extension.bind_event = function(){
	$('#popup_content_padding .haitao_address_list').live('click',function(){
		$('#popup_content_padding .haitao_address_list').removeClass('haitao_address_checked').find('input:radio').attr('checked',false);
		$(this).addClass('haitao_address_checked').find('input:radio').attr('checked',true);
	});
	//向前台激活窗口发送消息
	$('#auto_add_address').live('click',function(){
		kango.browser.tabs.getCurrent(function(tab){
			// tab is KangoBrowserTab object
			var address_radio = $('#popup_content_padding .haitao_address_list input:checked');
			var auto_address_id = address_radio.val();
			kango.invokeAsync('kango.storage.setItem', 'auto_address_id', auto_address_id);
			tab.dispatchMessage('auto_address_info', {'auto_address_id':auto_address_id});
		});
	});
}

//获取转运地址列表
extension.get_transport_address = function(){
	//获取上次使用的转运地址id
	kango.invokeAsync('kango.storage.getItem', 'auto_address_id', function(auto_address_id){
		var details = {
			url: PluginConf.get_interface_file('get_transport_address_list'),
			method: 'GET',
			async: true,
			contentType: 'json'
		};
		kango.xhr.send(details, function(data) {
			if (data.status == 200 && data.response != null) {
				var transport_address_obj = data.response;
				var address_list_html = '';
				if(transport_address_obj.status==1){
					var address_arr = transport_address_obj.attach;
					var address_arr_length = address_arr.length;
					if(address_arr_length>0){
						for(var i=0;i<address_arr_length;i++){
							address_list_html += '<div class="haitao_address_list'+(auto_address_id==address_arr[i].address_id?' haitao_address_checked':'')+'">'+
													'<div class="haitao_address_left"><span>寄送至</span></div>'+
													'<div class="haitao_address_right">'+
														'<input type="radio" name="address_id" value="'+address_arr[i].address_id+'"'+(auto_address_id==address_arr[i].address_id?' checked="checked"':'')+'/>'+
														'<span class="haitao_address_name">'+address_arr[i].address_name+'</span>'+
														'<span>'+address_arr[i].apartment_address+','+address_arr[i].street_address+','+address_arr[i].city_address+','+address_arr[i].province_address+','+address_arr[i].country_address+' '+address_arr[i].zip_code+' '+address_arr[i].address_mobile+'</span>'+
													'</div>'+
												'</div>';
						}
						address_list_html += '<div class="auto_address_div"><a id="auto_add_address">智能填写转运地址</a></div>';
					}else{
						address_list_html += '<div class="popup_window_tip" style="display:block;"><span>暂无可用的转运地址！</span></div>';
					}
				}else{
					address_list_html += '<div class="popup_window_tip" style="display:block;"><span>内部服务器出错，获取转运地址失败！</span></div>';
				}
				$('#popup_content_padding').empty().append(address_list_html);
				var haitao_address_checked = $('#popup_content_padding .haitao_address_checked');
				if(haitao_address_checked.length==0){
					$('#popup_content_padding .haitao_address_list:first').click();
				}
				$('#popup_content_main').removeClass('window_loading');
			}else { // something went wrong
				
			}
		});
	});
}

extension.init();