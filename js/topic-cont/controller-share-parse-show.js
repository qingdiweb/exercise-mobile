/*解析*/
topicCont.controller('topicShareParseShow',['$scope','$timeout','$stateParams','$ionicSlideBoxDelegate','$ionicScrollDelegate','topicContHttpService',function($scope,$timeout,$stateParams,$ionicSlideBoxDelegate,$ionicScrollDelegate,topicContHttpService){
   	$scope.doubleViewTopic=1;//双view下的初始化题序
    //获取目录下练习题目
    var loginToken=GetQueryString("loginToken"),
    	questionId=GetQueryString("questionId");//练习ID
   		topicContHttpService.getSearchQuestion(questionId,loginToken).then(function(res){
   			var data=res.data;
   			if(data.result){
   				window.shareQuestionParse.finishLoading(1);
   				var questionInfo=data.data;//联系列表
	   					if(questionInfo.type == 0){
	   							//转换选项类型格式
	   							var options=JSON.parse(questionInfo.options),
	   								chartName=["A","B","C","D","E","F","G","H","I","J","K","L","M","N"];
	   								questionInfo.option=[];
	   								for (var j = 0; j < options.length; j++) {
	   									var optionsObj={"title":chartName[j],"option":options[j]};
	   										questionInfo.option.push(optionsObj);
	   								}
	   								questionInfo.ParseAnswer=!!questionInfo.answer ? questionInfo.answer.toUpperCase() : '';//统一转换成大写
	   					}
	   					//转换多选题类型格式
	   					if(questionInfo.type == 1){
	   							//转换选项类型格式
	   							var options=JSON.parse(questionInfo.options),
	   								chartName=["A","B","C","D","E","F","G","H","I","J","K","L","M","N"];
	   								questionInfo.option=[];
	   								for (var j = 0; j < options.length; j++) {
	   									var optionsObj={"title":chartName[j],"option":options[j]};
	   										questionInfo.option.push(optionsObj);
	   								}
		   						//转换选项类型格式
		   						questionInfo.ParseAnswer=!!questionInfo.answer ? questionInfo.answer.toUpperCase().split(",") : [];
	   					}
	   					//转换多问题类型格式
	   					if(questionInfo.type == 4){
	   							questionInfo.doubleViewTopicNum=questionInfo.childQuestionInfoList.length;//双view下的题目的数量
	   							var questionInfoList=questionInfo.childQuestionInfoList;//双view下的题的内容数据
	   							for (var j = 0; j < questionInfoList.length; j++) {
	   								if(questionInfoList[j].type == 0){
			   							//转换选项类型格式
			   							var options=JSON.parse(questionInfoList[j].options),
			   								chartName=["A","B","C","D","E","F","G","H","I","J","K","L","M","N"];
			   								questionInfoList[j].option=[];
			   								for (var m = 0; m < options.length; m++) {
			   									var optionsObj={"title":chartName[m],"option":options[m]};
			   										questionInfoList[j].option.push(optionsObj);
			   								}
				   					}
				   					//转换多选题类型格式
				   					if(questionInfoList[j].type == 1){
				   							//转换选项类型格式
				   							var options=JSON.parse(questionInfoList[j].options),
				   								chartName=["A","B","C","D","E","F","G","H","I","J","K","L","M","N"];
				   								questionInfoList[j].option=[];
				   								for (var m = 0; m < options.length; m++) {
				   									var optionsObj={"title":chartName[m],"option":options[m]};
				   										questionInfoList[j].option.push(optionsObj);
				   								}
					   						//转换选项类型格式
					   						questionInfoList[j].ParseAnswer=!!questionInfoList[j].answer ? questionInfoList[j].answer.split(",") : [];
				   							
				   					}
				   					//双view下-转换考点类型格式
				   					questionInfoList[j].parseKnowledges=!!questionInfoList[j].knowledges ? questionInfoList[j].knowledges.split(",") : [];
				   					
	   							}
	   							
	   					}
	   					//所有题型-转换考点类型格式
	   					questionInfo.parseKnowledges=!!questionInfo.knowledges ? questionInfo.knowledges.split(",") : [];
		   				$scope.exerciseInfoList=questionInfo;
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
							/*每次滑动的时候告诉安卓这道题是否被收藏过*/
							var isCollection=$(".first-directory-slide").eq(0).attr("data-isStart")=='true' ? true : false;//是否被收藏的布尔值 true是收藏 false没收藏
								window.shareQuestionParse.isStartQuestion(parseInt(questionId),isCollection);

					    })
	   		}else{
	   			//接口请求失败
	   			window.errorCollect.finishLoading(0);
	   		}
	   })
		//多view滑动题目事件
		$scope.slideReadChanged=function(index,event){
			$scope.doubleViewTopic=index+1;
		}
		//题目反馈-弹窗事件
		$scope.feedbackPopup=function(event){
			var questionId=$(event.target).attr("data-questionId");//问题ID
			window.shareQuestionParse.questionFeedback(parseInt(questionId));
		}
		

}]);