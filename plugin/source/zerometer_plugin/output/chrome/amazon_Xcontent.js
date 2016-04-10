function localStartX(){
	return function(plugin_content){
		var _this = plugin_content.get_this();

		plugin_content.site_id = 2;
		plugin_content.site_name = 'amazon_de';
		plugin_content.direct_mail_china = false;
		plugin_content.country = "";

		//获取商品搜索框信息
		plugin_content.get_search_box = function(){
			var search_input = $('#twotabsearchtextbox');
			var search_button = $('#nav-search .nav-search-submit .nav-input');
			return [search_input,search_button];
		}

		//页面初始化
		plugin_content.content_init = function(){
			/*
			//加载插件内容
			var price_feature_div = $('#price_feature_div');
			if(price_feature_div.length>0){
				price_feature_div.after(PluginDiv);
			}else{
				var pantryPrice_feature_div = $('#pantryPrice_feature_div');
				if(pantryPrice_feature_div.length>0){
					pantryPrice_feature_div.after(PluginDiv);
				}else{
					var kitsune_price_feature_div = $('#kitsune-price_feature_div');
					if(kitsune_price_feature_div.length>0){
						kitsune_price_feature_div.after(PluginDiv);
					}else{
						var priceBlock = $('#priceBlock');
						if(priceBlock.length>0){
							priceBlock.after(PluginDiv);
						}else{
							$("#ppd-bottom-5").before(PluginDiv);
						}
					}
				}
			}
			*/
			//加载插件内容
			_this.append_plugin();
			
			//绑定选择套餐刷新价格事件
			$("#plan_options_swatch_container .aloha-swatch").click(function(){
				setTimeout(function(){
					_this.price_loaded = false;
					_this.refresh_feature_others();
				},1000);
			});
			$("#plan_option_radio_container .plan-radio-wrapper input:radio").click(function(){
				setTimeout(function(){
					_this.price_loaded = false;
					_this.refresh_content();
				},1000);
			});
			$('#native_dropdown_selected_style_name,#native_dropdown_selected_size_name').change(function(){
				setTimeout(function(){
					_this.price_loaded = false;
					_this.refresh_feature_others();
				},1000);
			});
			$("#handleBuy .swatchOuter").click(function(){
				setTimeout(function(){
					_this.price_loaded = false;
					_this.refresh_feature_others();
				},2000);
			});
			$("#variation_color_name li,#variation_size_name li,#variation_style_name li,#variation_pattern_name li,#variation_item_package_quantity li").click(function(){
				setTimeout(function(){
					_this.price_loaded = false;
					_this.refresh_feature_others();
				},3000);
			});
		}

		//获取商品名称
		plugin_content.get_name = function(){
			var goods_name = '';
			var productTitle = $('#productTitle');
			var btAsinTitle = $('#btAsinTitle');
			if(productTitle.length>0){
				goods_name = productTitle.text();
			}else if(btAsinTitle.length>0){
				goods_name = btAsinTitle.text();
			}
			return goods_name;
		}
		plugin_content.get_category = function(){
			var prodcategory = $(".a-horizontal.a-size-small").text().replace(/\›/g,"|").replace(/\s+/g,"");
			return prodcategory;
		}

		//获取商品图片
		plugin_content.get_img = function(){
			var landingImage = $('#landingImage');
			var prodImage = $('#prodImage');
			var landingImage2 = $('#main-image-container .imgTagWrapper img');
			var prodImage2 = $('#kib-ma-container-0 img');
			var prodImageCell = $('#prodImageCell img');
			if(landingImage.length>0){
				var goods_img = landingImage.attr('src');
			}else if(prodImage.length>0){
				var goods_img = prodImage.attr('src');
			}else if(landingImage2.length>0){
				var goods_img = landingImage2.attr('src');
			}else if(prodImage2.length>0){
				var goods_img = prodImage2.attr('src');
			}else if(prodImageCell.length>0){
				var goods_img = prodImageCell.attr('src');
			}else{
				var goods_img = '';
			}
			if(/^\s*data:/.test(goods_img)){
				goods_img = '';
			}
			return goods_img;
		}

		//获取商品价格
		plugin_content.get_price = function(){
			var priceText = '$0.00';
			var current_price = $("#current-price");
			var priceblock_ourprice = $('#priceblock_ourprice');
			var priceblock_saleprice = $("#priceblock_saleprice");
			var priceblock_dealprice = $("#priceblock_dealprice ");
			var priceLarge = $("#actualPriceValue .priceLarge");
			var actualPriceValue = $("#actualPriceValue");
			var buyingPriceValue = $('#buyingPriceValue b');
			if (current_price.length>0){
				priceText = current_price.text();
			}else if(priceblock_ourprice.length>0){
				priceText = priceblock_ourprice.text();
			}else if(priceblock_saleprice.length>0){
				priceText = priceblock_saleprice.text();
			}else if(priceblock_dealprice.length>0){
				if(priceblock_dealprice.find("span").length>0)
				{
					priceText = priceblock_dealprice.find("span").eq(0).text();
				}
				else{
					priceText = priceblock_dealprice.text();
				}
				
			}else if(priceLarge.length>0){
				priceText = priceLarge.text();
			}else if(actualPriceValue.length>0){
				priceText = actualPriceValue.text();
			}else if(buyingPriceValue.length>0){
				priceText = buyingPriceValue.text();
			}
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
			feature.flavors = getFlavorNames();
			feature.styles = getStyleNames();
			var result =""; 
			result = JSON.stringify(feature); 
			return  JSON.parse(result);
			function getProSizeNames(){
			  var sizes_0 = $("select#native_dropdown_selected_size_name").find("option").length;
			  var sizes_1 = $("#variation_size_name").find("div.text").length;
			  var sizes_2 = $("#evdd-button-size_name").length;
			  var sizes_3 = $("#selected_configuration").length;
			  var sizes_4 = $("#selected_connectivity_technology").length;
			  var sizes_5 = $("#vodd-button-label-size_name").length;
			  var sizes_6 = $('#variation_pattern_name .selection').length;
			  var sizes_7 = $("#variation_size_name").find("span.selection").length;
			  var value = "";
			  var hasAttr = false;
			  if(sizes_0 >0 || sizes_1>0 || sizes_2 >0 || sizes_3 >0 || sizes_4 >0 || sizes_5 >0 || sizes_6 >0 || sizes_7 >0){
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
			  else if (sizes_4 > 0 && sizes_3 > 0)
				value = $("#selected_configuration").find(".variationLabel").text() + "/" + $("#selected_connectivity_technology").find(".variationLabel").text();
			  else if(sizes_5 > 0)
				value = $("#vodd-button-label-size_name").text();
			  else if(sizes_6 > 0)
				value = $('#variation_pattern_name .selection').text();
			  else if(sizes_7 > 0)
				value = $("#variation_size_name").find("span.selection").text();
			  
			  if(value == "" || value.toLowerCase().indexOf("select") >= 0)
				value = "请到页面上选择尺码";
				if(!hasAttr)
				value = null;
			  return value;

			}

			function getColorNames(){
			  var color_0 = $("#variation_color_name").find("span.selection").length;
			  var color_1 = $("#native_dropdown_selected_color_name").length;
			  var color_2 = $("#vodd-button-label-color_name").length;
			  var color_3 = $("#selected_color_name").length;
			  var value = ""; 
			  var hasAttr = false;
			  if (color_0 > 0){
				hasAttr = true;
				value = $("#variation_color_name").find("span.selection").text();
			  }
			  else if(color_1 > 0){
				hasAttr = true;
				value = $("#native_dropdown_selected_color_name").find(".dropdownSelect").text();
			  }
			  else if(color_2 > 0){
				hasAttr = true;
				value = $("#vodd-button-label-color_name").text();
			  }
			  else if(color_3 > 0){
				hasAttr = true;
				value = $("#selected_color_name .variationLabel").text();
			  }
			  
			  if(value == "")
				value = "请到页面上选择颜色";
			  if(!hasAttr)
				value = null;
			  return value;
			}



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
					value = null;
			  return value;
			}

			function getStyleNames(){
			  var value = "";
			  var hasAttr = false;
			  if($("#variation_style_name").length > 0){
				value = $("#variation_style_name").find(".selection").text();
				hasAttr = true;
				if($("#native_dropdown_selected_material_type").length > 0){
				  selectVal = $("#native_dropdown_selected_material_type").val();
				  for (var i = 0; $("#native_dropdown_selected_material_type option").length > i; i++){
					if($("#native_dropdown_selected_material_type option").eq(i).val() == selectVal){
					  value += "/" + $("#native_dropdown_selected_material_type option").eq(i).text();
					}
				  }
				}
			  }else if($("#variation_configuration").length > 0){
				hasAttr = true;
				value = $("#variation_configuration").find(".selection").text();
			   }

			  else if($("#selected_platform_for_display").length > 0){
				hasAttr = true;
				value = $("#selected_platform_for_display").find(".variationLabel").text();
			  }

			  else if($("#variation_special_size_type").length > 0){
				hasAttr = true;
				value = $("#variation_special_size_type").find(".selection").text();
			}

			  else if($("#variation_hand_orientation").length > 0){
				hasAttr = true;
				value = $("#variation_hand_orientation").find(".selection").text();
			}

			  else if($("#variation_number_of_items").length > 0){
				hasAttr = true;
				value = $("#variation_number_of_items").find(".selection").text();
			}

			  else if($("#variation_number_of_items").length > 0){
				hasAttr = true;
				value = $("#variation_number_of_items").find(".selection").text();
			}
			  
			  else if($("#variation_item_shape").length > 0){
				hasAttr = true;
				value = $("#variation_item_shape").find(".selection").text();  
				}  

			  if($("#variation_item_length_string").find("span.selection").length > 0){
				hasAttr = true;
				value += "\n" + "Length：" + $("#variation_item_length_string").find("span.selection").text();
			}

			  if($("#variation_item_diameter_string").find("span.selection").length > 0){
				hasAttr = true;
				value += "\n" + "Diameter：" + $("#variation_item_diameter_string").find("span.selection").text();
			}
			  
			  if(value == "")
				value = "请到页面上选择";
			if(!hasAttr)
				value = null;
			  return value;
			}
		}

		//获取商品重量
		plugin_content.get_weight = function(){
			var prodWeight = _this.default_weight;
			var prodWeight1 = $('#productDetailsTable li:contains("Shipping Weight"), #detail-bullets li:contains("Shipping Weight")');
			var prodWeight2 = $('#prodDetails td:contains("Shipping Weight")').next();
			var prodWeight3 = $('#descriptionAndDetails span > span:contains("Shipping Weight")').next();
			var prodWeight4 = $('#technical-details-table td:contains("Weight")').next();
			var weightText = '';
			if (prodWeight1.length>0){
				aa = prodWeight1.contents().filter(function(){
					return this.nodeType === 3; //Node.TEXT_NODE
				}).text();
				weightText = aa;
			}else if(prodWeight2.length>0){
				ab = prodWeight2.contents().filter(function(){
					return this.nodeType === 3; //Node.TEXT_NODE
				}).text();
				weightText = ab;
			}else if(prodWeight3.length>0){
				ac = prodWeight3.contents().filter(function(){
					return this.nodeType === 3; //Node.TEXT_NODE
				}).text();
				weightText = ac;
			}else if(prodWeight4.length>0){
				weightText = prodWeight4.text();
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