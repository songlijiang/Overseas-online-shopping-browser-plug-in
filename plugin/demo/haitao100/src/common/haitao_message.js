var extension = new PopupExtension();
var _this = extension.get_this();
extension.message_page = 1;//默认显示第一页

//页面初始化
extension.content_init = function(){
	_this.get_page();
	_this.get_plugin_message();
}

//绑定事件
extension.bind_event = function(){
	//消息提醒全选反选
	$('#message_check_all').click(function(){
		$('#haitao_message_main .haitao_message_check').attr('checked',$(this).is(':checked'));
	});
	//删除消息
	$('#message_delete').click(function(){
		var msg_id_arr = new Array();
		$('#haitao_message_main .haitao_message_check:checked').each(function(){
			msg_id_arr.push($(this).val());
		});
		if(msg_id_arr.length>0){
			var msg_id_list = msg_id_arr.join(',');
			//删除消息
			var details = {
				url: PluginConf.get_interface_file('delete_plugin_message'),
				method: 'POST',
				async: true,
				params: {'msg_id_list':msg_id_list},
				contentType: 'json'
			};
			kango.xhr.send(details, function(data) {
				if (data.status == 200 && data.response != null) {
					var result_obj = data.response;
					if(result_obj.status==1){
						_this.get_plugin_message();
					}
				}else { // something went wrong
					
				}
			});
		}
	});
	//新标签页打开消息内容
	$("#haitao_message_main .haitao_message_list a").live('click',function(){
		var this_obj = $(this);
		var msg_id = $(this).attr('msg_id');
		var tab_url = $(this).attr('tab_url');
		//更新消息状态
		var details = {
			url: PluginConf.get_interface_file('update_plugin_message'),
			method: 'POST',
			async: true,
			params: {'msg_id':msg_id,'is_read':1},
			contentType: 'json'
		};
		kango.xhr.send(details, function(data) {
			if (data.status == 200 && data.response != null) {
				var result_obj = data.response;
				if(result_obj.status==1){
					this_obj.addClass('haitao_message_read');
				}
			}else { // something went wrong
				
			}
			if(tab_url){
				kango.browser.tabs.create({url: tab_url});
				KangoAPI.closeWindow();
			}
		});
		return false;
	});
}

//获取分页页数
extension.get_page = function(){
	var page = _this.get_query('page');
	if(page){
		_this.message_page = page;
	}
}

//获取消息提醒列表
extension.get_plugin_message = function(){
	kango.invokeAsync('kango.storage.getItem', 'user_id', function(data) {
		var user_id = data;
		var details = {
			url: PluginConf.get_interface_file('get_plugin_message',{'user_id':user_id,'page':_this.message_page}),
			method: 'GET',
			async: true,
			contentType: 'json'
		};
		kango.xhr.send(details, function(data) {
			if (data.status == 200 && data.response != null) {
				var result_obj = data.response;
				var attach = result_obj.attach;
				var message_arr = attach.message_list;
				var message_length = message_arr.length;
				var message_list = '<div class="popup_window_tip"><span>暂无消息！</span></div>';
				for(var i=0;i<message_length;i++){
					message_list += '<div class="haitao_message_list">'+
										'<input class="haitao_message_check" name="message_check" type="checkbox" value="'+message_arr[i].msg_id+'"/>'+
										'<a'+(message_arr[i].is_read==1?' class="haitao_message_read"':'')+' msg_id="'+message_arr[i].msg_id+'" tab_url="'+message_arr[i].msg_link+'" title="'+message_arr[i].msg_title+'">'+_this.sub_str(message_arr[i].msg_title,30)+'</a>'+
										'<span>'+message_arr[i].send_time+'</span>'+
									'</div>';
				}
				$('#haitao_message_main').empty().append(message_list);
				var msg_count = attach.msg_count;
				if(msg_count>0){
					$('#haitao_message .message_i',parent.document).text(msg_count).show();
				}else{
					$('#haitao_message .message_i',parent.document).text(msg_count).hide();
				}
				if(message_length==0){
					$('#haitao_message_main .popup_window_tip').show();
				}
				
				//加载分页html
				var page_html = attach.page_html;
				var page_obj = $(page_html);
				$('#haitao_message_page').empty().append(page_obj);
			}else { // something went wrong
				var error_html = '<div class="popup_error_tip"><i></i><span>获取消息列表失败！</span></div>';
				$('#haitao_message_main').empty().append(message_list);
			}
			$('#popup_content_main').removeClass('window_loading');
		});
	});
}
extension.init();