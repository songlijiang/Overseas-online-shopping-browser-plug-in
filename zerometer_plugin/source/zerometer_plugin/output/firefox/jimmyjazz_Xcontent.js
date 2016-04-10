function localStartX(){
	// var plugin_content = new PluginContent();
	return function(plugin_content){
		var _this = plugin_content.get_this();

		plugin_content.site_id = 23;
		plugin_content.site_name = 'jimmyjazz';
		plugin_content.direct_mail_china = false;
		plugin_content.country = "US";

		//获取商品搜索框信息
		plugin_content.get_search_box = function(){
			var search_input = $('#search_box_id');
			var search_button = $('.header-search-btn');
			return [search_input,search_button];
		}

		//页面初始化
		plugin_content.content_init = function(){
			//加载插件内容
			_this.append_plugin();
			
		//绑定选择套餐刷新价格事件
		  $(".pidetails").click(function(){
					setTimeout(function(){
						_this.price_loaded = false;
						_this.refresh_content();
				},1000);
	  		});
	  
	 	 
		

		
		}

		//获取商品名称
		plugin_content.get_name = function(){
			var goods_name = $('.product_title').find(".brand").text() + " " + $('.product_title').find(".name").text();
			
			return goods_name;
		}

		//获取商品图片
		plugin_content.get_img = function(){
			var  goods_img = $('.product_image_bottom').find("img").eq(0).attr("src");
			return goods_img;
		}

		//获取商品价格
		plugin_content.get_price = function(){
			var prodPrice = $(".product_price_content").find("span.product_price[itemprop='price']").text();
			//alert(prodPrice);
			prodPrice = prodPrice.replace(/,/g,'.');
			reg = /\$\s?(\d+(\.\d+)?)/i;
			var match_arr = prodPrice.match(reg);
			if(match_arr && typeof(match_arr[1])!="undefined") {
				prodPrice = match_arr[1];
			}
			else {
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
			feature.colors =getColorNames();
			feature.sizes = getSizeCont();
			var result =""; 
			
			return  feature;
			
				function getColorNames(){
				  var value = "";
				  var hasAttr =false;
				  if($(".product_color").length >0)
				  {
				  	hasAttr =true;
				  }
				  value = $(".product_color").find(".pithecolor[itemprop='color']").text();
				  if(value == "")
					value = "请在网页上选择";
				  if(!hasAttr)
				  {
				  	value =null;
				  }
				  return value;
				}
				function getSizeCont(){
				  var value = $(".pisizes").find(".pithesize").text();
				  var hasAttr =false;
				  if($(".pisizes").length >0)
					{
						hasAttr =true;
					}
				  if(value == "")
					value = "请在网页上选择";
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
