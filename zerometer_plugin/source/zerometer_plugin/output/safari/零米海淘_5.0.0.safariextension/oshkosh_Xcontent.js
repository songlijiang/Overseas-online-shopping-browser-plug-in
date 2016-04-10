function localStartX(){
	// var plugin_content = new PluginContent();
	return function(plugin_content){
		var _this = plugin_content.get_this();

		plugin_content.site_id = 32;
		plugin_content.site_name = "oshkosh";
		plugin_content.direct_mail_china = false;
		plugin_content.country = "US";

		//获取商品搜索框信息
		plugin_content.get_search_box = function(){
			var search_input = $('#searchinput');
			var search_button = $('.btn_search');
			return [search_input,search_button];
		}

		//页面初始化
		plugin_content.content_init = function(){
			//加载插件内容
			_this.append_plugin();
			
		//绑定选择套餐刷新价格事件
		  $(".product-variations ").click(function(){
				setTimeout(function(){
					_this.price_loaded = false;
					_this.refresh_content();
				},1000);
	  		});
	  
		}

		//获取商品名称
		plugin_content.get_name = function(){
			var goods_name = $("h1.product-name[itemprop='name']").text();
			
			return goods_name;
		}

		//获取商品图片
		plugin_content.get_img = function(){
			var  goods_img = $("img.primary-image[itemprop='image']").attr("src");  
			return goods_img;
		}

		//获取商品价格
		plugin_content.get_price = function(){
			var prodPrice = "$0.0";
			if($("span.price-sales[itemprop='price']").length>0)
			{
				prodPrice = $("span.price-sales[itemprop='price']").text();
			}
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
			var targetSpans = $(".breadcrumb").find("a");
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
	
		//获取商品特性
		plugin_content.get_features = function(){
			var feature = new Object();
			feature.colors =getColorNames(0);
			feature.sizes = getSelectableSizes(0);
			return  feature;

			function getColorNames(index) {
			  var options = "";
			  var hasAttr = false;
			 
				var sizes = $("ul.swatches.color").length;
				
				if(sizes > 0){
					hasAttr = true;
					options =  $("ul.swatches.color").find("li[class=selected]").text();
				  }
			  if(!hasAttr)
			  {
			  	options =null;
			  }

			  return options;
			}
			
			function getSelectableSizes(index) {
			
			  var options = "";
			  var hasAttr = false;
			 
				var sizes = $("ul.swatches.size").length;
				
				if(sizes > 0){
					hasAttr = true;
					options =  $("ul.swatches.size").find("li[class=selected]").text();
				  }
			  if(!hasAttr)
			  {
			  	options =null;
			  }

			  return options;
			}


			
			
		}

		//获取商品是否缺货
		plugin_content.out_of_stock = function(){
			/*
			* 根据availability-msg
			*/
			var availability = $('.availability-msg');
			if(availability.length>0 && availability.text().indexOf("In Stock") >=0){
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
