// ==UserScript==
// @name diapers Script
// @namespace diapers
// @include ^http://www.diapers.com/
// @all-frames true
// @require jquery.js
// @require config.js
// @require cat.js
// @require area.js
// @require plugin_content.js
// ==/UserScript==


var plugin_content = new PluginContent();
var _this = plugin_content.get_this();

plugin_content.site_id = 12;
plugin_content.site_name = 'diapers';
plugin_content.direct_mail_china = true;

//��ȡ��Ʒ��������Ϣ
plugin_content.get_search_box = function(){
	var search_input = $('#searchInput');
	var search_button = $('#searchImageButton');
	return [search_input,search_button];
}

//ҳ���ʼ��
plugin_content.content_init = function(){
	//���ز������?
	_this.append_plugin();
}

//��ȡ��Ʒ����

plugin_content.get_name = function(){
	var goods_name = '';
	var itemTitle = $('.productTitle h1');
	if(itemTitle.length>0){
		itemTitle.each(function(){
			goods_name += $(this).text();
		});
	}else{
		goods_name = '';
	}
	return goods_name;
}

//��ȡ��ƷͼƬ
plugin_content.get_img = function(){
	var icImg = $('#pdpMainImageImg');
	if(icImg.length>0){
		var goods_img = icImg.attr('src');
	}else{
		var goods_img = '';
	}
	return goods_img;
}

//��ȡ��Ʒ�۸�

plugin_content.get_price = function(){
	var prodPrice = '$0.00';
	var prcIsum = $('#priceDivClass .singlePrice');
	if (prcIsum.length>0){
		prodPrice = prcIsum.text();
	}
	prodPrice = $.trim(prodPrice);
	prodPrice = prodPrice.replace(/,/g,'');
	var match_arr = prodPrice.match(/\$\s?(\d+(:?\.\d+)?)/);
	
	if(match_arr && typeof(match_arr[1]!='undefined')){
		prodWeight = match_arr[1]*_this.exchange_rate;
	}
	return prodWeight;
}



//��ȡ��Ʒ����
plugin_content.get_weight = function(){
	var prodWeight = _this.default_weight;
	return prodWeight;
}
plugin_content.init();