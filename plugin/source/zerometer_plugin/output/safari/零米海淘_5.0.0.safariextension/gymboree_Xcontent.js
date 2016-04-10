function localStartX(){
	// var plugin_content = new PluginContent();
	return function(plugin_content){
		var _this = plugin_content.get_this();

		plugin_content.site_id = 22;
		plugin_content.site_name = 'gymboree';
		plugin_content.direct_mail_china = false;
		plugin_content.country = "US";


		//获取商品搜索框信息
		plugin_content.get_search_box = function(){
			var search_input = $('#search');
			var search_button = $('.input-group-btn').find("button.btn-default");
			return [search_input,search_button];
		}

		//页面初始化
		plugin_content.content_init = function(){
			//加载插件内容
			_this.append_plugin();
			
		//绑定选择套餐刷新价格事件
		  $("#pdp-product-color , #pdp-product-size").click(function(){
					setTimeout(function(){
						_this.price_loaded = false;
						_this.refresh_content();
				},1000);
	  		});
	  
		}

		//获取商品名称
		plugin_content.get_name = function(){
		 var prodName = $("#p-title").text();
		  if(typeof(prodName) == "undefined" || prodName.trim() == ""){
		  	prodName = $("#pdp-product-title").text();
		  }
			
			return prodName;
		}

		//获取商品图片
		plugin_content.get_img = function(){
		  var prodImage = $("#p-picture").attr("src");
		  if(typeof(prodImage) == "undefined" || prodImage.trim() == ""){

		  	prodImage = $(".s7staticimage img").first().attr("src");
		  }
			return prodImage;
		}

		//获取商品价格
		plugin_content.get_price = function(){
			var prodPrice = $("#reg-price-s").find("span.reg-price-dollars").text();
			  if(typeof(prodPrice) == "undefined" || prodPrice.trim() == ""){
			  	prodPrice = $("#pdp-price .regular-price").text();
			  }
			  var priceOnSale = $("#sale-price-s").find("span.reg-price-dollars").text();
			  if(typeof(priceOnSale) == "undefined" || priceOnSale.trim() == ""){
			  	priceOnSale = $("#pdp-price .sale-price").text();
			  }

			  var priceNow = $("#b-price").find("span.reg-price-dollars").text();
			  
			  if(priceOnSale != "" && typeof(priceOnSale) != "undefined")
				prodPrice = priceOnSale;
				
			  if(priceNow != "" && typeof(priceNow) != "undefined")
				prodPrice = priceNow;
			prodPrice = prodPrice.replace(/,/g,'.');
			reg = /\$\s?(\d+(\.\d+)?)/i;
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
			var targetSpans = $("#pdp-breadcrumbs").find("a");
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
			feature.sizes = getSelectableSizes();
			feature.widths = getSelectedWidth();
			
			return  feature;

			/***************************************获取颜色类别**********************************/
			function getColorNames(){
			  var value = "";
			  var hasAttr =false;
			  if( $("#p-text-b").length >0 || $("#pdp-current-color").length>0)
			  {
			  	hasAttr =true;
			  }
			  value = $("#p-text-b").text() + "";
			  if(typeof(value) == "undefined" || value.trim() == ""){
			  	value = $("#pdp-current-color").text();
			  }
			  if(typeof(value) == "undefined" || value.trim() == "")
				value = "请在网站中选择颜色";
			  if(!hasAttr)
			  {
			  	value =null;
			  }
			  return value;
			}
			/*********************************获取当前选中尺码**************************************/
			function getSelectableSizes(){
			  var value = "";
			  var hasAttr =false;
			  if($("#size-b").length>0 || $("#pdp-product-size").length>0)
			  	{
			  		hasAttr =true;
			  	}
			  value = $("#size-b").text();
			  if(typeof(value) == "undefined" || value.trim() == ""){
			  	value = $("#pdp-product-size label.active").text();
			  }
			  if(typeof(value) == "undefined" || value.trim() == "")
				value = "请在网站中选择Size";
			  if(!hasAttr)
			  {
			  	value =null;
			  }
			  return value;
			}
			/***********************************获取当前width*************************************/
			function getSelectedWidth(){
			  var value = ""
			  var hasAttr =false;
			  if($("#currentWidth").length>0)
			  	{
			  		hasAttr =true;
			  	}
			  value = $("#currentWidth").text();
			  
			  if(value == "")
				value = "请在网站中选择Width";
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
