/*
*我的海淘插件通用类
*/

function PluginMy(){
	var _this = this;
	this.user_id = 0;//用户id
	
	//获取自身对象
	this.get_this = function(){return _this;}
	
	//插件初始化
	this.init = function(){
		//加载插件css文件
		var css_obj = $('<link rel="stylesheet" type="text/css" href="'+PluginConf.css_file+'" />');
		css_obj.bind('load',function(){
			//获取用户id
			kango.invokeAsync('kango.storage.getItem', 'user_id', function(user_id) {
				_this.user_id = user_id;
				
				//页面初始化
				_this.content_init();
				
				//绑定事件
				_this.bind_event();
			});
		}).appendTo($('head'));
	}
	
	//不同网页的初始化方法
	this.content_init = function(){}
	
	//绑定事件
	this.bind_event = function(){}
	
	//截取字符串
	this.sub_str = function(str,length){
		var str_length = str.length;
		if(str_length>length){
			return str.substr(0,length)+'..';
		}else{
			return str;
		}
	}
	
	//获取时间字符串中的日期
	this.get_date = function(time_str){
		var time_arr = time_str.split(' ');
		return time_arr[0];
	}
}