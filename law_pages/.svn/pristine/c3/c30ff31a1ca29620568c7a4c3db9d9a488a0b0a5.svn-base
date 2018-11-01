
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

angular.module('sbAdminApp').controller('checkPoliceCtrl', function (AdminConstant,$location,$scope, $stateParams, $state, $http, $log, PoliceConfig, PoliceService, DictionaryConfig, toaster,LawConfig) {
  //驾驶证状态
  $scope.driverLicenseStateList = PoliceConfig.driverLicenseStateList;
  //号牌种类
  $scope.plateTypeList = PoliceConfig.plateTypeList;
  //车辆型号
  $scope.vehicleTypeList = PoliceConfig.vehicleTypeList;
  //使用性质
  $scope.usePropertyList = PoliceConfig.usePropertyList;
  //准驾车型
  $scope.vehicleList = PoliceConfig.vehicleList;
  //案由
  $scope.causeTypeList = PoliceConfig.causeTypeList;
  //鉴定机构
  $scope.identificationTypeList = PoliceConfig.identificationTypeList;

  //页面数据对象
  $scope.police = {};

  //初始化操作
  $scope.initData = function () {
    //根据id获取主表信息
    PoliceService.queryPoliceInfoAllInfo({id: $stateParams.policeId}).success(function (res) {
      if(res.code == PoliceConfig.commonConstant.SUCCESS){
        console.log(res);
        $scope.police = res.result;
      }else {
        toaster.pop("error", "错误", res.message);
      }
    });
  };

  //关闭按钮
  $scope.closeCheck = function () {
    if(confirm('确认关闭？')) {
      $state.go('dashboard.policeHistoryList');
    }
  };

  $scope.initData();
});