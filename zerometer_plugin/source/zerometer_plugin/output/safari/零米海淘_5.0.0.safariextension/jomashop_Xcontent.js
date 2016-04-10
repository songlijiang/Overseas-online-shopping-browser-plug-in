function localStartX(){
	return function(plugin_content){
		var _this = plugin_content.get_this();

		plugin_content.site_id = 26;
		plugin_content.site_name = 'jomashop';
		plugin_content.direct_mail_china = false;
		plugin_content.country = "US";

		//获取商品搜索框信息
		plugin_content.get_search_box = function(){
			var search_input = $('#sli_search_1');
			var search_button = $('.form-search').find("button[type='submit']");
			return [search_input,search_button];
		}
		plugin_content.get_category = function(){
			var targetSpans = $(".breadcrumbs").find("a");
			var prodcategory = "";
			var len = targetSpans.length; 
			for (var i = 0; i < len; i++) { 
			  if(i == 0){
				continue;
			  }
			  else{
				if(i == len-1){
				  prodcategory += targetSpans[i].innerText;
				}
				else{
				  prodcategory += targetSpans[i].innerText + "|";
				}
			  }
			  
			}
			return prodcategory;

		}

		//页面初始化
		plugin_content.content_init = function(){
			
			//加载插件内容
			_this.append_plugin();
			
			//绑定选择套餐刷新价格事件
			
			
		}

		//获取商品名称
		plugin_content.get_name = function(){
			var goods_name = $(".product-name").text();
			
			return goods_name;
		}

		//获取商品图片
		plugin_content.get_img = function(){
			var goods_img = $(".MagicZoomPlus").find("img").eq(0).attr("src");
			return goods_img;
		}

		//获取商品价格
		plugin_content.get_price = function(){
			var priceText ="$0.01";
			var prodPrice = "0.0";
			 var price = $(".final-price").children("span").eq(0).text();
			  if($(".final-price meta").length > 0){
			    price = $(".final-price meta").eq(0).attr("content");
			  }
			  priceText = price;
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
			var result =""; 
			result = JSON.stringify(feature); 
			return  JSON.parse(result);

			
		}

		//获取商品重量
		plugin_content.get_weight = function(){
			var prodWeight = _this.default_weight;
			var weightText ="0.01";
			
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
			* 根据pdp-shipping-availability
			*/
			var availability = $('.pdp-shipping-availability').text();
			if(availability.indexOf("Out of Stock") >=0){
				return true;
			}
			/*
			* 返回true
			*/
			return false;
		}
		
		plugin_content.init();
	}
}