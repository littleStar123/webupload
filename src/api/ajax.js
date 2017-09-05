export const fspath = 'http://192.168.2.168:9002/fileservice';//开发 调试地址 基础平台
export const filepath = 'http://snbsm.ourebuy.com/filesys';//开发 调试地址 文件服务
let showLogs = true;//打印日志

export const bsjsonp = function(url, that, params, callback) {
	if(showLogs){
		console.log("接口地址-->" + bspath + url);
		console.log("传入参数-->" + JSON.stringify(params));
	}
	$.ajax({
		async: true,
		url: bspath + url,
		type: "POST",
		dataType: 'jsonp',
		jsonp: 'jsoncallback',
		data: params,
		cache:false, //这也是禁止缓存的。
		timeout: 100000,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		beforeSend: function(xmlHttp) {
			xmlHttp.setRequestHeader("If-Modified-Since","0"); 
        	xmlHttp.setRequestHeader("Cache-Control","no-cache");
		},
		success: function(res) {
			if(showLogs){
				console.log("返回数据-->"+JSON.stringify(res));
			}
			if(res) {
				if(res.code == 0) {
					callback(res);
				}else if(res.code == 1){
					that.$message.error(res.message);
				}else if(res.code == 2){
					sessionStorage.removeItem('user');
					window.location.href = window.host +'/filesys/login';
				}else if(res.code == 3){
					 that.$message({
				          message: '抱歉,您的操作没有权限',
				          type: 'warning',
				          showClose: true,
						  duration: 1500
			        });
				}else{
					callback(res);
				}
			}
		},
		complete: function(XMLHttpRequest, textStatus) {
			//请求结束
		},
		error: function(xhr) {
			if(that != undefined){
				that.$message.error('您的网络不给力哦');
			}
		}
	});
};