var extension = new PopupExtension();
var _this = extension.get_this();
//页面初始化
extension.content_init = function(){
	_this.get_message_count();
}

//绑定事件
extension.bind_event = function(){
	//切换选项卡
	$(".popup_menu_li").click(function(){
		$(".popup_menu_li").removeClass('current_menu');
		$(this).addClass('current_menu');
		var iframe_src = $(this).attr('iframe_src');
		$('#popup_content_frame').attr('src',iframe_src);
	});
}

//获取未读消息条数
extension.get_message_count = function(){
	kango.invokeAsync('kango.storage.getItem', 'user_id', function(data){
		var user_id = data;
		var details = {
			url: PluginConf.get_interface_file('get_talk_count',{'user_id':user_id}),
			method: 'GET',
			async: true,
			contentType: 'json'
		};
		kango.xhr.send(details, function(data) {
			if (data.status == 200 && data.response != null) {
				var result_obj = data.response;
				var status = result_obj.status;
				if(status==1){
					var talk_count = result_obj.attach;
					if(talk_count>0){
						$('#haitao_talk .message_i').text(talk_count).show();
					}
				}
			}else { // something went wrong
				
			}
		});
	});
	kango.invokeAsync('kango.storage.getItem', 'msg_count', function(msg_count){
		if(msg_count>0){
			$('#haitao_message .message_i').text(msg_count).show();
		}
	});
}
extension.init();