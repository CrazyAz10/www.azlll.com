var dataList = [];
var formData = {
	search: "",
	createdAt: "",
	referer: "",
	page: 1,
	pageSize: 20,
}
var totalPage = 0;
var total = 0;

// 筛选过滤
function filterData() {
	formData.search = $('#searchText').val();
	formData.createdAt = $('#filterTime option:selected').val();
	formData.referer = $('#filterType option:selected').val();
	getList()
}

// 获取数据
function getList() {
	$("#Aztools616766349 .loading").show();
	AzAjax({
		url: sever_url + '/base_api/getArticle',
		type: 'get',
		dataType: 'json',
		data: formData
	}).then(res => {
		if(res.code === 200){
			dataList = res.data.list;
			totalPage = res.data.totalPage;
			total = res.data.total;
			formData.page = res.data.page;
			formData.pageSize = res.data.pageSize;
			if(formData.page >= totalPage){
				$('#Aztools616766349 .more-load').html('没有更多数据啦！')
			}
      if(dataList.length){
        rendDataList(dataList);
      }else{
        if(!total){
          $("#Aztools616766349 .chunk-list").html("<p style='text-align: center'>暂无数据!</p>")
        }
		    $("#Aztools616766349 .loading").hide();
      }
		}else{
			if(res.code == 405){
				linkToLogin()
				return;
			}
      formData.page = 1 ? formData.page = 1 : formData.page -= 1;
      // $("#Aztools616766349 .chunk-list").html("<p style='text-align: center'>暂无数据!</p>")
      $("#Aztools616766349 .loading").hide();
    }
		$('#Aztools616766349 .more-load').html('加载更多')
	},err => {
    formData.page = 1 ? formData.page = 1 : formData.page -= 1;
		$('#Aztools616766349 .more-load').html('加载更多')
		// $("#Aztools616766349 .chunk-list").html("<p style='text-align: center'>暂无数据!</p>")
		$("#Aztools616766349 .loading").hide();
	})
}

// 删除文章
function changeStatus(id) {
	AzAjax({
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
			// 删除节点
			$(`li[data-id=${id}]`).remove()
		}else {
			if(res.code == 405){
				linkToLogin()
				return;
			}
			azMessage(`文章id: ${id} 删除失败！`);
		}
	},err => {
		azMessage(`文章id: ${id} 删除失败！`);
	})
}

// 收藏文章
function changecollection(id) {
	AzAjax({
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
			$(`li[data-id=${id}]`).find('#collectionBtn').text('已收藏').attr('disabled',true)
		}else {
			$(`li[data-id=${id}]`).find('#collectionBtn').attr('disabled',false)
			if(res.code == 405){
				linkToLogin()
				return;
			}
			azMessage(`文章id: ${id} 收藏失败！`);
		}
	},err => {
		$(`li[data-id=${id}]`).find('#collectionBtn').attr('disabled',false)
		azMessage(`文章id: ${id} 收藏失败！`);
	})
}

// 取消收藏文章
function changecollection(id) {
	AzAjax({
		url: sever_url + '/base_api/updateArticle',
		type: 'post',
		dataType: 'json',
		data: {id,collection: 0}
	}).then(res => {
		if(res.code === 200){
			azMessage(`文章id: ${id} 已取消收藏！`);
			// 删除节点
			$(`li[data-id=${id}]`).remove()
		}else {
			if(res.code == 405){
				linkToLogin()
				return;
			}
			azMessage(`文章id: ${id} 取消收藏失败！`);
		}
	},err => {
		console.log(err)
		azMessage(`文章id: ${id} 取消收藏失败！`);
	})
}

// 查询
$("body").on('click','#searchTtn',function(e){
  formData.page = 1;
  $("#Aztools616766349 .chunk-list").html('')
  filterData();
})
// 刷新
$("body").on('click','#reload',function(e){
  formData.page = 1;
  $("#Aztools616766349 .chunk-list").html('')
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
})
// 取消收藏
$("body").on('click','#cancelCollectionBtn',function(e){
  $(e.currentTarget).attr('disabled',true);
  changecollection($(e.currentTarget).data('id'));
  setTimeout(()=>{
    $(e.currentTarget).attr('disabled',false);
  },2000)
})
// 加载更多
$("body").on('click','.more-load',function(e){
  if($(e.currentTarget).html() == '加载更多'){
    $(e.currentTarget).html('加载中...');
    formData.page += 1;
    filterData();
  }
  return;
})