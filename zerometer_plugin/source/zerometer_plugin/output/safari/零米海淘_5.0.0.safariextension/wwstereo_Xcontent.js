function localStartX(){
	return function(plugin_content){
		var _this = plugin_content.get_this();

		plugin_content.site_id = 45;
		plugin_content.site_name = "wwstereo";
		plugin_content.direct_mail_china = false;
		plugin_content.country = "US";

		//获取商品搜索框信息
		plugin_content.get_search_box = function(){
			var search_input = $('#store_front_search');
			var search_button = null;//$('button.search');
			return [search_input,search_button];
		}
		plugin_content.get_category = function(){
			var prodcategory = "";
			var categories = $(".breadcrumbs .breadcrumbs__node-group span");
			if(categories.length > 0){
				var length = categories.length;
			  	categories.each(function(index, element){
			  		if(index == 0 || index == (length-1)){
			  			return;
			  		}
					prodcategory += $(element).text() + "|";
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
			$(".product-details__primary-box .color-options .color-options__color-group").change(function(){
				setTimeout(function(){
					_this.price_loaded = false;
					_this.refresh_content();
					_this.refresh_content();
				},1000);
			});
			
		}

		//获取商品名称
		plugin_content.get_name = function(){
			var goods_name = '';
			var title = $(".product-details__title");
			if(title.length > 0){
				goods_name = title.text();
			}
			return goods_name;
		}

		//获取商品图片
		plugin_content.get_img = function(){
			var goods_img = $("li[data-slick-index='0'] img").attr("src");
			return goods_img;
		}

		//获取商品价格
		plugin_content.get_price = function(){
			var prodPrice = 0;
			var targetPriceDiv = $(".expert-cart-sticky__right-col div.product-pricing__main-pricing");
			if(targetPriceDiv.length > 0){
				var targetPriceDescription = targetPriceDiv.find(".product-details__price");
				if(targetPriceDescription.length > 0){
					prodPrice = targetPriceDescription.find(".product-pricing__main-pricing--large").text() + targetPriceDescription.find(".visually-hidden").text() + targetPriceDescription.find(".product-pricing__main-pricing--small").last().text();
				}
				else{
					var jsonInfoDiv = $(".product-detail-container");
					if(jsonInfoDiv.length > 0){
						var jsonInfo = jsonInfoDiv.attr("data-analytics");
						if(jsonInfo !== undefined){
							var jsonInfoValue = JSON.parse(jsonInfo);
							var targetPrice = jsonInfoValue.payload.price;
							if(targetPrice !== undefined){
								prodPrice = targetPrice;
							}
						}
					}
				}
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
			  var colorDiv = $("div.product-details__primary-box-content.product-details__primary-box-content--top .color-options");
			  if(colorDiv.length >0 ){
			  	hasAttr = true;
			  }
			  var colors = colorDiv.find("span.heading--capitalize.heading--pad-left");
			  var value = "请到页面上选择颜色";
			  
			  if (colors.length > 0){
				value = colors.first().text();
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
			if($('#product-description').length > 0){
				var weightObj = '';
				var element = '';

				if($('#product-description tbale').length > 0){
					weightObj = $('#product-description table');
					element = 'tr';
				}else if($('#product-description li').length > 0){
					weightObj = $('#product-description ul');
					element = 'li';
				}
				if(weightObj != ''){
					var length = weightObj.find(element).length;
					for(var i = 0; length > i; i++){
						var weightCon = weightObj.find(element).eq(i).text();
						if(weightCon.indexOf("Weight") >= 0){
							return weightCon;
						}
					}
				}
			}
			return prodWeight;
		}

		//获取商品是否缺货
		plugin_content.out_of_stock = function(){
			/*
			 * 根据product-details__primary-box
			 */
			var msg = $('.product-details__primary-box').text();
			if(msg.indexOf("In Stock")>= 0){
				return false;
			}
			/*
			 * 返回true
			 */
			return true;
		}
		
		plugin_content.init();
	}
}