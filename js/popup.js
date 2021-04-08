
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
											Oli += `<li data-id="${item.id}">
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
	$("#Aztools616766349 .chunk-list").append(Odom)
	$("#Aztools616766349 .loading").hide();
}

// loaded
$(function(){
	
	getList();
	
})