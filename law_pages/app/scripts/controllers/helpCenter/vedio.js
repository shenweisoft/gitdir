/**
 * Created by Administrator on 2017/8/15 0015.
 */
'use strict';
var app = angular.module('sbAdminApp');
app.filter('stringCon', function() {
  return function(str) {
    if(str)
    {
      str = "image/" + str;
    }
    return str && str;
  }
});
angular.module('sbAdminApp').controller('vedioCtrl', function($scope, $modal,LoginService,LoginConfig,DictionaryConfig,toaster,$rootScope) {

  $scope.queryJyHelpInfoListService = LoginService.queryJyHelpInfoList;
  $scope.queryJyHelpInfoCountListService = LoginService.queryJyHelpInfoCountList;
  //每页显示条数
  $scope.itemNum = DictionaryConfig.pageNum;
  var level = {
    "warn": "warn",
    "error": "error",
    "success": "success"
  }
  var title = {
    "error": "错误",
    "success": "成功"
  }
  //查询数据
  $scope.queryData={
    pageSize:DictionaryConfig.pageNum,
    type: '2'
  }
  //获取初始数据
  $scope.getDataInfo = function(pageNo,pageSize){
    $scope.queryData.pageNo = pageNo;
    $scope.queryJyHelpInfoListService($scope.queryData).success(function(result) {
      var data = result.result;
      console.log(data);
      if (result.code == LoginConfig.commonConStant.SUCCESS) {
        $scope.showList = data;
        $scope.doclist = data;
      } else {
        $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageBackend);
      }
    })
    //获取总条数
    $scope.queryJyHelpInfoCountListService($scope.queryData).success(function(result) {
      var data = result.result;
      console.log(data);
      if (result.code == LoginConfig.commonConStant.SUCCESS) {
        $scope.queryData.totalItems = data;
      } else {
        $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageBackend);
      }
    })
  }

  $scope.getDataInfo(1);

  $scope.pageChanged = function () {
    $scope.getDataInfo($scope.queryData.currentPage, DictionaryConfig.pageNum);
  }

  $scope.downloadFile = function (file) {
    var path  = file.path.replace(/\\/g,"/");
    return LoginConfig.interfaceConstant.downloadHelpFile + "?fileName="+path + "&realName="+file.name;
  }

  $scope.play = function (vedio) {
    var modalInstance = $modal.open({
      templateUrl: 'views/pages/helpCenter/play.html',
      controller: 'playCtrl',
      size: 'lg',
      resolve: {
        items: function () {
          return {
            vedio: vedio
          }
        }
      }
    });
    //返回值
    modalInstance.result.then(function (data) {
      $scope.refreshAllData();
    }, function () {
    });
  }
  
  $scope.queryAll = function () {
    if($scope.searchName){
      $scope.showList = [];
      $scope.doclist.forEach(function (v) {
        if(v.name.indexOf($scope.searchName) != -1){
          $scope.showList.push(v);
          $scope.queryData.totalItems = $scope.showList.length;
        }
      })
    }else{
      $scope.getDataInfo()
    }

  }

})

angular.module('sbAdminApp').controller('playCtrl', function($scope, items,$modalInstance) {

$scope.vedio = items.vedio;

  //点击关闭
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

  //ie9一下检查flash版本
  function hasflash() {
    if(navigator.appName == "Microsoft Internet Explorer"&&parseInt(navigator.appVersion.split(";")[1].replace(/[ ]/g, "").replace("MSIE",""))<10){
      if (!FileAPI.hasFlash) {
        $scope.haveNoFlash = true;
        $rootScope.toaster("warn", '提示',"请先安装或者升级flash！");
      }
    }
  }

  hasflash();
  $scope.checkflash = function () {
    if($scope.haveNoFlash ){
      $rootScope.toaster("warn", '提示',"请先安装或者升级flash！");
    }
  }

})