function localStartX(){
var plugin_content = new PluginContent();
var _this = plugin_content.get_this();

plugin_content.site_id = 16;
plugin_content.site_name = 'nordstrom';
plugin_content.direct_mail_china = true;

//获取商品搜索框信息
plugin_content.get_search_box = function(){
	var search_input = $('#primary-search-input');
	var search_button = $('#primary-search-submit');
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
	var itemTitle = $('#product-title h1');
	if(itemTitle.length>0){
		goods_name = itemTitle.text();
	}else{
		goods_name = '';
	}
	return goods_name;
}

//获取商品图片
plugin_content.get_img = function(){
	var icImg = $('#image-zoom .image-thumbs li:first img');
	if(icImg.length>0){
		var goods_img = icImg.attr('src');
	}else{
		var goods_img = '';
	}
	return goods_img;
}

//获取商品价格
plugin_content.get_price = function(){
	var prodPrice = '$0.00';
	var prcIsum = $('.heading-2 span');
	var prcIsum1 = $('.sale-price');
	if (prcIsum.length>0){
		prodPrice = prcIsum.text();
	}else if(prcIsum1.length>0){
		prodPrice = prcIsum1.text();
	}
	
	prodPrice = $.trim(prodPrice);
	prodPrice = prodPrice.replace(/,/g,'');
	var match_arr = prodPrice.match(/\$\s?(\d+(:?\.\d+)?)/);
	
	if(match_arr && typeof(match_arr[1]!='undefined')){
		prodWeight = match_arr[1]*_this.exchange_rate;
	}
	return prodWeight;
}



//获取商品重量
plugin_content.get_weight = function(){
	var prodWeight = _this.default_weight;
	return prodWeight;
}
setTimeout(function(){
	plugin_content.init();
},10000);
}