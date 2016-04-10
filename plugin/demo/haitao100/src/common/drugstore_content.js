// ==UserScript==
// @name drugstore Script
// @namespace drugstore
// @include ^http://www.drugstore.com/
// @require jquery.js
// @require config.js
// @require cat.js
// @require area.js
// @require plugin_content.js
// ==/UserScript==



var plugin_content = new PluginContent();
var _this = plugin_content.get_this();

plugin_content.site_id = 7;
plugin_content.site_name = 'drugstore';

//获取商品搜索框信息
plugin_content.get_search_box = function(){
	var search_input = $('#txtSearchBox_1');
	var search_button = $('#btnGoSearch_1');
	return [search_input,search_button];
}

//页面初始化
plugin_content.content_init = function(){
	//加载插件内容
	_this.append_plugin();
	
	//绑定选择套餐刷新价格事件
	$("#color").change(function(){
		setTimeout(function(){
			_this.price_loaded = false;
			_this.refresh_price();
			_this.refresh_actual_tariff();
			_this.refresh_totle_price();
		},500);
	});
}

//获取商品名称
plugin_content.get_name = function(){
	var goods_name = '';
	var divCaption = $('#divCaption .captionText');
	if(divCaption.length>0){
		goods_name = divCaption.text();
	}else{
		goods_name = '';
	}
	return goods_name;
}

//获取商品图片
plugin_content.get_img = function(){
	var divPImage = $('#divPImage img');
	if(divPImage.length>0){
		var goods_img = divPImage.attr('src');
	}else{
		var goods_img = '';
	}
	return goods_img;
}

//获取商品价格
plugin_content.get_price = function(){
	var prodPrice = '$0.00';
	var priceText;
	var productprice = $('#productprice .price');
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
	var TblProdForkPromo = $('#TblProdForkPromo li:contains("Package Weight")');
	if (TblProdForkPromo.length>0){
		var weightText = TblProdForkPromo.find('span').text();
		var match_arr = weightText.match(/(\d+(\.\d+)?)\skg/i);
		if(match_arr && typeof(match_arr[1])!="undefined"){
			prodWeight = match_arr[1]/PluginConf.lb_rate;
		}
	}
	return prodWeight;
}
plugin_content.init();