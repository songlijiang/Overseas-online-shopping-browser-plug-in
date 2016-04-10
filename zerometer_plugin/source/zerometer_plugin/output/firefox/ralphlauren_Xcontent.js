function localStartX(){
	// var plugin_content = new PluginContent();
	return function(plugin_content){
		var _this = plugin_content.get_this();

		plugin_content.site_id = 34;
		plugin_content.site_name = "ralphlauren";
		plugin_content.direct_mail_china = false;
		plugin_content.country = "US";

		//获取商品搜索框信息
		plugin_content.get_search_box = function(){
			var search_input = $('#search-box-head');
			var search_button = $('#search-submit-head');
			return [search_input,search_button];
		}

		//页面初始化
		plugin_content.content_init = function(){
			//加载插件内容
			_this.append_plugin();
			
		//绑定选择套餐刷新价格事件
		  $(".product-actions").click(function(){
				setTimeout(function(){
					_this.price_loaded = false;
					_this.refresh_content();
				},1000);
	  		});
	  
		}

		//获取商品名称
		plugin_content.get_name = function(){
			var goods_name = $("div [itemprop='name']").text();
			
			return goods_name;
		}

		//获取商品图片
		plugin_content.get_img = function(){

		   var  goods_img = $(".s7flyoutStaticImage").find("img").attr("src");
			return goods_img;
		}

		//获取商品价格
		plugin_content.get_price = function(){
			 var prodPrice = $("div [itemprop='price']").text();
			prodPrice  = prodPrice.replace(/,/g,'.');
			var reg = /\$\s?(\d+(\.\d+)?)/i;
			var match_arr = prodPrice.match(reg);
			if(match_arr && typeof(match_arr[1])!="undefined") {
				prodPrice = match_arr[1];
			}
			else
			{
				prodPrice =0 ;
			}
			return prodPrice;
		}

		//获取商品重量
		plugin_content.get_weight = function(){
				var prodWeight =_this.default_weight;
			return prodWeight;
		}
		plugin_content.get_category = function(){
			var targetSpans = $(".breadcrumbs").find("a");
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
			feature.sizes = getSizesNames();
			var result =""; 
			result = JSON.stringify(feature); 
			return  JSON.parse(result);

			function getColorNames(){
			  var colors = $("div.prod-colors").length;
			  var value = "";
			  var hasAttr = false;
			  if (colors > 0){
			  	hasAttr = true;
				value = $("div.prod-colors").find("span#color-title").text();
			  }
			  if(!hasAttr)
			  {
			  	value =null;
			  }
			  
			  return value;
			}
			function getSizesNames(){
			  var colors = $("div.prod-sizes").length;
			  var value = "";
			  var hasAttr = false;
			  if (colors > 0){
			  	hasAttr = true;
				value = $("div.prod-sizes").find("li.active").text();
			  }
			  if(!hasAttr)
			  {
			  	value =null;
			  }
			  
			  return value;
			}
			
			
		}
		plugin_content.init();
	}
}
