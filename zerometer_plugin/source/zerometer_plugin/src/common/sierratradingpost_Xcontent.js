function localStartX(){
	// var plugin_content = new PluginContent();
	return function(plugin_content){
		var _this = plugin_content.get_this();

	    plugin_content.site_id = 36;
		plugin_content.site_name = "sierratradingpost";
		plugin_content.direct_mail_china = false;
		plugin_content.country = "US";

		//获取商品搜索框信息
		plugin_content.get_search_box = function(){
			var search_input = $('#searchBox');
			var search_button = $('.searchBoxButton');
			return [search_input,search_button];
		}

		//页面初始化
		plugin_content.content_init = function(){
			//加载插件内容
			_this.append_plugin();
			
		//绑定选择套餐刷新价格事件
		  $("#js-skuPropertiesSelection").click(function(){
				setTimeout(function(){
					_this.price_loaded = false;
					_this.refresh_content();
				},1000);
	  		});
	  
		}

		//获取商品名称
		plugin_content.get_name = function(){
			var goods_name =$("div.productName").text();
			return goods_name;
		}

		//获取商品图片
		plugin_content.get_img = function(){
			var  goods_img = $('div.primaryImageContainer').find("img").attr("src");
			return goods_img;
		}

		//获取商品价格
		plugin_content.get_price = function(){
			var prodPrice =  $("#displayPrice").text();
			prodPrice = prodPrice.replace(/,/g,'.');
			var reg = /CNY\s?(\d+(\.\d+)?)/i;
			var match_arr = prodPrice.match(reg);
			if(match_arr && typeof(match_arr[1])!="undefined") {
				prodPrice = match_arr[1];
			}
			else
			{
				prodPrice = 0;
			}
			return prodPrice;
		}

		//获取商品重量
		plugin_content.get_weight = function(){
			var prodWeight ="0.01";
			var weightText ="0.01pound";
			if($('#specs').length > 0){
			  var weightObj = $('#specs');

			  for(var i = 0; weightObj.find('li').length > i ;i++){
				var weightCon = weightObj.find('li').eq(i).text();
				if(weightCon.indexOf("Weight") >= 0){
				  weightText = weightCon;
				 
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
			feature.widths = getWidthCont();
			feature.sizes = getSizeCont();
			return  feature;

			function getColorNames(){
			  var value = "";
			  var hasAttr =false;
			  if($("#property1LabelValue").length >0)
			  {
			  	hasAttr =true;
			  	value = $("#property1LabelValue").text();
			  }
			
			  if(value == "" || typeof(value) == "undefined")
				value = "请在网页上选择颜色";
			  if(!hasAttr)
			  {
			  	value =null;
			  }
			  return value;
			}
			function getWidthCont(){
			  var value = $("#property3LabelValue").text();
			  var hasAttr = false;
			  if($("#property3LabelValue").length >0)
			  {
			  	hasAttr = true;
			  }
			  if(value == "" || typeof(value) == "undefined")
				value = "请到网页上选择Width";
			   if(!hasAttr)
			  {
			  	value =null;
			  }
			
			  return value;
			}
			function getSizeCont(){
			  var value = $("#property2LabelValue").text();
			  var hasAttr = false;
			  if( $("#property2LabelValue").length>0)
			  {
			  	hasAttr = true;
			  }
			  if(value == "" || typeof(value) == "undefined")
				value = "请到网页上选择尺码";
			  else if($('#addToCartButton').val()=='Sold Out')
				value = value+'已断码';
			  if(!hasAttr)
			  {
			  	value = null;
			  } 	
			  return value;
			}
					
			
		}
		plugin_content.init();
	}
}
