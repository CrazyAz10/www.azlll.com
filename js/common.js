var sever_url = "http://localhost:8642";
// var sever_url = "";

function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
      time = parseInt(time)
    }
    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value] }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

/**
 * 
 * @param {*} msg 
 * Az消息弹窗
 */
function azMessage(msg) {
  this.createMessage = function(message) {
    var msDom = $(`<div class="az-message">${message}</div>`);
    $('body').append(msDom);
    msDom.animate({top: "50px"},300,'linear',() => {
      setTimeout(() => {
        if(msDom){
          msDom.animate({opacity: "0"},500,'linear',() => {
            this.removeMessage(msDom)
          })
        }
      },3000)
    })
    return msDom;
  }
  this.removeMessage = function(tag) {
    try{
      tag.remove()
    }
    catch {
      
    }
  }
  this.createMessage(msg)
}


/*
* fn [function] 需要防抖的函数
* delay [number] 毫秒，防抖期限值
*/
function debounce(fn,delay){
  let timer = null //借助闭包
  return function() {
      if(timer){
          clearTimeout(timer) //进入该分支语句，说明当前正在一个计时过程中，并且又触发了相同事件。所以要取消当前的计时，重新开始计时
          timer = setTimeout(fn,delay) 
      }else{
          timer = setTimeout(fn,delay) // 进入该分支说明当前并没有在计时，那么就开始一个计时
      }
  }
}