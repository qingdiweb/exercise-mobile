/*目录下做题*/
topicCont.controller('topicShareClassCont',['$scope','$timeout','$stateParams','$ionicSlideBoxDelegate','$ionicScrollDelegate','$ionicGesture','$ionicModal',function($scope,$timeout,$stateParams,$ionicSlideBoxDelegate,$ionicScrollDelegate,$ionicGesture,$ionicModal){
    //赋值教师名字
    let teacherName=GetQueryString("teacherName"),//教师名字
        classId=GetQueryString("classId");//班级id
    	$scope.teacherName=teacherName;
        $scope.classId=classId;
    	console.log("教师名字",teacherName)
     $ionicModal.fromTemplateUrl('templates/modal.html', {
	    scope: $scope
	  }).then(function(modal) {
	    $scope.modal = modal;
	  });
     $scope.createContact = function() {        
	    $scope.modal.hide();
	  };
	 $scope.joinClass=function(){
	 	let ua = navigator.userAgent.toLowerCase(),
            isWeixin = ua.indexOf('micromessenger') != -1;
            //立即加入 
        	console.log("点击")
            if (isWeixin) {
           　　 //alert("微信中打开的浏览器")
           		$scope.modal.show()
        　　}else{
                window.location.href="education://huazi.app/rn_student?classId="+classId+"&pageType=JoinClass"
                setTimeout(function(){
                    window.location.href="http://a.app.qq.com/o/simple.jsp?pkgname=com.edu.student"
                },3000)
                 
            }
	 }
     //顶部打开app提示
     $scope.isOpenShow=true;
     $scope.cancelDel=()=>{
        $scope.isOpenShow=false;
     } 
     $scope.openAPP=()=>{
        window.location.href="http://a.app.qq.com/o/simple.jsp?pkgname=com.edu.student"
     }   
}]);
