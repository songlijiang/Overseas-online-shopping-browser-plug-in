function PopupExtension(){
	var _this = this;
	
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
	}
	
	//���¼�
	this.bind_event = function(){
		
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