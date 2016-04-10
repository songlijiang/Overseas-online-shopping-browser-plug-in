function localStartX(){
	return function(plugin_content){
		var _this = plugin_content.get_this();

		plugin_content.site_id = 11;
		plugin_content.site_name = 'carters';
		plugin_content.direct_mail_china = false;
		plugin_content.country = "US";

		//获取商品搜索框信息
		plugin_content.get_search_box = function(){
			var search_input = $('#searchinput');
			var search_button = $('.btn_search');
			return [search_input,search_button];
		}
		plugin_content.get_category = function(){
			 var prodcategory = "";
			 var targetLIs = $(".breadcrumb ul li");
			 var len = targetLIs.length; 
			  for (var i = 0; i < len; i++) {
				if(i == 0 || i == 1){
				  continue;
				}
				else{
				  if(i == len-1){
					prodcategory += targetLIs[i].innerText;
				  }
				  else{
					prodcategory += targetLIs[i].innerText + "|";
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
			$(".product-variations").click(function(){
				setTimeout(function(){
					_this.price_loaded = false;
					_this.refresh_content();
				},2000);
			});
			
			
		}

		//获取商品名称
		plugin_content.get_name = function(){
			var goods_name = '';
			goods_name = $("h1.product-name[itemprop='name']").text();
			return goods_name;
		}

		//获取商品图片
		plugin_content.get_img = function(){
			var goods_img = $("img.primary-image[itemprop='image']").attr("src");
			return goods_img;
		}

		//获取商品价格
		plugin_content.get_price = function(){
			  var priceText = "";
			  var prodPrice ="0.01";
			  priceText =  $("#product-content").find("span.price-sales[itemprop='price']").text();

			    priceText = priceText.replace(/,/g,'');
				var match_arr = priceText.match(/\$(\d+(\.\d+)?)/i);
				if(match_arr && typeof(match_arr[1])!="undefined"){
					prodPrice = match_arr[1];
				}else{
					prodPrice = 0;
				}
				return prodPrice;
		}

		//获取商品特性
		plugin_content.get_features = function(){
			var feature = new Object();
			feature.sizes =getProSizeNames();
			feature.colors = getColorNames();
			var result =""; 
			result = JSON.stringify(feature); 
			return  JSON.parse(result);

			function getColorNames() {
			  var value = "";
			  var hasAttr = false;
			  if($("ul.swatches.color").length >0 )
			  {
			  	hasAttr = true;
			  }
			  value = $("ul.swatches.color").find("li.selectedColor").text();
			  if(value == "请在网页上选择颜色")
				value = "";
			  if(!hasAttr)
			  {
			  	value = null;
			  }
			  return value;
			}

			function getProSizeNames() {
			  var value = "";
			  var hasAttr = false;
			  if($("ul.swatches.size").length >0)
			  {
			  	hasAttr = true;
			  }
			  value = $("ul.swatches.size").find("li.selected").find("a").text();
			  if(value == "请在网页上选择尺码")
				value = "";
			  if(!hasAttr)
			  {
			  	value =null;
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
