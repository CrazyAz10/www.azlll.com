
function verify() {
  var userName = $("#username").val();
  var password = $("#password").val();
  if(userName == "" || userName == ""){
    azMessage(`请输入用户名和密码！`);
    return;
  }else {
    login({userName,password})
  }
}

function login(data) {
  AzAjax({
    url: sever_url + '/base_api/login',
    type: 'post',
    dataType: 'json',
    data
  }).then(res => {
    if(res.code == 200){
      window.localStorage.setItem("az_token",res.data.token)
      window.location.href = "/"
    }else{
      azMessage(res.message);
    }
  },err => {
    azMessage(`请输入用户名和密码！`);
  })
}

$(function(){
  start();

  $('form').on('submit',function(evt){
    evt.preventDefault();
  })
  $('#loginBtn').on('click',debounce(verify,500))
})