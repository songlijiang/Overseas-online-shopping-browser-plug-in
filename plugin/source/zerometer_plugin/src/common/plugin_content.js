
/*
*插件通用类
*/
function PluginContent(){
	var _this = this;
	this.current_url = location.href;//当前页面的地址
	this.plugin_timer = null;//插件计时器
	this.translate_timer = null;//翻译计时器
	this.exchange_rate = 6.1345;//人名币与美元兑换汇率
	this.jpy_rate = 0.05297;//人名币与日元兑换汇率
	this.EUR_rate=6.7928 //欧元与人民币兑换汇率
	this.site_id = 0;//来源网站id
	this.site_name = '';//来源网站名称
	this.prodQty = 1;//商品数量
	this.default_weight = 0;//商品默认重量
	this.prodWeight = 0;//商品重量(磅)
	this.weight_loaded = false;//商品重量是否已经加载
	this.goodsPrice = 0;//商品单价
	this.goodsPriceCN = 0;
	this.price_loaded = false;//商品单价是否已经加载
	this.tax_type = 0;//关税类型
	this.dutiable_value = 0;//完税价格
	this.tax_rate = 0;//关税税率
	this.actual_tariff = 0;//实报关税
	this.default_tariff = 0;//默认关税
	this.tax_price = 0;//关税价格
	this.totleFee = 0;//总运费
	this.totlePrice = 0;//总价
	this.user_id = 0;//用户id
	this.user_mobile = null;//用户手机号码
	this.user_email=null;//用户邮箱
	this.favorite_added = false;//该商品用户是否已经添加关注
	this.order_submitting = false;//正在进行订单提交的标记
	this.eval_submitting = false;//正在进行评价提交的标记
	this.cart_page = 1;//默认显示第一页
	this.eval_page = 1;//默认显示第一页
	this.direct_mail_china = false;//是否支持直邮中国
	this.source_lang = 'en';
	this.proColor = null;  //商品颜色
	this.proSize = null;  //商品大小
	this.proFlavor = null;  //
	this.proStyle = null;  //口味
	this.proWidth = null;//宽度
	this.proInseam = null;//裤长
	this.feature_loaded = false;//是否加载特性
	this.country ="US";  //US  JP DE CN
	this.hiddenPlugin=false;

	
	//获取自身对象
	this.get_this = function(){return _this;}

	//插件初始化
	this.init = function(){
		//同步汇率
		PluginConf.get_exchange_rate();
		//加载插件css文件
		var css_obj = $('<link rel="stylesheet" type="text/css" href="'+PluginConf.css_file+'" />');
		css_obj.bind('load',function(){
			//载入页面
			kango.invokeAsync('kango.storage.getItem', 'plugin_switch', function(data){
				if(data!='off'){
					//优化商品搜索框
					_this.search_box_init();
					
					//进入网站时弹出直邮中国，国内信用卡的提示
					_this.show_site_tip();
					
					//获取用户id
					kango.invokeAsync('kango.storage.getItem', 'user_id', function(user_id) {
						_this.user_id = user_id;
						//获取美元汇率
						kango.invokeAsync('kango.storage.getItem', 'exchange_rate', function(exchange_rate){

							if(exchange_rate!=0 && exchange_rate != null){
								_this.exchange_rate = exchange_rate;
							}
							//获取日元汇率
							kango.invokeAsync('kango.storage.getItem', 'jpy_rate', function(jpy_rate){
								if(jpy_rate!=0 && jpy_rate != null){
									_this.jpy_rate = jpy_rate;
								}
								//页面初始化
								_this.content_init();

								////用户登录
								//_this.get_user_login();
								//
								////获取商品关注状态
								//_this.get_favorite_state();
								//
								////加载产品分类
								//_this.load_product_cat();
								//
								////加载转运渠道
								//_this.load_transport_way();
								//
								////刷新直邮中国标记
								//_this.refresh_china_tag();
								//
								////刷新内容
								_this.refresh_content();
								//

								////加载用户运单列表
								//_this.refresh_cart_list();
								//
								////获取商品评价数量
								//_this.load_eval_count();
								
								//绑定事件
								_this.bind_event();
								//记录用户浏览记录
								_this.record_view_history();

							});
						});
					});
				}
			});
			//划词翻译
			kango.invokeAsync('kango.storage.getItem', 'translate_switch', function(data){
				if(data!='off'){
					_this.enable_translate();
				}
			});
		}).prependTo($('body'));
	}
	
	//优化商品搜索框
	this.search_box_init = function(){
		var search_box_info = _this.get_search_box();
		var search_input = search_box_info[0];
		var search_button = search_box_info[1];
		if(search_input&&search_input.length>0){
			//添加翻译提示框
			var search_tip_obj = $('<div id="'+PluginConf.css_refix+'search_tip_main">可以直接输入中文，海淘100帮您翻译</div>').prependTo($('body'));
			var search_input_left = search_input.offset().left;
			var search_input_top = search_input.offset().top;
			var search_tip_top = search_input_top-40;
			if(search_tip_top<0){
				search_tip_top = search_input_top+search_input.outerHeight()+20;
				search_tip_obj.addClass(PluginConf.css_refix+'search_down_ico');
			}
			search_tip_obj.css({'left':(search_input_left+20)+'px','top':search_tip_top+'px'});
			//添加翻译结果栏
			var translate_result_obj = $('<div id="'+PluginConf.css_refix+'translate_result_main"></div>').prependTo($('body'));
			var translate_result_top = search_input_top-40;
			if(translate_result_top<0){
				translate_result_top = search_input_top+search_input.outerHeight()+10;
				translate_result_obj.addClass(PluginConf.css_refix+'search_down_ico');
			}
			translate_result_obj.css({'left':(search_input_left+20)+'px','top':translate_result_top+'px'}).click(function(){
				var translate_result_text = $(this).find('span').text();
				search_input.val(translate_result_text);
				$(this).hide();
				if(search_button){
					search_button.click();
				}
				else {
					/*var e = jQuery.Event("keyup");//模拟一个键盘事件
					e.keyCode =13;//keyCode=13是回车
					search_input.trigger(e);*/
					search_input.closest("form").submit();
				}
			});
			//绑定事件
			search_input.focus(function(){
				var search_words = $.trim($(this).val());
				if(search_words==''){
					translate_result_obj.hide();
				}
				//防止有些搜索框默认就有值
				setTimeout(function(){
					search_words = $.trim(search_input.val());
					if(search_words==''){
						search_tip_obj.show();
					}
				},500);
			}).blur(function(){
				search_tip_obj.hide();
			}).keyup(function(){
				clearTimeout(_this.translate_timer);
				var search_words = $.trim($(this).val());
				if(search_words==''){
					search_tip_obj.show();
					translate_result_obj.hide();
				}else{
					search_tip_obj.hide();
					_this.translate_timer = setTimeout(function(){
						var details = {
								url: 'http://fanyi.baidu.com/v2transapi',
								method: 'POST',
								async: true,
								params: {'from':'zh','to':_this.source_lang,'query':search_words,'transtype':'trans'},
								contentType: 'json'
						};
						kango.xhr.send(details, function(data) {
							if (data.status == 200 && data.response != null) {
								var result_obj = data.response;
								var result_data = result_obj.trans_result.data;
								var translate_result = ($.trim(result_data[0].dst)).toLowerCase();
								translate_result_obj.html('<span>'+translate_result+'</span><font>以上为百度翻译结果</font>').show();
							}
						});
					},1000);
				}
			});
		}
	};
	
	//获取商品搜索框信息
	this.get_search_box = function(){
		var search_input = null;
		var search_button = null;
		return [search_input,search_button];
	}
	
	//进入网站时弹出直邮中国，国内信用卡的提示
	this.show_site_tip = function(){
	/*	if(window.top == window){
			kango.invokeAsync('kango.storage.getItem', 'site_tip_switch', function(data){
				if(data==null || typeof(data[_this.site_id])=='undefined' || data[_this.site_id]=='on'){
					//获取该网站的信息
					var details = {
						url: PluginConf.get_interface_file('get_site_info',{'site_id':_this.site_id}),
						method: 'GET',
						async: true,
						contentType: 'json'
					};
					kango.xhr.send(details, function(data) {
						if (data.status == 200 && data.response != null) {
							var result_obj = data.response;
							var status = result_obj.status;
							if(status==1){
								var site_info = result_obj.attach;
								var credit_card_support = site_info.credit_card_support;
								var direct_mail_support = site_info.direct_mail_support;
								var site_tip_html = '<div id="'+PluginConf.css_refix+'site_tip_main">';
								site_tip_html += '<a id="'+PluginConf.css_refix+'site_tip_close" title="关闭">X</a>';
								site_tip_html += '<div>该网站'+(credit_card_support==1?'支持':'不支持')+'国内信用卡，'+(direct_mail_support==1?'支持':'不支持')+'直邮中国</div>';
								site_tip_html += '<div><a id="'+PluginConf.css_refix+'site_tip_know">我已了解，不再提示&gt;&gt;&gt;</a></div>';
								site_tip_html += '</div>';
								var site_tip_obj = $(site_tip_html).prependTo($('body')).mouseup(function(event){
									//阻止划词翻译
									event.stopPropagation();
								});;
								//绑定关闭弹窗事件
								site_tip_obj.find('#'+PluginConf.css_refix+'site_tip_close').click(function(){
									site_tip_obj.hide();
								});
								site_tip_obj.find('#'+PluginConf.css_refix+'site_tip_know').click(function(){
									site_tip_obj.hide();
									data[_this.site_id] = 'off';
									kango.invokeAsync('kango.storage.setItem', 'site_tip_switch', data);
								});
							}
						}else { // something went wrong
							
						}
					});
				}
			});
		}*/
	}
	
	//在网页上添加插件内容
	this.append_plugin = function(){
		console.log("ignore title and price error ,if there are any error!this only for test.");
		console.log('title='+($.trim(_this.get_name())).replace(/[\r\t]/g,""));
	    console.log('price='+_this.get_price());
		if(_this.get_name() && $.trim(_this.get_name()).length>0){
			//var plugin_container_html = '<div id="'+PluginConf.css_refix+'plugin_container">'+
			//								'<div id="'+PluginConf.css_refix+'plugin_position">'+
			//									'<img id="'+PluginConf.css_refix+'plugin_tag" src="'+PluginConf.img_path+'open.png"/>'+
			//									PluginDiv+
			//								'</div>'+
			//							'</div>';
			//var plugin_container = $(plugin_container_html);
			//plugin_container.find('#'+PluginConf.css_refix+'plugin_main').css({'position':'absolute','right':'38px','top':'26px','width':'450px','display':'none'});
			//plugin_container.hover(function(){
			//	$('#'+PluginConf.css_refix+'plugin_main').show();
			//},function(){
			//	_this.plugin_timer = setTimeout(function(){
			//		$('#'+PluginConf.css_refix+'plugin_main').hide();
			//	},300);
			//});
			//plugin_container.appendTo($('body'));

			$(document.createElement('div')).attr({
				id:PluginConf.css_refix+'Christmas'
			}).css({
				position: 'fixed',
				bottom: '0px',
				'width':(window.screen.width - 15) + 'px',//15px：右侧滚动条宽度
				'height':'300px',
				'z-index': '10000'
			}).appendTo(document.body);
			var plugin_container_html = PluginMain;
			var plugin_container = $(plugin_container_html);
			plugin_container.appendTo($('#'+PluginConf.css_refix+'Christmas'));

			// 加载 海淘助手页面的 提示信息和商品属性
			$('#'+PluginConf.css_refix+'content #'+PluginConf.css_refix+'contentIframe_other').hide();
			var infoTips =$("#"+PluginConf.css_refix+"infoTips");
			$(Tip).appendTo(infoTips);
			var featureSelect = $("#"+PluginConf.css_refix+"featureSelect");
			$(FeatureSelect).appendTo(featureSelect);
			// 不同商品专有的属性 显示并居中
			_this.append_feature_others();
			_this.append_login();
			var user_name = kango.storage.getItem('username');
			var login_server_status = _this.get_login_status();
			if(user_name != null && login_server_status== true)
			{
				$("#"+PluginConf.css_refix+"loginInfo").text("欢迎"+user_name+"");
			}
			else {
				//$("#"+PluginConf.css_refix+"loginInfo").append($("<a id='+PluginConf.css_refix+'login href=#>登录</a>|<a id='+PluginConf.css_refix+'register href=' + PluginConf.source_url + 'station/register>注册</a>"));
			}
			
		}
		

		

	}
	
	//重新加载插件
	this.plugin_reload = function(){
		var plugin_container = $('#'+PluginConf.css_refix+'plugin_container');
		if(_this.get_name()&& $.trim(_this.get_name()).length >0&&plugin_container.length==0){
			_this.append_plugin();
			_this.get_favorite_state();
			_this.load_product_cat();
			_this.load_transport_way();
			_this.refresh_china_tag();
			_this.refresh_cart_list();
			_this.load_eval_count();
			_this.refresh_content();
			_this.bind_event();
			_this.record_view_history();
		}else if(_this.get_name() && $.trim(_this.get_name()).length >0 &&plugin_container.length==1){
			_this.weight_loaded = false;
			_this.price_loaded = false;
			_this.refresh_content();
			_this.record_view_history();
			plugin_container.show();
		}else{
			plugin_container.hide();
		}
		$('#'+PluginConf.css_refix+'window_main').remove();
	}
	
	//开启划词翻译
	this.enable_translate = function(){

		$(document).mouseup(function(e){
			var translation_timer;
			//获取鼠标位置
			var mouse_x = e.pageX;
			var mouse_y = e.pageY;
			var mouse_type = e.which;//1:鼠标左键，2：鼠标中键，3：鼠标右键
			if(mouse_type==1){
				//获取选取的文字内容(延迟加载，防止点击已选择的文字再次触发)
				setTimeout(function(){
					var select_text = $.trim(_this.get_select_text());
					var translation_main = $('#'+PluginConf.css_refix+'translation_main');
					if(select_text!=''){
						if(_this.source_lang=='en' && select_text.indexOf(' ')==-1){//单个单词用金山词霸翻译
							var details = {
								url: 'http://open.iciba.com/huaci/dict.php?word='+select_text,
								method: 'GET',
								async: true,
								contentType: 'text'
							};
							kango.xhr.send(details, function(data) {
								if (data.status == 200 && data.response != null) {
									//翻译结果主元素
									translation_main = $('#'+PluginConf.css_refix+'translation_main');
									var result_html = (data.response).replace(/(^[\s\S]+?dict\.innerHTML=\'\s*)|(\';[\s\S]+?var\s+loading=)[\s\S]+$/g,'').replace(/\\"/g,'"');
									if(translation_main.length==0){
										var translation_main_html = '<div id="'+PluginConf.css_refix+'translation_main">'+
																		'<div id="'+PluginConf.css_refix+'translation_bar" onclick="_this.close_tra()"><i></i><a title="关闭窗口" ></a><h2>划词翻译</h2></div>'+
																		'<div id="'+PluginConf.css_refix+'translation_content">'+result_html+'</div>'+
																	'</div>';
										translation_main = $(translation_main_html);
										//translation_main.find('#icIBahyI-title').show();
										translation_main.find('.icIBahyI-new_word').hide();
										_this.set_translation_pos(translation_main,mouse_x,mouse_y);
										translation_main.mouseup(function(event){
											clearTimeout(translation_timer);
											event.stopPropagation();
										});
										$('body').append(translation_main);
										//关闭翻译窗口
										$('#'+PluginConf.css_refix+'translation_bar a').on('click',function(){
											var translation_main = $('#'+PluginConf.css_refix+'translation_main');
											if(translation_main.length>0){
												translation_main.hide();
											}
										});
									}else{
										translation_main.find('#'+PluginConf.css_refix+'translation_content').html(result_html);
										_this.set_translation_pos(translation_main,mouse_x,mouse_y);
										translation_main.show();
									}
								}else { // something went wrong
									
								}
							});
						}else{//词语或句子用百度翻译
							var details = {
									url: 'http://fanyi.baidu.com/v2transapi',
									method: 'POST',
									async: true,
									params: {'from':_this.source_lang,'to':'zh','query':select_text,'transtype':'trans'},
									contentType: 'json'
							};
							kango.xhr.send(details, function(data) {
									if (data.status == 200 && data.response != null) {
										var result_obj = data.response;
										var result_data = result_obj.trans_result.data;
										var translation_result = result_data[0].dst;
										//翻译结果主元素
										translation_main = $('#'+PluginConf.css_refix+'translation_main');
										var result_html = '<div>'+translation_result+'</div><div class="icIBahyI-footer"><a target="_blank" href="http://fanyi.baidu.com/translate#auto/zh/'+encodeURI(select_text)+'">以上为百度翻译结果</a></div>';
										if(translation_main.length==0){
											var translation_main_html = '<div id="'+PluginConf.css_refix+'translation_main">'+
																			'<div id="'+PluginConf.css_refix+'translation_bar"  onclick="_this.close_tra()"><i></i><a title="关闭窗口"></a><h2>划词翻译</h2></div>'+
																			'<div id="'+PluginConf.css_refix+'translation_content">'+result_html+'</div>'+
																		'</div>';
											translation_main = $(translation_main_html);
											_this.set_translation_pos(translation_main,mouse_x,mouse_y);
											translation_main.mouseup(function(event){
												clearTimeout(translation_timer);
												event.stopPropagation();
											});
											$('body').append(translation_main);
											//关闭翻译窗口
											$('#'+PluginConf.css_refix+'translation_bar a').on('click',function(){
												var translation_main = $('#'+PluginConf.css_refix+'translation_main');
												if(translation_main.length>0){
													translation_main.hide();
												}
											});
										}else{
											translation_main.find('#'+PluginConf.css_refix+'translation_content').html(result_html);
											_this.set_translation_pos(translation_main,mouse_x,mouse_y);
											translation_main.show();
										}
									}else { // something went wrong
										
									}
							});
						}
					}else{
						translation_timer = setTimeout(function(){
							 translation_main.hide();
						},100);
					}
				},100);
			}
		});

	}
	
	//获取选取的文字内容
	this.get_select_text = function(){
		if(window.getSelection){//现代浏览器
			return window.getSelection();
		}else{//IE浏览器
			return document.selection.createRange().text;
		}
	}
	
	//设置翻译窗口的位置
	this.set_translation_pos = function(window_obj,mouse_x,mouse_y){
		//获取文档的大小
		var cw = $(document).width();
		var ch = $(document).height();
		//获取翻译窗口的大小
		var w = window_obj.outerWidth();
		var h = window_obj.outerHeight();
		//窗口位置与鼠标点击位置的偏移
		var offset_x = 10;
		var offset_y = 10;
		if(mouse_x+offset_x+w>cw){
			var left = mouse_x-(offset_x+w);
		}else{
			var left = mouse_x+offset_x;
		}
		if(mouse_y+offset_y+h>ch){
			var top = mouse_y-(offset_y+h);
		}else{
			var top =  mouse_y+offset_y;
		}
		window_obj.css({'left':left+'px','top':top+'px'});
	}
	this.close_tra = function ()
	{
		alert("close");
		$('#'+PluginConf.css_refix+'translation_main').hide();

	}
	//不同网页的初始化方法
	this.content_init = function(){}

	this.refresh_loginstatus=function(){
		var user_name = kango.storage.getItem('username');
		var login_server_status = _this.get_login_status();
		if(user_name != null && login_server_status== true)
		{
			$("#"+PluginConf.css_refix+"loginInfo").text("欢迎"+user_name+"");
		}
		else {
			$("#"+PluginConf.css_refix+"loginInfo").text("");
			$("#"+PluginConf.css_refix+"loginInfo").append($("<a id='+PluginConf.css_refix+'login href=#>登录</a>|<a id='+PluginConf.css_refix+'register href=' + PluginConf.source_url + 'station/register>注册</a>"));
		}
	}

	//刷新全部内容
	this.refresh_content = function(){
		kango.console.log('start to refreshing.....');
		_this.refresh_exchange_rate();
		_this.refresh_prodQty();
		_this.refresh_price();
		_this.refresh_weight();
		_this.refresh_actual_tariff();
		_this.refresh_default_tariff();
		_this.refresh_fee();
		_this.refresh_totle_price();
		_this.refresh_feature_others();
		var stock_state = _this.out_of_stock();
		kango.console.log('refreshed done');
		kango.console.log('stock_state='+stock_state);
		var button_putCart = $('#'+PluginConf.css_refix+'button_putCart');
		if(!stock_state)
		{
			button_putCart.attr("value", "加入购物车");
			$('#'+PluginConf.css_refix+'button_putCart').attr("disabled", false); 
		}
		else
		{
			if(button_putCart.length > 0){
				button_putCart.attr("value", "商品缺货");
				button_putCart.attr("disabled", true); 
			}
		}
	}
	
	var pluginMainEventBind = function(){
		//设置插件宽度
		$('#'+PluginConf.css_refix+'plugin').css('width',(window.screen.width-15) + 'px');//15px:右边滚动条宽度
		
		var currentIndex = 0;//零米海淘助手
		var lastCurrentIndex = 0;//零米海淘助手
		var pluginLis = $('#'+PluginConf.css_refix+'plugin #'+PluginConf.css_refix+'right li');
		if(pluginLis){
			pluginLis.each(function(index,element){
				$(element).click(function(){
			　　　　//adding your code here
					//alert($(this).find("div").text());
					clickEventListener(element);
			　　}); 
			});
		}
	　　pluginLis = $('#'+PluginConf.css_refix+'plugin #'+PluginConf.css_refix+'left li');
		if(pluginLis){
			pluginLis.each(function(index,element){
				$(element).click(function(){
			　　　　//adding your code here
					//alert($(this).find("div").text());
					clickEventListener(element);
			　　}); 
			});
		}
		
		/**
		点击事件处理
		**/
		function clickEventListener(element){
			var elementId = $(element).attr("index");
			if(elementId){
				lastCurrentIndex = currentIndex;
				currentIndex = elementId - PluginConf.base_li_index;
			}
			
			//渲染插件
			pluginRender(currentIndex);
		}
		
		/**
		渲染插件主页面
		**/
		function pluginRender(currentIndex){
			/**
				currentIndex为0：
					零米海淘助手页面
				currentIndex为1：
					购物车页面
				currentIndex为2：
					我的订单页面
				currentIndex为3：
					我的收藏页面
				currentIndex为4：
					优惠推荐页面
				currentIndex为5：
					个人中心页面
			**/
			var leftUl = $('#'+PluginConf.css_refix+'left');
			var leftLis = $('#'+PluginConf.css_refix+'left li');
			var rightUl = $('#'+PluginConf.css_refix+'right');
			var rightLis = $('#'+PluginConf.css_refix+'right li');
			var horDiv = $('#'+PluginConf.css_refix+'hor');
			var content = $('#'+PluginConf.css_refix+'content');
			var boderTopStyle = '3px solid '+getBorderColor(currentIndex);
			if(currentIndex >= lastCurrentIndex){
				var tagetEle;
				for(var i=lastCurrentIndex;i<currentIndex;i++){
					tagetEle = $('#'+PluginConf.css_refix+(PluginConf.base_li_index+i));
					leftUl.append(tagetEle);
				}
				
				leftUl.css("display","block");
				leftUl.css("width",1.8*currentIndex + "%");
				leftLis = $('#'+PluginConf.css_refix+'left li');
				leftLis.each(function(){$(this).css("width",100/currentIndex+"%")});
				
				rightUl.css("right","-"+(currentIndex-1)*1.8 +"%");
				
				horDiv.css("display","none");
				content.css("borderTop", boderTopStyle);
				content.css("left",1.8*currentIndex + "%");
				content.css("width","89.2%");
				content.css("height","100%");
			}
			else{
				var tagetEle;
				if(currentIndex != 0){
					for(var i=lastCurrentIndex;i>currentIndex;i--){
						tagetEle = $('#'+PluginConf.css_refix+(PluginConf.base_li_index+(i-1)));
						rightUl.prepend(tagetEle);
					}
				}
				else{//特殊情况
					if(horDiv.css("display") == "block"){
						return;
					}
					for(var i=lastCurrentIndex;i>1;i--){
						tagetEle = $('#'+PluginConf.css_refix+(PluginConf.base_li_index+(i-1)));
						rightUl.prepend(tagetEle);
					}
				}
				
				leftUl.css("display","block");
				leftUl.css("width",1.8*currentIndex + "%");
				leftLis = $('#'+PluginConf.css_refix+'left li');
				leftLis.each(function(){$(this).css("width",100/currentIndex+"%")});
				
				//rightUl.css("width",1.8*(6-currentIndex) + "%");
				rightLis = $('#'+PluginConf.css_refix+'right li');
				rightLis.each(function(){$(this).css("width",100/5/*(6-currentIndex)*/+"%")});
				
				if(currentIndex != 0){
					rightUl.css("right","-"+(currentIndex-1)*1.8 +"%");
					content.css("width","90.2%");
					horDiv.css("display","none");
				}
				else{//特殊情况
					rightUl.css("right","0%");
					content.css("width","91%");
					horDiv.css("display","block");//显示hor
				}
				
				content.css("borderTop", boderTopStyle);
				content.css("left",1.8*currentIndex + "%");
			}
			
			//渲染content内容
			contentRendering(currentIndex);
		}
		
		function getBorderColor(currentIndex){
			switch(currentIndex){
				case 0:
					return 'rgb(240,73,67)';
				case 1:
					return 'rgb(56,124,190)';
				case 2:
					return 'rgb(252,125,90)';
				case 3:
					return 'rgb(143,68,173)';
				case 4:
					return 'rgb(248,62,155)';
				case 5:
					return 'rgb(0,153,126)';
			}	
		}
		
		//根据currentIndex渲染content内容
		function contentRendering(currentIndex){
			var contentIframe = $('#'+PluginConf.css_refix+'content #'+PluginConf.css_refix+'contentIframe');
			var other_contentIframe = $('#'+PluginConf.css_refix+'content #'+PluginConf.css_refix+'contentIframe_other');
			var featureSelect = $('#'+PluginConf.css_refix+'featureSelect');
			var infoTips = $('#'+PluginConf.css_refix+'infoTips');
			var sizeAssistant = $('#'+PluginConf.css_refix+'sizeAssistant');
			switch(currentIndex){
				case 0:
					init_assistantPage();
					break;
				case 1:
					init_otherPage("siderbar/cart");
					break;
				case 2:
					init_otherPage("sidebar/bill");
					break;
				case 3:
					init_otherPage("userinfo/sidebar/fav");
					break;
				case 4:
					init_otherPage("userinfo/sidebar/fav");
					break;
				case 5:
					init_otherPage("userinfo/sidebar/info");
					break;
			}
			function init_otherPage(src_url) {
				var local_status = kango.storage.getItem('username');
				var server_status = _this.get_login_status();
				if (local_status == null || server_status == false) {
					_this.get_user_login();
					contentRendering(0);
				}
				else {
					sizeAssistant.hide();
					infoTips.hide();
					featureSelect.hide();
					other_contentIframe.show();
					other_contentIframe.attr('src', PluginConf.source_url + src_url);
				}
			}
			function init_assistantPage()
			{
				_this.refresh_loginstatus();
				contentIframe.attr('src',''+PluginConf.source_url+'newPlugin/sizechange');
				other_contentIframe.hide();
				sizeAssistant.show();
				infoTips.show();
				featureSelect.show();
			}
		}
		//收缩插件
		$('#'+PluginConf.css_refix+'shrink').click(function(){
			var rightUl = $('#'+PluginConf.css_refix+'right');
			var left_length  = $('#'+PluginConf.css_refix+'left li').length;
			if(!_this.hiddenPlugin)
			{
				for(var i=0;i<left_length-1;i++){
					tagetEle = $('#'+PluginConf.css_refix+(PluginConf.base_li_index+(left_length-i-1)));
					rightUl.prepend(tagetEle);
				}
				currentIndex =0;
				lastCurrentIndex =0;
				pluginRender(0);
				$('#'+PluginConf.css_refix+'content').css("border-top-width","0");
				$('#'+PluginConf.css_refix+'content').css("left","0%");
				$('#'+PluginConf.css_refix+'content').css("width","91%");
				$('#'+PluginConf.css_refix+'right').css("right","0%");
				$('#'+PluginConf.css_refix+'right li').css("width","20%");
				$('.'+PluginConf.css_refix+'info').css("margin-top","100px");
				$('#'+PluginConf.css_refix+'left').css("width","0%");
				$('#'+PluginConf.css_refix+'hor').show();
				$('#'+PluginConf.css_refix+'Christmas').css("bottom","-260px");
				_this.hiddenPlugin = true;
			}
			else {
				$('.'+PluginConf.css_refix+'info').css("margin-top","30px");
				$('#'+PluginConf.css_refix+'Christmas').css("bottom","0px");
				_this.hiddenPlugin = false;
			}
		});
		//减少商品数量
		$('#'+PluginConf.css_refix+'prodQty_reduce').click(function(){
			if(_this.prodQty>1){
				_this.prodQty -= 1;
				_this.refresh_content();
				_this.refresh_actual_tariff();
				_this.refresh_default_tariff();
			}
		});
		//增加商品数量
		$('#'+PluginConf.css_refix+'prodQty_add').click(function(){
			_this.prodQty += 1;
			_this.refresh_content();
			_this.refresh_actual_tariff();
			_this.refresh_default_tariff();
		});
		_this.bind_login();
		//加入购物车
		$('#'+PluginConf.css_refix+'button_putCart').click(function(){
			var feature_text = $("#"+PluginConf.css_refix+"featureSelect_all").text();
			if(($.trim(feature_text)).indexOf("选择")>0)
			{
				alert("请在页面选择");
				return;
			}
			var result =  kango.storage.getItem('username');
			var server_status = _this.get_login_status();
			alert(server_status);
			if(result == null || server_status==false)
			{
				_this.get_user_login();
			}
			else
			{
				_this.addToHelpMeBuyCart();
			}
		});
		//登录
		$('#'+PluginConf.css_refix+'login').click(function(){
			_this.get_user_login();
		});
		//加入收藏
		$('#'+PluginConf.css_refix+'like').click(function(){
			_this.add_favorite();
		});

	}
	//绑定事件
	this.bind_event = function(){
		//插件主框架时间监听
		pluginMainEventBind();
		//插件窗口取消划词翻译
		$('#'+PluginConf.css_refix+'plugin_main').mouseup(function(event){
			$('#'+PluginConf.css_refix+'translation_bar a').click();
			//event.stopPropagation();
		});
		//切换选项卡
		$('#'+PluginConf.css_refix+'top_bar_ul .'+PluginConf.css_refix+'top_bar_li').click(function(){
			var show_id = $(this).attr('show_id');
			$('#'+PluginConf.css_refix+'top_bar_ul .'+PluginConf.css_refix+'top_bar_li').removeClass(PluginConf.css_refix+'selected_li');
			$(this).addClass(PluginConf.css_refix+'selected_li');
			$('#'+PluginConf.css_refix+'plugin_main .'+PluginConf.css_refix+'tab_content').hide();
			$('#'+show_id).show();
		});
		//显示运单列表
		$('#'+PluginConf.css_refix+'cart_content_tab').click(function(){
			_this.show_cart_list();
		});
		//加载商品评论信息
		$('#'+PluginConf.css_refix+'eval_content_tab').click(function(){
			_this.refresh_eval_info();
		});
		
		//绑定手机号
		$('#'+PluginConf.css_refix+'bind_mobile').on('click',function(){
			$(this).hide();
			$('#'+PluginConf.css_refix+'bind_result').hide();
			$('#'+PluginConf.css_refix+'bind_show').show();
		});
		$('#'+PluginConf.css_refix+'bind_ok').on('click',function(){
			var mobile_text = $('#'+PluginConf.css_refix+'mobile_text');
			var mobile_num = $.trim(mobile_text.val());
			if(!/^\d{11}$/.test(mobile_num)){
				alert('手机号码格式不正确！');
				mobile_text.focus();
				return;
			}
			//提交手机号码的处理
			var details = {
				url: PluginConf.get_interface_file('bind_user_mobile'),
				method: 'POST',
				async: true,
				params: {'user_id':_this.user_id,'user_mobile':mobile_num},
				contentType: 'json'
			};
			kango.xhr.send(details, function(data) {
				if (data.status == 200 && data.response != null) {
					var result_obj = data.response;
					var status = result_obj.status;
					if(status==1){
						_this.user_mobile = mobile_num;
						$('#'+PluginConf.css_refix+'bind_show').hide();
						$('#'+PluginConf.css_refix+'bind_mobile').text('重新绑定').show();
						$('#'+PluginConf.css_refix+'bind_result').show().find('font').text(mobile_num);
					}else{
						alert(result_obj.message);
					}
				}else { // something went wrong
					
				}
			});
		});
		$('#'+PluginConf.css_refix+'bind_cancle').on('click',function(){
			$('#'+PluginConf.css_refix+'bind_show').hide();
			$('#'+PluginConf.css_refix+'bind_result').show();
			$('#'+PluginConf.css_refix+'bind_mobile').show();
		});

			//关闭划词翻译
			
		//切换关税类型
		$('#'+PluginConf.css_refix+'tax_type input').change(function(){
			if($(this).val()=='actual'){
				$('#'+PluginConf.css_refix+'actual_tariff_main').show();
				$('#'+PluginConf.css_refix+'default_tariff_main').hide();
			}else{
				$('#'+PluginConf.css_refix+'actual_tariff_main').hide();
				$('#'+PluginConf.css_refix+'default_tariff_main').show();
			}
			_this.refresh_totle_price();
		});
		//切换是否含税
		$('#'+PluginConf.css_refix+'tax_switch').click(function(){
			var state = $(this).attr('state');
			if(state=='on'){
				var after_state = 'off';
				$(this).attr('state',after_state);
				$(this).addClass(PluginConf.css_refix+'switch_off');
				$('#'+PluginConf.css_refix+'actual_tariff').addClass(PluginConf.css_refix+'delete_line');
				$('#'+PluginConf.css_refix+'default_tariff').addClass(PluginConf.css_refix+'delete_line');
			}else{
				var after_state = 'on';
				$(this).attr('state',after_state);
				$(this).removeClass(PluginConf.css_refix+'switch_off');
				$('#'+PluginConf.css_refix+'actual_tariff').removeClass(PluginConf.css_refix+'delete_line');
				$('#'+PluginConf.css_refix+'default_tariff').removeClass(PluginConf.css_refix+'delete_line');
			}
			_this.refresh_totle_price();
		});
		//防止划过select下拉列表触发外层div的mouseout
		$('#'+PluginConf.css_refix+'plugin_main select').on('mouseover',function(){
			clearTimeout(_this.plugin_timer);
		});
		//一键提交转运的处理
		$('#'+PluginConf.css_refix+'plugin_submit').click(function(){
			if(_this.tax_rate==0){
				alert('请选择报关种类！');
				return false;
			}
			var window_back = $('#'+PluginConf.css_refix+'window_back');
			if(window_back.length==0){
				window_back = $(PluginBack).appendTo($('body'));
			}else{
				window_back.show();
			}
			window_back.width($(document).width());
			window_back.height($(document).height());
			
			var window_main = $('#'+PluginConf.css_refix+'window_main');
			if(window_main.length==0){
				window_main = $(PluginWindow).appendTo($('body'));
				//获取用户收货地址
				var details = {
					url: PluginConf.get_interface_file('get_user_address',{'user_id':_this.user_id}),
					method: 'GET',
					async: true,
					contentType: 'json'
				};
				kango.xhr.send(details, function(data) {
					if (data.status == 200 && data.response != null) {
						var user_address_obj = data.response;
						var user_province = 0;
						var user_city = 0;
						var user_district = 0;
						if(user_address_obj.status==1){
							var address_arr = user_address_obj.attach;
							if(address_arr.user_province){
								user_province = address_arr.user_province;
							}
							if(address_arr.user_city){
								user_city = address_arr.user_city;
							}
							if(address_arr.user_district){
								user_district = address_arr.user_district;
							}
							if(address_arr.user_name){
								$('#'+PluginConf.css_refix+'receive_name').val(address_arr.user_name);
							}
							if(address_arr.user_mobile){
								$('#'+PluginConf.css_refix+'receive_mobile').val(address_arr.user_mobile);
							}else if(_this.user_mobile){
								$('#'+PluginConf.css_refix+'receive_mobile').val(_this.user_mobile);
							}
							if(address_arr.user_address){
								$('#'+PluginConf.css_refix+'receive_address').val(address_arr.user_address);
							}
						}else{
							if(_this.user_mobile){
								$('#'+PluginConf.css_refix+'receive_mobile').val(_this.user_mobile);
							}
						}
						//加载地区选择控件
						var area_obj = load_area_widget(PluginConf.css_refix+'area',{
							'province_id':user_province,
							'city_id':user_city,
							'district_id':user_district
						});
					}
				});
				//获取转运地址列表
				var details = {
					url: PluginConf.get_interface_file('get_transport_address_list'),
					method: 'GET',
					async: true,
					contentType: 'text'
				};
				kango.xhr.send(details, function(data) {
					if (data.status == 200 && data.response != null) {
						var transport_address_obj = JSON.parse(data.response);//eval('('+data.response+')');
						if(transport_address_obj.status==1){
							var address_arr = transport_address_obj.attach;
							var transport_address_option = '';
							for(var i=0,len=address_arr.length;i<len;i++){
								transport_address_option += '<option value="'+address_arr[i].address_id+'">'+address_arr[i].address_name+'</option>';
							}
						}else{
							var transport_address_option = '<option value="0">转运地址列表为空</option>';
						}
						$('#'+PluginConf.css_refix+'transport_address').empty().append(transport_address_option);
					}else { // something went wrong
						
					}
				});
				//加载新浪微博分享插件
				var sina_weibo_share = $('<a id="'+PluginConf.css_refix+'sina_weibo_share" title="新浪微博分享" href="javascript:;"><img src="'+PluginConf.img_path+'sina_favicon.ico" width="16px" height="16px" border="0">分享到新浪微博</a>').insertAfter($('#'+PluginConf.css_refix+'transport_submit')).click(function(){
					var share_title = '用#海淘100#插件提交转运，分享新浪微博享折扣！';
					window.top.open('http://v.t.sina.com.cn/share/share.php?title='+encodeURIComponent(share_title)+'&url='+encodeURIComponent(_this.current_url)+'&source=bookmark&pic='+_this.get_img(),'_blank','width=450,height=400');
				});
				//绑定事件
				window_main.mouseup(function(event){
					$('#'+PluginConf.css_refix+'translation_bar a').click();
					event.stopPropagation();
				});
				$('#'+PluginConf.css_refix+'tax_include').change(function(){
					var declared_value_obj = $('#'+PluginConf.css_refix+'declared_value');
					var declared_value = parseFloat(declared_value_obj.val());
					if($(this).is(':checked')){
						declared_value += _this.tax_price;
					}else{
						declared_value -= _this.tax_price;
					}
					declared_value_obj.val(declared_value.toFixed(2));
				});
				$('#'+PluginConf.css_refix+'declared_value').blur(function(){
					var declared_value = parseFloat($(this).val());
					if(!/^\d+(\.\d+)?$/.test(declared_value)){
						alert('价格格式不正确！');
						if($('#'+PluginConf.css_refix+'tax_include').is(':checked')){
							var tax_price = _this.tax_price;
						}else{
							var tax_price = 0;
						}
						var unit_price = _this.goodsPrice + tax_price;
						$(this).val(unit_price);
					}else{
						if($('#'+PluginConf.css_refix+'tax_include').is(':checked')){
							if(declared_value<_this.tax_price){
								$(this).val(_this.tax_price);
							}
						}
					}
				});
				$('#'+PluginConf.css_refix+'declared_num').blur(function(){
					var declared_num = $.trim($(this).val());
					if(!/^\d+(\.\d+)?$/.test(declared_num)||declared_num==0){
						$(this).val(_this.prodQty);
						var kgWeight = Math.round(_this.prodWeight*_this.prodQty*PluginConf.lb_rate*100)/100;
					}else{
						var kgWeight = Math.round(_this.prodWeight*declared_num*PluginConf.lb_rate*100)/100;
					}
					$('#'+PluginConf.css_refix+'goods_kg').val(kgWeight);
				});
			}else{
				window_main.show();
			}
			//窗口居中
			if(document.compatMode === 'BackCompat'){//浏览器怪异模式
				var sw = document.body.clientWidth;
				var sh = document.body.clientHeight;
			}else{
				var sw = $(window).width();
				var sh = $(window).height();
			}
			var w = window_main.outerWidth();
			var h = window_main.outerHeight();
			var scroll_left = $(document).scrollLeft();
			var scroll_top = $(document).scrollTop();
			var w_left = scroll_left + Math.round((sw-w)/2);
			var w_top = scroll_top + Math.round((sh-h)/2);
			window_main.css({'left':w_left+'px','top':w_top+'px'});
			//加载数据
			var cat_option = $('#'+PluginConf.css_refix+'product_cat option:selected');
			var goods_cat_str = '';
			cat_option.each(function(){
				goods_cat_str += $(this).text()+'>>';
			});
			goods_cat_str = goods_cat_str.replace(/>>$/,'');
			$('#'+PluginConf.css_refix+'goods_cat').text(goods_cat_str);
			
			var declared_price = _this.goodsPrice;
			var tax_state = $('#'+PluginConf.css_refix+'tax_switch').attr('state');
			if(tax_state=='on'){
				declared_price += _this.tax_price;
				$('#'+PluginConf.css_refix+'tax_include').attr('checked',true);
			}else{
				$('#'+PluginConf.css_refix+'tax_include').attr('checked',false);
			}
			$('#'+PluginConf.css_refix+'declared_value').val(declared_price.toFixed(2));
			$('#'+PluginConf.css_refix+'transport_fee').text(_this.totleFee);
			$('#'+PluginConf.css_refix+'declared_num').val(_this.prodQty);
			
			
			var kgWeight = Math.round(_this.prodWeight*_this.prodQty*PluginConf.lb_rate*100)/100;
			$('#'+PluginConf.css_refix+'goods_kg').val(kgWeight);
		});
		//关闭转运窗口
		$('#'+PluginConf.css_refix+'window_close').on('click',function(){
			$('#'+PluginConf.css_refix+'window_back').hide();
			$('#'+PluginConf.css_refix+'window_main').hide();
		});
		//提交转运数据
		$('#'+PluginConf.css_refix+'transport_form').on('submit',function(){
			//获取要提交的数据
			var goods_url = _this.current_url;
			var goods_name = _this.get_name();
			var goods_img = _this.get_img();
			var tax_include = ($('#'+PluginConf.css_refix+'tax_include').is(':checked'))?1:0;
			var goods_price = parseFloat($('#'+PluginConf.css_refix+'declared_value').val());
			if(tax_include==1){
				goods_price = (goods_price-_this.tax_price).toFixed(2);
			}
			var goods_num = parseInt($('#'+PluginConf.css_refix+'declared_num').val());
			var zh_goods_name_obj = $('#'+PluginConf.css_refix+'zh_goods_name');
			var zh_goods_name = $.trim(zh_goods_name_obj.val());
			var receive_name_obj = $('#'+PluginConf.css_refix+'receive_name');
			var receive_name = $.trim(receive_name_obj.val());
			if(receive_name==''){
				alert('请输入收件人姓名！');
				receive_name_obj.focus();
				return false;
			}
			var receive_mobile_obj = $('#'+PluginConf.css_refix+'receive_mobile');
			var receive_mobile = $.trim(receive_mobile_obj.val());
			if(receive_mobile==''){
				alert('请输入手机号码！');
				receive_mobile_obj.focus();
				return false;
			}
			if(!/^\d{11}$/.test(receive_mobile)){
				alert('手机号码格式不正确！');
				receive_mobile_obj.focus();
				return false;
			}
			var receive_province_obj = $('#'+PluginConf.css_refix+'province_id');
			var receive_province = parseInt(receive_province_obj.val());
			if(receive_province==0){
				alert('请选择省份！');
				return false;
			}
			var receive_city_obj = $('#'+PluginConf.css_refix+'city_id');
			var receive_city = parseInt(receive_city_obj.val());
			if(receive_city==0){
				alert('请选择城市！');
				return false;
			}
			var receive_district_obj = $('#'+PluginConf.css_refix+'district_id');
			var receive_district = parseInt(receive_district_obj.val());
			if(receive_district==0){
				alert('请选择区县！');
				return false;
			}
			var receive_address_obj = $('#'+PluginConf.css_refix+'receive_address');
			var receive_address = $.trim(receive_address_obj.val());
			if(receive_address==''){
				alert('请输入详细街道地址！');
				receive_address_obj.focus();
				return false;
			}
			var attach_service_obj = $('#'+PluginConf.css_refix+'attach_service input:checkbox');
			var attach_service1 = $(attach_service_obj[0]).is(':checked')?1:0;
			var attach_service2 = $(attach_service_obj[1]).is(':checked')?1:0;
			var attach_service3 = $(attach_service_obj[2]).is(':checked')?1:0;
			var attach_service4 = $(attach_service_obj[3]).is(':checked')?1:0;
			var taddress_id = $('#'+PluginConf.css_refix+'transport_address').val();
			var order_remarks = $('#'+PluginConf.css_refix+'order_remarks').val();
			
			//防止重复提交
			if(_this.order_submitting){
				return false;
			}else{
				_this.order_submitting = true;
			}
			
			//提交订单
			var details = {
				url: PluginConf.get_interface_file('transport_submit'),
				method: 'POST',
				async: true,
				params: {'user_id':_this.user_id,'site_id':_this.site_id,'goods_url':goods_url,'goods_img':goods_img,'goods_name':goods_name,'goods_price':goods_price,'goods_num':goods_num,'zh_goods_name':zh_goods_name,
				'tax_price':_this.tax_price,'tax_include':tax_include,'receive_name':receive_name,'receive_mobile':receive_mobile,'receive_province':receive_province,'receive_city':receive_city,'receive_district':receive_district,
				'receive_address':receive_address,'taddress_id':taddress_id,'attach_service1':attach_service1,'attach_service2':attach_service2,'attach_service3':attach_service3,'attach_service4':attach_service4,'order_remarks':order_remarks},
				contentType: 'json'
			};
			kango.xhr.send(details, function(data) {
				if (data.status == 200 && data.response != null) {
					var result_obj = data.response;
					var status = result_obj.status;
					if(status==1){
						var order_id = result_obj.attach.order_id;//获取提交之后的订单id
						//$('#'+PluginConf.css_refix+'transport_form')[0].reset();//重置表单
						$('#'+PluginConf.css_refix+'window_main').hide();
						var window_success_main = $('#'+PluginConf.css_refix+'window_success_main');
						if(window_success_main.length==0){
							window_success_main = $(PluginSuccess).appendTo($('body'));
						}else{
							window_success_main.show();
						}
						//加载新浪微博分享插件
						$('#'+PluginConf.css_refix+'window_success_share').empty().append('分享到新浪微博，立享折扣！<a href="javascript:;"><img src="'+PluginConf.img_path+'sina_favicon.ico" width="16px" height="16px" border="0"/></a>').find('a').click(function(){
							var share_title = '我在'+_this.site_name+'用#海淘100#插件购买了【'+_this.get_name()+'】，获得了2元折扣。@小伙伴1@小伙伴2,@小伙伴3';
							window.top.open('http://v.t.sina.com.cn/share/share.php?title='+encodeURIComponent(share_title)+'&url='+encodeURIComponent(_this.current_url)+'&source=bookmark&pic='+_this.get_img()+'&order_id='+order_id,'_blank','width=450,height=400');
						});
						//窗口居中
						var sw = $(window).width();
						var sh = $(window).height();
						var w = window_success_main.outerWidth();
						var h = window_success_main.outerHeight();
						var scroll_left = $(document).scrollLeft();
						var scroll_top = $(document).scrollTop();
						var w_left = scroll_left + Math.round((sw-w)/2);
						var w_top = scroll_top + Math.round((sh-h)/2);
						window_success_main.css({'left':w_left+'px','top':w_top+'px'});
						//重置订单提交标记
						_this.order_submitting = false;
						//绑定事件
						$('#'+PluginConf.css_refix+'window_success_ok').unbind('click').click(function(){
							var submit_x = $(this).offset().left;
							var submit_y = $(this).offset().top;
							var submit_w = $(this).outerWidth();
							var submit_h = $(this).outerHeight();
							var plugin_container = $('#'+PluginConf.css_refix+'plugin_container');
							if(plugin_container.length>0){
								var end_obj = plugin_container;
							}else{
								var end_obj = $('#'+PluginConf.css_refix+'cart_count');
							}
							var end_x = end_obj.offset().left;
							var end_y = end_obj.offset().top;
							var end_w = end_obj.outerWidth();
							var end_h = end_obj.outerHeight();
							//关闭窗口
							$('#'+PluginConf.css_refix+'window_back').hide();
							$('#'+PluginConf.css_refix+'window_success_main').hide();
							//开始动画效果
							$('<img id="'+PluginConf.css_refix+'animate_cart" src="'+PluginConf.img_path+'cart_ico.png"/>')
							.css({'width':'40px','height':'40px','opacity':1,'left':(submit_x+submit_w/2-20)+'px','top':(submit_y+submit_h/2-20)+'px'}).appendTo($('body'))
							.animate({'width':'12px','height':'12px','opacity':0.5,'left':(end_x+end_w/2-20)+'px','top':(end_y+end_h/2-20)+'px'},1000,function(){
								$(this).remove();
								//刷新运单列表
								_this.cart_page = 1;
								_this.refresh_cart_list();
								//运单个数闪烁
								var light_count = 0;
								var light_class = PluginConf.css_refix+'light_class';
								var cart_count = $('#'+PluginConf.css_refix+'cart_count');
								var light_timer = setInterval(function(){
									if(cart_count.hasClass(light_class)){
										cart_count.removeClass(light_class);
										light_count += 1;
										if(light_count==5){
											clearInterval(light_timer);
										}
									}else{
										cart_count.addClass(light_class);
									}
								},300);
							});
						});
					}else{
						alert(result_obj.message);
						//重置订单提交标记
						_this.order_submitting = false;
					}
				}else { // something went wrong
					
				}
			});
			return false;
		});
		//提交运单号
		$('#'+PluginConf.css_refix+'cart_table .'+PluginConf.css_refix+'shipping_num_submit a').on('click',function(){
			var this_obj = $(this);
			var shipping_num_obj = $(this).parent().siblings('.'+PluginConf.css_refix+'shipping_num_text').find('input');
			var shipping_num = $.trim(shipping_num_obj.val());
			var order_id_obj = $(this).parents('tr');
			var order_id = order_id_obj.attr('order_id');
			if(shipping_num!=''){
				var details = {
					url: PluginConf.get_interface_file('update_shipping_num'),
					method: 'POST',
					async: true,
					params: {'order_id':order_id,'shipping_num':shipping_num},
					contentType: 'json'
				};
				kango.xhr.send(details, function(data) {
					if (data.status == 200 && data.response != null) {
						var result_obj = data.response;
						var status = result_obj.status;
						if(status==1){
							this_obj.parents('.'+PluginConf.css_refix+'shipping_num_main').hide();
						}else{
							alert(result_obj.message);
						}
					}else { // something went wrong
						
					}
				});
			}
		});
		//删除购物车商品
		$('#'+PluginConf.css_refix+'cart_table .'+PluginConf.css_refix+'cart_goods_delete').on('click',function(){
			if(confirm('确定要删除这个商品吗？')){
				var parent_tr = $(this).parents('tr');
				var order_id = parent_tr.attr('order_id');
				var details = {
					url: PluginConf.get_interface_file('transport_order_delete'),
					method: 'POST',
					async: true,
					params: {'order_id':order_id,},
					contentType: 'json'
				};
				kango.xhr.send(details, function(data) {
					if (data.status == 200 && data.response != null) {
						var result_obj = data.response;
						var status = result_obj.status;
						if(status==1){
							var cart_count = parseInt($('#'+PluginConf.css_refix+'cart_count').text());
							$('#'+PluginConf.css_refix+'cart_count').text(cart_count-1);
							_this.cart_page = 1;
							_this.refresh_cart_list();
						}else{
							alert(result_obj.message);
						}
					}else { // something went wrong
						
					}
				});
			}
		});
		//显示打包窗口
		$('#'+PluginConf.css_refix+'cart_package_button').click(function(){
			_this.refresh_package_list();
		});
		//可以打包的运单全选反选
		$('#'+PluginConf.css_refix+'package_check_all').click(function(){
			$('#'+PluginConf.css_refix+'package_main .'+PluginConf.css_refix+'package_cart_check').attr('checked',$(this).is(':checked'));
			_this.refresh_package_checked_num();
		});
		$('#'+PluginConf.css_refix+'package_main .'+PluginConf.css_refix+'package_cart_check').on('click',function(){
			_this.refresh_package_checked_num();
		});
		//确定打包
		$('#'+PluginConf.css_refix+'package_ok').click(function(){
			//获取选中的运单id
			var checked_id_obj = $('#'+PluginConf.css_refix+'package_main .'+PluginConf.css_refix+'package_cart_check:checked');
			if(checked_id_obj.length==0){
				$('#'+PluginConf.css_refix+'package_error').show().find('span').text('请选择需要打包的订单！');
			}else if(checked_id_obj.length==1){
				$('#'+PluginConf.css_refix+'package_error').show().find('span').text('至少需要两个订单才能打包！');
			}else{
				var order_id_list = '';
				checked_id_obj.each(function(){
					order_id_list += $(this).val()+',';
				});
				order_id_list = order_id_list.replace(/,$/,'');
				var details = {
					url: PluginConf.get_interface_file('order_package_submit'),
					method: 'POST',
					async: true,
					params: {'user_id':_this.user_id,'order_id_list':order_id_list},
					contentType: 'json'
				};
				kango.xhr.send(details, function(data) {
					if (data.status == 200 && data.response != null) {
						var result_obj = data.response;
						var status = result_obj.status;
						if(status==1){
							_this.refresh_cart_list();
						}else{
							$('#'+PluginConf.css_refix+'package_error').show().find('span').text(result_obj.message);
						}
					}else { // something went wrong
						
					}
				});
			}
		});
		//取消打包
		$('#'+PluginConf.css_refix+'package_cancle').click(function(){
			_this.show_cart_list();
		});
		//切换到添加评论页面
		$('#'+PluginConf.css_refix+'eval_button').click(function(){
			$('#'+PluginConf.css_refix+'eval_add_tab').show();
			$('#'+PluginConf.css_refix+'eval_info_tab').hide();
		});
		//切换到评论列表页面
		$('#'+PluginConf.css_refix+'eval_cancle_button').click(function(){
			_this.show_eval_list();
		});
		//提交评价
		$('#'+PluginConf.css_refix+'eval_submit_button').click(function(){
			if(_this.eval_submitting){
				return false;
			}else{
				_this.eval_submitting = true;
			}
			var eval_message = $('#'+PluginConf.css_refix+'eval_message');
			var eval_message_val = $.trim(eval_message.val());
			if(eval_message_val==''){
				$('#'+PluginConf.css_refix+'eval_submit_error').show().find('span').text('请填写评价内容！');
				eval_message.focus();
				_this.eval_submitting = false;
				return false;
			}
			var eval_level_input = $('#'+PluginConf.css_refix+'eval_add_tab .'+PluginConf.css_refix+'eval_level_input:checked');
			var eval_level_val = eval_level_input.val();
			var goods_url = _this.current_url;
			var goods_img = _this.get_img();
			
			var details = {
				url: PluginConf.get_interface_file('goods_eval_submit'),
				method: 'POST',
				async: true,
				params: {'user_id':_this.user_id,'goods_name':_this.get_name(),'goods_url':goods_url,'goods_img':goods_img,'eval_level':eval_level_val,'eval_message':eval_message_val},
				contentType: 'json'
			};
			kango.xhr.send(details, function(data) {
				if (data.status == 200 && data.response != null) {
					var result_obj = data.response;
					var status = result_obj.status;
					if(status==1){
						//刷新评论列表
						_this.refresh_eval_info();
					}else{
						$('#'+PluginConf.css_refix+'eval_submit_error').show().find('span').text('评价失败，请重试！');
					}
				}else { // something went wrong
					$('#'+PluginConf.css_refix+'eval_submit_error').show().find('span').text(result_obj.message);
				}
				_this.eval_submitting = false;
			});
		});
	}
	
	//记录用户浏览记录
	this.record_view_history = function(){
		var goods_name = _this.get_name();
		if(goods_name!=''){
			setTimeout(function(){
				var goods_img = _this.get_img();
				var goods_url = _this.current_url;
				var details = {
					url: PluginConf.get_interface_file('record_view_history'),
					method: 'POST',
					async: true,
					params: {'user_id':_this.user_id,'site_id':_this.site_id,'goods_url':goods_url,'goods_img':goods_img,'goods_name':goods_name,'goods_price':_this.goodsPrice},
					contentType: 'text'
				};
				kango.xhr.send(details, function(data) {
					if (data.status == 200 && data.response != null) {
						
					}else { // something went wrong
						
					}
				});
			},5000);
		}
	};
	
	//截取字符串
	this.sub_str = function(str,length){
		var str_length = str.length;
		if(str_length>length){
			return str.substr(0,length)+'..';
		}else{
			return str;
		}
	}
	
	//获取时间字符串中的日期
	this.get_date = function(time_str){
		var time_arr = time_str.split(' ');
		return time_arr[0];
	}
	
	//刷新汇率
	this.refresh_exchange_rate = function(){
		if(_this.source_lang=='jp'){
			$("#"+PluginConf.css_refix+"jpy_rate").text(parseFloat(1/_this.jpy_rate).toFixed(2));
			$("#"+PluginConf.css_refix+"jpy_show").show();
		}else{
			$("#"+PluginConf.css_refix+"exchange_rate").text(parseFloat(_this.exchange_rate).toFixed(2));
			$("#"+PluginConf.css_refix+"dollar_show").show();
		}
	}
	
	//获取商品价格
	this.get_price = function(){}
	
	//刷新商品价格
	this.refresh_price = function(){
		//if(!_this.price_loaded){
			var prodPrice = _this.get_price();
			var priceSign = "$";
			var current_rate =1;
			_this.goodsPrice = prodPrice;
			if(_this.country == "US")
			{
				current_rate =_this.exchange_rate;
				priceSign = "$";
				_this.goodsPriceCN = parseFloat(parseFloat(prodPrice).toFixed(2))*_this.exchange_rate;
			}
			else if(_this.country == "JP")
			{
				current_rate = _this.jpy_rate;
				priceSign = "￥";
				_this.goodsPriceCN = parseFloat(parseFloat(prodPrice).toFixed(2))*_this.jpy_rate;
			}
			else if(_this.country == "DE")
			{
				current_rate =_this.EUR_rate;
				priceSign ="EUR";
				_this.goodsPriceCN = parseFloat(parseFloat(prodPrice).toFixed(2))*_this.EUR_rate;
			}
			else if(_this.country == "CNY")
			{
				current_rate = 1;
				priceSign ="RMB";
				_this.goodsPriceCN = parseFloat(parseFloat(prodPrice).toFixed(2));
			}
			else{
				current_rate = 1;
				priceSign ="RMB";
				_this.goodsPriceCN = parseFloat(parseFloat(prodPrice).toFixed(2));
				console.log("use orign price ,not support country ="+_this.country);
			}
			//_this.price_loaded = true;
		//}

		var totle_price = (_this.goodsPriceCN*_this.prodQty).toFixed(2);
		$("#"+PluginConf.css_refix+"foreignPriceValue").text(priceSign+(parseFloat(_this.goodsPrice).toFixed(2)));
		$("#"+PluginConf.css_refix+"rmbPriceValue").text(parseFloat(_this.goodsPriceCN).toFixed(2));
		$("#"+PluginConf.css_refix+"goods_price").text(totle_price+" 元 ");
		$("#currencyValue").text(current_rate);
	}
	
	
	//获取商品重量
	this.get_weight = function(){}
	
	//刷新商品重量
	this.refresh_weight = function(){

		if(!_this.weight_loaded){
			var prodWeight = _this.get_weight();
			_this.prodWeight = parseFloat(parseFloat(prodWeight).toFixed(2));
			_this.weight_loaded = true;
		}
		var totle_weight = (_this.prodWeight*_this.prodQty).toFixed(2);
		if(_this.prodWeight<=0.01){
			$("#"+PluginConf.css_refix+"weight_value").hide();
			$("#"+PluginConf.css_refix+"weight_input").val(totle_weight).show().unbind('blur').blur(function(){
				_this.prodWeight = parseFloat(($(this).val()/_this.prodQty).toFixed(2));
				_this.refresh_content();
				_this.refresh_actual_tariff();
				_this.refresh_default_tariff();
			});
		}else{
			$("#"+PluginConf.css_refix+"weight_value").text(totle_weight).siblings('.'+PluginConf.css_refix+'plugin_list_tip').hide();
			$("#"+PluginConf.css_refix+"weight_input").val(totle_weight).hide();
		}
	}
	
	//刷新商品数量
	this.refresh_prodQty = function(){
		$("#"+PluginConf.css_refix+"prodQty").text(_this.prodQty);
	}
	
	//获取商品是否缺货
	this.out_of_stock = function(){
		return false;
	}
	this.append_login =function(){
		$(maskBackground).appendTo($("body"));
		$(loginWindow).appendTo($("body"));
		$(loginWindow).css("top: 203px; display: none;");
	}
	this.bind_login =function(){
		/*****更换验证码图片*****/
		$(".changeCaptcha").click(function changeCaptcha(){
		  var img = $(".captcha").find("img");
		  var imgSrc = img.attr("src");
		  if(imgSrc == PluginConf.source_url + "captcha"){
		    img.attr('src', PluginConf.source_url + "captcha1");
		  }else{
		    img.attr('src', PluginConf.source_url + "captcha");
		  }
		});
		/******登录处理*****/
		$("#login").click(function(){
		  var u = $("#lm_username").val();
		  var p = $("#lm_password").val();
		  if($(".plug_in_login_authorCode").css("display") != "none")
		    var a = $(".authcode").val();
		  else
		    var a = null;
		  var en_password;

		  if(u == ""){
		    $("#login_prompt").html("<font color=\"red\">请输入邮箱或电话！</font>");
		  }
		  else if(p == ""){
		    $("#login_prompt").html("<font color=\"red\">请输入密码！</font>");
		  }
		  else if(a == ""){
		    $("#login_prompt").html("<font color=\"red\">请输入验证码！</font>");
		  }
		  else{
		    var remember = document.getElementById("remember").checked;
		    var userInfo = new Object();
		    userInfo.username = u;
		    userInfo.password = p;
		    userInfo.remember = remember;
		    if(a!=null){
		      userInfo.authcode = a;
		    }
		    var loginUrl = PluginConf.source_url + "signup";
		    //alert(JSON.stringify(userInfo));
		    var details = {
			  url: loginUrl,
		      method: 'POST',
		      params: userInfo,
		      contentType:'json'
			};
			kango.xhr.send(details, function(msg) {
			if (msg.status == 200 && msg.response != null) {
		        var obj = msg.response.isLogin;
		        var ucsynlogin = msg.response.ucsynlogin;
		        if(ucsynlogin != null){
		          $("head").append(ucsynlogin);
		        }
		        if(obj==false){
		          var authcode = msg.response.authcode;
		          if(authcode==false){
		            $("#login_prompt").html("<font color=\"red\">登陆失败 用户名或密码错误！</font>");
		          }else{
		            $("#login_prompt").html("<font color=\"red\">多次输入有误，请填写验证码！</font>");
		            $(".plug_in_login_authorCodeChange").show();
		            $(".plug_in_login_authorCode").show();
		            $(".plug_in_login").css("height", "374px");
		            $(".sideBarLoginPage").css("height", "374px");
		          }
		        }else{
		        	if(IsPhoneNum(userInfo.username))
		        	{
		        		_this.user_mobile = userInfo.username;
		        	}
		        	else{
		        		_this.user_email = userInfo.username;
		        	}
		        	kango.storage.setItem('username', userInfo.username);
			      	$("#"+PluginConf.css_refix+"loginInfo").text("欢迎"+userInfo.username+"");
		        	 $(".sideBarLoginPage").hide(500);
		        	 $("#maskBackground").hide(500);
		        }
		      }
		      else{
		      	alert("something wrong not 200 or response is null");
		      	
		      }
		 	 });
			}
		});
		//关闭窗口
		$(".plug_in_loginClose").click(function (){
			 $(".sideBarLoginPage").hide(500);
		     $("#maskBackground").hide(500);
		});
	}
	
	//用户登录
	this.get_user_login = function(){
		alert("please login first");
		$("#maskBackground").show(500);
		$(".sideBarLoginPage").show(500);
		
		
	}
	//获取服务器端登录状态
	this.get_login_status = function(){
		var get_loginstatus_url = PluginConf.source_url +"plugin/getLoginStatus";
		var loginStatus =false;
		$.ajax({
			url: get_loginstatus_url,
			type: "GET",
			cache: false,
			async:false,
			dataType: "text",
			contentType:'application/json'
		}).done(function(msg) {
			var status = $.parseJSON(msg).login;

			if(status != null){
				loginStatus = status;
			}
			else {
				alert("服务器异常请稍后重试！");
				loginStatus =false;
			}

		}).fail(function(XMLHttpRequest, textStatus, errorThrown){
			alert(XMLHttpRequest.readyState + XMLHttpRequest.status + XMLHttpRequest.responseText);
		});
		return loginStatus;
	}


		      
	//商品添加关注 
	this.add_favorite = function(){
		var add_favorite_url = PluginConf.source_url +"globalFav/0"
		var favorite = new Object();
		favorite["title"] = _this.get_name();
		favorite.image = _this.get_img();
		favorite.price = ""+_this.get_price();
		favorite.webSource = window.location.host;
		favorite.url =_this.current_url;
		
		 $.ajax({
		      url: add_favorite_url,
		      type: "POST",
		      cache: false,
		      data: JSON.stringify(favorite),
		      dataType: "text",
		      contentType:'application/json'
		      }).done(function(msg) {
		      	var result = JSON.parse(msg);
		      	if(result.isSaved == true)
		      	{
		      		alert("添加成功");
		      	}
		      	else{
		      		alert("添加失败");
		      	}
		      }).fail(function(XMLHttpRequest, textStatus, errorThrown){  
		      	alert(XMLHttpRequest.readyState + XMLHttpRequest.status + XMLHttpRequest.responseText);
		      });
	}

		
		
		
		
	

	
	//获取商品关注状态
	this.get_favorite_state = function(){
		var details = {
			url: PluginConf.get_interface_file('get_favorite_state',{'user_id':_this.user_id,'goods_url':_this.current_url}),
			method: 'GET',
			async: true,
			contentType: 'json'
		};
		kango.xhr.send(details, function(data) {
			if (data.status == 200 && data.response != null) {
				var result_obj = data.response;
				var status = result_obj.status;
				if(status==1){
					var state = result_obj.attach.state;
					if(state==1){
						_this.favorite_added = true;
						$('#'+PluginConf.css_refix+'add_fav').addClass(PluginConf.css_refix+'added_fav').html('<i></i>已关注');
					}else{
						//显示缺货提醒
						_this.show_stock_state();
						//绑定添加关注事件
						$('#'+PluginConf.css_refix+'add_fav').click(function(){
							var fav_a = $(this);
							var goods_name = _this.get_name();
							var goods_img = _this.get_img();
							var goods_url = _this.current_url;
							var stock_tip_obj = $('#'+PluginConf.css_refix+'stock_tip_label:visible #'+PluginConf.css_refix+'stock_tip');
							if(stock_tip_obj.length>0 && stock_tip_obj.is(":checked")){
								var stock_tip = 1;
							}else{
								var stock_tip = 0;
							}
							var details = {
								url: PluginConf.get_interface_file('add_favorite_goods'),
								method: 'POST',
								async: true,
								params: {'user_id':_this.user_id,'site_id':_this.site_id,'goods_url':goods_url,'goods_img':goods_img,'goods_name':goods_name,'goods_price':_this.goodsPrice,'stock_tip':stock_tip},
								contentType: 'json'
							};
							kango.xhr.send(details, function(data) {
								if (data.status == 200 && data.response != null) {
									var result_obj = data.response;
									var status = result_obj.status;
									if(status==1){
										fav_a.addClass(PluginConf.css_refix+'added_fav').html('<i></i>已关注').unbind('click');
										$('#'+PluginConf.css_refix+'stock_tip_label').hide();
									}else{
										alert(result_obj.message);
									}
								}else { // something went wrong
									
								}
							});
						});
					}
				}else{
					alert(result_obj.message);
				}
			}else { // something went wrong
				
			}
		});
	}
	
	//显示缺货状态
	this.show_stock_state = function(){
		if(_this.favorite_added){
			$('#'+PluginConf.css_refix+'stock_tip_label').hide();
		}else{
			if(_this.out_of_stock()){
				$('#'+PluginConf.css_refix+'stock_tip_label').show();
			}else{
				$('#'+PluginConf.css_refix+'stock_tip_label').hide();
			}
		}
	}
	
	//加载产品分类
	this.load_product_cat = function(){
		var cat_obj = productCat(PluginConf.css_refix+'product_cat');
		cat_obj.change(function(){
			var last_select = $(this).find('select:last');
			if(last_select.val()==-1){
				_this.tax_type = 0;
				_this.dutiable_value = 0;
				_this.tax_rate = 0;
			}else{
				var selected_option = last_select.find('option:selected');
				_this.tax_type = parseInt(selected_option.attr('tax_type'));
				_this.dutiable_value = Math.round(selected_option.attr('dutiable_value'));
				_this.tax_rate = parseInt(selected_option.attr('tax_rate'));
			}
			_this.refresh_tax_rate();
			_this.refresh_actual_tariff();
			_this.refresh_default_tariff();
			_this.refresh_totle_price();
		});
	}
	
	//加载转运渠道
	this.load_transport_way = function(){
		var details = {
			url: PluginConf.get_interface_file('get_transport_way'),
			method: 'GET',
			async: true,
			contentType: 'text'
		};
		kango.xhr.send(details, function(data) {
			if (data.status == 200 && data.response != null) {
				var result_obj = JSON.parse(data.response);//eval('('+data.response+')');
				var status = result_obj.status;
				if(status==1){
					var transport_way = result_obj.attach;
					if(typeof(transport_way[0])!='undefined'){
						var first_way_arr = transport_way[0];
						var transport_select1 = '<select id="'+PluginConf.css_refix+'transport_way1">';
						for(var i=0;i<first_way_arr.length;i++){
							transport_select1 += '<option value="'+first_way_arr[i].way_id+'">'+first_way_arr[i].way_name+'</option>';
						}
						transport_select1 += '</select>';
						$('#'+PluginConf.css_refix+'transport_info').append(transport_select1);
						$('#'+PluginConf.css_refix+'transport_way1').change(function(){
							$('#'+PluginConf.css_refix+'transport_way2').remove();
							var second_way_id = $(this).val();
							if(typeof(transport_way[second_way_id])!='undefined'){
								var second_way_arr = transport_way[second_way_id];
								var transport_select2 = '<select id="'+PluginConf.css_refix+'transport_way2">';
								for(var j=0;j<second_way_arr.length;j++){
									transport_select2 += '<option value="'+second_way_arr[j].way_id+'">'+second_way_arr[j].way_name+'</option>';
								}
								transport_select2 += '</select>';
								$(this).after(transport_select2);
							}
						}).change();
					}
				}else{
					alert(result_obj.message);
				}
			}else { // something went wrong
				
			}
		});
	}
	
	//刷新直邮中国标记
	this.refresh_china_tag = function(){
		if(_this.direct_mail_china){
			$('#'+PluginConf.css_refix+'direct_mail_china').show();
		}
	}
	
	//刷新用户运单
	this.refresh_cart_list = function(){
		_this.show_cart_list();
		var details = {
			url: PluginConf.get_interface_file('get_transport_order',{'user_id':_this.user_id,'page':_this.cart_page}),
			method: 'GET',
			async: true,
			contentType: 'json'
		};
		kango.xhr.send(details, function(data) {
			if (data.status == 200 && data.response != null) {
				var result_obj = data.response;
				var status = result_obj.status;
				if(status==1){
					var message = result_obj.message;
					var attach = result_obj.attach;
					var order_list = attach.order_list;
					var cart_length = order_list.length;
					if(cart_length>0){
						var cart_html = '';
						for(var i=0;i<cart_length;i++){
							var cart_list = order_list[i];
							var status_id = cart_list.status_id;
							if(status_id==1){
								var opera_html = '<div class="'+PluginConf.css_refix+'shipping_num_div">'+
													'<span class="'+PluginConf.css_refix+'add_shipping_num">运单号<i></i></span>'+
													'<div class="'+PluginConf.css_refix+'shipping_num_main">'+
														'<div class="'+PluginConf.css_refix+'shipping_num_content">'+
															'<i class="'+PluginConf.css_refix+'top_border_ico"></i>'+
															'<div class="'+PluginConf.css_refix+'shipping_num_tip">请输入该笔订单的运单号，以便海淘插件跟踪订单的物流信息！</div>'+
															'<div class="'+PluginConf.css_refix+'shipping_num_text"><input type="text" class="'+PluginConf.css_refix+'plugin_text" value="'+cart_list.shipping_num+'"></div>'+
															'<div class="'+PluginConf.css_refix+'shipping_num_submit"><a>提交</a></div>'+
														'</div>'+
													'</div>'+
												'</div>'+
												'<p><a class="'+PluginConf.css_refix+'cart_goods_delete">删除订单</a></p>';
							}else if(status_id==2){
								var opera_html = '<p><a class="'+PluginConf.css_refix+'order_pay" href="'+PluginConf.source_url+'action.php?act=alipay_request&order_id='+cart_list['order_id']+'" target="_blank">去付款</a></p>';
							}else if(status_id==3){
								var opera_html = '<p><a>申请退款</a></p>';
							}else{
								var opera_html = '';
							}
							var pre_package_id = i==0?'':order_list[i-1].package_id;
							var current_package_id = cart_list.package_id;
							var next_package_id = typeof(order_list[i+1])=='undefined'?'':order_list[i+1].package_id;
							if(pre_package_id!=current_package_id && current_package_id!=''){
								cart_html += '<tbody class="'+PluginConf.css_refix+'package_tbody"><tr><td colspan="6" class="'+PluginConf.css_refix+'package_td">合包单号：'+current_package_id+'</td></tr>';
							}
							cart_html += '<tr class="'+PluginConf.css_refix+'cart_list" order_id="'+cart_list['order_id']+'">'+
											'<td align="center"><a href="'+cart_list['goods_url']+'" target="_blank" class="'+PluginConf.css_refix+'cart_goods_img"><img src="'+cart_list['goods_img']+'"/></a></td>'+
											'<td align="center"><a class="'+PluginConf.css_refix+'cart_goods_name" href="'+cart_list['goods_url']+'" target="_blank" title="'+cart_list['goods_name']+'">'+_this.sub_str(cart_list['goods_name'],30)+'</a></td>'+
											'<td align="center"><span class="'+PluginConf.css_refix+'cart_goods_num">'+cart_list['goods_num']+'</span></td>'+
											'<td align="center"><span class="'+PluginConf.css_refix+'cart_goods_time" title="'+cart_list['add_time']+'">'+_this.get_date(cart_list['add_time'])+'</span></td>'+
											'<td align="center"><span class="'+PluginConf.css_refix+'cart_goods_state">'+cart_list['status_name']+'</span></td>'+
											'<td align="center">'+opera_html+'</td>'+
										'</tr>';
							if(next_package_id!=current_package_id && current_package_id!=''){
								cart_html += '</tbody>';
							}
						}
						$("#"+PluginConf.css_refix+"cart_count").text(attach.record_count);
						$('#'+PluginConf.css_refix+'cart_table .'+PluginConf.css_refix+'package_tbody').remove();
						$('#'+PluginConf.css_refix+'cart_table .'+PluginConf.css_refix+'cart_list').remove();
						$('#'+PluginConf.css_refix+'cart_table').append(cart_html).find('.'+PluginConf.css_refix+'shipping_num_div').hover(function(){
							$(this).find('.'+PluginConf.css_refix+'shipping_num_main').show();
						},function(){
							$(this).find('.'+PluginConf.css_refix+'shipping_num_main').hide();
						});
						//加载分页html
						var page_html = attach.page_html;
						page_html = page_html.replace(/(id|class)="([^"]+)"/g,"$1"+'="'+PluginConf.css_refix+"$2"+'"');
						var page_obj = $(page_html);
						page_obj.find('a').click(function(){
							_this.cart_page = $(this).attr('page');
							_this.refresh_cart_list();
							return false;
						});
						$('#'+PluginConf.css_refix+'cart_page').empty().append(page_obj);
						$('#'+PluginConf.css_refix+'no_cart_info').hide();
						$('#'+PluginConf.css_refix+'cart_main').show();
					}else{
						$('#'+PluginConf.css_refix+'no_cart_info').show();
						$('#'+PluginConf.css_refix+'cart_main').hide();
					}
				}else{
					alert(result_obj.message);
				}
			}else { // something went wrong
				
			}
		});
	}
	
	//刷新可以打包的运单
	this.refresh_package_list = function(){
		var details = {
			url: PluginConf.get_interface_file('get_packageable_order',{'user_id':_this.user_id}),
			method: 'GET',
			async: true,
			contentType: 'json'
		};
		kango.xhr.send(details, function(data) {
			if (data.status == 200 && data.response != null) {
				var result_obj = data.response;
				var status = result_obj.status;
				if(status==1){
					var message = result_obj.message;
					var attach = result_obj.attach;
					var order_list = attach.order_list;
					var cart_length = order_list.length;
					if(cart_length>0){
						var cart_html = '';
						for(var i=0;i<cart_length;i++){
							var cart_list = order_list[i];
							cart_html += '<tr class="'+PluginConf.css_refix+'cart_list" order_id="'+cart_list['order_id']+'">'+
											'<td style="text-align:left;"><input type="checkbox" class="'+PluginConf.css_refix+'package_cart_check" name="'+PluginConf.css_refix+'package_cart_check" value="'+cart_list['order_id']+'"/></td>'+
											'<td align="center"><a href="'+cart_list['goods_url']+'" target="_blank" class="'+PluginConf.css_refix+'cart_goods_img"><img src="'+cart_list['goods_img']+'"/></a></td>'+
											'<td align="center"><a class="'+PluginConf.css_refix+'cart_goods_name" href="'+cart_list['goods_url']+'" target="_blank" title="'+cart_list['goods_name']+'">'+_this.sub_str(cart_list['goods_name'],30)+'</a></td>'+
											'<td align="center"><span class="'+PluginConf.css_refix+'cart_goods_num">'+cart_list['goods_num']+'</span></td>'+
											'<td align="center"><span class="'+PluginConf.css_refix+'cart_goods_time" title="'+cart_list['add_time']+'">'+_this.get_date(cart_list['add_time'])+'</span></td>'+
											'<td align="center"><span class="'+PluginConf.css_refix+'cart_goods_state">'+cart_list['status_name']+'</span></td>'+
										'</tr>';
						}
						$('#'+PluginConf.css_refix+'package_table .'+PluginConf.css_refix+'cart_list').remove();
						$('#'+PluginConf.css_refix+'package_check_all').attr('checked',false);
						$('#'+PluginConf.css_refix+'package_checked_num').text(0);
						$('#'+PluginConf.css_refix+'package_error').hide();
						$(cart_html).insertBefore($("#"+PluginConf.css_refix+"package_check"));
						$('#'+PluginConf.css_refix+'no_package_info').hide();
						$('#'+PluginConf.css_refix+'package_main').show();
					}else{
						$('#'+PluginConf.css_refix+'no_package_info').show();
						$('#'+PluginConf.css_refix+'package_main').hide();
					}
				}else{
					alert(result_obj.message);
				}
			}else { // something went wrong
				
			}
			$('#'+PluginConf.css_refix+'cart_list_tab').hide();
			$('#'+PluginConf.css_refix+'cart_package_tab').show();
		});
	}
	
	//刷新已选择的运单数量
	this.refresh_package_checked_num = function(){
		var checked_num = $('#'+PluginConf.css_refix+'package_main .'+PluginConf.css_refix+'package_cart_check:checked').length;
		$('#'+PluginConf.css_refix+'package_checked_num').text(checked_num);
	}
	
	//显示运单列表
	this.show_cart_list = function(){
		$('#'+PluginConf.css_refix+'cart_list_tab').show();
		$('#'+PluginConf.css_refix+'cart_package_tab').hide();
	}
	
	//获取商品评价数量
	this.load_eval_count = function(){
		var goods_url = _this.current_url;
		var details = {
			url: PluginConf.get_interface_file('get_goods_eval_count',{'goods_url':goods_url}),
			method: 'GET',
			async: true,
			contentType: 'json'
		};
		kango.xhr.send(details, function(data) {
			if (data.status == 200 && data.response != null) {
				var result_obj = data.response;
				var status = result_obj.status;
				if(status==1){
					var eval_count = result_obj.attach.eval_count;
					$("#"+PluginConf.css_refix+"eval_count").text(eval_count);
				}
			}
		});
	}
	
	//刷新商品评论信息
	this.refresh_eval_info = function(){
		_this.show_eval_list();
		var goods_url = _this.current_url;
		var details = {
			url: PluginConf.get_interface_file('get_goods_eval_level',{'goods_url':goods_url}),
			method: 'GET',
			async: true,
			contentType: 'text'
		};
		kango.xhr.send(details, function(data) {
			if (data.status == 200 && data.response != null) {
				var result_obj = JSON.parse(data.response);//eval('('+data.response+')');
				var status = result_obj.status;
				if(status==1){
					var attach = result_obj.attach;
					var good_level = parseInt(attach.good_level);
					var normal_level = parseInt(attach.normal_level);
					var bad_level = parseInt(attach.bad_level);
					var totle_level = good_level+normal_level+bad_level;
					//初始化评价统计
					$('#'+PluginConf.css_refix+'good_eval_bar').stop().width(0);
					$('#'+PluginConf.css_refix+'normal_eval_bar').stop().width(0);
					$('#'+PluginConf.css_refix+'bad_eval_bar').stop().width(0);
					$('#'+PluginConf.css_refix+'good_eval_percent').text(0);
					$('#'+PluginConf.css_refix+'normal_eval_percent').text(0);
					$('#'+PluginConf.css_refix+'bad_eval_percent').text(0);
					if(totle_level>0){
						var good_percent = good_level/totle_level;
						var normal_percent = normal_level/totle_level;
						var bad_percent = bad_level/totle_level;
						var totle_bar_width = $('#'+PluginConf.css_refix+'eval_info_tab .'+PluginConf.css_refix+'eval_percent_bar').width();
						var good_bar_width = Math.round(totle_bar_width*good_percent);
						var normal_bar_width = Math.round(totle_bar_width*normal_percent);
						var bad_bar_width = Math.round(totle_bar_width*bad_percent);
						$('#'+PluginConf.css_refix+'good_eval_bar').animate({'width':good_bar_width},1000);
						$('#'+PluginConf.css_refix+'normal_eval_bar').animate({'width':normal_bar_width},1000);
						$('#'+PluginConf.css_refix+'bad_eval_bar').animate({'width':bad_bar_width},1000);
						var good_eval_percent = Math.round(good_percent*100);
						var normal_eval_percent = Math.round(normal_percent*100);
						var bad_eval_percent = 100-good_eval_percent-normal_eval_percent;
						$('#'+PluginConf.css_refix+'good_eval_value').text(good_eval_percent);
						$('#'+PluginConf.css_refix+'good_eval_percent').text(good_eval_percent);
						$('#'+PluginConf.css_refix+'normal_eval_percent').text(normal_eval_percent);
						$('#'+PluginConf.css_refix+'bad_eval_percent').text(bad_eval_percent);
					}
				}
			}else { // something went wrong
				
			}
		});
		_this.refresh_eval_list();
	}
	
	//显示商品评论列表
	this.show_eval_list = function(){
		$('#'+PluginConf.css_refix+'eval_submit_error').hide();
		$('#'+PluginConf.css_refix+'eval_info_tab').show();
		$('#'+PluginConf.css_refix+'eval_add_tab').hide();
	}
	
	//刷新商品评论列表
	this.refresh_eval_list = function(){
		var goods_url = _this.current_url;
		var details = {
			url: PluginConf.get_interface_file('get_goods_eval_list',{'goods_url':goods_url,'page':_this.eval_page}),
			method: 'GET',
			async: true,
			contentType: 'text'
		};
		kango.xhr.send(details, function(data) {
			if (data.status == 200 && data.response != null) {
				var result_obj = JSON.parse(data.response);//eval('('+data.response+')');
				var status = result_obj.status;
				if(status==1){
					var message = result_obj.message;
					var attach = result_obj.attach;
					var eval_arr = attach.eval_arr;
					var eval_length = eval_arr.length;
					if(eval_length>0){
						var eval_html = '';
						for(var i=0;i<eval_length;i++){
							var eval_list = eval_arr[i];
							eval_html += '<div class="'+PluginConf.css_refix+'eval_list">'+
											'<div class="'+PluginConf.css_refix+'eval_user_main">'+
												'<p>用户'+eval_list.user_id+'</p>'+
											'</div>'+
											'<div class="'+PluginConf.css_refix+'eval_content_main">'+
												'<p class="'+PluginConf.css_refix+'eval_content">'+eval_list.eval_message+'</p>'+
												'<p class="'+PluginConf.css_refix+'eval_time">'+eval_list.add_time+'</p>'+
											'</div>'+
										'</div>';
						}
						$("#"+PluginConf.css_refix+"eval_count").text(attach.record_count);
						$('#'+PluginConf.css_refix+'no_eval_info').hide();
						$('#'+PluginConf.css_refix+'eval_list_main').empty().append(eval_html).show();
						//加载分页html
						/*
						var page_html = attach.page_html;
						page_html = page_html.replace(/(id|class)="([^"]+)"/g,"$1"+'="'+PluginConf.css_refix+"$2"+'"');
						var page_obj = $(page_html);
						page_obj.find('a').click(function(){
							_this.cart_page = $(this).attr('page');
							_this.refresh_cart_list();
							return false;
						});
						$('#'+PluginConf.css_refix+'cart_page').empty().append(page_obj);
						*/
					}else{
						$('#'+PluginConf.css_refix+'no_eval_info').show();
						$('#'+PluginConf.css_refix+'eval_list_main').empty().hide();
					}
				}else{
					alert(result_obj.message);
				}
			}else { // something went wrong
				
			}
		});
	}
	
	//刷新税率
	this.refresh_tax_rate = function(){
		if(_this.tax_rate==0){
			$('#'+PluginConf.css_refix+'tax_rate').text('--');
		}else{
			$('#'+PluginConf.css_refix+'tax_rate').text(_this.tax_rate+'%');
		}
	}
	
	//刷新关税（实报）
	this.refresh_actual_tariff = function(){
		if(_this.tax_rate==0){
			_this.actual_tariff = 0;
			$('#'+PluginConf.css_refix+'actual_tariff').text('--');
		}else{
			_this.actual_tariff = parseFloat((_this.tax_rate*0.01*_this.goodsPrice).toFixed(2));
			var totle_actual_tariff = (_this.actual_tariff*_this.prodQty).toFixed(2);
			$('#'+PluginConf.css_refix+'actual_tariff').text('￥'+totle_actual_tariff);
		}
	}
	
	//刷新关税（默认）
	this.refresh_default_tariff = function(){
		if(_this.tax_rate==0||_this.dutiable_value==0){
			_this.default_tariff = 0;
			$('#'+PluginConf.css_refix+'dutiable_value').text('--');
			$('#'+PluginConf.css_refix+'default_tariff').text('--');
		}else{
			if(_this.tax_type==1 || _this.tax_type==3){
				_this.default_tariff = parseFloat((_this.tax_rate*0.01*_this.dutiable_value).toFixed(2));
			}else{
				var kgWeight = Math.ceil(_this.prodWeight*PluginConf.lb_rate*100)/100;
				_this.default_tariff = parseFloat((kgWeight*_this.tax_rate*0.01*_this.dutiable_value).toFixed(2));
			}
			var totle_default_tariff = (_this.default_tariff*_this.prodQty).toFixed(2);
			$('#'+PluginConf.css_refix+'dutiable_value').text(_this.dutiable_value);
			$('#'+PluginConf.css_refix+'default_tariff').text('￥'+totle_default_tariff);
		}
	}
	
	//刷新运费
	this.refresh_fee = function(){
		var kgWeight = Math.ceil(_this.prodWeight*PluginConf.lb_rate*100)/100;
		var fee1 = Math.ceil(_this.prodWeight*PluginConf.firstFee1);
		var fee2 = PluginConf.secondFee1 + (kgWeight>1?Math.ceil(kgWeight-1)*PluginConf.secondFee2:0);
		_this.totleFee = fee1 + fee2;
		var totle_fee1 = fee1*_this.prodQty;
		var totle_fee2 = fee2*_this.prodQty;
		var totle_fee = _this.totleFee*_this.prodQty;
		$('#'+PluginConf.css_refix+'fee1').text("$"+totle_fee1);
		$('#'+PluginConf.css_refix+'fee2').text("$"+totle_fee2);
		$('#'+PluginConf.css_refix+'fee2_CN').text((totle_fee2*_this.exchange_rate)+"元");
		$('#'+PluginConf.css_refix+'fee_totle').text("$"+totle_fee);
	}
	
	//刷新总价
	this.refresh_totle_price = function(){
		if(_this.goodsPrice==0||_this.tax_rate==0){
			_this.totlePrice = 0;
			$('#'+PluginConf.css_refix+'totle_price').text('--');
		}else{
			var tax_state = $('#'+PluginConf.css_refix+'tax_switch').attr('state');
			if(tax_state=='on'){
				var tax_type_input = $('#'+PluginConf.css_refix+'tax_type input:checked');
				if(tax_type_input.val()=='actual'){
					_this.tax_price = _this.actual_tariff;
				}else{
					_this.tax_price = _this.default_tariff;
				}
				if(_this.tax_price==0){
					_this.totlePrice = 0;
					$('#'+PluginConf.css_refix+'totle_price').text('--');
				}else{
					_this.totlePrice = parseFloat((_this.goodsPrice + _this.tax_price + _this.totleFee)*_this.prodQty).toFixed(2);
					$('#'+PluginConf.css_refix+'totle_price').text('¥'+_this.totlePrice);
				}
			}else{
				_this.totlePrice = parseFloat((_this.goodsPrice + _this.totleFee)*_this.prodQty).toFixed(2);
				$('#'+PluginConf.css_refix+'totle_price').text('¥'+_this.totlePrice);
			}
		}
	}


	this.append_feature_others= function (){
		var features = _this.get_features();
		_this.proSize = features.sizes;
		_this.proColor = features.colors;
		_this.proFlavor = features.flavors;
		_this.proStyle = features.styles;
		_this.proWidth = features.widths;
		_this.proWaist = features.waists;
		_this.proInseam = features.inseams;
		var ProSize =' <div id="'+PluginConf.css_refix+'proSize"><strong class="'+PluginConf.css_refix+'strong">商品尺寸 : </strong> <span class="'+PluginConf.css_refix+'warn" >'+$.trim(_this.proSize)+'</span></div> ';
		var ProColor =' <div id="'+PluginConf.css_refix+'proColor"><strong class="'+PluginConf.css_refix+'strong">商品颜色 : </strong> <span class="'+PluginConf.css_refix+'warn" >'+$.trim(_this.proColor)+'</span></div> ';
		var ProFlavor =' <div id="'+PluginConf.css_refix+'proFlavor"><strong class="'+PluginConf.css_refix+'strong">商品口味 : </strong><span class="'+PluginConf.css_refix+'warn" >'+$.trim(_this.proFlavor)+'</span> </div> ';
		var ProStyle =' <div id="'+PluginConf.css_refix+'proStyle"><strong class="'+PluginConf.css_refix+'strong">商品风格 : </strong><span class="'+PluginConf.css_refix+'warn" >'+$.trim(_this.proStyle)+'</span> </div> ';
		var ProWidth =' <div id="'+PluginConf.css_refix+'proWidth"><strong class="'+PluginConf.css_refix+'strong">商品宽度 : </strong><span class="'+PluginConf.css_refix+'warn" >'+$.trim(_this.proWidth)+'</span> </div> ';
		var ProWaist =' <div id="'+PluginConf.css_refix+'proWaist"><strong class="'+PluginConf.css_refix+'strong">商品长度 : </strong><span class="'+PluginConf.css_refix+'warn" >'+$.trim(_this.proWaist)+'</span> </div> ';
		var ProInseam =' <div id="'+PluginConf.css_refix+'proInseam"><strong class="'+PluginConf.css_refix+'strong">商品长度 : </strong><span class="'+PluginConf.css_refix+'warn" >'+$.trim(_this.proInseam)+'</span> </div> ';
		if(_this.proSize != null)
		{
			$(ProSize).prependTo($("#"+PluginConf.css_refix+"featureSelect_all"));
		}
		if(_this.proColor != null)
		{
			$(ProColor).prependTo($("#"+PluginConf.css_refix+"featureSelect_all"));
		}
		if(_this.proFlavor != null)
		{
			$(ProFlavor).prependTo($("#"+PluginConf.css_refix+"featureSelect_all"));
		}
		if(_this.proStyle != null)
		{
			$(ProStyle).prependTo($("#"+PluginConf.css_refix+"featureSelect_all"));
		}
		if(_this.proWidth != null)
		{
			$(ProWidth).prependTo($("#"+PluginConf.css_refix+"featureSelect_all"));
		}
		if(_this.proWaist != null)
		{
			$(ProWaist).prependTo($("#"+PluginConf.css_refix+"featureSelect_all"));
		}
		if(_this.proInseam != null)
		{
			$(ProInseam).prependTo($("#"+PluginConf.css_refix+"featureSelect_all"));
		}
		var outerHeight = $("#"+PluginConf.css_refix+"featureSelect_all").height();
		var innerHeight =$($("#"+PluginConf.css_refix+"featureSelect_all").children()[0]).height();
		var child_num = $("#"+PluginConf.css_refix+"featureSelect_all").children().length;
		var result = ((outerHeight-(child_num*innerHeight))*0.45);
		$("#"+PluginConf.css_refix+"featureSelect_all").css("padding-top" ,result+"px");
		_this.feature_loaded = true;
	}
	
	this.refresh_feature_others =function (){
		if(!_this.feature_loaded)
		{
			this.append_feature_others();
		}
		else{
			$('#'+PluginConf.css_refix+'proSize').remove();
			$('#'+PluginConf.css_refix+'proColor').remove();
			$('#'+PluginConf.css_refix+'proFlavor').remove();
			$('#'+PluginConf.css_refix+'proStyle').remove();
			$('#'+PluginConf.css_refix+'proWidth').remove();
			$('#'+PluginConf.css_refix+'proWaist').remove();
		   	$('#'+PluginConf.css_refix+'proInseam').remove();
		    this.append_feature_others();	
		}
				
	}
	//加入帮我买购物车；
		this.addToHelpMeBuyCart = function () {


				var sendData = new Object();
			    sendData.url =_this.current_url;
			    sendData.title = $.trim(_this.get_name());
			    sendData.image = _this.get_img();
			    sendData.price = ""+_this.goodsPrice;
			    sendData.webSource = window.location.host;//remain
			    //alert(window.location.host);
			    sendData.prodQuantity =""+_this.prodQty;
			    sendData.prodColor = $.trim(_this.proColor);
			    sendData.prodSize = $.trim(_this.proSize);
			    sendData.prodWidth = $.trim(_this.proWidth);
			    sendData.prodInseam = $.trim(_this.proInseam);
			    sendData.prodWaist =$.trim(_this.prodWaist);
			    sendData.ifUpdatePrice = "";//remian
			    sendData.prodFlavor = $.trim(_this.proFlavor);
			    sendData.promoCode = "";//remian
			    sendData.prodWeight = ""+_this.get_weight();
			    sendData.prodWeightType =  $.trim(_this.get_category());//category
			    sendData.prodWebWeight = ""+_this.get_weight();   
			    console.log(sendData);
			    var resp ;
			    $.ajax({
			      url: PluginConf.source_url + "addToHelpMeBuyCart",    
			      type: "POST",
			      cache: false,
			      data: JSON.stringify(sendData),
			      dataType:'text',
			      contentType:'application/json'
			    }).done(function(msg) {
			      var obj = $.parseJSON(msg);
			      if(obj.isAdded == false)
			      {
			      	alert("添加失败，稍后重试");
			      }
			      else{
			      	alert("add success!");
			      }
			    }).fail(function(jqXHR, textStatus) {
			      alert(textStatus+jqXHR);
			    });

		  	
		}
		 
			
		 
		   /* var details1 = {
			  url: PluginConf.source_url + "addToHelpMeBuyCart", 
		      method: 'POST',
		      params: sendData,
		      contentType:'json'
			};
			kango.xhr.send(details1, function(data) {
				alert(data.response);
				if (data.status == 200 && data.response != null) {
					alert(data.response.isAdded);
				}
				else{
					alert("wrong ");
				}
			});
				
		}*/

	//判断是否是数字
		function IsPhoneNum(s)
		{
		    if(s!=null){
		        var r,re;
		        re = /\d*/i; //\d表示数字,*表示匹配多个数字
		        r = s.match(re);
		        return (r==s)?true:false;
		    }
		    return false;
		}

	
}