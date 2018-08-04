
var Q = require('../utils/QtUtil.js')
var querystring = require('querystring')


function start(){
	
  console.log("request handler 'start' was called");
  
  function sleep(milliSeconds){
      var startTime = new Date().getTime();
      while(new Date().getTime() < startTime + milliSeconds)
        ;  
  }
  
  sleep(1000);
  return "hello start!";
}
function postdata(res, req){

    
    var a="";
    req.addListener("data",function(postdata){
        a+=postdata;    //接收到的表单数据字符串，这里可以用两种方法将UTF-8编码转换为中文
        //var b = querystring.parse(a);     //转换成json对象
        //var c = decodeURIComponent(a);        //对表单数据进行解码
        // console.log("-----a----");
        // console.log(a);
        // console.log("-----b----");
        // console.log(b);
        // console.log("-----c----");
        // console.log(c);
        //a = c;

    });
    req.addListener("end",function(){
        
        //
        /**
        {   id: '0.8955058842691073',
                type: 'post',
                imageUrl: 'https://open-image.nosdn.127.net/252d0a7a4c2c4506aa9c7d6985bb0e00.jpg' }
        */

        setTimeout(function(){

            var b = querystring.parse(a);

            var jsonString = JSON.stringify({
                pic:b.imageUrl,
                code:b.id
            })

            var headerObj = {
                "Content-Type":"text/plain; charset=utf-8",
                "Access-Control-Allow-Origin":"*"
            }
            res.writeHead(200, headerObj);
            res.write(jsonString);
            res.end();

        },100)

        


    });
  
  return "hello postdata!";
}
function upload(res, req){

	console.log("request handler 'upload' was called");
	
	var a="";
    req.addListener("data",function(postdata){
        a+=postdata;	//接收到的表单数据字符串，这里可以用两种方法将UTF-8编码转换为中文
        //var b = querystring.parse(a);		//转换成json对象
        //var c = decodeURIComponent(a);		//对表单数据进行解码
        // console.log("-----a----");
        // console.log(a);
        // console.log("-----b----");
        // console.log(b);
        // console.log("-----c----");
        // console.log(c);
        //a = c;

    });
    req.addListener("end",function(){
    	
    	//
    	/**
		{ 	id: '0.8955058842691073',
				type: 'post',
				imageUrl: 'https://open-image.nosdn.127.net/252d0a7a4c2c4506aa9c7d6985bb0e00.jpg' }
    	*/

    	setTimeout(function(){

    		var b = querystring.parse(a);

        	var jsonString = JSON.stringify({
        		pic:b.imageUrl,
        		code:b.id
        	})

        	var headerObj = {
        		"Content-Type":"text/plain; charset=utf-8",
        		"Access-Control-Allow-Origin":"*"
        	}
            res.writeHead(200, headerObj);
            res.write(jsonString);
            res.end();

    	},100)

    	


    });
  
  return "hello upload!";
}


