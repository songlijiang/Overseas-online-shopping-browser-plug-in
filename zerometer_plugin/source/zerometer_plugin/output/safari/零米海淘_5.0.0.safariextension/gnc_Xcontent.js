function localStartX(){
	return function(plugin_content){
		var _this = plugin_content.get_this();

		plugin_content.site_id = 21;
		plugin_content.site_name = 'gnc';
		plugin_content.direct_mail_china = false;
		plugin_content.country = "US";

		//��ȡ��Ʒ��������Ϣ
		plugin_content.get_search_box = function(){
			var search_input = $('#search-box');
			var search_button = $('#searchButton');
			return [search_input,search_button];
		}
		plugin_content.get_category = function(){
			var targetSpans = $("#breadcrumbs").find("a");
			var prodcategory = "";
			var len = targetSpans.length; 
			for (var i = 0; i < len; i++) { 
			  if(i == 0){
				continue;
			  }
			  else{
				if(i == len-1){
				  prodcategory += targetSpans[i].innerText;
				}
				else{
				  prodcategory += targetSpans[i].innerText + "|";
				}
			  }
			  
			}
			return prodcategory;
		}

		//ҳ���ʼ��
		plugin_content.content_init = function(){
			//���ز������
			_this.append_plugin();
				//��ѡ���ײ�ˢ�¼۸��¼�
			$(".product-sprite .flavor").click(function(){
				setTimeout(function(){
					_this.price_loaded = false;
					_this.refresh_content();
				},1000);
			});
		}

		//��ȡ��Ʒ����
		plugin_content.get_name = function(){
			var goods_name = '';
			var product_title = $('#product-title h2');
			if(product_title.length>0){
				goods_name = product_title.text();
			}else{
				goods_name = '';
			}
			return goods_name;
		}

		//��ȡ��ƷͼƬ
		plugin_content.get_img = function(){
			var product_images = $('#product-images .main-image-wrap img');
			if(product_images.length>0){
				var goods_img = product_images.attr('src');
			}else{
				var goods_img = '';
			}
			return goods_img;
		}

		//��ȡ��Ʒ�۸�
		plugin_content.get_price = function(){
			var prodPrice = '$0.00';
			var product_info1 = $('#product-info .product-price .now');
			var product_info2 = $('#product-info .product-price p');
			if (product_info1.length>0){
				prodPrice = product_info1.text()
			}else if(product_info2.length>0){
				prodPrice = product_info2.text();
			}
			prodPrice = prodPrice.replace(/,/g,'');
			prodPrice = prodPrice.replace(/(Sale\s)?Price:\s/i,'');
			prodPrice = prodPrice.replace(/^\$/,'');
			prodPrice = prodPrice;
			return prodPrice;
		}
		//��ȡ��Ʒ����
		plugin_content.get_features = function(){
			var feature = new Object();
			feature.flavors =getFlavorNames();
			var result =""; 
			result = JSON.stringify(feature); 
			return  JSON.parse(result);

			//��ȡ��Ʒ
			function getFlavorNames(){
			  var value = "";
			  var hasAttr = false;
			  if($(".product-flavors .active").length > 0){
			  	hasAttr = true; 
				value = $(".product-flavors .active").find('span').text();
			  }	
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
		plugin_content.init();
	}
}