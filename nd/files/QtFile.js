/*

使用方法

var iconv = require('iconv-lite');
var QtFile = require('./../files/QtFile.js');
var file = new QtFile();
var bufferdata = file.readFileSync("./../dist/q.txt");
var data = iconv.decode(Buffer.from(bufferdata), 'GBK');
Q.log(data);


//-------------------------------

功能：检测路径 是否是文件夹

var mp3FolderPath = "./../../mp3/"
var isDir = file.isDirectory(mp3FolderPath)
Q.log(isDir)

//-------------------------------
功能：检测文件，或者文件夹，是否存在



var mp3FolderPath = "./../../mp3/"
var isExist = file.exist(mp3FolderPath)
Q.log(isExist)
//-------------------------------


功能: 

获取文件夹内，所有文件的文件名。 一层文件名。不包含子文件夹

返回：

文件名数组

var mp3FolderPath = "./../../mp3/"
var fileNameArr = file.getOneFolderFilesName(mp3FolderPath)
Q.log(fileNameArr)

//-------------------------------

功能: 

获取 文件夹内，全部文件名。。。包括子目录内的文件名称

返回： 

文件名数组

example code:

var mp3FolderPath = "./../../mp3/"
var folderAllFileNameArr = file.getFolderInFolderAllFilesName(mp3FolderPath)
Q.log(folderAllFileNameArr)

//-------------------------------
功能: 

获取全部文件夹路径，包括子目录文件夹路径

返回： 

文件夹名称数组

var mp3FolderPath = "./../../mp3/"
var folderListArr = file.getFolderAllFolderNameArr(mp3FolderPath)
Q.log(folderListArr)


//-------------------------------





//-------------------------------
*/
class QtFile
{
	//var fs = null;
	

	constructor(){
		
	}
	
	toString(){
		return "this is QtFile Class"
	}
	
	//显示当前路径
	static showCurrentPath(){
		return process.cwd()
	}
		
	//显示node路径
	static showCurrentNodePath(){
		return process.execPath;
	}


	//


	//read file
	readFile(path, callback){
		var fs = require('fs');
		fs.readFile(path, (error, data) => {
			callback(error,data)
		})
	}

	readFileSync(path){
		var fs = require('fs');
		return fs.readFileSync(path);
	}
	readFileBufferSync(path){
		var fs = require('fs');
		return fs.readFileSync(path,{encoding:'binary'})
	}

	getFileStatSync( pathStr ){
		var _this = this
		if (this.isDirectory(pathStr)) {
			return
		}
		//------------------
		var fs = require('fs')
		var path = require('path')
		var states = fs.statSync(pathStr)
		if(states.isDirectory()){
			console.log("[=== Warning is folder  not files ====]\n"+pathStr)
			return undefined
		}else{
			var pathObj = path.parse(pathStr)
			//获取路径：path.dirname(__path)
			//获取文件名：path.basename(__path)
			//获取扩展名：path.extname(__path)
			return {
				path:pathStr,
				name:pathObj.base,
				ext:pathObj.ext,
				size:states.size
			}

		}
		

	}

	isDirectory( pathUrl ){
		var _this = this
		try{
			var path = require('path')
			var pathObj = path.parse(pathUrl)
			if(pathObj.ext!=""){
				return false
			}
		}catch(e){
			return false;
		}
		return true;
	}

	//check file is file or folder
	exist(path) {
		try{
			var fs = require('fs'); 
			fs.accessSync(path,fs.F_OK);
		}catch(e){
			return false;
		}
		return true;
	}
	




	/*
	
	遍历获取文件夹内，全部文件夹名称

	说明：获取 全部文件夹路径数组

	参数：
	path:路径

	return 获取文件夹路径，总数组
	example:
		
		[ './../../mp3//张信哲2010年新歌/qiter-folder',
		  './../../mp3//张信哲2010年新歌/qt-soft/msoutlook',
		  './../../mp3//张信哲2010年新歌/qt-soft/qiter-folder',
		  './../../mp3//张信哲2010年新歌/qt-soft',
		  './../../mp3//张信哲2010年新歌' ]
	
	*/

