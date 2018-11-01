/**
 * Created by Administrator on 2017/4/7 0007.
 */
/**
 * 文书列表 controller
 */
angular.module('sbAdminApp').controller('scannerCtrl', function ($scope, $log, $state, $stateParams, $http, $location, $timeout, $modal, $modalInstance, LawService, LawConfig, DictionaryConfig, Upload, toaster, items) {
  //数据接口Service
  $scope.lawService = LawService;
  $scope.items = items;
  $scope.messtitle ='contents';
  //toaster
  var level = DictionaryConfig.toaster.level;
  var title = DictionaryConfig.toaster.title;
  
  //阶段
  $scope.instrmentLevel = DictionaryConfig.caseVerifyResultCode;
  
  //本页面常量
  $scope.CONSTANT = {
    "messageBackend":"后台忙，请稍后再试!",
    "messageUploadSuccess":"文件上传成功!",
    "messageFileNotFound":"文件找不到了！"
  }
  
  function Openscanner (){
    this.type = "";
    this.instrumentArray = [];
  }
  
  //初始化文书数据

  
  //上传文档

  
  //下载文档


  
  //点击关闭
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

  //ie9一下检查flash版本

})