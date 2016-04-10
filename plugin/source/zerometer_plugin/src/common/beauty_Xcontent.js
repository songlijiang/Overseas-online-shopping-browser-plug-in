function localStartX(){
	// var plugin_content = new PluginContent();
	return function(plugin_content){
		var _this = plugin_content.get_this();

		plugin_content.site_id = 8;
		plugin_content.site_name = 'beauty';
		plugin_content.direct_mail_china = false;
		plugin_content.country = "US";
		//获取商品搜索框信息
		plugin_content.get_search_box = function(){
			var search_input = $('.gnSearchBox');
			var search_button = $('#btnGoSearch_1');
			return [search_input,search_button];
		}

		//页面初始化
		plugin_content.content_init = function(){
			//加载插件内容
			_this.append_plugin();
			
		//绑定选择套餐刷新价格事件
		  $(".prodInfo").click(function(){
					setTimeout(function(){
						_this.price_loaded = false;
						_this.refresh_content();
				},1000);
	  		});
	  
		}

		//获取商品名称
		plugin_content.get_name = function(){
			var goods_name = $("div[itemprop=name]").text();
			
			return goods_name;
		}

		//获取商品图片
		plugin_content.get_img = function(){
			var  goods_img =  $("img#i2").attr("src");
			return goods_img;
		}

		//获取商品价格
		plugin_content.get_price = function(){
			var prodPrice = $("span[itemprop=price]").text()
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
			var prodcategory = $("div[itemprop='breadcrumb']").text();
			return prodcategory;
		}
	
		//获取商品特性
		plugin_content.get_features = function(){
			var feature = new Object();
			feature.colors =getColorNames();
			feature.sizes = getSelectableSizes();
			return  feature;

		  	//获取可选尺码数据；
			function getSelectableSizes(){
			  var sizes = $("#divDistinctions").find("#divDistinctionBtn").length;
			  var options = "";
			  var hasAttr = false;
			  if(sizes > 0){
			  	hasAttr =true;
				for(i = 0; i < sizes; i++) {
				  if($("#divDistinctions").find("#divDistinctionBtn").eq(i).css("background-image") != null)
				  {
				  	options = $("#divDistinctions").find("#divDistinctionBtn").eq(i).text();
				    break;
				  }
				  }      
				}
			
			   if(!hasAttr)
			   {
			   	options =null;
			   }
			  return options;
			}
			//获取颜色类别；
			function getColorNames(){
			  var colors = $("#colorswitch").find("label.groupDistinctionLabel").length;
			  var options = "";
			  var hasAttr = false;
			  if (colors > 0){
			  	hasAttr = true;
				options =  $("#colorswitch").find("label.groupDistinctionLabel").text();
			  }
			  if(!hasAttr)
			  {
			  	options =null;
			  }
			  return options;
			}

			
		}
		plugin_content.init();
	}
}
