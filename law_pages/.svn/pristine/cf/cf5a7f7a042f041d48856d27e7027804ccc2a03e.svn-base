angular.module('sbAdminApp').controller('AIOCourtSetp4Ctrl', function (PoliceConfig,PoliceService,AdminConstant,$location,$scope, $stateParams, $state, $http, $log, AlgorithmConfig, AlgorithmService, DictionaryConfig, toaster, $filter,IdentityService) {
     //提示框
  $scope.isIndex = null
  $scope.dynamicPopoverFn = function ($event,index) {
    $scope.stopprevent($event)
    index == 'leave'? $scope.isIndex = 'leave': $scope.isIndex = index
  }
  //点击关闭提示
	$scope.allClose = function ($event) {
		$scope.stopprevent($event)
		$scope.isIndex = null
    }
    $scope.step.stepId = 4; 
});