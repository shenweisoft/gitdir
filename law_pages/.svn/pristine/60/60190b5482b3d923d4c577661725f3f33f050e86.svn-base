'use strict';
var app = angular.module('sbAdminApp');
app.filter('state2Text', function() {
  return function(id,data) {
    var result = _.find(data, {
      id: id
    });
    return result ? result.text:""
  }
});
app.filter('courtName', function() {
  return function(id,data) {
    var result = _.find(data, {
      id: id
    });
    return result ? result.courtName:""
  }
});
app.filter('postId', function() {
  return function(id) {
    var arr = id.split(".");
    var result = arr[arr.length-1];
    return result && result;
  }
});
angular.module('sbAdminApp').controller('FilingDetailCtrl', function ($timeout,$scope, $stateParams, $state,toaster, $log, $sce, LawService, $filter, DictionaryConfig,LawConfig,LoginService,AdjustService,$rootScope) {

  //头部信息显示
  $scope.detailsHeadShow = true;
  //详细查询Service
  $scope.queryLawDetailService = LawService.queryLawDetail;
  //查询历史记录
  $scope.queryJyWorkFlowService = LawService.queryJyWorkFlow;
  //保存更新
  $scope.updateFilingInfoService = LawService.updateFilingInfo;
  //定义查询用户SessionService
  $scope.queryUserInfoService = LoginService.queryUserInfo;
  //查询组织人员
  $scope.querySysUserByOrgIdService = LawService.querySysUserByOrgId;
  //查询法庭名称
  $scope.queryOrgCourtByOrgIdService = LawService.queryOrgCourtByOrgId;
  //发送短信
  $scope.sendMessageLaw =  LawService.sendMessage;
  //查询案件是否相同
  $scope.queryHistoryLawNoService = AdjustService.queryHistoryLawNo;
  $scope.adjustService = AdjustService;
  //调解结果
  $scope.adjustResultList = DictionaryConfig.adjustResultList;
  //service常量
  $scope.commonConstant = LawConfig.commonConstant;
  //法律表状态常量
  $scope.LAW_STATE = DictionaryConfig.lawState;
  //法律状态集合
  $scope.lawStateList = DictionaryConfig.lawStateList;
  //定义状态常量，更新的类型
  $scope.TYPE_CONSTANT = DictionaryConfig.lawType;
  //查询案号是否存在Service
  $scope.checkLawNoService = LawService.checkLawNo;
  //核查通达海法官是否存在本系统Service
  $scope.checkJudgeService = LawService.checkJudgeUser;
  //浙江通达海撤回案件Service
  $scope.revokeCaseService = LawService.revokeCase;

  $scope.selectAdjustDeptAndUserInfoService = AdjustService.selectAdjustDeptAndUserInfo;
  //定义今天，开庭时间在今天以后
  $scope.today = new Date();
  //定义状态常量
  $scope.URL_CONSTANT = {
    "pendingUrl": 'views/pages/lawyer/include_file/approval_pending.html',
    "filingUrl": 'views/pages/lawyer/include_file/pending_filing_sfqr.html',
    "filingssUrl": 'views/pages/lawyer/include_file/pending_filing_ss.html',
    "caseUrl": 'views/pages/lawyer/include_file/pending_case_pt.html',
    "caseComfirmUrl": 'views/pages/lawyer/include_file/pending_case_sfqr.html',
    "caseScheduleUrl": 'views/pages/lawyer/include_file/pending_case_schedule.html'
  };
  $scope.ISAGREE ={
    "agreeApproval":"同意审批",
    "againstApproval":"驳回审批",
    "agreeFiling":"同意立案",
    "againstFling":"驳回到待审批",
    "doDivision":"分案完成",
    "scheduleAchieve":"排期完成"
  };
  var level = {
    "warn": "warn",
    "error": "error",
    "success": "success"
  };
  var title = {
    "error": "错误",
    "success": "成功"
  };
  //内部常量
  $scope.CONSTANT = {
    "messageRemarkNull": "请您输入意见",
    "messageReceiveDateNull": "收件日期不能为空",
    "messageReceiveDateError": "收件日期格式不正确",
    "messageIsAgreeNull": "请您选择审批意见",
    "messageLawMoneyNull": "标的金额不能为空",
    "messageLawMoneyError": "标的金额格式不正确",
    "messageFeeNull": "预收受理费不能为空",
    "messageFeeError": "预收受理费格式不正确",
    "messageLawNoNameNull" : "案号年份不能为空",
    "messageLawNoNameError" : "案号年份格式不正确",
    "messageLawNoNull": "案号不能为空",
    "messageLawNoError": "案号格式不正确",
    "messageFilingDateNull": "立案日期不能为空",
    "messageFilingDateError": "立案日期格式不正确",
    "messageJurisdictionReasonNull": "受辖理由不能为空",
    "messageCourtDateNull": "开庭时间不能为空",
    "messageCourtDateError": "开庭时间格式不正确",
    "messageChiefJudgeIdNull": "审判长不能为空",
    "messageChiefJudgeNull": "审判员不能为空",
    "messageUndertakeJudgeNull":"承办法官不能为空",
    "messageClerkIdNull": "书记员不能为空",
    "messageCourtIdNull": "法庭名称不能为空",
    "messageCourtNumNull": "庭次不能为空",
    "messageCourtNumError": "庭次格式不正确",
    "messageUndertakerIdNull": "承办人不能为空",
    "messageMemberOneIdNull": "合议庭成员1不能为空",
    "messageMemberTwoIdNull": "合议庭成员2不能为空",
    "messageUndertakerPhoneNull": "联系电话不能为空",
    "messageUndertakerPhoneError": "手机号码格式不正确",
    "messageMenberNull": "合议庭成员不能相同"
  };


  //获取当前时间
  Date.prototype.format = function(fmt) {
    var o = {
      "M+" : this.getMonth()+1,                 //月份
      "d+" : this.getDate(),                    //日
      "h+" : this.getHours(),                   //小时
      "m+" : this.getMinutes(),                 //分
      "s+" : this.getSeconds(),                 //秒
      "q+" : Math.floor((this.getMonth()+3)/3), //季度
      "S"  : this.getMilliseconds()             //毫秒
    };
    if(/(y+)/.test(fmt)) {
      fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    }
    for(var k in o) {
      if(new RegExp("("+ k +")").test(fmt)){
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
      }
    }
    return fmt;
  };

  function parseISO8601(dateStringInRange,flag) {
    var isoExp = /^\s*(\d{4})-(\d\d)-(\d\d) (\d{2}):(\d{2}):(\d{2})\s*$/,
      date = new Date(NaN), month,
      parts = isoExp.exec(dateStringInRange);
    if(parts) {
      month = +parts[2];
      date.setFullYear(parts[1], month - 1, parts[3]);
      if(flag){
        date.setHours(parts[4], parts[5], parts[6]);
        return date;
      }
      if(month != date.getMonth() + 1) {
        date.setTime(NaN);
      }
    }
    return date;
  }

  //查询列表时日期处理
  function dealDate() {
    if($scope.law.adjustDate){
      $scope.law.adjustDate = parseISO8601($scope.law.adjustDate);
    }
    if($scope.law.receiveDate ){
      $scope.law.receiveDate = parseISO8601($scope.law.receiveDate);
    }
    if($scope.law.filingDate){
      $scope.law.filingDate = parseISO8601($scope.law.filingDate);
    }
    if($scope.law.courtDate){
      $scope.law.courtDate = parseISO8601($scope.law.courtDate,true);
    }
  }
  //查询详细列表
  $scope.queryFilingDetails = function () {
    //后台取值
    $scope.queryLawDetailService({
      "serialNo": $stateParams.serialNo,
        "id":$stateParams.id,
        "serialNoFlag":"1"
    }).success(function (result) {
      if(result.code ==  $scope.commonConstant.SUCCESS ){
        $scope.law = result.result;
        if($scope.law.lawPersonType == '1'){
            if(!$scope.law.isAdjust){
                $scope.law.isAdjust = '1';
            }
        }
        $scope.codeFileName = result.result.codeFileName?LawConfig.lawConstant.lawCodeFileUrl + result.result.codeFileName:'views/images/1(2).png';
        //待审核
        if($scope.law.state == $scope.LAW_STATE.prosecutionFinishState){

          //如果没有收件日期，日期初始化
          if (!$scope.law.receiveDate){
            $scope.law.receiveDate = new Date().format("yyyy-MM-dd hh:mm:ss");
          }
          $scope.includeUrl =$sce.trustAsHtml($scope.URL_CONSTANT.pendingUrl) ;

          if($scope.law.lawPersonType != '1'){
              //判断是否有重复案件
              $scope.queryHistoryLawNoService({
                  "serialNo": $stateParams.serialNo,
                  "operateType":$scope.law.operateType
              }).success(function (resultK) {
                  if(resultK.code ==  $scope.commonConstant.SUCCESS ){
                      if(resultK.result && resultK.result.length >0){
                          $rootScope.toaster("warning", "提醒", "请注意，"+resultK.result[0]+"案件的原告与此案件的原告身份相同");
                      }
                  }else{
                      $rootScope.toaster("error", "错误", result.message);
                  }
              });
          }
        }else if($scope.law.state == $scope.LAW_STATE.approvalState){
          $scope.lawNoFocous = true;
          //待立案
          if (!$scope.law.filingDate){//立案日期
            $scope.law.filingDate = new Date().format("yyyy-MM-dd hh:mm:ss");
          }
          //开庭时间不能小于今天
          if($filter('date')(Date.parse($scope.law.courtDate),"yyyy/MM/dd HH:mm:ss") < $filter('date')(new Date(),"yyyy/MM/dd HH:mm:ss")){
            $scope.law.courtDate = '';
          }
          if ($scope.law.operateType) { //诉讼
            //判断简易普通以及案号
            litigationFiling();
            $scope.includeUrl =$sce.trustAsHtml($scope.URL_CONSTANT.filingssUrl) ;
          } else {  //司法确认
            litigationFiling();
            $scope.includeUrl =$sce.trustAsHtml($scope.URL_CONSTANT.filingUrl) ;
            //案号处理
            //dealLawNo();
          }
        } else if ($scope.law.state == $scope.LAW_STATE.filingState){//分案
            //后台取值
            $scope.selectAdjustDeptAndUserInfoService({
                "orgId": $scope.law.lawOrgId
            }).success(function (result) {
                if (result.code == $scope.commonConstant.SUCCESS) {
                  $scope.sysUserList = result.result;
                  $log.info($scope.sysUserList );
                    $scope.orgList = _.uniq($scope.sysUserList.map(function(val){
                      return val.deptName;
                    }));

                  $scope.changeSysUser();
                }
            })

            //分案查询法庭以及人员列表
            $scope.queryCourtListAndPersonList();
            //跳转页面
            if ($scope.law.operateType) { //诉讼
                $scope.includeUrl =$sce.trustAsHtml($scope.URL_CONSTANT.caseUrl) ;
            } else {  //司法确认
                $scope.includeUrl =$sce.trustAsHtml($scope.URL_CONSTANT.caseComfirmUrl) ;
            }
        } else if ($scope.law.state == $scope.LAW_STATE.scheduleState){//排期
            //分案查询法庭以及人员列表
            $scope.queryCourtListAndPersonList();
            //跳转页面
            $scope.includeUrl =$sce.trustAsHtml($scope.URL_CONSTANT.caseScheduleUrl) ;
        }
        //去掉时间的时分秒
        dealDate();
      }else{
        $rootScope.toaster("error", "错误", result.message);
      }
    });
    //查询历史记录
    $scope.queryJyWorkFlowService({
      "serialNo": $stateParams.serialNo
    }).success(function (result) {
      // console.log(result);
      if(result.code ==  $scope.commonConstant.SUCCESS ){
        $scope.jyWorkFlowVOList = result.result;
      }else{
        $rootScope.toaster("error", "错误", result.message);
      }
    })
  };
  //过滤人员列表
  $scope.filterList = function (type1,type2) {
    return $scope.postList.filter(function (v) {
      return v.postType == type1 || (type2 && v.postType == type2)
    });
  };
  $scope.changeSysUser = function (){
    $scope.sysUserViewList = $scope.sysUserList.filter(function(val){
      return val.deptName == $scope.law.adjustPointName;
    });
  };
  //从session中获取组织人员
  $scope.getCurrentOrg = function () {
    //根据组织机构获取人员列表
    $scope.$on('user2Child', function(){
      initOrg();
    });
    if (LoginService.user.userPermissions) {
      initOrg();
    }
  };
  //初始化用户刷新
  function initOrg(){
    $scope.userDepart = LoginService.user.sysUser.userDepartList[LoginService.user.sysUser.currentOrg];
    $scope.sysUser = LoginService.user.sysUser;
    //查询详细数据
    $scope.queryFilingDetails();
  }
  //默认刷新组织
  $scope.getCurrentOrg();

  //查询庭次和审判长列表(分案时查询)
  $scope.queryCourtListAndPersonList = function (){
    //获取部门人员
    $scope.querySysUserByOrgIdService({
      "orgId": $scope.userDepart.orgId
    }).success(function (res) {
      if(res.code ==  $scope.commonConstant.SUCCESS ){
        $scope.postList = res.result;
        //承办法官 或者审判员 或审判长（审判员/代理审判员）
        $scope.chiefJudgeList = $scope.filterList(3,4);
        //书记员
        $scope.clerkList = $scope.filterList(1);
        //合议庭成员1
        $scope.memberList = $scope.filterList(2);
        //承办人（承办人是从以上三个中选择）
        $scope.queryUndertakerList();
      }else{
        $rootScope.toaster("error", "错误", res.message);
      }
    });
    //获取法庭名称
    $scope.queryOrgCourtByOrgIdService({"orgId": $scope.userDepart.orgId}).success(function (res) {
      if(res.code ==  $scope.commonConstant.SUCCESS ){
        $scope.courtList = res.result;
      }else{
        $rootScope.toaster("error", "错误", res.message);
      }
    })
  };

  //更新承办人列表
  $scope.queryUndertakerList = function () {
    $scope.undertakerList = [];
    if($scope.law.chiefJudgeId){
      $scope.undertakerList.push(_.find($scope.chiefJudgeList, {id: $scope.law.chiefJudgeId}))
    }
    if($scope.law.clerkId){
      $scope.undertakerList.push(_.find($scope.clerkList, {id: $scope.law.clerkId}));
    }
    if($scope.law.memberOneId){
      $scope.undertakerList.push(_.find($scope.memberList, {id: $scope.law.memberOneId}));
    }
    if($scope.law.memberTwoId){
      $scope.undertakerList.push(_.find($scope.memberList, {id: $scope.law.memberTwoId}));
    }
  };
  //人员改变
  $scope.memberChange = function () {
    //人员改变时处理承办人为空
    $scope.law.undertakerId = '';
    //调用承办人列表
    $scope.queryUndertakerList();
  };

  //定义流程主表信息
  var WorkFlow = function() {
    this.type = "";
    this.serialNo = $scope.law.serialNo;
    this.operatorId = $scope.sysUser.id;
    this.operatorName = $scope.sysUser.text;
    this.orgName = $scope.userDepart.orgName;
    this.remark = $scope.law.remark;
    this.tempData = "";
    this.result = $scope.law.isAgree? $scope.law.isAgree:'0';
    this.resultName = "";
  };

  //封装流程信息
  $scope.packageWorkFlowData = function(){
    //主表
    $scope.workFlow = new WorkFlow();
    //业务表
    var tempData = new DictionaryConfig.workFlowData();
    //法院部门名称
    tempData.lawDeptName = $scope.userDepart.deptName;
    //待审批
    if ($scope.state == $scope.LAW_STATE.prosecutionFinishState){
      //流程类型
      $scope.workFlow.type = DictionaryConfig.lawType.approvalInfo;
      //收件日期
      tempData.receiveDate = $scope.law.receiveDate;
      //驳回
      if($scope.law.isReturn == '1'){
        $scope.workFlow.resultName = $scope.ISAGREE.againstApproval;
      }else{
        $scope.workFlow.resultName = $scope.ISAGREE.agreeApproval;
      }
    }else if($scope.state == $scope.LAW_STATE.approvalState){ //待立案
      //流程类型
      $scope.workFlow.type = DictionaryConfig.lawType.filingInfo;
      //立案日期
      tempData.filingDate = $scope.law.filingDate;
      //收件日期
      tempData.receiveDate = $scope.law.receiveDate;
      //案号
      tempData.lawNo = $scope.law.lawNo;
      //诉讼立案
      if($scope.law.operateType == '1'){
        //标的金额
        tempData.lawMoney = $scope.law.lawMoney;
        //预收受理费
        tempData.acceptanceFee = $scope.law.acceptanceFee;
        //暂缓缴费
        tempData.payType = $scope.law.isDeferredCharges;
        //受辖理由
        tempData.jurisdictionReason = $scope.law.jurisdictionReason;
        //适用程序
        tempData.applicationProducer = $scope.law.applicationProcedure;
        //是否小额诉讼
        tempData.isSmallAmount = $scope.law.isSmallAmount;
      }
      //驳回
      if($scope.law.isReturn == '1'){
        $scope.workFlow.resultName = $scope.ISAGREE.againstFling;
      }else{
        $scope.workFlow.resultName = $scope.ISAGREE.agreeFiling;
      }
    }else if($scope.state == $scope.LAW_STATE.filingState){ //待分案
        //流程类型
        $scope.workFlow.type = DictionaryConfig.lawType.divisionInfo;
        //立案日期
        tempData.filingDate = $scope.law.filingDate;
        //审判员ID（审判长）
        if($scope.law.chiefJudgeId){
            tempData.chiefJudgeId = $scope.law.chiefJudgeId;
            //审判员姓名（审判长）
            tempData.chiefJudgeName = _.find($scope.postList, {id: $scope.law.chiefJudgeId}).text;
        }
        //书记员ID
        if($scope.law.clerkId){
            tempData.clerkId = $scope.law.clerkId;
            //书记员姓名
            tempData.clerkName = _.find($scope.postList, {id: $scope.law.clerkId}).text;
        }
        //诉讼分案
        if($scope.law.operateType == '1'){
            //适用程序
            tempData.applicationProducer = $scope.law.applicationProcedure;
            //是否小额诉讼
            tempData.isSmallAmount = $scope.law.isSmallAmount;
            //普通诉讼
            if($scope.law.applicationProcedure == '2'){
                //合议庭成员1
                tempData.memberOneId = $scope.law.memberOneId;
                tempData.memberOneName = _.find($scope.postList, {id: $scope.law.memberOneId})?_.find($scope.postList, {id: $scope.law.memberOneId}).text:"";
                //合议庭成员2
                tempData.memberTwoId = $scope.law.memberTwoId;
                tempData.memberTwoName = _.find($scope.postList, {id: $scope.law.memberTwoId})?_.find($scope.postList, {id: $scope.law.memberTwoId}).text:"";
                //承办人
                tempData.undertakerId = $scope.law.undertakerId;
                tempData.undertakerName = _.find($scope.postList, {id: $scope.law.undertakerId})?_.find($scope.postList, {id: $scope.law.undertakerId}).text:"";
                //手机号
                tempData.undertakerPhone = $scope.law.undertakerPhone;
            }
        }
        //分案完成
        $scope.workFlow.resultName = $scope.ISAGREE.doDivision;
    }else if($scope.state == $scope.LAW_STATE.scheduleState){ //待排期
        //流程类型
        $scope.workFlow.type = DictionaryConfig.lawType.scheduleInfo;
        //立案日期
        tempData.filingDate = $scope.law.filingDate;
        //开庭日期
        tempData.courtDate = $scope.law.courtDate;
        //法庭ID
        tempData.courtId = $scope.law.courtId;
        //法庭名称
        tempData.courtName = _.find($scope.courtList, {id: $scope.law.courtId}).courtName;
        //庭次
        tempData.courtNum = $scope.law.courtNum;
        //分案完成
        $scope.workFlow.resultName = $scope.ISAGREE.scheduleAchieve;
    }
    $scope.workFlow.tempData = JSON.stringify(tempData);
  };

  //插入流程表
  $scope.insertWorkFlow = function(){
    //封装流程表
    $scope.packageWorkFlowData();
    //插入流程表信息
    $scope.adjustService.insertJyWorkFlow($scope.workFlow).success(function(result) {
      console.log(result);
      if (result.code == $scope.commonConstant.SUCCESS) {
        var sendInfo = angular.toJson({type:$scope.state,result:$scope.law.isReturn,
            operateType:$scope.law.operateType,
            ahdm:$scope.law.ahdm,
            judgeCaseId:$scope.law.judgeCaseId,
            isAdjust:$scope.law.isAdjust,
            lawPersonType:$scope.law.lawPersonType});
        $state.go("dashboard.pending_complete",{pageInfo:sendInfo});
      } else {
        $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageBackend);
      }
    })
  };

  //更新表信息
  $scope.updateLawInfo = function(){
    //处理主表信息
    submitFilter();

    if($scope.law.lawNo){
        if($scope.law.lawNo.indexOf("undefined") > 0){
            $scope.law.lawNo = "";
        }
    }
    $scope.updateFilingInfoService($scope.law).success(function (result) {
      if(result.code ==  $scope.commonConstant.SUCCESS ){
        //驳回发送短信
        if($scope.law.isAgree == 1){
          send();
        }
        //插入流程表
        $scope.insertWorkFlow();
      }else{
        $scope.law.state = $scope.state;
        $rootScope.toaster("error", "错误", "1111111111");
      }
    })
  };


  //提交
  $scope.approvalSubmit = function () {
    //保存前表的状态
    $scope.state = $scope.law.state;
    //验证表单
    if (validateForm()) {

        if($scope.law.lawPersonType == '1' && $scope.law.isAdjust  == '1'){
          if($scope.law.adjustPersonId){
            var obj = _.find($scope.sysUserList,{userId:$scope.law.adjustPersonId});
            if(obj){
                $scope.law.adjustOrgCode = obj.orgId;
                $scope.law.adjustOrgName = obj.orgName;
                $scope.law.adjustPointCode = obj.deptId;
                $scope.law.adjustPointName = obj.deptName;
                $scope.law.adjustName = obj.userName;
            }
          }
        }



      //如果当前状态为待立案状态，提交需判断案号是否存在
      if($scope.state == $scope.LAW_STATE.approvalState){
        $scope.law.lawNoThree = $scope.law.lawNoThree ? $scope.law.lawNoThree :'';
        //处理案号
          if($scope.law.lawNoPx){
              $scope.law.lawNo = "("+($scope.law.lawNoOne).replace(/[^0-9]/ig,"")+")" + $scope.law.lawNoTwo + $scope.law.lawNoPx + "号";
          }else{
              $scope.law.lawNo = "("+($scope.law.lawNoOne).replace(/[^0-9]/ig,"")+")" + $scope.law.lawNoTwo + $scope.law.lawNoThree + "号";
          }
          if($stateParams.serialNo){
              if($scope.law.isAgree == '1' || ($scope.law.lawPersonType == '1' && !$scope.law.adjustPersonId)){
                  $scope.updateLawInfo();
              }else{
                  //查询是否存在
                  $scope.checkLawNoService({
                      serialNo:$scope.law.serialNo,
                      lawNo:$scope.law.lawNo,
                      operateType:$scope.law.operateType
                  }).success(function (result1) {
                      if(result1.code ==  $scope.commonConstant.SUCCESS ){
                          $scope.updateLawInfo();
                      }else{
                          $rootScope.toaster("error", "错误", result1.message);
                      }
                  })
              }

          }else{
              $scope.updateLawInfo();
          }
      }else if($scope.state == $scope.LAW_STATE.filingState && $scope.law.ahdm){
          //核查通达海法官是否存在本系统
          $scope.checkJudgeService({
              chiefName:$scope.law.chiefName,
              clerkName:$scope.law.clerkName,
              operateType:$scope.law.operateType
          }).success(function (result1) {
              if(result1.code ==  $scope.commonConstant.SUCCESS ){
                  $scope.updateLawInfo();
              }else{
                  $rootScope.toaster("error", "错误", result1.message);
              }
          })
      }else{
          $scope.updateLawInfo();
      }
    }
  };

  //浙江通达海撤回案件
    $scope.revokeCaseTDH = function () {
        //撤回案件
        $scope.revokeCaseService({
            serialNo:$scope.law.serialNo,
            lawNo:$scope.law.lawNo,
            operateType:$scope.law.operateType
        }).success(function (result1) {
            if(result1.code ==  $scope.commonConstant.SUCCESS ){
                //条转页面
                $scope.law.isReturn =  '2';//撤案成功状态
                $scope.state ='1003';
                var sendInfo = angular.toJson({type:$scope.state,result:$scope.law.isReturn,operateType:$scope.law.operateType,judgeCaseId:$scope.law.judgeCaseId});
                $state.go("dashboard.pending_complete",{pageInfo:sendInfo});

            }else{
                $rootScope.toaster("error", "错误", result1.message);
            }
        })
    };

  //发送短信
  function send() {
    $scope.sendMessageLaw({
      "type":5,
      "serialNo":$scope.law.serialNo
    }).success(function(result){
      if(result.code !=  $scope.commonConstant.SUCCESS ){
        $rootScope.toaster("error", "错误", result.message);
      }
    })
  }

  //立案时，页面处理
  function litigationFiling() {
    //简易
    if(!$scope.law.applicationProcedure){
      $scope.law.applicationProcedure = 1;
    }
    //案号处理
    dealLawNo();
    //金额处理
    $scope.dealMoney(true);
  }
  //立案诉讼，根据金额发生改变的字段
  $scope.dealMoney = function (flag) {
    //时间处理
    if($scope.checkTimeout){
      $timeout.cancel($scope.checkTimeout)
      $scope.checkTimeout = null
    }
    $scope.checkTimeout = $timeout(function() {
      //将钱去掉字符
      $scope.law.lawMoney = $scope.law.lawMoney ? $scope.law.lawMoney.toString().replace(/[^\d.]/g, '') : '0';
      //取小数点后面两位数字
      $scope.law.lawMoney = parseFloat($scope.law.lawMoney);
      //处理
      if($scope.law.lawMoney && $scope.law.lawMoney > 0){
        //受理费计算
        $scope.law.acceptanceFee = $scope.calculateMoney();
        //使用程序
        if( $scope.law.lawMoney <= 20000){
          //是小额诉讼
          $scope.law.isSmallAmount = 1; //是
          if(!flag){
            $scope.law.applicationProcedure = 1; //简易
          }
        }else{
          //不是小额诉讼
          $scope.law.isSmallAmount = 0; //是
        }
      }else{//没有值默认简易程序
        if(!flag){
          $scope.law.applicationProcedure = 1; //简易
        }
        $scope.law.acceptanceFee = 0;
      }
    }, 800);
  };
  //日期处理,提交时
  function dealDate1() {

    if($scope.law.adjustDate) $scope.law.adjustDate =  $filter('date')($scope.law.adjustDate, 'yyyy-MM-dd HH:mm:ss');
    if($scope.law.receiveDate) $scope.law.receiveDate =  $filter('date')($scope.law.receiveDate, 'yyyy-MM-dd HH:mm:ss');
    if($scope.law.filingDate) $scope.law.filingDate =  $filter('date')($scope.law.filingDate, 'yyyy-MM-dd HH:mm:ss');
    if($scope.law.courtDate) $scope.law.courtDate = $filter('date')($scope.law.courtDate, 'yyyy-MM-dd HH:mm:ss');
  }
  //案号处理
  function dealLawNo() {
    $scope.provinceList = DictionaryConfig.provinceAbbreviation;
    $scope.regionName = $scope.law.extPro && JSON.parse($scope.law.extPro).regionName.split("-")[0];
    $scope.code = $scope.law.orgCode && $scope.law.orgCode.substring(4,8) ;
    $scope.abbreviation =  $scope.law.extPro && $scope.provinceList.filter(function (v) {
      return   v.province == $scope.regionName
    })[0].abbreviation ;
    $scope.law.lawNoOne = "("+(new Date()).getFullYear()+")";

    $scope.peopleType = "";
    if($scope.law.adjustResult == 4){
      $scope.peopleType = "民初";
    }else{
      $scope.peopleType = $scope.law.operateType ? "民初" :"民特";
    }
    $scope.law.lawNoTwo =$scope.abbreviation && $scope.code && $scope.abbreviation + $scope.code + $scope.peopleType;
    $scope.law.lawNoThree = $scope.law.lawNo && $scope.law.lawNo.substring($scope.law.lawNo.indexOf("民") + 2,$scope.law.lawNo.indexOf("号")) || '';
  }
  //提交处理
  function submitFilter() {
    //日期处理
    dealDate1();
    $scope.law.isReturn = $scope.law.isAgree?$scope.law.isAgree:'0';
    //待审批
    if ($scope.law.state == $scope.LAW_STATE.prosecutionFinishState) {
      //表示驳回
      if($scope.law.isReturn == '1'){
        //表示诉讼案件
        if($scope.law.operateType == '1'){//待起诉
          $scope.law.state = $scope.LAW_STATE.prosecutionState;
        }else{//调解中
          $scope.law.state = $scope.LAW_STATE.adjustListState
        }
      }else{//审批通过
        $scope.law.state = $scope.LAW_STATE.approvalState
      }
    } else if ($scope.law.state == $scope.LAW_STATE.approvalState) {
      //立案人
      $scope.law.filingName = $scope.sysUser.text;
      //暂缓缴费
      if($scope.law.isDeferredCharges == true){
        $scope.law.isDeferredCharges = "1";
      }else{
        $scope.law.isDeferredCharges = "0";
      }
      //状态
      $scope.law.state = $scope.law.isReturn == '1' ? $scope.LAW_STATE.prosecutionFinishState:$scope.LAW_STATE.filingState;
      if(!$scope.law.adjustPersonId){
          $scope.law.lawNo = "";
          if($scope.law.state == $scope.LAW_STATE.prosecutionFinishState){
              $scope.law.isAdjust = "";
          }
      }
    }else if ($scope.law.state == $scope.LAW_STATE.filingState) {
        //如果未诉讼案件
        if($scope.law.operateType == '1'){
            //诉前调解单子
            if($scope.law.lawPersonType == '1' && $scope.law.isAdjust  == '1'){
                $scope.law.state = $scope.LAW_STATE.adjustListState;
            }else{
                $scope.law.state = $scope.LAW_STATE.scheduleState;
            }
        }else{//司法确认案件
            $scope.law.state = $scope.LAW_STATE.notHearingState;
        }
    }else if ($scope.law.state == $scope.LAW_STATE.scheduleState) { //排期
        $scope.law.state = $scope.LAW_STATE.adjustState;
        $scope.courtList.forEach(function(v) {
            if(v.id == $scope.law.courtId){
                $scope.law.courtName = v.courtName;
            }
        });
    }
  }

  //驳回时必须填,意见
  function validateOverrule() {
    if($scope.law.isAgree == 1 && !$scope.law.remark){
      $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageRemarkNull);
      $('[name="remark"]').focus();
      return false;
    }
    return true;
  }
  //审批意见
  function validateApprovalOpinionForm(){
    //审批意见
    if($scope.law.isAgree == null){
      $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageIsAgreeNull);
      return false;
    }else{
      if(!validateOverrule()){
        return false;
      }
    }
    return true;
  }

  $scope.lawNoFocus = function(){
    $scope.lawNoFocous = false;
  };

  $scope.lawNoBlur = function(){
    $scope.lawNoFocous = true;
  };
  //验证案号
  function validateLawNo(){

    //案号年份不能为空
    if(!$scope.law.lawNoOne){
      $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageLawNoNameNull);
      $scope.lawNoFocus();
      return false;
    }else {
      var yearReg = /^\([0-9]+[0-9]*[0-9]*\)|[0-9]+[0-9]*[0-9]$/;
      if (!yearReg.test($scope.law.lawNoOne) ) {
        $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageLawNoNameError);
        $scope.lawNoFocus();
        return false;
      }
    }
    if(!$scope.law.lawNoThree && !$scope.law.lawNoPx){
      $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageLawNoNull);
      $("[name='lawNoThree']").focus();
      return false;
    }else{
      if(/\D/.test($scope.law.lawNoThree)){
        $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageLawNoError);
        $('[name="lawNoThree"]').focus();
        return false;
      }
    }
    return true;
  }
  //立案验证
  function validateFiling(){
    //诉讼立案验证
    if($scope.law.operateType == 1){

      //是诉前调解
      if($scope.law.isAdjust != '1'){
          //标的金额
          if(!$scope.law.lawMoney){
              $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageLawMoneyNull);
              $('[name="money"]').focus();
              return false;
          }
          //预收受理费
          if(!$scope.law.acceptanceFee){
              $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageFeeNull);
              $('[name="fee"]').focus();
              return false;
          }else{
              if(!$scope.law.acceptanceFee.match(/^\d+(\.\d{2})?$/)){
                  $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageFeeError);
                  $('[name="fee"]').focus();
                  return false;
              }
          }
          //案号
          if(!validateLawNo()){
              return false;
          }
          //受瞎理由
          if(!$scope.law.jurisdictionReason){
              $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageJurisdictionReasonNull);
              return false;
          }
      }



    }else{//司法确认
      //案号
      if(!validateLawNo()){
        return false;
      }
    }
    //审批意见
    if(!validateApprovalOpinionForm()){
      return false;
    }
    return true;
  }

  //验证 法庭名称，庭次
  function validateCourt() {
    //法庭名称
    if(!$scope.law.courtId){
      $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageCourtIdNull);
      $('[name="courtId"]').focus();
      return false;
    }
    //庭次
    if(!$scope.law.courtNum){
      $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageCourtNumNull);
      $('[name="courtNum"]').focus();
      return false;
    }else{
      if(/\D/.test($scope.law.courtNum)){
        $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageCourtNumError);
        $('[name="courtNum"]').focus();
        return false;
      }
    }
    return true;
  }
  //书记员
  function validateClerkId(){
    if(!$scope.law.clerkId && !$scope.law.clerkName){
      $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageClerkIdNull);
      $('[name="clerkId"]').focus();
      return false;
    }
    return true;
  }

  //分案验证 司法确认案件
  function validateDivisionJudicial(){
    //审判员
    if(!$scope.law.chiefJudgeId && !$scope.law.chiefName){
      $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageChiefJudgeNull);
      $('[name="chiefJudgeId"]').focus();
      return false;
    }
    //书记员
    if(!validateClerkId()){
      return false;
    }
    return true;
  }

  //分案验证 小额诉讼
  function validateDivisionSmall(){
    //法庭名称和庭次
    if(!validateCourt()){
      return false;
    }
    //承办法官
    if(!$scope.law.chiefJudgeId){
      $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageUndertakeJudgeNull);
      $('[name="chiefJudgeId"]').focus();
      return false;
    }
    //书记员
    if(!validateClerkId()){
      return false;
    }
    return true;
  }

  //分案验证 普通诉讼
  function validateDivisionCommon(){

    //诉前调解单子
    if($scope.law.lawPersonType == '1' && $scope.law.isAdjust  == '1'){

        if(!$scope.law.adjustPointName){
            $rootScope.toaster(level.error, title.error, "请选择调解点！");
            return false;
        }
        if(!$scope.law.adjustPersonId){
            $rootScope.toaster(level.error, title.error, "请选择调解员！");
            return false;
        }
    }else{
        //审判长
        if(!$scope.law.chiefJudgeId){
            $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageChiefJudgeIdNull);
            $('[name="chiefJudgeId"]').focus();
            return false;
        }
        //书记员
        if(!validateClerkId()){
            return false;
        }
        if ($scope.law.applicationProcedure == 2) {   //简易
            //合议庭成员1
            if (!$scope.law.memberOneId) {
                $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageMemberOneIdNull);
                $('[name="memberOneId"]').focus();
                return false;
            }
            //合议庭成员2
            if (!$scope.law.memberTwoId) {
                $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageMemberTwoIdNull);
                $('[name="memberTwoId"]').focus();
                return false;
            }
            //合议庭成员不能相同
            if ($scope.law.memberOneId && $scope.law.memberTwoId && $scope.law.memberOneId == $scope.law.memberTwoId) {
                $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageMenberNull);
                $("[name='memberTwoId']").focus();
                return false;
            }
            //承办人
            if (!$scope.law.undertakerId) {
                $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageUndertakerIdNull);
                $('[name="undertakerId"]').focus();
                return false;
            }
            //联系电话
            if (!$scope.law.undertakerPhone) {
                $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageUndertakerPhoneNull);
                $('[name="undertakerPhone"]').focus();
                return false;
            } else {
                var phoneReg = /^1[3|4|5|7|8][0-9]{9}$/;
                if ($scope.law.undertakerPhone.length != 11 || !phoneReg.test($scope.law.undertakerPhone)) {
                    $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageUndertakerPhoneError);
                    $('[name="undertakerPhone"]').focus();
                    return false;
                }
            }
        }
    }



    return true;
  }

  //验证
  function validateForm() {
    //待审批
    if ($scope.law.state == $scope.LAW_STATE.prosecutionFinishState) {
      //驳回时只必须填意见
      if(!validateOverrule()){
        return false;
      }
      if($scope.law.isAgree != 1 ){
        //待审批判断
        if(!validateApprovalOpinionForm()){
          return false;
        }
      }
      if($scope.law.isAgree == 0) {
        if(!confirm("确认提交审批？")){
          return false;
        } 
      }else {
        if(!confirm("确认驳回？")){
          return false;
        }
      }
    }
    //待立案
    if ($scope.law.state == $scope.LAW_STATE.approvalState) {
      //驳回时只必须填意见
      if(!validateOverrule()){
        return false;
      }
      if($scope.law.isAgree != 1 ){
        //立案验证
        if(!validateFiling()){
          return false;
        }
      }
      if($scope.law.isAgree == 1) {
        if(!confirm("确认驳回到待审批？")){
          return false;
        }
      } else {
        if(!confirm("确认提交立案？")){
          return false;
        }
      }
      
    }
    //待分案
    if ($scope.law.state == $scope.LAW_STATE.filingState) {
      if (!$scope.law.operateType) { //司法确认
        if(!validateDivisionJudicial()){
          return false;
        }
      } else {  //诉讼
        if(!validateDivisionCommon()){
          return false;
        }
      }
      if(!confirm("确认提交分案？")){
        return false;
      }
    }
    //待排期
    if ($scope.law.state == $scope.LAW_STATE.scheduleState) {
      //立案时间
      if(!$scope.law.filingDate){
          $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageFilingDateNull);
          $('[name="filingDate"]').focus();
          return false;
      }
      //开庭时间
      if(!$scope.law.courtDate){
        $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageCourtDateNull);
        $('[name="courtDate"]').focus();
        return false;
      }
      //法庭名称和庭次
      if(!validateCourt()){
        return false;
      }
      if(!confirm("确认提交排期？")){
        return false;
      }
    }
    return true;
  }

  //计算预收受理费
  $scope.calculateMoney = function(){

    if($scope.law.lawMoney){
      $scope.moneyFeeList = DictionaryConfig.moneyFeeList;
      var currentMoney = $scope.law.lawMoney;
      var moneyFee = $scope.moneyFeeList.filter(function(v) {
        return currentMoney >= v.startMoney*10000 && currentMoney < v.endMoney*10000;
      });
      $scope.law.acceptanceFee =$scope.law.lawMoney * moneyFee[0].feeMoney + moneyFee[0].plusMoney;
      //简易程序除以2
      if($scope.law.applicationProcedure == 1){
        $scope.law.acceptanceFee = $scope.law.acceptanceFee/2;
      }
      $scope.law.acceptanceFee =  parseFloat($scope.law.acceptanceFee).toFixed(2);
    }
    return $scope.law.acceptanceFee;
  };

  //日历打开,收件日期
  $scope.open = function ($event, law) {
    $event.preventDefault();
    $event.stopPropagation();
    law.opened = true;
    law.openedFiling = false;
    law.openedCourt = false;

  };
  //日历打开,立案日期
  $scope.openFiling = function ($event, law) {
    $event.preventDefault();
    $event.stopPropagation();
    law.openedFiling = true;
    law.opened = false;
    law.openedCourt = false;
  };
  $scope.openCalendar = function(e, law) {
    e.preventDefault();
    e.stopPropagation();

    law.openedCourt = true;
    law.opened = false;
    law.openedFiling = false;
  }

  //路由返回
  $scope.goBack = function () {
    if($scope.law.state == $scope.LAW_STATE.prosecutionFinishState){
      $state.go('dashboard.approval');
    }else if($scope.law.state == $scope.LAW_STATE.approvalState){
      $state.go('dashboard.filing');
    }else if($scope.law.state == $scope.LAW_STATE.filingState){
      $state.go('dashboard.division');
    }
  }
});


