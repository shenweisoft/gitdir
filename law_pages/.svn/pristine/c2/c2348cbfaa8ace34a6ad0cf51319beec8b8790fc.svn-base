angular.module('sbAdminApp').controller('appraisalCommentCtrl', function ($scope,$modalInstance,AppraisalConfig,AppraisalService,orgId,toaster) {
  //查询评价
  $scope.queryAppraisalEvaluateListService = AppraisalService.queryAppraisalEvaluateList;
  //点击关闭
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
  $scope.orgId =  orgId;
  $scope.isBelieve = 0;
  $scope.isFully = 0;
  $scope.efficiency = 0;
  $scope.cooperate = 0;
  $scope.queryAppraisalEvaluateListService({"orgId":$scope.orgId}).success(function (result) {
    if(result.code == AppraisalConfig.commonConstant.SUCCESS){
      $scope.EvaluateList = result.result;
      //计算
      $scope.EvaluateList.forEach(function (v,i) {
        $scope.isBelieve += v.isBelieve;
        $scope.isFully += v.isFully;
        $scope.cooperate += v.cooperate ;
        $scope.efficiency += v.efficiency;
      });
      $scope.isBelieve = (parseInt($scope.isBelieve) * (5/3)) /  $scope.EvaluateList.length;
      $scope.isFully = (parseInt($scope.isFully) * (5/4)) /  $scope.EvaluateList.length;
      $scope.cooperate = (parseInt($scope.cooperate) * (5/5)) /  $scope.EvaluateList.length;
      $scope.efficiency = (parseInt($scope.efficiency) * (5/3)) /  $scope.EvaluateList.length;
      if($scope.isBelieve&&$scope.isFully&&$scope.efficiency&&$scope.cooperate){
        $scope.sumUp = parseFloat(($scope.isBelieve+$scope.isFully+$scope.efficiency+$scope.cooperate)/4).toFixed(2);
      }else{
        $scope.sumUp = 0 ;
      }

    }else{
      toaster.pop("error", "错误", result.message);
    }
  });
})
