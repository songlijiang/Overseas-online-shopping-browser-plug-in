// ==UserScript==
// @name saksfifthavenue Script
// @namespace saksfifthavenue
// @include ^http://www.saksfifthavenue.com/
// @require jquery.js
// @require config.js
// @require cat.js
// @require area.js
// @require plugin_content.js
// ==/UserScript==



var plugin_content = new PluginContent();
var _this = plugin_content.get_this();

plugin_content.site_id = 10;
plugin_content.site_name = '第五大道';
plugin_content.direct_mail_china = true;

//获取商品搜索框信息
plugin_content.get_search_box = function(){
	var search_input = $('#site-search .ui-autocomplete-input');
	var search_button = $('#site-search .search-box button');
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
	var productTitle = $('#saksBody .short-description');
	if(productTitle.length>0){
		goods_name = productTitle.text();
	}else{
		goods_name = '';
	}
	return goods_name;
}

//获取商品图片
plugin_content.get_img = function(){
	var productImage = $('.js-product-image');
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
	var productprice = $('#saksBody .price .value');
	if(productprice.length>0){
		priceText = productprice.text()
	}
	
	priceText = priceText.replace(/,/g,'');
	var match_arr = priceText.match(/\$\s?(\d+(\.\d+)?)/);
	if(match_arr && typeof(match_arr[1])!="undefined"){
		prodPrice = match_arr[1]*_this.exchange_rate;
	}
	var match_arr = priceText.match(/\CNY\s?(\d+(\.\d+)?)/);
	if(match_arr && typeof(match_arr[1])!="undefined"){
		prodPrice = match_arr[1];
	}
	return prodPrice;
}

//获取商品重量
plugin_content.get_weight = function(){
	var prodWeight = _this.default_weight;
	var gray13 = $('#mainContent .gray13 li:contains("Shipping Weight")');
	if (gray13.length>0){
		var weightText = gray13.text().replace(/<[^>]+>[^<]+<\/[^>]+>/,'');
		var match_arr = weightText.match(/(\d+(\.\d+)?)\sLbs/i);
		if(match_arr && typeof(match_arr[1])!="undefined"){
			prodWeight = match_arr[1];
		}
	}
	return prodWeight;
}
plugin_content.init();