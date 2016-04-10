var extension = new PopupExtension();
var _this = extension.get_this();

//相关配置
extension.exchange_rate = 0;
extension.euro_rate = 0;
extension.pound_rate = 0;
extension.jpy_rate = 0;
extension.lb_rate = 0.4535;
extension.oz_rate = 0.0283;
extension.ct_rate = 0.0002;
extension.cm_rate = 0.01;
extension.in_rate = 0.0254;
extension.ft_rate = 0.3048;

//页面初始化
extension.content_init = function(){
	this.load_exchange_rate();
}

//绑定事件
extension.bind_event = function(){
	//切换海淘应用
	$("#haitao_app_tools li").click(function(){
		$("#haitao_app_tools li").removeClass('current_tab');
		$(this).addClass('current_tab');
		var this_id = this.id;
		var window_id = this_id+'_window';
		$("#popup_content_main .haitao_app_window").hide();
		$('#'+window_id).show();
	});
	//切换尺码对照
	$("#size_convert_window #people_class li").click(function(){
		$("#size_convert_window #people_class li").removeClass('current_tab');
		$(this).addClass('current_tab');
		var this_id = this.id;
		$("#size_convert_window .clothing_class").hide();
		var clothing_class =  $("#"+this_id+"_class").show();
		clothing_class.find(".current_tab").click();
	});
	$("#size_convert_window .clothing_class li").click(function(){
		var parent_id = $(this).parent().attr('id');
		$("#size_convert_window #"+parent_id+" li").removeClass('current_tab');
		$(this).addClass('current_tab');
		var show_table = $(this).attr('show_table');
		$("#size_convert_window .haitao_size_table").hide();
		$('#'+show_table).show();
	});
	
	//绑定计算汇率事件
	$("#rmb_value").keyup(function(){
		var rmb_value = parseFloat($(this).val());
		if(isNaN(rmb_value)){
			rmb_value = 0;
		}
		$("#dollar_value").val(Math.round(rmb_value/_this.exchange_rate*100)/100);
		$("#euro_value").val(Math.round(rmb_value/_this.euro_rate*100)/100);
		$("#pound_value").val(Math.round(rmb_value/_this.pound_rate*100)/100);
		$("#jpy_value").val(Math.round(rmb_value/_this.jpy_rate*100)/100);
	});
	$("#dollar_value").keyup(function(){
		var dollar_value = parseFloat($(this).val());
		if(isNaN(dollar_value)){
			dollar_value = 0;
		}
		$("#rmb_value").val(Math.round(dollar_value*_this.exchange_rate*100)/100);
		$("#euro_value").val(Math.round(dollar_value*_this.exchange_rate/_this.euro_rate*100)/100);
		$("#pound_value").val(Math.round(dollar_value*_this.exchange_rate/_this.pound_rate*100)/100);
		$("#jpy_value").val(Math.round(dollar_value*_this.exchange_rate/_this.jpy_rate*100)/100);
	});
	$("#euro_value").keyup(function(){
		var euro_value = parseFloat($(this).val());
		if(isNaN(euro_value)){
			euro_value = 0;
		}
		$("#rmb_value").val(Math.round(euro_value*_this.euro_rate*100)/100);
		$("#dollar_value").val(Math.round(euro_value*_this.euro_rate/_this.exchange_rate*100)/100);
		$("#pound_value").val(Math.round(euro_value*_this.euro_rate/_this.pound_rate*100)/100);
		$("#jpy_value").val(Math.round(euro_value*_this.euro_rate/_this.jpy_rate*100)/100);
	});
	$("#pound_value").keyup(function(){
		var pound_value = parseFloat($(this).val());
		if(isNaN(pound_value)){
			pound_value = 0;
		}
		$("#rmb_value").val(Math.round(pound_value*_this.pound_rate*100)/100);
		$("#dollar_value").val(Math.round(pound_value*_this.pound_rate/_this.exchange_rate*100)/100);
		$("#euro_value").val(Math.round(pound_value*_this.pound_rate/_this.euro_rate*100)/100);
		$("#jpy_value").val(Math.round(pound_value*_this.pound_rate/_this.jpy_rate*100)/100);
	});
	$("#jpy_value").keyup(function(){
		var jpy_value = parseFloat($(this).val());
		if(isNaN(jpy_value)){
			jpy_value = 0;
		}
		$("#rmb_value").val(Math.round(jpy_value*_this.jpy_rate*100)/100);
		$("#dollar_value").val(Math.round(jpy_value*_this.jpy_rate/_this.exchange_rate*100)/100);
		$("#euro_value").val(Math.round(jpy_value*_this.jpy_rate/_this.euro_rate*100)/100);
		$("#pound_value").val(Math.round(jpy_value*_this.jpy_rate/_this.pound_rate*100)/100);
	});
	
