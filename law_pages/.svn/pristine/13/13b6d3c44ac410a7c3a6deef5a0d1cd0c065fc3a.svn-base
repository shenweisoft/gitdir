
angular.module('sbAdminApp').filter('stringDate', function () {
  return function (dt) {
    if (typeof (dt) == "string") {
      dt = dt.replace(/\-/gi, "\/");
      dt = Date.parse(dt);
    }
    return dt && dt;
  }
});

angular.module('sbAdminApp').filter('id2Text', function() {
  return function(id,data) {
    var result = _.find(data, {
      id: id+""
    });
    return result? result.value:""
  }
});

angular.module('sbAdminApp').controller('PoliceHistoryListCtrl', function (AdminConstant,$location,$scope, $stateParams, $state, $http, $log, PoliceConfig, PoliceService, DictionaryConfig, toaster,LawConfig,$rootScope) {
  //案由
  $scope.causeTypeList = PoliceConfig.causeTypeList;

  //定义分页对象
  $scope.searchVO = {
    state: '1001',
    pageNo: '1',
    pageSize: '10', //每页条数
    searchInfo: '', //搜索框文字
    totalPage: 0 //总页数
  };

  //定义页面对象
  $scope.policeList = [];

  var infoData = function(data) {
    //获取列表数据
    PoliceService.queryPoliceInfoListInfo(data).success(function (res) {
      if(res.code == PoliceConfig.commonConstant.SUCCESS){
        $scope.policeList = res.result;
        console.log(res)
      }else {
        $rootScope.toaster("error", "错误", res.message);
      }
    });

    //获取数据总页数
    PoliceService.queryPoliceInfoSumInfo(data).success(function (res) {
      if(res.code == PoliceConfig.commonConstant.SUCCESS){
        $scope.searchVO.totalPage = res.result;
        console.log(res)
      }else {
        $rootScope.toaster("error", "错误", res.message);
        $rootScope
      }
    });
  };

  //点击搜索
  $scope.handleSearch = function () {
    $scope.searchVO.pageNo = '1';
    infoData($scope.searchVO);
  };

  //点击分页跳转页面
  $scope.initOrg = function () {
    var data = angular.copy($scope.searchVO);
    data.searchInfo = '';
    infoData(data);
  };

  //查案案件
  $scope.handleCheck = function (id) {
    $state.go('dashboard.checkPolice', {policeId: id});
  };

  //初始化数据
  infoData($scope.searchVO);
});