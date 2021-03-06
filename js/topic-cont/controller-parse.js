/*解析*/
topicCont.controller('topicContParse',['$scope','$timeout','$stateParams','$ionicSlideBoxDelegate','$ionicScrollDelegate','topicContHttpService',function($scope,$timeout,$stateParams,$ionicSlideBoxDelegate,$ionicScrollDelegate,topicContHttpService){
	$scope.parseCurrentTopic=1;//初始化题序数为1
    $scope.currentRead=1;//阅读理解双view题序数为1
   	$scope.doubleViewTopic=1;//双view下的初始化题序
   	$scope.isLoading=true;//加载动作
   	$scope.navMask=false;//初始化导航隐藏
    //获取目录下练习题目
    var loginToken=GetQueryString("loginToken"),
   	    studentExerciseId=GetQueryString("studentExerciseId"),//练习ID
   	    exerciseQuestionInfoList=[];//定义一个练习数据的数组
   		topicContHttpService.getDirectoryTopiceData(loginToken,studentExerciseId).then(function(res){
   			var data=res.data;
   			console.log(data)
   			if(data.result){
   				$scope.isLoading=false;//数据渲染之后隐藏加载图标
   				$scope.navMask=true;//初始化导航隐藏
   				//通知客户端结束loading
   				window.exerciseParse.finishLoading(1);
   				var chapterName=data.data.name,//章节名称
   					durationSecond=data.data.durationSecond;//上次用时时间
   					questionCount=data.data.exerciseInfo.questionCount;//题目总数
	   				exerciseQuestionInfoList=data.data.exerciseQuestionInfoList;//联系列表
	   				
	   				for (var i = 0; i < exerciseQuestionInfoList.length; i++) {
	   					//转换单选题类型格式
	   					var exerciseQuestion = exerciseQuestionInfoList[i],
	   						questionInfo = exerciseQuestion.questionInfo,
	   						studentExerciseAnswerInfo="";
	   					if(!!exerciseQuestion.questionInfo.studentExerciseAnswerInfo){
	   						studentExerciseAnswerInfo=exerciseQuestion.questionInfo.studentExerciseAnswerInfo;
	   					}
	   					if(questionInfo.type == 0){
	   							//转换选项类型格式
	   							var options=questionInfo.options!=null&&questionInfo.options!='' ? JSON.parse(questionInfo.options) : [],
	   								chartName=["A","B","C","D","E","F","G","H","I","J","K","L","M","N"];
	   								questionInfo.option=[];
	   								for (var j = 0; j < options.length; j++) {
	   									var optionsObj={"title":chartName[j],"option":options[j]};
	   										questionInfo.option.push(optionsObj);
	   								}
		   						if(!!questionInfo.answer){
		   							questionInfo.ParseAnswer = "";
	   								questionInfo.ParseAnswer=questionInfo.answer.toUpperCase();//统一转换成大写
		   						}
		   						if(!!questionInfo.studentExerciseAnswerInfo){
		   							studentExerciseAnswerInfo.userAnswer="";
	   								studentExerciseAnswerInfo.userAnswer=studentExerciseAnswerInfo.answer.toUpperCase();//统一转换成大写
		   						}
	   					}
	   					//转换多选题类型格式
	   					if(questionInfo.type == 1){
	   							//转换选项类型格式
	   							var options=questionInfo.options!=null&&questionInfo.options!='' ? JSON.parse(questionInfo.options) : [],
	   								chartName=["A","B","C","D","E","F","G","H","I","J","K","L","M","N"];
	   								questionInfo.option=[];
	   								for (var j = 0; j < options.length; j++) {
	   									var optionsObj={"title":chartName[j],"option":options[j]};
	   										questionInfo.option.push(optionsObj);
	   								}
		   						//转换选项类型格式
		   						if(!!questionInfo.answer){
		   							questionInfo.ParseAnswer = [];
	   								questionInfo.ParseAnswer=questionInfo.answer.split(",");
		   						}
	   							for (var i = 0; i < questionInfo.ParseAnswer.length; i++) {
	   								questionInfo.ParseAnswer[i].toUpperCase();//统一转换成大写
	   							}
	   							if(!!questionInfo.studentExerciseAnswerInfo){
	   								studentExerciseAnswerInfo.userAnswer=[];
	   								studentExerciseAnswerInfo.userAnswer=studentExerciseAnswerInfo.answer.split(",");
	   								for (var i = 0; i < studentExerciseAnswerInfo.userAnswer.length; i++) {
		   								studentExerciseAnswerInfo.userAnswer[i].toUpperCase();//统一转换成大写
		   							}
		   							//处理出学生选择与正确答案不一样的选项
									var differentOption="",
		   								reg=/,$/gi;//此处是正则
			   							for (var i = 0; i < questionInfo.studentExerciseAnswerInfo.answer.length; i++) {
											if(questionInfo.answer.search(questionInfo.studentExerciseAnswerInfo.answer[i])==-1){
												differentOption+=questionInfo.studentExerciseAnswerInfo.answer[i]+",";
											}
										
										}
										differentOption=differentOption.replace(reg,"");
										questionInfo.studentExerciseAnswerInfo.differentOption=differentOption;
	   							}
	   							
	   							
	   					}
	   					//转换多问题类型格式
	   					if(questionInfo.type == 4){
	   							questionInfo.doubleViewTopicNum=questionInfo.questionInfoList.length;//双view下的题目的数量
	   							//$scope.doubleViewTopicNum=questionInfo.questionInfoList.length;//双view下的题目的数量
	   							var exerciseId=exerciseQuestion.id;//定义一个练习id的变量存储给双view套页面用-方便
	   							var questionInfoList=questionInfo.questionInfoList;//双view下的题的内容数据
	   							if(questionInfoList!=null&&questionInfoList.length!=0){
	   								for (var j = 0; j < questionInfoList.length; j++) {
		   								if(questionInfoList[j].type == 0){
				   							//转换选项类型格式
				   							var options=questionInfoList[j].options!=null&&questionInfoList[j].options!='' ? JSON.parse(questionInfoList[j].options) : [],
				   								chartName=["A","B","C","D","E","F","G","H","I","J","K","L","M","N"];
				   								questionInfoList[j].option=[];
				   								for (var m = 0; m < options.length; m++) {
				   									var optionsObj={"title":chartName[m],"option":options[m]};
				   										questionInfoList[j].option.push(optionsObj);
				   								}
				   								//转换选项类型格式
						   						if(!!questionInfoList[j].answer){
						   							questionInfoList[j].ParseAnswer = [];
					   								questionInfoList[j].ParseAnswer=questionInfoList[j].answer.split(",");
						   						}
					   					}
					   					//转换多选题类型格式
					   					if(questionInfoList[j].type == 1){
					   							//转换选项类型格式
					   							var options=questionInfoList[j].options!=null&&questionInfoList[j].options!='' ? JSON.parse(questionInfoList[j].options) : [],
					   								chartName=["A","B","C","D","E","F","G","H","I","J","K","L","M","N"];
					   								questionInfoList[j].option=[];
					   								for (var m = 0; m < options.length; m++) {
					   									var optionsObj={"title":chartName[m],"option":options[m]};
					   										questionInfoList[j].option.push(optionsObj);
					   								}
						   						//转换选项类型格式
						   						if(!!questionInfoList[j].answer){
						   							questionInfoList[j].ParseAnswer = [];
					   								questionInfoList[j].ParseAnswer=questionInfoList[j].answer.split(",");
						   						}
					   							if(!!questionInfoList[j].studentExerciseAnswerInfo){
					   								questionInfoList[j].studentExerciseAnswerInfo.userAnswer=[];
					   								questionInfoList[j].studentExerciseAnswerInfo.userAnswer=studentExerciseAnswerInfo.answer.split(",");
					   								//处理出学生选择与正确答案不一样的选项
						   							var differentOption="",
						   								reg=/,$/gi;//此处是正则
							   							for (var k = 0; k < questionInfoList[j].studentExerciseAnswerInfo.answer.length; k++) {
															if(questionInfoList[j].answer.search(questionInfoList[j].studentExerciseAnswerInfo.answer[k])==-1){
																differentOption+=questionInfoList[j].studentExerciseAnswerInfo.answer[k]+",";
															}
														
														}
														differentOption=differentOption.replace(reg,"");
														questionInfoList[j].studentExerciseAnswerInfo.differentOption=differentOption;
					   							}
					   							
					   							
					   					}
					   					//给双view下小题都给加个练习id方便提交答案时候用参数
				   						questionInfoList[j].exerciseId=exerciseId;
					   					//双view下-转换考点类型格式
					   					if(!!questionInfoList[j].knowledges){
					   						questionInfoList[j].parseKnowledges = [];
				   							questionInfoList[j].parseKnowledges=questionInfoList[j].knowledges.split(",");
					   					}
		   							}
	   							}
	   							
	   							
	   					}
	   					//所有题型-转换考点类型格式
	   					if(!!questionInfo.knowledges){
	   						questionInfo.parseKnowledges = [];
   							questionInfo.parseKnowledges=questionInfo.knowledges.split(",");
	   					}
	   				}
	   				console.log(exerciseQuestionInfoList)
	   				$scope.chapterName=chapterName;
	   				$scope.durationSecond=durationSecond;
	   				$scope.questionCount=questionCount;
	   				$scope.exerciseQuestionInfoList=exerciseQuestionInfoList;
	   				$ionicSlideBoxDelegate.update();
	   				//数据渲染之后
	   				$timeout(function(){
	   					$ionicScrollDelegate.$getByHandle("start").resize();
	   					$ionicScrollDelegate.$getByHandle("viewstart").resize();
				    	//下面的view视图拖拽效果
						function drag(){
							// 获取节点
							var block = document.getElementsByClassName("updownMoveBtn");
							var oW,oH,viewH;
							    // 绑定touchstart事件
							    for (var i = 0; i < block.length; i++) {
							   	block[i].addEventListener("touchstart", function(e) {
								   e.preventDefault();
								   e.stopPropagation();
								   var touches = e.touches[0];
								   oH = touches.clientY - this.parentNode.offsetTop;
								   //阻止页面的滑动默认事件
								   document.addEventListener("touchmove",defaultEvent,false);
								},false)
								block[i].addEventListener("touchmove", function(e) {
								   e.preventDefault();
								   e.stopPropagation();
								   var touches = e.touches[0];
								   var oTop = touches.clientY - oH;
								   if(oTop < 70) {
								      oTop = 70;
								   }else if(oTop > document.body.clientHeight - 150) {
								    oTop = (document.body.clientHeight - 150);
								   }
								   viewH=document.body.clientHeight-this.parentNode.offsetTop-90;//底层view高度
								   //滑动时动态改变底层view高度
								   this.parentNode.style.height=(document.body.clientHeight-this.parentNode.offsetTop)/58.59 + "rem";
								   this.parentNode.children[1].children[1].style.height=viewH/58.59 + "rem";
								   //this.style.top = oTop + "px";
								   
								   this.parentNode.style.top = oTop + "px";
								},false);
								block[i].addEventListener("touchend",function(e) {
									e.stopPropagation();
								   document.removeEventListener("touchmove",defaultEvent,false);
								},false);
								function defaultEvent(e) {
								   e.preventDefault();
								  }
							    }

							    //双view下阻止冒泡事件
							    var doubleViewSlide = document.getElementsByClassName("directory-read-multiple-choice"),
							    	startX,
							    	moveEndX, 
							    	X;
									for (var i = 0; i < doubleViewSlide.length; i++) {
										doubleViewSlide[i].addEventListener("touchstart", function(e) {
										   e.stopPropagation();
										   startX = e.touches[0].pageX;
										   //阻止页面的滑动默认事件
										   document.addEventListener("touchmove",defaultEvent,false);
										},false)
										doubleViewSlide[i].addEventListener("touchmove", function(e) {
										   e.stopPropagation();
										},false);
										doubleViewSlide[i].addEventListener("touchend",function(e) {
											//e.stopPropagation();
											moveEndX = e.changedTouches[0].pageX;
										   	X = moveEndX - startX;
										  	if(X<-60){//监听手势向左侧滑动
										  		 if($(this).find(".double-view-page").text()==$(this).find(".double-view-num").text()){//当底层view下当前题序等于总题数
										  			if($scope.currentTopic==$scope.questionCount){//上层view下当前题序等于总题数
										  				window.exercise.completeAnswer();
										  			}else{//上层view下当前题序不等于总题数
										  				$ionicSlideBoxDelegate.$getByHandle('start').slide($scope.currentTopic);
										  				$timeout(function(){
										  					$scope.doubleViewTopic=1;
										  				},100)
										  			}
										  		}
										  	}else if(X>60){//监听手势向右侧滑动
										  		if($(this).find(".double-view-page").text() == '1'&&$scope.currentTopic != 1){//当底层view下当前题序等于第一道题时
										  			$ionicSlideBoxDelegate.$getByHandle('start').slide($scope.currentTopic-2);
									  				$timeout(function(){
									  					$scope.doubleViewTopic=1;
									  				},100)
										  		}
										  	}
										    document.removeEventListener("touchmove",defaultEvent,false);
										    //document.removeEventListener("touchend",defaultEvent,false);
										},false);
										function defaultEvent(e) {
										   e.preventDefault();
										 }
									}
						}
						drag();
						/*初始化一进来就告诉安卓上一次答题时间*/
						var durationSecond=$(".directory-slide").attr("data-durationSecond");//上次答题时间
	   						console.log(parseInt(durationSecond))
				    		window.exerciseParse.startKeepingTime(parseInt(durationSecond));

				    	/*每次滑动的时候告诉安卓这道题是否被收藏过*/
			  			var questionId=$(".first-directory-slide").eq(0).attr("data-questionId"),//题目问题ID
			  				isCollection=$(".first-directory-slide").eq(0).attr("data-isStart");//是否被收藏的布尔值 true是收藏 false没收藏
			  				console.log(questionId,isCollection)
			  				if(isCollection=='true'){   
			                    isCollection=true;
			                }else{   
			                    isCollection=false;  
			                }  
			  				window.exerciseParse.isStartQuestion(parseInt(questionId),isCollection,parseInt(0));

				    })
	   		}else{
	   			//接口请求失败
	   			window.errorCollect.finishLoading(0);
	   		}
	   })
	/*安卓告诉H5哪道题是否被收藏过的方法*/
	isNocollection=function(questionId,isStart,index){//将函数定义为全局函数
		var isStartBool=isStart;
                if(isStartBool=='true'){   
                    isStartBool=true;
                }else{   
                    isStartBool=false;  
                }  
            $(".directory-slide").eq(parseInt(index)).attr({"data-questionId":parseInt(questionId),"data-isStart":isStartBool});
	};
	/*从答题卡点击题目跳转过来定位到某一题*/
	/*$timeout(function(){
		var exerciseId=GetQueryString("exerciseId"),//练习查看解析跳转过来的定位索引值
			questionId=GetQueryString("questionId");//练习查看解析跳转过来的定位索引值
			if(exerciseId!="0"&&questionId=="0"){
				var positionIndex="";
				for (var i = 0; i < exerciseQuestionInfoList.length; i++) {
					if(exerciseQuestionInfoList[i].id==exerciseId){
						positionIndex=i;
					}
				}
				$ionicSlideBoxDelegate.$getByHandle('start').slide(parseInt(positionIndex));
				$ionicSlideBoxDelegate.update();
			}else if(exerciseId!="0"&&questionId!="0"){
				var positionIndex="",
					smallIndex="";
				for (var m = 0; m < exerciseQuestionInfoList.length; m++) {
					console.log(exerciseQuestionInfoList[m].questionInfo.questionInfoList)
					if(exerciseQuestionInfoList[m].id==exerciseId){
						positionIndex=m;
						console.log(exerciseQuestionInfoList[m].questionInfo.questionInfoList)
						for (var j = 0; j < exerciseQuestionInfoList[m].questionInfo.questionInfoList.length; j++) {
							if(exerciseQuestionInfoList[m].questionInfo.questionInfoList[j].id==questionId){
								smallIndex=j;
							}
						}
					} 
				} 
				console.log(positionIndex,smallIndex)
				$ionicSlideBoxDelegate.$getByHandle('start').slide(parseInt(positionIndex));
				$ionicSlideBoxDelegate.$getByHandle('viewstart').slide(parseInt(smallIndex));
				$ionicSlideBoxDelegate.update();
			}else if(exerciseId=="0"&&questionId=="0"){//直接点击查看解析按钮跳转过来的的就默认定位到第一小题上
				$ionicSlideBoxDelegate.$getByHandle('start').slide(0);
				$ionicSlideBoxDelegate.update();
			}
	},1500)*/
		$timeout(function(){
			positionTopic=function(exerciseId,questionId){//将函数定义为全局函数
				console.log(exerciseQuestionInfoList)
				if(exerciseId!="0"&&questionId=="0"){
					var positionIndex="";
					for (var i = 0; i < exerciseQuestionInfoList.length; i++) {
						if(exerciseQuestionInfoList[i].id==exerciseId){
							positionIndex=i;
						}
					}
					/*定位跳转过来告诉安卓这道题是否被收藏过*/
					var questionId=$(".first-directory-slide").eq(positionIndex).attr("data-questionId"),//题目问题ID
		  				isCollection=$(".first-directory-slide").eq(positionIndex).attr("data-isStart");//是否被收藏的布尔值 true是收藏 false没收藏
		  				console.log(questionId,isCollection)
		  				if(isCollection=='true'){   
		                    isCollection=true;
		                }else{   
		                    isCollection=false;  
		                }  
		  				window.exerciseParse.isStartQuestion(parseInt(questionId),isCollection,parseInt(positionIndex));
		  			$ionicSlideBoxDelegate.$getByHandle('start').slide(parseInt(positionIndex));
					$ionicSlideBoxDelegate.update();
				}else if(exerciseId!="0"&&questionId!="0"){
					var positionIndex="",
						smallIndex="";
					for (var m = 0; m < exerciseQuestionInfoList.length; m++) {
						console.log(exerciseQuestionInfoList[m].questionInfo.questionInfoList)
						if(exerciseQuestionInfoList[m].id==exerciseId){
							positionIndex=m;
							for (var j = 0; j < exerciseQuestionInfoList[m].questionInfo.questionInfoList.length; j++) {
								if(exerciseQuestionInfoList[m].questionInfo.questionInfoList[j].id==questionId){
									smallIndex=j;
								}
							}
						}
					}
					/*定位跳转过来告诉安卓这道题是否被收藏过*/
					var questionId=$(".first-directory-slide").eq(positionIndex).attr("data-questionId"),//题目问题ID
		  				isCollection=$(".first-directory-slide").eq(positionIndex).attr("data-isStart");//是否被收藏的布尔值 true是收藏 false没收藏
		  				console.log(questionId,isCollection)
		  				if(isCollection=='true'){   
		                    isCollection=true;
		                }else{   
		                    isCollection=false;  
		                }  
		  				window.exerciseParse.isStartQuestion(parseInt(questionId),isCollection,parseInt(positionIndex));
					$ionicSlideBoxDelegate.$getByHandle('start').slide(parseInt(positionIndex));
					$ionicSlideBoxDelegate.$getByHandle('viewstart').slide(parseInt(smallIndex));
					$ionicSlideBoxDelegate.update();
				}else if(exerciseId=="0"&&questionId=="0"){//直接点击查看解析按钮跳转过来的的就默认定位到第一小题上
					/*定位跳转过来告诉安卓这道题是否被收藏过*/
					var questionId=$(".first-directory-slide").eq(0).attr("data-questionId"),//题目问题ID
		  				isCollection=$(".first-directory-slide").eq(0).attr("data-isStart");//是否被收藏的布尔值 true是收藏 false没收藏
		  				console.log(questionId,isCollection)
		  				if(isCollection=='true'){   
		                    isCollection=true;
		                }else{   
		                    isCollection=false;  
		                }  
		  				window.exerciseParse.isStartQuestion(parseInt(questionId),isCollection,parseInt(0));
					$ionicSlideBoxDelegate.$getByHandle('start').slide(0);
					$ionicSlideBoxDelegate.update();
				}
			}
		},1000)
}]);