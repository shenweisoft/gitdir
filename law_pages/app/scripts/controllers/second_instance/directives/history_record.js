/**
 * Created by Administrator on 2017/4/19 0019.
 */
angular.module('sbAdminApp').directive('secondHistoryRecord', function() {
  return {
    templateUrl: 'views/pages/second_instance/directives/history_record.html',
    restrict: 'EA',
    replace: true,
    scope: false,
    controller:function ($scope,LawConfig,$log,LawService,toaster,$stateParams,SecondLitigantionConfig, SecondLitigantionService) {

      //查询历史信息Service
      $scope.querySecondInstanceWorkFlowService = SecondLitigantionService.querySecondInstanceWorkFlow;
      //查询历史记录
      $scope.querySecondInstanceWorkFlowService({
        "serialNo":$stateParams.serialNo
      }).success(function (result) {
        if(result.code == SecondLitigantionConfig.commonConStant.SUCCESS){
          $scope.secondInstanceWorkFlowList = result.result;
          console.log($scope.secondInstanceWorkFlowList)
        }else {
          toaster.pop("error", "错误", result.message);
        }
      })

    }
  }

});
