'use strict';

angular.module('sbAdminApp').controller('FilingCompleteCtrl', function($scope, $stateParams, $state, $interval, $location, DictionaryConfig,toaster,$log,LoginService,$rootScope) {

  //定义状态常量
  $scope.CURRENT_CONSTANT = {
    "adjustLink":"调解环节",
    "litigationLink":"诉讼环节",
    "approvalLink": "审批环节",
    "filingLink": "立案环节",
    "divisionLink": "分案环节",
    "handleLink":"办案环节",
    "evidenceLink": "补充证据",
    "mediationLink": "庭前调解环节",
    "finishLink": "已结案",
    "finishLinkTDH": "已结案,同时文书发送到通达海内网审判系统!",
    "instrumentLink":"出具调解文书",
    "onlineLink":"在线开庭",
    "auditAllocation":"审核分配调解员",
    "mediateReceive":"调解员接收",
    "partyMediate":"当事人调解",
    "scheduleLink":"排期环节",
    "mediationFinish":"调解结束"
  };

  $scope.urlArray = [
    {"id":0,"value":"dashboard.processing"},
    {"id":1,"value":"dashboard.handleLawList"},
    {"id":2,"value":"dashboard.approval"},
    {"id":3,"value":"dashboard.filing"},
    {"id":4,"value":"dashboard.division"},
    {"id":5,"value":"dashboard.commonCaseTodo"},
    {"id":6,"value":"dashboard.smallCaseTodo"},
    {"id":7,"value":"dashboard.confirmCaseTodoList"},
    {"id":8,"value":"dashboard.appraisalTaskList"},
    {"id":9,"value":"dashboard.appraisalReturnList"},
    {"id":10,"value":"dashboard.appraisalHandleList"},
    {"id":11,"value":"dashboard.appraisalEvaluateList"},
    {"id":12,"value":"dashboard.partyMediate"},
    {"id":13,"value":"dashboard.schedule"},
    {"id":14,"value":"dashboard.noAdjustList"}
  ];

  //定义状态常量，鉴定
  $scope.LINK_CONSTANT = {
    "launchLink":"鉴定任务接收",
    "receiveLink":"鉴定处理",
    "finishLink":"鉴定完成",
    "supplementLink": "补充证据",
    "returnLink": "退回审核",
    "returnCLink": "鉴定任务退回审核",
    "taskFinishLink":"鉴定任务结束（同意退回）",
    "evaluateLink": "鉴定评价",
    "endLink":"鉴定结束"
  };
  //定义状态常量，更新的类型
  $scope.state = DictionaryConfig.lawState;
  $scope.appraisalState = DictionaryConfig.appraisalState;
  $scope.appraisalDetailState = DictionaryConfig.appraisalDetailState;
  $scope.sysUser = LoginService.user.sysUser;

  //将字符串转换成对象
  $scope.pageInfo = angular.fromJson($stateParams.pageInfo);
  //调解
  if($scope.pageInfo.type){
    //当前状态为调节中
    if($scope.pageInfo.type == $scope.state.adjustListState){
      $scope.url = $scope.urlArray[0].value;
      $scope.currentLink = $scope.CURRENT_CONSTANT.adjustLink;
      if($scope.pageInfo.adjustType == '3'){
        if($scope.pageInfo.result == 0){
            $scope.stateRemark = "达成调解并进行司法确认";
            $scope.nextLink = $scope.CURRENT_CONSTANT.filingLink;
        }else if($scope.pageInfo.result == 1){
            $scope.stateRemark = "达成调解";
            $scope.nextLink = $scope.CURRENT_CONSTANT.finishLink;
        }else if($scope.pageInfo.result == 2){
            $scope.stateRemark = "未达成调解并线上开庭";
            $scope.nextLink = $scope.CURRENT_CONSTANT.filingLink;
        }else if($scope.pageInfo.result == 3){
            $scope.stateRemark = "未达成调解";
            $scope.nextLink = $scope.CURRENT_CONSTANT.filingLink;
        }else if($scope.pageInfo.result == 4){
            $scope.stateRemark = "达成调解并申请调解书";
            $scope.nextLink = $scope.CURRENT_CONSTANT.filingLink;
        }
      }else{
        if($scope.pageInfo.result == 0){
            $scope.stateRemark = "达成调解并进行司法确认";
            $scope.nextLink = $scope.CURRENT_CONSTANT.approvalLink;
        }else if($scope.pageInfo.result == 1){
            $scope.stateRemark = "达成调解";
            $scope.nextLink = $scope.CURRENT_CONSTANT.finishLink;
        }else if($scope.pageInfo.result == 2){
            $scope.stateRemark = "未达成调解并线上开庭";
            $scope.nextLink = $scope.CURRENT_CONSTANT.litigationLink;
        }else if($scope.pageInfo.result == 3){
            $scope.stateRemark = "未达成调解";
            $scope.nextLink = $scope.CURRENT_CONSTANT.litigationLink;
        }else if($scope.pageInfo.result == 4){
            $scope.stateRemark = "达成调解并申请调解书";
            $scope.nextLink = $scope.CURRENT_CONSTANT.approvalLink;
        }else if($scope.pageInfo.result == 5){
            $scope.stateRemark = "提交审核";
            $scope.currentLink = "调解申请环节";
            $scope.nextLink = "调解审批环节";
            $scope.url = $scope.urlArray[12].value;
        }
      }
        if($rootScope.buttSelf){
            $scope.nextLink = $scope.CURRENT_CONSTANT.mediationFinish;
        }

    }else if($scope.pageInfo.type == '2001'){//审核环节
        $scope.url = "dashboard.adjustExamineList";
        $scope.currentLink = "调解审核环节";

      if($scope.pageInfo.adjustReturn == '1'){//同意
          $scope.nextLink = "调解案件办理环节";
      }else{//反对
          $scope.nextLink = "调解申请环节";
      }
    }
    else if ($scope.pageInfo.type == $scope.state.prosecutionState){//起诉环节
        if($scope.sysUser.userType == '0'){
            $scope.url = $scope.urlArray[1].value;
        }else if($scope.sysUser.userType == '1'){
            $scope.url = $scope.urlArray[14].value;
        }

      //当前环节
      $scope.currentLink = $scope.CURRENT_CONSTANT.litigationLink;
      //下一环节
      $scope.nextLink = $scope.CURRENT_CONSTANT.approvalLink;
    }else if ($scope.pageInfo.type == $scope.state.prosecutionFinishState){//待审批
      $scope.url = $scope.urlArray[2].value;
      //当前环节
      $scope.currentLink = $scope.CURRENT_CONSTANT.approvalLink;
      if($scope.pageInfo.result == 0){//审批通过
          //成功至通达海内网审判系统
          if($scope.pageInfo.judgeCaseId){
              $scope.stateRemark = "审批通过,操作成功，同时提交至通达海内网审判系统，立案申请完成！";
          }else{
              $scope.stateRemark = "审批通过";
          }
          $scope.nextLink = $scope.CURRENT_CONSTANT.filingLink;
      }else{//审批驳回
        if($scope.pageInfo.operateType == 0){//司法确认
          $scope.nextLink = $scope.CURRENT_CONSTANT.adjustLink;
        }else{//诉讼案件
          $scope.nextLink = $scope.CURRENT_CONSTANT.litigationLink;
        }
        $scope.stateRemark = "审批驳回";
      }
    }else if ($scope.pageInfo.type == $scope.state.approvalState){//待立案
      $scope.url = $scope.urlArray[3].value;
      //当前环节
      $scope.currentLink = $scope.CURRENT_CONSTANT.filingLink;
      if($scope.pageInfo.result == 0) {//审批通过
        $scope.stateRemark = "立案通过";
        $scope.nextLink = $scope.CURRENT_CONSTANT.divisionLink;
      }else if($scope.pageInfo.result == 2){//案件撤回
        $scope.stateRemark = "案件从通达海撤回成功！";
        $scope.nextLink = $scope.CURRENT_CONSTANT.approvalLink;
      }else{
          $scope.stateRemark = "立案驳回";
          $scope.nextLink = $scope.CURRENT_CONSTANT.approvalLink;
      }
    }else if ($scope.pageInfo.type == $scope.state.filingState){ //待分案
      $scope.url = $scope.urlArray[4].value;
      //当前环节
      $scope.currentLink = $scope.CURRENT_CONSTANT.divisionLink;
      if($scope.pageInfo.operateType == 0) {//司法确认
        //下一环节办案
        $scope.nextLink = $scope.CURRENT_CONSTANT.handleLink;
      }else{//诉讼
        //下一环节庭前调节
          if($scope.pageInfo.isAdjust == '1' && $scope.pageInfo.lawPersonType == '1'){
              $scope.nextLink = $scope.CURRENT_CONSTANT.adjustLink;
          }else{
              $scope.nextLink = $scope.CURRENT_CONSTANT.scheduleLink;
          }
      }
    }else if ($scope.pageInfo.type == $scope.state.adjustState){//庭前调节
      //普通诉讼
      if($scope.pageInfo.redirect == 'common') {
        $scope.url = $scope.urlArray[5].value;
      }else{//小额诉讼
        $scope.url = $scope.urlArray[6].value;
      }
      //当前环节庭前调节
      $scope.currentLink = $scope.CURRENT_CONSTANT.mediationLink;
      if( $scope.pageInfo.isSuccess){
        //下一环节
        $scope.nextLink = $scope.CURRENT_CONSTANT.instrumentLink;
      }else{
        //下一环节
        $scope.nextLink = $scope.CURRENT_CONSTANT.onlineLink;
      }
    }else if ($scope.pageInfo.type == $scope.state.notHearingState){ //办案
      //当前环节办案环节
      $scope.currentLink = $scope.CURRENT_CONSTANT.handleLink;
      //司法确认
      if($scope.pageInfo.operateType == 0) {
        if($scope.pageInfo.result == 0) {//准予申请
          $scope.stateRemark = "准予申请";
            //下一环节
          if($scope.pageInfo.zzrCbr){
              $scope.nextLink = $scope.CURRENT_CONSTANT.finishLinkTDH;
          }else{
              $scope.nextLink = $scope.CURRENT_CONSTANT.finishLink;
          }
        }else if ($scope.pageInfo.result == 1){//驳回申请
          $scope.stateRemark = "驳回申请";
          //下一环节
          $scope.nextLink = $scope.CURRENT_CONSTANT.finishLink;
        }else{//补充证据
          $scope.stateRemark = "补充证据";
          //下一环节
          $scope.nextLink = $scope.CURRENT_CONSTANT.handleLink;
        }
        $scope.url = $scope.urlArray[7].value;
      }else{
        //当前环节办案环节
        $scope.currentLink = $scope.CURRENT_CONSTANT.handleLink;
        //下一环节
        $scope.nextLink = $scope.CURRENT_CONSTANT.finishLink;
        //诉讼
        if($scope.pageInfo.redirect == 'common'){
          $scope.url = $scope.urlArray[5].value;
        }else if($scope.pageInfo.redirect == 'small'){
          $scope.url = $scope.urlArray[6].value;
        }

        //下一环节
        $scope.nextLink = $scope.CURRENT_CONSTANT.finishLink;
      }
    }else if ($scope.pageInfo.type == $scope.state.scheduleState){ //排期
        $scope.url = $scope.urlArray[13].value;
        //当前环节
        $scope.currentLink = $scope.CURRENT_CONSTANT.scheduleLink;
        //下一环节庭前调节
        $scope.nextLink = $scope.CURRENT_CONSTANT.mediationLink;
    }else if ($scope.pageInfo.type == $scope.state.auditAllocationState){ //调解接收确认
        if($scope.pageInfo.isAgree == 1){
            //当前环节
            $scope.currentLink = $scope.CURRENT_CONSTANT.auditAllocation;
            //下一环节
            $scope.nextLink = $scope.CURRENT_CONSTANT.mediateReceive;
        }else{
            //当前环节
            $scope.currentLink = $scope.CURRENT_CONSTANT.auditAllocation;
            //下一环节
            $scope.nextLink = $scope.CURRENT_CONSTANT.partyMediate;
        }
    }
  }

  //鉴定
  if($scope.pageInfo.state) {
     if ($scope.pageInfo.state == $scope.appraisalState.launchState) {//待接收 1001
      $scope.url = $scope.urlArray[8].value;
      $scope.currentLink = $scope.LINK_CONSTANT.launchLink;
      $scope.nextLink = $scope.LINK_CONSTANT.receiveLink;
    }else if ($scope.pageInfo.state == $scope.appraisalState.finishState && !$scope.pageInfo.isEvaluate ) {//完成鉴定 1003
      $scope.url = $scope.urlArray[11].value;
      $scope.currentLink = $scope.LINK_CONSTANT.evaluateLink;
      $scope.nextLink = $scope.LINK_CONSTANT.endLink;
    }
  }
  if($scope.pageInfo.subState) {
    if($scope.pageInfo.subState == $scope.appraisalDetailState.returnState) {//退回1003
        $scope.url = $scope.urlArray[9].value;
        $scope.currentLink = $scope.LINK_CONSTANT.returnCLink;
      if($scope.pageInfo.result == $scope.appraisalDetailState.confirmReturnState){
        $scope.stateRemark = "同意退回";
        $scope.nextLink = $scope.LINK_CONSTANT.taskFinishLink;
      }else if($scope.pageInfo.result == $scope.appraisalDetailState.launchState){
        $scope.stateRemark = "拒绝退回";
        $scope.nextLink = $scope.LINK_CONSTANT.launchLink;
      }
      }else if($scope.pageInfo.subState == $scope.appraisalDetailState.receiveState) {//处理1004
        $scope.url = $scope.urlArray[10].value;
        $scope.currentLink = $scope.LINK_CONSTANT.receiveLink;
      if($scope.pageInfo.result == $scope.appraisalDetailState.finishState){
        $scope.stateRemark = "同意处理";
        $scope.nextLink = $scope.LINK_CONSTANT.finishLink;
      }else if($scope.pageInfo.result == $scope.appraisalDetailState.supplementState){
        $scope.stateRemark = "补充证据";
        $scope.nextLink = $scope.LINK_CONSTANT.supplementLink;
      }else if($scope.pageInfo.result == $scope.appraisalDetailState.returnState){
        $scope.stateRemark = "退回";
        $scope.nextLink = $scope.LINK_CONSTANT.returnLink;
      }
    }
  }

  //倒计时
  ($scope.countDown =function() {
      if(!$rootScope.buttSelf){
          var times = 10;
          var stop = $interval(function () {
              $scope.codeTime = times + 's';
              times --;
              if( times == 0){
                  $interval.cancel(stop);
                  $scope.codeTime = null;
                  $scope.goBackList();
              }
              if($location.$$path.indexOf('pending_complete')== -1){
                  $interval.cancel(stop);
                  $scope.codeTime = null;
              }
          },1000);
      }

  })();
  //返回
  $scope.goBackList = function () {
    $state.go($scope.url);
  };

  $scope.$on('$stateChangeStart', function(event,urlObj){

    var index = $location.$$path.indexOf('pending_complete');
    var result = _.find($scope.urlArray, {value: urlObj.name});

    if(!result && index < 0){
      event.preventDefault();
    }
  });
});
