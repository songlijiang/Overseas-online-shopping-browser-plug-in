function localStartX(){
	// var plugin_content = new PluginContent();
	return function(plugin_content){
		var _this = plugin_content.get_this();

		plugin_content.site_id = 23;
		plugin_content.site_name = 'imomoko';
		plugin_content.direct_mail_china = false;
		plugin_content.country = "US";

		//获取商品搜索框信息
		plugin_content.get_search_box = function(){
			var search_input = $('#search');
			var search_button = $('#hiddenbutton');
			return [search_input,search_button];
		}

		//页面初始化
		plugin_content.content_init = function(){
			//加载插件内容
			_this.append_plugin();
			
		//绑定选择套餐刷新价格事件
		  $("#pdp-buystack-form").click(function(){
		  	alert("click");
					setTimeout(function(){
						_this.price_loaded = false;
						_this.refresh_content();
				},1000);
	  		});
	  
		}

		//获取商品名称
		plugin_content.get_name = function(){
			if($(".product-left-clunm h2").length>0){
				return $(".product-left-clunm h2").text();
			  }else if($('.category-view .dealconttop')){
				var nameObj=$('.category-view .dealconttop');
				for(var i = 0; nameObj.children('div.deal').length > i; i++){
				  if( nameObj.children('div.deal').eq(i).attr('style') == "display: block;"){
					return nameObj.children('div.deal').eq(i).find('span.deal-pro-name').text();
				  }
				}
			  }
		}

		//获取商品图片
		plugin_content.get_img = function(){
			var  goods_img =  $("#main-image-div_1 img").attr("src");
			return goods_img;
		}

		//获取商品价格
		plugin_content.get_price = function(){
			var prodPrice = "$0.0";
			 if($("#product-form-area p.special-price").length > 0){
				prodPrice = $("#product-form-area p.special-price span.price").eq(0).text();
			  }else if($("#product-form-area .regular-price span").length > 0){
				prodPrice = $("#product-form-area .regular-price span").eq(0).text();
			  }else if($('.category-view .dealconttop').length > 0){
				var priceObj=$('.category-view .dealconttop');
				for(var i = 0; priceObj.children('div.deal').length > i; i++){
				  if( priceObj.children('div.deal').eq(i).attr('style') == "display: block;"){
					prodPrice =priceObj.find('div.deal .price_tag_inner .amount').eq(i).text();
				  }
				}
			  }
			  else if($(".price-as-configured").length > 0){
				prodPrice =$(".price-as-configured").eq(0).find('.full-product-price').text();
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
			return  feature;

			//获取颜色类别；
			function getColorNames(){
			  var colors = $("#option272").children("span").length;
			  var hasAttr =false;
			  var value;
			  if (colors > 0){
			  	hasAttr =true;
				if($("#option272").children("span").text() == 'Choose an Option...'){
				  value = "请到页面上选择颜色";
				}else{
				  value = $("#option272").children("span").text();
				}
			  }
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
			* 根据is_instock
			*/
			var is_instock = $('#is_instock').find("span").text();
			if(is_instock.indexOf("In stock") >=0){
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
