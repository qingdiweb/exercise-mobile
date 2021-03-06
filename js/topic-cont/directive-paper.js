//试卷-做题
topicCont.directive('topicPaperContDirective', ['$state','$stateParams','$timeout','$ionicSlideBoxDelegate','$window','topicContHttpService','topicContService', function($state,$stateParams,$timeout,$ionicSlideBoxDelegate,$window,topicContHttpService,topicContService){
	return {
		link: function(scope,ele,attrs){
		  	//滑动题目事件
		  	var indexVal="";//滑动时候获取当前索引告诉安卓收藏的变量
		  	scope.aaa=function(event){
		  		alert(1)
		  		console.log('数量',$(event.target).attr('data-num'))
		  		
		  	}
			scope.slideHasChanged=function(index,event){
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
					  		window.paper.isStartQuestion(parseInt(questionId),isCollection,parseInt(indexVal));
				}
			}
			/*当滑动最后一道题的时候告诉安卓做完题了*/
		  	scope.swipeLeft=function(event){
		  		var paperSlideNum=topicContService.paperSlide;
		  		if(parseInt(indexVal+1)==parseInt(paperSlideNum)){
		  			window.paper.completeAnswer();
		  		}
		  	}
			//单选点击选项
			scope.onRadioTouch=function(event){
				var isNetwork=window.paper.isNetwork();//判断是否有网状态下
					if(isNetwork==true){
					  	var self=$(event.target),
					  		pageIndex=parseInt(self.parents(".first-view-directory-slide").attr("data-index")),//当前slide索引
					  	 	topicOptionsSel=self.siblings(".topic-options-letter");//选中图标
					  	 	topicOptionsSel.addClass("selected").parents(".topic-options-box").siblings(".topic-options-box").find(".topic-options-letter").removeClass("selected");
						/*答完每道题之后提交答案*/
						var loginToken=GetQueryString("loginToken"),
							studentPaperId=GetQueryString("studentPaperId"),//试卷ID
							paperQuestionId=self.parents(".topic-options").attr("data-paperId"),//练习的题目ID
							questionId=self.parents(".directory-slide").attr("data-questionId"),//题目id
							answer=self.siblings(".topic-options-letter").text();//答案
						topicContHttpService.getPaperSubmitAnswer(loginToken,studentPaperId,paperQuestionId,questionId,answer).then(function(res){
							var data=res.data;
				   			if(data.result){
				   			
				   			}
				   			//答完题切换到下一题
				   			$timeout(function(){
				   				//如果答到最后一道试卷题就跳转答题卡
				   				console.log(pageIndex)
				   				console.log(topicContService.paperSlide)
				   				if(pageIndex==topicContService.paperSlide){
				   					window.paper.completeAnswer();
				   				}else{
				   					$ionicSlideBoxDelegate.$getByHandle('paperstart').slide(parseInt(pageIndex)+1);//定位
									$ionicSlideBoxDelegate.update();
			   						scope.currentTopic=self.parents(".directory-slide").next(".directory-slide").attr("data-page");
			   						scope.questionCount=self.parents(".directory-slide").next(".directory-slide").attr("data-pageNum");
				   				}
				   			})
			   				
						})
					}
			}
			//双view视图下单选点击
			scope.viewRadioTouch=function(event){
				var isNetwork=window.paper.isNetwork();//判断是否有网状态下
					if(isNetwork==true){
						var self=$(event.target),
					  		pageIndex=parseInt(self.parents(".first-view-directory-slide").attr("data-index")),//当前第一个view索引
					  	 	topicOptionsSel=self.siblings(".topic-options-letter");//选中图标
					  	 	topicOptionsSel.addClass("selected").parents(".topic-options-box").siblings(".topic-options-box").find(".topic-options-letter").removeClass("selected");
							//答完每道题之后提交答案
							console.log(self)
						var loginToken=GetQueryString("loginToken"),
							studentPaperId=GetQueryString("studentPaperId"),//试卷ID
							paperQuestionId=self.parents(".topic-options").attr("data-paperId"),//练习的题目ID
							questionId=self.parents(".directory-slide").attr("data-questionId"),//题目id
							answer=self.siblings(".topic-options-letter").text();//答案
							console.log(paperQuestionId+" "+questionId+" "+answer)
						topicContHttpService.getPaperSubmitAnswer(loginToken,studentPaperId,paperQuestionId,questionId,answer).then(function(res){
							var data=res.data;
				   			if(data.result){
				   				console.log("走借口了")
				   			}
				   			//答完题切换到下一题
				   			$timeout(function(){
				   				let doubleViewTopicNum=self.parents(".double-view-slide").siblings('.head-nav').find('.double-view-num').attr('data-num');
				   					if(scope.doubleViewTopic!=doubleViewTopicNum){
					   					$ionicSlideBoxDelegate.$getByHandle('viewpaperstart').slide(scope.doubleViewTopic);
										$ionicSlideBoxDelegate.update();
					   				}else{
										if(scope.currentTopic==scope.questionCount){
					   						window.paper.completeAnswer();
					   					}else{
					   						$ionicSlideBoxDelegate.$getByHandle('paperstart').slide(pageIndex+1);
											$ionicSlideBoxDelegate.update();
					   					}
					   				}
				   			})
						})
					}
			}
			//多选点击选项
			scope.onCheckTouch=function(event){
				var isNetwork=window.paper.isNetwork();//判断是否有网状态下
					if(isNetwork==true){
						var self=$(event.target),
					  		pageIndex=parseInt(self.parents(".directory-slide").attr("data-index")),//当前slide索引
					  	 	topicOptionsSel=self.siblings(".topic-options-letter"),//选中图标
					  	 	answerArray=[];//多选答案
							topicOptionsSel.toggleClass("selected");
							/*答完每道题之后提交答案*/
						var loginToken=GetQueryString("loginToken"),
							studentPaperId=GetQueryString("studentPaperId"),//试卷ID
							paperQuestionId=self.parents(".topic-options").attr("data-paperId"),//练习的题目ID
							questionId=self.parents(".directory-slide").attr("data-questionId"),//题目id
							answer=self.parents(".topic-options").children().children(".topic-options-letter.selected").text();//答案
							answerArray.push(answer);
							answerArrayStr=answerArray.toString();//转化字符串
						topicContHttpService.getPaperSubmitAnswer(loginToken,studentPaperId,paperQuestionId,questionId,answerArray).then(function(res){
							var data=res.data;
				   			if(data.result){
				   			
				   			}
			   				scope.currentTopic=self.parents(".directory-slide").next(".directory-slide").attr("data-page");
			   				scope.questionCount=self.parents(".directory-slide").next(".directory-slide").attr("data-pageNum");
						})
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
			
			//完形填空双view滑动题目事件
			scope.slideReadChanged=function(index,event){
				scope.doubleViewTopic=index+1;
			}
			/*当双view下滑动最后一道题的时候告诉安卓做完题了*/
			scope.viewswipeLeft=function(event){
				var self=$(event.target);
				let doubleViewTopicNum=self.siblings('.head-nav').find('.double-view-num').attr('data-num');
			  		if(scope.doubleViewTopic==doubleViewTopicNum){//当底层view下当前题序等于总题数
			  			if(scope.currentTopic==scope.questionCount){//上层view下当前题序等于总题数
			  				window.paper.completeAnswer();
			  			}else{//上层view下当前题序不等于总题数
			  				$ionicSlideBoxDelegate.$getByHandle('paperstart').slide(scope.currentTopic);
			  			}
			  		}
		  	}
		}
	}
}]);

	
