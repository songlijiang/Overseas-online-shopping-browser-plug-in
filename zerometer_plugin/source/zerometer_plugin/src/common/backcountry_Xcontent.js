function localStartX(){
	return function(plugin_content){
		var _this = plugin_content.get_this();

		plugin_content.site_id = 7;
		plugin_content.site_name = 'backcountry';
		plugin_content.direct_mail_china = false;
		plugin_content.country = "US";

		//获取商品搜索框信息
		plugin_content.get_search_box = function(){
			var search_input = $('#search_term');
			var search_button = $('.search-submit-btn');
			return [search_input,search_button];
		}
		plugin_content.get_category = function(){
			var prodcategory = $(".breadcrumb").text().replace(/\//g,"|").replace(/\s+/g,"");
			return prodcategory;
		}

		//页面初始化
		plugin_content.content_init = function(){
			//加载插件内容
			_this.append_plugin();

			//绑定选择套餐刷新价格事件
			$("#color_selector_image_0").click(function(){
				setTimeout(function(){
					_this.price_loaded = false;
					_this.refresh_content();
				},1000);
			});
			$("#color_selector_image_1").click(function(){
				setTimeout(function(){
					_this.price_loaded = false;
					_this.refresh_content();
				},1000);
			});
			$('#color_selector_image_2').change(function(){
				setTimeout(function(){
					_this.price_loaded = false;
					_this.refresh_content();
				},1000);
			});
			$("#color_selector_image_3").click(function(){
				setTimeout(function(){
					_this.price_loaded = false;
					_this.refresh_content();
				},2000);
			});
			$("#color_selector_image_4").click(function(){
				setTimeout(function(){
					_this.price_loaded = false;
					_this.refresh_content();
				},3000);
			});
			$("#color_selector_image_5").click(function(){
				setTimeout(function(){
					_this.price_loaded = false;
					_this.refresh_content();
				},3000);
			});
			$("#product-size-select , #product-variant-select").click(function(){
				setTimeout(function(){
					_this.price_loaded = false;
					_this.refresh_content();
				},3000);
			});
		}


		//获取商品名称
		plugin_content.get_name = function(){
			var goods_name = '';
			var itemTitle = $('.qa-brand-name');
			if(itemTitle.length>0){
				goods_name = itemTitle.html();
				goods_name = goods_name.replace(/<[^>]+>[^<]+<[\/][^>]+>/i,'');
			}else{
				goods_name = '';
			}
			return goods_name;
		}

		//获取商品图片
		plugin_content.get_img = function(){
			var icImg = $('#main_product_image');
			if(icImg.length>0){
				var goods_img = icImg.attr('src');
			}else{
				var goods_img = '';
			}
			return goods_img;
		}

		//获取商品价格
		plugin_content.get_price = function(){
			var prodPrice = '$0.00';
			var prcIsum = $('.qa-item-price-low');
			var prcIsum_bidPrice = $('.qa-item-price-high');
			var select_options = $('#product-size-select .sizeselector-link-value');
			if (prcIsum.length>0){
				prodPrice = prcIsum.text();
			}else if(prcIsum_bidPrice.length>0){
				prodPrice = prcIsum_bidPrice.text();	
			}
			if (prodPrice.indexOf('–')>0||select_options.length>0){
				return 0;
			}else{
				prodPrice = prodPrice.replace(/,/g,'');
				var match_arr = prodPrice.match(/\$(\d+(\.\d+)?)/i);
				if(match_arr && typeof(match_arr[1])!="undefined"){
					priceText = match_arr[1];
				}else{
					priceText = 0;
				}
				return priceText;
			}
		}

		//获取商品特性
		plugin_content.get_features = function(){
			var feature = new Object();
			feature.sizes =getProSizeNames();
			feature.colors = getColorNames();
			feature.styles = getStylesNames();
			var result =""; 
			result = JSON.stringify(feature); 
			return  JSON.parse(result);
			//获取颜色类别；
			function getColorNames(){
			  var value = "请到网页上选择颜色";
			  var hasAttr = false;
			  if($("#product-color-selector").length >0)
			  {
			  	hasAttr = true;
			  }
			  value = $("#product-color-selector").find("span.selected-attribute-name").text();
			  
			  if(value.toLowerCase().indexOf("select") >= 0 
				 || value == ""
				 || typeof(value) == "undefined"
				 || value == null)
				value = "请到页面选择颜色";
			  if(!hasAttr)
			  {
			  	value = null;
			  }
			  return value;
			}
			//获取尺码大小；
			function getProSizeNames(){
			  var value = "";
			  var hasAttr = false;
			  value_0 = $("#product-size-selector").find("span.selected-attribute-name").text();
			  value_1 = $("#product-variant-select").find("div.ui-basedropdown-option-value.ui-unifiedropdown-option-value.js-unifiedropdown-option-value").text();
			 if($("#product-size-selector").length>0 || $("#product-variant-select")>0)
			 {
			 	hasAttr =true;
			 }
			  if(value_0 != null && typeof(value_0) != "undefined" && value_0 != "")
				value = value_0;
			  else
				value = value_1;
			   
			  if(value.toLowerCase().indexOf("select") >= 0 
				 || value == ""
				 || typeof(value) == "undefined"
				 || value == null)
				value = "请到页面选择尺码";
			 if(!hasAttr)
			 {
				value = null;
			 }

			  return value;
			}
			function getStylesNames(){
				value ="";
				hasAttr =false;
				if($("#product-variant-select").length >0)
				{
					hasAttr = true;
				}
				value = $("#product-variant-select").find("div.ui-basedropdown-option-value").text();
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
			var prodWeight1 = $('#tech-specs .table .td:contains("Claimed Weight")').next();
			if (prodWeight1.length>0){
				var prodText = prodWeight1.text();
				var lbArr = prodText.match(/(\d+(:?\.\d+)?)\s?lb/);
				if(lbArr && typeof(lbArr[1])!='undefined'){
					prodWeight += parseFloat(lbArr[1]);
				}
				
				var ozArr = prodText.match(/(\d+(:?\.\d+)?)\s?oz/);
				if(ozArr && typeof(ozArr[1])!='undefined'){
					prodWeight += parseFloat(ozArr[1]/16);
				}
			}
			return prodWeight;
		}

		plugin_content.init();
	}
}