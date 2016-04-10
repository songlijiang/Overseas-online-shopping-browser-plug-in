// ==UserScript==
// @name Sina Script
// @namespace sina
// @include ^http://service.weibo.com/
// @require jquery.js
// @require config.js
// ==/UserScript==

function getQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = window.location.search.substr(1).match(reg);
	if (r != null) return unescape(r[2]); return null;
} 

//绑定分享按钮
$('#shareIt').click(function(){
	//获取订单id
	var order_id = getQueryString('order_id');
	if(order_id){
		//更新订单状态为已分享
		var details = {
			url: PluginConf.get_interface_file('transport_order_share'),
			method: 'POST',
			async: false,
			params: {'order_id':order_id},
			contentType: 'json'
		};
		kango.xhr.send(details, function(data) {
			if (data.status == 200 && data.response != null) {
				var result_obj = data.response;
				var status = result_obj.status;
				if(status==1){
					
				}else{
					alert(result_obj.message);
				}
			}else { // something went wrong
				
			}
		});
	}
});