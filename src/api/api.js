import * as ajax from './ajax'

export const fspath = ajax.fspath;
export const filepath = ajax.filepath;

/**登录**/
export const doLogin = function(that,params,callback) {
	ajax.bsjsonp('/invoker/login/doLogin.do',that,params,callback);
};

