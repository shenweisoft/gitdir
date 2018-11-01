
angular.module('sbAdminApp').directive('leftStepLeft', ['$location', function() {
  return {
    templateUrl: 'views/pages/AIOCourt/AIOCourtSetpLeft.html',
    restrict: 'EA',
    replace: true,
    scope: {},
    controller: function($scope, LoginService, DictionaryConfig, $log, $state, $rootScope) {
       
        $scope.stepArray = [{
            id: "1",
            value: "基本信息"
        },{
            id: "2",
            value: "治疗情况和伤残"
        }, {
            id: "3",
            value: "医疗相关费用"
        }, {
            id: "4",
            value: "财产损失"
        }, {
            id: "5",
            value: "赔付结果"
        }]

        $rootScope.$on('$stateChangeStart',
        function(event, toState, toParams, fromState, fromParams) {
            $scope.stepId = toState.url.replace('/AIOCourtSetp',"")
            
        })
       
    }
  }


}])
