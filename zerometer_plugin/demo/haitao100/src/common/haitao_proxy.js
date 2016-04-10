var extension = new PopupExtension();
var _this = extension.get_this();
var web_proxy = false;

//页面初始化
extension.content_init = function(){
	_this.get_proxy_site_list();
}

//绑定事件
extension.bind_event = function(){
	//全选反选
	$('#proxy_check_all').live('click',function(){
		$('#proxy_site_table .proxy_site_id').attr('checked',$(this).is(':checked'));
	});
	//新标签页打开海淘网站
	$("#proxy_site_table a").live('click',function(){
		var tab_url = $(this).attr('tab_url');
		if(tab_url){
			kango.browser.tabs.create({url: tab_url});
			KangoAPI.closeWindow();
		}
		return false;
	});
	//确定修改设置
	$('#proxy_setting_ok').click(function(){
		var proxy_site_obj = {};
		$('#proxy_site_table .proxy_site_id:checked').each(function(){
			var site_id = $(this).val();
			var site_domin = $(this).attr('site_domin');
			proxy_site_obj[site_id] = site_domin;
		});
		kango.invokeAsync('kango.storage.setItem', 'proxy_site_obj', proxy_site_obj,function(){
			var browserName = kango.browser.getName();
			if(browserName=='chrome'){
				chrome.proxy.settings.get(
					{'incognito': false},
					function(config){
						var proxy_state = config.levelOfControl;
						if(proxy_state=='controlled_by_this_extension'){
							var web_proxy = new WebProxy();
							web_proxy.set_proxy(function(){
								location.href = 'haitao_web.html';
							});
						}else{
							location.href = 'haitao_web.html';
						}
					}
				);
			}else{
				location.href = 'haitao_web.html';
			}
		});
	});
}

//获取可以代理的网站列表
extension.get_proxy_site_list = function(){
	var details = {
		url: PluginConf.get_interface_file('get_proxy_site_list'),
		method: 'GET',
		async: true,
		contentType: 'json'
	};
	kango.xhr.send(details, function(data) {
		if (data.status == 200 && data.response != null) {
			var result_obj = data.response;
			//kango.console.log(JSON.stringify(result_obj));
			var site_arr = result_obj.attach;
			var site_length = site_arr.length;
			if(site_length==0){
				var site_list = '<div class="popup_window_tip"><span>暂无支持代理的网站！</span></div>';
				$('#popup_content_padding').append(site_list).find('.popup_window_tip').show();
			}else{
				var site_list = '<table id="proxy_site_table">'+
									'<tr>'+
										'<th width="15%" style="text-align:left;"><label><input id="proxy_check_all" type="checkbox"/>全选</label></th>'+
										'<th width="25%">网站标题</th>'+
										'<th width="30%">网站主页</th>'+
										'<th width="30%">代理域名</th>'+
									'</tr>';
				for(var i=0;i<site_length;i++){
					var site_domin = site_arr[i].site_domin;
					var domin_arr = site_domin.split(',');
					var domin_html = '';
					for(var j=0;j<domin_arr.length;j++){
						domin_html += '<p>'+domin_arr[j]+'</p>';
					}
					site_list += '<tr>'+
									'<td><input class="proxy_site_id" type="checkbox" name="proxy_site_id" value="'+site_arr[i].site_id+'" site_domin='+site_domin+'/></td>'+
									'<td><a tab_url="'+site_arr[i].site_url+'">'+site_arr[i].site_name+'</a></td>'+
									'<td>'+site_arr[i].site_url+'</td>'+
									'<td>'+domin_html+'</td>'+
								'</tr>';
				}
				site_list += '</table>';
				$('#popup_content_padding').append(site_list);
				$('#proxy_setting_bar').show();
			}
		}else { // something went wrong
			var error_html = '<div class="popup_error_tip"><i></i><span>获取代理网站列表失败！</span></div>';
			$('#popup_content_padding').empty().append(message_list);
		}
		$('#popup_content_main').removeClass('window_loading');
		_this.set_proxy_checked();
	});
}

//自动选择已经选择的代理
extension.set_proxy_checked = function(){
	kango.invokeAsync('kango.storage.getItem', 'proxy_site_obj', function(proxy_site_obj){
		if(typeof(proxy_site_obj)!='undefined'){
			$('#proxy_site_table .proxy_site_id').each(function(){
				var site_id = $(this).val();
				if(proxy_site_obj.hasOwnProperty(site_id)){
					$(this).attr('checked',true);
				}
			});
		}
	});
}
extension.init();