function localStartX(){
	// var plugin_content = new PluginContent();
	return function(plugin_content){
		var _this = plugin_content.get_this();

		plugin_content.site_id = 28;
		plugin_content.site_name = "lids";
		plugin_content.direct_mail_china = false;
		plugin_content.country = "US";

		//获取商品搜索框信息
		plugin_content.get_search_box = function(){
			var search_input = $('#q');
			var search_button = $('.searchbutton').find("");
			return [search_input,search_button];
		}

		//页面初始化
		plugin_content.content_init = function(){
			//加载插件内容
			_this.append_plugin();
			
		//绑定选择套餐刷新价格事件
		  $("#sizes").click(function(){
				setTimeout(function(){
					_this.price_loaded = false;
					_this.refresh_content();
				},1000);
	  		});
	  
		}

		//获取商品名称
		plugin_content.get_name = function(){
			var goods_name = $('#details').find("h1").eq(0).text();
			
			return goods_name;
		}

		//获取商品图片
		plugin_content.get_img = function(){
			var  goods_img =  $('img#pimg').attr("src");
			return goods_img;
		}

		//获取商品价格
		plugin_content.get_price = function(){
			var prodPrice = "$0.0";
			var prodPrice = $('div.price').text();
		    var prodPriceSale = $('div.price').find("span.sale").text();
		    var priceH3 = $('div.price').find("h3").eq(0).text();
		    if(priceH3 != "")
				prodPrice = priceH3;
			  if(prodPriceSale != "")
				prodPrice = prodPriceSale;  
			prodPrice = prodPrice.replace(/,/g,'.');
			var reg = /\$\s?(\d+(\.\d+)?)/i;
			var match_arr = prodPrice.match(reg);
			if(match_arr && typeof(match_arr[1])!="undefined") {
				prodPrice = match_arr[1];
			}
			else{
				prodPrice = 0;
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
			feature.sizes = getSelectableSizes();
			return feature;

			function getSelectableSizes(){
			  var value = "";
			  var hasAttr = false;
			  if($("#sizes").length>0)
			  {
			  	hasAttr = true;
			  	value = $("#sizes").find("a.on").text();
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
