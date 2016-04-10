function localStartX(){
	return function(plugin_content){
		var _this = plugin_content.get_this();

		plugin_content.site_id = 34;
		plugin_content.site_name = "saks";
		plugin_content.direct_mail_china = false;
		plugin_content.country = "US";

		//获取商品搜索框信息
		plugin_content.get_search_box = function(){
			var search_input = $('.ui-autocomplete-input');
			var search_button = $('.search-box').find("button[name='submit-search']");
			return [search_input,search_button];
		}
		plugin_content.get_category = function(){
			var prodcategory = $(".nav").find(".is-selected").find("a.menu-item-link").text();
			return prodcategory;
		}

		//页面初始化
		plugin_content.content_init = function(){
			
			//加载插件内容
			_this.append_plugin();
			
			//绑定选择套餐刷新价格事件
			$(".detail-column").change(function(){
				setTimeout(function(){
					_this.price_loaded = false;
					_this.refresh_content();
				},500);
			});
			
		}

		//获取商品名称
		plugin_content.get_name = function(){
			if($("h1.brand").length > 0)
				return $("h1.brand").text() + " " + $("h2.description").text();
			  
			  if($("div.product.main-product").length > 0)
				return $("div.product.main-product").find("h1").text().trim() + " " + $("div.product.main-product").find("h2").text().trim();

			  return "";
		}

		//获取商品图片
		plugin_content.get_img = function(){
			var goods_img =" ";
			return goods_img;
		}

		//获取商品价格
		plugin_content.get_price = function(){
			var priceText = '$0.00';
			 var prodPrice = $("span.product-price").text();
			  var priceOrg = $("div.product.main-product").find("div.list-price").find("div.value").text();
			  var priceSale = $("div.product.main-product").find("div.sale-price").find("div.value").text();
				
			  if (priceSale != "")
				prodPrice = priceSale;
			  else if(priceOrg != "")
				prodPrice = priceOrg;
			priceText = prodPrice;
			priceText = priceText.replace(/,/g,'');
			var match_arr = priceText.match(/\$(\d+(\.\d+)?)/i);
			var match_arr1 = priceText.match(/CNY\s(\d+(\.\d+)?)/i);
			if(match_arr && typeof(match_arr[1])!="undefined"){
				prodPrice = match_arr[1]*_this.exchange_rate;
			}else if(match_arr1 && typeof(match_arr1[1])!="undefined"){
				prodPrice = match_arr1[1];
			}else{
				prodPrice =0;
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
			function getProSizeNames(){
			  var value = ""
			  var hasAttr = false;
			  var optionNum = $("div.product.main-product").find("div.size.selector").find("select.select-picker").find("option").length;
			  var a_optionNum = $("div.product.main-product").find("div.size.selector").find("a.item.size").length;
			  var dropdownNum = $("select.js-saks-sku-dropdown").length;
			  if(optionNum > 0){
			  	hasAttr = true;
				value = $("div.product.main-product").find("div.size.selector").find("div.body").find("span.item.size.selected").text();
			  }
			  else if(a_optionNum > 0){
			  	hasAttr = true;
				var sizeObj = $("div.product.main-product").find("div.size.selector").find("a.selected");
				value = sizeObj.text();
				if(sizeObj.hasClass('waitlist')){
				  value = value.split("|")[0] + "(已断码)";
				}
			  }
			  else if(dropdownNum > 0){
			  	hasAttr = true;
			  	value = $("select.js-saks-sku-dropdown option:selected").text();
			  }
			   
			  if(value == null || typeof(value) == "undefined" || value == "")
				value = "请到页面上选择尺码";
			if(!hasAttr)
			{
				value = null;
			}

			  return value;
			}
			function getColorNames(){
			  var value = "";
			  var hasAttr = false;
			  if($("div.product.main-product").find("div.color.selector").length > 0){
			  	hasAttr = true;
				value = $("div.product.main-product").find("div.color.selector").find("span.value").text();
				if($("div.items.clearfix").find("a.selected").hasClass("waitlist")){
				  value = value.split("|")[0] + "(已断码)";
				}
			  }
			  
			  
			  if(value == null || typeof(value) == "undefined" || value == "")
				value = "请到页面上选择颜色";
			  if(!hasAttr)
			  {
			  	value = null;
			  }
			  return value;
			}
		}

		//获取商品重量
		plugin_content.get_weight = function(){
			var prodWeight = _this.default_weight;
			return prodWeight;
		}
		
		plugin_content.init();
	}
}