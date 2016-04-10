var extension = new PopupExtension();
var _this = extension.get_this();
var web_proxy = false;

//页面初始化
extension.content_init = function(){
	_this.get_site_class();
	_this.get_site_list();
	_this.get_proxy_info();
}

//绑定事件
extension.bind_event = function(){
	//新标签页打开海淘网站
	$("#popup_content_main .haitao_web_a").live('click',function(){
		var tab_url = $(this).attr('tab_url');
		if(tab_url){
			kango.browser.tabs.create({url: tab_url});
			KangoAPI.closeWindow();
		}
		return false;
	}).live('mouseenter',function(){
		var window_height = $(document).height();
		kango.console.log(window_height);
		var haitao_web_info = $(this).find('.haitao_web_info').css({'top':'100%'}).show();
		var info_top = parseInt(haitao_web_info.offset().top);
		var info_bottom = info_top + parseInt(haitao_web_info.outerHeight());
		if(info_bottom>window_height){
			haitao_web_info.removeClass('before_ico').addClass('after_ico').css({'top':'-70px'});
		}else{
			haitao_web_info.addClass('before_ico').removeClass('after_ico').css({'top':'100%'});
		}
	}).live('mouseleave',function(){
		$(this).find('.haitao_web_info').hide();
	});
	//点击显示代理设置
	$('#proxy_ico').click(function(){
		$(this).fadeOut();
		$('#proxy_bar').stop().animate({'top':'0px'},500);
	});
	//鼠标划出隐藏代理设置
	$('#proxy_bar').mouseleave(function(){
		$(this).stop().animate({'top':'-35px'},500,function(){
			$('#proxy_ico').fadeIn();
		});
	});
	//海淘网站分类筛选
	$('#site_class_bar li').live('click',function(){
		$('#site_class_bar li').removeClass('current_site_class');
		$(this).addClass('current_site_class');
		var class_id = $(this).attr('class_id');
		$('#popup_content_main').addClass('window_loading');
		_this.get_site_list(class_id);
	});
	//点击显示网站分类
	$('#site_class_ico').click(function(){
		$(this).fadeOut();
		$('#site_class_bar').stop().animate({'left':'0px'},500);
	});
	//鼠标划出隐藏网站分类
	$('#site_class_bar').mouseleave(function(){
		$(this).stop().animate({'left':'-84px'},500,function(){
			$('#site_class_ico').fadeIn();
		});
	});
	//开始停止代理
	$('#proxy_button').click(function(){
		var this_class = $(this).attr('class');
		if(this_class=='proxy_controllable'){
			if(!web_proxy){
				web_proxy = new WebProxy();
			}
			web_proxy.set_proxy();
			$(this).attr('class','proxy_controlled').text('停止代理');
		}else if(this_class=='proxy_controlled'){
			if(!web_proxy){
				web_proxy = new WebProxy();
			}
			web_proxy.clear_proxy();
			$(this).attr('class','proxy_controllable').text('开始代理');
		}
	});
}

//获取海淘网站分类
extension.get_site_class = function(){
	var details = {
		url: PluginConf.get_interface_file('get_site_class'),
		method: 'GET',
		async: true,
		contentType: 'json'
	};
	kango.xhr.send(details, function(data) {
		if (data.status == 200 && data.response != null) {
			var result_obj = data.response;
			var class_arr = result_obj.attach;
			var class_length = class_arr.length;
			var class_html = '';
			for(var i=0;i<class_length;i++){
				class_html += '<li class_id="'+class_arr[i].class_id+'">'+class_arr[i].class_name+'</li>';
			}
			$('#site_class_bar').append(class_html);
		}
		$('#site_class_ico').fadeIn();
	});
}

//获取插件支持的网站列表
extension.get_site_list = function(class_id){
	if(typeof(class_id)=='undefined'){
		class_id = 0;
	}
	var details = {
		url: PluginConf.get_interface_file('get_site_list',{'class_id':class_id}),
		method: 'GET',
		async: true,
		contentType: 'json'
	};
	kango.xhr.send(details, function(data) {
		if (data.status == 200 && data.response != null) {
			var result_obj = data.response;
			var site_arr = result_obj.attach;
			var site_length = site_arr.length;
			var web_list = '<div class="popup_window_tip"><span>暂无支持的网站！</span></div>';
			for(var i=0;i<site_length;i++){
				web_list += '<div class="haitao_web_list">'+
								'<a class="haitao_web_a" tab_url="'+site_arr[i].site_url+'">'+
									'<img src="'+PluginConf.source_url+site_arr[i].site_logo+'"/>'+
									'<span>'+site_arr[i].site_name+'</span>';
				if(site_arr[i].is_support==1){
					web_list +=		'<i class="haitao_support_ico"></i>';
				}
				web_list +=			'<div class="haitao_web_info">'+
										'<p>国内信用卡:'+(site_arr[i].credit_card_support==1?'<span style="color:#63D700;">支持</span>':'<span style="color:#FA793E;">不支持</span>')+'</p>'+
										'<p>直邮中国:'+(site_arr[i].direct_mail_support==1?'<span style="color:#63D700;">支持</span>':'<span style="color:#FA793E;">不支持</span>')+'</p>'+
									'</div>'+
								'</a>'+
							'</div>';
			}
			$('#popup_content_padding').empty().append(web_list);
			if(site_length==0){
				$('#popup_content_padding .popup_window_tip').show();
			}
		}else { // something went wrong
			var error_html = '<div class="popup_error_tip"><i></i><span>获取海淘网站列表失败！</span></div>';
			$('#popup_content_padding').empty().append(message_list);
		}
		$('#popup_content_main').removeClass('window_loading');
		$('#proxy_ico').fadeIn();
	});
}

//获取当前代理情况
extension.get_proxy_info = function(){
	var browserName = kango.browser.getName();
	if(browserName=='chrome'){
		chrome.proxy.settings.get(
			{'incognito': false},
			function(config){
				/*
				not_controllable: cannot be controlled by any extension
				controlled_by_other_extensions: controlled by extensions with higher precedence
				controllable_by_this_extension: can be controlled by this extension
				controlled_by_this_extension: controlled by this extension
				*/
				//kango.console.log(JSON.stringify(config));
				var proxy_state = config.levelOfControl;
				if(proxy_state=='controllable_by_this_extension'){
					$('#proxy_button').attr('class','proxy_controllable').text('开始代理');
				}else if(proxy_state=='controlled_by_this_extension'){
					$('#proxy_button').attr('class','proxy_controlled').text('停止代理');
				}else if(proxy_state=='not_controllable'){
					$('#proxy_button').attr('class','proxy_disabled').text('代理功能不可用，请检查您的浏览器设置！');
				}else if(proxy_state=='controlled_by_other_extensions'){
					$('#proxy_button').attr('class','proxy_disabled').text('其他代理代理类的插件冲突！');
				}
			}
		);
	}else{
		$('#proxy_button').attr('class','proxy_disabled').text('功能开发中，请使用谷歌浏览器体验！');
	}
}
extension.init();