function upfile(res, req){

    //iconv-lite mp3-header fluent-ffmpeg formidable image-size music-metadata
    
    var mm = require('../node_modules/music-metadata');

    var ffmpeg = require('../node_modules/fluent-ffmpeg')
    var sizeOf = require('../node_modules/image-size')
    var formidable = require('./../node_modules/formidable')
    var iconv = require('../node_modules/iconv-lite')
    var child = require('child_process');
    var fs = require('fs')
    var http = require('http')
    var path = require('path')
    var util = require('util')
    var QtFile = require('../files/QtFile.js')
    var file = new QtFile()

    if (req.url == '/upfile' && req.method.toLowerCase() == 'post') {

        var form = new formidable.IncomingForm();
        form.uploadDir = '/tmp';   //文件保存在系统临时目录
        form.maxFieldsSize = 10 * 1024 * 1024;  //上传文件大小限制为最大10M  
        form.keepExtensions = true;        //使用文件的原扩展名

        form.parse(req, function(err, fields, files) {

            var dateString = new Date().format("yyyyMMdd-hhmmssS")
            var distPathSaveImg = "./../dist/"+dateString+"/"
            //
            var isHaveFolder = file.exist(distPathSaveImg)
            if(!isHaveFolder){
                fs.mkdirSync(distPathSaveImg);
            }

            var filesUrl = []
            var errCount = 0
            var keys = Object.keys(files)
            keys.forEach(function(key){
                var filePath = files[key].path
                var fileExt = filePath.substring(filePath.lastIndexOf('.'))
                if (('.jpg.jpeg.png.gif.mp4.mp3').indexOf(fileExt.toLowerCase()) === -1) {
                    errCount += 1

                    filesUrl[0] = {picUrl:"",fileObj:files[key],imageSize:{}}

                } else {
                    //以当前时间戳对上传文件进行重命名
                    
                    var fileName = "upload_"+ dateString + fileExt
                    var targetFile = path.join(distPathSaveImg, fileName)
                    //移动文件 
                    fs.renameSync(filePath, targetFile)
                    
                    if(fileExt.toLowerCase() === ".mp3"){

                        
                        mm.parseFile(targetFile, {native: true})
                          .then(function (metadata) {

                            var o = util.inspect(metadata, { showHidden: false, depth: null })
                            //console.log(metadata.common.title);

                            var titleStr = metadata.common.title
                            var titleStr = iconv.decode(titleStr, 'gbk')
                            var albumartist = metadata.common.albumartist
                            var albumartist = iconv.decode(albumartist, 'gbk')
                            var album = metadata.common.album
                            var album = iconv.decode(album, 'gbk')
                            var artist = metadata.common.artist
                            var artist = iconv.decode(artist, 'gbk')

                            console.log(titleStr)
                            console.log(albumartist)
                            console.log(album)
                            console.log(artist)


                            var dataInfo = {
                                title:titleStr,
                                albumartist:albumartist,
                                album:albumartist,
                                artist:albumartist
                            }

                            var dataObj = {type:"audio",picUrl:targetFile,fileObj:files[key],dataInfo:dataInfo};
                            var jsonString = JSON.stringify(dataObj)
                            writeEnd(jsonString, errCount)

                          })
                          .catch(function (err) {
                            console.error(err.message)
                          })
                        

                        
                        
                        
                    }else if(fileExt.toLowerCase()===".mp4" || fileExt.toLowerCase()===".mov"){

                        //截图---------------
                        var screenshotName = "screenshot_" + dateString
                        var screenshotNamePath = distPathSaveImg + screenshotName+'.jpg'
                        var ffmpeg_screen = 'ffmpeg -i '+targetFile+' -ss 00:00:00 -f image2 '+screenshotNamePath
                        //截图功能
                        
                        child.exec(ffmpeg_screen,()=>{
                             console.log("截图 ok")
                        })
                        
                        //转换视频功能---------------
                        // var outputMp3Path = distPathSaveImg+'output_'+dateString+'.mp4'
                        // ffmpeg(targetFile)
                        //   .videoCodec('libx264')
                        //   //.audioCodec('libmp3lame')
                        //   .audioCodec('copy')
                        //   .size('320x240')

                        //   .on('error', function(err) {
                        //     console.log('An error occurred: ' + err.message)
                        //   })
                        //   .on('end', function() {
                            
                        //     console.log('Processing finished !')
                        //   })
                        //   .save(outputMp3Path)
                          //--------------------

                        var dataObj = {type:"video",picUrl:targetFile,fileObj:files[key],imageSize:{}}

                        var jsonString = JSON.stringify(dataObj)

                        writeEnd( jsonString, errCount)
                    }else if('.jpg.jpeg.png.gif'.indexOf(fileExt.toLowerCase()) != -1){


                        //获取图片宽高
                        var dimensions = sizeOf(targetFile)
                        var dataObj = {type:"pic",picUrl:targetFile,fileObj:files[key],imageSize:dimensions}
                        
                        var jsonString = JSON.stringify(dataObj)

                        writeEnd(jsonString, errCount)
                    }
                    

                }
            })


            
        });



      }
    


    function writeEnd( jsonString, errCount){


            var errorJson = JSON.stringify({
                code:"1",
                msg:"不合法"
            })

            var resultJson = ""
            if(errCount == 0){
                resultJson = jsonString
            }else{
                resultJson = errorJson
            }

            var headerInfo = {'content-type': 'text/plain; charset=utf-8',"Access-Control-Allow-Origin":"*"}
            res.writeHead(200, headerInfo)
            res.write(resultJson)
            //res.end(util.inspect({fields: fields, files: files}));
            res.end()
    }

    return "hello upfile!";
}

exports.start = start;
exports.upload = upload;
exports.postdata = postdata;
exports.upfile = upfile;