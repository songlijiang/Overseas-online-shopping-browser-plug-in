function localStartX(){
	// var plugin_content = new PluginContent();
	return function(plugin_content){
		var _this = plugin_content.get_this();

		plugin_content.site_id = 44;
		plugin_content.site_name = "windeln";
		plugin_content.direct_mail_china = false;
		plugin_content.country = "DE";

		//获取商品搜索框信息
		plugin_content.get_search_box = function(){
			var search_input = $('#searchInput');
			var search_button = $('.searchImage');
			return [search_input,search_button];
		}

		//页面初始化
		plugin_content.content_init = function(){
			//加载插件内容
			_this.append_plugin();
			
			//绑定选择套餐刷新价格事件
		  	$("#product-options").find(".product-option").click(function(){
				setTimeout(function(){
					_this.price_loaded = false;
					_this.refresh_content();
				},1000);
	  		});
	  
	 	   	$("#product-selection").find(".product-row").click(function(){
				setTimeout(function(){
					_this.price_loaded = false;
					_this.refresh_content();
				},1000);
	 	 	});
		}

		//获取商品名称
		plugin_content.get_name = function(){
			var goods_name = $(".product-title").text();
			
			return goods_name;
		}

		//获取商品图片
		plugin_content.get_img = function(){
			var  goods_img = $("#product-selection .selected").find(".wrapper img").attr("src");
			return goods_img;
		}

		//获取商品价格
		plugin_content.get_price = function(){
			var prodPrice = $("#product-selection .selected").find("#normal-price").text();
			//alert(prodPrice);
			prodPrice = prodPrice.replace(/,/g,'.');
			reg = /(\d+(\.\d+)?)\s?\€/i;
			var match_arr = prodPrice.match(reg);
			if(match_arr && typeof(match_arr[1])!="undefined") {
				prodPrice = match_arr[1];
			}
			else {
				prodPrice = 0;
			}
			return prodPrice;
		}

		//获取商品重量
		plugin_content.get_weight = function(){
			var prodWeight = _this.default_weight;
			return prodWeight;
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
	
		//获取商品特性
		plugin_content.get_features = function(){
			var feature = new Object();
			feature.styles =getStyleNames();
			var result =""; 
			result = JSON.stringify(feature); 
			return  JSON.parse(result);
			
			function getStyleNames(){
			  var value = "";
			   var hasAttr = false;
			   if($("#product-options .selected").length > 0)
			   {
			   	hasAttr =true;
			   }
			  value = $("#product-options .selected").find("div.radioname").text();
			  if(!hasAttr)
				value = null;
			  return value;
			}

			
			
		}
		plugin_content.init();
	}
}
