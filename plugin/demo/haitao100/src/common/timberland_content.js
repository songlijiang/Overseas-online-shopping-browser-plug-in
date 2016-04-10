// ==UserScript==
// @name timberland Script
// @namespace timberland
// @include ^http://shop.timberland.com/
// @require jquery.js
// @require config.js
// @require cat.js
// @require area.js
// @require plugin_content.js
// ==/UserScript==



var plugin_content = new PluginContent();
var _this = plugin_content.get_this();

plugin_content.site_id = 9;
plugin_content.site_name = 'timberland';

//获取商品搜索框信息
plugin_content.get_search_box = function(){
	var search_input = $('#id-header-search');
	var search_button = $('#header-search .header-search');
	return [search_input,search_button];
}

//页面初始化
plugin_content.content_init = function(){
	//加载插件内容
	_this.append_plugin();
}

//获取商品名称
plugin_content.get_name = function(){
	var goods_name = '';
	var productTitle = $('#product-info-wrapper .product-title');
	if(productTitle.length>0){
		goods_name = productTitle.text();
	}else{
		goods_name = '';
	}
	return goods_name;
}

//获取商品图片
plugin_content.get_img = function(){
	var productImage = $('#product-image-main');
	if(productImage.length>0){
		var goods_img = productImage.attr('src');
	}else{
		var goods_img = '';
	}
	return goods_img;
}

//获取商品价格
plugin_content.get_price = function(){
	var prodPrice = '$0.00';
	var priceText;
	var productprice = $('#money .wasprice');
	if(productprice.length>0){
		priceText = productprice.text()
	}
	
	priceText = priceText.replace(/,/g,'');
	var match_arr = priceText.match(/\$(\d+(\.\d+)?)/);
	if(match_arr && typeof(match_arr[1])!="undefined"){
		prodPrice = match_arr[1]*_this.exchange_rate;
	}
	return prodPrice;
}

//获取商品重量
plugin_content.get_weight = function(){
	var prodWeight = _this.default_weight;
	return prodWeight;
}
plugin_content.init();