/*目录下做题*/
topicCont.controller('topicClientDownload',['$scope','$timeout','$stateParams','$ionicSlideBoxDelegate','$ionicScrollDelegate','$ionicGesture','$ionicModal',function($scope,$timeout,$stateParams,$ionicSlideBoxDelegate,$ionicScrollDelegate,$ionicGesture,$ionicModal){
		$scope.equipmentType = true;
		function isAndroid_ios(){
			var u = navigator.userAgent, app = navigator.appVersion;
			var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //android终端或者uc浏览器
			var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
			return isAndroid==true?true:false;
		}
		if(isAndroid_ios()){
			//安卓
			$scope.showType=false;
			$scope.equipmentType = true;
		}else{
			//ios
			$scope.showType=true;
			$scope.equipmentType = false;
		}
		$scope.iosTeachDownload=function(event){
			var agent = navigator.userAgent.toLowerCase(),
	        	isWeixin = agent.indexOf('micromessenger');
	        	//不是在微信中打开，是在浏览器中打开
				if(isWeixin==-1){
					window.location.href=isAndroid_ios() ? "https://huazi-api-test.oss-cn-beijing.aliyuncs.com/download/TeacherApp_2.1.0.apk" :"https://itunes.apple.com/cn/app/花籽辅导-教师端/id1275837885?mt=8";
				}else{
					$scope.modal.show()
				}
			
		}
		$scope.iosStuDownload=function(){
			var agent = navigator.userAgent.toLowerCase(),
	        	isWeixin = agent.indexOf('micromessenger');
	        	//不是在微信中打开，是在浏览器中打开
				if(isWeixin==-1){
					window.location.href=isAndroid_ios() ? "https://huazi-api-test.oss-cn-beijing.aliyuncs.com/download/StudentApp_2.1.0.apk" : "https://itunes.apple.com/cn/app/花籽辅导/id1275837889?mt=8";
				}else{
					$scope.modal.show()
				}
			
		}
		function downloadFile(fileName, content){
		    var aLink = document.createElement('a');
		    var blob = new Blob([content]);
		    var evt = document.createEvent("HTMLEvents");
		    evt.initEvent("click", false, false);//initEvent 不加后两个参数在FF下会报错, 感谢 Barret Lee 的反馈
		    aLink.download = fileName;
		    aLink.href = URL.createObjectURL(blob);
		    aLink.dispatchEvent(evt);
		}
		
}]);
