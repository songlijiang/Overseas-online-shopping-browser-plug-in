function localStartX(){
	// var plugin_content = new PluginContent();
	return function(plugin_content){
		var _this = plugin_content.get_this();

		plugin_content.site_id = 6;
		plugin_content.site_name = 'asos';
		plugin_content.direct_mail_china = false;
		plugin_content.country = "US";

		//获取商品搜索框信息
		plugin_content.get_search_box = function(){
			var search_input = $('#globalSearchField');
			var search_button = $('#search button');
			return [search_input,search_button];
		}

		//页面初始化
		plugin_content.content_init = function(){
			//加载插件内容
			_this.append_plugin();
			
		//绑定选择套餐刷新价格事件
		  $("#ctl00_ContentMainPage_ctlSeparateProduct_drpdwnSize , #ctl00_ContentMainPage_ctlSeparateProduct_drpdwnColour").click(function(){
					setTimeout(function(){
						_this.price_loaded = false;
						_this.refresh_content();
				},1000);
	  		});
	  
		}

		//获取商品名称
		plugin_content.get_name = function(){
			var goods_name = $("#ctl00_ContentMainPage_ctlSeparateProduct_lblProductTitle").text();
			
			return goods_name;
		}

		//获取商品图片
		plugin_content.get_img = function(){
			var  goods_img =  $("#ctl00_ContentMainPage_imgMainImage").attr("src");
			return goods_img;
		}

		//获取商品价格
		plugin_content.get_price = function(){
			var prodPrice;
			var priceOrg = $("#ctl00_ContentMainPage_ctlSeparateProduct_lblProductPrice").text();
			  var priceSale = $("#ctl00_ContentMainPage_ctlSeparateProduct_lblProductPreviousPrice").text();
			  
			  if(priceSale != null && priceSale != "" && typeof(priceSale) != "undefined")
				prodPrice =  priceSale;
			  
			  prodPrice = priceOrg;
			prodPrice = prodPrice.replace(/,/g,'.');
			var reg = /\$\s?(\d+(\.\d+)?)/i;
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
			var prodWeight ="0.01";
			return prodWeight;
		}
		plugin_content.get_category = function(){
			var prodcategory = $("#breadcrumbs").text();
			return prodcategory;
		}
	
		//获取商品特性
		plugin_content.get_features = function(){
			var feature = new Object();
			var titleIndex = $(".allProdNames").val();
			feature.colors =getSizeCont(titleIndex);
			feature.sizes = getColorNames(titleIndex);
			return  feature;

			//获取可选尺码数据；
			function getSizeCont(titleIndex){
			  var value = "";
			  var hasAttr =false;
			  if(typeof titleIndex == "undefined")
				titleIndex = 0;
			  
			  if($("#ctl00_ContentMainPage_ctlSeparateProduct_drpdwnSize").length >= 1){
			  	hasAttr = true;
				var index = document.getElementById("ctl00_ContentMainPage_ctlSeparateProduct_drpdwnSize").selectedIndex;
				value = $("#ctl00_ContentMainPage_ctlSeparateProduct_drpdwnSize").find("option").eq(index).text();
			  }else if($("#separates_till_box").length >= 1){
			  	hasAttr =true;
				value = $("#ctl00_ContentMainPage_ctlSeparate" + (Number(titleIndex) + 1) + "_drpdwnSize").find("option:selected").text();
			  }
			 
			  if(value == null || value == "" || typeof(value) == "undefined" || value.toLowerCase().indexOf("select") >= 0)
				value = "请到页面上选择尺码";
			  if(!hasAttr)
			  {
			  	value =null;
			  }
			  return value;
			}
			//获取颜色类别；
			function getColorNames(titleIndex){
			  var value = "";
			  var hasAttr = false;
			  if(typeof titleIndex == "undefined")
				titleIndex = 0;
			  
			  if($("#ctl00_ContentMainPage_ctlSeparateProduct_drpdwnColour").length >= 1){
			  	hasAttr =true;
				var index = document.getElementById("ctl00_ContentMainPage_ctlSeparateProduct_drpdwnColour").selectedIndex;
				value = $("#ctl00_ContentMainPage_ctlSeparateProduct_drpdwnColour").find("option").eq(index).text();
			  }else if($("#separates_till_box").length >= 1){
			  	hasAttr =true;
				value = $("#ctl00_ContentMainPage_ctlSeparate" + (Number(titleIndex) + 1) + "_drpdwnColour").find("option:selected").text();
			  }
			 
			  if(value == null || value == "" || typeof(value) == "undefined" || value.toLowerCase().indexOf("select") >= 0)
				value = "请到页面上选择颜色";
			  if(!hasAttr)
			  {
			  	value =null;
			  }
			  return value;
			}
			
			
		}
		//获取商品是否缺货
		plugin_content.out_of_stock = function(){
			/*
			* 根据加入购物车按钮是否可用
			*/
			var add_to_cart_button = $('button.disabled');
			if(add_to_cart_button.length>0){
				return true;
			}
			/*
			* 返回true
			*/
			return false;
		}
		plugin_content.init();
	}
}
