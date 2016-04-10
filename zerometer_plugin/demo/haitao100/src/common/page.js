function pluginPage(page_options){
	//获取当前对象
	var _this = this;
	
	//默认配置
	this.options = {
		'record_count':1,//默认总的记录条数
		'page_size':10,//默认每页显示10条数据
		'page':1,//默认当前页数
		'page_num':5//默认最多显示的分页数字个数
	};
	//应用自定义配置
	if(typeof(page_options)=='object'){
		for(var key in page_options){
			if(page_options.hasOwnProperty(key)){
				_this.options[key] = page_options[key];
			}
		}
	}
	this.get_page = function(){
		var page_html = '';
		var page_count = Math.ceil(parseFloat(_this.options.record_count)/_this.options.page_size);//获取页数
		var step = parseFloat(_this.options.page_num)/2;//显示页数的一半，用作程序判断
		var pre_page = (_this.options.page-1)>0?(_this.options.page-1):1;//上一页
		var next_page = (_this.options.page+1)<page_count?(_this.options.page+1):page_count;//下一页
		
		/****分页容器****/
		page_html += '<div id="plugin_page">';
		
		/****上一页****/
		if(_this.options.page<=1){
			page_html += '<span id="pre_page">上一页</span>';
		}else{
			page_html += '<a id="pre_page" href="javascript:;" page="'+pre_page+'">上一页</a>';
		}
		
		/****分页数字****/
		if(_this.options.page<=step){
			var page_end = Math.min(this.options.page_num,page_count);
			for(var i=1;i<=page_end;i++){
				if(i==_this.options.page){
					page_html += '<span id="current_page">'+i+'</span>';
				}else{
					page_html += '<a href="javascript:;" page="'+i+'" class="page_num">'+i+'</a>';
				}
			}
		}else if(_this.options.page>=page_count-step){
			var page_start = Math.max(page_count-_this.options.page_num+1,1);
			for(var i=page_start;i<=page_count;i++){
				if(i==_this.options.page){
					page_html += '<span id="current_page">'+i+'</span>';
				}else{
					page_html += '<a href="javascript:;" page="'+i+'" class="page_num">'+i+'</a>';
				}
			}
		}else{
			var page_start = Math.floor(_this.options.page-step+1);
			var page_end = page_start + _this.options.page_num;
			for(var i=page_start;i<page_end;i++){
				if(i==_this.options.page){
					page_html += '<span id="current_page">'+i+'</span>';
				}else{
					page_html += '<a href="javascript:;" page="'+i+'" class="page_num">'+i+'</a>';
				}
			}
		}
		/****分页数字****/
		
		/****下一页****/
		if(_this.options.page>=page_count){
			page_html += '<span id="next_page">下一页</span>';
		}else{
			page_html += '<a id="next_page" href="javascript:;" page="'+next_page+'">下一页</a>';
		}
		
		page_html += '</div>';
		return page_html;
	}
}