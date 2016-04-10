function localStartX(){
	return function(plugin_content){
		var _this = plugin_content.get_this();

		plugin_content.site_id = 41;
		plugin_content.site_name = "vitacost";
		plugin_content.direct_mail_china = false;
		plugin_content.country = "US";

		//获取商品搜索框信息
		plugin_content.get_search_box = function(){
			var search_input = $('#searchInput');
			var search_button = $('#C_LeftNav_SearchGo');
			return [search_input,search_button];
		}
		plugin_content.get_category = function(){
			var targetLinks = $(".bordered a");
			var prodcategory = "";
			var len = targetLinks.length; 
			for (var i = 0; i < len; i++) {
			  if(i == len-1){
				prodcategory += targetLinks[i].innerText;
			  }
			  else{
				prodcategory += targetLinks[i].innerText + "|";
			  }
			}
			return prodcategory;

		}

		//页面初始化
		plugin_content.content_init = function(){
			//加载插件内容
			_this.append_plugin();
			
			//绑定选择套餐刷新价格事件
			$("#color").change(function(){
				setTimeout(function(){
					_this.price_loaded = false;
					_this.refresh_content();
				},500);
			});
		}

		//获取商品名称
		plugin_content.get_name = function(){
			var pdTitleBlock = $('#pdTitleBlock h1');
			if(pdTitleBlock.length>0){
				goods_name = pdTitleBlock.text();
			}else{
				goods_name = '';
			}
			return goods_name;
		}

		//获取商品图片
		plugin_content.get_img = function(){
			var wrap = $('#wrap .cloud-zoom');
			var magBlock = $('#magBlock img');
			if(wrap.length>0){
				var goods_img = 'http://www.vitacost.com'+wrap.attr('href');
			}else if(magBlock.length>0){
				var goods_img = 'http://www.vitacost.com'+magBlock.attr('src');
			}else{
				var goods_img = '';
			}
			return goods_img;
		}

		//获取商品价格
		plugin_content.get_price = function(){
			var prodPrice = '$0.00';
			var priceText="$0.00";
			var pSalePrice = $('.pSalePrice');
			var pOurPriceM = $('.pOurPriceM');
			if(pSalePrice.length>0){
				priceText = pSalePrice.text();
			}else if (pOurPriceM.length>0){
				priceText = pOurPriceM.text();
			}
			
			priceText = priceText.replace(/,/g,'');
			var match_arr = priceText.match(/\$(\d+(\.\d+)?)/);
			if(match_arr && typeof(match_arr[1])!="undefined"){
				prodPrice = match_arr[1];
			}
			else
			{
				prodPrice = 0;
			}
			return prodPrice;
		}

		//获取商品特性
		plugin_content.get_features = function(){
			var feature = new Object();
			feature.sizes =getProSizeNames();
			feature.flavors = getFlavorNames();
			feature.styles = getStyleNames();
			var result =""; 
			result = JSON.stringify(feature); 
			return  JSON.parse(result);

			function getFlavorNames(){
			  var value = "";
			  var hasAttr = false;
			  if($("#Flavor0").length > 0){
			  	hasAttr = true;
				value = $("#Flavor0").find("option[selected=selected]").text();
			  }else if($("#Flavor1").length > 0){
			  	hasAttr = true;
				value = $("#Flavor1").find("option[selected=selected]").text();
			  }
			  if(value == "")
				value = "请在网页上选择！";
			  if(!hasAttr)
			  {
			  	value = null;
			  }
			  return value;
			}

			//获取尺码大小；
			function getProSizeNames(){
			  var sizeObj = $("#Size0");
			  var hasAttr = false;
			  var sizeName = sizeObj.find("option[selected=selected]").text();
			  if($("#Size0").length >0)
			  {
			  	hasAttr = true;
			  }
			  if(!hasAttr)
			  {
			  	sizeName = null;
			  }
			 
			  return sizeName;
			}

			//获取尺码大小；
			function getStyleNames(){

			  var fragranceStyle = $("#Fragrance0");
			  var hasAttr = false;
			  if(fragranceStyle.length>0)
			  {
			  	hasAttr = true;
			  }
			  var fragranceStyleName = fragranceStyle.find("option[selected=selected]").text();
			 if(!hasAttr)
			 {
			 	fragranceStyleName = null;
			 }
			  return fragranceStyleName;
			}

		}

		//获取商品重量
		plugin_content.get_weight = function(){
			var prodWeight = _this.default_weight;
			var pdTitleBlock = $('#pdTitleBlock li:contains("Shipping Weight")');
			if (pdTitleBlock.length>0){
				var weightText = pdTitleBlock.text();
				var match_arr = weightText.match(/(\d+(\.\d+)?)(\sLb)?/i);
				if(match_arr && typeof(match_arr[1])!="undefined"){
					prodWeight = match_arr[1];
				}
				
			}
			return prodWeight;
		}
		//获取商品是否缺货
		plugin_content.out_of_stock = function(){
			/*
			 * 根据pBuyMsgLive
			 */
			var mesg = $('.pBuyMsgLive').text();
			if(mesg.indexOf("In stock")>= 0){
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