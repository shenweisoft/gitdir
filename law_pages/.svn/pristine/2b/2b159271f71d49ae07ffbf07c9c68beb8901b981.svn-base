/**
 * Created by shenwei on 2017/3/31.
 */
var app = angular.module('sbAdminApp');
app.filter('stateChangeText', function() {
    return function(id,data) {
        var result = _.find(data, {
            id: id
        });
        return result? result.value:""
    }
});
angular.module('sbAdminApp').controller('HandleLawListCtrl', function($scope, $stateParams, $state, $location, $timeout, $http,toaster, $log,DictionaryConfig,LawService,LawConfig, AdjustService,$filter, $modal,$rootScope) {
  //查询诉讼案件集合Service
  $scope.lawService = LawService;
  //搜索结果为空空白页
  $scope.blankShow = false;
  var level = {
    "warn": "warn",
    "error": "error",
    "success": "success"
  }
  var title = {
    "error": "错误",
    "success": "成功"
  }
  //定义常量
  $scope.CONSTANT = {
    "completeLawState": "1111",
    "messageNetError":"请联系系统管理员"
  };
  //法律表状态常量
  $scope.LAW_STATE = DictionaryConfig.lawState;
  //法律状态集合
  $scope.lawStateList = DictionaryConfig.lawStateList;
  
  //每页显示条数
  $scope.itemNum = DictionaryConfig.pageNum;
  $scope.pageData = {
    currentPage:'1',
    caseList:[],
    showList:[],
    listTitle: ''
  };
  
  var url = $location.url();
  var arr =url.split("/");
  url = arr[arr.length-1];
  $scope.pageData.listTitle =  (url == 'handleLawList') ? '进行中案件' : '已完成的案件'; //列表的标题
    
  //创建对象构造器
  function LawInfoVO(){
    this.state = "";
    this.searchArea = "";
    this.pageNo = 1;
    this.pageSize = DictionaryConfig.pageNum;
  }
  $scope.pages = new LawInfoVO();
  
  //新建对象
  //根据URL进行判断
  var url = $location.url();
  if(url.indexOf("completeLawList") > 0){//已完成案件
      $scope.pages.state = $scope.CONSTANT.completeLawState;
  }
  
  $scope.searchDataByPage = function(){
    $scope.pages.pageNo = 1;
    $scope.queryHandleLawList($scope.pages, $scope.pages);
  }

  //后台查询案件
  $scope.queryHandleLawList = function(pageA, pageB){
    if(!pageA) pageA = $scope.pages;
    var paramA = angular.copy(pageA);
    if(paramA.searchArea) paramA.searchArea = DictionaryConfig.filterWidthReg(paramA.searchArea)
    $scope.lawService.queryHandleLawList(paramA).success(function(result) {
      if (result.code == LawConfig.commonConstant.SUCCESS) {
        $scope.pageData.showList = [];
        $scope.pageData.caseList = result.result;
        $scope.pageData.caseList.forEach(function (v,i) {
          //是否能开庭标识,默认不能开庭
          var isShowFlag = false;
          //需要查看开庭时间，是否允许开庭
          var nowDate = new Date(new Date().getTime() + DictionaryConfig.courtBeforeHour);
          if(v.nextCourtDate){
            if(v.nextCourtDate <= $filter('date')(nowDate,"yyyy-MM-dd HH:mm:ss")){
              isShowFlag = true;
            }
          }else{
            if(v.courtDate){
              if(v.courtDate <= $filter('date')(nowDate,"yyyy-MM-dd HH:mm:ss")){
                isShowFlag = true;
              }
            }
          }

          //如果不是暂缓缴费并且又没有付款，则不能开庭
          if(v.isDeferredCharges != '1' && v.payState != '1'){
            isShowFlag = false;
          }
          v.isShowFlag = isShowFlag;
          if(i <  $scope.itemNum){
            $scope.pageData.showList.push(v);
          }
        });
        //空白页展示
        if(!$scope.pageData.caseList.length){
          $scope.blankShow = true;
        }
      }else{
        $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageNetError);
      }
    });
    
    //Todo查询总条数
    if(!pageB) pageB = new LawInfoVO();
    var paramB = angular.copy(pageB)
    if(paramB.searchArea) paramB.searchArea = DictionaryConfig.filterWidthReg(paramB.searchArea)
    $scope.lawService.queryHandleLawCount(paramB).success(function(count) {
        $scope.pageData.totalItems =  count.result;
    })
  };
  //初始化
  $scope.queryHandleLawList($scope.pages, $scope.pages);
  
  //点击当前页面，展示数据
  $scope.pageChanged = function () {
    if(!$scope.pages) $scope.pages = new LawInfoVO();
    $scope.pages.pageNo = $scope.pageData.currentPage;
    
    $scope.queryHandleLawList($scope.pages, $scope.pages);
  }

  //点击查询详细
  $scope.queryDetail = function(lawInfo){
    if(lawInfo.state == DictionaryConfig.lawState.prosecutionState ){//待起诉
        if(!lawInfo.hasOwnProperty("isReturn")||lawInfo.isReturn=="0"){
            AdjustService.getForwardUrl({
                orgId:lawInfo.lawOrgId
            }).success(function(res){
                if(res.result && res.result.civilProcedureDoc){
                    $state.go('dashboard.reading_notes', {"serialNo":lawInfo.serialNo, "name": res.result.civilProcedureDoc});
                }else{
                    $state.go('dashboard.reading_notes', {"serialNo":lawInfo.serialNo, "name": "reading_notes"});
            }
            })
        }else{
            $state.go("dashboard.case_details",{serialNo:lawInfo.serialNo});
        }
    }else{
      $state.go("dashboard.case_details",{serialNo:lawInfo.serialNo});
    }
   // $state.go("dashboard.sue_detail", {serialNo:lawInfo.serialNo,courtCode:lawInfo.courtCode,id:lawInfo.id, step:1});
  }
  //去庭前调解页面
  $scope.goCourtMediation = function (lawInfo) {
    $state.go("dashboard.courtMediation",{serialNo:lawInfo.serialNo});
  }
  //去庭前调解页面
  $scope.goOnlineSession = function (lawCase) {
    $scope.lawService.onlineCourt({
      serialNo:lawCase.serialNo,
      lawNo:lawCase.lawNo
    }).success(function(res){
      window.open(res.result,'_blank');
    })
  }
  //详情
  $scope.viewDetail = function(lawInfo){
    $state.go('dashboard.litigation_payment', {'serialNo':lawInfo.serialNo,'forward':'2'});
  }

//一键理赔
  $scope.claimIdentificationReturnService = AdjustService.claimIdentificationReturn;
//理赔信息
  $scope.reconciliationOfClaimsResultsService = AdjustService. reconciliationOfClaimsResults;
  $scope.settlement = function (caseDetail) {
    $scope.claimIdentificationReturnService({ "serialNo": caseDetail.serialNo,"operateType":0 }).success(function(res) {
      if(res.code == LawConfig.commonConstant.SUCCESS){
        $rootScope.toaster("success", "成功","成功发起理赔申请，保险公司已进入理赔环节。");
        caseDetail.claimState = '2';
      }else{
        $rootScope.toaster("error", "错误", res.message);
      }
    })
  }

  //理赔信息
  $scope.reconciliationOfClaimsResultsService = AdjustService. reconciliationOfClaimsResults;

  $scope.settlementInfo = function (caseDetail) {
    $scope.reconciliationOfClaimsResultsService({ "serialNo": caseDetail.serialNo,"operateType":0 }).success(function(res) {
      if(res.code == LawConfig.commonConstant.SUCCESS){
        $scope.flowList = res.result;
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

angular.module('sbAdminApp').controller('settlementInfoCtrl', function($scope, $stateParams, $state,$modalInstance,items) {
  $scope.flowList = items.flowList;
  //取消
  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };

});