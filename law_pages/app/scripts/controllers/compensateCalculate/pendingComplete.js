'use strict';
angular.module('sbAdminApp').controller('pendingCompleteCtrl', function ($scope, $interval, $location, $state) {
  //倒计时
  ($scope.countDown =function() {
    var times = 10;
    var stop = $interval(function () {
      $scope.codeTime = times + 's';
      times --;
      if( times == 0){
        $interval.cancel(stop);
        $scope.codeTime = null;
        $scope.goBackList();
      }
      if($location.$$path.indexOf('pendingComplete')== -1){
        $interval.cancel(stop);
        $scope.codeTime = null;
      }
    },1000);
  })();
  //返回到列表页
  $scope.goBackList = function () {
    $state.go('dashboard.compensateCalculateList');
  };
});