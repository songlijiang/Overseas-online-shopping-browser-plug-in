/*
系统通用配置项目
*/
var PluginConf = {
	'lb_rate':0.4536,//磅与千克单位换算
	'firstFee1':8,//计算物流费用的相关参数
	'firstFee2':4,
	'secondFee1':10,
	'secondFee2':3,
	'source_url':'http://localhost/haitao100/',//资源文件和后台文件主目录,
	//'source_url':'http://www.haitao100.cn/',//资源文件和后台文件主目录,
	'css_refix':'hongfeng_',//css命名前缀
};
PluginConf.css_file = PluginConf.source_url+'css/plugin_content.css';//前台页面css文件
PluginConf.img_path = PluginConf.source_url+'images/plugin/';//图片文件主目录
PluginConf.get_interface_file = function(act,params_obj){//获取接口文件通用方法
	var interface_file = PluginConf.source_url+'interface.php';
	var param_str = '';
	if(typeof(params_obj)!='undefined'){
		for(var key in params_obj){
			if(params_obj.hasOwnProperty(key)){
				param_str += '&'+key+'='+params_obj[key];
			}
		}
	}
	return interface_file+'?act='+act+param_str;
};

//运单列表
var Plugin_cart = '<div id="'+PluginConf.css_refix+'cart_content" class="'+PluginConf.css_refix+'tab_content">'+
						'<div id="'+PluginConf.css_refix+'cart_list_tab">'+
							'<div id="'+PluginConf.css_refix+'no_cart_info">购物车中没有商品！</div>'+
							'<div id="'+PluginConf.css_refix+'cart_main">'+
								'<table id="'+PluginConf.css_refix+'cart_table">'+
									'<tr>'+
										'<th width="15%">预览图片</th>'+
										'<th width="32%">商品名称</th>'+
										'<th width="10%">数量</th>'+
										'<th width="14%">下单时间</th>'+
										'<th width="15%">状态</th>'+
										'<th width="14%">操作</th>'+
									'</tr>'+
								'</table>'+
								'<div class="'+PluginConf.css_refix+'cart_button">'+
									'<a id="'+PluginConf.css_refix+'cart_package_button" class="'+PluginConf.css_refix+'common_button">打包运单</a>'+
									'<div id="'+PluginConf.css_refix+'cart_page"></div>'+
								'</div>'+
							'</div>'+
						'</div>'+
						'<div id="'+PluginConf.css_refix+'cart_package_tab">'+
							'<div id="'+PluginConf.css_refix+'no_package_info">没有可以打包的运单！</div>'+
							'<div id="'+PluginConf.css_refix+'package_main">'+
								'<div class="'+PluginConf.css_refix+'waring_tip">'+
									'<i></i><span>运单合包之后不能撤销，请谨慎操作！</span>'+
								'</div>'+
								'<table id="'+PluginConf.css_refix+'package_table">'+
									'<tr>'+
										'<th width="7%">&nbsp;</th>'+
										'<th width="18%">预览图片</th>'+
										'<th width="35%">商品名称</th>'+
										'<th width="10%">数量</th>'+
										'<th width="15%">下单时间</th>'+
										'<th width="15%">状态</th>'+
									'</tr>'+
									'<tr id="'+PluginConf.css_refix+'package_check">'+
										'<td style="text-align:left;" colspan="2"><label><input type="checkbox" id="'+PluginConf.css_refix+'package_check_all"/><span class="'+PluginConf.css_refix+'check_all_tip">全选</span></label></td>'+
										'<td colspan="5"><span id="'+PluginConf.css_refix+'checked_tip">已选择<font id="'+PluginConf.css_refix+'package_checked_num">0</font>件</span></td>'+
									'</tr>'+
								'</table>'+
								'<div class="'+PluginConf.css_refix+'package_bottom">'+
									'<a id="'+PluginConf.css_refix+'package_ok" class="'+PluginConf.css_refix+'common_button">确定打包</a>'+
									'<a id="'+PluginConf.css_refix+'package_cancle" class="'+PluginConf.css_refix+'common_button">取消</a>'+
								'</div>'+
								'<div id="'+PluginConf.css_refix+'package_error" class="'+PluginConf.css_refix+'error_tip">'+
									'<i></i><span></span>'+
								'</div>'+
							'</div>'+
						'</div>'+
					'</div>';

