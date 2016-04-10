// ==UserScript==
// @name rakuten Script
// @namespace rakuten
// @include ^http://www.rakuten.co.jp/
// @include ^http://search.rakuten.co.jp/
// @include ^http://item.rakuten.co.jp/
// @include ^http://sa.item.rakuten.co.jp/
// @require jquery.js
// @require config.js
// @require cat.js
// @require area.js
// @require plugin_content.js
// ==/UserScript==



var plugin_content = new PluginContent();
var _this = plugin_content.get_this();

plugin_content.site_id = 24;
plugin_content.site_name = '日本乐天';
plugin_content.source_lang = 'jp';

//获取商品搜索框信息
plugin_content.get_search_box = function(){
	var search_input = $('#sitem');
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
	var goods_name = '';
	var item_name = $('#pagebody .item_name b');
	var sa_item_name = $('#pagebody .sa_item_name');
	if(item_name.length>0){
		goods_name = item_name.html().replace(/<[\/]?[^>]+>/g,'');
	}else if(sa_item_name.length>0){
		goods_name = sa_item_name.html().replace(/<[\/]?[^>]+>/g,'');
	}else{
		goods_name = '';
	}
	return goods_name;
}

//获取商品图片
plugin_content.get_img = function(){
	var detailImage = $('#detailImage img');
	if(detailImage.length>0){
		var goods_img = detailImage.attr('src');
	}else{
		var goods_img = '';
	}
	return goods_img;
}

//获取商品价格
plugin_content.get_price = function(){
	var prodPrice = '0.00円';
	var price2 = $('#rakutenLimitedId_cart .price2');
	if (price2.length>0){
		prodPrice = price2.text()
	}
	prodPrice = prodPrice.replace(/,/g,'');
	var match_arr = prodPrice.match(/(\d+(\.\d+)?)円/i);
	if(match_arr && typeof(match_arr[1])!="undefined"){
		prodPrice = match_arr[1]*_this.jpy_rate;
	}else{
		prodPrice = 0;
	}
	return prodPrice;
}

//获取商品重量
plugin_content.get_weight = function(){
	var prodWeight = _this.default_weight;
	var prodWeight1 = $('#prdInfoText li:contains("Weight"):last');
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
	}
	return prodWeight;
}
plugin_content.init();