//试卷-做题
topicCont.directive('topicPaperParseContDirective', ['$state','$stateParams','$timeout','$ionicSlideBoxDelegate','$window','topicContHttpService','topicContService',function($state,$stateParams,$timeout,$ionicSlideBoxDelegate,$window,topicContHttpService,topicContService){
	return {
		link: function(scope,ele,attrs){
		  	//滑动题目事件
		  	var indexVal="";//滑动时候获取当前索引告诉安卓收藏的变量
			scope.slideHasChanged=function(index,event){
				console.log(index)
				//每次滑动过去大题，都重置小题让他默认第一题
				scope.doubleViewTopic=1;
				$ionicSlideBoxDelegate.$getByHandle('viewpaperstart').slide(0);
				$ionicSlideBoxDelegate.update();
			  	if(index==topicContService.paperSlide-1){
					$timeout(function(){
						indexVal=index;
						scope.currentSlide=index;//变量给滑动底层view最后一题时切换到下一题时做判断条件用
					},100)
				}else{
					indexVal=index;
					scope.currentSlide=index;//变量给滑动底层view最后一题时切换到下一题时做判断条件用
				}
			  	/*每次滑动的时候告诉安卓这道题是否被收藏过*/
			  	scope.touchend=function(){
						/*每次滑动的时候告诉安卓这道题是否被收藏过*/
					  	var questionId=$(".directory-slide").eq(parseInt(indexVal)).attr("data-questionId"),//题目问题ID
					  		isCollection=$(".directory-slide").eq(parseInt(indexVal)).attr("data-isStart");//是否被收藏的布尔值 true是收藏 false没收藏
					  		if(isCollection=='true'){   
		                    	isCollection=true;
			                }else{   
			                    isCollection=false;  
			                }  
			                console.log(parseInt(questionId),isCollection,parseInt(indexVal))
					  		window.paperParse.isStartQuestion(parseInt(questionId),isCollection,parseInt(indexVal));
				}
			}
			/*当滑动最后一道题的时候告诉安卓做完题了*/
		  	scope.swipeLeft=function(event){
		  		var paperSlideNum=topicContService.paperSlide;
		  		if(parseInt(indexVal+1)==parseInt(paperSlideNum)){
		  			window.paperParse.completeAnswer();
		  		}
		  	}
			/*试卷下-左滑事件*/
			scope.slideSwipeLeft=function(event){
				console.log($(event.target));
				console.log($(event.target).parents(".directory-slide"));
				var page="",
					pageNum="";
					if($(event.target).hasClass("directory-slide")){
						if(parseInt($(event.target).attr('data-index'))<scope.count-1){//没有滑动到最后一题
							page=$(event.target).next(".directory-slide").attr("data-page");
							pageNum=$(event.target).next(".directory-slide").attr("data-pageNum");
						}else{//滑动到最后一题
							page=$(event.target).attr("data-page");
							pageNum=$(event.target).attr("data-pageNum");
						}
					}else{
						if(parseInt($(event.target).parents(".directory-slide").attr('data-index'))<scope.count-1){//没有滑动到最后一题
							page=$(event.target).parents(".directory-slide").next(".directory-slide").attr("data-page");
							pageNum=$(event.target).parents(".directory-slide").next(".directory-slide").attr("data-pageNum");
						}else{//滑动到最后一题
							page=$(event.target).parents(".directory-slide").attr("data-page");
							pageNum=$(event.target).parents(".directory-slide").attr("data-pageNum");
						}
						
					}
					console.log(page,pageNum)
					scope.currentTopic=page;
					scope.questionCount=pageNum;
			}
			/*试卷下-右滑事件*/
			scope.slideSwipeRight=function(event){
				console.log($(event.target));
				console.log($(event.target).parents(".directory-slide"));
				var page="",
					pageNum="";
					if($(event.target).hasClass("directory-slide")){
						console.log("本人")
						if(parseInt($(event.target).attr('data-index'))>0){//没有滑动到第一题
							page=$(event.target).prev(".directory-slide").attr("data-page");
							pageNum=$(event.target).prev(".directory-slide").attr("data-pageNum");
						}else{//滑动到第一题
							page=$(event.target).attr("data-page");
							pageNum=$(event.target).attr("data-pageNum");
						}
					}else{
						console.log("不是本人")
						if(parseInt($(event.target).parents(".directory-slide").attr('data-index'))>0){//没有滑动到第一题
							console.log("是走这里嘛")
							page=$(event.target).parents(".directory-slide").prev(".directory-slide").attr("data-page");
							pageNum=$(event.target).parents(".directory-slide").prev(".directory-slide").attr("data-pageNum");
						}else{//滑动到第一题
							page=$(event.target).parents(".directory-slide").attr("data-page");
							pageNum=$(event.target).parents(".directory-slide").attr("data-pageNum");
						}
					}
					console.log(page,pageNum)
					scope.currentTopic=page;
					scope.questionCount=pageNum;
			}

			//双view滑动题目事件
			scope.slideReadChanged=function(index,event){
				scope.doubleViewTopic=index+1;
			}
			//题目反馈-弹窗事件
			scope.feedbackPopup=function(event){
				var questionId=$(event.target).attr("data-questionId");//问题ID
				window.paperParse.questionFeedback(parseInt(questionId));
			}
		}
	}
}]);

	
