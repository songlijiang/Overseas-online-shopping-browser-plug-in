function localStartX(){
	return function(plugin_content){
		var _this = plugin_content.get_this();

		plugin_content.site_id = 42;
		plugin_content.site_name = "vitaminworld";
		plugin_content.direct_mail_china = false;
		plugin_content.country = "US";

		//获取商品搜索框信息
		plugin_content.get_search_box = function(){
			var search_input = $('input[placeholder="Search"]');
			var search_button = $('input[value="Go"]');
			return [search_input,search_button];
		}
		plugin_content.get_category = function(){
			var targetLinks = $(".breadcrumb li");
			var prodcategory = "";
			var len = targetLinks.length; 
			if(len > 0){
				prodcategory = targetLinks.text();
				if(prodcategory != ""){
					prodcategory = prodcategory.replace(/\//g, "|");
				}
			}
			return prodcategory;

		}

		//页面初始化
		plugin_content.content_init = function(){
			//加载插件内容
			_this.append_plugin();
			
			//绑定选择套餐刷新价格事件
			$(".product-variations ul.swatches li").click(function(){
				setTimeout(function(){
					_this.price_loaded = false;
					_this.refresh_content();
				},500);
			});
		}

		//获取商品名称
		plugin_content.get_name = function(){
			var goods_name = "";
			var brand = $("p.brand-name.fs-14pt").eq(0).text();
			var name = $("h1.product-name.fs-20ptb").eq(0).text();
			goods_name = $.trim(brand) + " " + $.trim(name);
			alert(goods_name);
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
			var productPrice = $('div.product-price');
			if(productPrice.length>0){
				priceText = productPrice.find("span.fs-19ptb").eq(1).text();
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
			var result =""; 
			result = JSON.stringify(feature); 
			return  JSON.parse(result);

			//获取尺码大小；
			function getProSizeNames(){
			  var sizeObj = $(".product-variations");
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
		}

		//获取商品重量
		plugin_content.get_weight = function(){
			var prodWeight = _this.default_weight;//"未知"
			return prodWeight;
		}
		plugin_content.init();
	}
}