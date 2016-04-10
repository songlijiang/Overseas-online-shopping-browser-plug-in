var extension = new PopupExtension();
var _this = extension.get_this();
var exp_timer,user_id;
var message_getting = false;//是否正在接收消息的标记，防止重复提交
var message_page = 1;//默认显示第一页

//页面初始化
extension.content_init = function(){
	kango.invokeAsync('kango.storage.getItem', 'user_id', function(data) {
		user_id = data;
		//获取分页页数
		_this.get_page();
		//加载聊天消息
		_this.get_talk_history();
	});
}

//绑定事件
extension.bind_event = function(){
	//聊天记录翻页
	$('#talk_page_input').live('keyup',function(event){
		//按回车键的处理
		if(event.keyCode==13){
			var page_val = parseInt($(this).val());
			if(isNaN(page_val)){
				page_val = 1;
			}
			location.href = '?page='+page_val;
		}
	});
}

//载入页面时获取聊天消息历史记录
extension.get_talk_history = function(){
	//防止重复提交
	if(message_getting){
		return;
	}else{
		message_getting = true;
	}
	//接收消息主处理
	var details = {
		url: PluginConf.get_interface_file('get_talk_history',{'user_id':user_id,'page':message_page}),
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
						//添加消息日期分割线
						if(i==len-1){
							record_html += '<div class="talk_record_list"><div id="record_history_tip"><font class="talk_history_date">'+_this.get_date(msg_arr[i].send_time)+'</font></div></div>';
						}
						if(msg_arr[i].admin_name){
							record_html += '<div class="talk_record_list"><p style="color:#E83931;">管理员：'+msg_arr[i].admin_name+'　'+msg_arr[i].send_time+'</p><p>'+msg_arr[i].message_content+'</p></div>';
						}else{
							record_html += '<div class="talk_record_list"><p style="color:#008000;">我　'+msg_arr[i].send_time+'</p><p>'+msg_arr[i].message_content+'</p></div>';
						}
						if(i>0 && _this.get_date(msg_arr[i].send_time)!=_this.get_date(msg_arr[i-1].send_time)){
							record_html += '<div class="talk_record_list"><div id="record_history_tip"><font class="talk_history_date">'+_this.get_date(msg_arr[i-1].send_time)+'</font></div></div>';
						}
					}
					if(record_html){
						$("#talk_history_content").append(record_html).removeClass('talk_loading');
					}
				}
				
				//加载消息分页
				var page_count = result_obj.attach.page_count;
				var page_html = '<a id="first_page" class="page_a'+(message_page<=1?" disabled_page":"")+'" title="首页" href="'+(message_page<=1?"javascript:;":"?page=1")+'"></a>'+
								'<a id="pre_page" class="page_a'+(message_page<=1?" disabled_page":"")+'" title="上一页"  href="'+(message_page<=1?"javascript:;":"?page="+(message_page-1))+'"></a>'+
								'<span>第</span>'+
								'<input id="talk_page_input" type="text" value="'+message_page+'" maxlength="5"/>'+
								'<span>页/<font id="page_count">'+page_count+'</font>页</span>'+
								'<a id="next_page" class="page_a'+(message_page>=page_count?" disabled_page":"")+'" title="下一页"  href="'+(message_page>=page_count?"javascript:;":"?page="+(message_page+1))+'"></a>'+
								'<a id="last_page" class="page_a'+(message_page>=page_count?" disabled_page":"")+'" title="尾页"  href="'+(message_page>=page_count?"javascript:;":"?page="+page_count)+'"></a>';
				$('#talk_history_page').empty().append(page_html);
			}else{
				var error_html = '<div class="talk_record_list"><i class="record_error_ico"></i><div class="record_error_text">'+result_obj.message+'</div></div>';
				$("#talk_history_content").append(error_html);
			}
			message_getting = false;
		}else { // something went wrong
			message_getting = false;
		}
	});
	
}

//获取时间字符串中的日期
extension.get_date = function(time_str){
	var time_arr = time_str.split(" ");
	return time_arr[0];
}

//获取分页页数
extension.get_page = function(){
	var page = _this.get_query('page');
	if(page){
		message_page = parseInt(page);
	}
}

extension.init();