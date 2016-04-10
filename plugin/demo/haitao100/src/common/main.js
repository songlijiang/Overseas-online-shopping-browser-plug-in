function MyExtension() {
    var _this = this;
	this.user_id = 0;//用户id
	
	//插件初始化方法
	this.init = function(){
		_this.click_event();
		_this.get_user_id();
		_this.get_exchange_rate();
		//每5000毫秒获取订单状态并更新插件按钮状态
		_this.update_browser_button();
		var order_state_timer = setInterval(function(){
			_this.update_browser_button();
		},5000);
	}
	
	//设置插件点击事件
	this.click_event = function(){
		kango.ui.browserButton.setPopup({url:'popup.html', width:480, height:320});
	}
	
	//获取用户id
	this.get_user_id = function(){
		_this.user_id = kango.storage.getItem('user_id');
		if(_this.user_id==null){
			var details = {
				url: PluginConf.get_interface_file('create_user'),
				method: 'GET',
				async: false,
				contentType: 'json'
			};
			kango.xhr.send(details, function(data) {
				if (data.status == 200 && data.response != null) {
					var result_obj = data.response;
					var status = result_obj.status;
					if(status==1){
						var message = result_obj.message;
						var attach = result_obj.attach;
						_this.user_id = attach.user_id;
						kango.storage.setItem('user_id',_this.user_id);
					}
				}else { // something went wrong
					
				}
			});
		}
	}
	
	//获取订单状态并更新插件按钮状态
	this.update_browser_button = function(){
		var details = {
			url: PluginConf.get_interface_file('get_order_state',{'user_id':_this.user_id}),
			method: 'GET',
			async: true,
			contentType: 'text'
		};
		kango.xhr.send(details, function(data) {
			//kango.console.log(data.response);
			if (data.status == 200 && data.response != null) {
				try{
					var result_obj = eval('('+data.response+')');
					var status = result_obj.status;
					if(status==1){
						var message = result_obj.message;
						var attach = result_obj.attach;
						var msg_count = attach.msg_count;
						if(msg_count>0){
							kango.ui.browserButton.setTooltipText(message);
						}else{
							kango.ui.browserButton.setTooltipText('海淘100助手');
						}
						kango.ui.browserButton.setIcon('icons/icon16.png');
						kango.ui.browserButton.setBadgeValue(msg_count);
						kango.storage.setItem('msg_count', msg_count);
					}
				}catch(e){
					var err_msg = 'An error has occurred! error name:'+e.name+',error message:'+e.message;
					kango.console.log(err_msg);
					return;
				}
			}else { // something went wrong
				
			}
		});
	}
	
	//获取当前汇率
	this.get_exchange_rate = function(){
		//获取美元汇率（因为可能页面载入时就会用到，所以用同步获取）
		var details = {
			url: PluginConf.get_interface_file('get_exchange_rate',{'from':'USD','to':'CNY'}),
			method: 'GET',
			async: false,
			contentType: 'text'
		};
		kango.xhr.send(details, function(data) {
			var exchange_rate = 6.2584;
			if (data.status == 200 && data.response != null) {
				if(data.response!=''){
					exchange_rate = data.response;
				}
				//kango.console.log(exchange_rate);
			}
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
				if(data.response!=''){
					euro_rate = data.response;
				}
				//kango.console.log(euro_rate);
			}
			kango.storage.setItem('euro_rate', euro_rate);
		});
		
		//获取英镑汇率
		var details = {
			url: PluginConf.get_interface_file('get_exchange_rate',{'from':'GBP','to':'CNY'}),
			method: 'GET',
			async: true,
			contentType: 'text'
		};
		kango.xhr.send(details, function(data) {
			var pound_rate = 9.6595;
			if (data.status == 200 && data.response != null) {
				if(data.response!=''){
					pound_rate = data.response;
				}
				//kango.console.log(pound_rate);
			}
			kango.storage.setItem('pound_rate', pound_rate);
		});
		
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
				if(data.response!=''){
					jpy_rate = data.response;
				}
				//kango.console.log(jpy_rate);
			}else { // something went wrong
				
			}
			kango.storage.setItem('jpy_rate', jpy_rate);
		});
	}
}

var extension = new MyExtension();
extension.init();