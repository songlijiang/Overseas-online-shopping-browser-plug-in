function localStartX(){
	return function(plugin_content){
		var _this = plugin_content.get_this();

		plugin_content.site_id = 29;
		plugin_content.site_name = "ninewest";
		plugin_content.direct_mail_china = false;
		plugin_content.country = "US";

		//获取商品搜索框信息
		plugin_content.get_search_box = function(){
			var search_input = $('#query');
			var search_button = $('#searchBtn');
			return [search_input,search_button];
		}
		plugin_content.get_category = function(){
			var prodcategory = "";
			var categories = $("a[class^='gae-click*Product-Page*Breadcrumb']");
			if(categories.length > 0){
				categories.each(function(){
					prodcategory += ($(this).text() + "|");
			  });
			}
			if(prodcategory != ""){
				var beginIndex = prodcategory.indexOf("|");
				var endIndex = prodcategory.lastIndexOf("|");
				if(beginIndex != -1 && endIndex != -1){
					if(endIndex == beginIndex){
						prodcategory = prodcategory.substr(beginIndex);
					}
					else{
						prodcategory = prodcategory.substr(beginIndex, endIndex);
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
			$("span[option-name='size'],span[option-name='width'],img[option-name='color']").click(function(){
				setTimeout(function(){
					_this.price_loaded = false;
					_this.refresh_content();
				},1000);
			});
			
		}

		//获取商品名称
		plugin_content.get_name = function(){
			var goods_name = '';
			goods_name = $("#itemInfo #nameHolder").text();
			return goods_name;
		}

		//获取商品图片
		plugin_content.get_img = function(){
			var goods_img = $("#productGraphics #zoomImgHolder2 img").attr("src");
			return goods_img;
		}

		//获取商品价格
		plugin_content.get_price = function(){
			  var priceText = "";
			  var prodPrice =0.0;
			  var priceDiv = $('div.PDPPriceArea');
			  if(priceDiv.length > 0){
			  	var sellingPrice = $('#PDPSellingPrice');
			  	if(sellingPrice.length > 0){
			  		priceText = sellingPrice.text();
			  		var index = priceText.indexOf("$");
			  		if(index != -1){
			  			prodPrice = priceText.substr(index + 1);
			  		}
			  		/*var clazz = sellingPrice.attr("class");
			  		if(clazz == "notSale"){

			  		}
			  		else if(clazz == "onSale"){

			  		}*/
			  	}
			  }
			  
			  return prodPrice;
			}

		//获取商品特性
		plugin_content.get_features = function(){
			var feature = new Object();
			feature.sizes = getProSizeNames();
			feature.widths = getProWidthNames();
			feature.colors = getColorNames();
			var result =""; 
			result = JSON.stringify(feature); 
			return  JSON.parse(result);
			//获取尺码大小；
			function getProSizeNames(){
			  var value = "";
			  var hasAttr = false;
			  if($("#sizesBlock").length >0 ){
			  	hasAttr = true;
			  }
			  value = $(".sizeChip.available.selectedButton").text();
			  if(value === undefined || $.trim(value) == ""){
			  	value = "请在页面上选择Size";
			  }
			  if(!hasAttr)
			  {
				value = null;
			  }

			  return value;
			}

			//获取宽度Width；
			function getProWidthNames(){
			  var value = "";
			  var hasAttr = false;
			  if($("#widthsBlock").length >0 ){
			  	hasAttr = true;
			  }
			  value = $(".widthChip.available.selectedButton").text();
			  if(value === undefined || $.trim(value) == ""){
			  	value = "请在页面上选择Width";
			  }
			  if(!hasAttr)
			  {
				value = null;
			  }
			  
			  return value;
			}

			//获取颜色类别；
			function getColorNames(){
			  var value = "";
			  var hasAttr = false;
			  if($("#colorsBlock").length >0)
			  {
			  	hasAttr = true;
			  }
			  value = $(".colorChip.selected_true.available").attr("alt");

			  if(value === undefined || $.trim(value) == ""){
			  	value = "请在网页上选择Color";
			  }
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