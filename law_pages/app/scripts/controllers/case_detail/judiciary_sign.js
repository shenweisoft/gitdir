/**
 * Created by Administrator on 2017/9/6 0006.
 */
'use strict';
var app = angular.module('sbAdminApp');
app.filter('id2Text', function() {
  return function(id,data) {
    var result = _.find(data, {
      id: id+""
    });
    return result? result.value:""
  }
});

app.filter('idToText', function() {
  return function(id,data) {
    var result = _.find(data, {
      id: id+""
    });
    return result? result.text:""
  }
});

angular.module('sbAdminApp').controller('DossierDetailCtrl', function($scope,LoginConfig, $stateParams, $state, $location, $timeout, $http, $log, AdjustConfig,AdjustService, LawService,DictionaryConfig, toaster,Upload,LawConfig,$rootScope) {

  //定义阶段状态
  $scope.stageList = {
    "adjustState":"1",//调解阶段
    "litigationState":"2",//诉讼阶段
    "handlingState":"3"//办案阶段
  };

  //shenwei
  //调解结果
  $scope.ajustResultArray = DictionaryConfig.adjustResultList;
  //主表头信息详细查询Service
  $scope.queryLawDetailService = LawService.queryLawDetail;
  //缩略图地址
  $scope.imageAddress = AdjustConfig.pictureConstant.smallPictureUrl;
  //放大图地址
  $scope.bigImageAdress = AdjustConfig.pictureConstant.bigPictureUrl;
  //获取图片列表
  $scope.getImageFileService = AdjustService.getImageFile;
  //删除图片
  $scope.deleteFileService = AdjustService.deleteFile;

  $scope.getDocumentFileSerivce = AdjustService.getDocumentFile;

  //shenwei is very good!

  function Image() {
    this.id = '';
    this.name = '';
    this.path = '';
    this.progressPercentage = 0;
  }

  //查询头部数据(根据流程查询相应的信息)
  $scope.queryLawDetailService({
    "serialNo": $stateParams.serialNo
  }).success(function (result) {
    $log.info(result);
    if(result.code ==  AdjustConfig.commonConStant.SUCCESS){
      $scope.showFlag = true;
      $scope.law = result.result;
    }else{
      $rootScope.toaster("error", "错误", result.message);
    }
  });

  //获取图片
  $scope.getFile = function () {

    $scope.getDocumentFileSerivce({
      serialNo:$stateParams.serialNo
    }).success(function (res) {

      $log.info(res);

      if (res.code == AdjustConfig.commonConStant.SUCCESS) {
        $scope.imageList = [];
        $scope.fileList = [];
        if(res.result){
          res.result.forEach(function (v) {
            if(v.picture){
              $scope.imageList.push(v);
            }else{
              $scope.fileList.push(v);
            }

          })
        }
      } else {
        $rootScope.toaster("error", "错误", res.message);
      }
    })
  }
  $scope.getFile();




  //上传文件
  $scope.uploadFileOne = function(fileName,file, wordType, name,id){
    Upload.upload({
      url: LawConfig.fileConstant.uploadUrl,
      data: {
        file: file,
        docId:id,
        serialNo:$stateParams.serialNo
      }
    }).success(function(res){
      if(res.code ==  LawConfig.commonConstant.SUCCESS){
        $rootScope.toaster(DictionaryConfig.toaster.level.success, DictionaryConfig.toaster.title.success, "文件上传成功!");
        $scope.isFileExist = true;
      }
    })
  }

  //上传文件
  $scope.uploadFileWord = function(file,object){
    $log.info("shenwei");
    $log.info(object);
    if(!file) return;
    if (file && file) {
      var fileName = file.name.substring(0,file.name.lastIndexOf('.'));
      $scope.uploadFileOne(fileName, file, object.wordType, object.name,object.id);
    }
  };




  //批量上传文件
  $scope.uploadFile = function(files){
    if(!files) return;
    if (files && files.length) {
      for (var i = 0; i < files.length; i++) {
        var fileName = files[i].name.substring(0,files[i].name.lastIndexOf('.'));
        $scope.uploadDocPicture(fileName,files[i]);
      }
    }
  };
  //上传文件
  $scope.uploadDocPicture = function(fileName,file){
    if(file){
      var type = file.name.split('.')[1];
      //if(type == 'jpg'|| type == 'png'){
        var image = new Image();
        $scope.imageList.push(image);
      //}
      Upload.upload({
        url: AdjustConfig.pictureConstant.uploadFileUrl,
        data: {
          file: file,
          name: fileName,
          type: '109',
          wordType: '40',
          serialNo:$stateParams.serialNo
        }
      }).progress(function (evt) {
        //if(type == 'jpg'|| type == 'png'){
          image.progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
        //}
      }).success(function(res) {
        //if(type == 'jpg'|| type == 'png'){
          image.path = res.result
        //}
        $scope.getFile();
        //toaster.pop("success", "成功", "文件上传成功!");
      });
    }
  }
  //下载鉴定报告
  $scope.downloadFile = function (file) {
    return LawConfig.fileConstant.downloadInstrumentUrl + "?docId="+file.id;
  }
  //删除文件
  $scope.deleteFile = function (id) {
    if(confirm("确定删除吗？")){
      $scope.deleteFileService({id:id}).success(function (res) {
        if (res.code == AdjustConfig.commonConStant.SUCCESS) {
          $scope.getFile();
          if(res.result == '1'|| res.result == '18'){
            window.opener.location.reload();
          }
        } else {
          $rootScope.toaster("error", "错误", res.message);
        }
      })
    }else{
      return false;
    }
  }


});