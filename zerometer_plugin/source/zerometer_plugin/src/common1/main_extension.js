function MainExtension(){
	alert("XXX");
	var _this = this;
	
	var currentIndex = 0;//���׺�������
	var lastCurrentIndex = 0;//���׺�������
	
	//��ȡ�������
	this.get_this = function(){return _this;}
	
	//�����ʼ������
	this.init = function(){
		KangoAPI.onReady(function(){
			//ҳ���ʼ��
			_this.content_init();
			
			//���¼�
			_this.bind_event();
		});
	}
	
	//ҳ���ʼ��
	this.content_init = function(){
		//���ò�����
		$('#plugin').css('width',(window.screen.width - 15) + 'px');
	}
	
	//���¼�
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
	����¼�����
	**/
	this.clickEventListener = function(element){
		var elementId = $(element).attr("id");
		if(elementId){
			lastCurrentIndex = currentIndex;
			currentIndex = elementId - PluginConf.base_li_index;
		}
		
		//��Ⱦ���
		pluginRender(currentIndex);
	}
	
	/**
	��Ⱦ�����ҳ��
	**/
	this.pluginRender = function(currentIndex){
		/**
			currentIndexΪ0��
				���׺�������ҳ��
			currentIndexΪ1��
				���ﳵҳ��
			currentIndexΪ2��
				�ҵĶ���ҳ��
			currentIndexΪ3��
				�ҵ��ղ�ҳ��
			currentIndexΪ4��
				�Ż��Ƽ�ҳ��
			currentIndexΪ5��
				��������ҳ��
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
			else{//�������
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
			else{//�������
				rightUl.css("right","0%");
				content.css("width","91%");
				horDiv.css("display","block");//��ʾhor
			}
			
			content.css("borderTop", boderTopStyle);
			content.css("left",1.8*currentIndex + "%");
		}
		
		//��Ⱦcontent����
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
	
	//����currentIndex��Ⱦcontent����
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
	
	//��ȡ�ַ���
	this.sub_str = function(str,length){
		var str_length = str.length;
		if(str_length>length){
			return str.substr(0,length)+'..';
		}else{
			return str;
		}
	}
	
	//��ȡurl����
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