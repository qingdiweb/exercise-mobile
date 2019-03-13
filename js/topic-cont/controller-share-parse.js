/*解析*/
topicCont.controller('topicShareParse',['$scope','$timeout','$stateParams','$ionicSlideBoxDelegate','$ionicScrollDelegate','topicContHttpService',function($scope,$timeout,$stateParams,$ionicSlideBoxDelegate,$ionicScrollDelegate,topicContHttpService){
   	$scope.doubleViewTopic=1;//双view下的初始化题序
    //获取目录下练习题目
    var questionId=GetQueryString("questionId");//练习ID
   		$scope.questionId=questionId;
   		topicContHttpService.getSearchQuestion(questionId).then(function(res){
   			var data=res.data;
   			if(data.result){
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

					    })
	   		}
	   })

}]);