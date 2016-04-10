function localStartX(){
	// var plugin_content = new PluginContent();
	return function(plugin_content){
		var _this = plugin_content.get_this();

		 plugin_content.site_id = 37;
		plugin_content.site_name = "skechers";
		plugin_content.direct_mail_china = false;
		plugin_content.country = "US";

		//获取商品搜索框信息
		plugin_content.get_search_box = function(){
			var search_input = $('#search-autocomplete');
			var search_button = $('.fa-search');
			return [search_input,search_button];
		}

		//页面初始化
		plugin_content.content_init = function(){
			//加载插件内容
			_this.append_plugin();
			
		//绑定选择套餐刷新价格事件
		  $("._biomega").click(function(){
				setTimeout(function(){
					_this.price_loaded = false;
					_this.refresh_content();
				},1000);
	  		});
	  
		}

		//获取商品名称
		plugin_content.get_name = function(){
			var goods_name = $('.product-title').text();
			
			return goods_name;
		}

		//获取商品图片
		plugin_content.get_img = function(){
			var  goods_img =   $('.product-image-wrapper').find("img").attr("src");
			return goods_img;
		}

		//获取商品价格
		plugin_content.get_price = function(){
			var prodPrice = $(".price-final").text();
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
			var targetSpans = $(".breadcrumbs ").find("a");
			var prodcategory = "";
			var len = targetSpans.length; 
			for (var i = 0; i < len; i++) { 
				if(i == len-1){
				  prodcategory += targetSpans[i].innerText;
				}
				else{
				  prodcategory += targetSpans[i].innerText + "|";
				}	  
			}
			return prodcategory;
		}
	
		//获取商品特性
		plugin_content.get_features = function(){
			var feature = new Object();
			feature.colors =getColorNames();
			feature.sizes = getSizeNames();
			feature.widthd = getWidthNames();
			return  feature;

			function getColorNames(){
			  var colors = $(".js-color").length;
			  var value = "";
			  var hasAttr = false;
			  if (colors > 0){
			  	hasAttr = true;
				value = $(".js-color").text();
			  }
			  if(!hasAttr)
			  {
			  	value =null;
			  }
			  
			  return value;
			}
			function getSizeNames(){
			  var value = "";
			  var hasAttr = false;
			  if($(".js-selected-size").length >0)
			  {
			  	hasAttr =true;
			  }
			  value = $(".js-selected-size").text();
			  if(value == "")
				value = "请在网页上选择";
			  if(!hasAttr)
			  {
			  	value = null;
			  }
			  return value;
			}
			function getWidthNames(){
			  var value = "";
			  var hasAttr =false;
			  if($(".js-selected-width").length >0)
			  {
			  	hasAttr = true;
			  }
			  value = $(".js-selected-width").text();
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
