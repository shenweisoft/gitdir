/**
 * Created by Administrator on 2017/4/7 0007.
 */
/**
 * 文书列表 controller
 */
angular.module('sbAdminApp').controller('instrumentCtrl', function ($scope, $log, $state, $rootScope, $stateParams, $http, $location, $timeout, $modal, $modalInstance, LawService, LawConfig, DictionaryConfig, Upload, toaster, items) {
  $scope.isSelf = $rootScope.buttSelf;
  //数据接口Service
  $scope.lawService = LawService;
  $scope.items = items;

  
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
  
  function Instrument (){
    this.type = "";
    this.instrumentArray = [];
  }
  
  //初始化文书数据
  $scope.levelArray = [], $scope.num = 0;
  $scope.initInstrument = function(){
    $scope.lawService.viewInstrument({
      serialNo : $stateParams.serialNo
    }).success(function(res) {
      console.log(res)
      if (res.code == LawConfig.commonConstant.SUCCESS) {
        if(res.result.length > 0){
          var instrument = new Instrument();
          res.result.forEach(function(v, i){
            if($scope.items.userType == '1' && $scope.items.law.adjustResult == '4'){
              if(v.wordType != 0){
                $scope.checkFileExist(v);
                if(instrument.type != v.type){
                  if(i != 0) $scope.levelArray.push(instrument);
                  instrument = new Instrument();
                  instrument.type = v.type;
                  instrument.instrumentArray.push(v);
                }else{
                  instrument.instrumentArray.push(v);
                }
              }
            }else{
              $scope.checkFileExist(v);
              if(instrument.type != v.type){
                if(i != 0) $scope.levelArray.push(instrument);
                instrument = new Instrument();
                instrument.type = v.type;
                instrument.instrumentArray.push(v);
              }else{
                instrument.instrumentArray.push(v);
              }
            }


          })
          $scope.levelArray.push(instrument);
          $scope.num = res.result.length;
        }
      } else {
        toaster.pop(level.error, title.error, $scope.CONSTANT.messageBackend);
      }
    }).error(function(res){
      $log.log(res);
    })
  }
  $scope.initInstrument();
  
  //上传文档
  $scope.uploadInstrument = function(file, instrument){
    Upload.upload({
      url: LawConfig.fileConstant.uploadUrl,
      data: {
        file: file,
        docId: instrument.id,
        serialNo: instrument.serialNo
      }
    }).success(function(resp) {
      toaster.pop(level.success, title.success, $scope.CONSTANT.messageUploadSuccess);
      instrument.isFileExist = true;
    });
  }
  
  //下载文档
  $scope.buildUrl = function(instrument){
    return LawConfig.fileConstant.downloadInstrumentUrl + "?docId="+instrument.id;
  }
  
  $scope.checkFileExist = function(instrument){
    $scope.lawService.isFileExist({
      docId : instrument.id
    }).success(function(res) {
      if(res.code == -1){
        instrument.isFileExist = false;
      }else{
        instrument.isFileExist = true;
      }
    })
  }
  
  //点击关闭
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

  //ie9一下检查flash版本
  function hasflash() {
    if(navigator.appName == "Microsoft Internet Explorer"&&parseInt(navigator.appVersion.split(";")[1].replace(/[ ]/g, "").replace("MSIE",""))<10){
      if (!FileAPI.hasFlash) {
        $scope.haveNoFlash = true;
        toaster.pop("warn", '提示',"请先安装或者升级flash！");
      }
    }
  }

  hasflash();
  $scope.checkflash = function () {
    if($scope.haveNoFlash ){
      toaster.pop("warn", '提示',"请先安装或者升级flash！");
    }
  }
})