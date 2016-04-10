function localStartX(){
	return function(plugin_content){
		var _this = plugin_content.get_this();

		plugin_content.site_id = 18;
		plugin_content.site_name = 'finishline';
		plugin_content.direct_mail_china = false;
		plugin_content.country = "US";


		//获取商品搜索框信息
		plugin_content.get_search_box = function(){
			var search_input = $('#searchBarSearchBox');
			var search_button = $('#searchBarSearchButton');
			return [search_input,search_button];
		}
		plugin_content.get_category = function(){
			var prodcategory = " ";
			return prodcategory;
		}

		//页面初始化
		plugin_content.content_init = function(){
			//加载插件内容
			_this.append_plugin();
			
			//绑定选择套餐刷新价格事件
			$("#productStyleColor").click(function(){
				setTimeout(function(){
					_this.price_loaded = false;
					_this.refresh_content();
				},1000);
			});
			
		}

		//获取商品名称
		plugin_content.get_name = function(){
			var goods_name = '';
			goods_name = $("#title").text();
			return goods_name;
		}

		//获取商品图片
		plugin_content.get_img = function(){
			var goods_img = $("#altImages").find("img").eq(0).attr("src");
			return goods_img;
		}

		//获取商品价格
		plugin_content.get_price = function(){
			  var priceText = "";
			  var prodPrice =0.0;
			  if($("#productPrice .fullPrice").length > 0)
				priceText = $("#productPrice .fullPrice").text();
			  else if($("#productPrice .maskedFullPrice").length > 0)
				priceText = $("#productPrice .maskedFullPrice").text();

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
			var result =""; 
			result = JSON.stringify(feature); 
			return  JSON.parse(result);
			//获取尺码大小；
			function getProSizeNames(){
			  var value = "";
			  var hasAttr = false;
			  if($("#productSizes").length >0 )
			  	{
			  		hasAttr = true;
			  	}
			  value = $("#productSizes .selected").text();
			  if(value == "" || value.indexOf("Please select a size") >= 0){
			  	
			  	value = "请在页面上选择Size";
			  }
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
			  if($("#styleColors .description").length >0)
			  {
			  	hasAttr = true;
			  }
			  value = $("#styleColors .description").text();

			  if(value == "")
				value = "请在网页上选择Color";
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
			
			return prodWeight;
		}
		
		plugin_content.init();
	}
}