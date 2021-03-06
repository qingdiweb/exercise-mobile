/*错题本收藏*/
topicCont.controller('topicWrongParseCont',['$scope','$timeout','$stateParams','$ionicSlideBoxDelegate','$ionicScrollDelegate','topicContHttpService','topicContService','$window','$ionicPopup',function($scope,$timeout,$stateParams,$ionicSlideBoxDelegate,$ionicScrollDelegate,topicContHttpService,topicContService,$window,$ionicPopup){
    $scope.currentTopic=1;//初始化题序数为1
    $scope.currentRead=1;//阅读理解双view题序数为1
    $scope.doubleViewTopic=1;
    $scope.isLoading=true;//加载动作
    $scope.isNomore=false;//没有数据时的提示语
    $scope.navMask=false;//初始化导航隐藏
    /*安卓告诉H5是走错题本还是收藏接口*/
    var isErrorBook=GetQueryString("isErrorBook"),//true 错题本 false 收藏
   	    loginToken=GetQueryString("loginToken"),
   	    stageId=GetQueryString("stageId"),//学段ID
   	    subjectId=GetQueryString("subjectId"),//科目ID
   	    collectId=GetQueryString("collectId"),//收藏题目id
   	    studentQuestionId=GetQueryString("studentQuestionId"),//题目ID
   	    indexQuestion=GetQueryString("indexQuestion"),//定位索引
   	    jumpPage=!!indexQuestion ? indexQuestion.charAt(indexQuestion.length-1) : 0,//永远取用传过来的索引值的个位数值作为定位索引
   	    pageNumber=Math.floor(parseInt(indexQuestion)/10),//判断当前传过来的题所处于第几组-一组十道题
   	    createdAtStart=GetQueryString("createdAtStart"),//起始时间
   	    createdAtEnd=GetQueryString("createdAtEnd"),//结束时间
   	    pageSize=10,
   	    pageTotal=0,
   	    topicTotal="",//总题目数
   	    isStart=true;
   	    $scope.indexQuestion=indexQuestion;
   	    if(isErrorBook=="true"){
   	    	isErrorBook=true;
   	    }else{
   	    	isErrorBook=false;
   	    }
   	    $scope.isErrorBook=isErrorBook;//用来判断错题本显示解析，收藏不显示解析
	   	if(isErrorBook){//获取错题本下题目解析
   	    	console.log("走错题本")
   	    	var direction="left";
   	    	wrongDataParse(loginToken,stageId,subjectId,createdAtStart,createdAtEnd,pageNumber,pageSize,pageTotal,direction,jumpPage);
   	    }else{//获取收藏下题目解析
   	    	console.log("走收藏")
   	    	var direction="left";
   	    	collectDataParse(loginToken,collectId,pageNumber,pageSize,pageTotal,direction,jumpPage);
   	    }
	   	var wrongCont=[];//定义一个数组用来存储每次刷新加载的错题数据
	   	function wrongDataParse(loginToken,stageId,subjectId,createdAtStart,createdAtEnd,pageNumber,pageSize,pageTotal,direction,positionIndex){
	   		topicContHttpService.getWrongTopic(loginToken,stageId,subjectId,createdAtStart,createdAtEnd,pageNumber,pageSize,pageTotal).then(function(res){
				var data=res.data;
				console.log(data) 
				if(data.result){
					$scope.isLoading=false;//加载动作
					$scope.navMask=true;//初始化导航隐藏
					//通知客户端结束loading
   					window.errorCollectParse.finishLoading(1);
					$scope.$broadcast('scroll.infiniteScrollComplete');
					if(direction=="left"){
						wrongCont=wrongCont.concat(data.data.content);//每次上拉加载数据，往数组里面添加新刷新的数据
					}else if(direction=="right"){
						wrongCont=data.data.content.concat(wrongCont);//每次上拉加载数据，往数组里面添加新刷新的数据
					}
					var wrongTopicNum=data.data.content.length;//错题个数
						topicTotal=data.data.pageable.totalSize;//总题目数
						if(wrongTopicNum==0){
							$scope.isNomore=true;//没有数据时的提示语
						}else{
							$scope.isNomore=false;//没有数据时的提示语
						}
		   				for (var i = 0; i < wrongCont.length; i++) {
		   					//转换单选题类型格式
		   					var wrongQuestion = wrongCont[i];
		   					if(wrongQuestion.type == 0){
	   							//转换选项类型格式
	   							var options=wrongQuestion.options!=null&&wrongQuestion.options!='' ? JSON.parse(wrongQuestion.options) : [],
	   								chartName=["A","B","C","D","E","F","G","H","I","J","K","L","M","N"];
	   								wrongQuestion.option=[];
	   								for (var j = 0; j < options.length; j++) {
	   									var optionsObj={"title":chartName[j],"option":options[j]};
	   										wrongQuestion.option.push(optionsObj);
	   								}
	   								//处理错题本解析学生所答的题目的答案
			   						wrongQuestion.stuAnswer=wrongQuestion.wrongAnswer!=null&&wrongQuestion.wrongAnswer!='' ? wrongQuestion.wrongAnswer.toUpperCase() : '';

		   					}
		   					//转换多选题类型格式
		   					if(wrongQuestion.type == 1){
		   							//转换选项类型格式
		   							var options=wrongQuestion.options!=null&&wrongQuestion.options!='' ? JSON.parse(wrongQuestion.options) : [],
		   								chartName=["A","B","C","D","E","F","G","H","I","J","K","L","M","N"];
		   								wrongQuestion.option=[];
		   								for (var j = 0; j < options.length; j++) {
		   									var optionsObj={"title":chartName[j],"option":options[j]};
		   										wrongQuestion.option.push(optionsObj);
		   								}
		   								//处理错题本解析学生所答的题目的答案
				   						wrongQuestion.stuAnswer=wrongQuestion.wrongAnswer!=null&&wrongQuestion.wrongAnswer!='' ? wrongQuestion.wrongAnswer.toUpperCase() : '';

		   					}
		   					//转换多问题类型格式
		   					if(wrongQuestion.type == 4){
		   							wrongQuestion.doubleViewTopicNum=wrongQuestion.questionInfoList.length;//双view下的题目的数量
		   							//$scope.doubleViewTopicNum=wrongQuestion.questionInfo.questionInfoList.length;//双view下的题目的数量
		   							var exerciseId=wrongQuestion.id;//定义一个练习id的变量存储给双view套页面用-方便
		   							var questionInfoList=wrongQuestion.questionInfoList;//双view下的题的内容数据
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
					   								//处理错题本解析学生所答的题目的答案
				   									wrongQuestion.stuAnswer=wrongQuestion.answer!=null&&wrongQuestion.answer!='' ? wrongQuestion.answer.toUpperCase() : '';
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
					   							//处理错题本解析学生所答的题目的答案
				   								var answer=wrongQuestion.wrongAnswer!=null&&wrongQuestion.wrongAnswer!='' ? JSON.parse(wrongQuestion.wrongAnswer) : [];
						   						for (let n in answer) {
						   							for (var q = 0; q < questionInfoList[j].length; q++) {
						   								if(questionInfoList[j][q].id==n){
						   									questionInfoList[j][q].stuAnswer=answer[n];
						   								}
						   							}
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
		   					if(!!wrongQuestion.knowledges){
		   						wrongQuestion.parseKnowledges = [];
								wrongQuestion.parseKnowledges=wrongQuestion.knowledges.split(",");
		   					}
		   				}
		   				let dealWrongCont=[];
		   				for(let item of dealTimesGroup(wrongCont)){
							dealWrongCont=dealWrongCont.concat(item.list)
		   				}
		   				$scope.wrongCont=dealWrongCont;
		   				//$scope.wrongTopicNum=wrongTopicNum;
		   				$ionicSlideBoxDelegate.update();
		   				
		   				//数据渲染之后
		   				$timeout(function(){
		   					$ionicScrollDelegate.$getByHandle('wrongstart').resize();
		   					$ionicScrollDelegate.$getByHandle('viewwrongstart').resize();
		   					if(data.data.content.length!=0){//只有当有数据新加载出来才会定位题目
		   						$ionicSlideBoxDelegate.$getByHandle('wrongstart').slide(positionIndex);
								$ionicSlideBoxDelegate.update();
		   					}
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
							/*var durationSecond=$(".directory-slide").attr("data-durationSecond");//上次答题时间
		   						console.log(parseInt(durationSecond))
					    		window.errorCollectParse.startKeepingTime(parseInt(durationSecond));*/

					    	/*每次滑动的时候告诉安卓这道题是否被收藏过*/
				  			var questionId=$(".first-view-slide").eq(parseInt(indexQuestion)).attr("data-questionId"),//题目问题ID
				  				isCollection=$(".first-view-slide").eq(parseInt(indexQuestion)).attr("data-isStart"),//是否被收藏的布尔值 true是收藏 false没收藏
				  				count=parseInt(wrongTopicNum);//当前错题题数
				  				if(isCollection=='true'){   
				                    isCollection=true;
				                }else{   
				                    isCollection=false;  
				                } 
				                if(isStart){//只让初始化的时候告诉一遍安卓收藏，之后就不告诉了
				                	window.errorCollectParse.isStartQuestion(parseInt(questionId),isCollection,parseInt(indexQuestion),count);
				                	isStart=false;
				                } 
				  				
					    })
		   			}else{
		   				//接口请求失败
		   				window.errorCollect.finishLoading(0);
		   				$ionicPopup.alert({
			               title: '提示',
			               template: '<div style="width:100%;text-align:center;">网络异常</div>'
			             });
		   			}
	   })
   }
   var collectCont=[];//定义一个数组用来存储每次刷新加载的收藏数据	
   function collectDataParse(loginToken,collectId,pageNumber,pageSize,pageTotal,direction,positionIndex){//获取收藏下题目
		topicContHttpService.getCollectQuestionList(loginToken,collectId,pageNumber,pageSize,pageTotal).then(function(res){
			var data=res.data;
			console.log(data)
			if(data.result){
				$scope.isLoading=false;//加载动作
				$scope.navMask=true;//初始化导航隐藏
				//通知客户端结束loading
   				window.errorCollectParse.finishLoading(1);
				if(direction=="left"){
					collectCont=collectCont.concat(data.data.content);//每次上拉加载数据，往数组里面添加新刷新的数据
				}else if(direction=="right"){
					collectCont=data.data.content.concat(collectCont);//每次上拉加载数据，往数组里面添加新刷新的数据
				}
				$scope.$broadcast('scroll.infiniteScrollComplete');
				var collectTopicNum=data.data.content.length;//收藏个数
					topicTotal=data.data.pageable.totalSize;//总题目数
					if(collectTopicNum==0){
						$scope.isNomore=true;//没有数据时的提示语
					}else{
						$scope.isNomore=false;//没有数据时的提示语
					}
					
	   				for (var i = 0; i < collectCont.length; i++) {
	   					//转换单选题类型格式
	   					var wrongQuestion = collectCont[i],
	   						questionInfo = wrongQuestion.questionInfo;
	   					if(questionInfo.type == 0){
	   							//转换选项类型格式
	   							var options=questionInfo.options!=null&&questionInfo.options!='' ? JSON.parse(questionInfo.options) : [],
	   								chartName=["A","B","C","D","E","F","G","H","I","J","K","L","M","N"];
	   								questionInfo.option=[];
	   								for (var j = 0; j < options.length; j++) {
	   									var optionsObj={"title":chartName[j],"option":options[j]};
	   										questionInfo.option.push(optionsObj);
	   								}
	   							//处理错题本解析学生所答的题目的答案
	   						/*	var answer=JSON.parse(wrongQuestion.answer),
	   								answerStr="";
			   						for (let n in answer) {
			   							answerStr+=answer[n]+',';
			   						}
			   						wrongQuestion.stuAnswer=answerStr.substr(0,answerStr.length-1);*/
			   						console.log('wrongQuestion',wrongQuestion)
			   						wrongQuestion.stuAnswer=wrongQuestion.answer!=null&&wrongQuestion.answer!='' ? wrongQuestion.answer.toUpperCase() : '';
		   						if(!!wrongQuestion.questionInfo.answer){
	   								wrongQuestion.questionInfo.ParseAnswer = "";
									wrongQuestion.questionInfo.ParseAnswer=wrongQuestion.questionInfo.answer.toUpperCase();//统一转换成大写
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
	   							//处理错题本解析学生所答的题目的答案
	   						/*	var answer=JSON.parse(wrongQuestion.answer),
	   								answerStr="";
			   						for (let n in answer) {
			   							answerStr+=answer[n]+',';
			   						}
			   						wrongQuestion.stuAnswer=answerStr.substr(0,answerStr.length-1);*/
			   						wrongQuestion.stuAnswer=wrongQuestion.answer!=null&&wrongQuestion.answer!='' ? wrongQuestion.answer.toUpperCase() : '';
		   						if(!!questionInfo.answer){
		   							questionInfo.ParseAnswer = [];
	   								questionInfo.ParseAnswer=questionInfo.answer.split(",");
		   						}

	   					}
	   					//转换多问题类型格式
	   					if(questionInfo.type == 4){
	   							wrongQuestion.questionInfo.doubleViewTopicNum=wrongQuestion.questionInfo.questionInfoList.length;//双view下的题目的数量
	   							//$scope.doubleViewTopicNum=wrongQuestion.questionInfo.questionInfoList.length;//双view下的题目的数量
	   							var exerciseId=wrongQuestion.id;//定义一个练习id的变量存储给双view套页面用-方便
	   							var questionInfoList=wrongQuestion.questionInfo.questionInfoList;//双view下的题的内容数据
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
				   							//处理错题本解析学生所答的题目的答案
				   							var answer=wrongQuestion.answer!=null&&wrongQuestion.answer!='' ? JSON.parse(wrongQuestion.answer) : [];
						   						for (let n in answer) {
						   							for (var q = 0; q < questionInfoList[j].length; q++) {
						   								if(questionInfoList[j][q].id==n){
						   									questionInfoList[j][q].stuAnswer=answer[n];
						   								}
						   							}
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
					   							//处理错题本解析学生所答的题目的答案
				   								var answer=wrongQuestion.answer!=null&&wrongQuestion.answer!='' ? JSON.parse(wrongQuestion.answer) : [];
						   						for (let n in answer) {
						   							for (var q = 0; q < questionInfoList[j].length; q++) {
						   								if(questionInfoList[j][q].id==n){
						   									questionInfoList[j][q].stuAnswer=answer[n];
						   								}
						   							}
						   						}
						   						//转换选项类型格式
						   						if(!!questionInfoList[j].answer){
						   							questionInfoList[j].ParseAnswer = [];
					   								questionInfoList[j].ParseAnswer=questionInfoList[j].answer.split(",");
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
	   				console.log('收藏11',collectCont)
	   				$scope.wrongCont=collectCont;
	   				$ionicSlideBoxDelegate.update();
	   				
	   				//数据渲染之后
	   				$timeout(function(){
	   					$ionicScrollDelegate.$getByHandle('wrongstart').resize();
	   					$ionicScrollDelegate.$getByHandle('viewwrongstart').resize();
						if(data.data.content.length!=0){//只有当有数据新加载出来才会定位题目
	   						$ionicSlideBoxDelegate.$getByHandle('wrongstart').slide(positionIndex);
							$ionicSlideBoxDelegate.update();
	   					}
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
									   console.log('高度',document.body.clientHeight,this.parentNode.offsetTop)
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
					/*	var durationSecond=$(".directory-slide").attr("data-durationSecond");//上次答题时间
	   						console.log(parseInt(durationSecond))
				    		window.errorCollectParse.startKeepingTime(parseInt(durationSecond));*/

				    	/*每次滑动的时候告诉安卓这道题是否被收藏过*/
			  			var questionId=$(".first-view-slide").eq(parseInt(indexQuestion)).attr("data-questionId"),//题目问题ID
			  				isCollection=$(".first-view-slide").eq(parseInt(indexQuestion)).attr("data-isStart"),//是否被收藏的布尔值 true是收藏 false没收藏
			  				count=parseInt(collectTopicNum);//当前收藏题数
			  				if(isCollection=='true'){   
			                    isCollection=true;
			                }else{   
			                    isCollection=false;  
			                }  
			  				
			  				if(isStart){//只让初始化的时候告诉一遍安卓收藏，之后就不告诉了
			                	window.errorCollectParse.isStartQuestion(parseInt(questionId),isCollection,parseInt(indexQuestion),count);
			                	isStart=false;
			                } 
				    })
		   		}else{
	   				//接口请求失败
	   				window.errorCollect.finishLoading(0);
	   				$ionicPopup.alert({
		               title: '提示',
		               template: '<div style="width:100%;text-align:center;">网络异常</div>'
		             });
	   			}
		   })
    }
    var leftPageNumber=pageNumber;//记录向左侧滑动加载右侧数据时的页码-避免左右来回滑动导致页码变化引起bug
    $scope.swipeLeft=function(event){
		var el=$(event.currentTarget),
			direction="left",
			currentIndex=el.attr('data-swipepage'),//当前题位置
			currentNum=$(".first-view-slide").length,//当前加载出来的题数
			positionIndex=parseInt(el.attr('data-swipepage'))+1;
			/*if(currentNum==1){//初始化跳转过来的时候只有一个题的时候，pageNumber传，传过来的值data-page
				pageNumber=parseInt(el.attr("data-page"))+1;
			}else{//当滑动的时候加载出超过一个题的时候，pageNumber传，传过来的值data-index
				pageNumber=parseInt(el.attr("data-page"))+parseInt(el.attr("data-swipepage"))+1;
			}*/
			if((parseInt(currentIndex)==parseInt(currentNum)-1)&&parseInt(currentIndex)<parseInt(topicTotal)-1){//向左滑动时只有滑动当前存在的最后一道题时才重新走接口加载题目但同时确定此道题不是所有题最后一道
				var positionIndex=currentNum;//因为向左侧滑动加载题目的时候当前加载出来的题目数作为定位索引
					leftPageNumber=leftPageNumber+1;
					$scope.isLoading=true;//加载动作
					if(isErrorBook){//获取错题本下题目解析
						wrongDataParse(loginToken,stageId,subjectId,createdAtStart,createdAtEnd,leftPageNumber,pageSize,0,direction,positionIndex);
			   	    }else{//获取收藏下题目解析
						collectDataParse(loginToken,collectId,leftPageNumber,pageSize,0,direction,positionIndex);
			   	    }
			}
	}
	var rightPageNumber=pageNumber;//记录向右侧侧滑动加载左侧数据时的页码-避免左右来回滑动导致页码变化引起bug
	$scope.swipeRight=function(event){
		var el=$(event.currentTarget),
			direction="right",
			currentIndex=el.attr('data-swipepage'),//当前题位置
			currentNum=$(".first-view-slide").length;//当前加载出来的题数
			
			if(currentIndex=='0'){//向右滑动时只有滑动当前存在第一道题才重新走接口加载题目
				var positionIndex="9";//因为向右侧滑动加载题目的时候永远定位在当前加载的第9道题
					rightPageNumber=rightPageNumber-1;
					if(rightPageNumber>0||rightPageNumber==0){//加载左侧数据的时候如果再没有数据了就不走接口了
						$scope.isLoading=true;//加载动作
						if(isErrorBook){//获取错题本下题目解析
							wrongDataParse(loginToken,stageId,subjectId,createdAtStart,createdAtEnd,rightPageNumber,pageSize,0,direction,positionIndex);
				   	    }else{//获取收藏下题目解析
							collectDataParse(loginToken,collectId,rightPageNumber,pageSize,0,direction,positionIndex);
				   	    }
					}
					
			}
	}
	/*安卓告诉H5哪道题是否被收藏过的方法*/
	isNocollection=function(questionId,isStart,index){//将函数定义为全局函数
			var isStartBool=isStart;
                /*if(isStartBool=='false'){   
                    window.location.reload();//在我的收藏列表中如果取消收藏，移除当前  
                }*/
                //只有错题本和收藏中收藏动作的时候有必要设置当前题是否收藏的状态-而收藏中取消收藏都已经移除列表了就没必要设置了
                /*if(isErrorBook==true||(isErrorBook==false&&isStartBool=='true')){
                	$(".first-view-slide").eq(parseInt(index)).attr({"data-questionId":parseInt(questionId),"data-isStart":isStartBool});
                }*/
                $(".first-view-slide").eq(parseInt(index)).attr({"data-questionId":parseInt(questionId),"data-isStart":isStartBool});
                
	};
	//错题本和收藏列表点击过来定位
/*	$timeout(function(){
		var indexQuestion=GetQueryString("indexQuestion");
			console.log(indexQuestion)
			$ionicSlideBoxDelegate.$getByHandle('wrongstart').slide(parseInt(indexQuestion));
			$ionicSlideBoxDelegate.update();
	},1500)*/
}]);
