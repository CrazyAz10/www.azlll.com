var dataList = [];

// 筛选过滤
function filterData() {
	var text = $('#searchText').val();
	var time = $('#filterTime option:selected').val();
	var type = $('#filterType option:selected').val();
	if(type == 'all'){
		type = new RegExp(/.*/)
	}else if(type == 'noTwitter'){
		type = /^((?!twitter).)+$/img
	}else{
		type = new RegExp(type,'img')
	}
	var filterList = dataList.filter( d => {
		let t = new Date(d.createdAt);
		let t_ = t.getTime();
		let n_t = (new Date()).getTime();
		let reg = new RegExp(text,'img');
		let f_text = reg.test(d.title + ' ' + d.subtitle);
		let f_time;
		let t__;
		switch(time){
			case 't1':
				t__ = 1*24*60*60*1000;
				if( (n_t-t_) < t__){
					f_time = true;
				}
				break;
			case 't3':
				t__ = 3*24*60*60*1000;
				if( (n_t-t_) < t__){
					f_time = true;
				}
				break;
			case 't7':
				t__ = 7*24*60*60*1000;
				if( (n_t-t_) < t__){
					f_time = true;
				}
				break;
			default:
				f_time = true;
				break;
		}
		if(time == 'all'){

		}
		return  f_text && f_time
	})
	filterList = filterList.sort(function(a,b){
		let t1 = (new Date(a.createdAt)).getTime();
		let t2 = (new Date(b.createdAt)).getTime();
		return t2 - t1;
	})
	filterList = filterList.filter(d => {
		return type.test(d.referer)
	})
	rendDataList(filterList);
}

// 渲染数据
function rendDataList(data) {
	if(!data.length){
		$("#Aztools616766349 .chunk-list").html("<p style='text-align: center;line-height: 50px;'>暂无数据！</p>");
		$("#Aztools616766349 .loading").hide();
		return;
	}
	let Odom = `<div class="chunk">
								<ul>
								${
									(function(){
										let Oli = "";
										data.forEach(item => {
											Oli += `<li>
																<p class="author">${item.creator} <a class="referer" href="${item.referer}">${item.referer}</a></p>
																<p class="title"><a href="${item.mediumUrl}" target="_blank">${item.title}</a></p>
																<p class="subtitle">${item.subtitle}</p>
																<p class="createdAt clear">${parseTime(new Date(item.createdAt),'{y}-{m}-{d} {h}:{i}:{s}')}<button class="fr az-btn dange" id="deleteBtn" data-id="${item.id}">删除</button>${
																	(function() {
																		if(item.collection){
																			return `<button class="fr az-btn primary" id="collectionBtn" disabled data-id="${item.id}">已收藏</button>`
																		}else {
																			return `<button class="fr az-btn primary" id="collectionBtn" data-id="${item.id}">收藏</button>`
																		}
																	})()
																}</p>
															</li>`
										});
										return Oli
									})()
								}
								</ul>
							</div>`;
	$("#Aztools616766349 .chunk-list").html(Odom)
	$("#Aztools616766349 .loading").hide();
}

// 获取数据
function getList() {
	$("#Aztools616766349 .chunk-list").html("");
	$("#Aztools616766349 .loading").show();
	$.ajax({
		url: sever_url + '/base_api/getArticle',
		type: 'get',
		dataType: 'json',
		data: {}
	}).then(res => {
		if(res.code === 200){
			dataList = res.data;
      if(dataList.length){
        rendDataList(dataList);
      }else{
        $("#Aztools616766349 .chunk-list").html("<p style='text-align: center'>暂无数据!</p>")
		    $("#Aztools616766349 .loading").hide();
      }
		}else{
      $("#Aztools616766349 .chunk-list").html("<p style='text-align: center'>暂无数据!</p>")
      $("#Aztools616766349 .loading").hide();
    }
	},err => {
		console.log(err)
		$("#Aztools616766349 .chunk-list").html("<p style='text-align: center'>暂无数据!</p>")
		$("#Aztools616766349 .loading").hide();
	})
}

// 删除文章
function changeStatus(id) {
	$.ajax({
		url: sever_url + '/base_api/updateArticle',
		type: 'post',
		dataType: 'json',
		data: {id,deleteStatus: 1}
	}).then(res => {
		if(res.code === 200){
			azMessage(`文章id: ${id} 已删除！`);
			this.dataList = this.dataList.filter(d => {
				return d.id != id;
			})
			// 从新渲染数据
			filterData();
		}else {
			azMessage(`文章id: ${id} 删除失败！`);
		}
	},err => {
		console.log(err)
		azMessage(`文章id: ${id} 删除失败！`);
	})
}

// 收藏文章
function changecollection(id) {
	$.ajax({
		url: sever_url + '/base_api/updateArticle',
		type: 'post',
		dataType: 'json',
		data: {id,collection: 1}
	}).then(res => {
		if(res.code === 200){
			azMessage(`文章id: ${id} 已加入收藏！`);
			this.dataList = this.dataList.map(d => {
				if(d.id == id ){ d.collection = 1 }
				return d;
			})
			// 从新渲染数据
			filterData();
		}else {
			azMessage(`文章id: ${id} 收藏失败！`);
		}
	},err => {
		console.log(err)
		azMessage(`文章id: ${id} 收藏失败！`);
	})
}

// loaded
$(function(){
	
	getList();
	// 查询
	$("#Aztools616766349 #searchTtn").click(function(){
		filterData();
	})
	// 刷新
	$("#Aztools616766349 #reload").click(function(){
		getList();
	})
	// 删除
	$("body").on('click','#deleteBtn',function(e){
		$(e.currentTarget).attr('disabled',true);
		changeStatus($(e.currentTarget).data('id'));
		setTimeout(()=>{
			$(e.currentTarget).attr('disabled',false);
		},2000)
	})
	// 收藏
	$("body").on('click','#collectionBtn',function(e){
		$(e.currentTarget).attr('disabled',true);
		changecollection($(e.currentTarget).data('id'));
		setTimeout(()=>{
			$(e.currentTarget).attr('disabled',false);
		},2000)
	})
})