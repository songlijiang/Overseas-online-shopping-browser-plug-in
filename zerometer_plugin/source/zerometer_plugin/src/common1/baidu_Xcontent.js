function localStartX(){
var plugin_content = new PluginContent();
var _this = plugin_content.get_this();

plugin_content.site_id = 46;
plugin_content.site_name = 'baidu';
plugin_content.direct_mail_china = true;

//获取商品搜索框信息
plugin_content.get_search_box = function(){
	var search_input = $('#kw');
	var search_button = $('#su');
	return [search_input,search_button];
}

//页面初始化
plugin_content.content_init = function(){
	//加载插件内容
	alert("init baidu.com");
	_this.append_plugin();
	
	//添加定时器定时监听id为page-content的div内容
	
}

//获取商品名称
plugin_content.get_name = function(){
	var goods_name = '';
	goods_name="name";
	return goods_name;
}

//获取商品图片
plugin_content.get_img = function(){
	
		var goods_img = "sdsd.jpg";
	
	return goods_img;
}

//获取商品价格
plugin_content.get_price = function(){
	prodWeight =_this.default_weight;
	return prodWeight;
}



//获取商品重量
plugin_content.get_weight = function(){
	var prodWeight = _this.default_weight;
	return prodWeight;
}
setTimeout(function(){
	plugin_content.init();
},5000);
}