function localStartX(){
	// var plugin_content = new PluginContent();
	return function(plugin_content){
		var _this = plugin_content.get_this();

		plugin_content.site_id = 35;
		plugin_content.site_name = "shopbop";
		plugin_content.direct_mail_china = false;
		plugin_content.country = "US";

		//获取商品搜索框信息
		plugin_content.get_search_box = function(){
			var search_input = $('#searchKeywords');
			var search_button = $('.arrow-right');
			return [search_input,search_button];
		}

		//页面初始化
		plugin_content.content_init = function(){
			//加载插件内容
			_this.append_plugin();
			
		//绑定选择套餐刷新价格事件
		  $("#pdp-buystack-form").click(function(){
				setTimeout(function(){
					_this.price_loaded = false;
					_this.refresh_content();
				},1000);
	  		});
	  
		}

		//获取商品名称
		plugin_content.get_name = function(){
			var goods_name = $("a[itemprop=brand]").text();
			
			return goods_name;
		}

		//获取商品图片
		plugin_content.get_img = function(){
			var  goods_img = $("img#productImage").attr("src");
			return goods_img;
		}

		//获取商品价格
		plugin_content.get_price = function(){
		 	var prodPrice = $("div.priceBlock").text();
			var regularPrice = $("div.priceBlock").find("span.regularPrice").text();
			var salePrice = $("div.priceBlock").find("span.salePrice").text();
			var prodWeight = getWeight();
			if(regularPrice != "")
			  prodPrice = regularPrice;
			if(salePrice != "")
			  prodPrice = salePrice;
			prodPrice = prodPrice.replace(/,/g,'.');
			var reg = /\$\s?(\d+(\.\d+)?)/i;
			var match_arr = prodPrice.match(reg);
			if(match_arr && typeof(match_arr[1])!="undefined") {
				prodPrice = match_arr[1];
			}
			else{
				prodPrice = 0;
			}
			return prodPrice;
		}

		//获取商品重量
		plugin_content.get_weight = function(){
			var prodWeight ="0.01";
			var weightText;
			if($('#detailsAccordion').length > 0){
			  var weightCon = $('#detailsAccordion div[itemprop="description"]').text();
			  if(weightCon.indexOf("盎司") >= 0){
				weightText =  weightCon;
			  }
			}
			var match_arr = weightText.match(/(\d+(\.\d+)?)\s?pound/i);
			if(match_arr && typeof(match_arr[1])!="undefined"){
				prodWeight = match_arr[1];
			}else{
				match_arr = weightText.match(/(\d+(\.\d+)?)\s?kg/i);
				if(match_arr && typeof(match_arr[1])!="undefined"){
					prodWeight = match_arr[1]/PluginConf.lb_rate;
				}else{
					match_arr = weightText.match(/(\d+(\.\d+)?)\s?(:?ounce|oz|盎司)/i);
					if(match_arr && typeof(match_arr[1])!="undefined"){
						prodWeight = match_arr[1]/16;
					}
				}
			}
			return prodWeight;
		}
		plugin_content.get_category = function(){
			var targetSpans = $(".breadcrumbs").find("a");
			var prodcategory = "";
			var len = targetSpans.length; 
			for (var i = 0; i < len; i++) { 
				if(i == len-1){
				  prodcategory += targetSpans[i].innerText;
				}
				else{
				  prodcategory += targetSpans[i].innerText + "|";
				}	  
			}
			return prodcategory;
		}
	
		//获取商品特性
		plugin_content.get_features = function(){
			var feature = new Object();
			feature.colors =getColorNames();
			feature.sizes = getSelectableSizes();
			return  feature;

			//获取颜色类别；
			function getColorNames(){
			  var colors = $("#swatches").find("img").length;
			  var options = "";
			  
			  if (colors > 0){
				for(i = 0; i < colors; i++) {
				  var colorName = $("#swatches").find("img").eq(i).attr("alt");
				  var option = "<option value='" + colorName + "'>" + colorName + "</option>\n";
				  options += option;      
				}
			  }
			  
			  return options;
			}
			//获取尺码大小；
			function getSelectableSizes(){
			  var sizes = $("div#sizes").find("span").length;
			  var options = "";
			  
			  if(sizes > 0){
				for(i = 0; i < sizes; i++) {
				  var selectableSize = $("div#sizes").find("span").eq(i).text();
				  var option = "<option value='" + selectableSize + "'>" + selectableSize + "</option>\n";
				  options += option;      
				}
			  }
			   
			  return options;
			}
			
		}
		plugin_content.init();
	}
}
