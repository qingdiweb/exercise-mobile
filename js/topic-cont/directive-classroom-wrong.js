//试卷-做题
topicCont.directive('classroomWrongContDirective', ['$state','$stateParams','$timeout','$ionicSlideBoxDelegate','$window','topicContHttpService','topicContService', function($state,$stateParams,$timeout,$ionicSlideBoxDelegate,$window,topicContHttpService,topicContService){
	return {
		link: function(scope,ele,attrs){
		  	//滑动题目事件
		  	var indexVal="";//滑动时候获取当前索引告诉安卓收藏的变量
			scope.slideHasChanged=function(index,event){
				console.log(index)
				/*event.preventDefault();*/
			  	indexVal=index;
			  	/*每次滑动的时候告诉安卓这道题是否被收藏过*/
			  	scope.touchend=function(){
						/*当滑动最后一道题的时候告诉安卓做完题了*/
					  	if(indexVal==4){
					  		console.log("最后一道题")
					  		/*scope.swipeLeft=function(event){
					  			console.log($(event.target))
					  			window.errorCollect.completeAnswer();
					  		}*/
					  	}
						/*每次滑动的时候告诉安卓这道题是否被收藏过*/
					  	var questionId=$(".directory-slide").eq(parseInt(indexVal)).attr("data-questionId"),//题目问题ID
					  		isCollection=$(".directory-slide").eq(parseInt(indexVal)).attr("data-isStart");//是否被收藏的布尔值 true是收藏 false没收藏
					  		if(isCollection=='true'){   
		                    	isCollection=true;
			                }else{   
			                    isCollection=false;  
			                }  
			                console.log(parseInt(questionId),isCollection,parseInt(indexVal))
					  		window.errorCollect.isStartQuestion(parseInt(questionId),isCollection,parseInt(indexVal));
				}
			}
			//错题本和收藏跳转解析页面
			scope.jumpParse=function(event){
				var questionId=$(event.currentTarget).attr("data-questionId"),//题目id
					index=$(event.currentTarget).attr("data-index");//第几题索引
					console.log(questionId,index)
					window.errorCollect.selectQuestion(parseInt(questionId),parseInt(index));
				
			}
			//完形填空双view滑动题目事件
			scope.slideReadChanged=function(index,event){
				scope.doubleViewTopic=index+1;
			}
		}
	}
}]);

	
