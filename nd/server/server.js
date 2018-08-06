//Qt 工具类

var fs = require('fs')
var Q = require('../utils/QtUtil.js')
var http = require('http')
var https = require('https')
var url = require('url')

var serverTimes = 0

function serverStart(route, handler, requestHandlers){

	var privateKey  = fs.readFileSync('./nd/cert/1533531003345.key', 'utf8');
	var certificate = fs.readFileSync('./nd/cert/1533531003345.pem', 'utf8');
	var credentials = {key: privateKey, cert: certificate};


    var svrObj = https.createServer(credentials,function(req,res){

    	if(url.parse(req.url).path=='/favicon.ico')return

      	serverTimes++


      	//--------------------------------
      	var pathname = url.parse(req.url).pathname;
	    if(pathname=="/")	//访问表单页面
	    {
	        //日期输出函数
			var timeFormatStr = new Date().format("yyyyMMdd-hhmmss")
	        var pathname = url.parse(req.url).pathname;
	        console.log(serverTimes+' http request for '+pathname+' recieved '+timeFormatStr);
	        
	        route(handler, pathname, res, req);
	        
	        var headerObj = {
        		"Content-Type":"text/plain; charset=utf-8",
        		"Access-Control-Allow-Origin":"*"
        	}
	      	res.writeHead(200, headerObj);
	      	res.write('<h1>Node.js</h1><span>'+timeFormatStr+'</span>');  
	      	res.end("");
	    }
	    else if(pathname=="/postdata" && req.method.toLowerCase() === 'post')	//处理post方式请求
	    {
	    	
	    	route(handler, pathname, res, req);

	    }else if(pathname == "/upload" && req.method.toLowerCase() === 'post'){




			route(handler, pathname, res, req);
	        
	        	


	    }else if(pathname == "/upfile" && req.method.toLowerCase() == 'post'){

	        route(handler, pathname, res, req);
	        
	    }else if(pathname == "/getAccessToken" && req.method.toLowerCase() == 'get'){

	        route(handler, pathname, res, req);
	        
	    }else{
	    	var headerObj = {
        		"Content-Type":"text/plain; charset=utf-8"
        	}
	      	res.writeHead(200, headerObj);
	      	res.write('welcome to qiter.com ！');  
	      	res.end("");
	    }
	    //console.log('pathname:'+pathname);


    })

    svrObj.listen(8000);
    
    console.log('http server start on port 3000');
}

exports.serverStart = serverStart;