//插件html
var PluginDiv = '<div id="'+PluginConf.css_refix+'plugin_main">'+
					'<div id="'+PluginConf.css_refix+'top_bar">'+
						'<a id="'+PluginConf.css_refix+'logo"><img src="'+PluginConf.img_path+'logo.png"/></a>'+
						'<ul id="'+PluginConf.css_refix+'top_bar_ul">'+
							'<li id="'+PluginConf.css_refix+'info_content_tab" show_id="'+PluginConf.css_refix+'info_content" class="'+PluginConf.css_refix+'top_bar_li '+PluginConf.css_refix+'selected_li">商品信息<i></i></li>'+
							'<li id="'+PluginConf.css_refix+'cart_content_tab" show_id="'+PluginConf.css_refix+'cart_content" class="'+PluginConf.css_refix+'top_bar_li">在途运单(<span id="'+PluginConf.css_refix+'cart_count">0</span>)<i></i></li>'+
							'<li id="'+PluginConf.css_refix+'eval_content_tab" show_id="'+PluginConf.css_refix+'eval_content" class="'+PluginConf.css_refix+'top_bar_li">商品评价(<span id="'+PluginConf.css_refix+'eval_count">0</span>)<i></i></li>'+
						'</ul>'+
					'</div>'+
					'<div id="'+PluginConf.css_refix+'info_content" class="'+PluginConf.css_refix+'tab_content">'+
						'<div id="'+PluginConf.css_refix+'user_about" class="'+PluginConf.css_refix+'plugin_list">'+
							'<a id="'+PluginConf.css_refix+'add_fav" class="'+PluginConf.css_refix+'add_fav"><i></i>关注此商品</a>'+
							'<label id="'+PluginConf.css_refix+'stock_tip_label"><input type="checkbox" id="'+PluginConf.css_refix+'stock_tip" name="stock_tip"/>缺货提醒</label>'+
						'</div>'+
						'<div id="'+PluginConf.css_refix+'goods_body">'+
							'<div class="'+PluginConf.css_refix+'zhi_left">'+
								'<div class="'+PluginConf.css_refix+'plugin_list">'+
									'<div class="'+PluginConf.css_refix+'list_left">'+
										'<span class="'+PluginConf.css_refix+'plugin_list_name">售价:</span>'+
									'</div>'+
									'<div class="'+PluginConf.css_refix+'list_right">'+
										'<span id="'+PluginConf.css_refix+'goods_price" class="'+PluginConf.css_refix+'plugin_list_value">¥0.00</span>'+
									'</div>'+
								'</div>'+
								'<div class="'+PluginConf.css_refix+'plugin_list">'+
									'<div class="'+PluginConf.css_refix+'list_left">'+
										'<span class="'+PluginConf.css_refix+'plugin_list_name">重量:</span>'+
									'</div>'+
									'<div class="'+PluginConf.css_refix+'list_right">'+
										'<span id="'+PluginConf.css_refix+'weight_value" class="'+PluginConf.css_refix+'plugin_list_value">0</span>'+
										'<input type="text" id="'+PluginConf.css_refix+'weight_input" class="'+PluginConf.css_refix+'plugin_text" />'+
										'<span class="'+PluginConf.css_refix+'plugin_list_value">磅</span>'+
										/*'<span class="'+PluginConf.css_refix+'plugin_list_tip">（如系统获取商品重量错误，您可以手动填写商品的大致重量）</span>'+*/
									'</div>'+
								'</div>'+
								'<div class="'+PluginConf.css_refix+'plugin_list">'+
									'<div class="'+PluginConf.css_refix+'list_left">'+
										'<span class="'+PluginConf.css_refix+'plugin_list_name">数量:</span>'+
									'</div>'+
									'<div class="'+PluginConf.css_refix+'list_right">'+
										'<a id="'+PluginConf.css_refix+'prodQty_reduce" class="'+PluginConf.css_refix+'prodQty_button" href="javascript:;"></a>'+
										'<span id="'+PluginConf.css_refix+'prodQty" class="'+PluginConf.css_refix+'plugin_list_value">1</span>'+
										'<a id="'+PluginConf.css_refix+'prodQty_add" class="'+PluginConf.css_refix+'prodQty_button" href="javascript:;"></a>'+
									'</div>'+
								'</div>'+
								'<div class="'+PluginConf.css_refix+'plugin_list">'+
									'<div class="'+PluginConf.css_refix+'list_left">'+
										'<span class="'+PluginConf.css_refix+'plugin_list_name">转运：</span>'+
									'</div>'+
									'<div class="'+PluginConf.css_refix+'list_right">'+
										'<span class="'+PluginConf.css_refix+'plugin_list_value">¥<font id="'+PluginConf.css_refix+'fee1">0</font></span>'+
									'</div>'+
								'</div>'+
								'<div class="'+PluginConf.css_refix+'plugin_list">'+
									'<div class="'+PluginConf.css_refix+'list_left">'+
										'<span class="'+PluginConf.css_refix+'plugin_list_name">快递：</span>'+
									'</div>'+
									'<div class="'+PluginConf.css_refix+'list_right">'+
										'<span class="'+PluginConf.css_refix+'plugin_list_value">¥<font id="'+PluginConf.css_refix+'fee2">0</font></span>'+
									'</div>'+
								'</div>'+
								'<div class="'+PluginConf.css_refix+'plugin_list" title="商品到手价，选择了报关类别后才能显示">'+
									'<div class="'+PluginConf.css_refix+'list_left">'+
										'<span class="'+PluginConf.css_refix+'plugin_list_name">到手价:</span>'+
									'</div>'+
									'<div class="'+PluginConf.css_refix+'list_right">'+
										'<span id="'+PluginConf.css_refix+'totle_price" class="'+PluginConf.css_refix+'plugin_list_value">--</span>'+
									'</div>'+
								'</div>'+
							'</div>'+
							'<div class="'+PluginConf.css_refix+'zhi_right">'+
								'<div class="'+PluginConf.css_refix+'plugin_list">'+
									'<div class="'+PluginConf.css_refix+'list_left">'+
										'<span class="'+PluginConf.css_refix+'plugin_list_name">转运仓:</span>'+
									'</div>'+
									'<div id="'+PluginConf.css_refix+'transport_info" class="'+PluginConf.css_refix+'list_right">'+
									'</div>'+
								'</div>'+
								'<div class="'+PluginConf.css_refix+'plugin_list">'+
									'<div class="'+PluginConf.css_refix+'list_left">'+
										'<span class="'+PluginConf.css_refix+'plugin_list_name">报关:</span>'+
									'</div>'+
									'<div class="'+PluginConf.css_refix+'list_right">'+
										'<span id="'+PluginConf.css_refix+'product_cat" class="'+PluginConf.css_refix+'plugin_list_value"></span>'+
										'<div class="'+PluginConf.css_refix+'plugin_list_tip">（适用税率：<font id="'+PluginConf.css_refix+'tax_rate">--</font>）</div>'+
									'</div>'+
								'</div>'+
								'<div class="'+PluginConf.css_refix+'plugin_list">'+
									'<div class="'+PluginConf.css_refix+'list_left">'+
										'<span class="'+PluginConf.css_refix+'plugin_list_name">关税:</span>'+
									'</div>'+
									'<div class="'+PluginConf.css_refix+'list_right">'+
										'<div id="'+PluginConf.css_refix+'tax_type">'+
											'<label><input type="radio" name="'+PluginConf.css_refix+'tax_type" value="actual" checked="checked"/>实报</label>'+
											'<label><input type="radio" name="'+PluginConf.css_refix+'tax_type" value="default"/>默认</label>'+
											'<a id="'+PluginConf.css_refix+'tax_switch" class="'+PluginConf.css_refix+'switch_a" state="on"></a>'+
										'</div>'+
										'<div id="'+PluginConf.css_refix+'actual_tariff_main">'+
											'<span id="'+PluginConf.css_refix+'actual_tariff" class="'+PluginConf.css_refix+'plugin_list_value">--</span>'+
											'<span class="'+PluginConf.css_refix+'plugin_list_tip">(使用商品实际成交价格)</span>'+
										'</div>'+
										'<div id="'+PluginConf.css_refix+'default_tariff_main">'+
											'<span id="'+PluginConf.css_refix+'default_tariff" class="'+PluginConf.css_refix+'plugin_list_value">--</span>'+
											'<span class="'+PluginConf.css_refix+'plugin_list_tip">(使用商品默认完税价格<font id="'+PluginConf.css_refix+'dutiable_value" class="'+PluginConf.css_refix+'plugin_list_value">--</font>元)</span>'+
										'</div>'+
									'</div>'+
								'</div>'+
							'</div>'+
						'</div>'+
						'<div id="'+PluginConf.css_refix+'goods_footer">'+
							'<a id="'+PluginConf.css_refix+'plugin_submit" class="'+PluginConf.css_refix+'common_button">一键提交转运</a>'+
							'<a id="'+PluginConf.css_refix+'ask_pay" class="'+PluginConf.css_refix+'common_button '+PluginConf.css_refix+'disable_button">代购</a>'+
							'<span id="'+PluginConf.css_refix+'contact_us">有问题找客服<a target="_blank" href="http://wpa.qq.com/msgrd?v=3&uin=372014605&site=qq&menu=yes"><img border="0" src="http://wpa.qq.com/pa?p=2:372014605:41" alt="QQ交谈"/></a></span>'+
						'</div>'+
					'</div>'+
					Plugin_cart+
					'<div id="'+PluginConf.css_refix+'eval_content" class="'+PluginConf.css_refix+'tab_content">'+
						'<div id="'+PluginConf.css_refix+'eval_info_tab">'+
							'<div class="'+PluginConf.css_refix+'eval_info_main">'+
								'<div class="'+PluginConf.css_refix+'eval_info_totle">'+
									'<p class="'+PluginConf.css_refix+'good_eval_totle"><span id="'+PluginConf.css_refix+'good_eval_value">0</span>%</p>'+
									'<p>好评度</p>'+
								'</div>'+
								'<div class="'+PluginConf.css_refix+'eval_info_detail">'+
									'<div class="'+PluginConf.css_refix+'eval_info_list"><span>好评</span><p class="'+PluginConf.css_refix+'eval_percent_bar"><i id="'+PluginConf.css_refix+'good_eval_bar"></i></p><span><font id="'+PluginConf.css_refix+'good_eval_percent">0</font>%</span></div>'+
									'<div class="'+PluginConf.css_refix+'eval_info_list"><span>中评</span><p class="'+PluginConf.css_refix+'eval_percent_bar"><i id="'+PluginConf.css_refix+'normal_eval_bar"></i></p><span><font id="'+PluginConf.css_refix+'normal_eval_percent">0</font>%</span></div>'+
									'<div class="'+PluginConf.css_refix+'eval_info_list"><span>差评</span><p class="'+PluginConf.css_refix+'eval_percent_bar"><i id="'+PluginConf.css_refix+'bad_eval_bar"></i></p><span><font id="'+PluginConf.css_refix+'bad_eval_percent">0</font>%</span></div>'+
								'</div>'+
								'<div class="'+PluginConf.css_refix+'eval_info_tip">'+
									'<p>您的评价对其他买家很有用</p>'+
									'<a id="'+PluginConf.css_refix+'eval_button" class="'+PluginConf.css_refix+'common_button">点评商品</a>'+
								'</div>'+
							'</div>'+
							'<div id="'+PluginConf.css_refix+'eval_list_box">'+
								'<div id="'+PluginConf.css_refix+'no_eval_info">还没有用户对此商品进行点评！</div>'+
								'<div id="'+PluginConf.css_refix+'eval_list_main"></div>'+
							'</div>'+
						'</div>'+
						'<div id="'+PluginConf.css_refix+'eval_add_tab">'+
							'<div class="'+PluginConf.css_refix+'eval_level_main">'+
								'<label><input class="'+PluginConf.css_refix+'eval_level_input" type="radio" name="eval_level" value="0" checked="checked"/><i id="'+PluginConf.css_refix+'good_eval_level"></i></label>'+
								'<label><input class="'+PluginConf.css_refix+'eval_level_input" type="radio" name="eval_level" value="1"/><i id="'+PluginConf.css_refix+'normal_eval_level"></i></label>'+
								'<label><input class="'+PluginConf.css_refix+'eval_level_input" type="radio" name="eval_level" value="2"/><i id="'+PluginConf.css_refix+'bad_eval_level"></i></label>'+
							'</div>'+
							'<div class="'+PluginConf.css_refix+'eval_content_box">'+
								'<textarea id="'+PluginConf.css_refix+'eval_message" name="eval_message" placeholder="在此处输入评价，你的评价对其他买家有很大帮助！"></textarea>'+
							'</div>'+
							'<div id="'+PluginConf.css_refix+'eval_submit_error" class="'+PluginConf.css_refix+'error_tip"><i></i><span>在此输入评价错误信息！</span></div>'+
							'<div class="'+PluginConf.css_refix+'eval_submit">'+
								'<a id="'+PluginConf.css_refix+'eval_submit_button">提交评价</a>'+
								'<a id="'+PluginConf.css_refix+'eval_cancle_button">取消</a>'+
							'</div>'+
						'</div>'+
					'</div>'+
				'</div>';
