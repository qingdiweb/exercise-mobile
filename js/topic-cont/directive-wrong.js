//试卷-做题
topicCont.directive('topicWrongContDirective', ['$state','$stateParams','$timeout','$ionicSlideBoxDelegate','$window','topicContHttpService','topicContService', function($state,$stateParams,$timeout,$ionicSlideBoxDelegate,$window,topicContHttpService,topicContService){
	return {
		link: function(scope,ele,attrs){
			//错题本和收藏跳转解析页面
			scope.jumpParse=function(event){
				var questionId=$(event.currentTarget).attr("data-questionId"),//题目id
					index=$(event.currentTarget).attr("data-index");//第几题索引
					console.log(questionId,index)
					window.errorCollect.selectQuestion(parseInt(questionId),parseInt(index));
			}
			//完形填空双view滑动题目事件
			scope.slideReadChanged=function(index,event){
				scope.currentRead=index+1;
			}
		}
	}
}]);

	
