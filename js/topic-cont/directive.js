//目录下做题
topicCont.directive('topicContDirective', ['$state','$stateParams','$timeout','$ionicSlideBoxDelegate','$window','topicContHttpService', function($state,$stateParams,$timeout,$ionicSlideBoxDelegate,$window,topicContHttpService){
	return {
		link: function(scope,ele,attrs){
		  	//滑动题目事件
		  	var indexVal="";//滑动时候获取当前索引告诉安卓收藏的变量
			scope.slideHasChanged=function(index,event){
				//每次滑动过去大题，都重置小题让他默认第一题
				scope.doubleViewTopic=1;
				$ionicSlideBoxDelegate.$getByHandle('viewstart').slide(0);
				$ionicSlideBoxDelegate.update();
				if(index==4){
					$timeout(function(){
						scope.currentTopic=index+1;
					},100)
				}else{
					scope.currentTopic=index+1;
				}
			  	indexVal=index;
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
					  		window.exercise.isStartQuestion(parseInt(questionId),isCollection,parseInt(indexVal));
				}
			}
			/*当滑动最后一道题的时候告诉安卓做完题了*/
			scope.swipeLeft=function(){
		  		if(scope.currentTopic==scope.questionCount){ 
					console.log("走上面的view了")
		  			window.exercise.completeAnswer();
		  		}
		  	}
			//单选点击选项
			scope.onRadioTouch=function(event){
				var isNetwork=window.exercise.isNetwork();//判断是否有网状态下
					if(isNetwork==true){
						var self=$(event.target),
					  		pageIndex=parseInt($(".first-view-page").text()),//当前题序
					  	 	topicOptionsSel=self.siblings(".topic-options-letter");//选中图标
					  	 	topicOptionsSel.addClass("selected").parents(".topic-options-box").siblings(".topic-options-box").find(".topic-options-letter").removeClass("selected");
							//答完每道题之后提交答案
						var loginToken=GetQueryString("loginToken"),
							studentExerciseId=GetQueryString("studentExerciseId"),//练习ID
							exerciseQuestionId=self.parents(".topic-options").attr("data-exerciseId"),//练习ID
							questionId=self.parents(".directory-slide").attr("data-questionId"),//题目id
							answer=self.siblings(".topic-options-letter").text();//答案
						topicContHttpService.getDirectorySubmitAnswer(loginToken,studentExerciseId,exerciseQuestionId,questionId,answer).then(function(res){
							var data=res.data;
				   			if(data.result){
				   				console.log("走借口了")
				   			}
				   			//答完题切换到下一题
				   			$timeout(function(){
				   				console.log(scope.currentTopic)
				   				//如果最后一道题是单选题选完答案直接跳答题卡
				   				if(scope.currentTopic==scope.questionCount){
				   					window.exercise.completeAnswer();
				   				}else{
				   					$ionicSlideBoxDelegate.$getByHandle('start').slide(scope.currentTopic);
									$ionicSlideBoxDelegate.update();
				   				}
				   			})
						})
					}
			}
			
			
			//多选点击选项
			scope.onCheckTouch=function(event){
				var isNetwork=window.exercise.isNetwork();//判断是否有网状态下
					if(isNetwork==true){
						var self=$(event.target),
							pageIndex=parseInt($(".first-view-page").text()),//当前题序
					  	 	topicOptionsSel=self.siblings(".topic-options-letter"),//选中图标
					  	 	answerArray=[];//多选答案
					  	 	topicOptionsSel.toggleClass("selected");
					  		//答完每道题之后提交答案
						var loginToken=GetQueryString("loginToken"),
							studentExerciseId=GetQueryString("studentExerciseId"),//练习ID
							exerciseQuestionId=self.parents(".topic-options").attr("data-exerciseId"),//练习ID
							questionId=self.parents(".directory-slide").attr("data-questionId"),//题目id
							answer=self.parents(".topic-options").children().children(".topic-options-letter.selected").text();//答案
							answerArray.push(answer);
							answerArrayStr=answerArray.toString();//转化字符串
						topicContHttpService.getDirectorySubmitAnswer(loginToken,studentExerciseId,exerciseQuestionId,questionId,answerArrayStr).then(function(res){
							var data=res.data;
				   			if(data.result){
				   				console.log("走借口了")
				   			}
				   			scope.positionIndex=pageIndex;//答完题切换到下一题
						})
					}
			}
			//双view视图下单选点击
			scope.viewRadioTouch=function(event){ 
				var isNetwork=window.exercise.isNetwork();//判断是否有网状态下
					if(isNetwork==true){
						var self=$(event.target),
					  		pageIndex=parseInt($(".first-view-page").text()),//当前题序
					  	 	topicOptionsSel=self.siblings(".topic-options-letter");//选中图标
					  	 	topicOptionsSel.addClass("selected").parents(".topic-options-box").siblings(".topic-options-box").find(".topic-options-letter").removeClass("selected");
							//答完每道题之后提交答案
							console.log(self)
						var loginToken=GetQueryString("loginToken"),
							studentExerciseId=GetQueryString("studentExerciseId"),//练习ID
							exerciseQuestionId=self.parents(".topic-options").attr("data-exerciseId"),//练习ID
							questionId=self.parents(".directory-slide").attr("data-questionId"),//题目id
							answer=self.siblings(".topic-options-letter").text();//答案
						topicContHttpService.getDirectorySubmitAnswer(loginToken,studentExerciseId,exerciseQuestionId,questionId,answer).then(function(res){
							var data=res.data;
				   			if(data.result){
				   				console.log("走借口了")
				   			}
				   			//答完题切换到下一题
				   			$timeout(function(){
				   				console.log(scope.currentTopic)
				   				let doubleViewTopicNum=self.parents(".double-view-slide").siblings('.head-nav').find('.double-view-num').attr('data-num');
					   				if(scope.doubleViewTopic!=doubleViewTopicNum){
					   					$ionicSlideBoxDelegate.$getByHandle('viewstart').slide(scope.doubleViewTopic);
										$ionicSlideBoxDelegate.update();
					   				}else{
					   					if(scope.currentTopic==scope.questionCount){
					   						window.exercise.completeAnswer();
					   					}else{
					   						$ionicSlideBoxDelegate.$getByHandle('start').slide(scope.currentTopic);
											$ionicSlideBoxDelegate.update();
					   					}
					   				}
				   			})
						})
					}
			}
			//完形填空双view滑动题目事件
			scope.slideReadChanged=function(index,event){
				scope.doubleViewTopic=index+1;
			}
		}			
	}
}]);

	
