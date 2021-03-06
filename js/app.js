//欧拉教育-练习模块
var huazilive = angular.module('huazilive', ['ionic','topicCont']);
/*对应相应模块*/
var topicCont = angular.module('topicCont', []); //题内容模块
angular.module('topicCont') .filter('to_trusted', ['$sce',
    function($sce){ return function(text) { return $sce.trustAsHtml(text); }; }]);
/*rem计算*/
(function (doc, win) {
	var docEl = doc.documentElement,
	    resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
	    recalc = function () {
	        var clientWidth = docEl.clientWidth;
	        if (!clientWidth) return;
	        if(clientWidth>=480){
	            //docEl.style.fontSize = '100px';
	            docEl.style.fontSize = (100 * (376 / 640)).toFixed(2) + 'px';
	        }else{
	            docEl.style.fontSize = (100 * (clientWidth / 640)).toFixed(2) + 'px';
	        }
	    };

	if (!doc.addEventListener) return; 
	win.addEventListener(resizeEvt, recalc, false);
	doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);

 /*获取地址栏参数方法*/
function GetQueryString(name){
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  decodeURI(r[2]); return null;
}

//处理时间戳转化时间日期格式
function dealTimestamp(dateAt){
    let date=new Date(dateAt),
        dateY=date.getFullYear()+'/',
        dateM=date.getMonth()+1<10 ? '0'+(date.getMonth()+1)+'/' : (date.getMonth()+1)+'/',
       	dateD=date.getDate()<10 ? '0'+date.getDate()+'' : date.getDate()+'';
  /*      dateHours=date.getHours() < 10 ? "0" + date.getHours() : date.getHours(),
        dateMinute=date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes(),*/
        newDate=dateY+dateM+dateD;
        return newDate
}
//处理时间分组
function dealTimesGroup(arr){
    //先从大到小排序
    /*  for (var i = 0; i < arr.length; i++) {
        for (var j = 0; j < arr.length-i-1; j++) {
          if(arr[j].updatedAt<arr[j+1].updatedAt){
            let temp=[];
              temp=arr[j+1];
              arr[j+1]=arr[j];
              arr[j]=temp;
              }
          }
      }*/
    let newArr=[];
      for(let [index,item] of arr.entries()){
        let date=dealTimestamp(item.updatedAt);
        if(JSON.stringify(newArr).indexOf(date)!=-1){
          let objIndex=newArr.findIndex(e=>e.date==date);
            item.key=index;
            newArr[objIndex].list.push(item);
            //newArr[objIndex].list=[...newArr[objIndex].list,{...item,key:index}]
        }else{
          item.key=index;
          newArr.push({'date':date,'createdAt':item.updatedAt,'list':[item]});
          //newArr=[...newArr,{'date':date,'createdAt':item.questionInfo.createdAt,'list':[{...item,key:index}]}]
        }
      }
    return newArr;
}

//将值转换为特权所接受并能安全地使用“ng-bind-html”
/*huazilive.filter('to_trusted', ['$sce', function ($sce) {
    return function (text) {
        return $sce.trustAsHtml(text);
    }
}]);*/