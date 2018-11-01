
var app = angular.module('sbAdminApp');

app.filter('filterMember', function() {
  return function(data, id) {
    if(data) {
      return data.filter(function (x) {
        return x.id != id
      })
    }
  }
});

app.directive('floatOnly', function($filter, $timeout) {
  return {
    require: 'ngModel',
    link: function(scope, element, attrs, modelCtrl) {
      var checkTimeout;
      element.bind('keyup', function(inputValue, e) {
        if(checkTimeout){
          $timeout.cancel(checkTimeout)
          checkTimeout = null;
        }
        var strinput = modelCtrl.$modelValue;
        checkTimeout = $timeout(function() {
          if(strinput && !isNaN(strinput)){
            strinput = strinput ? strinput.toString().replace(/[^\d.]/g, '') : "";
            if(strinput.indexOf(".") > 0 && strinput.length - 1 != strinput.indexOf(".")){
              var floatLength = strinput.length - strinput.indexOf(".") - 1;
              floatLength = floatLength > 2 ? 2:floatLength;
              strinput = parseFloat(strinput).toFixed(floatLength);
            }
          }else{
            strinput = "";
          }
          modelCtrl.$setViewValue(strinput);
          modelCtrl.$render();
        }, 1500);
      });
    }
  }
})


app.controller('secondInstanceProcessCtrl', function ($timeout,$scope, $stateParams, $state,toaster, $log, $sce, LoginService, LawService, $filter, DictionaryConfig,SecondLitigantionService,SecondLitigantionConfig,$rootScope) {

  //定义页面常量
  $scope.CONSTANT = {
    "messageContractorIdNull": "承办部门不能为空",
    "messageCheckDateNull": "审批时间不能为空",
    "messageSecondLawNoNull": "案号不能为空",
    "messageUnderlyingAssetNull": "标的金额不能为空",
    "messageAcceptanceFeeNull": "预收受理费不能为空",
    "messageRemarkFeeNull": "审批意见不能为空",
    "messageIsAgreeFeeNull": "请选择审批意见",
    "messageSaveSuccess": "保存成功",
    "messageLawNoNameNull" : "案号年份不能为空",
    "messageLawNoNameError" : "案号年份格式不正确",
    "messageLawNoNull": "案号不能为空",
    "messageLawNoError": "案号格式不正确",
    "messagechiefJudgeNameNull": "请选择审判长",
    "messageClerkNameNull": "请选择书记员",
    "messageMemberOneNameNull": "请选择合议庭成员1",
    "messageMemberTwoNameNull": "请选择合议庭成员2",
    "messageUndertakerNameNull": "请选择承办人",
    "messageCourtNameNull": "法庭名称不能为空",
    "messageCourtNumNull": "庭次不能为空",
    "messageCourtDateNull": "开庭日期不能为空",
    "messageCourtDateMinNull": "开庭日期不能早于当前时间"
  };

  //定义查询Service
  $scope.selectSecondIntanceInfoService = SecondLitigantionService.querySecondIntanceInfo;
  //承办部门
  $scope.departmentList = [];

  //根据ID查询主表数据
  $scope.initData = function(){
    $scope.userDepart = LoginService.user.sysUser.userDepartList[LoginService.user.sysUser.currentOrg];
    $scope.sysUser = LoginService.user.sysUser;
    $scope.selectSecondIntanceInfoService({
      id:$stateParams.id
    }).success(function (res) {
      if (res.code === SecondLitigantionConfig.commonConStant.SUCCESS) {
        $scope.secondIntanceInfo = res.result;
        //填充上诉人，被上诉人，代理人数据，用于头部显示
        $scope.secondApplicantArray = $scope.secondIntanceInfo.secondInstanceApplicantArray;
        //格式化数据
        $scope.formatData($scope.secondIntanceInfo);
        //查询承办部门数据
        $scope.queryDepartment();
        //查询分案中人员数据
        if($scope.secondIntanceInfo.state == "1002") {
          $scope.queryDivision(); //审判长，合议庭成员，书记员
          $scope.queryUndertakerList(); //承办人
        }
        //查询排期中法庭名称
        if($scope.secondIntanceInfo.state == "1003") {
          $scope.queryOrgNameList();
        }

      } else {//请求失败
        $rootScope.toaster("error", "错误", res.message);
      }
    })
  };

  //查询承办部门数据
  $scope.queryDepartment = function () {
    SecondLitigantionService.queryDepartByUserAndOrgInfo({userId: $scope.userId, orgId: $scope.secondIntanceInfo.secondintanceOrgId}).success(function (res) {
      if(res.code == SecondLitigantionConfig.commonConStant.SUCCESS) {
        $scope.departmentList = res.result;
      } else {
        $rootScope.toaster("error", "错误", res.message);
      }
      console.log($scope.departmentList);
    })
  };

  //查询分案中人员数据
  $scope.queryDivision = function () {
    SecondLitigantionService.secondInstanceSysUserByOrgIdInfo({orgId: $scope.userDepart.orgId}).success(function (res) {
      if(res.code == SecondLitigantionConfig.commonConStant.SUCCESS) {
        $scope.departmentUserList = res.result;
        //过滤数据
        $scope.courtClerkList = filterUsersList($scope.departmentUserList, "postType", "1"); //书记员
        $scope.collegiateBenchUsersList = filterUsersList($scope.departmentUserList, "postType", "2"); //合议庭成员
        $scope.judgeList = filterUsersList($scope.departmentUserList, "postType", "3"); //审判员
      } else {
        $rootScope.toaster("error", "错误", res.message);
      }
      console.log($scope.departmentUserList);
    })
  };

  //查询承办人数据
  $scope.queryUndertakerList = function () {
    console.log($scope.secondIntanceInfo.contractorId)
    SecondLitigantionService.selectSecondInstanceUserInfo({deptId: $scope.secondIntanceInfo.contractorId}).success(function (res) {
      if(res.code == SecondLitigantionConfig.commonConStant.SUCCESS) {
        $scope.undertakerNameList = res.result;
      } else {
        $rootScope.toaster("error", "错误", res.message);
      }
    })
  };

  //查询法庭名称数据
  $scope.queryOrgNameList = function () {
    SecondLitigantionService.queryOrgByUserIdInfo({}).success(function (res) {
      if(res.code == SecondLitigantionConfig.commonConStant.SUCCESS) {
        $scope.orgNameList = res.result;
      } else {
        $rootScope.toaster("error", "错误", res.message);
      }
    })
  };

  //过滤出人员数据
  function filterUsersList(list, attr, value) {
    return list.filter(function (x) {
      return x[attr] == value;
    })
  }

  //验证数据
  $scope.regData = function () {
    var v = $scope.secondIntanceInfo;
    $scope.secondIntanceInfo.remarkError = undefined;
    $scope.secondIntanceInfo.contractorIdError = undefined;
    $scope.secondIntanceInfo.checkDateError = undefined;
    $scope.secondIntanceInfo.underlyingAssetError = undefined;
    $scope.secondIntanceInfo.acceptanceFeeError = undefined;
    $scope.secondIntanceInfo.isAgreeError = undefined;
    $scope.secondIntanceInfo.chiefJudgeNameError = undefined;
    $scope.secondIntanceInfo.clerkNameError = undefined;
    $scope.secondIntanceInfo.memberOneNameError = undefined;
    $scope.secondIntanceInfo.memberTwoNameError = undefined;
    $scope.secondIntanceInfo.undertakerNameError = undefined;
    $scope.secondIntanceInfo.courtNameError = undefined;
    $scope.secondIntanceInfo.courtNumError = undefined;
    $scope.secondIntanceInfo.courtDateError = undefined;
    if(v.isAgree && v.isAgree != '0' && v.remark) { //驳回，且填写备注时，不验证数据
      return true;
    } else if(v.isAgree && v.isAgree != '0' && !v.remark) {
      $scope.secondIntanceInfo.remarkError = true;
      $rootScope.toaster("warn", "提示", $scope.CONSTANT.messageRemarkFeeNull);
      return false;
    } else {
      if(v.state == '1001') { //立案审批部分验证
        if(!v.contractorId) { //承办部门
          $scope.secondIntanceInfo.contractorIdError = true;
          $rootScope.toaster("warn", "提示", $scope.CONSTANT.messageContractorIdNull);
          return false;
        } else $scope.secondIntanceInfo.contractorIdError = undefined;
        if(!v.checkDate) { //审批时间
          $scope.secondIntanceInfo.checkDateError = true;
          $rootScope.toaster("warn", "提示", $scope.CONSTANT.messageCheckDateNull);
          return false;
        } else $scope.secondIntanceInfo.checkDateError = undefined;
        if(!v.underlyingAsset) { //标的金额
          $scope.secondIntanceInfo.underlyingAssetError = true;
          $rootScope.toaster("warn", "提示", $scope.CONSTANT.messageUnderlyingAssetNull);
          return false;
        } else $scope.secondIntanceInfo.underlyingAssetError = undefined;
        //案号
        if(!v.secondLawNo){//案号
          $scope.secondIntanceInfo.secondLawNoError = true;
          $rootScope.toaster("warn", "提示", $scope.CONSTANT.messageSecondLawNoNull);
          return false;
        } else $scope.secondIntanceInfo.secondLawNoError = undefined;
        if(!v.acceptanceFee) { //预收受理费
          $scope.secondIntanceInfo.acceptanceFeeError = true;
          $rootScope.toaster("warn", "提示", $scope.CONSTANT.messageAcceptanceFeeNull);
          return false;
        } else $scope.secondIntanceInfo.acceptanceFeeError = undefined;
        if(!v.isAgree && v.isAgree != '0'){
          $scope.secondIntanceInfo.isAgreeError = true;
          $rootScope.toaster("warn", "提示", $scope.CONSTANT.messageIsAgreeFeeNull);
          return false;
        } else $scope.secondIntanceInfo.isAgreeError = undefined;
      } else if(v.state == '1002') { //分案部分验证
        if(!v.chiefJudgeName) { //审判长
          $scope.secondIntanceInfo.chiefJudgeNameError = true;
          $rootScope.toaster("warn", "提示", $scope.CONSTANT.messagechiefJudgeNameNull);
          return false;
        } else $scope.secondIntanceInfo.chiefJudgeNameError = undefined;
        if(!v.clerkName) { //书记员
          $scope.secondIntanceInfo.clerkNameError = true;
          $rootScope.toaster("warn", "提示", $scope.CONSTANT.messageClerkNameNull);
          return false;
        } else $scope.secondIntanceInfo.clerkNameError = undefined;
        if(!v.memberOneName) { //合议庭成员一
          $scope.secondIntanceInfo.memberOneNameError = true;
          $rootScope.toaster("warn", "提示", $scope.CONSTANT.messageMemberOneNameNull);
          return false;
        } else $scope.secondIntanceInfo.memberOneNameError = undefined;
        if(!v.memberTwoName) { //合议庭成员二
          $scope.secondIntanceInfo.memberTwoNameError = true;
          $rootScope.toaster("warn", "提示", $scope.CONSTANT.messageMemberTwoNameNull);
          return false;
        } else $scope.secondIntanceInfo.memberTwoNameError = undefined;
        if(!v.undertakerName) { //承办人
          $scope.secondIntanceInfo.undertakerNameError = true;
          $rootScope.toaster("warn", "提示", $scope.CONSTANT.messageUndertakerNameNull);
          return false;
        } else $scope.secondIntanceInfo.undertakerNameError = undefined;
        if(!v.isAgree && v.isAgree != '0'){
          $scope.secondIntanceInfo.isAgreeError = true;
          $rootScope.toaster("warn", "提示", $scope.CONSTANT.messageIsAgreeFeeNull);
          return false;
        } else $scope.secondIntanceInfo.isAgreeError = undefined;
      } else if(v.state == '1003') { //排期部分验证
        if(!v.courtName) {
          $scope.secondIntanceInfo.courtNameError = true;
          $rootScope.toaster("warn", "提示", $scope.CONSTANT.messageCourtNameNull);
          return false;
        } else $scope.secondIntanceInfo.courtNameError = undefined;
        if(!v.courtNum) {
          $scope.secondIntanceInfo.courtNumError = true;
          $rootScope.toaster("warn", "提示", $scope.CONSTANT.messageCourtNumNull);
          return false;
        } else $scope.secondIntanceInfo.courtNumError = undefined;
        if(!v.courtDate) {
          $scope.secondIntanceInfo.courtDateError = true;
          $rootScope.toaster("warn", "提示", $scope.CONSTANT.messageCourtDateNull);
          return false;
        } else $scope.secondIntanceInfo.courtDateError = undefined;
        //开庭时间不能小于今天
        if($filter('date')(Date.parse(v.courtDate),"yyyy/MM/dd HH:mm:ss") < $filter('date')(new Date(),"yyyy/MM/dd HH:mm:ss")){
          $scope.secondIntanceInfo.courtDateError = true;
          $rootScope.toaster("warn", "提示", $scope.CONSTANT.messageCourtDateMinNull);
          return false;
        } else $scope.secondIntanceInfo.courtDateError = undefined;
        if(!v.isAgree && v.isAgree != '0'){
          $scope.secondIntanceInfo.isAgreeError = true;
          $rootScope.toaster("warn", "提示", $scope.CONSTANT.messageIsAgreeFeeNull);
          return false;
        } else $scope.secondIntanceInfo.isAgreeError = undefined;
      }
    }
    return true;
  };

  //保存数据
  $scope.approvalSave = function (goState) {
    //格式化日期数据
    if($scope.secondIntanceInfo.checkDate) $scope.secondIntanceInfo.checkDate = dateToString($scope.secondIntanceInfo.checkDate);
    if($scope.secondIntanceInfo.courtDate) $scope.secondIntanceInfo.courtDate = dateToString($scope.secondIntanceInfo.courtDate);

    //存储主表数据
    SecondLitigantionService.saveSecondIntanceInfo($scope.secondIntanceInfo).success(function (res) {
      if(res.code == SecondLitigantionConfig.commonConStant.SUCCESS) {
        if(!goState) {
          $rootScope.toaster("success", "成功", $scope.CONSTANT.messageSaveSuccess);
        }
        goState = goState || function(){};
        goState();
        //格式化数据
        $scope.formatData($scope.secondIntanceInfo);
      } else {
        $rootScope.toaster("error", "错误", res.message);
      }
    });

  };

  //提交数据
  $scope.approvalSubmit = function () {
    if($scope.regData()) { //验证数据
      if(confirm("是否提交数据？")) {
        //修改案件状态
        if($scope.secondIntanceInfo.isAgree) { //驳回
          if($scope.secondIntanceInfo.state == "1001") {
            $scope.secondIntanceInfo.state = "1000";
          } else if($scope.secondIntanceInfo.state == "1002") {
            $scope.secondIntanceInfo.state = "1001";
          } else if($scope.secondIntanceInfo.state == "1003") {
            $scope.secondIntanceInfo.state = "1002";
          }
        } else { //同意
          if($scope.secondIntanceInfo.state == "1001") { //立案审批时
            //添加立案审批人
            $scope.secondIntanceInfo.checkName = $scope.sysUser.text;
          }
          $scope.secondIntanceInfo.state = parseInt($scope.secondIntanceInfo.state) + 1;
        }
        //保存主表信息
        $scope.approvalSave(function() {
          //插入流程表
          $scope.insertWorkFlow();
        })
      }
    }
  };

  //////////////////////////////流程表信息部分/////////////////////////////////////
  //定义流程主表信息
  var WorkFlow = function() {
    this.type = $scope.secondIntanceInfo.state; //state代替type
    this.serialNo = $scope.secondIntanceInfo.serialNo;
    this.operatorId = $scope.sysUser.id;
    this.operatorName = $scope.sysUser.text;
    this.orgCode = $scope.userDepart.orgCode;
    this.orgName = $scope.userDepart.orgName;
    this.tempData = "";
    this.result = $scope.secondIntanceInfo.isAgree;
    this.resultName = "";
    this.remark = $scope.secondIntanceInfo.remark;
  };

  //封装流程信息
  $scope.packageWorkFlowData = function(){
    //主表
    $scope.workFlow = new WorkFlow();
    //业务表
    var tempData = new SecondLitigantionConfig.workFlowData.workFlowData();
    //法院部门名称
    tempData.lawDeptName = $scope.userDepart.deptName;
    //立案审批状态  (此时为驳回后的状态)
    if($scope.secondIntanceInfo.state == '1000') { //立案
      //节点名称
      $scope.workFlow.resultName = "驳回到待立案"
    } else if($scope.secondIntanceInfo.state == '1001') { //立案审批
      //节点名称
      if($scope.workFlow.result == '0') {
        $scope.workFlow.resultName = "同意审批"
      } else {
        $scope.workFlow.resultName = "驳回到待审批"
      }
    } else if($scope.secondIntanceInfo.state == '1002') { //分案
      //节点名称
      if($scope.workFlow.result == '0') {
        $scope.workFlow.resultName = "同意审批"
      } else {
        $scope.workFlow.resultName = "驳回到待分案"
      }
    } else if($scope.secondIntanceInfo.state == '1003') { //排期
      //节点名称
      if($scope.workFlow.result == '0') {
        $scope.workFlow.resultName = "同意分案"
      } else {
        $scope.workFlow.resultName = "驳回到待排期"
      }
    } else if($scope.secondIntanceInfo.state == '1004') { //庭审赔偿计算
      //节点名称
      $scope.workFlow.resultName = "同意排期"
    }
    $scope.workFlow.tempData = JSON.stringify(tempData);
  };

  //插入流程表
  $scope.insertWorkFlow = function(){
    //封装流程表
    $scope.packageWorkFlowData();
    //插入流程表信息
    SecondLitigantionService.saveSecondInstanceWorkFlowInfo($scope.workFlow).success(function(result) {
      if (result.code == SecondLitigantionConfig.commonConStant.SUCCESS) {
        //成功跳转页面
        $state.go("dashboard.secondPendingComplete", {state: $scope.secondIntanceInfo.state, isAgree: $scope.secondIntanceInfo.isAgree});
      } else {
        $rootScope.toaster("error", "错误", res.message);
      }
    })
  };

  ///////////////////////////////////////////////////////////////////////////////

  //选择审批意见，保存节点名称
  $scope.chooseAgree = function () {
    if($scope.secondIntanceInfo.isAgree) { //驳回
      $scope.secondIntanceInfo.resultName = $scope.secondIntanceInfo.state == "1001"? "结案": "驳回到待" + SecondLitigantionConfig.lawState[parseInt($scope.secondIntanceInfo.state.substring(3)) - 1].value.substring(SecondLitigantionConfig.lawState[parseInt($scope.secondIntanceInfo.state.substring(3)) - 1].value.length - 2);
    } else { //同意
      $scope.secondIntanceInfo.resultName = $scope.secondIntanceInfo.state == "1004"? "结案": "同意" + SecondLitigantionConfig.lawState[$scope.secondIntanceInfo.state.substring(3)].value.substring(SecondLitigantionConfig.lawState[$scope.secondIntanceInfo.state.substring(3)].value.length - 2);
    }
  };

  //设置最小日期
  $scope.minDate = new Date();

  //日期对象转化成字符串
  var dateToString = function (date) {
    if(typeof date === 'object') {
      date = $filter('date')(date, 'yyyy-MM-dd HH:mm:ss');
    } else {
      var nowDate = new Date(date.split(',').join('/'));
      date = $filter('date')(nowDate, 'yyyy-MM-dd HH:mm:ss');
    }
    return date;
  };

  //格式化数据
  $scope.formatData  = function (v) {
    if(v.checkDate) v.checkDate = v.checkDate.split(' ')[0];
    else v.checkDate = new Date();

    /*if(v.courtDate) v.courtDate = v.courtDate.split(' ')[0];
    else v.courtDate = new Date();*/
  };

  //审批时间点击方法
  $scope.openCalendar = function($event, secondIntanceInfo) {
    $event.preventDefault();
    $event.stopPropagation();
    secondIntanceInfo.calendarIsOpen = true;
  };

  //开庭时间点击方法
  $scope.openCourtDate = function($event, secondIntanceInfo) {
    $event.preventDefault();
    $event.stopPropagation();
    secondIntanceInfo.courtDateIsOpen = true;
  };

  //根据选择的id，填充数据
  $scope.filterListValue = function (list, id, target) {
    var obj = list.filter(function (x) {
      return x.id == id;
    });
    console.log(obj[0])
    $scope.secondIntanceInfo[target] = obj[0].text? obj[0].text : obj[0].name;
    console.log($scope.secondIntanceInfo)
  };

  ////////////////////////////案号相关//////////////////////////////////////



  ///////////////////初始化数据//////////////////
  //获取登录用户id
  if (LoginService.user.userPermissions) {
    $scope.userId = LoginService.user.sysUser.id;
    //初始化数据
    $scope.initData();
  }
  $scope.$on('user2Child', function(){
    $scope.userId = LoginService.user.sysUser.id;
    //初始化数据
    $scope.initData();
  });
});


