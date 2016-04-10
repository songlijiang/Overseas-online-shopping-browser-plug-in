// ==UserScript==
// @name Amazon Script
// @namespace amazon
// @include ^http://www.amazon.com/
// @all-frames true
// @require jquery.js
// @require config.js
// @require cat.js
// @require area.js
// @require plugin_content.js
// ==/UserScript==



var plugin_content = new PluginContent();
var _this = plugin_content.get_this();

plugin_content.site_id = 1;
plugin_content.site_name = '亚马逊';
plugin_content.direct_mail_china = true;

//获取商品搜索框信息
plugin_content.get_search_box = function(){
	var search_input = $('#twotabsearchtextbox');
	var search_button = $('#nav-search .nav-search-submit .nav-input');
	return [search_input,search_button];
}

//页面初始化
plugin_content.content_init = function(){
	/*
	//加载插件内容
	var price_feature_div = $('#price_feature_div');
	if(price_feature_div.length>0){
		price_feature_div.after(PluginDiv);
	}else{
		var pantryPrice_feature_div = $('#pantryPrice_feature_div');
		if(pantryPrice_feature_div.length>0){
			pantryPrice_feature_div.after(PluginDiv);
		}else{
			var kitsune_price_feature_div = $('#kitsune-price_feature_div');
			if(kitsune_price_feature_div.length>0){
				kitsune_price_feature_div.after(PluginDiv);
			}else{
				var priceBlock = $('#priceBlock');
				if(priceBlock.length>0){
					priceBlock.after(PluginDiv);
				}else{
					$("#ppd-bottom-5").before(PluginDiv);
				}
			}
		}
	}
	*/
	//加载插件内容
	_this.append_plugin();
	
	//绑定选择套餐刷新价格事件
	$("#plan_options_swatch_container .aloha-swatch").click(function(){
		setTimeout(function(){
			_this.price_loaded = false;
			_this.refresh_price();
			_this.refresh_actual_tariff();
			_this.refresh_totle_price();
			_this.show_stock_state();
		},1000);
	});
	$("#plan_option_radio_container .plan-radio-wrapper input:radio").click(function(){
		setTimeout(function(){
			_this.price_loaded = false;
			_this.refresh_price();
			_this.refresh_actual_tariff();
			_this.refresh_totle_price();
			_this.show_stock_state();
		},1000);
	});
	$('#native_dropdown_selected_style_name,#native_dropdown_selected_size_name').change(function(){
		setTimeout(function(){
			_this.price_loaded = false;
			_this.refresh_price();
			_this.refresh_actual_tariff();
			_this.refresh_totle_price();
			_this.show_stock_state();
		},1000);
	});
	$("#handleBuy .swatchOuter").click(function(){
		setTimeout(function(){
			_this.price_loaded = false;
			_this.refresh_price();
			_this.refresh_actual_tariff();
			_this.refresh_totle_price();
			_this.show_stock_state();
		},2000);
	});
	$("#variation_color_name li,#variation_size_name li,#variation_style_name li,#variation_pattern_name li,#variation_item_package_quantity li").click(function(){
		setTimeout(function(){
			_this.price_loaded = false;
			_this.refresh_price();
			_this.refresh_actual_tariff();
			_this.refresh_totle_price();
			_this.show_stock_state();
		},3000);
	});
}

//获取商品名称
plugin_content.get_name = function(){
	var goods_name = '';
	var productTitle = $('#productTitle');
	var btAsinTitle = $('#btAsinTitle');
	if(productTitle.length>0){
		goods_name = productTitle.text();
	}else if(btAsinTitle.length>0){
		goods_name = btAsinTitle.text();
	}
	return goods_name;
}

//获取商品图片
plugin_content.get_img = function(){
	var landingImage = $('#landingImage');
	var prodImage = $('#prodImage');
	var landingImage2 = $('#main-image-container .imgTagWrapper img');
	var prodImage2 = $('#kib-ma-container-0 img');
	var prodImageCell = $('#prodImageCell img');
	if(landingImage.length>0){
		var goods_img = landingImage.attr('src');
	}else if(prodImage.length>0){
		var goods_img = prodImage.attr('src');
	}else if(landingImage2.length>0){
		var goods_img = landingImage2.attr('src');
	}else if(prodImage2.length>0){
		var goods_img = prodImage2.attr('src');
	}else if(prodImageCell.length>0){
		var goods_img = prodImageCell.attr('src');
	}else{
		var goods_img = '';
	}
	if(/^\s*data:/.test(goods_img)){
		goods_img = '';
	}
	return goods_img;
}

