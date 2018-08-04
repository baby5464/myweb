
//Qt 工具类
var Q = require('../utils/QtUtil.js')

function route(handler, pathname, res, req){
	//日期输出函数
	var timeFormatStr = new Date().format("yyyyMMdd-hhmmss")
  	//console.log('about to route a request for '+pathname+" time "+timeFormatStr);

  	if(typeof handler[pathname] === 'function'){
      	handler[pathname](res, req)
    }
    else{
      //console.log('no request handler found for'+pathname);
    }

}

exports.route = route;