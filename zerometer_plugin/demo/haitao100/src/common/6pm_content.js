// ==UserScript==
// @name 6pm Script
// @namespace 6pm
// @include ^http://www.6pm.com/
// @require jquery.js
// @require config.js
// @require cat.js
// @require area.js
// @require plugin_content.js
// ==/UserScript==



var plugin_content = new PluginContent();
var _this = plugin_content.get_this();

plugin_content.site_id = 2;
plugin_content.site_name = '6PM';

//��ȡ��Ʒ��������Ϣ
plugin_content.get_search_box = function(){
	var search_input = $('#globalSearchField');
	var search_button = $('#search button');
	return [search_input,search_button];
}

//ҳ���ʼ��
plugin_content.content_init = function(){
	//���ز������
	_this.append_plugin();
	
	//��ѡ���ײ�ˢ�¼۸��¼�
	$("#color").change(function(){
		setTimeout(function(){
			_this.price_loaded = false;
			_this.refresh_price();
			_this.refresh_actual_tariff();
			_this.refresh_totle_price();
		},500);
	});
}

//��ȡ��Ʒ����
plugin_content.get_name = function(){
	var productStage = $('#productStage h1');
	if(productStage.length>0){
		goods_name = productStage.html().replace(/<[\/]?[^>]+>/g,'');
	}else{
		goods_name = '';
	}
	return goods_name;
}

//��ȡ��ƷͼƬ
plugin_content.get_img = function(){
	var detailImage = $('#detailImage img');
	if(detailImage.length>0){
		var goods_img = detailImage.attr('src');
	}else{
		var goods_img = '';
	}
	return goods_img;
}

//��ȡ��Ʒ�۸�
plugin_content.get_price = function(){
	var prodPrice = '$0.00';
	var price_obj = $('#priceSlot .price');
	if (price_obj.length>0){
		prodPrice = price_obj.text()
	}
	
	prodPrice = prodPrice.replace(/,/g,'');
	reg = /\$([\d\.]+).*$/gi;
	prodPrice = prodPrice.replace(reg,"\$1");
	prodPrice = prodPrice*_this.exchange_rate;
	return prodPrice;
}

//��ȡ��Ʒ����
plugin_content.get_weight = function(){
	var prodWeight1 = $('#prdInfoText li:contains("Weight"):last');
	
	var prodWeight = 0;
	if (prodWeight1.length>0){
		var prodText = prodWeight1.text().replace(/\s/g,'').replace('Weight:','');
		var lbArr = prodText.match(/(\d+)lb/);
		if(lbArr && typeof(lbArr[1])!='undefined'){
			prodWeight += parseFloat(lbArr[1]);
		}
		var ozArr = prodText.match(/(\d+)oz/);
		if(ozArr && typeof(ozArr[1])!='undefined'){
			prodWeight += parseFloat(ozArr[1]/16);
		}
	}else{
		prodWeight = 0.01;//Ĭ��0.01��
	}
	return prodWeight;
}
plugin_content.init();