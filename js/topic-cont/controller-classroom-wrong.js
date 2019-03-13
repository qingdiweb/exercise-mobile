/*错题本*/
topicCont.controller('classroomWrongCont',['$scope','$timeout','$stateParams','$ionicSlideBoxDelegate','topicContHttpService','topicContService','$window',function($scope,$timeout,$stateParams,$ionicSlideBoxDelegate,topicContHttpService,topicContService,$window){
    $scope.currentTopic=1;//初始化题序数为1
    $scope.currentRead=1;//阅读理解双view题序数为1
    $scope.isLoading=true;//加载动作
    $scope.isMoreprompt=false;//没有更多提示文字
    $scope.isNodata=false;//没有更多数据
    //$scope.isMore=true;
    //获取错题本下题目
    var loginToken=GetQueryString("loginToken"),
    	stageId=GetQueryString("stageId"),//学段ID
   	    subjectId=GetQueryString("subjectId"),//学科
   	    createdAtStart='',//起始时间
   	    createdAtEnd='',//结束时间
   	    pageNumber=0,
   	    pageSize=10,
   	    isLoadMore=true,
   	    wrongCollectCont="";//走接口获取的数据赋给到这-用来作为移除或取消收藏之后重新渲染一下视图数据
   	    requestWrongData(loginToken,stageId,subjectId,createdAtStart,createdAtEnd,pageNumber,pageSize,isLoadMore);
   	    var wrongCont=[];//定义一个数组用来存储每次刷新加载的错题数据
   		function requestWrongData(loginToken,stageId,subjectId,createdAtStart,createdAtEnd,pageNumber,pageSize,isLoadMore){
	    	topicContHttpService.getClassroomWrong(loginToken,stageId,subjectId,createdAtStart,createdAtEnd,pageNumber,pageSize).then(function(res){
	   			var data=res.data;
	   			if(data.result){
	   					$scope.isLoading=false;//加载动作
	   					$scope.isMoreprompt=false;//每次先没有更多提示文字
	   					//通知客户端结束loading
   						window.errorCollect.finishLoading(1);
		   				if(data.data.content.length!=0){
		   					if(!!isLoadMore){
								$scope.$broadcast('scroll.infiniteScrollComplete');
								$scope.isMore=true;
		   					}
		   					wrongCont=wrongCont.concat(data.data.content);//每次上拉加载数据，往数组里面添加新刷新的数据
		   				}else{
		   					//请求数据为空-如果不是上拉刷新才置为空-日期筛选
		   					if(!isLoadMore){
								wrongCont=[];
		   					}else{
		   						$scope.isMore=false;
		   						/*if($scope.isNodata=false){
		   							
		   						}*/
		   						$scope.isMoreprompt=true;//没有更多提示文字
		   					}
		   					
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

		   					}
		   					//转换多问题类型格式
		   					if(wrongQuestion.type == 4){
		   							wrongQuestion.doubleViewTopicNum=wrongQuestion.questionInfoList!=null&&wrongQuestion.questionInfoList.length!=0 ? wrongQuestion.questionInfoList.length : 0;//双view下的题目的数量
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
		   				$scope.wrongCont=dealTimesGroup(wrongCont);
		   				let dealWrongCont=[];
			   				for(let item of dealTimesGroup(wrongCont)){
								dealWrongCont=dealWrongCont.concat(item.list)
			   				}
			   				wrongCollectCont=dealWrongCont;//走接口获取的数据赋给到这-用来作为移除或取消收藏之后重新渲染一下视图数据
		   				$ionicSlideBoxDelegate.update();
		   				
		   				//数据渲染之后
		   				$timeout(function(){
		   					//每次加载完数据判断是否还有题目-没有就提示缺省图
		   					let wrongListLen=$('.directory-slide-list').length;
		   					if(wrongListLen==0){
								$scope.isNodata=true;//没有更多数据
		   					}else{
		   						$scope.isNodata=false;//没有更多数据
		   					}
					    	//下面的view视图拖拽效果
							function drag(){
								// 获取节点
								var block = document.getElementsByClassName("directory-read-multiple-choice");
								var oW,oH;
								    // 绑定touchstart事件
								    for (var i = 0; i < block.length; i++) {
								   	block[i].addEventListener("touchstart", function(e) {
									   e.preventDefault();
									   e.stopPropagation();
									   var touches = e.touches[0];
									   oH = touches.clientY - this.offsetTop;
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
									   }else if(oTop > document.documentElement.clientHeight - 150) {
									    oTop = (document.documentElement.clientHeight - 150);
									   }
									   this.style.top = oTop + "px";
									},false);
									block[i].addEventListener("touchend",function() {
									   document.removeEventListener("touchmove",defaultEvent,false);
									},false);
									function defaultEvent(e) {
									   e.preventDefault();
									  }
								    }
							}
							drag(); 
					    })
		   		}else{
		   			//接口请求失败
		   			window.errorCollect.finishLoading(0);
		   		}
	   		})
		}
		
	/*上拉加载*/
	$scope.loadMoreData=function(){
		var isLoadMore=true;
    	pageNumber=pageNumber+=1;
    	requestWrongData(loginToken,stageId,subjectId,createdAtStart,createdAtEnd,pageNumber,pageSize,isLoadMore);
    }
	/*安卓告诉H5哪道题移除*/
    isDelWrongtopic=function(questionId,count){
    	var questionId=questionId;
		//从列表中移除此道题目
		$(".directory-slide-list").each(function(){
			var self=$(this);
				self.find('.wrong-secList').each(function(){
					var that=$(this),
						id=that.attr("data-questionId");
						if(id==questionId){
							that.remove();
							$timeout(function(){
								//如果移除或者取消收藏就遍历下全部数据移除掉此questionId数据-重新渲染视图
								for (var i = 0; i < wrongCollectCont.length; i++) {
									if(wrongCollectCont[i].id==questionId){
										wrongCollectCont.splice(i,1);
										wrongCont=wrongCollectCont;
										$scope.wrongCont=dealTimesGroup(wrongCollectCont);
										//如果删除完之后没有数据了就显示缺省图
										if(wrongCollectCont.length==0){
											$scope.isNodata=true;//没有更多数据
										}
									}
								}
								//如果当前时间模块下没有题目了，就把时间删除
								if(self.find('.wrong-secList').length==0){
									self.find('.create-date').remove();
								}
							},100)
						}
				})
		})

    }
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
	//按日期筛选错题
	selectWrongDate=function(createdAtStartValue,createdAtEndValue){
   		//$('body').css('background','green').text(createdAtStart+'空格'+createdAtEnd)
   		wrongCont=[];
		createdAtStart=createdAtStartValue;
		createdAtEnd=createdAtEndValue;
		pageNumber=0;//始终定位第一页
		requestWrongData(loginToken,stageId,subjectId,createdAtStartValue,createdAtEndValue,pageNumber,pageSize);
	}

}]);
