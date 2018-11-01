angular.module('sbAdminApp').controller('LitigationPaymentCtrl', function($scope, $log, $state, $stateParams, LawConfig, LawService, DictionaryConfig, Upload, toaster,$rootScope) {
  //数据Service
  $scope.lawService = LawService;
  
  var level = DictionaryConfig.toaster.level
  var title = DictionaryConfig.toaster.title
  
  //案由类型
  $scope.factTypeList = DictionaryConfig.factTypeList;
  $scope.payType = 1;
  
  $scope.serialNo = $stateParams.serialNo;
  $scope.defaultImg = "views/images/_r2_c2.png";
  
  $scope.initFeeData = function(){
    $scope.lawService.queryLawPayInfo({
      serialNo:$scope.serialNo
    }).success(function(res){
      $scope.fee = res.result;
      if(!$scope.fee.path) $scope.fee.path = $scope.defaultImg;
      console.log($scope.fee)
      if($scope.fee.extPro)  $scope.fee.extPro = JSON.parse($scope.fee.extPro);
    })
  }
  $scope.initFeeData();
  
  //查询用户角色 personType    0:原告  1:被告 法官:2
  $scope.queryLawBindInfo = function () {
    $scope.lawService.queryLawBindInfo({
      "serialNo": $scope.serialNo
    }).success(function (result) {
      if(result.code ==  LawConfig.commonConstant.SUCCESS ){
        $scope.userType = result.result.personType;
      }else{
        $rootScope.toaster(level.error, title.error, result.message);
      }
    })
  }
  $scope.queryLawBindInfo();
  
  $scope.goBack = function(){
    var forward = $stateParams.forward;
    if(forward=='1'){
      $state.go("dashboard.online_session", {"serialNo":$scope.serialNo});
    }else if(forward=='2'){
      $state.go("dashboard.handleLawList");
    }else{
      $state.go("dashboard.payment", {"serialNo":$scope.serialNo});
    }
  }
  
  //批量证据增加
  $scope.imageAddress = LawConfig.pictureConstant.bigPictureUrl;
  $scope.addBankForm = function(file) {
    imageSize(file);
    if(!file) return;
    if (file) {
        var fileName = file.name.substring(0,file.name.lastIndexOf('.'));
        $scope.uploadPicture(fileName,file);
    }
  };
  
  //上传图片
  $scope.uploadPicture = function(fileName,file){
    Upload.upload({
      url: LawConfig.pictureConstant.uploadImageUrl,
      data: {
        file: file,
        type: 'bankForm'
      }
    }).success(function(resp) {
      $scope.fee.path = resp.result;
    });
  };
  
  $scope.payComplete = function(){

    if($scope.fee.path.indexOf("_r2_c2.png") > 0){
      $rootScope.toaster(level.error, title.error, "请您上传图片！");
    }else{
      $scope.lawService.saveLawPayInfo({
        serialNo:$scope.serialNo,
        payType:1,
        path:$scope.fee.path,
        payMoney:$scope.fee.acceptanceFee
      }).success(function(res){
        if(res.code ==  LawConfig.commonConstant.SUCCESS ){
          $rootScope.toaster(level.success, title.success, "缴费成功");
          $scope.fee.payState = 1;
        }else{
          $rootScope.toaster(level.error, title.error, result.message);
        }
      });
    }
  };
  //
  $scope.queryMoney = function(){
    $rootScope.toaster("warn", "提示", "该法院还未开通！");
  }

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

  //限制图片大小
  function imageSize(file) {
    if(file){
      if(parseInt(file.size/(1024*1024))>= 10 ){
        $rootScope.toaster(level.warn, title.warn,"请上传小于10M大小的图片");
      }
    }
  }
});