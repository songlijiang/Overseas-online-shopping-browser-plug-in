// ==UserScript==
// @name iherb Script
// @namespace iherb
// @include ^http://www.iherb.com/
// @require jquery.js
// @require config.js
// @require cat.js
// @require area.js
// @require plugin_content.js
// ==/UserScript==



var plugin_content = new PluginContent();
var _this = plugin_content.get_this();

plugin_content.site_id = 11;
plugin_content.site_name = 'iherb';
plugin_content.direct_mail_china = true;

//获取商品搜索框信息
plugin_content.get_search_box = function(){
	var search_input = $('#txtSearch');
	var search_button = $('#searchBtn');
	return [search_input,search_button];
}

//页面初始化
plugin_content.content_init = function(){
	//加载插件内容
	_this.append_plugin();
}

//获取商品名称
plugin_content.get_name = function(){
	var productTitle = $('#mainContent .rightColWrap h1');
	var product_specification = $('#product-specification h1');
	if(productTitle.length>0){
		goods_name = productTitle.text();
	}else if(product_specification.length>0){
		goods_name = product_specification.text();
	}else{
		goods_name = '';
	}
	return goods_name;
}

//获取商品图片
plugin_content.get_img = function(){
	var productImage = $('#yamaha .MagicZoomStatic');
	var iherb_product_image = $('#iherb-product-image');
	if(productImage.length>0){
		var goods_img = productImage.attr('src');
	}else if(iherb_product_image.length>0){
		var goods_img = iherb_product_image.attr('src');
	}else{
		var goods_img = '';
	}
	return goods_img;
}

//获取商品价格
plugin_content.get_price = function(){
	var prodPrice = '$0.00';
	var priceText;
	var productprice = $('#mainContent .rightColWrap .black20b');
	var product_price = $('#product-price .our-price');
	if(productprice.length>0){
		priceText = productprice.text()
	}else if(product_price.length>0){
		priceText = product_price.text()
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
	var gray13 = $('#mainContent .gray13 li:contains("Shipping Weight")');
	var popup_container = $('#product-specs-list .popup-container:contains("Shipping Weight")');
	if (gray13.length>0){
		var weightText = gray13.text().replace(/<[^>]+>[^<]+<\/[^>]+>/,'');
	}else if(popup_container.length>0){
		var weightText = popup_container.html().replace(/<[^>]+>[^<]+<\/[^>]+>/,'');
	}
	
	var match_arr = weightText.match(/(\d+(\.\d+)?)\s?Lbs/i);
	if(match_arr && typeof(match_arr[1])!="undefined"){
		prodWeight = match_arr[1];
	}
	return prodWeight;
}
plugin_content.init();