function MainExtension(){
	alert("XXX");
	var _this = this;
	
	var currentIndex = 0;//零米海淘助手
	var lastCurrentIndex = 0;//零米海淘助手
	
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
		//设置插件宽度
		$('#plugin').css('width',(window.screen.width - 15) + 'px');
	}
	
	//绑定事件
	this.bind_event = function(){
		var pluginLis = $("#plugin #right li");
		if(pluginLis){
			pluginLis.each(function(index,element){
				$(element).click(function(){
					clickEventListener(element);
				}); 
			});
		}
		pluginLis = $("#plugin #left li");
		if(pluginLis){
			pluginLis.each(function(index,element){
				$(element).click(function(){
					clickEventListener(element);
				}); 
			});
		}
	}
	
	/**
	点击事件处理
	**/
	this.clickEventListener = function(element){
		var elementId = $(element).attr("id");
		if(elementId){
			lastCurrentIndex = currentIndex;
			currentIndex = elementId - PluginConf.base_li_index;
		}
		
		//渲染插件
		pluginRender(currentIndex);
	}
	
	/**
	渲染插件主页面
	**/
	this.pluginRender = function(currentIndex){
		/**
			currentIndex为0：
				零米海淘助手页面
			currentIndex为1：
				购物车页面
			currentIndex为2：
				我的订单页面
			currentIndex为3：
				我的收藏页面
			currentIndex为4：
				优惠推荐页面
			currentIndex为5：
				个人中心页面
		**/
		var leftUl = $("#left");
		var leftLis = $("#left li");
		var rightUl = $("#right");
		var rightLis = $("#right li");
		var horDiv = $("#hor");
		var content = $("#content");
		var boderTopStyle = '3px solid '+getBorderColor(currentIndex);
		
		if(currentIndex >= lastCurrentIndex){
			var tagetEle;
			for(var i=lastCurrentIndex;i<currentIndex;i++){
				tagetEle = $("#1000" + i);
				leftUl.append(tagetEle);
			}
			
			leftUl.css("display","block");
			leftUl.css("width",1.8*currentIndex + "%");
			leftLis = $("#left li");
			leftLis.each(function(){$(this).css("width",100/currentIndex+"%")});
			
			rightUl.css("right","-"+(currentIndex-1)*1.8 +"%");
			
			horDiv.css("display","none");
			content.css("borderTop", boderTopStyle);
			content.css("left",1.8*currentIndex + "%");
			content.css("width","90.2%");
		}
		else{
			var tagetEle;
			if(currentIndex != 0){
				for(var i=lastCurrentIndex;i>currentIndex;i--){
					tagetEle = $("#1000" + (i-1));
					rightUl.prepend(tagetEle);
				}
			}
			else{//特殊情况
				if(horDiv.css("display") == "block"){
					return;
				}
				for(var i=lastCurrentIndex;i>1;i--){
					tagetEle = $("#1000" + (i-1));
					rightUl.prepend(tagetEle);
				}
			}
			
			leftUl.css("display","block");
			leftUl.css("width",1.8*currentIndex + "%");
			leftLis = $("#left li");
			leftLis.each(function(){$(this).css("width",100/currentIndex+"%")});
			
			//rightUl.css("width",1.8*(6-currentIndex) + "%");
			rightLis = $("#right li");
			rightLis.each(function(){$(this).css("width",100/5/*(6-currentIndex)*/+"%")});
			
			if(currentIndex != 0){
				rightUl.css("right","-"+(currentIndex-1)*1.8 +"%");
				content.css("width","90.2%");
				horDiv.css("display","none");
			}
			else{//特殊情况
				rightUl.css("right","0%");
				content.css("width","91%");
				horDiv.css("display","block");//显示hor
			}
			
			content.css("borderTop", boderTopStyle);
			content.css("left",1.8*currentIndex + "%");
		}
		
		//渲染content内容
		contentRendering(currentIndex);
	}
	
	this.getBorderColor = function(currentIndex){
		switch(currentIndex){
			case 0:
				return 'rgb(240,73,67)';
			case 1:
				return 'rgb(56,124,190)';
			case 2:
				return 'rgb(252,125,90)';
			case 3:
				return 'rgb(143,68,173)';
			case 4:
				return 'rgb(248,62,155)';
			case 5:
				return 'rgb(0,153,126)';
		}	
	}
	
	//根据currentIndex渲染content内容
	this.contentRendering = function(currentIndex){
		var contentIframe = $("#content #contentIframe");
		//alert(currentIndex);
		switch(currentIndex){
			case 0:
				contentIframe.attr('src','haitaoAssistant.html');
				break;
			case 1:
				contentIframe.attr('src','');
				break;
			case 2:
				contentIframe.attr('src','');
				break;
			case 3:
				contentIframe.attr('src','');
				break;
			case 4:
				contentIframe.attr('src','');
				break;
			case 5:
				contentIframe.attr('src','');
				break;
		}	
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

 //var mainExtension = new MainExtension();
 //mainExtension.init();