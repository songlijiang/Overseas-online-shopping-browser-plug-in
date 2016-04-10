// ==UserScript==
// @name ebay Script
// @namespace ebay
// @include ^http://www.ebay.com/
// @all-frames true
// @require jquery.js
// @require config.js
// @require cat.js
// @require area.js
// @require plugin_content.js
// ==/UserScript==


var plugin_content = new PluginContent();
var _this = plugin_content.get_this();

plugin_content.site_id = 5;
plugin_content.site_name = 'ebay';
plugin_content.direct_mail_china = true;

//获取商品搜索框信息
plugin_content.get_search_box = function(){
	var search_input = $('#gh-ac');
	var search_button = $('#gh-btn');
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
	var itemTitle = $('#itemTitle');
	if(itemTitle.length>0){
		goods_name = itemTitle.html();
		goods_name = goods_name.replace(/<[^>]+>[^<]+<[\/][^>]+>/i,'');
	}else{
		goods_name = '';
	}
	return goods_name;
}

//获取商品图片
plugin_content.get_img = function(){
	var icImg = $('#icImg');
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
	var prcIsum = $('#prcIsum');
	var prcIsum_bidPrice = $('#prcIsum_bidPrice');
	var mm_saleDscPrc = $('#mm-saleDscPrc');
	var convbidPrice = $('#convbidPrice');
	if (prcIsum.length>0){
		prodPrice = prcIsum.text()
	}else if(prcIsum_bidPrice.length>0){
		prodPrice = prcIsum_bidPrice.text()
	}else if(mm_saleDscPrc.length>0){
		prodPrice = mm_saleDscPrc.text()
	}else if(convbidPrice.length>0){
		prodPrice = convbidPrice.text();
	}
	prodPrice = $.trim(prodPrice);
	prodPrice = prodPrice.replace(/,/g,'');
	if(/^US\s\$/.test(prodPrice)){
		prodPrice = prodPrice.replace(/^US\s\$/,'');
		prodPrice = prodPrice*_this.exchange_rate;
	}else if(/^RMB\s/.test(prodPrice)){
		prodPrice = prodPrice.replace(/^RMB\s/,'');
	}else if(/^EUR\s/.test(prodPrice)){
		prodPrice = prodPrice.replace(/^EUR\s/,'');
		//获取欧元汇率
		kango.invokeAsync('kango.storage.getItem', 'euro_rate', function(euro_rate){
			_this.goodsPrice = parseFloat(parseFloat(prodPrice*euro_rate).toFixed(2));
			_this.refresh_price();
		});
	}else if(/^GBP\s/.test(prodPrice)){
		prodPrice = prodPrice.replace(/^GBP\s/,'');
		//获取英镑汇率
		kango.invokeAsync('kango.storage.getItem', 'pound_rate', function(pound_rate){
			_this.goodsPrice = parseFloat(parseFloat(prodPrice*pound_rate).toFixed(2));
			_this.refresh_price();
		});
	}else if(/^AU\s\$/.test(prodPrice)){
		prodPrice = prodPrice.replace(/^AU\s\$/,'');
		//获取澳元汇率
		var details = {
			url: PluginConf.get_interface_file('get_exchange_rate',{'from':'AUD','to':'CNY'}),
			method: 'GET',
			async: true,
			contentType: 'text'
		};
		kango.xhr.send(details, function(data) {
			var au_rate = 4.8890;
			if (data.status == 200 && data.response != null) {
				au_rate = data.response;
				//kango.console.log(pound_rate);
			}
			_this.goodsPrice = parseFloat(parseFloat(prodPrice*au_rate).toFixed(2));
			_this.refresh_price();
		});
	}else if(/^C\s\$/.test(prodPrice)){
		prodPrice = prodPrice.replace(/^C\s\$/,'');
		//获取加元汇率
		var details = {
			url: PluginConf.get_interface_file('get_exchange_rate',{'from':'CAD','to':'CNY'}),
			method: 'GET',
			async: true,
			contentType: 'text'
		};
		kango.xhr.send(details, function(data) {
			var c_rate = 5.0063;
			if (data.status == 200 && data.response != null) {
				c_rate = data.response;
				//kango.console.log(pound_rate);
			}
			_this.goodsPrice = parseFloat(parseFloat(prodPrice*c_rate).toFixed(2));
			_this.refresh_price();
		});
	}
	return prodPrice;
}

