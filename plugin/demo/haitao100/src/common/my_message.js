// ==UserScript==
// @name my_message Script
// @namespace my_message
// @include ^http://localhost/haitao100/index.php\?app=my_message
// @include ^http://www.haitao100.cn/index.php\?app=my_message
// @require jquery.js
// @require config.js
// @require plugin_my.js
// ==/UserScript==

var plugin_my = new PluginMy();
var _this = plugin_my.get_this();
plugin_my.message_page = 1;//默认显示第一页

//页面初始化
plugin_my.content_init = function(){
	//加载插件内容
	var no_plugin = $('#no_plugin').hide();
	$('<div id="haitao_message_main"></div><div id="haitao_message_page_main"><div id="haitao_message_page"></div></div>').insertAfter(no_plugin).show();
	_this.get_plugin_message();
}

//绑定事件
plugin_my.bind_event = function(){
	
}

//获取消息提醒列表
plugin_my.get_plugin_message = function(){
	kango.invokeAsync('kango.storage.getItem', 'user_id', function(data) {
		var user_id = data;
		var details = {
			url: PluginConf.get_interface_file('get_plugin_message',{'user_id':user_id,'page':_this.message_page}),
			method: 'GET',
			async: true,
			contentType: 'text'
		};
		kango.xhr.send(details, function(data) {
			if (data.status == 200 && data.response != null) {
				var result_obj = eval('('+data.response+')');
				var attach = result_obj.attach;
				var message_arr = attach.message_list;
				var message_length = message_arr.length;
				var message_list = '<div class="popup_window_tip"><span>暂无消息！</span></div>';
				for(var i=0;i<message_length;i++){
					message_list += '<div class="haitao_message_list">'+
										'<input class="haitao_message_check" name="message_check" type="checkbox" value="'+message_arr[i].msg_id+'"/>'+
										'<a'+(message_arr[i].is_read==1?' class="haitao_message_read"':'')+' msg_id="'+message_arr[i].msg_id+'" tab_url="'+message_arr[i].msg_link+'" title="'+message_arr[i].msg_title+'">'+_this.sub_str(message_arr[i].msg_title,26)+'</a>'+
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
				page_html = page_html.replace(/(id|class)="([^"]+)"/g,"$1"+'="'+PluginConf.css_refix+"$2"+'"');
				var page_obj = $(page_html);
				page_obj.find('a').click(function(){
					_this.message_page = $(this).attr('page');
					_this.get_plugin_message();
					return false;
				});
				$('#haitao_message_page').empty().append(page_obj);
			}else { // something went wrong
				var error_html = '<div class="popup_error_tip"><i></i><span>获取消息列表失败！</span></div>';
				$('#haitao_message_main').empty().append(message_list);
			}
			$('#popup_content_main').removeClass('window_loading');
		});
	});
}

plugin_my.init();