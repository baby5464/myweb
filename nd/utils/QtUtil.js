


class Q
{
    
	constructor(){
	
	}

	toString(){
		return "this is QtUtil class";
	}

	static log(s){
		console.log(s);
	}

	static sayHello(name){
		//this.para = name;
		return "Hello,"+name;
	}


    
}

module.exports = Q;

//举例：
//日期输出函数
//var timeFormatStr = new Date().format("yyyyMMdd-hhmmss")
Date.prototype.format = function(format){
    var o = {
        "M+" : this.getMonth()+1, //month
        "d+" : this.getDate(), //day
        "h+" : this.getHours(), //hour
        "m+" : this.getMinutes(), //minute
        "s+" : this.getSeconds(), //second
        "q+" : Math.floor((this.getMonth()+3)/3), //quarter
        "S" : this.getMilliseconds() //millisecond
    }

    if(/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    }

    for(var k in o) {
        if(new RegExp("("+ k +")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
        }
    }
    return format;
}
/*
传入毫秒值，格式化时间
*/
Date.prototype.formatMMTime = function(mss){
    var days = parseInt(mss / (1000 * 60 * 60 * 24));
    var hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = parseInt( (mss % (1000 * 60)) / 1000 );

    hours = hours==0?"":hours;

    function addZero(nameStr){
        nameStr = String(nameStr)
        return nameStr.length<=1? "0"+nameStr : nameStr;
    }
    //return days + ":" + hours + ":" + minutes + "" + seconds + "";
    return  hours + "" + addZero(minutes) + ":" + addZero(seconds) ;
}


//去重 start=============
// Array.prototype.unique = function()
// {
//     var n = []; //一个新的临时数组
//     for(var i = 0; i < this.length; i++) //遍历当前数组
//     {
//         //如果当前数组的第i已经保存进了临时数组，那么跳过，
//         //否则把当前项push到临时数组里面
//         if (n.indexOf(this[i]) == -1) n.push(this[i]);
//     }
//     return n;
// }
// Array.prototype.unique2 = function()
// {
//     var n = {},r=[]; //n为hash表，r为临时数组
//     for(var i = 0; i < this.length; i++) //遍历当前数组
//     {
//         if (!n[this[i]]) //如果hash表中没有当前项
//         {
//             n[this[i]] = true; //存入hash表
//             r.push(this[i]); //把当前数组的当前项push到临时数组里面
//         }
//     }
//     return r;
// }
 
// Array.prototype.unique3 = function()
// {
//     var n = [this[0]]; //结果数组
//     for(var i = 1; i < this.length; i++) //从第二项开始遍历
//     {
//         //如果当前数组的第i项在当前数组中第一次出现的位置不是i，
//         //那么表示第i项是重复的，忽略掉。否则存入结果数组
//         if (this.indexOf(this[i]) == i) n.push(this[i]);
//     }
//     return n;
// }
// Array.prototype.unique4 = function()
// {
// 　　this.sort();  //先排序
// 　　var res = [this[0]]; //结果数组
// 　　for(var i = 1; i < this.length; i++) //从第二项开始遍历
// 　　{
// 　　　　//先将原数组进行排序；检查原数组中的第i个元素 与 结果数组中的最后一个元素是否相同，因为已经排序，所以重复元素会在相邻位置；有一定的局限性，去重结果也是排序的。
// 　　　　if (this[i] !== res[res.length-1]) res.push(this[i]);
// 　　}
// 　　return res;
// }
//去重 start=============