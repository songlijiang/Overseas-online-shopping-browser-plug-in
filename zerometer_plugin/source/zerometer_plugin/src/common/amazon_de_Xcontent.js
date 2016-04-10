function localStartX(){
	return function(plugin_content){
		var _this = plugin_content.get_this();

		plugin_content.site_id = 3;
		plugin_content.site_name = 'amazon_de';
		plugin_content.direct_mail_china = false;
		plugin_content.country = "DE";

		//»ñÈ¡ÉÌÆ·ËÑË÷¿òÐÅÏ¢
		plugin_content.get_search_box = function(){
			var search_input = $('#globalSearchField');
			var search_button = $('#search button');
			return [search_input,search_button];
		}
		plugin_content.get_category = function(){
			var prodcategory = $(".a-horizontal.a-size-small").text().replace(/\›/g,"|").replace(/\s+/g,"");
			return prodcategory;
		}
		plugin_content.content_init = function(){
			//¼ÓÔØ²å¼þÄÚÈÝ
			_this.append_plugin();
			//绑定选择套餐刷新价格事件
			$("#alohaVariations_feature_div , #twister_feature_div").click(function(){
				setTimeout(function(){
					_this.price_loaded = false;
					_this.refresh_content();
				},1000);
			});
		}

		plugin_content.get_name = function(){
			if($("#productTitle").length > 0)
				return $("#productTitle").text();
			  
			  if($("#btAsinTitle").length > 0)
				return $("#btAsinTitle").text();
			  
			  return "";
		}

		plugin_content.get_img = function(){
			if($("#kib-ma-container-0").find("img").length > 0)
				return $("#kib-ma-container-0").find("img").eq(0).attr("src");
			  
			  if($("#landingImage").length > 0)
				return $("#landingImage").attr("data-old-hires");
			  
			  return "";
		}

		plugin_content.get_price = function(){
			 var currency = "EUR";
			 var priceText = 'EUR 0.00';
			 var priceOrg = $("#priceblock_ourprice");
			var priceSale = $("#priceblock_saleprice");
			var priceDeal = $("#priceblock_dealprice");

			  if(priceOrg.length >0)
			  {
			  	priceText = priceOrg.text();
			  }
			  else if(priceSale.length >0)
			  {
			  	priceText = priceSale.text();
			  }
			  else if(priceDeal.length >0)
			  {
			  	priceText = priceDeal.find("span").eq(0).text();
			  }
			  else if($("#buyingPriceValue").length > 0){
				priceText = $("#buyingPriceValue").text();
				
			  }

			  else if($("#actualPriceValue").length > 0){
				priceText = $("#actualPriceValue").find("b.priceLarge");
				
			  }
			  
			  else if($("#priceBlock").length > 0){
				priceText = $("#priceBlock").find("b.priceLarge").text();
				
			  }
			  
			  else if($(".inlineBlock-display").length>0){
				priceText = $("#buyNewSection .inlineBlock-display span.offer-price").text();
			  }

			  	priceText = priceText.replace(/,/g,'.');
				var reg = /EUR\s(\d+(\.\d+)?)/i;
				var match_arr = priceText.match(reg);
				if(match_arr && typeof(match_arr[1])!="undefined") {
					priceText = match_arr[1];
				}
				else{
					priceText =0;
				}
				return priceText;
			  
			
		}

		plugin_content.get_weight = function(){
			var prodWeight = _this.default_weight;
			var	weightText = "0.01 pound";

			if($('#detail_bullets_id').length > 0){
		  	var weightObj = $('#detail_bullets_id');

			  for(var i = 0; weightObj.find('li').length > i ;i++){
				var weightCon = weightObj.find('li').eq(i).text();
				if(weightCon.indexOf("Produktgewicht inkl. Verpackung") >= 0){
				  weightText = weightCon;
				  break;
				}
			  }
			}else if($('#prodDetails .col2').length > 0){
			  var weightObj = $('#prodDetails .col2');
			  for(var i = 0; weightObj.find('tr').length > i; i++){
				var weightCon = weightObj.find('tr').eq(i).text();
				if(weightCon.indexOf("Produktgewicht inkl. Verpackung") >= 0){
				  weightText = weightCon;
				  break;
				}
			  }
			}
			weightText = weightText.replace(/,/g,'.');
			var match_arr = weightText.match(/(\d+(\.\d+)?)\s?pound/i);
			if(match_arr && typeof(match_arr[1])!="undefined"){
				prodWeight = match_arr[1];
			}else{
				match_arr = weightText.match(/(\d+(\.\d+)?)\s?[k|K]g/i);
				if(match_arr && typeof(match_arr[1])!="undefined"){
					prodWeight = match_arr[1]/PluginConf.lb_rate;
				}else{
					match_arr = weightText.match(/(\d+(\.\d+)?)\s?(:?ounce|oz)/i);
					if(match_arr && typeof(match_arr[1])!="undefined"){
						prodWeight = match_arr[1]/16;
					}
					else{
						match_arr = weightText.match(/(\d+(\.\d+)?)\s?g/i);
						if(match_arr && typeof(match_arr[1])!="undefined"){
						prodWeight = match_arr[1]/1000/PluginConf.lb_rate;
						}	
					}
				}
			}
			return prodWeight;
		}


		plugin_content.get_features = function(){
			var feature = new Object();
			feature.sizes =getProSizeNames();
			feature.colors = getColorNames();
			feature.flavors = getFlavorNames();
			feature.styles = getStyleNames();
			var result =""; 
			result = JSON.stringify(feature); 
			return  JSON.parse(result);

			//获取商品Size：
			function getProSizeNames(){
			  var sizes_0 = $("select#native_dropdown_selected_size_name").find("option").length;
			  var sizes_1 = $("#variation_size_name").find("div.text").length;
			  var sizes_2 = $("#evdd-button-size_name").length;
			  var sizes_3 = $("#selected_configuration").length;
			  var sizes_4 = $("#selected_connectivity_technology").length;
			  var sizes_5 = $("#variation-storage").length;
			  var sizes_6 = $("#selected_digital_storage_capacity").length;
			  var value = "";
			  var hasAttr = false;
			  if(sizes_0 >0 
			  	|| sizes_1 >0
			  	|| sizes_2 >0
			  	|| sizes_3 >0
			  	|| sizes_4 >0
			  	|| sizes_5 >0
			  	|| sizes_6 >0)
			  {
			  	hasAttr = true;
			  }
			  if(sizes_0 > 0){
				var optionValue = $("#native_dropdown_selected_size_name").val();
				value = $("option[value='" + optionValue +"']").text();
			  }
			  else if(sizes_1 > 0){
				value = $("#variation_size_name").find("span.selection").text();
			  }
			  else if(sizes_2 > 0){
				value = $("#evdd-button-size_name").find("button.a-button-text").text();
			  }
			  else if(sizes_3 > 0 && sizes_4 <= 0)
				value = $("#selected_configuration").find(".variationLabel").text();
			  else if(sizes_4 > 0 && sizes_3 <= 0)
				value = $("#selected_connectivity_technology").find(".variationLabel").text();
			  else if (sizes_4 > 0 && sizes_3 > 0){
				value = $("#selected_configuration").find(".variationLabel").text() + "/" + $("#selected_connectivity_technology").find(".variationLabel").text();
				if(sizes_6 > 0)
				  value = value + "/" + $("#selected_digital_storage_capacity").find(".variationLabel").text();
			  }
			  else if(sizes_5 >0)
				value = $("#variation-storage .twisterSwatchSelected").text();
			  
			  if(value == "" || value.toLowerCase().indexOf("select") >= 0)
				value = "请到页面上选择尺码";
				
			  if(!hasAttr)
			  {
			  	value =null;
			  }	
			  return value;
			}

			//获取颜色类别；
			function getColorNames(){
				var hasAttr =false;

			  if($("#variation_color_name").length>0){
			  	hasAttr = true;
				var colors = $("#variation_color_name").find("span.selection").length;
				var value = "";
				if (colors > 0){
				  value = $("#variation_color_name").find("span.selection").text();
				}
				if(value == "")
				  value = "请到页面上选择颜色";
			  }
			  if($("#variation-color").length>0){
			  	hasAttr = true;
				var colors = $("#variation-color").length;
				var value = "";
				if (colors > 0){
				  value = $("#variation-color .twisterSwatchSelected").text();
				}
				if(value == "")
				  value = "请到页面上选择颜色";
			  }

			  if(!hasAttr)
			  {
			  	value = null;
			  }
			  return value;
			}

			//获取商品囗味：
			function getFlavorNames(){
			  var flavor = $("#evdd-button-flavor_name").length;
			  var value = "";
			  var hasAttr = false;
			  
			  if (flavor > 0){
			  	hasAttr = true;
				value = $("#evdd-button-flavor_name").find("button.a-button-text").text();
			  }
			  
			  if(value == "")
				value = "请到页面上选择Flavor";
			  if(!hasAttr)
			  {
			  	value = null;
			  }
			  return value;
			}

			//获取商品Style：
			function getStyleNames(){
			  var value = "";
			  var hasAttr =false;
			  if($("#variation_style_name").length >0)
			  {
			  	hasAttr =true;
			  	 value = $("#variation_style_name").find(".selection").text();
			  	 if(value == "")
			  	 {
			  	 	 value = $("#variation_style_name").find(".dropdownSelect").text();
			  	 }
			  	
			  }
			  if($("#variation_transaction_type").length >0)
			  {
			  	hasAttr =true;
			  	 value = $("#variation_transaction_type").find(".selection").text();
			  	 if(value == "")
			  	 {
			  	 	 value = $("#variation_transaction_type").find(".dropdownSelect").text();
			  	 }
			  	
			  }
			 
			  
			  if(value == "")
				value = "请到页面上选择";
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
			* 根据包含in stock的元素是否存在
			*/
			var aloha_availability = $('#availability-container .aloha-availability-green');
			if(aloha_availability.length>0){
				return false;
			}
			var availability = $('#availability .a-color-success');
			if(availability.length>0){
				return false;
			}
			
			/*
			* 根据加入购物车按钮是否可用
			*/
			var add_to_cart_button = $('#add-to-cart-button:visible');
			if(add_to_cart_button.length>0){
				return false;
			}
			var bb_to_cfg_button = $('#bb_to_cfg_button:visible');
			if(bb_to_cfg_button.length>0){
				return false;
			}
			var buy_box_submit = $('#buy-box-submit:visible');
			if(buy_box_submit.length>0){
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
















