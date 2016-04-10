function localStartX(){
	// var plugin_content = new PluginContent();
	return function(plugin_content){
		var _this = plugin_content.get_this();

		plugin_content.site_id = 13;
		plugin_content.site_name = 'couture_zappos';
		plugin_content.direct_mail_china = false;
		plugin_content.country = "US";

		//获取商品搜索框信息
		plugin_content.get_search_box = function(){
			var search_input = $("input[placeholder='Search']");
			var search_button = $('.action button');
			return [search_input,search_button];
		}

		//页面初始化
		plugin_content.content_init = function(){
			//加载插件内容
			_this.append_plugin();
			
		//绑定选择套餐刷新价格事件
		  $("#purchaseOptions").click(function(){
					setTimeout(function(){
						_this.price_loaded = false;
						_this.refresh_content();
				},1000);
	  		});
	  
		}

		//获取商品名称
		plugin_content.get_name = function(){
			var goods_name = $("#productStage").find("h1.banner").text();
			
			return goods_name;
		}

		//获取商品图片
		plugin_content.get_img = function(){
			var  goods_img = "" ;
			var img_width =$("#actors").find(".actor").eq(0).css("width").replace("px","");
			var img_left =$("#actors").css("left").replace("px","").replace("-","");
			var which  =(parseInt(img_width)+parseInt(img_left))/(parseInt(img_width));
			goods_img = $("#actors").find(".actor").eq(which-1).find("img").attr("src");

			return goods_img;
		}

		//获取商品价格
		plugin_content.get_price = function(){
			var prodPrice = "$0.0";
			if($("#priceSlot").children(".price.nowPrice").length >0)
			{
				prodPrice = $("#priceSlot").children(".price.nowPrice").text();
			}
			 
			prodPrice = prodPrice.replace(/,/g,'');
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
			var prodWeight ="0.01";
			return prodWeight;
		}
		plugin_content.get_category = function(){
			var prodcategory = "";
			$("#breadcrumbs").find("a").each(function(index,element){
				if(index == 0 ){
			  			return;
			  		}
					prodcategory += $(element).text() + "|";
			});
			
			if(prodcategory != ""){
				var index = prodcategory.lastIndexOf("|");
				if(index != -1){
					prodcategory = prodcategory.substr(0, index);
				}
			}
			return prodcategory;
		}
	
		//获取商品特性
		plugin_content.get_features = function(){
			var feature = new Object();
			feature.colors =getColorNames();
			feature.sizes = getSizeCont();
			feature.inseams = getInseamDetail();
			feature.widths = getWidthDetail();
			return  feature;

			//获取颜色类别；
			function getColorNames(){
			  var colors = $("#color").find("option").length;
			  var value = "请到页面上选择颜色";
			  var hasAttr = false;
			  if($("#color").length >0)
			  {
			  	hasAttr = true;
			  }
			  if (colors > 0){
				var index = document.getElementById("color").selectedIndex;
				value = $("#color").find("option").eq(index).text();
			  }
			  else
				value = $("#colors").find("p.note").text();
			  if(!hasAttr)
			  {
			  	value =null;
			  }
			  return value;
			}
			//获取尺码大小；
			function getSizeCont(){
			  var size_0 = $("#d3").find("option").length;
			  var size_1 = $("#d13").find("option").length;
			  var size_2 = $("#d15").find("option").length;
			  var size_3 = $("#d5").find("option").length;
			  var value = "请到页面上选择尺码";
			  var hasAttr = false;
			  if(size_0 > 0){
			  	hasAttr = true;
				var index = document.getElementById("d3").selectedIndex;
				value = $("#d3").find("option").eq(index).text();
			  }
			  else if(size_1 > 0){
			  	hasAttr =true;
				var index = document.getElementById("d13").selectedIndex;
				value = $("#d13").find("option").eq(index).text();
			  }
			  else if(size_2 > 0){
			  	hasAttr =true;
				var index = document.getElementById("d15").selectedIndex;
				value = $("#d15").find("option").eq(index).text();
			  }
			  else if(size_3 > 0){
			  	hasAttr =true;
				var index = document.getElementById("d5").selectedIndex;
				value = $("#d5").find("option").eq(index).text();
			  }
			  
			  if(value.toLowerCase().indexOf("select") >= 0)
				value = "请到页面上选择尺码";
			 if(!hasAttr)
			 {
			 	value = null;
			 }
			  return value;
			}
			//获取宽度类别；
			function getWidthDetail(){
			  var width = $("select#d4").find("option").length;
			  var widthNotes = $("#d4").siblings("p.note").length;
			  var value = "请到页面上选择Width";
			  var hasAttr =false;
			  if(width > 0){
			  	hasAttr =true;
				var index = document.getElementById("d4").selectedIndex;
				value = $("#d4").find("option").eq(index).text();
			  }
			  
			  else if(widthNotes > 0){
			  	hasAttr =true;
				var widthDetail = $("#d4").siblings("p.note").text();
				if(widthDetail.indexOf(":") >= 0)
				  value = widthDetail.split(":")[1];
				else
				  value = widthDetail;
			  }
			  if(!hasAttr)
			  	{
			  		value =null;
			  	}
			  return value;
			}
			function getInseamDetail(){
			  var inseam_0 = $("#d46").find("option").length;
			  var inseam_1 = $("#d46").siblings("p.note").length;
			  var value = "请到页面上选择Inseam";
			  var hasAttr =false;
			  if(inseam_0 > 0){
			  	hasAttr = true;
				var index = document.getElementById("d46").selectedIndex;
				value = $("#d46").find("option").eq(index).text();
			  }
			  else if(inseam_1 > 0){
			  	hasAttr =true;
				value = $("#d46").siblings("p.note").text();
			  }
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
