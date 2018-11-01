
angular.module('sbAdminApp').controller('mainCtrl', function($scope, $state,PrejudgeService,PrejudgeConfig,$modal,$stateParams,LoginService,$interval,LoginConfig,$log,LawService) {
    //获取环境配置Service
    $scope.queryJyEnvironmentInfoService = LoginService.queryJyEnvironmentInfo;
   
    //获取环境配置
    $scope.queryJyEnvironmentInfoService({}).success(function(result){
      if (result.code==LoginConfig.commonConStant.SUCCESS) {
        $scope.environmentalAllocation = result.result.environmentType;
      }
    })
});
