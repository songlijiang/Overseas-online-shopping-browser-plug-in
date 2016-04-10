function localStartX(){
	return function(plugin_content){
		var _this = plugin_content.get_this();

		plugin_content.site_id = 16;
		plugin_content.site_name = 'esteelauder';
		plugin_content.direct_mail_china = false;
		plugin_content.country = "US";

		//获取商品搜索框信息
		plugin_content.get_search_box = function(){
			var search_input = $('#search');
			var search_button = $('.el-search-block__btn-submit');
			return [search_input,search_button];
		}
		plugin_content.get_category = function(){
			var prodcategory = " ";
			return prodcategory;
		}

		//页面初始化
		plugin_content.content_init = function(){
			//加载插件内容
			_this.append_plugin();
			
			//绑定选择套餐刷新价格事件
			$("div.product-full__description").click(function(){
				setTimeout(function(){
					_this.price_loaded = false;
					_this.refresh_content();
				},1000);
			});
			
		}

		//获取商品名称
		plugin_content.get_name = function(){
			var value;
			  if($("h3.product-full__title").length > 0)
			   value = $("h3.product-full__title").text() + " " + $("h4.product-full__subtitle").text();
			  else if($("div.product-title").length > 0)
			   value = $("div.product-title").text();
			  
			  return value;
		}

		//获取商品图片
		plugin_content.get_img = function(){
			var goods_img = "http://www.esteelauder.com/" + $("div.product-full__image").find("img").attr("src");
			return goods_img;
		}

		//获取商品价格
		plugin_content.get_price = function(){
			   var prodPrice;
			   var priceText;
			  if($("span.product-full__price").length > 0)
				priceText = $("span.product-full__price").text();
			  else if($("div.product-price").length > 0)
				priceText = $("div.product-price").text();
			  
			  if(priceText == "" || typeof(priceText) == "undefined"){
				var selectSize = $("select.product-full__price-size-select").length;
				
				if(selectSize > 0){
				  var selectPrice = $("select.product-full__price-size-select").val();
				
				  if(selectPrice.indexOf("$") >= 0)
					priceText = selectPrice.split("$")[1];
				}
			  }
			  

			    priceText = priceText.replace(/,/g,'');
				var match_arr = priceText.match(/\$(\d+(\.\d+)?)/i);
				if(match_arr && typeof(match_arr[1])!="undefined"){
					prodPrice = match_arr[1];
				}else{
					prodPrice = 0;
				}
				return prodPrice;
		}

		//获取商品特性
		plugin_content.get_features = function(){
			var feature = new Object();
			feature.sizes =getProSizeNames();
			feature.colors = getColorNames();
			var result =""; 
			result = JSON.stringify(feature); 
			return  JSON.parse(result);
			//获取尺码大小；
			function getProSizeNames() {
			   var value = $(".product-full__price-size-select-container").find("span.selectBox-label").text();
			   var hasAttr =false;
			   if($(".product-full__price-size-select-container").length >0)
			   {
			   	hasAttr = true;
			   }
			   if(value == null || value == "" || typeof(value) == "undefined" || value.toLowerCase().indexOf("select") >= 0)
				value = "请到页面上选择尺码";
			   if(!hasAttr)
			   {
			   	value =null;
			   }
			  return value;
			}


			//获取颜色类别；
			function getColorNames(){
			  var value = $(".product-full__shade-select-container").find("span.selectBox-label").text();
			  var hasAttr = false;
			  if($(".product-full__shade-select-container").length >0)
			  {
			  	hasAttr = true;
			  }
			  if(value == null || value == "" || typeof(value) == "undefined" || value.toLowerCase().indexOf("select") >= 0)
				value = "请到页面上选择颜色";
			  if(!hasAttr)
			  {
			  	value =null;
			  }
			  return value;
			}



			
		}

		//获取商品重量
		plugin_content.get_weight = function(){
			var prodWeight = _this.default_weight;
			var weightText = $("div.product-full__price-text").text();
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
		
		plugin_content.init();
	}
}