//弹出窗口背景
var PluginBack = '<div id="'+PluginConf.css_refix+'window_back"></div>';
//弹出窗口html
var PluginWindow = '<div id="'+PluginConf.css_refix+'window_main">'+
						'<div class="'+PluginConf.css_refix+'window_top">'+
							'<div class="'+PluginConf.css_refix+'window_top_left"></div>'+
							'<div class="'+PluginConf.css_refix+'window_top_right"></div>'+
							'<div class="'+PluginConf.css_refix+'window_top_center">'+
								'<h2>设置收货信息</h2>'+
								'<a id="'+PluginConf.css_refix+'window_close" title="关闭窗口"></a>'+
							'</div>'+
						'</div>'+
						'<div class="'+PluginConf.css_refix+'window_content">'+
							'<div class="'+PluginConf.css_refix+'window_padding">'+
								'<form id="'+PluginConf.css_refix+'transport_form" method="post">'+
									'<div class="'+PluginConf.css_refix+'window_list">'+
										'<div class="'+PluginConf.css_refix+'window_list_left">'+
											'<span class="'+PluginConf.css_refix+'window_list_name">商品类别:</span>'+
										'</div>'+
										'<div class="'+PluginConf.css_refix+'window_list_right">'+
											'<span id="'+PluginConf.css_refix+'goods_cat" class="'+PluginConf.css_refix+'window_list_value"></span>'+
										'</div>'+
									'</div>'+
									'<div class="'+PluginConf.css_refix+'window_list">'+
										'<div class="'+PluginConf.css_refix+'window_list_left">'+
											'<span class="'+PluginConf.css_refix+'window_list_name">中文品名:</span>'+
										'</div>'+
										'<div class="'+PluginConf.css_refix+'window_list_right">'+
											'<input class="'+PluginConf.css_refix+'window_text" type="text" id="'+PluginConf.css_refix+'zh_goods_name" name="'+PluginConf.css_refix+'zh_goods_name"/>'+
										'</div>'+
									'</div>'+
									'<div class="'+PluginConf.css_refix+'window_list">'+
										'<div class="'+PluginConf.css_refix+'window_list_left">'+
											'<span class="'+PluginConf.css_refix+'window_list_name">收件人:</span>'+
										'</div>'+
										'<div class="'+PluginConf.css_refix+'window_list_right">'+
											'<input class="'+PluginConf.css_refix+'window_text" type="text" id="'+PluginConf.css_refix+'receive_name" name="'+PluginConf.css_refix+'receive_name"/>'+
										'</div>'+
									'</div>'+
									'<div class="'+PluginConf.css_refix+'window_list">'+
										'<div class="'+PluginConf.css_refix+'window_list_left">'+
											'<span class="'+PluginConf.css_refix+'window_list_name">手机号码:</span>'+
										'</div>'+
										'<div class="'+PluginConf.css_refix+'window_list_right">'+
											'<input class="'+PluginConf.css_refix+'window_text" type="text" id="'+PluginConf.css_refix+'receive_mobile" name="'+PluginConf.css_refix+'receive_mobile" maxlength="11"/>'+
										'</div>'+
									'</div>'+
									'<div class="'+PluginConf.css_refix+'window_list">'+
										'<div class="'+PluginConf.css_refix+'window_list_left">'+
											'<span class="'+PluginConf.css_refix+'window_list_name">国内地址:</span>'+
										'</div>'+
										'<div class="'+PluginConf.css_refix+'window_list_right">'+
											'<span id="'+PluginConf.css_refix+'area"></span>'+
											'<div>'+
												'<input class="'+PluginConf.css_refix+'window_text" type="text" id="'+PluginConf.css_refix+'receive_address" name="'+PluginConf.css_refix+'receive_address"/>'+
												'<span class="'+PluginConf.css_refix+'window_list_tip">(详细街道地址)</span>'+
											'</div>'+
										'</div>'+
									'</div>'+
									'<div class="'+PluginConf.css_refix+'window_list">'+
										'<div class="'+PluginConf.css_refix+'window_list_left">'+
											'<span class="'+PluginConf.css_refix+'window_list_name">申报价格:</span>'+
										'</div>'+
										'<div class="'+PluginConf.css_refix+'window_list_right">'+
											'<input class="'+PluginConf.css_refix+'window_text" style="width:100px;" type="text" id="'+PluginConf.css_refix+'declared_value" name="'+PluginConf.css_refix+'declared_value"/>'+
											'<span class="'+PluginConf.css_refix+'window_list_tip">(元/件)</span>'+
											'<label style="margin-left:6px;"><input id="'+PluginConf.css_refix+'tax_include" type="checkbox" name="'+PluginConf.css_refix+'tax_include" checked="checked"/>含关税</label>'+
										'</div>'+
									'</div>'+
									'<div class="'+PluginConf.css_refix+'window_list">'+
										'<div class="'+PluginConf.css_refix+'window_list_left">'+
											'<span class="'+PluginConf.css_refix+'window_list_name">运费:</span>'+
										'</div>'+
										'<div class="'+PluginConf.css_refix+'window_list_right">'+
											'<span class="'+PluginConf.css_refix+'window_list_value"><font id="'+PluginConf.css_refix+'transport_fee">0</font>元/件</span>'+
										'</div>'+
									'</div>'+
									'<div class="'+PluginConf.css_refix+'window_list">'+
										'<div class="'+PluginConf.css_refix+'window_list_left">'+
											'<span class="'+PluginConf.css_refix+'window_list_name">申报数量:</span>'+
										'</div>'+
										'<div class="'+PluginConf.css_refix+'window_list_right">'+
											'<input class="'+PluginConf.css_refix+'window_text" style="width:100px;" type="text" id="'+PluginConf.css_refix+'declared_num" name="'+PluginConf.css_refix+'declared_num"/>'+
											'<span class="'+PluginConf.css_refix+'window_list_tip">件，共<font id="'+PluginConf.css_refix+'goods_kg">--</font>公斤</span>'+
										'</div>'+
									'</div>'+
									'<div class="'+PluginConf.css_refix+'window_list">'+
										'<div class="'+PluginConf.css_refix+'window_list_left">'+
											'<span class="'+PluginConf.css_refix+'window_list_name">增值服务:</span>'+
										'</div>'+
										'<div id="'+PluginConf.css_refix+'attach_service" class="'+PluginConf.css_refix+'window_list_right">'+
											'<label><input type="checkbox" name="'+PluginConf.css_refix+'window_attach" value="1"/>取出小票(每次3元)</label>'+
											'<label><input type="checkbox" name="'+PluginConf.css_refix+'window_attach" value="2"/>入库拍照(每次2元)</label>'+
											'<label><input type="checkbox" name="'+PluginConf.css_refix+'window_attach" value="3"/>分包(每件10元)</label>'+
											'<label><input type="checkbox" name="'+PluginConf.css_refix+'window_attach" value="4"/>合包</label>'+
										'</div>'+
									'</div>'+
									'<div class="'+PluginConf.css_refix+'window_list">'+
										'<div class="'+PluginConf.css_refix+'window_list_left">'+
											'<span class="'+PluginConf.css_refix+'window_list_name">转运地址:</span>'+
										'</div>'+
										'<div class="'+PluginConf.css_refix+'window_list_right">'+
											'<select id="'+PluginConf.css_refix+'transport_address" name="'+PluginConf.css_refix+'transport_address"></select>'+
										'</div>'+
									'</div>'+
									'<div class="'+PluginConf.css_refix+'window_list">'+
										'<div class="'+PluginConf.css_refix+'window_list_left">'+
											'<span class="'+PluginConf.css_refix+'window_list_name">备注:</span>'+
										'</div>'+
										'<div class="'+PluginConf.css_refix+'window_list_right">'+
											'<textarea id="'+PluginConf.css_refix+'order_remarks" name="'+PluginConf.css_refix+'order_remarks"></textarea>'+
										'</div>'+
									'</div>'+
									'<div class="'+PluginConf.css_refix+'window_list">'+
										'<div class="'+PluginConf.css_refix+'window_list_left">'+'</div>'+
										'<div class="'+PluginConf.css_refix+'window_list_right">'+
											'<input id="'+PluginConf.css_refix+'transport_submit" type="submit" value="确定"/>'+
										'</div>'+
									'</div>'+
								'</form>'+
							'</div>'+
						'</div>'+
					'</div>';
//订单提交成功窗口
var PluginSuccess = '<div id="'+PluginConf.css_refix+'window_success_main">'+
						'<div id="'+PluginConf.css_refix+'window_success_top">'+
							'<img src="'+PluginConf.img_path+'logo.png"/>'+
						'</div>'+
						'<div id="'+PluginConf.css_refix+'window_success_content">'+
							'<div class="'+PluginConf.css_refix+'window_success_info">'+
								'<span id="'+PluginConf.css_refix+'window_success_tip">提交成功</span>'+
								'<i id="'+PluginConf.css_refix+'window_success_ico"></i>'+
							'</div>'+
							'<div class="'+PluginConf.css_refix+'window_success_info">'+
								'<span id="'+PluginConf.css_refix+'window_success_share"></span>'+
							'</div>'+
							'<div class="'+PluginConf.css_refix+'window_success_info">'+
								'<a id="'+PluginConf.css_refix+'window_success_ok">确定</a>'+
							'</div>'+
						'</div>'+
					'</div>';