//试卷-做题
topicCont.directive('topicShareParseDirective', ['$state','$stateParams','$timeout','$ionicSlideBoxDelegate','$window',function($state,$stateParams,$timeout,$ionicSlideBoxDelegate,$window){
	return {
		link: function(scope,ele,attrs){
		  	var questionId=GetQueryString("questionId"),//练习ID
		  		agent = navigator.userAgent.toLowerCase(),
		        android = agent.indexOf("android"),
		        iphone = agent.indexOf("iphone"),
		        ipad = agent.indexOf("ipad"),
		        isWeixin = agent.indexOf('micromessenger');
		        //如果是在微信里面打开就让其走过渡页否则在qq或者其他中点击直接唤醒app
			  	scope.openAPP=function(){
					if(isWeixin!=-1){//微信
						window.location.href='share-parse-guide.html?questionId='+questionId;
					}else{//QQ
						window.location.href="education://huazi.app/shared_question?sharedQuestionId="+questionId
						setTimeout(function(){
		                    window.location.href="https://huazi-api-test.oss-cn-beijing.aliyuncs.com/download/StudentApp_2.1.0.apk"
		                },3000)
					}
			  	}
		}
	}
}]);

	
