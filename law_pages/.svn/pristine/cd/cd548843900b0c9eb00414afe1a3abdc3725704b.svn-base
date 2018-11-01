/**
 * Created by Administrator on 2017/8/16 0016.
 */
angular.module('sbAdminApp').controller('helpManageCtrl', function($scope,$modal,LoginService,DictionaryConfig,LoginConfig,toaster,$rootScope) {

  $scope.idList = [];
  $scope.interfaceSelectAll = false;
  $scope.queryJyHelpInfoListService = LoginService.queryJyHelpInfoList;
  $scope.queryJyHelpInfoCountListService = LoginService.queryJyHelpInfoCountList;
  $scope.deleteJyHelpInfoService  =  LoginService.deleteJyHelpInfo;
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
    pageSize:DictionaryConfig.pageNum
  }

  //获取初始数据
  $scope.getDataInfo = function(pageNo,pageSize){
    $scope.queryData.pageNo = pageNo;
    $scope.queryJyHelpInfoListService($scope.queryData).success(function(result) {
      var data = result.result;
      console.log(data);
      if (result.code == LoginConfig.commonConStant.SUCCESS) {
        $scope.showList = data;
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

  //选择
  $scope.interfaceChxChange = function(){
    $scope.idList = $scope.showList.filter(function(v){
      return v.checked;
    }).map(function(x){
      return x.id;
    });
    console.log($scope.idList)
  }
  //选择所有
  $scope.interfaceToggleSelectAll = function(){
    $scope.showList.forEach(function(v) {
      v.checked = $scope.interfaceSelectAll;
    });
  }
  //删除
  $scope.delInterfaceConfig = function(file) {
    if(confirm("您确认删除吗？")){
      var param = [];
      if(file){
        param = [file.id];
      }else{
        param = $scope.showList.filter(function(v){ return v.checked;}).map(function(x){return x.id;});
        if(param.length < 1){
          $rootScope.toaster("error", "错误", "至少选择一条数据！");
        }
      }

      $scope.deleteJyHelpInfoService({
        "id": param
      }).success(function(result) {
        //请求成功
        if (result.code ==  LoginConfig.commonConStant.SUCCESS) {
          $scope.pageChanged();
        }else{
          //TODO
          alert("请联系系统管理员");
        }
      });
    }
  };
  $scope.pageChanged = function () {
    $scope.getDataInfo($scope.queryData.currentPage, DictionaryConfig.pageNum);
  }


  $scope.queryInterfaceConfig = function(){
    var popupModal = $modal.open({//打开弹窗页
      templateUrl:'views/pages/interface_manage/helpPopup.html',
      controller:'helpPopupCtrl',
      size:'lg',
      resolve:{
        items:function(){
          return {

          }
        }
      }
    });
    //弹出框的返回值
    popupModal.result.then(function(data){
    console.log(data);
      $scope.pageChanged();
    })
  }
})

angular.module('sbAdminApp').controller('helpPopupCtrl', function($scope, $modal,$modalInstance,items,$log,toaster,$state,DictionaryConfig,LoginService,LoginConfig,Upload) {
  //保存
  $scope.saveJyHelpInfo = LoginService.saveJyHelpInfo;
  //上传
  $scope.uploadHelpFile = LoginService.uploadHelpFile;
  //文件类型
  $scope.fileType = DictionaryConfig.fileType;
  //定义错误信息常量
  $scope.CONSTANT = {
   nameErrorMessage:"请输入文件名称",
  typeErrorMessage:"请选择文件类型",
  urlErrorMessage:"请选择文件",
  pathErrorMessage:"文件还未上传完成"
  };
  $scope.file ={};


  function validateForm(){
    $scope.nameErrorMessage="";
    $scope.typeErrorMessage="";
    $scope.urlErrorMessage="";

    if(!$scope.file.name){
      $("[name='name']").focus();
      $scope.nameErrorMessage = $scope.CONSTANT.nameErrorMessage;
      return false;
    }
    if(!$scope.file.type){
      $("[name='type']").focus();
      $scope.typeErrorMessage = $scope.CONSTANT.typeErrorMessage;
      return false;
    }
    if(!$scope.file.choose){
      $("[name='url']").focus();
      $scope.urlErrorMessage = $scope.CONSTANT.urlErrorMessage;
      return false;
    }
    if(!$scope.file.path){
      $scope.pathErrorMessage = $scope.CONSTANT.pathErrorMessage;
      $rootScope.toaster("error", "错误", $scope.pathErrorMessage);
      return false;
    }
    return true;
  }
  $scope.save = function(){
    if(validateForm()){
      $scope.saveJyHelpInfo($scope.file).success(function(result){
        //请求成功
        if (result.code ==  LoginConfig.commonConStant.SUCCESS) {
          $modalInstance.close({
            file:$scope.file
          });
        }else{
          //TODO
          alert("请联系系统管理员");
        }
      });
    }
  }


  $scope.upFile = function (files) {
    if(!files) return;
    if (files && files.length) {
      for (var i = 0; i < files.length; i++) {
        var fileName = files[i].name.substring(0,files[i].name.lastIndexOf('.'));
        $scope.uploadPicture(fileName,files[i]);
      }
    }
  };
  //上传图片
  $scope.uploadPicture = function (fileName,file){
    Upload.upload({
      url: LoginConfig.interfaceConstant.uploadHelpFileUrl,
      data: {
        file: file,
        name: fileName
      }
    }).success(function(result) {
      if(result.code == LoginConfig.commonConStant.SUCCESS){
        $scope.file.path = result.result;
      }else{
        $rootScope.toaster("error", "错误", result.message);
      }
    });
  };


  //取消
  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };


});