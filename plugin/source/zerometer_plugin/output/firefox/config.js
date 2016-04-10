/*
系统通用配置项目
*/
var PluginConf = {
	'lb_rate':0.4536,//磅与千克单位换算
	'firstFee1':8,//计算物流费用的相关参数
	'firstFee2':4,
	'secondFee1':10,
	'secondFee2':3,
	//'source_url':'http://localhost/haitao100/',//资源文件和后台文件主目录,
	'source_url':'https://localhost:9443/',//资源文件和后台文件主目录,
	//'source_url':'http://www.lingmihaitao.com/',
	'css_refix':'Lingmi_',//css命名前缀
	'base_li_index':10000,//插件主框架li元素id基数
};
PluginConf.css_file = PluginConf.source_url+'assets/stylesheets/plugin/extension.css';//前台页面css文件
PluginConf.img_path = PluginConf.source_url+'assets/images/plugin/img/';//图片文件主目录
PluginConf.get_interface_file = function(act,params_obj){//获取接口文件通用方法
	var interface_file = PluginConf.source_url+'plugin/getExchangeRate';
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
//获取当前汇率
PluginConf.get_exchange_rate = function(){
	//获取美元汇率（因为可能页面载入时就会用到，所以用同步获取）
	console.log("start to get_exchange_rate");
	var details = {
		url: PluginConf.get_interface_file('get_exchange_rate',{'from':'USD','to':'CNY'}),
		method: 'GET',
		async: false,
		contentType: 'text'
	};

	kango.xhr.send(details, function(data) {
		var exchange_rate = 6.2584;

		if (data.status == 200 && data.response != null) {
			var result = JSON.parse(data.response);
			if(result.isSupport ){

				exchange_rate = result.rate;
			}
			else {
				console.log("not support exchange_rate"+result.isSupport)
			}
		}
		console.log("exchange_rate="+exchange_rate);
		kango.storage.setItem('exchange_rate', exchange_rate);
	});
	//获取欧元汇率
	var details = {
		url: PluginConf.get_interface_file('get_exchange_rate',{'from':'EUR','to':'CNY'}),
		method: 'GET',
		async: true,
		contentType: 'text'
	};
	kango.xhr.send(details, function(data) {
		var euro_rate = 7.0154;
		if (data.status == 200 && data.response != null) {
			var result = JSON.parse(data.response);
			if(result.isSupport ){
				euro_rate = result.rate;
			}
			else {
				console.log("not support euro_rate")
			}

		}
		console.log("euro_rate="+euro_rate);
		kango.storage.setItem('euro_rate', euro_rate);
	});

	/*//获取英镑汇率
	 var details = {
	 url: PluginConf.get_interface_file('get_exchange_rate',{'from':'GBP','to':'CNY'}),
	 method: 'GET',
	 async: true,
	 contentType: 'text'
	 };
	 kango.console.log("details="+details.url);
	 kango.xhr.send(details, function(data) {
	 var pound_rate = 9.6595;
	 if (data.status == 200 && data.response != null) {
	 if(data.response!=''){
	 pound_rate = data.response;
	 }
	 kango.console.log(pound_rate);
	 }
	 kango.storage.setItem('pound_rate', pound_rate);
	 });*/

	//获取日元汇率
	var details = {
		url: PluginConf.get_interface_file('get_exchange_rate',{'from':'JPY','to':'CNY'}),
		method: 'GET',
		async: true,
		contentType: 'text'
	};
	kango.xhr.send(details, function(data) {
		var jpy_rate = 0.05249;
		if (data.status == 200 && data.response != null) {
			var result = JSON.parse(data.response);
			alert(result.isSupport);
			if(result.isSupport){
				jpy_rate = result.rate;
			}
			else {
				console.log("not support jpy_rate")
			}

		}else { // something went wrong

		}
		console.log("jpy_rate="+jpy_rate);
		kango.storage.setItem('jpy_rate', jpy_rate);
	});
	console.log("end to get_exchange_rate");
}

/* 
	红色（横栏，固定层）：#f04943   rgb(240,73,67)
	蓝色（购物车）：#387cbe   rgb(56,124,190) 
	橙色（我的订单）：#fc7d5a  rgb(252,125,90) 
	紫色（我的收藏）：#8f44ad   rgb(143,68,173)
	粉色（优惠推荐）：#f83e9b   rgb(248,62,155)
	绿色（个人中心）：#00997e   rgb(0,153,126)
*/
//零米插件主框架
var PluginMain = '<div id = "'+PluginConf.css_refix+'plugin">'+
		'<div id="'+PluginConf.css_refix+'shrink"><a href="#">隐藏</a></div>'+
			'<!--  左边列表 -->'+
			'<ul id="'+PluginConf.css_refix+'left">'+
				'<li id="'+PluginConf.css_refix+(PluginConf.base_li_index+0)+'" index='+(PluginConf.base_li_index+0)+' style="background:#f04943 url('+PluginConf.img_path+'tool.png) center 7.5px no-repeat">'+
					'<div class="'+PluginConf.css_refix+'info">'+
						'零米海淘助手'+
					'</div>'+
				'</li>'+
			'</ul>'+

			'<!--  横条  -->'+
			'<div id="'+PluginConf.css_refix+'hor">'+
						'<div id="'+PluginConf.css_refix+'title">Dr.Martens Mens 1460 Classic Boot</div>'+
						'<div id="'+PluginConf.css_refix+'isThirdParty">自营</div>'+
						'<div id="'+PluginConf.css_refix+'haitaoRisk"><a href="'+PluginConf.source_url+'haitaoRiskForExtension" target="_blank">查看禁运商品</a></div>'+
						'<div id="'+PluginConf.css_refix+'foreignPrice">商品单价:<label id="'+PluginConf.css_refix+'foreignPriceValue">$149.00</label></div>'+
						'<div id="'+PluginConf.css_refix+'rmbPrice"><label id="'+PluginConf.css_refix+'rmbDescription">约:</label><label id="'+PluginConf.css_refix+'rmbPriceValue">1444</label><label id="'+PluginConf.css_refix+'rmbCurrency"> RMB</label></div>'+
						'<div id="'+PluginConf.css_refix+'currency">(当前汇率:<label id="currencyValue">6.3</label>)</div>'+
						'<div id="'+PluginConf.css_refix+'like" style="background:#f04943 url('+PluginConf.img_path+'like.png) center 8px no-repeat">'+
						'</div>'+
						'<div id="'+PluginConf.css_refix+'loginInfo"><a id="'+PluginConf.css_refix+'login" href="#">登录</a>|<a id="'+PluginConf.css_refix+'register" href="' + PluginConf.source_url + 'station/register">注册</a></div>'+
			'</div>'+

			'<!--  右边列表   -->'+
			'<ul id="'+PluginConf.css_refix+'right">'+
				'<li id="'+PluginConf.css_refix+(PluginConf.base_li_index+1)+'" index='+(PluginConf.base_li_index+1)+' style="background:#387cbe url('+PluginConf.img_path+'cart.png) center 7.5px no-repeat">'+
					'<div class="'+PluginConf.css_refix+'info">'+
						'购物车'+
					'</div>'+
				'</li>'+
				'<li id="'+PluginConf.css_refix+(PluginConf.base_li_index+2)+'" index='+(PluginConf.base_li_index+2)+' style="background:#fc7d5a url('+PluginConf.img_path+'order.png) center 8px no-repeat">'+
					'<div class="'+PluginConf.css_refix+'info">'+
						'我的订单'+
					'</div>'+
				'</li>'+
				'<li id="'+PluginConf.css_refix+(PluginConf.base_li_index+3)+'" index='+(PluginConf.base_li_index+3)+' style="background:#8f44ad url('+PluginConf.img_path+'collect.png) center 7px no-repeat">'+
					'<div class="'+PluginConf.css_refix+'info">'+
						'我的收藏'+
					'</div>'+
				'</li>'+
				'<li id="'+PluginConf.css_refix+(PluginConf.base_li_index+4)+'" index='+(PluginConf.base_li_index+4)+' style="background:#f83e9b url('+PluginConf.img_path+'suggext.png) center 8px no-repeat">'+
					'<div class="'+PluginConf.css_refix+'info">'+
						'优惠推荐'+
					'</div>'+
				'</li>'+
				'<li id="'+PluginConf.css_refix+(PluginConf.base_li_index+5)+'" index='+(PluginConf.base_li_index+5)+' style="background:#00997e url('+PluginConf.img_path+'person.png) center 8px no-repeat">'+
					'<div class="'+PluginConf.css_refix+'info">'+
						'个人中心'+
					'</div>'+
				'</li>'+
			'</ul>'+

			'<div id="'+PluginConf.css_refix+'content">'+
				'<div id="'+PluginConf.css_refix+'sizeAssistant">'+
					'<iframe id="'+PluginConf.css_refix+'contentIframe" src="'+PluginConf.source_url+'newPlugin/sizechange"></iframe>'+
				'</div>'+
				'<div id="'+PluginConf.css_refix+'featureSelect"></div>'+
				'<div id="'+PluginConf.css_refix+'infoTips"></div>'+

				'<div id="'+PluginConf.css_refix+'other">'+
					'<iframe id="'+PluginConf.css_refix+'contentIframe_other" src="" ></iframe>'+
				'</div>'+
				
			'</div>'+

		'</div>';

var Tip ='<div id="'+PluginConf.css_refix+'tip"><span>信息提示</span>'+
		'<div id="'+PluginConf.css_refix+'shopSelect">'+
			'<div id="'+PluginConf.css_refix+'weight">'+
				'<strong class="'+PluginConf.css_refix+'strong">商品重量 :</strong>约 '+
				'<span id="'+PluginConf.css_refix+'weight_value" class="'+PluginConf.css_refix+'plugin_list_value" ></span>'+
				'<input type="text" id="'+PluginConf.css_refix+'weight_input" class="'+PluginConf.css_refix+'weight_input" >'+
				' 磅'+
			'</div>'+
		'</div>'+

		'<div id="'+PluginConf.css_refix+'shopFee">'+
			'<strong class="'+PluginConf.css_refix+'strong">国际运费 : </strong>'+
			'<select id="'+PluginConf.css_refix+'proShipFee">'+
				'<option  id="1" selected ="selected">海带宝</option>'+
				'<option  id="2">各种宝</option>'+
			'</select>'+
			' 约<span id="'+PluginConf.css_refix+'fee1">￥ 50</span>'+
			'<div id="'+PluginConf.css_refix+'light_word"> 转运到国内约（5-10）天，无需身份证</div>'+
			'<div> <strong class="'+PluginConf.css_refix+'strong">美国境内运费：</strong> <span id="'+PluginConf.css_refix+'fee2">$1</span> ，约<span id="'+PluginConf.css_refix+'fee2_CN">￥6.53</span></div>'+
		'</div>'+
	

		'<div id="'+PluginConf.css_refix+'resultFee">'+
			'<div><strong class="'+PluginConf.css_refix+'strong">商品总运费：</strong>约<span  class="'+PluginConf.css_refix+'warn"  id="'+PluginConf.css_refix+'fee_totle">￥6.53</span> <span> <a href="shopFeeDetail.html" id="'+PluginConf.css_refix+'light_word">运费详解</a></span> </div>'+	
		'</div>'+


	'</div>';
var  FeatureSelect =  '<div id="'+PluginConf.css_refix+'featureSelect_left">'+
	'<div  id="'+PluginConf.css_refix+'featureSelect_all">'+
			'<div> <strong class="'+PluginConf.css_refix+'strong">商品数量 : </strong>'+
						'<span><img id="'+PluginConf.css_refix+'prodQty_reduce"  class="'+PluginConf.css_refix+'prodQty_reduce" src="'+PluginConf.img_path+'prodQty_reduce.png"> </img>'+
						 '<span id="'+PluginConf.css_refix+'prodQty"> 1 </span> '+
						 '<img id="'+PluginConf.css_refix+'prodQty_add"  class="'+PluginConf.css_refix+'prodQty_add" src="'+PluginConf.img_path+'prodQty_add.png"> </img> </span> '+
			'</div>'+
			'<div>   <strong class="'+PluginConf.css_refix+'strong">商品折扣码 : <strong> <a href="#" id="'+PluginConf.css_refix+'disCount" class="'+PluginConf.css_refix+'light_word">知道今天的折扣码？</a>    </div>'+
			'<div>  <select id="'+PluginConf.css_refix+'proDiscount">'+
						'<option  id="1" selected ="selected">海带宝</option>'+
						'<option  id="2">各种宝</option>'+
					  '</select>'+ 
			'</div>'+
			'<div> <input type="text"  class="'+PluginConf.css_refix+'favourInfo" value="填写优惠的信息，比如优惠码"/> </div>'+
	'</div>'+
 '</div>'+
 '<div class="'+PluginConf.css_refix+'featureSelect_right">'+
 	'<div class="'+PluginConf.css_refix+'proPrice"> <strong class="strong">商品价格 : </strong>  <span class="'+PluginConf.css_refix+'warn" id="'+PluginConf.css_refix+'goods_price">1233元 </span> </div>'+
 	'<div id="'+PluginConf.css_refix+'light_word" class="'+PluginConf.css_refix+'light_word"> (不含运费)</div>'+
 	'<div  class="'+PluginConf.css_refix+'button_putCart_td"> <input type="button"  class="'+PluginConf.css_refix+'button_putCart" id="'+PluginConf.css_refix+'button_putCart" value="加入购物车"> </div> '+
 '</div>';

//var ProColor =' <div><strong class="'+PluginConf.css_refix+'strong">商品颜色 : </strong> <span class="'+PluginConf.css_refix+'warn" id="'+PluginConf.css_refix+'proColor">请到页面选择颜色</span></div> ';
//var ProFlavor =' <div><strong class="'+PluginConf.css_refix+'strong">商品口味 : </strong><span class="'+PluginConf.css_refix+'warn" id="'+PluginConf.css_refix+'proFlavor">请到页面选择口味</span> </div> ';
//var ProStyle =' <div><strong class="'+PluginConf.css_refix+'strong">商品风格 : </strong><span class="'+PluginConf.css_refix+'warn" id="'+PluginConf.css_refix+'proStyle">请到页面选择样式</span> </div> ';

/*var ProStandard = '<div> <strong class="strong">商品规格 : </strong> <select id="'+PluginConf.css_refix+'goods_size">'+
															'<option  id="1" selected ="selected">海带宝</option>'+
															'<option  id="2">各种宝</option>'+
					 									 '</select>'+
					'</div>';*/
var  FeatureSelectold =  '<div id="'+PluginConf.css_refix+'featureSelect_inner">'+
	'<table  id="'+PluginConf.css_refix+'featureSelect_table">'+
		'<tbody >'+
			'<tr> <td> <div><strong class="'+PluginConf.css_refix+'strong">商品尺寸 : </strong> <span class="'+PluginConf.css_refix+'warn">请到页面选择尺码</span></div> </td> <td></td> </tr>'+
			'<tr> <td> <div><strong class="'+PluginConf.css_refix+'strong">商品颜色 : </strong> <span>black</span></div> </td> <td></td> </tr>'+
			'<tr> <td> <div> <strong class="'+PluginConf.css_refix+'strong">商品数量 : </strong>'+
						'<span><input type="button" id="'+PluginConf.css_refix+'prodQty_reduce"  class="'+PluginConf.css_refix+'prodQty_reduce" value=" - "/>'+
						 '<span id="'+PluginConf.css_refix+'prodQty"> 1 </span> '+
						 '<input type="button" id="'+PluginConf.css_refix+'prodQty_add"  class="'+PluginConf.css_refix+'prodQty_add"  value=" + "/></span></div> </td> '+
				   '<td> <strong class="strong">商品价格 : </strong>  <span class="'+PluginConf.css_refix+'warn" id="'+PluginConf.css_refix+'goods_price">1233元 </span><span id="'+PluginConf.css_refix+'light_word"> (不含运费)</span> </td></tr>'+
			'<tr> <td> <div> <strong class="strong">商品规格 : </strong> <select id="'+PluginConf.css_refix+'goods_size">'+
															'<option  id="1" selected ="selected">海带宝</option>'+
															'<option  id="2">各种宝</option>'+
					 									 '</select>'+
					  '</div> </td>'+
					  '<td rowspan="2" class="'+PluginConf.css_refix+'button_putCart_td"> <input type="button"  class="'+PluginConf.css_refix+'button_putCart" id="'+PluginConf.css_refix+'button_putCart" value="加入购物车"/> </td>'+
			'</tr>'+

			'<tr> <td> <div> <strong class="'+PluginConf.css_refix+'strong">商品折扣码 : <strong> <a href="'+PluginConf.source_url+'disCount" id="'+PluginConf.css_refix+'light_word">知道今天的折扣码？</a></div> </td>   </tr>'+
			'<tr> <td> <select id="'+PluginConf.css_refix+'proDiscount">'+
						'<option  id="1" selected ="selected">海带宝</option>'+
						'<option  id="2">各种宝</option>'+
					  '</select></td>'+ 
			'</tr>'+
			'<tr> <td colSpan=2><textarea rows="1" cols="30" class="'+PluginConf.css_refix+'favourInfo">填写优惠的信息，比如优惠码</textarea></td> </tr>'+
		'</tbody>'+
	'</table>'+
'</div>';

//弹出登录窗口
var loginWindow = "\
        <div class='sideBarLoginPage'>\
          <div class='plug_in_login'>\
            <a class='plug_in_loginClose' title='关闭'></a>\
            <h1>Hi ，欢迎登录零米！</h1>\
            <div class='plug_in_loginContent'>\
              <div class='plug_in_login_username'>\
                <input type='text' name='username'  id='lm_username' autocomplete='off' class='username plug_in_loginContent_input' placeholder='用户名/手机/邮箱' onkeydown='keyDown3(event)'/>\
                <p id='login_prompt' class='plug_in_prompt'></p>\
              </div>\
              <div class='plug_in_login_password'>\
                <input type='password' name='password' id='lm_password' autocomplete='off' class='password plug_in_loginContent_input' placeholder='密码' onkeydown='keyDown3(event)'/>\
              </div>\
              <div class='plug_in_login_authorCode'>\
                <input type='text' onkeydown='keyDown(event)' autocomplete='off' class='authcode plug_in_loginContent_input' placeholder='验证码'/>\
              </div>\
              <div class='plug_in_login_authorCodeChange'>\
                <a class='captcha' href='javascript:'>\
                  <img class='captchaImg' src='" + PluginConf.source_url + "captcha' width='133px' height='33px'/>\
                </a>\
                <span class='plug_in_changeCaptcha changeCaptcha'>看不清，换一张</span>\
              </div>\
              <div class='plug_in_loginBottom plug_in_loginBottom_noCode'>\
                <a href='" + PluginConf.source_url + "retrievpasswordmethod' target='_blank' class='forgetCode'>忘记密码?</a>\
                <input type='checkbox' id='remember' class=''>\
                <span class='autoLogin_check'>下次自动登录</span>\
                <div class='plug_in_buttonBox'>\
                  <input type='hidden' name='password_md5' id='password_md5'>\
                  <button type='submit' class='plug_in_loginButton' id='login' j='true'>立即登录</button>\
                  <div class='thirdPartyLanding'>\
                    <a href='" + PluginConf.source_url + "station/register' class='plug_in_registerButton'>免费注册</a>\
                  </div>\
                </div>\
              </div>\
            </div>\
          </div>\
        </div>\
        <style type='text/css'>\
      * {\
        margin: 0;\
        padding:0;\
        border:none;\
      }\
      .contactCustomer {\
        width: 466px;\
        height: 235px;\
        position: absolute;\
        top: -129px;\
        right: 35px;\
        box-shadow: 0px 0px 10px rgb(162,158,156);\
        background: white;\
        display: none;\
      }\
      .plug_in_sideBar {\
        position:fixed;\
        top:0px;\
        right:0px;\
        z-index:1000005;\
        width:35px;\
        height:100%;\
        background-color:#000\
      }\
      .plug_in_sideBar .plug_in_prompt {\
        position:absolute;\
        margin: 0;\
        top:0px;\
        left:-97px;\
        display:none;\
        text-indent:-1000px;\
        overflow:hidden;\
        width:132px;\
        height:34px;\
      }\
      #login_prompt {\
        height:17px;\
        width: 250px;\
      }\
      .plug_in_sideBar .plug_in_member {\
        width:35px;\
        height:34px;\
      }\
      .plug_in_sideBar li {\
        position:relative;\
        cursor:pointer;\
        list-style: none;\
      }\
      .plug_in_sideBar_content {\
        position:relative;\
        top:50%;\
        margin: 0;\
        padding:0;\
        margin-top:-238px;\
        width:35px;\
        min-height:476px;\
      }\
      .plug_in_sideBar_content li {\
        position:relative;\
        list-style:none;\
        margin: 0;\
      }\
      .plug_in_sideBar_bottom {\
        position:absolute;\
        bottom:0px;\
        margin:0;\
        padding:0;\
        width:35px;\
      }\
      .plug_in_sideBar_bottom li {\
        margin:0;\
      }\
      .plug_in_backToTop {\
        background:url(" + PluginConf.source_url + "assets/images/plug_in_sideBar/plug_in_sideBar.png) no-repeat  -84px 0;\
      }\
      .plug_in_backToTop:hover div {\
        display:block;\
        background:url(" + PluginConf.source_url + "assets/images/plug_in_sideBar/plug_in_sideBar.png) no-repeat  -168px -203px;\
      }\
      .plug_in_wechatAttention {\
        background:url(" + PluginConf.source_url + "assets/images/plug_in_sideBar/plug_in_sideBar.png) no-repeat -39px 0;\
      }\
      .plug_in_wechatAttention:hover {\
        background:url(" + PluginConf.source_url + "assets/images/plug_in_sideBar/plug_in_sideBar.png) no-repeat 0 0;\
      }\
      .plug_in_wechatAttention:hover .plug_in_wechat {\
        display:block;\
      }\
      .plug_in_wechat {\
        position:absolute;\
        top:-83px;\
        left:-121px;\
        display:none;\
        text-indent:-1000px;\
        overflow:hidden;\
        width:121px;\
        height:117px;\
        background:url(" +PluginConf.source_url + "assets/images/plug_in_sideBar/plug_in_sideBar.png) no-repeat -188px -58px;\
      }\
      #.plug_in_logo {\
      #  position:absolute;\
      #  top:0px;\
      #  left:-39px;\
      #  width:75px;\
      #  height:74px;\
      #  background:url(" + PluginConf.source_url + "assets/images/images-for-extension/leftTitle_logo.png) no-repeat center center;\
      #  cursor:pointer;\
      #}\
      .plug_in_personCenter {\
        background:url(" + PluginConf.source_url + "assets/images/plug_in_sideBar/plug_in_sideBar.png) no-repeat -171px -1px;\;\
      }\
      .plug_in_personCenter:hover {\
        background:url(" + PluginConf.source_url + "assets/images/plug_in_sideBar/plug_in_sideBar.png) no-repeat -128px 0;\
      }\
      .plug_in_shoppingCart {\
        width:35px;\
        height:135px;\
        margin-top:9px;\
        background:url(" + PluginConf.source_url + "assets/images/plug_in_sideBar/plug_in_sideBar.png) no-repeat -39px -45px;\
      }\
      .plug_in_shoppingCart span {\
        position:absolute;\
        top:95px;\
        left:8px;\
        display:inline-block;\
        width:19px;\
        height:19px;\
        color:white;\
        text-align:center;\
        font:12px/19px 'Microsoft Yahei';\
        background-color:#f8235d;\
        border-radius:50%;\
      }\
      .plug_in_shoppingCart:hover {\
        background:url(" + PluginConf.source_url + "assets/images/plug_in_sideBar/plug_in_sideBar.png) no-repeat 0 -45px;\
      }\
      .plug_in_discount {\
        margin-top:6px;\
        background:url(" + PluginConf.source_url + "assets/images/plug_in_sideBar/plug_in_sideBar.png) no-repeat -265px 0;\
      }\
      .plug_in_discount:hover div {\
        display:block;\
        background:url(" + PluginConf.source_url + "assets/images/plug_in_sideBar/plug_in_sideBar.png) no-repeat 0 -252px;\
      }\
      .plug_in_search {\
        margin-top:9px;\
        background:url(" + PluginConf.source_url + "assets/images/plug_in_sideBar/plug_in_sideBar.png) no-repeat -355px -1px;\
      }\
      .plug_in_search:hover div {\
        display:block;\
        background:url(" + PluginConf.source_url + "assets/images/plug_in_sideBar/plug_in_sideBar.png) no-repeat  0 -203px;\
      }\
      .plug_in_order {\
        margin-top:9px;\
        background:url(" + PluginConf.source_url + "assets/images/plug_in_sideBar/plug_in_sideBar.png) no-repeat -309px -1px;\
      }\
      .plug_in_order:hover div {\
        display:block;\
        background:url(" + PluginConf.source_url + "assets/images/plug_in_sideBar/plug_in_sideBar.png) no-repeat -168px -252px;\
      }\
      .plug_in_collect {\
        margin-top:13px;\
        background:url(" + PluginConf.source_url + "assets/images/plug_in_sideBar/plug_in_sideBar.png) no-repeat -216px 0;\
      }\
      .plug_in_collect:hover div {\
        display:block;\
        background:url(" + PluginConf.source_url + "assets/images/plug_in_sideBar/plug_in_sideBar.png) no-repeat 0 -296px;\
      }\
      .plug_in_contactCustomer {\
        width:35px;\
        height:109px;\
        background:url(" + PluginConf.source_url + "assets/images/plug_in_sideBar/plug_in_sideBar.png) no-repeat -136px -58px;\
      }\
      .plug_in_contactCustomer:hover {\
        background:url(" + PluginConf.source_url + "assets/images/plug_in_sideBar/plug_in_sideBar.png) no-repeat  -91px -58px;\
      }\
      .sideBarPage{\
        width:320px;\
        height:100%;\
        z-index: 9999;\
        position:fixed;\
        top:0px;\
        right:0px;\
        display:none;\
        background: white;\
      }\
      .sideBarLoginPage {\
        position:fixed;\
        width:400px;\
        height:250px;\
        box-shadow: 0px 0px 10px rgb(162,158,156);\
        background:white;\
        z-index: 1000009;\
		top:100px;\
		left:500px;\
		border-radius: 12px;\
		display: none;\
      }\
      ::-webkit-input-placeholder {\
        color: #b2b2b2;\
      }\
      .plug_in_login {\
        width:400px;\
        height:250px;\
        box-shadow: 0px 0px 3px #cbcbcb;\
        bakground-color:#fffffff !important;\
        text-align: left;\
        position:fixed;\
      }\
      .plug_in_login h1 {\
        position:absolute;\
        top:3px;\
        left:20px;\
        padding: 0;\
        padding-left:75px;\
        width:217px;\
        color:#f8235d;\
        font:18px/45px 'Microsoft Yahei';\
        border-bottom:1px solid #e5e5e5;\
        box-sizing: content-box;\
      }\
      .plug_in_loginClose {\
        position:relative;\
        z-index:2;\
        display:inline-block;\
        width:10px;\
        height:10px;\
        cursor:pointer;\
        margin:11px 0px 0px 385px;\
        background:url(" + PluginConf.source_url + "assets/images/plug_in_sideBar/plug_in_loginClose.png) no-repeat center center;\
      }\
      .plug_in_loginClose:hover {\
        background:url(" + PluginConf.source_url + "assets/images/plug_in_sideBar/plug_in_loginCloseHover.png) no-repeat center center;\
      }\
      .plug_in_loginContent_input {\
        width:233px !important;\
        height:20px !important;\
        border:1px solid #c4c4c4;\
        font:12px/20px 'Microsoft Yahei';\
        border-radius:3px;\
        padding:5px 0px 5px 12px !important;\
        box-sizing: content-box !important;\
        margin-bottom: 0 !important ;\
      }\
      .plug_in_loginContent_input:focus {\
        border:1px solid #46b7e2;\
      }\
      .plug_in_loginContent span {\
        position:absolute;\
        left:12px;\
        top:0px;\
        color:#b2b2b2;\
        font:12px/32px 'Microsoft Yahei';\
      }\
      .plug_in_login_username {\
        margin-top:46px;\
        margin-left:70px;\
        position:relative;\
        width:247px;\
      }\
      .plug_in_login_username p {\
        position:absolute;\
        top:-18px !important;\
        left:13px !important;\
        color:#f52932 !important;\
        font:12px/17px 'Microsoft Yahei' !important;\
        text-indent: 0px !important;\
        display: block !important;\
      }\
      .plug_in_login_password {\
        position:relative;\
        margin-top:16px;\
        margin-left:70px;\
        width:247px;\
      }\
      .plug_in_login_authorCode {\
        margin:16px 0px 0px 70px;\
        display:none;\
      }\
      .plug_in_login_authorCodeChange {\
        position:relative;\
        height:39px;\
        margin-bottom:4px;\
        display:none;\
      }\
      .captcha {\
        position: absolute;\
        width: 131px;\
        height: 31px;\
        cursor: pointer;\
        left: -10px;\
        top: -1px;\
        margin-bottom: 4px;\
      }\
      .plug_in_login_authorCodeChange a {\
        display:inline-block;\
        width:131px;\
        height:31px;\
        color:#535353;\
        margin:15px 8px 0px 81px;\
        border:1px solid #575757;\
      }\
      .forgetCode {\
        font:12px/31px 'Microsoft Yahei';\
        color:#535353;\
        display:inline-block;\
        margin-left:80px;\
        text-decoration:none;\
      }\
      .forgetCode:hover {\
        color:black;\
      }\
      .plug_in_loginBottom {\
        position:relative;\
        margin: 0;\
        margin-top: 10px;\
      }\
      .plug_in_loginBottom input {\
        position:absolute;\
        left:210px;\
        top:6px;\
        width:17px;\
        height:17px;\
      }\
      .plug_in_loginBottom span {\
        left:230px;\
        top:-1px;\
        color:#535353;\
      }\
      .plug_in_buttonBox .plug_in_loginButton {\
        width:166px;\
        height:30px;\
        color:white;\
        border:none;\
        margin:5px 0 0 100px !important;\
        border-radius:6px;\
        font:14px/30px 'Microsoft Yahei';\
        background:#f8235d !important;\
        cursor:pointer;\
        padding: 0 !important;\
      }\
      .plug_in_buttonBox .plug_in_registerButton {\
        float:right;\
        color:#0fafeb;\
        text-decoration:underline;\
        font:14px/38px 'Microsoft Yahei';\
      }\
      .plug_in_login_authorCodeChange span {\
        left:232px;\
        top:15px;\
        color:#535353;\
        cursor:pointer;\
      }\
      .loginByQQ {\
        display:inline-block;\
        width:35px;\
        height:35px;\
        background:url(" + PluginConf.source_url + "assets/images/plug_in_sideBar/plug_in_forQQ.png) no-repeat center center;\
      }\
      .thirdPartyLanding {\
        width:244px;\
        margin-top:-35px;\
        margin-left:94px;\
      }\
      .plug_in_login_authcode {\
        width:400px;\
        height:300px;\
      }\
      .authorCodeImg {\
        cursor:pointer;\
      }\
      .sideBarRegisterPage {\
        position: absolute;\
        top:0px;\
        right:36px;\
        background:white;\
        width:320px;\
        height: 546px;\
        display: none;\
      }\
      .registerPage{\
        width:320px;\
        height:546px;\
      }\
    </style>";
var maskBackground = '<div id="maskBackground">      <iframe src="about:blank"></iframe>    </div>';

var main_css =  "<style type='text/css'>\
	*{\
	margin:0;\
	padding:0;\
}\
#Lingmi_plugin{\
	width:100%;\
	height:300px;\
	overflow:hidden;\
	bottom:0px;\
	position:absolute;\
	font: 15px Verdana,Arial,sans;\
}\
#Lingmi_plugin #Lingmi_hor{\
	width:91%;\
	height:40px;\
	display:block;\
	background-color:#f04943;\
}\
#Lingmi_plugin #Lingmi_hor #Lingmi_title{\
	text-align:center;\
	margin: 0 0 0 60px;\
	color:black;\
	width:270px;\
	top:12px;\
	height:20px;\
	font-size:12px;\
	font-weight:bold;\
	position:absolute;\
}\
#Lingmi_plugin #Lingmi_hor #Lingmi_isThirdParty{\
	margin: 0 0 0 330px;\
	width:40px;\
	top:12px;\
	height:20px;\
	font-size:12px;\
	border:1px solid #000;\
	text-align:center;\
	position:absolute;\
}\
#Lingmi_plugin #Lingmi_hor #Lingmi_haitaoRisk{\
	margin: 0 0 0 380px;\
	top:14px;\
	height:20px;\
	font-size:12px;\
	position:absolute;\
}\
#Lingmi_plugin #Lingmi_hor #Lingmi_foreignPrice{\
	margin: 0 0 0 460px;\
	text-align: center;\
	width:140px;\
	top:14px;\
	height:16px;\
	font-size:12px;\
	position:absolute;\
}\
#Lingmi_foreignPriceValue{\
	color:white;\
}\
#Lingmi_plugin #Lingmi_hor #Lingmi_rmbPrice{\
	margin: 0 0 0 600px;\
	color:white;\
	width:140px;\
	top:6px;\
	height:28px;\
	font-size:12px;\
	position:absolute;\
}\
#Lingmi_rmbDescription{\
	float:left;\
	margin: 7px 0 0 0;\
}\
#Lingmi_rmbPriceValue{\
	font-size:20px;\
	text-align:center;\
	margin: -25px 0 0 0;\
}\
#Lingmi_rmbCurrency{\
	float:right;\
	margin: 7px 0 0 0;\
}\
#Lingmi_plugin #Lingmi_hor #Lingmi_currency{\
	margin: 0 0 0 750px;\
	top:14px;\
	height:16px;\
	font-size:12px;\
	color:white;\
	position:absolute;\
}\
#Lingmi_plugin #Lingmi_hor #Lingmi_like{\
	margin: 0 0 0 850px;\
	height:40px;\
	width:40px;\
	position:absolute;\
}\
#Lingmi_plugin #Lingmi_hor #Lingmi_loginInfo{\
	float:right;\
	height:20px;\
	top:13px;\
	right:10px;\
	position:relative;\
}\
#Lingmi_plugin #Lingmi_hor a{\
	text-decoration:underline;\
	color:black;\
}\
#Lingmi_plugin #Lingmi_hor li{\
	float:left;\
	width:3%;\
	height:40px;\
}\
#Lingmi_plugin #Lingmi_right{\
	width:9%;\
	height:30px;\
	position:absolute;\
	right:0px;\
	top:0px;\
	list-style:none;\
	z-index:10;\
}\
#Lingmi_plugin  li{\
	float:left;\
	width:20%;\
	height:300px;\
	z-index:5;\
	overflow:hidden;\
}\
#Lingmi_plugin .Lingmi_info{\
	width:12px;\
	margin-top:30px;\
	font-size:13px;\
	margin-left:25%;\
	color:white;\
}\
#Lingmi_left{\
	width:1.8%;\
	height:300px;\
	display:none;\
	position:absolute;\
	left:0px;\
	top:0px;\
	list-style:none;\
	z-index:10;\
}\
#Lingmi_left li{\
	width:100%;\
	height:300px;\
	float:left;\
}\
#Lingmi_plugin #Lingmi_content{\
	width:91%;\
	height:260px;\
	left:0px;\
	background-color:#BDB8B8;\
	position:absolute;\
}\
#Lingmi_contentIframe{\
	width:100%;\
	height:260px;\
	overflow:hidden;\
}\
#Lingmi_contentIframe_other{\
	width:100%;\
	height:300px;\
}\
#Lingmi_sizeAssistant{\
	width:38%;\
	height:100%;\
	left:5%;\
	background-color:#CFCFCF;\
	position:absolute;\
	overflow: hidden;\
}\
#Lingmi_featureSelect{\
	width:35%;\
	height:100%;\
	left:43%;\
	background-color:#F5F5F5;\
	position:absolute;\
}\
#Lingmi_infoTips{\
	width:22%;\
	height:100%;\
	left:78%;\
	background-color:#CFCFCF;\
	position:absolute;\
}\
#Lingmi_tip{\
	text-align:left;\
	line-height: 40px;\
	left: 10%;\
	float:left;\
	position: relative;\
	font-size: 80%;\
}\
#Lingmi_light_word{\
	font-size: 90%;\
	color: #969696;\
}\
.Lingmi_warn{\
	color: red;\
}\
#Lingmi_featureSelect_left{\
	float:left;\
	width: 55%;\
	height: 100%;\
	font-size: 80%;\
}\
.Lingmi_featureSelect_right{\
	float:right;\
	width: 43%;\
	height: 100%;\
	font-size: 80%;\
	text-align: center;\
}\
#Lingmi_featureSelect_all\
{\
	width: 99%;\
	height: 100%;\
	left: 5%;\
	top:5%;\
	position: relative;\
}\
#Lingmi_featureSelect_all div\
{\
	height:30px;\
	text-align: left;\
}\
.Lingmi_proPrice{\
	margin-top: 35%;\
}\
.Lingmi_button_putCart{\
	margin-top:10%;\
	width: 65%;\
	height: 40px;\
	color: white;\
	background-color: red;\
*display: inline;\
	font: 16px/100%  Helvetica, Arial, sans-serif;\
	-webkit-border-radius: 5em;\
	-moz-border-radius: 5em;\
	text-shadow: 0 1px 1px rgba(0,0,0,0.3);\
	-webkit-box-shadow: 0 1px 2px rgba(0,0,0,0.2);\
	-moz-box-shadow: 0 1px 2px rgba(0,0,0,0.2);\
	box-shadow: 0 1px 2px rgba(0,0,0,0.2);\
}\
.Lingmi_button_putCart_td{\
	text-align: center;\
}\
#Lingmi_proSize , #Lingmi_proDiscount{\
	width: 60%;\
}\
.Lingmi_prodQty_reduce , .Lingmi_prodQty_add {\
	cursor:pointer;\
}\
.Lingmi_favourInfo{\
	padding: 0px 0px;\
	width: 200px;\
}\
.Lingmi_weight_input{\
	width:55px;\
}\
input , input[type=text] ,select{\
	padding-left :0px;\
	height:20px;\
	font-weight:100;\
	font-size:10px;\
	line-height:normal;\
}\
input[type = button]{\
	weight:20px;\
}\
label, legend{\
	display: inline;\
}\
dd, dl, dt, li, ol, ul{\
	margin: 0px 0px;\
}\
#Lingmi_translation_main{\
	width:300px;\
	position:absolute;\
	left:0;\
	top:0;\
	z-index:999999;\
	background:#fff;\
	border:1px solid #C3C3C3;\
	border-radius:5px;\
	overflow:hidden;\
}\
#Lingmi_translation_bar{\
	height:24px;\
	line-height:24px;\
	color:#fff;\
	padding:0 8px;\
	background: url('../../images/plugin/img/translation_back.gif');\
}\
#Lingmi_translation_bar i{\
	display:block;\
	float:left;\
	width:18px;\
	height:18px;\
	margin-top:3px;\
	background: url('../../images/plugin/img/translation_back.gif') -106px -24px no-repeat;\
}\
#Lingmi_translation_bar a{\
	display:block;\
	float:right;\
	width:18px;\
	height:18px;\
	margin-top:3px;\
	background: url('../../images/plugin/img/translation_back.gif') -52px -41px no-repeat;\
	cursor:pointer;\
}\
#Lingmi_translation_bar a:hover{\
	background-position:-70px -41px;\
}\
#Lingmi_translation_bar h2{\
	color:#fff;\
	font-size:12px;\
	font-weight:normal;\
	padding:0;\
	margin:0;\
	line-height:24px;\
	margin-left:20px;\
}\
#Lingmi_translation_content{\
	padding:8px;\
	font-size:12px;\
	line-height:20px;\
}\
#Lingmi_translation_content .icIBahyI-dictbar{\
	padding-bottom:5px;\
}\
#Lingmi_translation_content .icIBahyI-fl strong{\
	color:#999;\
}\
#Lingmi_translation_content .icIBahyI-new_word{\
	display:none;\
}\
#Lingmi_translation_content .icIBahyI-simple label{\
	font-weight:normal;\
}\
#Lingmi_translation_content .icIBahyI-footer{\
	text-align:right;\
}\
#Lingmi_translation_content .icIBahyI-footer a{\
	color:#0066C0;\
	font-size:12px;\
}\
#Lingmi_translation_content .icIBahyI-footer a:hover{\
	color:#E47911;\
}\
#maskBackground {\
	height: 100%;\
	width: 100%;\
	left: 0px;\
	top: 0px;\
	position: fixed;\
	background: rgb(0, 0, 0);\
	opacity: 0.25;\
	z-index: 100006;\
	display: none;\
}\
#Lingmi_search_tip_main{position:absolute;left:0px;top:0px;z-index:99999;padding:6px 10px;color:#000;font-size:12px;font-weight:normal;background:#fff;border:2px solid #09A9D3;border-radius:5px;opacity:.8;filter:alpha(opacity=80);display:none;}\
#Lingmi_search_tip_main:before{content:'';position:absolute;left:30px;top:100%;z-index:1;width:0;height:0;border-top:8px solid #fff;border-left:2px solid transparent;border-right:8px solid transparent;}\
#Lingmi_search_tip_main:after{content:'';position:absolute;left:28px;top:100%;z-index:0;width:0;height:0;border-top:11px solid #09A9D3;border-left:3px solid transparent;border-right:12px solid transparent;}\
#Lingmi_search_tip_main.Lingmi_search_down_ico:before{top:-8px;border-top:0;border-bottom:8px solid #fff;}\
#Lingmi_search_tip_main.Lingmi_search_down_ico:after{top:-11px;border-top:0;border-bottom:11px solid #09A9D3;}\
#Lingmi_translate_result_main{position:absolute;left:0px;top:0px;z-index:99999;padding:6px 10px;background:#fff;border:2px solid #09A9D3;border-radius:5px;opacity:.8;filter:alpha(opacity=80);cursor:pointer;display:none;}\
#Lingmi_translate_result_main:before{content:'';position:absolute;left:30px;top:100%;z-index:1;width:0;height:0;border-top:8px solid #fff;border-left:2px solid transparent;border-right:8px solid transparent;}\
#Lingmi_translate_result_main:after{content:'';position:absolute;left:28px;top:100%;z-index:0;width:0;height:0;border-top:11px solid #09A9D3;border-left:3px solid transparent;border-right:12px solid transparent;}\
#Lingmi_translate_result_main.Lingmi_search_down_ico:before{top:-8px;border-top:0;border-bottom:8px solid #fff;}\
#Lingmi_translate_result_main.Lingmi_search_down_ico:after{top:-11px;border-top:0;border-bottom:11px solid #09A9D3;}\
#Lingmi_translate_result_main span{color:#000;font-size:12px;font-weight:bold;}\
#Lingmi_translate_result_main font{margin-left:10px;font-size:12px;color:#0066C0;font-weight:normal;}\
</style>";







//弹出窗口
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
						'</div>'+
					'</div>';
//订单提交成功窗口

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