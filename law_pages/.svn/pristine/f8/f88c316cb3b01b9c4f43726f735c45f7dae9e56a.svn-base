/**
 * Created by Administrator on 2017/8/15 0015.
 */
angular.module('sbAdminApp').controller('helpDocumentCtrl', function($scope, $stateParams,toaster,LoginService,LoginConfig,DictionaryConfig,$rootScope) {
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
    type: '1'
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

  //下载文档
  $scope.downloadFile = function (file) {
    var path  = file.path.replace(/\\/g,"/");
    return LoginConfig.interfaceConstant.downloadHelpFile + "?fileName="+path + "&realName="+file.name;
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