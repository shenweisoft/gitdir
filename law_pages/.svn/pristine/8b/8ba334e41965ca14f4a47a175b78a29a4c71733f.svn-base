angular.module('sbAdminApp').controller('AIOHomePageCtrl', function (AdminConstant,$location,$scope, $stateParams, $timeout, $state, $interval) {
  $scope.methodIdNo = function () {
    //跳转到输入界面
    $timeout(function () {
      $state.go("AIOInputIdNo");
    }, 101)
  };
  $scope.methodScanIdNo = function (flag) {
    //跳转到扫描身份证界面
    $timeout(function () {
      $state.go("AIOScanIdNo", {flag: flag});
    }, 101)
  };

  $scope.showWx = false;

  var weekMap = {
    week1 : '星期一',
    week2 : '星期二',
    week3 : '星期三',
    week4 : '星期四',
    week5 : '星期五',
    week6 : '星期六',
    week0 : '星期日'
  };

  //获取当前时间
  function getDate() {
    var date = new Date();
    $scope.dateY = dateAddZero(date.getFullYear());
    $scope.dateM = dateAddZero(date.getMonth()+1);
    $scope.dateD = dateAddZero(date.getDate());
    $scope.dateH = dateAddZero(date.getHours());
    $scope.dateF = dateAddZero(date.getMinutes());
    $scope.dateS = dateAddZero(date.getSeconds());
    $scope.dateW = weekMap['week'+date.getDay()];
  }
  //时间补0
  function dateAddZero(num) {
    return num > 9? num : '0'+num;
  }
  
  $interval(getDate, 500)
});