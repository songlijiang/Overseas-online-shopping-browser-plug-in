function localStartX(){
	// var plugin_content = new PluginContent();
	return function(plugin_content){
		var _this = plugin_content.get_this();

		plugin_content.site_id = 31;
		plugin_content.site_name = "oldnavy";
		plugin_content.direct_mail_china = false;
		plugin_content.country = "US";

		//获取商品搜索框信息
		plugin_content.get_search_box = function(){
			var search_input = $('#large-search');
			var search_button = $('.search--submit-button');
			return [search_input,search_button];
		}

		//页面初始化
		plugin_content.content_init = function(){
			//加载插件内容
			_this.append_plugin();
			
		//绑定选择套餐刷新价格事件
		  $("#swatchContent").click(function(){
				setTimeout(function(){
					_this.price_loaded = false;
					_this.refresh_content();
				},1000);
	  		});
	  
		}

		//获取商品名称
		plugin_content.get_name = function(){
			var goods_name = $("#productNameText").find("span.productName").text();
			
			return goods_name;
		}

		//获取商品图片
		plugin_content.get_img = function(){
			var  goods_img =  $("#product_image").attr("src");
			return goods_img;
		}

		//获取商品价格
		plugin_content.get_price = function(){
			  var prodPrice = $("span #priceText").text();
			  var priceSale = $("span #priceText").find("span .salePrice").text();
			  
			  if(priceSale != "" && typeof(priceSale) != "undefined")
				prodPrice = priceSale;
			
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
			var prodcategory = "";
			$("div#divisionContainer").find("a").each(function(){
				if(typeof($(this).attr("class")) != "undefined")
				{	
					if( $(this).attr("class").indexOf("_selected") >=0)
					{
						prodcategory = $(this).find("img").attr("alt");
					}
				}
			});
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
			  var value = ""
			  var hasAttr =false;
			  if($("div#textColor").length >0)
			  {
			  	hasAttr = true;
			  	value = $("div#textColor").find("div.swatchLabelName").text() + "";

			  }

			  if(value.indexOf(":") > 0)
				value = value.split(":")[1];

			  if(value == "")
				value = "请在网站中选择颜色";
			  if(!hasAttr)
			  {
			  	value =null;
			  }
			  return value;
			}

		/*********************************获取当前选中尺码**************************************/
			function getSelectableSizes(){
			  var value = ""
			  var hasAttr = false;
			  if($("#textSizeDimension1").length >0)
			  {
			  	hasAttr =true;
			  	value = $("#textSizeDimension1").find("span.swatchLabelName").text();
			  }
			 
			  
			  if(value == "")
				value = "请在网站中选择尺码";
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
			  if($("#currentWidth").length >0)
			  {
			  	hasAttr =true;
			  	value = $("#currentWidth").text();
			  } 
			
			  
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
