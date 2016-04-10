function localStartX(){
	return function(plugin_content){
		var _this = plugin_content.get_this();

		plugin_content.site_id = 40;
		plugin_content.site_name = "ugg";
		plugin_content.direct_mail_china = false;
		plugin_content.country = "US";

		//获取商品搜索框信息
		plugin_content.get_search_box = function(){
			var search_input = $('input[placeholder="Search"]');
			var search_button = $('button[value="Go"]');
			return [search_input,search_button];
		}
		plugin_content.get_category = function(){
			var targetSpans = $("ol[itemprop=breadcrumb]").find("a");
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
			$(".product-variations #variationColor ul.swatches li, .product-variations #variationSize ul.swatches li").click(function(){
				setTimeout(function(){
					_this.price_loaded = false;
					_this.refresh_content();
				},500);
			});
		}

		//获取商品名称
		plugin_content.get_name = function(){
			var goods_name = "";
			var productNameDiv = $(".product-name");
			if(productNameDiv.length > 0){
				goods_name = productNameDiv.text();
			}
			return goods_name;
		}

		//获取商品图片
		plugin_content.get_img = function(){
			var goods_img = "";
			var imgDiv = $(".product-primary-image img");
			if(imgDiv.length > 0){
				goods_img = imgDiv.attr("src");
			}
			return goods_img;
		}

		//获取商品价格
		plugin_content.get_price = function(){
			var prodPrice = 0;
			var priceText = "";
			var productPrice = $('#product-content').find("span.price-sales");
			if(productPrice.length>0){
				priceText = productPrice.text();
			}
			if(priceText != ""){
				var index = priceText.indexOf("$");
				if(index != -1){
					prodPrice = priceText.substr(index+1);
				}
			}
			return prodPrice;
		}

		//获取商品特性
		plugin_content.get_features = function(){
			var feature = new Object();
			feature.sizes =getProSizeNames();
			feature.colors =getProColorNames();
			var result =""; 
			result = JSON.stringify(feature); 
			return  JSON.parse(result);

			//获取尺码大小；
			function getProSizeNames(){
			  var sizeObj = $(".product-variations #variationSize");
			  var hasAttr = false;
			  if(sizeObj.length >0)
			  {
			  	hasAttr = true;
			  }
			  var sizeName = sizeObj.find("li.selected").text();
			  if(sizeName == null || sizeName == "" || typeof(sizeName) == "undefined" || sizeName.toLowerCase().indexOf("choose") >= 0 || sizeName.toLowerCase().indexOf("select") >= 0)
				sizeName = "请到页面上选择尺码";
			
			  if(!hasAttr)
			  {
			  	sizeName = null;
			  }
			  return sizeName;
			}

			//获取颜色；
			function getProColorNames(){
			  var colorObj = $(".product-variations #variationColor");
			  var hasAttr = false;
			  if(colorObj.length >0)
			  {
			  	hasAttr = true;
			  }
			  var colorName = colorObj.find("li.selected").text();
			 
			  if(colorName == null || colorName == "" || typeof(colorName) == "undefined" || colorName.toLowerCase().indexOf("choose") >= 0 || colorName.toLowerCase().indexOf("select") >= 0)
				colorName = "请到页面上选择颜色";
			
			  if(!hasAttr)
			  {
			  	colorName = null;
			  }
			  return colorName;
			}
		}

		//获取商品重量
		plugin_content.get_weight = function(){
			var prodWeight = _this.default_weight;//"未知"
			return prodWeight;
		}
		plugin_content.init();
	}
}