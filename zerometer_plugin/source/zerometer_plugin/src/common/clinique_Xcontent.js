function localStartX(){
	return function(plugin_content){
		var _this = plugin_content.get_this();

		plugin_content.site_id = 12;
		plugin_content.site_name = 'clinique';
		plugin_content.direct_mail_china = false;
		plugin_content.country = "US";

		//获取商品搜索框信息
		plugin_content.get_search_box = function(){
			var search_input = $('#search');
			var search_button = $('.form-submit');
			return [search_input,search_button];
		}
		plugin_content.get_category = function(){
			
			var targetLIs = $(".breadcrumbs li");
			var prodcategory = "";
			var len = targetLIs.length; 
			for (var i = 0; i < len; i++) { 
			  prodcategory += targetLIs[i].innerText;
			}
			return prodcategory;
		}

		//页面初始化
		plugin_content.content_init = function(){
			//加载插件内容
			_this.append_plugin();
			
			//绑定选择套餐刷新价格事件
			$("div.col2  , div.shade-info").click(function(){
				setTimeout(function(){
					_this.price_loaded = false;
					_this.refresh_content();
				},1000);
			});
			
		}

		//获取商品名称
		plugin_content.get_name = function(){
			var goods_name = '';
			goods_name = $("div.col2.bvflow_hide").find("h1").eq(0).text();
			return goods_name;
		}

		//获取商品图片
		plugin_content.get_img = function(){
			var goods_img = "http://www.clinique.com" + $("img.full.product-img").attr("src");
			return goods_img;
		}

		//获取商品价格
		plugin_content.get_price = function(){
			  var priceText = "";
			  var prodPrice ="0.01";
			  priceText =  $("span.formatted_price").eq(0).text();

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
			//获取尺码大小；
			function getProSizeNames(){
			  var value = "";
			  var hasAttr =false;
			  if($("div.selected_sku").length >0 && $("div.selected_sku").text() != "")
			  {
			  	hasAttr = true;
			  }
			  value = $("div.selected_sku").text();
			  if(value == "")
				value = "请在网站中选择Size";
			  if(!hasAttr)
			  {
			  	value = null;
			  }
			  return value;
			}


			//获取颜色类别；
			function getColorNames(){
			  var value = "";
			  var hasAttr =false;
			  if($("div.shade-info").length >0)
			  {
			  	hasAttr = true;
			  }
			  value = $("div.shade-info").find("strong.shade-info-name").text();

			  if(value == "")
				value = "请在网站中选择颜色";
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
			var weightText = $("div.selected_sku").text();
			var match_arr = weightText.match(/(\d+(\.\d+)?)\s?pound/i);
			if(match_arr && typeof(match_arr[1])!="undefined"){
				prodWeight = match_arr[1];
			}else{
				match_arr = weightText.match(/(\d+(\.\d+)?)\s?kg/i);
				if(match_arr && typeof(match_arr[1])!="undefined"){
					prodWeight = match_arr[1]/PluginConf.lb_rate;
				}else{
					match_arr = weightText.match(/(\d+(\.\d+)?)\s?(:?ounce|oz)/i);
					if(match_arr && typeof(match_arr[1])!="undefined"){
						prodWeight = match_arr[1]/16;
					}
				}
			}
			return prodWeight;
		}
		
		plugin_content.init();
	}
}