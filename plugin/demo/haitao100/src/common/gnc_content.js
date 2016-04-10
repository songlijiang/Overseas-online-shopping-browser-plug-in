// ==UserScript==
// @name gnc Script
// @namespace gnc
// @include ^http://www.gnc.com/
// @require jquery.js
// @require config.js
// @require cat.js
// @require area.js
// @require plugin_content.js
// ==/UserScript==


var plugin_content = new PluginContent();
var _this = plugin_content.get_this();

plugin_content.site_id = 4;
plugin_content.site_name = 'GNC';
plugin_content.direct_mail_china = true;

//��ȡ��Ʒ��������Ϣ
plugin_content.get_search_box = function(){
	var search_input = $('#search-box');
	var search_button = $('#searchButton');
	return [search_input,search_button];
}

//ҳ���ʼ��
plugin_content.content_init = function(){
	//���ز������
	_this.append_plugin();
}

//��ȡ��Ʒ����
plugin_content.get_name = function(){
	var goods_name = '';
	var product_title = $('#product-title h2');
	if(product_title.length>0){
		goods_name = product_title.text();
	}else{
		goods_name = '';
	}
	return goods_name;
}

//��ȡ��ƷͼƬ
plugin_content.get_img = function(){
	var product_images = $('#product-images .main-image-wrap img');
	if(product_images.length>0){
		var goods_img = product_images.attr('src');
	}else{
		var goods_img = '';
	}
	return goods_img;
}

//��ȡ��Ʒ�۸�
plugin_content.get_price = function(){
	var prodPrice = '$0.00';
	var product_info1 = $('#product-info .product-price .now');
	var product_info2 = $('#product-info .product-price p');
	if (product_info1.length>0){
		prodPrice = product_info1.text()
	}else if(product_info2.length>0){
		prodPrice = product_info2.text();
	}
	prodPrice = prodPrice.replace(/,/g,'');
	prodPrice = prodPrice.replace(/(Sale\s)?Price:\s/i,'');
	prodPrice = prodPrice.replace(/^\$/,'');
	prodPrice = prodPrice*_this.exchange_rate;
	return prodPrice;
}

//��ȡ��Ʒ����
plugin_content.get_weight = function(){
	var prodWeight = 0.01;//Ĭ��0.01��
	return prodWeight;
}
plugin_content.init();