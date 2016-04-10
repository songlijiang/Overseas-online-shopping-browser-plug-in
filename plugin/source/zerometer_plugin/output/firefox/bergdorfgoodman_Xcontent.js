function localStartX(){
	return function(plugin_content){
		var _this = plugin_content.get_this();

		plugin_content.site_id = 9;
		plugin_content.site_name = 'bergdorfgoodman';
		plugin_content.direct_mail_china = false;
		plugin_content.country = "US";
		//获取商品搜索框信息
		plugin_content.get_search_box = function(){
			var search_input = $('#searchInput');
			var search_button = $('#txt_Search');
			return [search_input,search_button];
		}
		plugin_content.get_category = function(){
			var prodcategory = $("ul.breadcrumbs").text();
			
			return prodcategory;
		}

		//页面初始化
		plugin_content.content_init = function(){
			//加载插件内容
			_this.append_plugin();
			
			//绑定选择套餐刷新价格事件
			$(".product-options").click(function(){
				setTimeout(function(){
					_this.price_loaded = false;
					_this.refresh_content();
				},1000);
			});
			
		}

		//获取商品名称
		plugin_content.get_name = function(){
			var goods_name = '';
			goods_name = $("h1[itemprop='name']").text();
			return goods_name;
		}

		//获取商品图片
		plugin_content.get_img = function(){
			var goods_img;
			var sizes = $("div.img-wrap").length;
			$("div.img-wrap").each(function(){
				if($(this).css("opacity") == 1)
				{
					goods_img = $(this).find("img").attr("src");
				}
			});
			return goods_img;
		}

		//获取商品价格
		plugin_content.get_price = function(){
			  var prodPrice = $("p[itemprop ='price']").text();
			 prodPrice = prodPrice.replace(/,/g,'');
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

		//获取商品特性
		plugin_content.get_features = function(){
			var feature = new Object();
			feature.sizes = getProSizeNames();
			feature.colors = getColorNames();
		
			return  feature;
			//获取尺码大小；
			function getProSizeNames(){
			  var value = "";
			  var hasAttr = false;
			  if($("select.sizeSelectBox").length >0)
			  {
			  	hasAttr =true;
			  	var index = $("select.sizeSelectBox")[0].selectedIndex;
				value = $("select.sizeSelectBox").find("option").eq(index).text();
			  }
			  
			  if(!hasAttr)
			  {
				value = null;
			  }

			  return value;
			}


			//获取颜色类别；
			function getColorNames(){
			  var value = "";
			  var hasAttr = false;
			  if($("input.colorSelectBox").length >0)
			  {
			  	hasAttr =true;
			  }
			  value =  $("input.colorSelectBox").attr("value");
			  if(!hasAttr)
			  {
			  	value = null;
			  }
			  return value;
			}
		}

		//获取商品重量
		plugin_content.get_weight = function(){
			var prodWeight = "0.01pound";
			var weightText = "0.01pound";
			if($('div.productCutline').length > 0){
			  var weightObj = $('div.productCutline').eq(0);

			  for(var i = 0; weightObj.find('li').length>i; i++){
				var weightCon = weightObj.find('li').eq(i).text();
				if(weightCon.indexOf("Weighs") >= 0 || weightCon.indexOf("weighs") >= 0 || weightCon.indexOf("weight") >= 0){
				  weightText =  weightCon;
				}
			  }
			}
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
		//获取商品是否缺货
		plugin_content.out_of_stock = function(){
			
			var product_status  = $('.product-status');
			if(product_status.text().indexOf("In Stock")<0){
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