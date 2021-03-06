/*试卷下做题*/
topicCont.controller('topicPaperParseCont',['$scope','$timeout','$stateParams','$ionicSlideBoxDelegate','$ionicScrollDelegate','topicContHttpService','topicContService','$window',function($scope,$timeout,$stateParams,$ionicSlideBoxDelegate,$ionicScrollDelegate,topicContHttpService,topicContService,$window){
   $scope.currentTopic=1;//初始化题序数为1
   $scope.currentRead=1;//阅读理解双view题序数为1
   $scope.doubleViewTopic=1;//双view下的初始化题序
   $scope.isLoading=true;//加载动作
   $scope.navMask=false;//初始化导航隐藏
   //获取试卷下题目
   var paperListNum=[],//定义一个数组放试卷下每个题型下的题目数量
   	   sectionInfoList=[],//定义试卷下题型题目数据数组
   	   paperQuestionList=[],//定义一个新整理出来的题型题目数据数组，方便定位通过id查找全部的slide索引值
   	   loginToken=GetQueryString("loginToken"),
   	   studentPaperId=GetQueryString("studentPaperId");//学生试卷ID
   		topicContHttpService.getPaperTopiceData(loginToken,studentPaperId).then(function(res){
   			var data=res.data;
   			console.log(data)
   			if(data.result){
   				$scope.isLoading=false;//加载动作
   				$scope.navMask=true;//初始化导航隐藏
   				//通知客户端结束loading
   				window.paperParse.finishLoading(1);
   				var paperName=data.data.name,//试卷名称
   					questionCount=data.data.paperInfo.questionCount,//试卷题总数
   					durationSecond=data.data.durationSecond;//上次用时时间
   					sectionInfoList=data.data.sectionInfoList;//试卷解析数据数组
	   				page=0;
	   				data.data.paperQuestionList=[];//定义一个将后台的题处理成的数组
	   				for (var i = 0; i < sectionInfoList.length; i++) {
	   					//转换单选题类型格式
	   						var paperQuestionInfoList = sectionInfoList[i].paperQuestionInfoList;
	   							paperListNum.push(sectionInfoList[i].paperQuestionInfoList.length);
		   					for (var j = 0; j < paperQuestionInfoList.length; j++) {
		   						page+=1
		   						if(paperQuestionInfoList[j].questionInfo.type == 0){
		   							//转换选项类型格式
	   								var options=paperQuestionInfoList[j].questionInfo.options!=null&&paperQuestionInfoList[j].questionInfo.options!='' ? JSON.parse(paperQuestionInfoList[j].questionInfo.options) : [],
		   								chartName=["A","B","C","D","E","F","G","H","I","J","K","L","M","N"];
		   								paperQuestionInfoList[j].questionInfo.option=[];
		   								for (var h = 0; h < options.length; h++) {
		   									var optionsObj={"title":chartName[h],"option":options[h]};
		   										paperQuestionInfoList[j].questionInfo.option.push(optionsObj);
		   								}
			   						if(!!paperQuestionInfoList[j].questionInfo.answer){
		   								paperQuestionInfoList[j].questionInfo.ParseAnswer = "";
	   									paperQuestionInfoList[j].questionInfo.ParseAnswer=paperQuestionInfoList[j].questionInfo.answer.toUpperCase();//统一转换成大写
			   						}
			   						if(!!paperQuestionInfoList[j].studentPaperAnswerInfo){
			   							paperQuestionInfoList[j].studentPaperAnswerInfo.userAnswer="";
		   								paperQuestionInfoList[j].studentPaperAnswerInfo.userAnswer=paperQuestionInfoList[j].studentPaperAnswerInfo.answer.toUpperCase();//统一转换成大写
			   						}
			   					}
			   					//转换多选题类型格式
			   					if(paperQuestionInfoList[j].questionInfo.type == 1){
			   							//转换选项类型格式
		   								var options=paperQuestionInfoList[j].questionInfo.options!=null&&paperQuestionInfoList[j].questionInfo.options!='' ? JSON.parse(paperQuestionInfoList[j].questionInfo.options) : [],
			   								chartName=["A","B","C","D","E","F","G","H","I","J","K","L","M","N"];
			   								paperQuestionInfoList[j].questionInfo.option=[];
			   								for (var h = 0; h < options.length; h++) {
			   									var optionsObj={"title":chartName[h],"option":options[h]};
			   										paperQuestionInfoList[j].questionInfo.option.push(optionsObj);
			   								}
				   						//转换选项类型格式
				   						if(!!paperQuestionInfoList[j].questionInfo.answer){
				   							paperQuestionInfoList[j].questionInfo.ParseAnswer = [];
			   								paperQuestionInfoList[j].questionInfo.ParseAnswer=paperQuestionInfoList[j].questionInfo.answer.split(",");
				   						}
			   							if(!!paperQuestionInfoList[j].studentPaperAnswerInfo){
			   								paperQuestionInfoList[j].studentPaperAnswerInfo.userAnswer=[];
			   								paperQuestionInfoList[j].studentPaperAnswerInfo.userAnswer=paperQuestionInfoList[j].studentPaperAnswerInfo.answer.split(",");
			   							}
			   							//处理出学生选择与正确答案不一样的选项
			   							if(!!paperQuestionInfoList[j].questionInfo.studentPaperAnswerInfo){
			   								var differentOption="",
				   								reg=/,$/gi;//此处是正则
					   							for (var k = 0; k < paperQuestionInfoList[j].questionInfo.studentPaperAnswerInfo.answer.length; k++) {
													if(paperQuestionInfoList[j].questionInfo.answer.search(paperQuestionInfoList[j].questionInfo.studentPaperAnswerInfo.answer[k])==-1){
														differentOption+=paperQuestionInfoList[j].questionInfo.studentPaperAnswerInfo.answer[k]+",";
													}
												
												}
												differentOption=differentOption.replace(reg,"");
												paperQuestionInfoList[j].questionInfo.studentPaperAnswerInfo.differentOption=differentOption;
			   							}
			   					}
			   					if(paperQuestionInfoList[j].questionInfo.type == 4){
			   							paperQuestionInfoList[j].questionInfo.doubleViewTopicNum=paperQuestionInfoList[j].questionInfo.questionInfoList.length;//双view下的题目的数量
			   							//$scope.doubleViewTopicNum=paperQuestionInfoList[j].questionInfo.questionInfoList.length;//双view下的题目的数量
			   							var paperQuestionId=sectionInfoList[i].paperQuestionInfoList[j].questionInfo.id;//定义一个练习id的变量存储给双view套页面用-方便
			   							var questionInfoList=sectionInfoList[i].paperQuestionInfoList[j].questionInfo.questionInfoList;//双view下的题的内容数据
			   							if(questionInfoList!=null&&questionInfoList.length!=0){
			   								for (var m = 0; m < questionInfoList.length; m++) {
				   								if(questionInfoList[m].type == 0){
						   							//转换选项类型格式
					   								var options=questionInfoList[m].options!=null&&questionInfoList[m].options!='' ? JSON.parse(questionInfoList[m].options) : [],
						   								chartName=["A","B","C","D","E","F","G","H","I","J","K","L","M","N"];
						   								questionInfoList[m].option=[];
						   								for (var h = 0; h < options.length; h++) {
						   									var optionsObj={"title":chartName[h],"option":options[h]};
						   										questionInfoList[m].option.push(optionsObj);
						   								}
							   					}
							   					//转换多选题类型格式
							   					if(questionInfoList[m].type == 1){
							   							//转换选项类型格式
						   								var options=questionInfoList[m].options!=null&&questionInfoList[m].options!='' ? JSON.parse(questionInfoList[m].options) : [],
							   								chartName=["A","B","C","D","E","F","G","H","I","J","K","L","M","N"];
							   								questionInfoList[m].option=[];
							   								for (var h = 0; h < options.length; h++) {
							   									var optionsObj={"title":chartName[h],"option":options[h]};
							   										questionInfoList[m].option.push(optionsObj);
							   								}
								   						//转换选项类型格式
								   						if(!!questionInfoList[m].answer){
								   							questionInfoList[m].ParseAnswer = [];
							   								questionInfoList[m].ParseAnswer=questionInfoList[m].answer.split(",");
								   						}
							   							if(!!questionInfoList[m].studentPaperAnswerInfo){
							   								questionInfoList[m].studentPaperAnswerInfo.userAnswer=[];
							   								questionInfoList[m].studentPaperAnswerInfo.userAnswer=studentPaperAnswerInfo.answer.split(",");
							   							}
							   							//处理出学生选择与正确答案不一样的选项
							   							if(!!questionInfoList[m].studentPaperAnswerInfo){
							   								var differentOption="",
								   								reg=/,$/gi;//此处是正则
									   							for (var k = 0; k < questionInfoList[m].studentPaperAnswerInfo.answer.length; k++) {
																	if(questionInfoList[m].answer.search(questionInfoList[m].studentPaperAnswerInfo.answer[k])==-1){
																		differentOption+=questionInfoList[m].studentPaperAnswerInfo.answer[k]+",";
																	}
																
																}
																differentOption=differentOption.replace(reg,"");
																questionInfoList[m].studentPaperAnswerInfo.differentOption=differentOption;
							   							}
							   					}
							   					//给双view下小题都给加个练习id方便提交答案时候用参数
						   						questionInfoList[m].paperQuestionId=paperQuestionId;
							   					//双view下-转换考点类型格式
							   					if(!!questionInfoList[m].knowledges){
							   						questionInfoList[m].parseKnowledges = [];
						   							questionInfoList[m].parseKnowledges=questionInfoList[m].knowledges.split(",");
							   					}
				   							}
			   							}
			   							
			   					}
			   					//所有题型-转换考点类型格式
			   					if(!!paperQuestionInfoList[j].questionInfo.knowledges){
			   						paperQuestionInfoList[j].questionInfo.parseKnowledges = [];
		   							paperQuestionInfoList[j].questionInfo.parseKnowledges=paperQuestionInfoList[j].questionInfo.knowledges.split(",");
			   					}
		   						paperQuestionInfoList[0].paperName=sectionInfoList[i].name;//给试卷下每个类型的第一题添加标题
		   						paperQuestionInfoList[j].page="";//头部当前题类型的题序
		   						paperQuestionInfoList[j].pageNum=sectionInfoList[i].paperQuestionInfoList.length;//头部当前题类型的题量
		   						for (var m = 0; m < paperQuestionInfoList[j].pageNum; m++) {
		   							paperQuestionInfoList[m].page=m+1;//循环给头部当前题类型的依序添加题序
		   						}
		   						data.data.paperQuestionList.push(paperQuestionInfoList[j]);
		   						paperQuestionList=data.data.paperQuestionList;//定义一个新整理出来的题型题目数据数组，方便定位通过id查找全部的slide索引值
		   					}
		   				
	   				}
	   				console.log(data.data.paperQuestionList)
	   				$scope.paperName=paperName;
	   				$scope.questionCount=sectionInfoList[0].paperQuestionInfoList.length;//初始化定义第一类型题数
	   				$scope.count=questionCount;//总题数
	   				$scope.durationSecond=durationSecond;
	   				$scope.paperQuestionList=data.data.paperQuestionList;
	   				$ionicSlideBoxDelegate.update();
	   				//数据渲染之后
	   				$timeout(function(){
	   					$ionicScrollDelegate.$getByHandle('paperstart').resize();
	   					$ionicScrollDelegate.$getByHandle('viewpaperstart').resize();
	   					topicContService.paperSlide=$(".first-view-directory-slide").length;//第一视图slide数量
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
								   viewH=document.body.clientHeight-this.parentNode.offsetTop;//底层view高度
								   //滑动时动态改变底层view高度
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
										  	if(X<-60){//监听向左侧滑动
										  		 if($(this).find(".double-view-page").text()==$(this).find(".double-view-num").text()){//当底层view下当前题序等于总题数
										  			if($scope.currentSlide==topicContService.paperSlide){//上层view下当前题序等于总题数
										  				window.paper.completeAnswer();
										  			}else{//上层view下当前题序不等于总题数
										  				$ionicSlideBoxDelegate.$getByHandle('paperstart').slide($scope.currentSlide+1);
										  				$timeout(function(){
										  					$scope.doubleViewTopic=1;
										  				},100)
										  			}
										  		}
										  	}else if(X>60){//监听手势向右侧滑动
										  		if($(this).find(".double-view-page").text() == '1'&&$scope.currentSlide != 0){//当底层view下当前题序等于第一道题时
										  			$ionicSlideBoxDelegate.$getByHandle('paperstart').slide($scope.currentSlide-1);
									  				$timeout(function(){
									  					$scope.doubleViewTopic=1;
									  				},100)
										  		}
										  	}
										    document.removeEventListener("touchmove",defaultEvent,false);
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
				    		window.paperParse.startKeepingTime(parseInt(durationSecond));

				    	/*每次滑动的时候告诉安卓这道题是否被收藏过*/
			  			var questionId=$(".first-view-directory-slide").eq(0).attr("data-questionId"),//题目问题ID
			  				isCollection=$(".first-view-directory-slide").eq(0).attr("data-isStart");//是否被收藏的布尔值 true是收藏 false没收藏
			  				console.log(questionId,isCollection)
			  				if(isCollection=='true'){   
			                    isCollection=true;
			                }else{   
			                    isCollection=false;  
			                }  
			  				window.paperParse.isStartQuestion(parseInt(questionId),isCollection,parseInt(0));
			  			
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
            $(".first-view-directory-slide").eq(parseInt(index)).attr({"data-questionId":parseInt(questionId),"data-isStart":isStartBool});
	};
	/*从答题卡点击题目跳转过来定位到某一题*/
	/*$timeout(function(){
		var sectionId=GetQueryString("sectionId"),//试卷答题卡跳转过来的类型大题定位索引值
			paperQuestionId=GetQueryString("paperQuestionId"),//试卷答题卡跳转过来的类型小题定位索引值
			questionId=GetQueryString("questionId");//试卷答题卡跳转过来的类型小题下的题定位索引值
			if(sectionId!="0"&&paperQuestionId!="0"&&questionId=="0"){
				var bigIndex="",//第一个view的当前题型下的总题数
					smallIndex="",//第一个view的当前题型下的第几题
					bigPosition="";//第一个view的当前题型下的总题数
					console.log(sectionInfoList)
				for (var i = 0; i < sectionInfoList.length; i++) {
					if(sectionInfoList[i].id==sectionId){
						console.log("奏折里")
						bigIndex=sectionInfoList[i].paperQuestionInfoList.length;
						for (var j = 0; j < sectionInfoList[i].paperQuestionInfoList.length; j++) {
							if(sectionInfoList[i].paperQuestionInfoList[j].id==paperQuestionId){
								smallIndex=j;
							}
							
						}
					}
				}
				for (var m = 0; m < paperQuestionList.length; m++) {
					if(paperQuestionList[m].id==paperQuestionId){
						bigPosition=m;
					}
					
				}
				$ionicSlideBoxDelegate.$getByHandle('paperstart').slide(parseInt(bigPosition));//大题定位
				$scope.currentTopic=parseInt(smallIndex)+1;
				$scope.questionCount=parseInt(bigIndex);
				$ionicSlideBoxDelegate.update();
			}else if(sectionId!="0"&&paperQuestionId!="0"&&questionId!="0"){
				var bigIndex="",//第一个view的当前题型下的总题数	
					smallIndex="",//第一个view的当前题型下的第几题
					bigPosition="",//第一个view的当前题型下的总题数
					smallPosition="";//双view下小题定位
				for (var i = 0; i < sectionInfoList.length; i++) {
					if(sectionInfoList[i].id==sectionId){
						bigIndex=sectionInfoList[i].paperQuestionInfoList.length;
						console.log(sectionInfoList[i].paperQuestionInfoList)
						for (var j = 0; j < sectionInfoList[i].paperQuestionInfoList.length; j++) {
							if(sectionInfoList[i].paperQuestionInfoList[j].id==paperQuestionId){
								smallIndex=j;
								//console.log(sectionInfoList[i].paperQuestionInfoList[j].questionInfo)
								for (var n = 0; n < sectionInfoList[i].paperQuestionInfoList[j].questionInfo.questionInfoList.length; n++) {
									if(sectionInfoList[i].paperQuestionInfoList[j].questionInfo.questionInfoList[n].id==questionId){
										smallPosition=n;
									}
									
								}
							}
							
						}
					}
				}
				for (var m = 0; m < paperQuestionList.length; m++) {
					if(paperQuestionList[m].id==paperQuestionId){
						bigPosition=m;
					}
					
				}
				console.log(smallPosition)
				$ionicSlideBoxDelegate.$getByHandle('paperstart').slide(parseInt(bigPosition));//大题定位
				$scope.currentTopic=parseInt(smallIndex)+1;
				$scope.questionCount=parseInt(bigIndex)
				$ionicSlideBoxDelegate.$getByHandle('viewpaperstart').slide(parseInt(smallPosition));//小题定位
				$ionicSlideBoxDelegate.update();
			}else if(sectionId=="0"&&paperQuestionId=="0"&&questionId=="0"){//直接点击查看解析按钮跳转过来的的就默认定位到第一小题上
				$ionicSlideBoxDelegate.slide(0);//大题定位
				$ionicSlideBoxDelegate.update();
			}
	},2500)*/
	$timeout(function(){
		positionTopic=function(sectionId,paperQuestionId,questionId){
			
			if(sectionId!="0"&&paperQuestionId!="0"&&questionId=="0"){
				var bigIndex="",//第一个view的当前题型下的总题数
					smallIndex="",//第一个view的当前题型下的第几题
					bigPosition="";//第一个view的当前题型下的总题数
				for (var i = 0; i < sectionInfoList.length; i++) {
					if(sectionInfoList[i].id==sectionId){
						bigIndex=sectionInfoList[i].paperQuestionInfoList.length;
						for (var j = 0; j < sectionInfoList[i].paperQuestionInfoList.length; j++) {
							if(sectionInfoList[i].paperQuestionInfoList[j].id==paperQuestionId){
								smallIndex=j;
							}
							
						}
					}
				}
				for (var m = 0; m < paperQuestionList.length; m++) {
					if(paperQuestionList[m].id==paperQuestionId){
						bigPosition=m;
					}
					
				}
				/*定位过来告诉安卓这道题是否被收藏过*/
	  			var questionId=$(".first-view-directory-slide").eq(bigPosition).attr("data-questionId"),//题目问题ID
	  				isCollection=$(".first-view-directory-slide").eq(bigPosition).attr("data-isStart");//是否被收藏的布尔值 true是收藏 false没收藏
	  				if(isCollection=='true'){   
	                    isCollection=true;
	                }else{   
	                    isCollection=false;  
	                }  
	  				window.paperParse.isStartQuestion(parseInt(questionId),isCollection,parseInt(bigPosition));
					$ionicSlideBoxDelegate.$getByHandle('paperstart').slide(parseInt(bigPosition));//大题定位
					$scope.currentTopic=parseInt(smallIndex)+1;
					$scope.questionCount=parseInt(bigIndex);
					$ionicSlideBoxDelegate.update();
			}else if(sectionId!="0"&&paperQuestionId!="0"&&questionId!="0"){
				var bigIndex="",//第一个view的当前题型下的总题数	
					smallIndex="",//第一个view的当前题型下的第几题
					bigPosition="",//第一个view的当前题型下的总题数
					smallPosition="";//双view下小题定位
				for (var i = 0; i < sectionInfoList.length; i++) {
					if(sectionInfoList[i].id==sectionId){
						bigIndex=sectionInfoList[i].paperQuestionInfoList.length;
						for (var j = 0; j < sectionInfoList[i].paperQuestionInfoList.length; j++) {
							if(sectionInfoList[i].paperQuestionInfoList[j].id==paperQuestionId){
								smallIndex=j;
								for (var n = 0; n < sectionInfoList[i].paperQuestionInfoList[j].questionInfo.questionInfoList.length; n++) {
									if(sectionInfoList[i].paperQuestionInfoList[j].questionInfo.questionInfoList[n].id==questionId){
										smallPosition=n;
									}
									
								}
							}
							
						}
					}
				}
				for (var m = 0; m < paperQuestionList.length; m++) {
					if(paperQuestionList[m].id==paperQuestionId){
						bigPosition=m;
					}
					
				}
				/*定位过来告诉安卓这道题是否被收藏过*/
	  			var questionId=$(".first-view-directory-slide").eq(bigPosition).attr("data-questionId"),//题目问题ID
	  				isCollection=$(".first-view-directory-slide").eq(bigPosition).attr("data-isStart");//是否被收藏的布尔值 true是收藏 false没收藏
	  				if(isCollection=='true'){   
	                    isCollection=true;
	                }else{   
	                    isCollection=false;  
	                }  

	  				window.paperParse.isStartQuestion(parseInt(questionId),isCollection,parseInt(bigPosition));
					$scope.currentTopic=parseInt(smallIndex)+1;
					$scope.questionCount=parseInt(bigIndex)
					$ionicSlideBoxDelegate.$getByHandle('paperstart').slide(parseInt(bigPosition));//大题定位
					$ionicSlideBoxDelegate.$getByHandle('viewpaperstart').slide(parseInt(smallPosition));//小题定位
					$ionicSlideBoxDelegate.update();
			}else if(sectionId=="0"&&paperQuestionId=="0"&&questionId=="0"){//直接点击查看解析按钮跳转过来的的就默认定位到第一小题上
				/*定位过来告诉安卓这道题是否被收藏过*/
	  			var questionId=$(".first-view-directory-slide").eq(0).attr("data-questionId"),//题目问题ID
	  				isCollection=$(".first-view-directory-slide").eq(0).attr("data-isStart");//是否被收藏的布尔值 true是收藏 false没收藏
	  				if(isCollection=='true'){   
	                    isCollection=true;
	                }else{   
	                    isCollection=false;  
	                }
	                var bigIndex=sectionInfoList[0].paperQuestionInfoList.length;  
	  				window.paperParse.isStartQuestion(parseInt(questionId),isCollection,parseInt(0));
	  				$scope.currentTopic=1;
	  				$scope.questionCount=parseInt(bigIndex);
					$ionicSlideBoxDelegate.$getByHandle('paperstart').slide(0);//大题定位
					$ionicSlideBoxDelegate.update();
			}
		}
		//positionTopic("20111671","20150732","20150821")
	},3000) 

}]);
