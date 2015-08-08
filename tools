/**
 * ajax通用方法
 *
 * @parame setting: object;
 * @parame setting->type: 请求类型(POST/GET);
 * @parame setting->url: HTTP请求位置/api地址(http://api.xxx.com);
 * @parame setting->data: json格式的字符串,如果为空,请传入"";
 * @parame setting->success: 请求成功的回调执行;
 * @parame setting->error: 请求失败的回调执行;
 *
 **/ 
function ajax(setting){
	// 初始化参数
	setting = {
		type : setting.type.toUpperCase() || "GET",
		url : setting.url || "http://api.xxx.com",
		data : setting.data || "",
		success : setting.success || function(xhr){
			console.log("请求成功");
		},
		error : setting.error || function(xhr){
			console.log("请求失败");
		}
	}
	// 实例化XHR对象
	var xmlhttp = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
	// 响应过程中的相应操作
	xmlhttp.onreadystatechange = function(){
		if(xmlhttp.readyState == 4){
			var reponse = {
				code : xmlhttp.status,
				data : JSON.parse(xmlhttp.responseText)
			}
		}
		// 根据不同的状态码进行相关操作
		if(reponse){
			if(reponse.code == 200){
				setting.success(reponse.data)
			}else{
				setting.error(reponse.data)
			}
		}
	}
	// 创建请求
	xmlhttp.open(setting.type,setting.url,true);
	// 发送请求
	xmlhttp.send(setting.data);
}


/**
 * 获取url参数
 *
 * @parame name: 需要获取的参数名
 * @parame query: 自定义匹配域
 *
 **/
app.getUrl = function(name,query){
  var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)"),r;
  if(query){
    r = query.match(reg);
  }else{
    r = window.location.search.substr(1).match(reg);
  }
  if(r!=null)return  unescape(r[2]); return null;
}


/**
 * 浏览器浏览记录存储方法
 *
 **/
app.addHistory = function(query){
  if(history.pushState && query){
    history.pushState(null,document.title,query);
  }
}


/**
 * 浏览器历史记录跳转事件
 *
 * @parame ftn: 函数方法/回调函数
 *
 **/
app.historyTrigger = function(fun){
  if(history.pushState){
    window.addEventListener('popstate',function(){
      fun();
    })
  }
}


/**
 * 判断浏览器是否 IE8/9
 *
 * @parame num: IE版本号，空则全部
 *
 **/
app.isIE89 = function(num) {
  if(!num){
    return navigator.userAgent.indexOf("MSIE 8") > 0 || navigator.userAgent.indexOf("MSIE 9") > 0 ? true : false;
  }else{
    return navigator.userAgent.indexOf("MSIE "+num) > 0 ? true : false;
  }
}


/**
 * 正则匹配
 *
 **/
//验证 email
app.testEmail = function(str) {
  var reg = /\w{1,}[@][\w\-]{1,}([.]([\w\-]{1,})){1,3}$/;
  return reg.test(str);
}
//验证手机号码
app.testPhone = function(str) {
  if(str.length != 11){
    return false;
  }
  var reg = /^0?1[3|4|5|8][0-9]\d{8}$/;
  return reg.test(str);
}
//验证url
app.testURL = function(str) {
  str = str.toString().replace(/\/$/, '').replace(/^\//, '');
  var reg = /^(https|http|ftp|rtsp|mms):\/\/[^\/\.]+?\..+\w$/;
  return reg.test(str);
}
//字符串处理
app.trim = function(str, charlist) {

  var whitespace, l = 0,
    i = 0;
  str += '';

  if (!charlist) {
    // default list
    whitespace =
      ' \n\r\t\f\x0b\xa0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000';
  } else {
    // preg_quote custom list
    charlist += '';
    whitespace = charlist.replace(/([\[\]\(\)\.\?\/\*\{\}\+\$\^\:])/g, '$1');
  }

  l = str.length;
  for (i = 0; i < l; i++) {
    if (whitespace.indexOf(str.charAt(i)) === -1) {
      str = str.substring(i);
      break;
    }
  }

  l = str.length;
  for (i = l - 1; i >= 0; i--) {
    if (whitespace.indexOf(str.charAt(i)) === -1) {
      str = str.substring(0, i + 1);
      break;
    }
  }

  return whitespace.indexOf(str.charAt(0)) === -1 ? str : '';
}


