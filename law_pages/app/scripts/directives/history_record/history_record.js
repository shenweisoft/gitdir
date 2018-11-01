/**
 * Created by Administrator on 2017/4/19 0019.
 */
angular.module('sbAdminApp').directive('historyRecord', function() {
  return {
    templateUrl: 'scripts/directives/history_record/history_record.html',
    restrict: 'EA',
    replace: true,
    scope: false,
    controller:function ($scope,LawConfig,$log,LawService,toaster,$stateParams,AppraisalService,$rootScope) {
      //查询历史记录
      $scope.queryWokFlow = function(){
        LawService.queryJyWorkFlow({
          "serialNo": $stateParams.serialNo
        }).success(function (result) {
          if(result.code ==  LawConfig.commonConstant.SUCCESS ){
            $scope.jyWorkFlowVOList = result.result;
          }else{
            $rootScope.toaster("error", "错误", result.message);
          }
        })
      }
      //查询鉴定历史记录
      $scope.queryAppraisalWorkFlow = function () {
        AppraisalService.queryAppraisalWorkFlow({
          "appraisalNo": $stateParams.appraisalNo
        }).success(function (result) {
          if(result.code ==  LawConfig.commonConstant.SUCCESS ){
            $scope.jyWorkFlowVOList = result.result;
          }else{
            $rootScope.toaster("error", "错误", result.message);
          }
        })
      }
      //查询鉴定历史记录
      if($stateParams.appraisalNo){
        $scope.queryAppraisalWorkFlow();
      }else{
        $scope.queryWokFlow();
      }

    }
  }

});
