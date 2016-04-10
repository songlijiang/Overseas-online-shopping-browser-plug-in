function localStartX(){
	return function(plugin_content){
		var _this = plugin_content.get_this();

		plugin_content.site_id = 46;
		plugin_content.site_name = 'zappos';
		plugin_content.direct_mail_china = false;
		plugin_content.country = "US";

		//获取商品搜索框信息
		plugin_content.get_search_box = function(){
			var search_input = $('#globalSearchField');
			var search_button = $('button.search');
			return [search_input,search_button];
		}
		plugin_content.get_category = function(){
			var prodcategory = "";
			var categories = $("a[class^='gae-click*Product-Page*Breadcrumb']");
			if(categories.length > 0){
			  	categories.each(function(){
					prodcategory += $(this).text() + "|";
			  	});
			}
			if(prodcategory != ""){
				var index = prodcategory.lastIndexOf("|");
				if(index != -1){
					prodcategory = prodcategory.substr(0, index);
				}
			}
			return prodcategory;
		}

		//页面初始化
		plugin_content.content_init = function(){
			//加载插件内容
			_this.append_plugin();
			
			//绑定选择套餐刷新价格事件
			$("#dimension-color select, #dimension-width select, #dimension-size select, #dimension-inseam select").change(function(){
				setTimeout(function(){
					_this.price_loaded = false;
					_this.refresh_content();
				},1000);
			});
			
		}

		//获取商品名称
		plugin_content.get_name = function(){
			var goods_name = '';
			var titleLink = $('h1.banner').find("a");
			if(titleLink.length > 0){
				titleLink.each(function(){
					goods_name += $(this).text();
				});
			}
			return goods_name;
		}

		//获取商品图片
		plugin_content.get_img = function(){
			var goods_img = $('#actors').find("img").eq(0).attr("src");
			return goods_img;
		}

		//获取商品价格
		plugin_content.get_price = function(){
			  var priceText = "";
			  var prodPrice =0.0;
			  var priceDiv = $('span.price.nowPrice');
			  if(priceDiv.length > 0){
			  	priceText = priceDiv.text();
			  	var index = priceText.indexOf("$");
			  	if(index != -1){
		  			prodPrice = priceText.substr(index + 1);
		  		}
			  }
			  
			  return prodPrice;
			}

		//获取商品特性
		plugin_content.get_features = function(){
			var feature = new Object();
			feature.sizes = getProSizeNames();
			feature.widths = getProWidthNames();
			feature.inseams = getProInseamNames();
			feature.colors = getColorNames();
			var result =""; 
			result = JSON.stringify(feature); 
			return  JSON.parse(result);
			//获取尺码大小；
			function getProSizeNames(){
			  var value = "";
			  var hasAttr = false;
			  if($("#dimension-size").length >0 ){
			  	hasAttr = true;
			  }
			  var size = $("#dimension-size select");			  
			  if(size.length > 0 && size.find("option").length > 0){
				var index = size.get(0).selectedIndex;//document.getElementById("d3").selectedIndex;
				value = size.find("option").eq(index).text();
			  }
			  else{
			  	var note = $("#dimension-size").children("p.note").text();
				if(note.indexOf(":") != -1){
				  value = note.split(":")[1];
				}
				else{
				  value = note;
				}
			  }
			  
			  if(value == null || value == "" || typeof(value) == "undefined" || value.toLowerCase().indexOf("choose") >= 0 || value.toLowerCase().indexOf("select") >= 0)
				value = "请到页面上选择尺码";

			  if(!hasAttr)
			  {
				value = null;
			  }

			  return value;
			}

			//获取宽度Width；
			function getProWidthNames(){
			  var value = "";
			  var hasAttr = false;
			  if($("#dimension-width").length >0 ){
			  	hasAttr = true;
			  }
			  var width = $("#dimension-width select");			  
			  if(width.length > 0 && width.find("option").length > 0){
				var index = width.get(0).selectedIndex;//document.getElementById("d4").selectedIndex;
				value = width.find("option").eq(index).text();
			  }
			  else{
				var note = $("#dimension-width").children("p.note").text();
				if(note.indexOf(":") != -1){
				  value = note.split(":")[1];
				}
				else{
				  value = note;
				}
			  }
			  
			  if(value == null || value == "" || typeof(value) == "undefined" || value.toLowerCase().indexOf("choose") >= 0 || value.toLowerCase().indexOf("select") >= 0)
				value = "请到页面上选择宽度";

			  if(!hasAttr)
			  {
				value = null;
			  }

			  return value;
			}

			//获取内长Inseam；
			function getProInseamNames(){
			  var value = "";
			  var hasAttr = false;
			  if($("#dimension-inseam").length >0 ){
			  	hasAttr = true;
			  }
			  var inseam = $("#dimension-inseam select");
			  var value = "请到页面上选择Inseam";
			  
			  if(inseam.length > 0 && inseam.find("option").length > 0){
				var index = inseam.get(0).selectedIndex;//document.getElementById("d4").selectedIndex;
				value = inseam.find("option").eq(index).text();
			  }
			  else{
				var note = $("#dimension-inseam").children("p.note").text();
				if(note.indexOf(":") != -1){
				  value = note.split(":")[1];
				}
				else{
				  value = note;
				}
			  }
			  
			  if(value == null || value == "" || typeof(value) == "undefined" || value.toLowerCase().indexOf("choose") >= 0 || value.toLowerCase().indexOf("select") >= 0)
				value = "请到页面上选择内长Inseam";

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
			  if($("#color").length >0 ){
			  	hasAttr = true;
			  }
			  var colors = $("#color").find("option").length;
			  var value = "请到页面上选择颜色";
			  
			  if (colors > 0){
				var index = $("#color").get(0).selectedIndex;//$("#color").selectedIndex;(不行)//document.getElementById("color").selectedIndex;
				value = $("#color").find("option").eq(index).text();
			  }
			  
			  if(value == null || value == "" || typeof(value) == "undefined" || value.toLowerCase().indexOf("choose") >= 0 || value.toLowerCase().indexOf("select") >= 0)
				value = "请到页面上选择颜色";

			  if(!hasAttr)
			  {
				value = null;
			  }

			  return value;
			}
		}

		//获取商品重量
		plugin_content.get_weight = function(){
			var prodWeight = _this.default_weight;
			if($('#productDescription').length > 0){
			  var weightObj = $('#productDescription');

			  if(weightObj.find('li.measurements').length > 0 && weightObj.find('li.measurements').text().indexOf('Weight') >= 0){
				var weightCon = weightObj.find('li.measurements').text();
				//参考amazon
				var match_arr = weightCon.match(/(\d+(\.\d+)?)\s?pound/i);
				if(match_arr && typeof(match_arr[1])!="undefined"){
					prodWeight = match_arr[1];
				}else{
					match_arr = weightCon.match(/(\d+(\.\d+)?)\s?kg/i);
					if(match_arr && typeof(match_arr[1])!="undefined"){
						prodWeight = match_arr[1]/PluginConf.lb_rate;
					}else{
						match_arr = weightCon.match(/(\d+(\.\d+)?)\s?(:?ounce|oz)/i);
						if(match_arr && typeof(match_arr[1])!="undefined"){
							prodWeight = match_arr[1]/16;
						}
					}
				}
			  }
			}
			return prodWeight;
		}
		//获取商品是否缺货
        plugin_content.out_of_stock = function(){
            //TBD
            return false;
        }
		plugin_content.init();
	}
}