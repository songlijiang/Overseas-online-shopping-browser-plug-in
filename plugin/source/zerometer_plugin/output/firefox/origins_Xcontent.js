function localStartX(){
	return function(plugin_content){
		var _this = plugin_content.get_this();

		plugin_content.site_id = 31;
		plugin_content.site_name = "origins";
		plugin_content.direct_mail_china = false;
		plugin_content.country = "US";

		//获取商品搜索框信息
		plugin_content.get_search_box = function(){
			var search_input = $('.gnav-search__field');
			var search_button = null;
			return [search_input,search_button];
		}
		plugin_content.get_category = function(){
			var targetSpans = $(".product-breadcrumb").find("a");
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
			prodcategory.replace(".","");
			return prodcategory;
		}

		//页面初始化
		plugin_content.content_init = function(){
			//加载插件内容
			_this.append_plugin();
			
			//绑定选择套餐刷新价格事件
			$(".product-info__main-right").click(function(){
				setTimeout(function(){
					_this.price_loaded = false;

				_this.refresh_content();

				},1000);
			});
			
		}

		//获取商品名称
		plugin_content.get_name = function(){
			var goods_name = '';
			goods_name = $(".product-heading").find("h3").text();
			return goods_name;
		}

		//获取商品图片
		plugin_content.get_img = function(){
			var goods_img = "http://www.origins.com" + $("div.product_image").find("img").attr("src");
			return goods_img;
		}

		//获取商品价格
		plugin_content.get_price = function(){
			  var priceText = "0.0";
			  var prodPrice ="0.0";
				priceText =   $("div.product-sku-price").find(".product-sku-price__value").text();
				if($("div.product-sku-price").find(".product-sku-price__value").length<=0)
				{
					priceText = $(".salePrice").text();
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
			feature.sizes =getSizeNames();
			var result =""; 
			result = JSON.stringify(feature); 
			return  JSON.parse(result);
			//获取尺码大小；
			function getSizeNames(){
			  var value = "";
			  var label = $("#shadelbl");
			  if(label.length > 0){
			  	var labelName = label.text();
			  
			    if(labelName.indexOf("color") >= 0 || labelName.indexOf("Shade") >= 0)
				  value = $("#smoosh_container").find("h3.shade-name").text();
				
			    else if(labelName.indexOf("Size") >= 0)
				  value = $("div.spp-unit.price_display_container").text().split("US$")[0];
			  }
			  else{
			  	if($(".product-sku-select__placeholder").length > 0){
			  	  value = $(".product-sku-select__placeholder").text();
			  	}
			  	else if($(".selectBox-label").length > 0){
					value = $(".product-sku-select .selectBox-label").text().trim();
			  	}
			  }

			  if(value == "")
				value = "请到网站上选择";
			  
			  return value;
			}


			
		}

		//获取商品重量
		plugin_content.get_weight = function(){
			var prodWeight = _this.default_weight;
			var weightText = "0.01";
			if($('div.spp-unit.price_display_container').length >0 ){
		  		var weightCon = $('div.spp-unit.price_display_container').text();
		 	 weightText = weightCon;
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
		
		plugin_content.init();
	}
}