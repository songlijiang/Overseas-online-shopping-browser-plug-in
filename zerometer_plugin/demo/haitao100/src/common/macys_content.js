// ==UserScript==
// @name macys Script
// @namespace macys
// @include ^http://www.macys.com/
// @include ^http://www1.macys.com/
// @require jquery.js
// @require config.js
// @require cat.js
// @require area.js
// @require plugin_content.js
// ==/UserScript==



var plugin_content = new PluginContent();
var _this = plugin_content.get_this();

plugin_content.site_id = 3;
plugin_content.site_name = 'macys';
plugin_content.direct_mail_china = true;

//获取商品搜索框信息
plugin_content.get_search_box = function(){
	var search_input = $('#globalSearchInputField');
	var search_button = $('#subnavSearchSubmit');
	return [search_input,search_button];
}

//页面初始化
plugin_content.content_init = function(){
	//加载插件内容
	_this.append_plugin();
}

//获取商品名称
plugin_content.get_name = function(){
	var productTitle = $('#productTitle');
	if(productTitle.length>0){
		goods_name = productTitle.text();
	}else{
		goods_name = '';
	}
	return goods_name;
}

//获取商品图片
plugin_content.get_img = function(){
	var mainView_1 = $('#mainView_1');
	if(mainView_1.length>0){
		var goods_img = mainView_1.attr('src');
	}else{
		var goods_img = '';
	}
	return goods_img;
}

//获取商品价格
plugin_content.get_price = function(){
	var prodPrice = '$0.00';
	var price_obj = $('#priceInfo .priceSale');
	var priceInfo = $('#priceInfo .standardProdPricingGroup span');
	if (price_obj.length>0){
		prodPrice = price_obj.text()
	}else if(priceInfo.length>0){
		prodPrice = priceInfo.text()
	}
	prodPrice = prodPrice.replace(/,/g,'');
	prodPrice = prodPrice.replace(/(Sale|Now)\s?/,'');
	if(/^\$\d+(\.\d+)?/.test(prodPrice)){
		prodPrice = prodPrice.replace(/^\$/,'')
		prodPrice = prodPrice*_this.exchange_rate;
		return prodPrice;
	}else if(/^CNY\s?\d+(\.\d+)?/i.test(prodPrice)){
		return prodPrice.replace(/^CNY\s?/i,'');
	}else{
		return 0;
	}
}

//获取商品重量
plugin_content.get_weight = function(){
	var prodWeight = _this.default_weight;
	return prodWeight;
}
plugin_content.init();