//目录下做题解析
topicCont.directive('topicContParseDirective', ['$state','$stateParams','$timeout','$ionicSlideBoxDelegate','$window','topicContHttpService', function($state,$stateParams,$timeout,$ionicSlideBoxDelegate,$window,topicContHttpService){
	return {
		link: function(scope, ele, attrs){
			//滑动题目事件
		  	var indexVal="";//滑动时候获取当前索引告诉安卓收藏的变量
			scope.slideHasChanged=function(index,event){
				console.log(index)
				//每次滑动过去大题，都重置小题让他默认第一题
				scope.doubleViewTopic=1;
				$ionicSlideBoxDelegate.$getByHandle('viewstart').slide(0);
				$ionicSlideBoxDelegate.update();
				if(index==4){
					$timeout(function(){
						scope.parseCurrentTopic=index+1;
					},100)
				}else{
					scope.parseCurrentTopic=index+1;
				}
			  	indexVal=index;
			  	/*每次滑动的时候告诉安卓这道题是否被收藏过*/
				  	scope.touchend=function(){
						setTimeout(function(){
							console.log(indexVal)
							/*每次滑动的时候告诉安卓这道题是否被收藏过*/
						  	var questionId=$(".directory-slide").eq(indexVal).attr("data-questionId"),//题目问题ID
						  		isCollection=$(".directory-slide").eq(indexVal).attr("data-isStart");//是否被收藏的布尔值 true是收藏 false没收藏
						  		if(isCollection=='true'){   
			                    	isCollection=true;
				                }else{   
				                    isCollection=false;  
				                }  
						  		window.exerciseParse.isStartQuestion(parseInt(questionId),isCollection,parseInt(indexVal));
							})
						
					}
			}
			/*当滑动最后一道题的时候告诉安卓做完题了*/
			scope.swipeLeft=function(){
		  		if(scope.parseCurrentTopic==scope.questionCount){
		  			window.exerciseParse.completeAnswer();
		  		}
		  	}
			//双view滑动题目事件
			scope.slideReadChanged=function(index,event){
				scope.doubleViewTopic=index+1;
			}
            
			//题目反馈-弹窗事件
			scope.feedbackPopup=function(event){
				var questionId=$(event.target).attr("data-questionId");//问题ID
				window.exerciseParse.questionFeedback(parseInt(questionId));
			}
		}
	}
}])	