//获取商品重量
plugin_content.get_weight = function(){
	var prodWeight = _this.default_weight;
	var weight1 = $('#vi-desc-maincntr .prodDetailSec table table td:contains("Weight")').next().find('font');
	var vi_desc_maincntr = $('#vi-desc-maincntr td:contains("Package weight")').next();
	var desc_ifr = $('#desc_ifr');
	if(weight1.length>0){
		var weightText = weight1.text();
		if(/^\d+(\.\d+)?\sOz/i.test(weightText)){
			prodWeight = (weightText.replace(/\sOz.*/i,''))/16;
		}else if(/^\d+(\.\d+)?\slb?/i.test(weightText)){
			prodWeight = weightText.replace(/\slb.*/i,'');
		}
	}else if(vi_desc_maincntr.length>0){
		var weightText = vi_desc_maincntr.find('span').text();
		var match_arr = weightText.match(/(\d+(\.\d+))oz/i);
		if(match_arr && typeof(match_arr[1])!="undefined"){
			prodWeight = match_arr[1]/16;
		}
	}else if(desc_ifr.length>0){
		var iframe_src = desc_ifr.attr('src');
		var details = {
			url: iframe_src,
			method: 'GET',
			async: false,
			contentType: 'text'
		};
		kango.xhr.send(details, function(data) {
			if (data.status == 200 && data.response != null) {
				var iframe_doc = $(data.response);
				var weight2 = iframe_doc.find('#ListingContent table table .style1:contains("Weight")');
				var weigth3 = iframe_doc.find('.MsoNormalTable td:contains("Weight")').next();
				var weigth4 = iframe_doc.find('#x-main-gall .x-tmid li:contains("Weight")');
				var weight5 = iframe_doc.find('#ds_div #table1 td:contains("Weight")').next();
				var weight6 = iframe_doc.find('#ds_div .newdesc td:contains("Weight")').next();
				var weight7 = iframe_doc.find('#info01 td font:contains("Weight")');
				var weight8 = iframe_doc.find('#nav_f .specialsNew li:contains("Weight")');
				var weight9 = iframe_doc.find('#ds_div li:contains("Weight")');
				var weight10 = iframe_doc.find('#ds_div .pdesc:contains("Weight")');
				var weight11 = iframe_doc.find('#ds_div #prod-description-specifications th:contains("Weight")').next();
				var weight12 = iframe_doc.find('#ds_div table table th:contains("Weight")').next();
				var weight13 = iframe_doc.find('#ds_div #product_summary_content_table td:contains("Weight")').next();
				var weight14 = iframe_doc.find('#ds_div #tempPrdtDscrpBody table td:contains("Weight")').next();
				var weight15 = iframe_doc.find('#ds_div #tempPrdtDscrpBody table th:contains("Weight")').next();
				var weight16 = iframe_doc.find('#ds_div #productWeight label');
				var weight17 = iframe_doc.find('#ds_div:contains("Weight")');
				if(weight2.length>0){
					var weightText = weight2.text();
					if(/\d+(\.\d+)?\sOz/i.test(weightText)){
						prodWeight = (weightText.replace(/[^\d]+(\d+(\.\d+)?)\sOz/i,"\$1"))/16;
					}
				}else if(weigth3.length>0){
					var weightText = weigth3.find('span').text();
					if(/\d+(\.\d+)?\sOz/i.test(weightText)){
						prodWeight = (weightText.replace(/(\d+(\.\d+)?)\sOz[\s\S]*/i,"\$1"))/16;
					}
				}else if(weigth4.length>0){
					var weightText = weigth4.text();
					var match_arr = weightText.match(/(\d+(\.\d+)?)g/i);
					if(match_arr && typeof(match_arr[1])!="undefined"){
						prodWeight = match_arr[1]/1000/PluginConf.lb_rate;
					}
				}else if(weight5.length>0){
					var weightText = weight5.find('font').text();
					if(/\d+(\.\d+)?\sOz/i.test(weightText)){
						prodWeight = (weightText.replace(/(\d+(\.\d+)?)\sOz[\s\S]*/i,"\$1"))/16;
					}
				}else if(weight6.length>0){
					var weightText = weight6.text();
					if(/\d+(\.\d+)?\sLb/i.test(weightText)){
						prodWeight = weightText.replace(/(\d+(\.\d+)?)\sLb/i,"\$1");
					}
				}else if(weight7.length>0){
					var weightText = weight7.text();
					var match_arr = weightText.match(/Weight:\s(\d+(\.\d+)?)oz/i);
					if(match_arr && typeof(match_arr[1])!="undefined"){
						prodWeight = match_arr[1]/16;
					}
				}else if(weight8.length>0){
					var weightText = weight8.find('span').html();
					var match_arr = weightText.match(/(\d+(\.\d+)?)\s+oz/i);
					if(match_arr && typeof(match_arr[1])!="undefined"){
						prodWeight = match_arr[1]/16;
					}
				}else if(weight9.length>0){
					var weightText = weight9.text();
					var match_arr = weightText.match(/(\d+(\.\d+)?)g/i);
					if(match_arr && typeof(match_arr[1])!="undefined"){
						prodWeight = match_arr[1]/1000/PluginConf.lb_rate;
					}else{
						var match_arr = weightText.match(/(\d+(\.\d+)?)\s?Oz/i);
						if(match_arr && typeof(match_arr[1])!="undefined"){
							prodWeight = match_arr[1]/16;
						}
					}
				}else if(weight10.length>0){
					var weightText = weight10.text();
					var match_arr = weightText.match(/Weight:(\d+(\.\d+)?)\s?g/i);
					if(match_arr && typeof(match_arr[1])!="undefined"){
						prodWeight = match_arr[1]/1000/PluginConf.lb_rate;
					}
				}else if(weight11.length>0){
					var weightText = weight11.text();
					prodWeight =weightText/PluginConf.lb_rate;
				}else if(weight12.length>0){
					var weightText = weight12.text();
					prodWeight =weightText/PluginConf.lb_rate;
				}else if(weight13.length>0){
					var weightText = weight13.text();
					var match_arr = weightText.match(/(\d+(\.\d+)?)\s?lbs/i);
					if(match_arr && typeof(match_arr[1])!="undefined"){
						prodWeight = match_arr[1];
					}
				}else if(weight14.length>0){
					var weightText = weight14.text();
					var match_arr = weightText.match(/(\d+(\.\d+)?)\s?pounds/i);
					if(match_arr && typeof(match_arr[1])!="undefined"){
						prodWeight = match_arr[1];
					}
				}else if(weight15.length>0){
					var weightText = weight15.text();
					var match_arr = weightText.match(/(\d+(\.\d+)?)\s?ounces/i);
					if(match_arr && typeof(match_arr[1])!="undefined"){
						prodWeight = match_arr[1]/16;
					}
				}else if(weight16.length>0){
					var weightText = weight16.text();
					prodWeight = weightText/1000/PluginConf.lb_rate;
				}else if(weight17.length>0){
					var weightText = weight17.text();
					var match_arr = weightText.match(/Weight:\s?(\d+(\.\d+)?)\s?g/i);
					if(match_arr && typeof(match_arr[1])!="undefined"){
						prodWeight = match_arr[1]/1000/PluginConf.lb_rate;
					}else{
						var match_arr = weightText.match(/Weight:\s?(\d+(\.\d+)?)\s?oz/i);
						if(match_arr && typeof(match_arr[1])!="undefined"){
							prodWeight = match_arr[1]/16;
						}
					}
				}
			}else { // something went wrong
				
			}
		});
	}
	return prodWeight;
}
//获取商品是否缺货
plugin_content.out_of_stock = function(){
	/*
	* 根据立即购买按钮是否存在
	*/
	var binBtn_btn = $('#binBtn_btn');
	if(binBtn_btn.length>0){
		return false;
	}else{
		return true;
	}
}
plugin_content.init();