/**
 * Created by shenwei on 2017/4/18.
 */
var app = angular.module('sbAdminApp');
app.filter('userType2Text', function() {
  return function(id,data) {
    var result = _.find(data, {
      id: id+""
    });
    return result? result.value:""
  }
});
angular.module('sbAdminApp').directive('trackDetail', function() {
  return {
    templateUrl: 'views/pages/case_detail/track_detail.html',
    restrict: 'EA',
    replace: true,
    scope: false,
    controller:function ($scope,$stateParams,DictionaryConfig,$modal,$state,$log,LawConfig,LawService,InterfaceConfig,InterfaceService,toaster,LoginConfig,LoginService,AdjustService,AdjustConfig,$rootScope) {

      //小图
      $scope.smallPictureUrl = LoginConfig.pictureConstant.smallPictureUrl;
      //流程字典表
      $scope.caseVerifyResultCodeArray = DictionaryConfig.caseVerifyResultCode;

      $scope.InterfaceService   = InterfaceService;
      $scope.AdjustService = AdjustService;


       $scope.isSelf = $rootScope.buttSelf;

      //查询历史记录
      $scope.queryJyWorkFlowService = LawService.queryJyWorkFlow;
      $scope.lawService = LawService;
      $scope.trafficPolice = $stateParams.isSelf;

      $scope.secondMediate = function(law){
          $state.go("dashboard.personMediation",{id:law.id});
      };

      //默认信息回传阶段的 发起一键理赔按钮开启
      $scope.claimSettle = true;
        $scope.endFlag = true;
      //理赔信息数组
      $scope.flowList = [];
      //查询历史记录
      $scope.queryJyWorkFlowService({
          "serialNo": $scope.serialNo,
          "id":$scope.id
      }).success(function (result) {
        if(result.code ==  LawConfig.commonConstant.SUCCESS){
          $log.info(result);
          $scope.jyWorkFlowList = result.result;
          $scope.jyWorkFlowList.forEach(function(v){
            if(v.tempData){
              v.tempData = JSON.parse(v.tempData);
            }
            //理赔数据
            // if(v.type == '200'){
            //   $scope.flowList = v.tempData.flowList;
            //   $scope.paymentlist = $scope.flowList[$scope.flowList.length - 1].paymentlist ;
            // }

            //已经发起过一键理赔，信息回传阶段的 发起一键理赔按钮隐藏 ，只显示 发起一键理赔阶段的 重新发送 按钮
            if(v.type == DictionaryConfig.lawType.claimSettle){//单证信息回传190
              $scope.claimSettle = false;
              if( 1 == v.result){
                  $scope.endFlag = false;
              }
            }
            if(v.type == DictionaryConfig.lawType.claimS){//发起一键理赔 回传理赔标识185
              $scope.claimSettle = true;
              $scope.isClaim = false;
            }
            if(v.type == DictionaryConfig.lawType.claimInformation){//获取理赔结果200
              $scope.claimSettle = true;
              $scope.isClaim = false;
              $scope.endFlag = false;

            }

          })
          }else{
              $rootScope.toaster("error", "错误", result.message);
          }
      });

      //去庭前调解页面
      $scope.goCourtMediation = function (lawInfo) {
        $state.go("dashboard.courtMediation",{serialNo:lawInfo.serialNo});
      }

      //去在线开庭页面
      $scope.goOnlineSession = function (lawCase) {

        $scope.lawService.onlineCourt({
          serialNo:lawCase.serialNo,
          lawNo:lawCase.lawNo
        }).success(function(res){
            if (res.code == LawConfig.commonConstant.SUCCESS) {
                window.open(res.result,'_blank');
            }else{
                $rootScope.toaster("error", "错误", res.message);
            }
        })
      }
      //一键理赔信息回传
      $scope.claimMessageReturn = function(flow){
        $scope.InterfaceService.claimMessageReturn({
          serialNo:$scope.serialNo
        }).success(function(res){
          if (res.code == InterfaceConfig.commonConstant.ERROR) {
            $rootScope.toaster("error", "错误", res.result);
          }else{
            $scope.law.claimState = '1'; //信息回传成功
            flow.result = res.result.result;
            flow.createDate = res.result.createDate;
            flow.tempData = JSON.parse(res.result.tempData);
            $rootScope.toaster("success", "信息","请求成功！");
          }
        })
      }
      //单证信息回传
      $scope.documentMessageReturn = function(fl){
          var flow = angular.copy(fl);

          $scope.InterfaceService.documentMessageReturn({
              serialNo:$scope.serialNo
          }).success(function(res){
              if (res.code == InterfaceConfig.commonConstant.ERROR) {
                  if(flow.result=='1'){
                      $scope.jyWorkFlowList.shift(flow);
                  }
                  $rootScope.toaster("error", "错误", res.result);
              }else{
                  if(flow.result=='1'){
                      $scope.jyWorkFlowList.shift(flow);
                  }
                  $scope.claimSettle = false;
                  $scope.law.claimState = '3'; //单证信息回传成功
                  $scope.isClaim = false;
                  flow.result = res.result.result;
                  flow.createDate = res.result.createDate;
                  flow.tempData = JSON.parse(res.result.tempData);
                  $rootScope.toaster("success", "信息","请求成功！");

                  var workflow = res.result;
                  workflow.tempData = JSON.parse(workflow.tempData);

                  $scope.jyWorkFlowList.unshift(workflow);
                  if(workflow.result == '0'){  //流程表返回成功的话，插入理赔信息流程表
                      $scope.insertWorkFlow(angular.copy(workflow));
                  }
              }
          })
      }
      //发起一键理赔
      $scope.claimIdentificationReturn = function (flow) {
        $scope.InterfaceService.claimIdentificationReturn({
          "serialNo":$scope.law.serialNo,
          "operateType":0
        }).success(function(res){
          if(res.code == InterfaceConfig.commonConstant.SUCCESS){
            $scope.law.claimState = '2'; //发起一键理赔成功
            $scope.isClaim = false;
            $rootScope.toaster("success", "成功","请求成功");

            var workflow = res.result;
            workflow.tempData = JSON.parse(workflow.tempData);

        //    if(workflow.result == '00' ){
              if(flow.result=='1'){
                  $scope.jyWorkFlowList.shift(flow);
              }
          //  }

            $scope.jyWorkFlowList.unshift(workflow);
            if(workflow.result == '0'){  //流程表返回成功的话，插入理赔信息流程表
              $scope.insertWorkFlow(angular.copy(workflow));
            }
          }else{
            if(flow.result=='1'){
                $scope.jyWorkFlowList.shift(flow);
            }
            $scope.isClaim = false;
            var workflow = res.result;
            workflow.tempData = JSON.parse(workflow.tempData);
            $scope.jyWorkFlowList.unshift(workflow);
            $rootScope.toaster("error", "错误", res.message);
          }
        })
      }

      //保存收款信息
      $scope.savePayeeInfo = function(law){
        //打开弹窗页
        var popupModal = $modal.open({
          templateUrl:'views/pages/case_detail/receivables.html', //收款信息页面   开户行，收款人姓名，收款账号
          controller:'receivablesCtrl',
          size:'md',
          resolve:{
            items:function(){
              return {
                law : law
              }
            }
          }
        });
        //弹出框的返回值
        popupModal.result.then(function(data){

        })
      }

      //查看更多
      $scope.claimSettleInfo = function (flow) {
        $scope.InterfaceService.reconciliationOfClaimsResults({ "serialNo":$scope.serialNo,"operateType":0 }).success(function(res) {
          if(res.code == InterfaceConfig.commonConstant.SUCCESS){
            var tempData = JSON.parse(res.result.tempData);
            //重新赋值
            flow.tempData = tempData;
            flow.result = res.result.result;
            flow.resultName = res.result.resultName;

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

      //推送案件信息审判系统
      $scope.sendCaseToJudge = function(flow){
        $scope.InterfaceService.sendClosedCaseToJudge({
          serialNo:flow.serialNo
        }).success(function(res){

        })
      }

      //定义流程主表信息
      var WorkFlow = function() {
        this.type = DictionaryConfig.lawType.claimInformation;
        this.serialNo = $scope.law.serialNo;
        // this.operatorId = $scope.sysUser.id;
        // this.operatorName = $scope.sysUser.text;
        this.tempData = "";
        this.result = '0';
        this.resultName = "理赔信息";
      };
      //插入流程表
      $scope.insertWorkFlow = function(workflow){
        //主表
        $scope.workFlow = new WorkFlow();
        workflow.tempData.forEach(function(v){
          v.message = '';
        })
        $scope.workFlow.orgName = workflow.orgName;
        $scope.workFlow.tempData = JSON.stringify(workflow.tempData);

        $log.info($scope.workFlow);
        //插入流程表信息
        $scope.AdjustService.insertJyWorkFlow($scope.workFlow).success(function(result) {
          console.log(result);
          //插入成功
          if (result.code == AdjustConfig.commonConStant.SUCCESS) {
            $scope.jyWorkFlowList.unshift($scope.workFlow);
          } else {
            $rootScope.toaster("error", "错误", result.message);
          }
        })
      };

      $scope.againMediate = function (){
          $state.go("dashboard.mediation",{id:$scope.id});
      };

      $scope.againLaw = function (lawInfo){
          $state.go('dashboard.reading_notes', {"serialNo":lawInfo.serialNo, "name": "reading_notes"});

          // $state.go("dashboard.mediation",{id:$scope.id});
      };
    }
  }
});
angular.module('sbAdminApp').controller('settlementInfoCtrl', function($scope, $stateParams, $state,$modalInstance,items,toaster,AdjustService,AdjustConfig) {
  $scope.flowList = items.flowList;
  //取消
  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };

});

angular.module('sbAdminApp').controller('receivablesCtrl', function($scope, $rootScope, $stateParams, $state,$modalInstance,items,toaster,LawService,InterfaceConfig,InterfaceService) {
  $scope.law = items.law;

  $scope.save = function(){

    if($scope.law.payeeName || $scope.law.payeeAccount || $scope.law.openingBank){
      LawService.updateFilingInfo($scope.law).success(function (result) {
        if(result.code ==  InterfaceConfig.commonConstant.SUCCESS ){
          // //插入流程表
          // $scope.insertWorkFlow();
          $rootScope.toaster("success", "成功","保存成功");
          $modalInstance.close({
          });
        }else{
          $rootScope.toaster("error", "错误", result.message);
        }
      })
    }
  }

  //取消
  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };

});