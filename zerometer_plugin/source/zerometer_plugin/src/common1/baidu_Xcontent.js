function localStartX(){
var plugin_content = new PluginContent();
var _this = plugin_content.get_this();

plugin_content.site_id = 46;
plugin_content.site_name = 'baidu';
plugin_content.direct_mail_china = true;

//��ȡ��Ʒ��������Ϣ
plugin_content.get_search_box = function(){
	var search_input = $('#kw');
	var search_button = $('#su');
	return [search_input,search_button];
}

//ҳ���ʼ��
plugin_content.content_init = function(){
	//���ز������
	alert("init baidu.com");
	_this.append_plugin();
	
	//��Ӷ�ʱ����ʱ����idΪpage-content��div����
	
}

//��ȡ��Ʒ����
plugin_content.get_name = function(){
	var goods_name = '';
	goods_name="name";
	return goods_name;
}

//��ȡ��ƷͼƬ
plugin_content.get_img = function(){
	
		var goods_img = "sdsd.jpg";
	
	return goods_img;
}

//��ȡ��Ʒ�۸�
plugin_content.get_price = function(){
	prodWeight =_this.default_weight;
	return prodWeight;
}



//��ȡ��Ʒ����
plugin_content.get_weight = function(){
	var prodWeight = _this.default_weight;
	return prodWeight;
}
setTimeout(function(){
	plugin_content.init();
},5000);
}