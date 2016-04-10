function localStartX(){
	return function(plugin_content){
		var _this = plugin_content.get_this();

		plugin_content.site_id = 30;
		plugin_content.site_name = "ninewest";
		plugin_content.direct_mail_china = false;
		plugin_content.country = "US";

		//»ñÈ¡ÉÌÆ·ËÑË÷¿òÐÅÏ¢
		plugin_content.get_search_box = function(){
			var search_input = $('#primary-search-input');
			var search_button = $('#primary-search-submit');
			return [search_input,search_button];
		}
		plugin_content.get_category = function(){
			var prodcategory = " ";
			return prodcategory;
		}

		//Ò³Ãæ³õÊ¼»¯
		plugin_content.content_init = function(){
			//¼ÓÔØ²å¼þÄÚÈÝ
			_this.append_plugin();

			//绑定选择套餐刷新价格事件
			$("#color-buttons").click(function(){
				setTimeout(function(){
					_this.price_loaded = false;
					_this.refresh_content();
				},1000);
			});
		}

		//»ñÈ¡ÉÌÆ·Ãû³Æ
		plugin_content.get_name = function(){
			var goods_name = '';
			var itemTitle = $('.product-title').find("h1");
			if(itemTitle.length>0){
				goods_name = itemTitle.text();
			}else{
				goods_name = '';
			}
			return goods_name;
		}

		//»ñÈ¡ÉÌÆ·Í¼Æ¬
		plugin_content.get_img = function(){
			var icImg = $('#image-zoom .image-thumbs li:first img');
			if(icImg.length>0){
				var goods_img = icImg.attr('src');
			}else{
				var goods_img = '';
			}
			return goods_img;
		}

		//»ñÈ¡ÉÌÆ·¼Û¸ñ
		plugin_content.get_price = function(){
			var prodPrice = '$0.00';
			var prcIsum = $('.heading-2 span');
			var prcIsum1 = $('.sale-price');
			if (prcIsum.length>0){
				prodPrice = prcIsum.text();
			}else if(prcIsum1.length>0){
				prodPrice = prcIsum1.text();
			}
			
			prodPrice = $.trim(prodPrice);
			prodPrice = prodPrice.replace(/,/g,'');
			var match_arr = prodPrice.match(/\$\s?(\d+(:?\.\d+)?)/);
			
			if(match_arr && typeof(match_arr[1]!='undefined')){
				prodPrice = match_arr[1];
			}
			else{
				prodPrice =0;
			}
			return prodPrice;
		}

		//»ñÈ¡ÉÌÆ·ÌØÐÔ
		plugin_content.get_features = function(){
			var feature = new Object();
			feature.colors =getColorNames();
			var result =""; 
			result = JSON.stringify(feature); 
			return  JSON.parse(result);

			//»ñÈ¡ÑÕÉ«Àà±ð£»
			function getColorNames(){
			  var value = "";
			  var hasAttr = false;
			  var colorButtons = $("#color-buttons");
			  if(colorButtons.length == 0){
			  	var colorOptions = $(".color-options");
			  	if(colorOptions.length > 0){
			  	  var targetSelected = $(".color-options").find("li a.selected");
			  	  if(targetSelected.length > 0){
			  	    value = targetSelected.find("span span").first().next().text();
			  	  }
			  	}
			  	else{
			  	  value = $("#color-alert").find("#color-details").text();
			  	}	  	
			  }
			  else{
			  	value = colorButtons.find("li.selected").find("button").attr("value");
			  }
			  if(colorButtons.length >0 || colorOptions.length >0 || $("#color-alert").length>0)
			  {
			  	hasAttr =true;
			  }
			  if(value == "" || typeof(value) == "undefined")
				value = "请在页面选择颜色";
			  if(!hasAttr)
			  {
			  	value = null;
			  }
			  return value;
			}


		}
		plugin_content.get_weight = function(){
			var prodWeight = _this.default_weight;
			return prodWeight;
		}
		setTimeout(function(){
			plugin_content.init();
		},10000);
	}
}