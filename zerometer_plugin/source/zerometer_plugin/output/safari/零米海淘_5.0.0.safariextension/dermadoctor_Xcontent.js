function localStartX(){
	// var plugin_content = new PluginContent();
	return function(plugin_content){
		var _this = plugin_content.get_this();

		plugin_content.site_id = 14;
		plugin_content.site_name = 'dermadoctor';
		plugin_content.direct_mail_china = false;
		plugin_content.country = "US";

		//获取商品搜索框信息
		plugin_content.get_search_box = function(){
			var search_input = $('#search');
			var search_button = $("button[title='Go']");
			return [search_input,search_button];
		}

		//页面初始化
		plugin_content.content_init = function(){
			//加载插件内容
			_this.append_plugin();
			
		//绑定选择套餐刷新价格事件
		  $("#pdp-buystack-form").click(function(){
		
					setTimeout(function(){
						_this.price_loaded = false;
						_this.refresh_content();
				},1000);
	  		});
	  
		}

		//获取商品名称
		plugin_content.get_name = function(){
			var goods_name = $('.product-shop').find(".product-name").text();
			
			return goods_name;
		}

		//获取商品图片
		plugin_content.get_img = function(){
			var  goods_img = $('#main-image').find("img").attr("src");
			return goods_img;
		}

		//获取商品价格
		plugin_content.get_price = function(){
			var prodPrice = $('.product-shop').find("span.regular-price").text();
			
			prodPrice = prodPrice.replace(/,/g,'.');
			var reg = /\$\s?(\d+(\.\d+)?)/i;
			var match_arr = prodPrice.match(reg);
			if(match_arr && typeof(match_arr[1])!="undefined") {
				prodPrice = match_arr[1];
			}
			else{
				prodPrice =0;
			}
			return prodPrice;
		}

		//获取商品重量
		plugin_content.get_weight = function(){
			var prodWeight =_this.default_weight;
			return prodWeight;
		}
		plugin_content.get_category = function(){
			var prodcategory = $(".product").text().replace("&","|");
			return prodcategory;
		}
	
		//获取商品特性
		plugin_content.get_features = function(){
			var feature = new Object();
			feature.colors =getColorNames();
			feature.sizes = getClothesSizeNames();
			feature.inseams = getInseamNames();
			feature.waists = getWaistOrSizeNames();
			var result =""; 
			result = JSON.stringify(feature); 
			return  JSON.parse(result);

			function getColorNames(){
			  var colors = $("div.color-name").length;
			  var value = "";
			  var hasAttr = false;
			  if (colors > 0){
			  	hasAttr = true;
				value = $("div.color-name").find("span").text();
			  }
			  if(!hasAttr)
			  {
			  	value =null;
			  }
			  
			  return value;
			}
			function getWaistOrSizeNames(){
			  var value = "";
			  var hasAttr = false;
			  if($("#pdp-buystack-waist-values").length >0)
			  {
			  	hasAttr =true;
			  }
			  value = $("#pdp-buystack-waist-values").find("li.selected a").text();
			  if(value == "")
				value = "请在网页上选择";
			  if(!hasAttr)
			  {
			  	value = null;
			  }
			  return value;
			}
			function getInseamNames(){
			  var value = "";
			  var hasAttr =false;
			  if($("#pdp-buystack-length-values").length >0)
			  {
			  	hasAttr = true;
			  }
			  value = $("#pdp-buystack-length-values").find("li.selected a").text();
			  if(value == "")
				value = "请在网页上选择";
			  if(!hasAttr)
			  {
			  	value = null;
			  }
			  return value;
			}
			function getClothesSizeNames(){
			  var value = "";
			  var hasAttr = false;
			  if( $("#pdp-buystack-size-values").length >0)
			  {
			  	hasAttr = true;	
			  }
			  value = $("#pdp-buystack-size-values").find("li.selected a").text();
			  
			  if(value == "")
				value = "请在网页上选择";
			  if(!hasAttr)
			  {
			  	value = null;
			  }
			  return value;
			}

			
			
		}
		plugin_content.init();
	}
}
