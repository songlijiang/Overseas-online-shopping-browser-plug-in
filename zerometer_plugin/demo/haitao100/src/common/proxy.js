/*
��ȡ��������ƿ��ܵ�ֵ firefox,chrome,safari,ie
*/
function WebProxy(){
	var _this = this;
	
	//���ô���
	this.set_proxy = function(callback){
		var proxy_site_obj = kango.storage.getItem('proxy_site_obj');
		var browserName = kango.browser.getName();
		if(browserName=='chrome'){
			var proxy_config = {
				mode: "pac_script",
				pacScript: {
					data: _this.get_pacScript(proxy_site_obj)
				}
			};
			chrome.proxy.settings.set(
				{value:proxy_config,scope:'regular'},
				function(){
					//ִ�лص��¼�
					if(typeof(callback)!="undefined"){
						callback();
					}
				}
			);
		}else if(browserName=='firefox'){
			//ִ�лص��¼�
			if(typeof(callback)!="undefined"){
				callback();
			}
		}
	}
	
	//ȡ������
	this.clear_proxy = function(){
		var browserName = kango.browser.getName();
		if(browserName=='chrome'){
			chrome.proxy.settings.clear({});
		}
	}
	
	//��ȡ��ǰ����
	this.get_proxy = function(){
		var browserName = kango.browser.getName();
		if(browserName=='chrome'){
			chrome.proxy.settings.get(
				{'incognito': false},
				function(config){
					//kango.console.log(JSON.stringify(config));
				}
			);
		}
	}
	
	//��ȡ����pacScript�ļ�
	this.get_pacScript = function(proxy_site_obj){
		var proxy_domin_arr = new Array();
		for(var key in proxy_site_obj){
			if(proxy_site_obj.hasOwnProperty(key)){
				var site_domin = proxy_site_obj[key];
				var tmp_arr = site_domin.split(',');
				for(var i=0;i<tmp_arr.length;i++){
					proxy_domin_arr.push(tmp_arr[i].replace(/\/$/,''));
				}
			}
		}
		var host_condition = '';
		var domin_length = proxy_domin_arr.length;
		if(domin_length>0){
			for(var j=0;j<domin_length>0;j++){
				host_condition += 'shExpMatch(host,"'+proxy_domin_arr[j]+'")||';
			}
			host_condition = 'if('+host_condition.replace(/\|\|$/,'')+')return "HTTPS usa1.y700.com:8080;HTTPS usa2.y700.com:8080";';
		}
		var pacScript = 'function FindProxyForURL(url,host){if(isPlainHostName(host)||shExpMatch(host,"*.localhost")||isInNet(dnsResolve(host),"10.0.0.0","255.0.0.0")||isInNet(dnsResolve(host),"172.16.0.0","255.240.0.0")||isInNet(dnsResolve(host),"192.168.0.0","255.255.0.0")||isInNet(dnsResolve(host),"127.0.0.0","255.255.255.0"))return"DIRECT";'+host_condition+'return "DIRECT";}';
		kango.console.log(pacScript);
		return pacScript;
	}
}