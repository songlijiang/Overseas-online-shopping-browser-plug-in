var extension = new PopupExtension();
var _this = extension.get_this();
var exp_timer,user_id;
var message_getting = false;//是否正在接收消息的标记，防止重复提交
var message_sending = false;//是否正在发送消息的标记，防止重复提交

//页面初始化
extension.content_init = function(){
	kango.invokeAsync('kango.storage.getItem', 'user_id', function(data) {
		user_id = data;
		//隐藏未读消息小标记
		$('#haitao_talk .message_i',parent.document).text(0).hide();
		//加载聊天消息
		_this.get_message_first();
		//加载聊天表情列表
		_this.load_exp_list();
		//输入框自动获得焦点
		$('#haitao_talk_editor').focus();
		//开启定时器刷新未读聊天消息
		setInterval(function(){
			_this.get_message();
		},1000);
	});
}

//绑定事件
extension.bind_event = function(){
	//显示聊天表情列表
	$('#add_exp i').click(function(){
		var talk_exp_main = $("#talk_exp_main");
		if(talk_exp_main.is(":visible")){
			_this.hide_exp_list();
		}else{
			clearTimeout(exp_timer);
			$(this).addClass('talk_ico_active');
			$('#talk_exp_main').show();
		}
	});
	$('#add_exp i').mousedown(function(){
		return false;
	});
	$("#talk_exp_main").blur(function(){
		_this.hide_exp_list();
	});
	$("#talk_exp_main img").live('focus',function(){
		setTimeout(function(){
			clearTimeout(exp_timer);
		},100);
	});
	$("#talk_exp_main img").live('blur',function(){
		//_this.hide_exp_list();
	});
	$("#haitao_talk_editor").focus(function(){
		setTimeout(function(){
			clearTimeout(exp_timer);
		},100);
	});
	$("#haitao_talk_editor").blur(function(){
		_this.hide_exp_list();
	});
	$("#haitao_talk_editor").click(function(){
		_this.hide_exp_list();
	});
	
	//插入表情
	$("#talk_exp_main img").live('click',function(){
		var img_src = $(this).attr("src");
		var img_html = '<img src="'+img_src+'"/>';
		$("#haitao_talk_editor").focus();
		//兼容性处理
		if(document.selection){//如果是ie浏览器
			document.selection.createRange().pasteHTML(img_html);
		}else{//其他浏览器
			_this.exeCommand('InsertImage',img_src);
		}
	});
	
	//发送消息
	$('#haitao_talk_send_button').click(function(){
		_this.send_message();
	});
	$('#haitao_talk_editor').keydown(function(event){
		//按回车键的处理
		if(event.keyCode==13){
			$('#haitao_talk_send_button').focus();
			_this.send_message();
			return false;
		}
	});
}

//执行document.execCommand指令
extension.exeCommand = function(command,value){
	document.execCommand(command,false,value);
}

//隐藏聊天表情列表
extension.hide_exp_list = function(){
	exp_timer = setTimeout(function(){
		$('#add_exp i').removeClass('talk_ico_active');
		$('#talk_exp_main').hide();
	},200);
}

//加载聊天表情列表
extension.load_exp_list = function(){
	var details = {
		url: PluginConf.get_interface_file('get_talk_exp'),
		method: 'GET',
		async: true,
		contentType: 'json'
	};
	kango.xhr.send(details, function(data) {
		if (data.status == 200 && data.response != null) {
			var exp_list_obj = data.response;
			if(exp_list_obj.status==1){
				var exp_list_arr = exp_list_obj.attach;
				var exp_img_list = '';
				for(var i=0,len=exp_list_arr.length;i<len;i++){
					exp_img_list += '<img tabindex="-1" title="'+exp_list_arr[i].exp_name+'" src="icons/talk_exp/ico'+exp_list_arr[i].exp_id+'.gif"/>';
				}
				$('#talk_exp_main').empty().append(exp_img_list);
			}
		}
	});
}