//获取商品价格
plugin_content.get_price = function(){
	var priceText = '$0.00';
	var current_price = $("#current-price");
	var priceblock_ourprice = $('#priceblock_ourprice');
	var priceblock_saleprice = $("#priceblock_saleprice");
	var priceblock_dealprice = $("#priceblock_dealprice span:first");
	
	var priceLarge = $("#actualPriceValue .priceLarge");
	var actualPriceValue = $("#actualPriceValue");
	var buyingPriceValue = $('#buyingPriceValue b');
	if (current_price.length>0){
		priceText = current_price.text();
	}else if(priceblock_ourprice.length>0){
		priceText = priceblock_ourprice.text();
	}else if(priceblock_saleprice.length>0){
		priceText = priceblock_saleprice.text();
	}else if(priceblock_dealprice.length>0){
		priceText = priceblock_dealprice.text();
	}else if(priceLarge.length>0){
		priceText = priceLarge.text();
	}else if(actualPriceValue.length>0){
		priceText = actualPriceValue.text();
	}else if(buyingPriceValue.length>0){
		priceText = buyingPriceValue.text();
	}
	
	priceText = priceText.replace(/,/g,'');
	var match_arr = priceText.match(/\$(\d+(\.\d+)?)/i);
	if(match_arr && typeof(match_arr[1])!="undefined"){
		prodPrice = match_arr[1]*_this.exchange_rate;
	}else{
		prodPrice = 0;
	}
	return prodPrice;
}

//获取商品重量
plugin_content.get_weight = function(){
	var prodWeight = _this.default_weight;
	var prodWeight1 = $('#productDetailsTable li:contains("Shipping Weight"), #detail-bullets li:contains("Shipping Weight")');
	var prodWeight2 = $('#prodDetails td:contains("Shipping Weight")').next();
	var prodWeight3 = $('#descriptionAndDetails span > span:contains("Shipping Weight")').next();
	var prodWeight4 = $('#technical-details-table td:contains("Weight")').next();
	
	var weightText = '';
	if (prodWeight1.length>0){
		aa = prodWeight1.contents().filter(function(){
			return this.nodeType === 3; //Node.TEXT_NODE
		}).text();
		weightText = aa;
	}else if(prodWeight2.length>0){
		ab = prodWeight2.contents().filter(function(){
			return this.nodeType === 3; //Node.TEXT_NODE
		}).text();
		weightText = ab;
	}else if(prodWeight3.length>0){
		ac = prodWeight3.contents().filter(function(){
			return this.nodeType === 3; //Node.TEXT_NODE
		}).text();
		weightText = ac;
	}else if(prodWeight4.length>0){
		weightText = prodWeight4.text();
	}
	
	var match_arr = weightText.match(/(\d+(\.\d+)?)\s?pound/i);
	if(match_arr && typeof(match_arr[1])!="undefined"){
		prodWeight = match_arr[1];
	}else{
		match_arr = weightText.match(/(\d+(\.\d+)?)\s?kg/i);
		if(match_arr && typeof(match_arr[1])!="undefined"){
			prodWeight = match_arr[1]/PluginConf.lb_rate;
		}else{
			match_arr = weightText.match(/(\d+(\.\d+)?)\s?(:?ounce|oz)/i);
			if(match_arr && typeof(match_arr[1])!="undefined"){
				prodWeight = match_arr[1]/16;
			}
		}
	}
	return prodWeight;
}
//获取商品是否缺货
plugin_content.out_of_stock = function(){
	/*
	* 根据包含in stock的元素是否存在
	*/
	var aloha_availability = $('#availability-container .aloha-availability-green');
	if(aloha_availability.length>0){
		return false;
	}
	var availability = $('#availability .a-color-success');
	if(availability.length>0){
		return false;
	}
	
	/*
	* 根据加入购物车按钮是否可用
	*/
	var add_to_cart_button = $('#add-to-cart-button:visible');
	if(add_to_cart_button.length>0){
		return false;
	}
	var bb_to_cfg_button = $('#bb_to_cfg_button:visible');
	if(bb_to_cfg_button.length>0){
		return false;
	}
	var buy_box_submit = $('#buy-box-submit:visible');
	if(buy_box_submit.length>0){
		return false;
	}
	
	/*
	* 返回true
	*/
	return true;
}
plugin_content.init();