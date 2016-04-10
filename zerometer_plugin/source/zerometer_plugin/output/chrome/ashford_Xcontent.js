function localStartX(){
	// var plugin_content = new PluginContent();
	return function(plugin_content){
		var _this = plugin_content.get_this();

		plugin_content.site_id = 5;
		plugin_content.site_name = 'ashford';
		plugin_content.direct_mail_china = false;
		plugin_content.country = "US";

		//获取商品搜索框信息
		plugin_content.get_search_box = function(){
			var search_input = $('#globalSearchField');
			var search_button = $('#search button');
			return [search_input,search_button];
		}

		//页面初始化
		plugin_content.content_init = function(){
			//加载插件内容
			_this.append_plugin();
			
		//绑定选择套餐刷新价格事件
		 
	  
		}

		//获取商品名称
		plugin_content.get_name = function(){
			var goods_name = $("#prodName").text() + "" + $("#prodID").text();
			
			return goods_name;
		}

		//获取商品图片
		plugin_content.get_img = function(){
			var  goods_img =  "http://www.ashford.com" + $("img#prdDetailImg").attr("src");
			return goods_img;
		}

		//获取商品价格
		plugin_content.get_price = function(){
			var prodPrice = $("#pricing").find("th.highlight.PriceLabelAlign").siblings("td.highlight").text(); 
			prodPrice = prodPrice.replace(/,/g,'');
			var reg = /\$\s?(\d+(\.\d+)?)/i;
			var match_arr = prodPrice.match(reg);
			if(match_arr && typeof(match_arr[1])!="undefined") {
				prodPrice = match_arr[1];
			}
			else {
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
			return prodcategory;
		}
	
		//获取商品特性
		plugin_content.get_features = function(){
			var feature = new Object();
			return  feature;

		
			
			
		}
		plugin_content.init();
	}
}
