/**
 * Created by design on 2017/5/23.
 */
angular.module('sbAdminApp').controller('judgeInterfaceManageCtrl', function($scope, $modal,$log,toaster,$state,DictionaryConfig,LoginService,LoginConfig,$rootScope) {
  // $scope.prejudgeService = PrejudgeService;
  $scope.loginService = LoginService;
  $scope.insuranceList = DictionaryConfig.insuranceList;//保险公司列表
  $scope.interfaceItemArray = DictionaryConfig.interfaceItemArray;//接口类型列表


  var level = {
    "warn": "warn",
    "error": "error",
    "success": "success"
  }
  var title = {
    "error": "错误",
    "success": "成功"
  }
  $scope.CONSTANT = {
    "messageBackend":"请联系管理员"
  }

  $scope.interfaceSelectAll = false;

  $scope.pageData={
    currentPage:'1',
    itemNum:DictionaryConfig.pageNum,
    caseList:[],
    showList:[],
    listTitle: ''
  }
  $scope.interfaceConfigInfo={
    pageSize:DictionaryConfig.pageNum
  }

  $scope.getDataInfo = function(pageNo,pageSize){

    $scope.interfaceConfigInfo.pageNo = pageNo;
      //获取接口商列表
      LoginService.queryJudgeInterfaceConfigList($scope.interfaceConfigInfo).success(function(result) {
      var data = result.result;
      console.log(data);
      if (result.code == LoginConfig.commonConStant.SUCCESS) {
        $scope.pageData.showList = data;
      } else {
        $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageBackend);
      }
    })
    //获取总条数
      LoginService.queryJudgeCountInterfaceConfig($scope.interfaceConfigInfo).success(function(result) {
      var data = result.result;
      console.log(data);
      if (result.code == LoginConfig.commonConStant.SUCCESS) {
        $scope.pageData.totalItems = data;
      } else {
        $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageBackend);
      }
    })
  }

  $scope.getDataInfo(1, DictionaryConfig.pageNum);

  $scope.pageChanged = function () {
    $scope.getDataInfo($scope.pageData.currentPage, DictionaryConfig.pageNum);
  }

  $scope.queryJudgeInterfaceConfig = function(interfaceConfig){
    var popupModal = $modal.open({//打开弹窗页
      templateUrl:'views/pages/interface_manage/judgeInterfacePopup.html',
      controller:'InterfacePopupCtrl',
      size:'lg',
      resolve:{
        items:function(){
          return {
            interfaceConfig : interfaceConfig,
            insuranceList : $scope.insuranceList,
            interfaceItemArray : $scope.interfaceItemArray
          }
        }
      }
    });
    //弹出框的返回值
    popupModal.result.then(function(data){
      if(interfaceConfig){ //修改
        console.log(data);
        interfaceConfig.companyCode = data.interfaceConfig.companyCode;
        interfaceConfig.companyName = data.interfaceConfig.companyName;
        interfaceConfig.url = data.interfaceConfig.url;
        interfaceConfig.disabledFlag=data.interfaceConfig.disabledFlag;
        interfaceConfig.interfaceCode = data.interfaceConfig.interfaceCode;
        interfaceConfig.interfaceName = data.interfaceConfig.interfaceName;
        interfaceConfig.password = data.interfaceConfig.password;
        console.log(interfaceConfig);
        /*notice.title = data.title;
         notice.content = data.content;
         notice.type = data.type;*/
      }else{ //新增的话查询一次
        $scope.pageChanged();
      }
    })
  }
  $scope.idList = [];

  $scope.interfaceChxChange = function(){
    $scope.idList = $scope.pageData.showList.filter(function(v){
      return v.checked;
    }).map(function(x){
      return x.id;
    });
  }

  $scope.interfaceToggleSelectAll = function(){
    $scope.pageData.showList.forEach(function(v) {
      v.checked = $scope.interfaceSelectAll;
    });
  }
  //删除
  $scope.delJudgeInterfaceConfig = function(interfaceConfig) {
    if(confirm("您确认删除吗？")){
      var param = [];
      if(interfaceConfig){
        param = [interfaceConfig.id];
      }else{
        param = $scope.pageData.showList.filter(function(v){ return v.checked;}).map(function(x){return x.id;});
        if(param.length < 1){
          $rootScope.toaster("error", "错误", "至少选择一条数据！");
        }
      }

      console.log(param);
      $scope.loginService.deleteJudgeInterfaceConfig({
        "id": param
      }).success(function(result) {
        $log.log(result.data);
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

});

//
angular.module('sbAdminApp').controller('InterfacePopupCtrl', function($scope, $modal,$modalInstance,items,$log,toaster,$state,DictionaryConfig,LoginService,LoginConfig) {
  // $scope.saveNoticeService = PrejudgeService.saveNotice;
  $scope.saveJudgeInterfaceConfig = LoginService.saveJudgeInterfaceConfig;
  $scope.insuranceList = items.insuranceList;
  $scope.interfaceItemArray = items.interfaceItemArray;

  $scope.contentTypeArray = ["text/xml","application/xml","application/json"];
  $scope.dataTypeArray=[{"id":"0","value":"XML"},{"id":"1","value":"JSON"}];

  //定义错误信息常量
  $scope.CONSTANT = {
    "titleErrorMessage": "接口商名称不能空",
    "urlErrorMessage": "请您输入URL",
    "disabledFlagErrorMessage": "请您选择是否禁用",
    "interfaceErrorMessage" :"请您选择接口类型"
  };
  $scope.interfaceConfigNew ={};
  if(items.interfaceConfig){
    $scope.interfaceConfigNew = angular.copy(items.interfaceConfig);
  }

  /*if(!$scope.interfaceConfigNew.codeSet){
    $scope.interfaceConfigNew.codeSet = "UTF-8";
  }
  $scope.interfaceConfigNew.contentType="application/xml";*/

  function validateForm(){
    $scope.titleErrorMessage="";
    $scope.contentErrorMessage="";
    if(!$scope.interfaceConfigNew.platformName){
      $("[name='name']").focus();
      $scope.titleErrorMessage = $scope.CONSTANT.titleErrorMessage;
      return false;
    }
    if(!$scope.interfaceConfigNew.address){
      $("[name='url']").focus();
      $scope.urlErrorMessage = $scope.CONSTANT.urlErrorMessage;
      return false;
    }
    return true;
  }
  $scope.save = function(){
    if(validateForm()){
      $scope.saveJudgeInterfaceConfig($scope.interfaceConfigNew).success(function(result){
        //请求成功
        if (result.code ==  LoginConfig.commonConStant.SUCCESS) {
          $modalInstance.close({
            interfaceConfig:$scope.interfaceConfigNew
          });
        }else{
          //TODO
          alert("请联系系统管理员");
        }
      });
    }
  }
  $scope.selectItems = function(x){
    var companyArray = $scope.insuranceList.filter(function(v){
      return v.code == $scope.interfaceConfigNew.companyCode;
    })
    $scope.interfaceConfigNew.companyName = companyArray[0].text;
  }
$scope.selectType = function(x){
  var interfaceItemArray = $scope.interfaceItemArray.filter(function(v){
    return v.id == $scope.interfaceConfigNew.interfaceCode;
  })
  $scope.interfaceConfigNew.interfaceName = interfaceItemArray[0].value;
}


  //取消
  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };


});

