/*解析*/
topicCont.controller('topicShareParseGuide',['$scope','$timeout','$stateParams','$ionicModal',function($scope,$timeout,$stateParamse,$ionicModal){
	$scope.equipmentType = true;
    var questionId=GetQueryString("questionId"),//练习ID
    	agent = navigator.userAgent.toLowerCase(),
        android = agent.indexOf("android"),
        iphone = agent.indexOf("iphone"),
        ipad = agent.indexOf("ipad"),
        isWeixin = agent.indexOf('micromessenger');
        if(android != -1){
            $scope.equipmentType = true;
        }
        if(iphone != -1 || ipad != -1){
            $scope.equipmentType = false;
        }
		//不是在微信中打开，是在浏览器中打开
		if(isWeixin==-1){
			window.location.href="education://huazi.app/shared_question?sharedQuestionId="+questionId
		}
		//下载安装
		$scope.downloadAPP=function(){
			if(isWeixin!=-1){
				$scope.modal.show()
			}else{
				window.location.href="https://huazi-api-test.oss-cn-beijing.aliyuncs.com/download/StudentApp_2.1.0.apk"
			}
		}
		
		//弹窗蒙层
		$ionicModal.fromTemplateUrl('templates/modal.html', {
		    scope: $scope
		}).then(function(modal) {
		    $scope.modal = modal;
		});
	    $scope.createContact = function() {        
		    $scope.modal.hide();
		};
		//立即打开
	/*	$scope.openAPP=function(){
			$scope.modal.show()
			if(isWeixin!=-1){
				$scope.modal.show()
			}else{
				window.location.href="education://huazi.app/shared_question?sharedQuestionId="+questionId;
				setTimeout(function(){
		            window.location.href="https://huazi-api-test.oss-cn-beijing.aliyuncs.com/download/StudentApp_2.1.0.apk"
		        },3000)
			}
		}*/
}]);