/**
 * Created by Administrator on 2017/3/2 0002.
 */
'use strict';
var app = angular.module('sbAdminApp');
/**
 * @ngdoc function
 * @name sbAdminApp.controller:processingCtrl
 * @description
 * # processingCtrl
 * Controller of the sbAdminApp
 */
app.filter('stringDate', function() {
  return function(dt) {
    if(typeof (dt) == "string")
    {
      dt = dt.replace(/\-/gi,"\/");
      dt = Date.parse(dt);
    }
    return dt && dt;
  }
});
app.filter('isNotNull1', function() {
  return function(person) {
    return person == 'null' ? '-' : person;
  }
});
app.filter('valueNull1', function() {
  return function(val) {
    return val && val || '-';
  }
});
app.filter('stateChangeText', function() {
  return function(id,data) {
    var result = _.find(data, {
      id: id
    });
    return result? result.value:""
  }
});
angular.module('sbAdminApp').controller('PartyMediateCtrl', function ($scope, $log, AdjustService, $state, $modal, DictionaryConfig, AdjustConfig, toaster, LoginService,$rootScope) {
  $scope.search = null;

  $scope.lawStateList = DictionaryConfig.lawStateList;
  $scope.lawState = DictionaryConfig.lawState;
  
  //是否显示过滤选项框
  $scope.filterShow = false;
  //未搜索到结果显示
  $scope.blankShow = false;
  //每页显示条数
  $scope.itemNum = DictionaryConfig.pageNum;
  //页面信息
  $scope.pageData = {
    showList : [],
    listTitle:"调解列表"
  };

  $scope.search = {
    pageSize : DictionaryConfig.pageNum
  }
  //查询列表
  $scope.queryAdjustByIdNo = AdjustService.queryAdjustByIdNo;
  $scope.queryAdjustCountByIdNo = AdjustService.queryAdjustCountByIdNo;
  //一键理赔
  $scope.claimIdentificationReturnService = AdjustService.claimIdentificationReturn;
  //理赔信息
  $scope.reconciliationOfClaimsResultsService = AdjustService. reconciliationOfClaimsResults;

  $scope.insertJyWorkFlow = AdjustService.insertJyWorkFlow;
  //案由类型
  $scope.factTypeList = DictionaryConfig.factTypeList;
  
  //从后台获取数据
  $scope.getDataInfo = function (pageNo,pageSize) {
    $scope.search.pageNo = pageNo;
    //查询列表
    var param = angular.copy($scope.search);
    if(param.searchOverallSituation) param.searchOverallSituation = DictionaryConfig.filterWidthReg(param.searchOverallSituation);
    $scope.queryAdjustByIdNo(param).success(function(qData) {
      if(qData.result){
        $scope.pageData.showList = qData.result;

        //空白页展示
        if(!$scope.pageData.length){
          $scope.blankShow = true;
        }
      }
    })
    //查询总条数
    $scope.queryAdjustCountByIdNo(param).success(function(count) {
      $scope.pageData.totalItems =  count.result;
    })
  }

  $scope.getDataInfo(1,$scope.search.pageSize);
  // $scope.initPage();

  //点击当前页面，展示数据
  $scope.pageChanged = function () {
    if(!$scope.search) $scope.search = {};
    // $scope.search.orgId = $scope.userDepart.orgId;
    // $scope.search.searchState = $scope.searchState;
    // $scope.search.pageNo = $scope.pageData.currentPage;
    // $scope.search.pageSize = DictionaryConfig.pageNum;
    $scope.getDataInfo($scope.search.currentPage,$scope.search.pageSize)
  }

  // 全局查询
  $scope.queryAll =function () {
    $scope.search.searchOverallSituation = $scope.searchOverallSituation;
    $scope.getDataInfo(1, $scope.search.pageSize)
  }

  $scope.queryCaseDetail= function(caseInfo){
      if(caseInfo.state == '2000'){
          if(caseInfo.adjustReturn == '2'){
              $state.go("dashboard.case_details",{id:caseInfo.id});
          }else{
              $state.go("dashboard.personMediation",{id:caseInfo.id});
          }
      }else{
          $state.go("dashboard.case_details",{id:caseInfo.id});
      }
  };

  // 重置查询
  $scope.reset = function () {
    $scope.search = null;
  }
  //页面跳转
  $scope.goCase = function (formCase) {
    if(window.location.href.indexOf('partyMediate') != -1) {
      //调解成功案件默认跳到流程图页面
      $state.go("dashboard.case_details",{serialNo:formCase.serialNo});
    } else {
      //调解中
      if(formCase.state==DictionaryConfig.lawState.adjustListState){
        $state.go("dashboard.mediation",{id:formCase.id});
      }else{ //调解完成 - 流程图
        $state.go("dashboard.case_details",{serialNo:formCase.serialNo});
      }
    }

  };

  //跳转到案件详细页
  $scope.goStateCase = function () {
    $state.go("dashboard.case_details");
  }

  $scope.goStateCaseDetails = function (adjustId) {
    $state.go("dashboard.lawyer_case_details",{adjustId:adjustId});
  }

  $scope.settlement = function (caseDetail) {
    $scope.claimIdentificationReturnService({ "serialNo": caseDetail.serialNo,"operateType":0 }).success(function(res) {
      if(res.code == AdjustConfig.commonConStant.SUCCESS){

        $rootScope.toaster("success", "成功","成功发起理赔申请，保险公司已进入理赔环节。");

        // var successMessage = "";
        // var errorMessage = "";
        // // res.result = [{"errorMessage":"请求成功！","errorCode":"000","flowNo":"32434354"},{"errorMessage":"请求成功！","errorCode":"011","flowNo":"1021787640877"}];
        // res.result.forEach(function(v){
        //   if(v.errorCode == '000'){
        //     successMessage = successMessage + "任务号"+v.flowNo+"理赔成功！ \n ";
        //   }else{
        //     errorMessage = errorMessage +"任务号"+v.flowNo+"理赔失败！\n ";
        //   }
        // })
        // toaster.pop("info", "信息", successMessage+errorMessage);
        caseDetail.claimState = '2';
        $scope.insertWorkFlow(caseDetail.serialNo);
      }else{
        $rootScope.toaster("error", "错误", res.message);
      }
    })
  }
  //定义流程主表信息
  var WorkFlow = function() {
    this.type = DictionaryConfig.lawType.claimInformation;
    this.serialNo = "";
    this.tempData = "";
    this.result = '0';
    this.resultName = "理赔信息";
  };
  //插入流程表
  $scope.insertWorkFlow = function(serialNo){
    //主表
    $scope.workFlow = new WorkFlow();
    // workflow.tempData.forEach(function(v){
    //   v.message = '';
    // })
    // $scope.workFlow.orgName = workflow.orgName;
    // $scope.workFlow.tempData = JSON.stringify(workflow.tempData);
    $scope.workFlow.serialNo = serialNo;
    $log.info($scope.workFlow);
    //插入流程表信息
    $scope.insertJyWorkFlow.insertJyWorkFlow($scope.workFlow).success(function(result) {
      //插入成功
      if (result.code == AdjustConfig.commonConStant.SUCCESS) {

      } else {
        $rootScope.toaster("error", "错误", result.message);
      }
    })
  };


  //理赔信息
  $scope.reconciliationOfClaimsResultsService = AdjustService. reconciliationOfClaimsResults;

  $scope.settlementInfo = function (caseDetail) {
    $scope.reconciliationOfClaimsResultsService({ "serialNo": caseDetail.serialNo,"operateType":0 }).success(function(res) {
      if(res.code == AdjustConfig.commonConStant.SUCCESS){
        var tempData = JSON.parse(res.result.tempData);
        $scope.flowList = tempData.flowList;
        //打开弹窗页
        var popupModal = $modal.open({
          templateUrl:'views/pages/lawyer/processing_case/settlementInfo.html',
          controller:'settlementInfoCtrl',
          size:'lg',
          resolve:{
            items:function(){
              return {
                flowList : $scope.flowList
              }
            }
          }
        });
        //弹出框的返回值
        popupModal.result.then(function(data){

        })
      }else{
        $rootScope.toaster("error", "错误", res.message);
      }
    })


  }
});
angular.module('sbAdminApp').controller('settlementInfoCtrl', function($scope, $stateParams, $state,$modalInstance,items,toaster,AdjustService,AdjustConfig) {
  $scope.flowList = items.flowList;
  //取消
  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };

});

