var extension = new PopupExtension();
var _this = extension.get_this();

//页面初始化
extension.content_init = function(){
	_this.get_switch_state();
}

//绑定事件
extension.bind_event = function(){
	//切换开关状态
	$('#popup_content_main .switch_a').click(function(){
		var this_id = this.id;
		var state = $(this).attr('state');
		if(state=='on'){
			var after_state = 'off';
			$(this).attr('state',after_state);
			$(this).addClass('switch_off');
		}else{
			var after_state = 'on';
			$(this).attr('state',after_state);
			$(this).removeClass('switch_off');
		}
		kango.invokeAsync('kango.storage.setItem', this_id, after_state);
	});
}

//获取插件开关状态
extension.get_switch_state = function(){
	kango.invokeAsync('kango.storage.getItem', 'plugin_switch', function(data){
		if(data=='off'){
			var plugin_switch = 'off';
		}else{
			var plugin_switch = 'on';
		}
		$('#plugin_switch').attr('state',plugin_switch);
		if(plugin_switch=='off'){
			$('#plugin_switch').addClass('switch_off');
		}
	});
	kango.invokeAsync('kango.storage.getItem', 'translate_switch', function(data){
		if(data=='off'){
			var translate_switch = 'off';
		}else{
			var translate_switch = 'on';
		}
		$('#translate_switch').attr('state',translate_switch);
		if(translate_switch=='off'){
			$('#translate_switch').addClass('switch_off');
		}
	});
}

extension.init();