	//绑定计算重量事件
	$("#kg_value").keyup(function(){
		var kg_value = parseFloat($(this).val());
		if(isNaN(kg_value)){
			kg_value = 0;
		}
		$("#lb_value").val(Math.round(kg_value/_this.lb_rate*100)/100);
		$("#oz_value").val(Math.round(kg_value/_this.oz_rate*100)/100);
		$("#ct_value").val(Math.round(kg_value/_this.ct_rate*100)/100);
	});
	
	$("#lb_value").keyup(function(){
		var lb_value = parseFloat($(this).val());
		if(isNaN(lb_value)){
			lb_value = 0;
		}
		$("#kg_value").val(Math.round(lb_value*_this.lb_rate*100)/100);
		$("#oz_value").val(Math.round(lb_value*_this.lb_rate/_this.oz_rate*100)/100);
		$("#ct_value").val(Math.round(lb_value*_this.lb_rate/_this.ct_rate*100)/100);
	});
	$("#oz_value").keyup(function(){
		var oz_value = parseFloat($(this).val());
		if(isNaN(oz_value)){
			oz_value = 0;
		}
		$("#kg_value").val(Math.round(oz_value*_this.oz_rate*100)/100);
		$("#lb_value").val(Math.round(oz_value*_this.oz_rate/_this.lb_rate*100)/100);
		$("#ct_value").val(Math.round(oz_value*_this.oz_rate/_this.ct_rate*100)/100);
	});
	$("#ct_value").keyup(function(){
		var ct_value = parseFloat($(this).val());
		if(isNaN(ct_value)){
			ct_value = 0;
		}
		$("#kg_value").val(Math.round(ct_value*_this.ct_rate*100)/100);
		$("#lb_value").val(Math.round(ct_value*_this.ct_rate/_this.lb_rate*100)/100);
		$("#oz_value").val(Math.round(ct_value*_this.ct_rate/_this.oz_rate*100)/100);
	});
	
	//绑定计算长度事件
	$("#m_value").keyup(function(){
		var m_value = parseFloat($(this).val());
		if(isNaN(m_value)){
			m_value = 0;
		}
		$("#cm_value").val(Math.round(m_value/_this.cm_rate*100)/100);
		$("#in_value").val(Math.round(m_value/_this.in_rate*100)/100);
		$("#ft_value").val(Math.round(m_value/_this.ft_rate*100)/100);
	});
	$("#cm_value").keyup(function(){
		var cm_value = parseFloat($(this).val());
		if(isNaN(cm_value)){
			cm_value = 0;
		}
		$("#m_value").val(Math.round(cm_value*_this.cm_rate*100)/100);
		$("#in_value").val(Math.round(cm_value*_this.cm_rate/_this.in_rate*100)/100);
		$("#ft_value").val(Math.round(cm_value*_this.cm_rate/_this.ft_rate*100)/100);
	});
	$("#in_value").keyup(function(){
		var in_value = parseFloat($(this).val());
		if(isNaN(in_value)){
			in_value = 0;
		}
		$("#m_value").val(Math.round(in_value*_this.in_rate*100)/100);
		$("#cm_value").val(Math.round(in_value*_this.in_rate/_this.cm_rate*100)/100);
		$("#ft_value").val(Math.round(in_value*_this.in_rate/_this.ft_rate*100)/100);
	});
	$("#ft_value").keyup(function(){
		var ft_value = parseFloat($(this).val());
		if(isNaN(ft_value)){
			ft_value = 0;
		}
		$("#m_value").val(Math.round(ft_value*_this.ft_rate*100)/100);
		$("#cm_value").val(Math.round(ft_value*_this.ft_rate/_this.cm_rate*100)/100);
		$("#in_value").val(Math.round(ft_value*_this.ft_rate/_this.in_rate*100)/100);
	});
}

//加载汇率
extension.load_exchange_rate = function(){
	kango.invokeAsync('kango.storage.getItem', 'exchange_rate', function(data) {
		_this.exchange_rate = data;
		kango.invokeAsync('kango.storage.getItem', 'euro_rate', function(data) {
			_this.euro_rate = data;
			kango.invokeAsync('kango.storage.getItem', 'pound_rate', function(data) {
				_this.pound_rate = data;
				kango.invokeAsync('kango.storage.getItem', 'jpy_rate', function(data) {
					_this.jpy_rate = data;
					//显示汇率
					_this.show_rate();
				});
			});
		});
	});
}

//显示汇率
extension.show_rate = function(){
	$("#rmb_rate").text('1.0000');
	$("#dollar_rate").text(parseFloat(_this.exchange_rate).toFixed(4));
	$("#euro_rate").text(parseFloat(_this.euro_rate).toFixed(4));
	$("#pound_rate").text(parseFloat(_this.pound_rate).toFixed(4));
	$("#jpy_rate").text(parseFloat(_this.jpy_rate).toFixed(4));
}

extension.init();