angular.module('sbAdminApp').controller('secondInstanceCompleteCtrl', function ($scope, $state, $stateParams, $interval, $location, SecondLitigantionConfig) {
  //获取当前案件状态
  $scope.state = $stateParams.state; //获取案件当前状态
  $scope.isAgree = $stateParams.isAgree; //获取审批结果
  console.log($scope.state);

  //剩余时间
  $scope.codeTime = "10s";

  //根据案件审批结果，获取下一环节数据
  if($scope.isAgree == "1") { //驳回
    //获取当前环节
    $scope.currentLink = SecondLitigantionConfig.lawState[parseInt($scope.state.substring(3)) + 1].value;
    //获取下一环节
    $scope.nextLink = SecondLitigantionConfig.lawState[parseInt($scope.state.substring(3))].value;
  } else {
    //获取当前环节
    $scope.currentLink = SecondLitigantionConfig.lawState[parseInt($scope.state.substring(3)) - 1].value;
    //获取下一环节
    $scope.nextLink = SecondLitigantionConfig.lawState[parseInt($scope.state.substring(3))].value;
  }

  //倒计时
  $scope.countDown =function() {
    var times = 9;
    var stop = $interval(function () {
      $scope.codeTime = times + 's';
      times --;
      if( times < 0){
        $interval.cancel(stop);
        $scope.codeTime = null;
        $scope.goBackList();
      }
      if($location.$$path.indexOf('secondInstanceComplete')== -1){
        $interval.cancel(stop);
        $scope.codeTime = null;
      }
    },1000);
  };
  $scope.countDown();

  //返回到列表页
  $scope.goBackList = function () {
    var url = $state.href('dashboard.secondInstanceLitigantionList'), flag;
    if($scope.state == "1001") {
      flag = "0";  //跳转回立案登记列表
    } else if($scope.state == "1002") {
      flag = "1";  //跳转回立案审批列表
    } else if($scope.state == "1003") {
      flag = "2";  //跳转回分案列表
    } else if($scope.state == "1004") {
      flag = "3";  //跳转回排期列表
    } else if($scope.state == "1005") {
      flag = "4";  //跳转回办案列表
    }
    window.location.href = url + "?flag=" + flag;
  };
});