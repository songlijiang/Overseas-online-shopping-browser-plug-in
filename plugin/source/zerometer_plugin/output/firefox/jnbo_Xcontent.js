function localStartX(){
	return function(plugin_content){
		var _this = plugin_content.get_this();

		plugin_content.site_id = 25;
		plugin_content.site_name = 'jnbo';
		plugin_content.direct_mail_china = false;
		plugin_content.country = "US";

		//获取商品搜索框信息
		plugin_content.get_search_box = function(){
			var search_input = $('.search');
			var search_button = $("td[valign='top']").find("input");
			return [search_input,search_button];
		}
		plugin_content.get_category = function(){
			var targetSpans = $("table.path").find("a");
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
		


		//页面初始化
		plugin_content.content_init = function(){
			
			//加载插件内容
			_this.append_plugin();
			
			//绑定选择套餐刷新价格事件
			$("select[name='shoeSize']").change(function(){
				setTimeout(function(){
					_this.price_loaded = false;
					_this.refresh_content();
				},1000);
			});
			
		}

		//获取商品名称
		plugin_content.get_name = function(){
			var goods_name = $("table.path").find("font").text();
			
			return goods_name;
		}

		//获取商品图片
		plugin_content.get_img = function(){
			var goods_img = "http://www.joesnewbalanceoutlet.com/" + $(".vertline").next().find("tr").eq(0).children("td:eq(1)").find("img").eq(0).attr("src");
			return goods_img;
		}

		//获取商品价格
		plugin_content.get_price = function(){
			var priceText ="$0.01";
			 var priceNow = $(".vertline").next().find("tr").eq(1).find("font:contains('Now')").text();
			  var priceToday = $(".vertline").next().find("tr").eq(1).find("font:contains('Today')").text();
			  var priceSale = $(".vertline").next().find("tr").eq(1).find("font:contains('Sale')").text();

			  if(priceToday != null && typeof(priceToday) != "undefined" && priceToday != ""){
				priceText =  priceToday;
			  }
			  else{
				if(priceSale != null && typeof(priceSale) != "undefined" && priceSale != ""){
				   priceText = priceSale;
				}
				else{
				  priceText = priceNow;
				}
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
			var result =""; 
			result = JSON.stringify(feature); 
			return  JSON.parse(result);

			function getProSizeNames(){
				var hasAttr = false;
			  if($("select[name='shoeSize']").length > 0){
			  	hasAttr =true;
				var selectVal = $("select[name='shoeSize']").val();
			  }else if($("select[name='appParam1']").length > 0){
			  	hasAttr =true;
				var selectVal = $("select[name='appParam1']").val();
			  }
				
			  var value = selectVal;
			  
			  if(value == "select")
				value = "请在网页上选择";
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
			var weightText ="0.01pound"
			if($('table td[style="text-align:left;"]').length > 0){
			  var weightObj = $('table td[style="text-align:left;"]');
			  for(var i = 0; weightObj.eq(1).find('li').length > i ;i++){
				var weightCon = weightObj.eq(1).find('li').eq(i).text();
				if(weightCon.indexOf("Weight") >= 0){
				  weightText = weightCon;
				  break;
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
		
		plugin_content.init();
	}
}