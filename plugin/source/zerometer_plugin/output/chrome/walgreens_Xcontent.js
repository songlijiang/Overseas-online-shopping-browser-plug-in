function localStartX(){
	return function(plugin_content){
		var _this = plugin_content.get_this();

		plugin_content.site_id = 43;
		plugin_content.site_name = "walgreens";
		plugin_content.direct_mail_china = false;
		plugin_content.country = "US";


		//获取商品搜索框信息
		plugin_content.get_search_box = function(){
			var search_input = $('.search-input');
			var search_button = $('#header-search');
			return [search_input,search_button];
		}
		plugin_content.get_category = function(){
			var prodcategory = "";
			var categories = $("article#wag-product-breadcrum ul li");
			if(categories.length > 0){
				var length = categories.length;
			  	categories.each(function(index, element){
			  		if(index == 0){
			  			return;
			  		}
					prodcategory += $.trim($(element).text()) + "|";
			  	});
			}
			if(prodcategory != ""){
				var index = prodcategory.lastIndexOf("|");
				if(index != -1){
					prodcategory = prodcategory.substr(0, index);
				}
			}
			return prodcategory;
		}

		//页面初始化
		plugin_content.content_init = function(){
			//加载插件内容
			_this.append_plugin();
			
			//绑定选择套餐刷新价格事件
			$("ul.ng-scope li, .dd-click-off-close li").click(function(){
				setTimeout(function(){
					_this.price_loaded = false;
					_this.refresh_content();
				},500);
			});
		}

		//获取商品名称
		plugin_content.get_name = function(){
			var goods_name = '';
			var title = $("#productName");
			if(title.length > 0){
				goods_name = $.trim(title.text());
			}
			return goods_name;
		}

		//获取商品图片
		plugin_content.get_img = function(){
			var goods_img = "http://www.walgreens.com"+$("img#proImg").attr("src");
			return goods_img;
		}

		//获取商品价格
		plugin_content.get_price = function(){
			var priceText = "";
			var prodPrice = 0;
			var index = -1;
			var salePrice = $("h2[ng-if='productModel.jsonData.salePrice']");
			if(salePrice.length > 0){
				priceText = salePrice.text();
				//2/$30.00 or 1/$16.99
				index = priceText.indexOf("or");
				if(index != -1){
					index = priceText.indexOf("1/");
					if(index != -1){
						priceText = priceText.substr(index+"1/".length);
					}
				}
			}
			else{
				var regularPrice = $("*[ng-if='productModel.jsonData.regularPrice']");
				if(regularPrice.length > 0){
					priceText = regularPrice.text();
				}
			}
			index = priceText.indexOf("$");
			if(index != -1){
				prodPrice = priceText.substr(index+1);
			}
			return prodPrice;
		}

		//获取商品特性
		plugin_content.get_features = function(){
			var feature = new Object();
			feature.colors = getColorNames();
			var result =""; 
			result = JSON.stringify(feature); 
			return  JSON.parse(result);
			//获取颜色类别；
			function getColorNames(){
			  var value = "";
			  var hasAttr = false;
			  var colorUl = $("ul.ng-scope");
			  if(colorUl.length >0 ){
			  	hasAttr = true;
			  }
			  var targetColor = $("#colorDropDown .dd-selected");
			  var value = "请到页面上选择颜色";
			  
			  if (targetColor.length > 0){
				value = targetColor.find(".dd-selected-text").text();
			  }
			  
			  if(value == null || value == "" || typeof(value) == "undefined" || value.toLowerCase().indexOf("choose") >= 0 || value.toLowerCase().indexOf("select") >= 0)
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
			var shippingWeightDiv = $('#VPD_Shipping section.panel-body.wag-panel-body.wag-vpd-body-contents');
			if(shippingWeightDiv.length > 0){
				var weightDescription = shippingWeightDiv.text();
				var targetStr = "Shipping Weight (in lbs):";
				var index = weightDescription.indexOf(targetStr);
				if(index != -1){
					prodWeight = weightDescription.substr(index+targetStr.length);
					//alert(prodWeight);
					index = prodWeight.indexOf("\n");
					prodWeight = $.trim(prodWeight.substr(0, index));					
					//alert(prodWeight);
				}
			}
			return prodWeight;
		}

		
		plugin_content.init();
	}
}