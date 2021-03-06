topicCont.factory('topicContHttpService', ['$http',function($http){
 	var service = {},
 		isTemporary=true,
 		/*host='https:/api.huazilive.com/v1';//正式*/
 		//host='http://59.110.6.198/api/tiku';//临时
 		host=isTemporary==true ? 'https://test.huazilive.com/api/tiku' : 'https://api.huazilive.com/api/tiku';
 		
 	//获取目录下做题题目信息
 	service.getDirectoryTopiceData = function(loginToken,studentExerciseId){
 		return $http({
					url: host+'/account/student/textbook/exercise/question',
					method: 'GET',
					params: {"loginToken":loginToken,"studentExerciseId":studentExerciseId}
				})
 	};
 	//目录下-提交答案
 	service.getDirectorySubmitAnswer = function(loginToken,studentExerciseId,exerciseQuestionId,questionId,answer){
 		return $http({
					url: host+'/account/student/textbook/exercise/answer',
					method: 'GET',
					params: {"loginToken":loginToken,"studentExerciseId":studentExerciseId,"exerciseQuestionId":exerciseQuestionId,"questionId":questionId,"answer":answer}
				})
 	};
 	//试卷-做题
 	service.getPaperTopiceData = function(loginToken,studentPaperId){
 		return $http({
					url: host+'/account/student/paper/question',
					method: 'GET',
					params: {"loginToken":loginToken,"studentPaperId":studentPaperId}
				})
 	};
 	//试卷-提交答案
 	service.getPaperSubmitAnswer = function(loginToken,studentPaperId,paperQuestionId,questionId,answer){
 		return $http({
					url: host+'/account/student/paper/answer',
					method: 'GET',
					params: {"loginToken":loginToken,"studentPaperId":studentPaperId,"paperQuestionId":paperQuestionId,"questionId":questionId,"answer":answer}
				})
 	};
 	//获取错题本
 	service.getWrongTopic= function(loginToken,stageId,subjectId,createdAtStart,createdAtEnd,pageNumber,pageSize,pageTotal){
 		return $http({
					url: host+'/account/student/question/wrong/list',
					method: 'GET',
					params: {"loginToken":loginToken,'stageId':stageId,"subjectId":subjectId,'createdAtStart':createdAtStart,'createdAtEnd':createdAtEnd,"pageNumber":pageNumber,"pageSize":pageSize,"pageTotal":pageTotal}
				})
 	};
 	//删除错题本
 	service.getDelWrongTopic= function(loginToken,questionId){
 		return $http({
					url: host+'/account/student/question/wrong/remove',
					method: 'GET',
					params: {"loginToken":loginToken,"questionId":questionId}
				})
 	};
 	//获取收藏列表
 	service.getCollectList= function(loginToken,stageId,subjectId,pageNumber,pageSize,pageTotal){
 		return $http({
					url: host+'/account/student/question/collect/list',
					method: 'GET',
					params: {"loginToken":loginToken,'stageId':stageId,"subjectId":subjectId,"pageNumber":pageNumber,"pageSize":pageSize,"pageTotal":pageTotal}
				})
 	};
 	//获取收藏列表中的题目
 	service.getCollectQuestionList= function(loginToken,collectId,pageNumber,pageSize,pageTotal){
 		return $http({
					url: host+'/account/student/collect/question/list',
					method: 'GET',
					params: {"loginToken":loginToken,'collectId':collectId,"pageNumber":pageNumber,"pageSize":pageSize,"pageTotal":pageTotal}
				})
 	};
 	//移除收藏中题目
 	service.getDelCollectTopic= function(loginToken,questionId){
 		return $http({
					url: host+'/account/student/question/collect/remove',
					method: 'GET',
					params: {"loginToken":loginToken,"questionId":questionId}
				})
 	};
 	//作业-分享试题详情页面
 	service.getShareParseData = function(loginToken,id){
 		return $http({
					url: host+'/account/student/textbook/exercise/question',
					method: 'GET',
					params: {"loginToken":loginToken,"id":id}
				})
 	};
 	//PDF打印-获取题目列表
 	service.getPdfQuestionList = function(loginToken,questionIds){
 		return $http({
					url: host+'/account/teacher/question/find',
					method: 'GET',
					params: {"loginToken":loginToken,"questionIds":questionIds}
				})
 	};
 	//互动课堂错题本
 	service.getClassroomWrong = function(loginToken,stageId,subjectId,createdAtStart,createdAtEnd,pageNumber,pageSize){
 		return $http({
					url: host+'/account/student/question/quizWrong/list',
					method: 'GET',
					params: {"loginToken":loginToken,'stageId':stageId,'subjectId':subjectId,'createdAtStart':createdAtStart,'createdAtEnd':createdAtEnd,'pageNumber':pageNumber,'pageSize':pageSize}
				})
 	};
 	//删除互动课堂错题本
 	service.getDelClassroomWrongTopic= function(loginToken,questionId){
 		return $http({
					url: host+'/account/student/question/quizWrong/remove',
					method: 'GET',
					params: {"loginToken":loginToken,"questionId":questionId}
				})
 	};
 	//根据id查询题目信息
 	service.getSearchQuestion= function(questionId,loginToken){
 		return $http({
					url: host+'/config/question',
					method: 'GET',
					params: {"loginToken":loginToken,"questionId":questionId}
				})
 	};
 	return service;
 }]);

//练习题全局
topicCont.factory('topicContService', [function(){
	var service = {};
	service.paperSlide="";
	return service;
}]);