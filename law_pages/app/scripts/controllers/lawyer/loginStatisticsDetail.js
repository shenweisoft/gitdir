/**
 * Created by shenwei on 2017/4/20.
 */
var app = angular.module('sbAdminApp');
app.filter('stringDate', function() {
  return function(dt) {
    if(typeof (dt) == "string")
    {
      dt = dt.replace(/\-/gi,"\/");
      dt = Date.parse(dt);
    }
    return dt && dt;
  }
});
angular.module('sbAdminApp').controller('loginStatisticsDetailCtrl', function ($scope, $stateParams, $state, $location, $timeout, $http, $log, DictionaryConfig, LawService, $filter, LawConfig,toaster, LoginService, $rootScope, AdjustService, LoginConfig, AdjustConfig) {
  var loginStatisticsVO = JSON.parse($stateParams.loginStatisticsVO);
  $scope.queryUserLoginVO = {
    userId: $stateParams.userId,
    startDate: loginStatisticsVO.startDate,
    endDate: loginStatisticsVO.endDate,
    lawOrgCode: loginStatisticsVO.lawOrgCode,
    areaName: loginStatisticsVO.areaName,
    orgId: loginStatisticsVO.orgId,
    deptId: loginStatisticsVO.deptId,
    pageNo: '1',
    pageTotal: '0',
    pageSize: '10'
  };
  $scope.userName = $stateParams.userName;

  $scope.userLoginInfoList = [];

  $scope.initData = function () {
    //获取当前用户登录信息表
    $scope.queryUserLoginInfo()
  };

  //获取登录状态信息表
  $scope.queryUserLoginInfo = function () {
    console.log($scope.queryUserLoginVO)
    //请求后台，获取数据
    AdjustService.selectByUserIdListUrl($scope.queryUserLoginVO).success(function (res) {
      console.log(res)
      if(res.code == '0') {
        $scope.userLoginInfoList = res.result;
      } else {
        $rootScope.toaster("error", "错误",res.message);
      }
    })
    //请求后台，获取总条数
    AdjustService.selectByUserIdCountUrl($scope.queryUserLoginVO).success(function (res) {
      if(res.code == '0') {
        $scope.queryUserLoginVO.pageTotal = res.result;
      } else {
        $rootScope.toaster("error", "错误",res.message);
      }
    });
  };

  //点击分页
  $scope.pageChanged = function () {
    $scope.queryUserLoginInfo();
  };

  //返回
  $scope.returnLoginStatistics = function () {
    $state.go('dashboard.loginStatisticsList');
  };

  $scope.initData();
});