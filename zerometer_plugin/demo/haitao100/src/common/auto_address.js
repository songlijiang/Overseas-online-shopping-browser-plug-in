// ==UserScript==
// @name auto_address Script
// @namespace auto_address
// @include *
// @all-frames true
// @require jquery.js
// @require config.js
// ==/UserScript==

function AutoAddress(){
	var _this = this;
	
	this.name_key = ['name'];
	this.phone_key = ['phone','tel'];
	this.address1_key = ['address1','addr1','addressline1','addrline1','street'];
	this.address2_key = ['address2','addr2','addressline2','addrline2'];
	this.city_key = ['city'];
	this.state_key = ['state','province','region'];
	this.country_key = ['country'];
	this.zip_key = ['zip','postal'];
	
	this.name_obj = null;
	this.phone_obj_arr = new Array();
	this.address1_obj = null;
	this.address2_obj = null;
	this.city_obj = null;
	this.state_obj = null;
	this.country_obj = null;
	this.zip_obj = null;
	
	this.country_address = '';
	this.province_address = '';
	this.province_address_ab = '';
	this.city_address = '';
	this.street_address = '';
	this.apartment_address = '';
	this.address_mobile = '';
	this.zip_code = '';
	this.user_name = '';
	
	//插件初始化
	this.init = function(){
		//添加监听后台消息的监听器
		kango.addMessageListener('auto_address_info', function(event){
			// event.data - the data sent with message
			var message_data = event.data;
			var auto_address_id = message_data.auto_address_id;
			if(typeof(auto_address_id)!='undefined' && auto_address_id>0){
				//准备待赋值的元素
				_this.get_address_elem();
				
				//获取转运地址详情
				var details = {
					url: PluginConf.get_interface_file('get_transport_address',{'address_id':auto_address_id}),
					method: 'GET',
					async: true,
					contentType: 'json'
				};
				kango.xhr.send(details, function(data) {
					if (data.status == 200 && data.response != null) {
						var transport_address_obj = data.response;
						if(transport_address_obj.status==1){
							var address_arr = transport_address_obj.attach;
							_this.country_address = address_arr.country_address;
							_this.province_address = address_arr.province_address;
							_this.province_address_ab = address_arr.province_address_ab;
							_this.city_address = address_arr.city_address;
							_this.street_address = address_arr.street_address;
							_this.apartment_address = address_arr.apartment_address;
							_this.address_mobile = address_arr.address_mobile;
							_this.zip_code = address_arr.zip_code;
							
							//自动加载地址
							_this.set_country_address();
							_this.set_province_address();
							_this.set_city_address();
							_this.set_street_address();
							_this.set_apartment_address();
							_this.set_address_mobile();
							_this.set_zip_code();
						}
					}else { // something went wrong
						
					}
				});
				
				//获取用户id
				kango.invokeAsync('kango.storage.getItem', 'user_id', function(user_id){
					//获取用户收货地址
					var details = {
						url: PluginConf.get_interface_file('get_user_address',{'user_id':user_id}),
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
								if(address_arr.user_name){
									_this.user_name = address_arr.user_name;
									_this.set_user_name();
								}
							}
						}
					});
				});
			}
		});
	}
	
	//判断字符串是否包含数组中的元素
	this.in_array = function(str,arr){
		str = str.toLowerCase();
		for(var i=0,len=arr.length;i<len;i++){
			if(str.indexOf(arr[i])>=0){
				return true;
			}
		}
		return false;
	}
	
	//获取页面上跟地址有关的元素
	this.get_address_elem = function(){
		$('select').each(function(){
			var elem_id = this.id;
			if(elem_id){
				if(!_this.state_obj&&_this.in_array(elem_id,_this.state_key)){
					_this.state_obj = $(this);
				}
				if(!_this.country_obj&&_this.in_array(elem_id,_this.country_key)){
					_this.country_obj = $(this);
				}
			}
			
			var elem_name = $(this).attr('name');
			if(elem_name){
				if(!_this.state_obj&&_this.in_array(elem_name,_this.state_key)){
					_this.state_obj = $(this);
				}
				if(!_this.country_obj&&_this.in_array(elem_name,_this.country_key)){
					_this.country_obj = $(this);
				}
			}
		});
		$('input').each(function(){
			var elem_type = $(this).attr('type');
			if(elem_type!='text' && elem_type!='tel' &&elem_type!='')return;
			var elem_id = this.id;
			if(elem_id){
				if(!_this.name_obj&&_this.in_array(elem_id,_this.name_key)){
					_this.name_obj = $(this);
				}
				if(_this.phone_obj_arr.length<3&&_this.in_array(elem_id,_this.phone_key)){
					if(!_this.phone_obj_exists($(this))){
						_this.phone_obj_arr.push($(this));
					}
				}
				if(!_this.address1_obj&&_this.in_array(elem_id,_this.address1_key)){
					_this.address1_obj = $(this);
				}
				if(!_this.address2_obj&&_this.in_array(elem_id,_this.address2_key)){
					_this.address2_obj = $(this);
				}
				if(!_this.city_obj&&_this.in_array(elem_id,_this.city_key)){
					_this.city_obj = $(this);
				}
				if(!_this.state_obj&&_this.in_array(elem_id,_this.state_key)){
					_this.state_obj = $(this);
				}
				if(!_this.country_obj&&_this.in_array(elem_id,_this.country_key)){
					_this.country_obj = $(this);
				}
				if(!_this.zip_obj&&_this.in_array(elem_id,_this.zip_key)){
					_this.zip_obj = $(this);
				}
			}
			
			var elem_name = $(this).attr('name');
			if(elem_name){
				if(!_this.name_obj&&_this.in_array(elem_name,_this.name_key)){
					_this.name_obj = $(this);
				}
				if(_this.phone_obj_arr.length<3&&_this.in_array(elem_name,_this.phone_key)){
					if(!_this.phone_obj_exists($(this))){
						_this.phone_obj_arr.push($(this));
					}
				}
				if(!_this.address1_obj&&_this.in_array(elem_name,_this.address1_key)){
					_this.address1_obj = $(this);
				}
				if(!_this.address2_obj&&_this.in_array(elem_name,_this.address2_key)){
					_this.address2_obj = $(this);
				}
				if(!_this.city_obj&&_this.in_array(elem_name,_this.city_key)){
					_this.city_obj = $(this);
				}
				if(!_this.state_obj&&_this.in_array(elem_name,_this.state_key)){
					_this.state_obj = $(this);
				}
				if(!_this.country_obj&&_this.in_array(elem_name,_this.country_key)){
					_this.country_obj = $(this);
				}
				if(!_this.zip_obj&&_this.in_array(elem_name,_this.zip_key)){
					_this.zip_obj = $(this);
				}
			}
		});
	}
	
	//设置国家地址
	this.set_country_address = function(){
		if(_this.country_obj){
			var tag_name = _this.country_obj[0].tagName;
			if(tag_name.toLowerCase()==='input'){
				_this.country_obj.val(_this.country_address);
			}else if(tag_name.toLowerCase()==='select'){
				_this.country_obj.find('option').filter(function(){
					return $.trim($(this).text()).toLowerCase()===_this.country_address.toLowerCase();
				}).attr('selected',true);
			}
		}
		_this.country_obj = null;
	}
	
	//设置省份地址
	this.set_province_address = function(){
		if(_this.state_obj){
			var tag_name = _this.state_obj[0].tagName;
			if(tag_name.toLowerCase()==='input'){
				_this.state_obj.val(_this.province_address);
			}else if(tag_name.toLowerCase()==='select'){
				_this.state_obj.find('option').filter(function(){
					var option_text = $.trim($(this).text()).toLowerCase();
					return option_text===_this.province_address.toLowerCase() || option_text===_this.province_address_ab.toLowerCase();
				}).attr('selected',true);
			}
		}
		_this.state_obj = null;
	}
	
	//设置城市地址
	this.set_city_address = function(){
		if(_this.city_obj){
			_this.city_obj.val(_this.city_address);
		}
		_this.city_obj = null;
	}
	
	//设置街道地址
	this.set_street_address = function(){
		if(_this.address1_obj){
			_this.address1_obj.val(_this.street_address);
		}
		_this.address1_obj = null;
	}
	
	//设置公寓地址
	this.set_apartment_address = function(){
		if(_this.address2_obj){
			_this.address2_obj.val(_this.apartment_address);
		}
		_this.address2_obj = null;
	}
	
	//设置手机号码
	this.set_address_mobile = function(){
		var phone_length = _this.phone_obj_arr.length;
		if(phone_length>0){
			if(phone_length<3){
				_this.phone_obj_arr[0].val(_this.address_mobile);
			}else{
				var address_mobile_arr = _this.address_mobile.split('-');
				for(var i=0;i<phone_length;i++){
					_this.phone_obj_arr[i].val(address_mobile_arr[i]);
				}
			}
		}
		_this.phone_obj_arr = [];
	}
	
	//设置邮编
	this.set_zip_code = function(){
		if(_this.zip_obj){
			_this.zip_obj.val(_this.zip_code);
		}
		_this.zip_obj = null;
	}
	
	//设置收货人姓名
	this.set_user_name = function(){
		if(_this.name_obj){
			_this.name_obj.val(_this.user_name);
		}
		_this.name_obj = null;
	}
	
	//检测手机元素对象是否存在
	this.phone_obj_exists = function(phone_obj){
		for(var i=0;i<_this.phone_obj_arr.length;i++){
			if(_this.phone_obj_arr[i][0]==phone_obj[0]){
				return true;
			}
		}
		return false;
	}
}

var auto_address = new AutoAddress();
auto_address.init();