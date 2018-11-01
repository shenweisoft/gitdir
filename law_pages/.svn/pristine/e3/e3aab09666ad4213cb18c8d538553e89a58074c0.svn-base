
angular.module('sbAdminApp').controller('AIOCourtIndexCtrl', function (PoliceConfig,PoliceService,AdminConstant,$location,$scope, $stateParams, $state, $http, $log, AlgorithmConfig, AlgorithmService, DictionaryConfig, toaster, $filter,IdentityService) {
  
  $scope.showDemond = false;
  var nowDate = $filter('date')(new Date(), 'yyyy年MM月dd日 HH:mm:ss');
  var bigWeek = new Array("日", "一", "二", "三", "四", "五", "六");
  
  $scope.now = {
    nowDay: nowDate.substring(0, nowDate.indexOf(" ")),
    nowTime: nowDate.substring(nowDate.indexOf(" ")+1),
    nowWeek: "星期" + bigWeek[new Date().getDay()],
  }
  
  $scope.initDate = function(){
    setInterval(function () {
      $scope.$apply(function () {
        $scope.now.nowTime = $filter('date')(new Date(), 'yyyy年MM月dd日 HH:mm:ss').substring(nowDate.indexOf(" ")+1)
      });
    }, 1000);
  }()
  
  /**
   * 赔付试算
   */
  $scope.prejudge = function(){
    $state.go('AIOCourtSetpBox');
  }
  
  /**
   * 官方微信
   */
  $scope.weChat = function(){
    $scope.showDemond = !$scope.showDemond
  }
});