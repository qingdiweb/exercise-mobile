//目录下做题
topicCont.directive('pdfDirective', ['$state','$stateParams','$timeout','$ionicSlideBoxDelegate','$window','topicContHttpService', function($state,$stateParams,$timeout,$ionicSlideBoxDelegate,$window,topicContHttpService){
	return {
		restrict: 'A',
		link: function(scope,ele,attrs){
		  	if (scope.$last === true) {
		  		console.log('pdf')
                $timeout(function() {
                	console.log("渲染完成")
                   /* scope.$emit('ngRepeatFinished');*/
                   window.questionsJS.renderComplete(1);
                });
            }
		}			
	}
}]);

	
