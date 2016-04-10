function localStartX(){
	var plugin_content = new PluginContent();
	var _this = plugin_content.get_this();

	plugin_content.site_id = 2;
	plugin_content.site_name = '6PM';

	//»ñÈ¡ÉÌÆ·ËÑË÷¿òÐÅÏ¢
	plugin_content.get_search_box = function(){
		var search_input = $('#globalSearchField');
		var search_button = $('#search button');
		return [search_input,search_button];
	}

	//Ò³Ãæ³õÊ¼»¯
	plugin_content.content_init = function(){
		//¼ÓÔØ²å¼þÄÚÈÝ
		_this.append_plugin();
		
		//绑定选择套餐刷新价格事件
		$("#colors").change(function(){
			setTimeout(function(){
				_this.refresh_feature_others();
				_this.price_loaded = false;
				_this.refresh_price();
				_this.refresh_actual_tariff();
				_this.refresh_totle_price();
			},500);
		});

			$(".dimensions").change(function(){
			setTimeout(function(){
				_this.refresh_feature_others();
				_this.price_loaded = false;
				_this.refresh_price();
				_this.refresh_actual_tariff();
				_this.refresh_totle_price();
			},500);
		});



	}

	//»ñÈ¡ÉÌÆ·Ãû³Æ
	plugin_content.get_name = function(){
		var productStage = $('#productStage h1');
		if(productStage.length>0){
			goods_name = productStage.html().replace(/<[\/]?[^>]+>/g,'');
		}else{
			goods_name = '';
		}
		return goods_name;
	}

	//»ñÈ¡ÉÌÆ·Í¼Æ¬
	plugin_content.get_img = function(){
		var detailImage = $('#detailImage img');
		if(detailImage.length>0){
			var goods_img = detailImage.attr('src');
		}else{
			var goods_img = '';
		}
		return goods_img;
	}

	//»ñÈ¡ÉÌÆ·¼Û¸ñ
	plugin_content.get_price = function(){
		var prodPrice = '$0.00';
		var price_obj = $('#priceSlot .price');
		if (price_obj.length>0){
			prodPrice = price_obj.text();
		}
		prodPrice = prodPrice.replace(/,/g,'');
		reg = /\$(\d+(\.\d+)?)/i;
		var match_arr = prodPrice.match(reg); 
		prodPrice = match_arr[1]*_this.exchange_rate;
		return prodPrice;
	}

	//»ñÈ¡ÉÌÆ·ÖØÁ¿
	plugin_content.get_weight = function(){
		var prodWeight1 = $('#prdInfoText li:contains("Weight"):last');
		
		var prodWeight = 0;
		if (prodWeight1.length>0){
			var prodText = prodWeight1.text().replace(/\s/g,'').replace('Weight:','');
			var lbArr = prodText.match(/(\d+)lb/);
			if(lbArr && typeof(lbArr[1])!='undefined'){
				prodWeight += parseFloat(lbArr[1]);
			}
			var ozArr = prodText.match(/(\d+)oz/);
			if(ozArr && typeof(ozArr[1])!='undefined'){
				prodWeight += parseFloat(ozArr[1]/16);
			}
		}else{
			prodWeight = 0.01;//Ä¬ÈÏ0.01°õ
		}
		return prodWeight;
	}
	
	//获取商品特性
	plugin_content.get_features = function(){
		var feature = new Object();
		feature.sizes =getProSizeNames();
		feature.widths = getWidthNames();
		feature.inseams = getInseamNames();
		feature.colors = getColorNames();
		var result =""; 
		result = JSON.stringify(feature); 
		return  eval('(' + result + ')');
		
		//获取尺码大小；
		function getProSizeNames(){
		  var size_0 = $("#d3").find("option").length;
		  var size_1 = $("#d13").find("option").length;
		  var sizes_2 = $("#d15").find("option").length;
		  var sizes_3 = $("#Size").find("option").length;
		  var value = "请到页面上选择尺码";
		  var hasAttr = false;
		  if(size_0 >0 || size_1>0 || sizes_2 >0 || sizes_3>0)
		  {
			hasAttr = true;
		  }
		  if(size_0 > 0){
			var index = document.getElementById("d3").selectedIndex;
			value = $("#d3").find("option").eq(index).text();
		  }
		  else if(size_1 > 0){
			var index = document.getElementById("d13").selectedIndex;
			value = $("#d13").find("option").eq(index).text();
		  }
		  else if(sizes_2 > 0){
			var index = document.getElementById("d15").selectedIndex;
			value = $("#d15").find("option").eq(index).text();
		  }
		  else if(sizes_3 > 0){
			var index = document.getElementById("Size").selectedIndex;
			value = $("#Size").find("option").eq(index).text();
		  }
		  
		  if(value == null || value == "" || typeof(value) == "undefined" || value.toLowerCase().indexOf("select") >= 0 || value == "Choose Size" || value == "选择大小")
			value = "请到页面上选择尺码";
		 if(!hasAttr)
			value = null;
		  return value;
		}

		//获取宽度类别；
		function getWidthNames(){
		  var width = $("select#d4").find("option").length;
		  var widthNotes = $("#d4").siblings("p.note").length;
		  var value = "请到页面上选择Width";
		  var hasAttr = false;
		  if(width > 0 || widthNotes > 0)
		  {
			hasAttr = true;
		  }
		  if(width > 0){
			var index = document.getElementById("d4").selectedIndex;
			value = $("#d4").find("option").eq(index).text();
		  }
		  
		  else if(widthNotes > 0){
			var widthDetail = $("#d4").siblings("p.note").text();
			if(widthDetail.indexOf(":") >= 0)
			  value = widthDetail.split(":")[1];
			else
			  value = widthDetail;
		  }
		  if(!hasAttr)
			value = null;
		  return value;
		}

		function getInseamNames(){
		  var inseam_0 = $("#d46").find("option").length;
		  var inseam_1 = $("#d46").siblings("p.note").length;
		  var hasAttr = false;
		  var value = "请到页面上选择Inseam";
		  if(inseam_0 > 0 || inseam_1 > 0){
			hasAttr = true;
		  }
		  if(inseam_0 > 0){
			var index = document.getElementById("d46").selectedIndex;
			value = $("#d46").find("option").eq(index).text();
		  }
		  else if(inseam_1 > 0){
			value = $("#d46").siblings("p.note").text();
		  }
		  if(!hasAttr)
			value = null;
		  
		  return value;
		}

		//获取颜色类别；
		function getColorNames(){
		  var colors = $("select#color").find("option").length;
		  var colorNotes = $("#colors").find("p.note").length;
		  var value = "请到页面上选择颜色";
		  var hasAttr = false;
		  if(colors > 0 || colorNotes > 0)
			hasAttr = true;
		  if (colors > 0){
			var index = document.getElementById("color").selectedIndex;
			value = $("#color").find("option").eq(index).text();
		  }
		  
		  else if (colorNotes > 0){
			var value = $("#colors").find("p.note").text();
		  }
		  if(!hasAttr)
			value = null;
		  return value;
		}
	}
	plugin_content.init();
}