//载入页面时获取聊天消息
extension.get_message_first = function(){
	//防止重复提交
	if(message_getting){
		return;
	}else{
		message_getting = true;
	}
	//接收消息主处理
	var details = {
		url: PluginConf.get_interface_file('get_talk_history',{'user_id':user_id}),
		method: 'GET',
		async: true,
		contentType: 'json'
	};
	kango.xhr.send(details, function(data) {
		if (data.status == 200 && data.response != null) {
			var result_obj = data.response;
			var status = result_obj.status;
			if(status==1){
				//将聊天记录加入列表
				var msg_arr = result_obj.attach.msg_arr;
				if(msg_arr){
					var record_html = '';
					for(var len=msg_arr.length,i=len-1;i>=0;i--){
						if(msg_arr[i].admin_name){
							record_html += '<div class="talk_record_list'+(msg_arr[i].is_read?" readed_message":"")+'"><p style="color:#E83931;">管理员：'+msg_arr[i].admin_name+'　'+msg_arr[i].send_time+'</p><p>'+msg_arr[i].message_content+'</p></div>';
						}else{
							record_html += '<div class="talk_record_list'+(msg_arr[i].is_read?" readed_message":"")+'"><p style="color:#008000;">我　'+msg_arr[i].send_time+'</p><p>'+msg_arr[i].message_content+'</p></div>';
						}
					}
					$("#haitao_talk_show").append(record_html).removeClass('talk_loading');
					if(record_html){
						//添加历史消息提示文字
						$("#haitao_talk_show .readed_message:last").after('<div class="talk_record_list"><div id="record_history_tip">以上是历史消息</div></div>');
					}
					//移动到末尾
					$("#haitao_talk_show").scrollTop($("#haitao_talk_show")[0].scrollHeight);
				}
			}else{
				var error_html = '<div class="talk_record_list"><i class="record_error_ico"></i><div class="record_error_text">'+result_obj.message+'</div></div>';
				$("#haitao_talk_show").append(error_html);
			}
			message_getting = false;
		}else { // something went wrong
			message_getting = false;
		}
	});
	
}

//获取聊天消息
extension.get_message = function(){
	//防止重复提交
	if(message_getting){
		return;
	}else{
		message_getting = true;
	}
	//接收消息主处理
	var details = {
		url: PluginConf.get_interface_file('get_talk_message',{'user_id':user_id}),
		method: 'GET',
		async: true,
		contentType: 'json'
	};
	kango.xhr.send(details, function(data) {
		if (data.status == 200 && data.response != null) {
			var result_obj = data.response;
			var status = result_obj.status;
			if(status==1){
				//将聊天记录加入列表
				var msg_arr = result_obj.attach;
				if(msg_arr){
					var record_html = '';
					for(var i=0,len=msg_arr.length;i<len;i++){
						record_html += '<div class="talk_record_list readed_message"><p style="color:#E83931;">管理员：'+msg_arr[i].admin_name+'　'+msg_arr[i].send_time+'</p><p>'+msg_arr[i].message_content+'</p></div>';
					}
					if(record_html){
						$("#haitao_talk_show").append(record_html);
						//一次限制最多显示20条聊天记录
						var record_list_length = $("#haitao_talk_show .talk_record_list").length;
						if(record_list_length>20){
							var num = record_list_length-20;//获取要隐藏的记录条数
							$("#haitao_talk_show .talk_record_list:lt("+num+")").remove();//隐藏前num条记录
						}
						//移动到末尾
						$("#haitao_talk_show").scrollTop($("#haitao_talk_show")[0].scrollHeight);
					}
				}
			}else{
				var error_html = '<div class="talk_record_list"><i class="record_error_ico"></i><div class="record_error_text">'+result_obj.message+'</div></div>';
				$("#haitao_talk_show").append(error_html);
			}
			message_getting = false;
		}else { // something went wrong
			message_getting = false;
		}
	});
	
}

//发送聊天消息
extension.send_message = function(){
	//防止重复提交
	if(message_sending){
		return;
	}else{
		message_sending = true;
	}
	//发送消息主处理
	var msg_content = $.trim($('#haitao_talk_editor').html());
	if(msg_content==''){
		$('#haitao_talk_editor').focus();
	}else{
		var details = {
			url: PluginConf.get_interface_file('send_talk_message'),
			method: 'POST',
			async: true,
			params: {'user_id':user_id,'msg_content':msg_content},
			contentType: 'json'
		};
		kango.xhr.send(details, function(data) {
			if (data.status == 200 && data.response != null) {
				var result_obj = data.response;
				var status = result_obj.status;
				if(status==1){
					var attach = result_obj.attach;
					var send_time = attach.send_time;
					//将该条聊天记录加入列表
					var record_html = '<div class="talk_record_list"><p style="color:green;">我　'+send_time+'</p><p>'+msg_content+'</p></div>';
					$("#haitao_talk_show").append(record_html);
					//一次限制最多显示20条聊天记录
					var record_list_length = $("#haitao_talk_show .talk_record_list").length;
					if(record_list_length>20){
						var num = record_list_length-20;//获取要隐藏的记录条数
						$("#haitao_talk_show .talk_record_list:lt("+num+")").remove();//隐藏前num条记录
					}

					//隐藏聊天表情列表
					_this.hide_exp_list();
					
					//清空聊天记录输入框
					$("#haitao_talk_editor").empty().focus();

					//将超链接都变为新窗口打开
					$("#haitao_talk_show .talk_record_list:last a").attr("target","_blank");

					//移动到末尾
					$("#haitao_talk_show").scrollTop($("#haitao_talk_show")[0].scrollHeight);
				}else{
					var error_html = '<div class="talk_record_list"><i class="record_error_ico"></i><div class="record_error_text">'+result_obj.message+'</div></div>';
					$("#haitao_talk_show").append(error_html);
				}
				message_sending = false;
			}else { // something went wrong
				message_sending = false;
			}
		});
	}
}

extension.init();