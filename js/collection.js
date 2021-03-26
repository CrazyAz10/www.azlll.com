
var dataList = [];
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
																<p class="title"><a href="${item.mediumUrl}" target="_blank">${item.title}</a></p>
																<p class="subtitle">${item.subtitle}</p>
																<p class="createdAt clear">${item.createdAt}<button class="fr az-btn dange" id="deleteBtn" data-id="${item.id}">删除</button><button class="fr az-btn primary" id="cancelCollectionBtn" data-id="${item.id}">取消收藏</button></p>
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
		data: {collection: 1}
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

// 收藏文章
function changecollection(id) {
	$.ajax({
		url: sever_url + '/base_api/updateArticle',
		type: 'post',
		dataType: 'json',
		data: {id,collection: 0}
	}).then(res => {
		if(res.code === 200){
			azMessage(`文章id: ${id} 已取消收藏！`);
			// 从新渲染数据
			getList();
		}else {
			azMessage(`文章id: ${id} 取消收藏失败！`);
		}
	},err => {
		console.log(err)
		azMessage(`文章id: ${id} 取消收藏失败！`);
	})
}

// loaded
$(function(){
	
	getList();
  // 刷新
	$("#Aztools616766349 #reload").click(function(){
		getList();
	})
  // 取消收藏
	$("body").on('click','#cancelCollectionBtn',function(e){
		$(e.currentTarget).attr('disabled',true);
		changecollection($(e.currentTarget).data('id'));
		setTimeout(()=>{
			$(e.currentTarget).attr('disabled',false);
		},2000)
	})
})