	getFolderAllFolderNameArr( path ){
		var _this = this
		if (!this.exist(path)) {
			//空文件夹
			console.log("[===Not find file or folder====]\n"+path)
			return
		}
		var folderListNameArr = []
		folderListNameArr.push(path)
		eachFolderHandler(path)
		function eachFolderHandler(path){
			if (!_this.exist(path)) {
				console.log("[===Not find file or folder====]\n"+path)
				return
			}
			var fs = require('fs')
		    var files = fs.readdirSync(path)
		    files.forEach(eachFolder)
		    function eachFolder(fileName){
		    	var pathStr = path + '/' + fileName
		    	var states = fs.statSync(pathStr)
		    	if (states.isDirectory()) {
		            eachFolderHandler(pathStr)
		            folderListNameArr.push(pathStr)
		        }
		    }
		}
		return folderListNameArr
	}



	/*
	
	功能: 遍历当前文件夹所有文件

	return 数组（文件夹中所有文件名，保存在数组中）
	
	*/
	getOneFolderFilesName(path) {
		var _this = this
		if (!this.exist(path)) {
			//空文件夹
			console.log("[===Not find file or folder====]\n"+path)
			return
		}
		var fileNameArr = []
		var fs = require('fs')
	    var files = fs.readdirSync(path)
	    var fileTotal = files.length
	    files.forEach(eachFolder)
	    function eachFolder(fileName){
	    	var pathStr = path + '/' + fileName
	    	var states = fs.statSync(pathStr)
	    	if (states.isDirectory()) {
	            
	        }else{
	        	if (typeof pathStr === 'string'){
	        		fileNameArr.push(pathStr)
	        	}
	        }
	    }
	    return fileNameArr
	}



	/**
	* 

	用途: 遍历获取 文件夹中全部 (带有路径的)文件名
	
	return: 全部文件名数组

	*
	*/

	getFolderAllFilesName ( pathUrl ) {
		var _this = this
		if (!this.exist(pathUrl)) {
			//no folder
			console.log("[===Not find file or folder====]\n"+pathUrl)
			return
		}
		var fileListNameArr = []
		var path = require("path")
		var filesArr = this.getOneFolderFilesName(pathUrl)
		for( var i in filesArr){
			var filePath = filesArr[i]
			if (typeof filePath === 'string'){

				var pathObj = path.parse(filePath)
				fileListNameArr.push(filePath)

			}
		}
		return fileListNameArr

	}



	/*

	用途: 获取文件夹中，全部文件名，深度遍历所有文件夹

	*/

	getFolderInFolderAllFilesName(pathUrl){
		var fileNameStr = ''
		var signStr = ','
		var folderListArr = this.getFolderAllFolderNameArr(pathUrl)
		for(var i in folderListArr){
			var fileArr = this.getFolderAllFilesName(folderListArr[i])
			if(fileArr.length>0){
				var fileNameString = fileArr.join(",")
				fileNameStr += fileNameString + signStr
			}
		}
		return fileNameStr.substring(0,fileNameStr.length-1).split(",")
	}

	
	//写入文件utf-8格式 
	//_this.writeFile(fileName,data)
	writeFile(fileName, data) {
		var fs = require('fs')
	    fs.writeFile(fileName, data, 'utf-8', complete);
	    function complete() {
	        console.log(fileName+"-文件生成成功")
	    }
	}


	//save file to path
	save(fileData, pathUrl, callBack){
		var path = require('path')
		var fs = require('fs')
		//var pathObj = path.parse(pathUrl)
		//console.log( pathObj )
		var pathObj = path.parse(pathUrl)
		var isHaveFolder = this.exist(pathObj.dir)
		if(!isHaveFolder){
			fs.mkdirSync(pathObj.dir);
		}
		var fileFolderName = path.dirname(pathUrl)
		var fileName = path.basename(pathUrl)
		var siff = path.extname(pathUrl)
		fs.writeFile(
			pathUrl,
			fileData,
			function (err) {
				callBack()
				console.log("[save file]:"+pathUrl)
			}
		)
	}

	
	
	

}




module.exports = QtFile;
