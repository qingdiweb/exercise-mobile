/*目录下做题*/
topicCont.controller('pdfCont',['$scope','$timeout','$stateParams','topicContHttpService','topicContService',function($scope,$timeout,$stateParams,topicContHttpService,topicContService){
/*    $timeout(()=>{
    	console.log($('.topicCont').width(),$('.topicCont').height())
    	$("body").css('height',$('.topicCont').height());
    },1000)
    */
    
     //获取目录下练习题目
    var loginToken=GetQueryString("loginToken"),
    	questionIds=GetQueryString("questionIds");//练习ID
    	//打印当天作业
	   let homeworkTime=new Date(),
		    M=homeworkTime.getMonth()+1<10 ? '0'+(homeworkTime.getMonth()+1)+'月' : (homeworkTime.getMonth()+1)+'月',
		    D=homeworkTime.getDate()<10 ? '0'+homeworkTime.getDate()+'日' : homeworkTime.getDate()+'日';
		    $scope.homeworkTime=M+D+'作业';
   		topicContHttpService.getPdfQuestionList(loginToken,questionIds).then(function(res){
   			var data=res.data;
   			if(data.result){
   				var questionList=data.data;
	   				for (var i = 0; i < questionList.length; i++) {
	   					//转换单选题类型格式
	   					var questionInfo = questionList[i];
	   					if(questionInfo.type == 0){
	   							//转换选项类型格式
	   							var options=questionInfo.options!=null&&questionInfo.options!='' ? JSON.parse(questionInfo.options) : [],
	   								chartName=["A","B","C","D","E","F","G","H","I","J","K","L","M","N"];
	   								questionInfo.option=[];
	   								for (var j = 0; j < options.length; j++) {
	   									var optionsObj={"title":chartName[j],"option":options[j]};
	   										questionInfo.option.push(optionsObj);
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
	   								questionInfo.answer=questionInfo.answer.split(",");	   								
		   						}
	   					}
	   					//转换多问题类型格式
	   					if(questionInfo.type == 4){
	   							var questionInfoList=questionInfo.childQuestionInfoList;//双view下的题的内容数据
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
				   							var options=questionInfoList[j].options!=null&&questionInfoList[j].options!='' ? JSON.parse(questionInfoList[j].options) : [],
				   								chartName=["A","B","C","D","E","F","G","H","I","J","K","L","M","N"];
				   								questionInfoList[j].option=[];
				   								for (var m = 0; m < options.length; m++) {
				   									var optionsObj={"title":chartName[m],"option":options[m]};
				   										questionInfoList[j].option.push(optionsObj);
				   								}
					   						//转换选项类型格式
					   						if(!!questionInfoList[j].answer){
				   								questionInfoList[j].answerr=questionInfoList[j].answer.split(",");
					   						}
				   							
				   					}
				   					//双view下-转换考点类型格式
				   					if(!!questionInfoList[j].knowledges){
			   							questionInfoList[j].knowledges=questionInfoList[j].knowledges.split(",");
				   					}
	   							}
	   							
	   					}
	   					//所有题型-转换考点类型格式
	   					if(!!questionInfo.knowledges){
	   						questionInfo.parseKnowledges = [];
   							questionInfo.parseKnowledges=questionInfo.knowledges.split(",");
	   					}
	   				}
	   				$scope.exerciseQuestionInfoList=questionList;
	   				if (document.all) {  
	   					console.log('加载完成')
			            $('script').onreadystatechange = function() {  
			                var state = this.readyState;  
			                if (state === 'loaded' || state === 'complete') {  
			                    alert(1)
			                }  
			            }  
			        } 
   			}else{
	   			//接口请求失败
	   			window.errorCollect.finishLoading(0);
	   		}
   		})
}]);
