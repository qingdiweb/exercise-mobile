//试卷-做题
topicCont.directive('classroomWrongparseContDirective', ['$state','$stateParams','$timeout','$ionicSlideBoxDelegate','$window','topicContHttpService','$ionicPopup',function($state,$stateParams,$timeout,$ionicSlideBoxDelegate,$window,topicContHttpService,$ionicPopup){
	return {
		link: function(scope,ele,attrs){
		  	//滑动题目事件
		  	var indexVal="";//滑动时候获取当前索引告诉安卓收藏的变量
			scope.slideHasChanged=function(index,event){
				console.log(index)
				/*event.preventDefault();*/
				scope.currentTopic=index+1;
			  	indexVal=index;
			  	/*每次滑动的时候告诉安卓这道题是否被收藏过*/
			  	scope.touchend=function(){
						/*每次滑动的时候告诉安卓这道题是否被收藏过*/
					  	var questionId=$(".first-view-slide").eq(parseInt(indexVal)).attr("data-questionId"),//题目问题ID
					  		isCollection=$(".first-view-slide").eq(parseInt(indexVal)).attr("data-isStart"),//是否被收藏的布尔值 true是收藏 false没收藏
					  		count=parseInt($(".first-view-slide").length);//当前多少道题
					  		if(isCollection=='true'){   
		                    	isCollection=true;
			                }else{   
			                    isCollection=false;  
			                }  
					  		window.errorCollectParse.isStartQuestion(parseInt(questionId),isCollection,parseInt(indexVal),count);
				}
			}

			//题目反馈-弹窗事件
			scope.feedbackPopup=function(event){
				var questionId=$(event.target).attr("data-questionId");//问题ID
				console.log(questionId)
				window.errorCollectParse.questionFeedback(parseInt(questionId));
			}
			//错题本和收藏页面移除功能
			scope.delParse=function(event){
				console.log(event)
				var loginToken=GetQueryString("loginToken"),
			   	    questionId=$(event.currentTarget).attr("data-questionId");//题目ID
			   	    var confirmPopup = $ionicPopup.show({
		               title: '提示',
		               template: '<div style="width:100%;text-align:center;">是否确定移除本题？</div>',
		               buttons:[
		               	{text:"保留"},
		               	{
		               		text:'<b>移除</b>',
		               		type:'button-positive',
		               		onTap:function(){
		               			topicContHttpService.getDelClassroomWrongTopic(loginToken,questionId).then(function(res){
					   	    		var data=res.data,
					   	    			count=$(".first-view-slide").length;
					   	    			if(data.result){
					   	    				window.location.reload();
					   	    				window.errorCollectParse.moveQuestion(parseInt(questionId),parseInt(count));
					   	    			}
					   	    	})
		               		}
		               	},
		               ]
		            });
		      /*      confirmPopup.then(function(res) {
		               if(res) {
		                  if(isErrorBook){//错题本移除
					   	    	topicContHttpService.getDelWrongTopic(loginToken,questionId).then(function(res){
					   	    		var data=res.data,
					   	    			count=$(".first-view-slide").length;
					   	    			if(data.result){
					   	    				window.errorCollectParse.moveQuestion(parseInt(questionId),parseInt(count));
					   	    				window.location.reload();
					   	    			}
					   	    	})
					   	    }else{//收藏移除
					   	    	topicContHttpService.getDelCollectTopic(loginToken,questionId).then(function(res){
					   	    		var data=res.data,
					   	    			count=$(".first-view-slide").length;
					   	    			if(data.result){
					   	    				window.errorCollectParse.moveQuestion(parseInt(questionId),parseInt(count));
					   	    				window.location.reload();
					   	    			}
					   	    	})
					   	    }
		               } else {
		                 console.log('You are not sure');
		               }
		            });*/
			}
			//双view滑动题目事件
			scope.slideReadChanged=function(index,event){
				scope.doubleViewTopic=index+1;
			}
		}
	}
}]);

	
