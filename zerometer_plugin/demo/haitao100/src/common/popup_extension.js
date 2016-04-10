function PopupExtension(){
	var _this = this;
	
	//获取自身对象
	this.get_this = function(){return _this;}
	
	//插件初始化方法
	this.init = function(){
		KangoAPI.onReady(function(){
			//页面初始化
			_this.content_init();
			
			//绑定事件
			_this.bind_event();
		});
	}
	
	//页面初始化
	this.content_init = function(){
	}
	
	//绑定事件
	this.bind_event = function(){
		
	}
	
	//截取字符串
	this.sub_str = function(str,length){
		var str_length = str.length;
		if(str_length>length){
			return str.substr(0,length)+'..';
		}else{
			return str;
		}
	}
	
	//获取url参数
	this.get_query = function(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
		var arr = window.location.search.substr(1).match(reg);
		if(arr!=null){
			return unescape(arr[2]);
		}else{
			return null;
		}
    }
}