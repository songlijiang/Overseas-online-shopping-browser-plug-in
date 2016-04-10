function localStartX(){
	return function(plugin_content){
		var _this = plugin_content.get_this();

		 plugin_content.site_id = 39;
		plugin_content.site_name = "swarovski";
		plugin_content.direct_mail_china = false;
		plugin_content.country = "US";

		//获取商品搜索框信息
		plugin_content.get_search_box = function(){
			var search_input = $('input[name="search_query_keyword"]');
			var search_button = $('input[alt="Search"]');
			return [search_input,search_button];
		}
		plugin_content.get_category = function(){

			var prodcategory = "";
			var categories = $(".breadcrumbs a");
			if(categories.length > 0){
				var cat_length = categories.length;
			  	categories.each(function(index, element){
			  		if(index == 0){
			  			return;
			  		}
					else{
						prodcategory += $(element).text() + "|";
					}
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
			$("div.variants ul.clearfix li, #variation-mirror ul li").click(function(){
				setTimeout(function(){
					_this.price_loaded = false;
					_this.refresh_content();
				},500);
			});
		}

		//获取商品名称
		plugin_content.get_name = function(){
			var goods_name = "";
			var productNameDiv = $("div.product-info").find("h1");
			if(productNameDiv.length > 0){
				goods_name = productNameDiv.text();
			}
			return goods_name;
		}

		//获取商品图片
		plugin_content.get_img = function(){
			var goods_img = "";
			var imgDiv = $(".prod-altviews li.active a img");
			if(imgDiv.length > 0){
				goods_img = imgDiv.attr("src");
			}
			return goods_img;
		}

		//获取商品价格
		plugin_content.get_price = function(){
			var prodPrice = 0;
			var priceText = "";

			var prodPriceDiv = $("div.product-info").find("p.price");
			if(prodPriceDiv.length > 0){
				var priceNewDiv = prodPriceDiv.find("span.new");
				if(priceNewDiv.length > 0){
					priceText = priceNewDiv.text();
				}
				else{
					priceText = prodPriceDiv.text();
				}
			}
			if(priceText != "") {
                priceText = $.trim(priceText);
                priceText = priceText.replace("\," , "");
                var index = priceText.indexOf("$");
                if (index != -1) {
                    prodPrice = priceText.substr(index + 1);
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
			  var sizeObj = $("#variation-mirror");
			  var hasAttr = false;
			  if(sizeObj.length >0)
			  {
			  	hasAttr = true;
			  }
			  var sizeName = sizeObj.find("a.handle").find("span").eq(0).text();
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
			  var colorObj = $(".clearfix");
			  var hasAttr = false;
			  if(colorObj.length >0)
			  {
			  	hasAttr = true;
			  }
			  var colorName = colorObj.find("li.active a img").attr("alt");
			  if(colorName.length > 0){
			  	var index = colorName.indexOf(",");
			  	if(index != -1){
			  		colorName = colorName.substr(index+1);
			  	}
			  }
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
        //获取商品是否缺货
        plugin_content.out_of_stock = function(){
            /*
             * 根据product-not-available
             */
            var available = $('.product-not-available').text();
            if( $('.product-not-available').length>0 && available.lastIndexOf("缺货") >=0){
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