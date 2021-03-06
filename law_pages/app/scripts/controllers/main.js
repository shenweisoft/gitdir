'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
'use strict';
var app = angular.module('sbAdminApp');
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
app.filter('id2AppraisalItem', function() {
  return function(idStr,data) {
    var str = "";
    var isFirst = true;
    // if(idStr && (idStr.indexOf(',') !== -1)){
    if(idStr && idStr != '' && idStr.split(',').length > 0){
      idStr.split(",").forEach(function(val){
        if(!isFirst){
            str += ",";
        }
        var result = _.find(data, {id: val});
        str += result.value;
        isFirst = false;
      });
    }
    return str? str:""
  }
});
angular.module('sbAdminApp').controller('MainCtrl', function($scope, $stateParams, $state, $location, $timeout, $http, $log, LawConfig,LawService,LoginService,toaster,AdjustService,DictionaryConfig,AppraisalService,AppraisalConfig,LoginConfig,$rootScope) {
  $rootScope.buttSelf = '';
  //默认修改密码为不显示
  $scope.showFlag = false;
  //查询是否默认密码
  $scope.queryIsDefaultPasswordService = LoginService.queryIsDefaultPassword;
  //登录主页
  $scope.queryHomeStatisticsInfoService =AdjustService.queryHomeStatisticsInfo;
  //查询列表
  $scope.getInquireList = AdjustService.getInquireList;
  //查询总数
  $scope.queryCountAdjust = AdjustService.queryCountAdjust;
  //法官查询总条数
  // $scope.queryAllLawAdjustInfoCount = LawService.queryAllLawAdjustInfoCount;
  //法官查询列表
  $scope.queryAllLawAdjustInfoService = LawService.queryAllLawAdjustInfo;
  //鉴定查询静态数据
  $scope.queryAppraisalStatisticsInfoService = AppraisalService.queryAppraisalStatisticsInfo;
  //查询待办事项列表，鉴定
  // $scope.queryAppraisalListService = AppraisalService.queryAppraisalList;
  //进行中查询数据Service
  $scope.queryAppraisalInHandingListService = AppraisalService.queryAppraisalInHandingList;
  //退回查询数据Service
  $scope.queryAppraisalDetailListService = AppraisalService.queryAppraisalDetailList;
  //每页显示条数
  $scope.itemNum = DictionaryConfig.pageNum;
  //定义状态常量，更新的类型
  $scope.LAW_STATE = DictionaryConfig.lawState;
  //鉴定项目集合
  $scope.appraisalItemList = DictionaryConfig.appraisalItemList;
  //法律状态集合
  $scope.mediationState = DictionaryConfig.mediationState;
  $scope.judgeStateList = DictionaryConfig.judgeStateList;
  //修改密码Service
  $scope.editPasswordService = LoginService.editPassword;
  //查询密码是否是默认密码
  $scope.queryIsDefaultPasswordService().success(function (result) {
    $log.info(result);
    if(result.code == LoginConfig.commonConStant.SUCCESS){
      $scope.showFlag = true;
    }
  });

  //定义常量
  $scope.CONSTANT = {
    "messageNewPassword": "请您输入新密码",
    "messageRepeatPassword": "请您输入确认密码",
    "messagePasswordLength": "请您设置6~16位密码",
    "messagePasswordValidate": "密码必须包含字母和数字",
    "messageRepeatPasswordDif": "确认密码与密码输入不一致，请您重新输入",
    "messageEditSuccess": "修改成功",
    "messagePassEditError":"密码修改失败"
  };

  //验证密码输入
  var validatePassword = function() {

    $scope.newPassErrorMessage = "";
    $scope.confirmPassErrorMessage = "";

    //新密码
    if (!$scope.newPassword) {
      $scope.newPassErrorMessage = $scope.CONSTANT.messageNewPassword;
      $("[name='newPassword']").focus();
      return false;
    }
    //密码的长度
    if ($scope.newPassword.length < 6) {
      $scope.newPassErrorMessage = $scope.CONSTANT.messagePasswordLength;
      $("[name='newPassword']").focus();
      return false;
    }
    //密码必须包含字母和数字
    var regNumber = /\w*[0-9]+\w*$/,
        regCharacter = /\w*[a-zA-Z]+\w*$/;
    if (!regNumber.test($scope.newPassword) || !regCharacter.test($scope.newPassword)) {
      $scope.newPassErrorMessage = $scope.CONSTANT.messagePasswordValidate;
      $("[name='newPassword']").focus();
      return false;
    }
    //确认密码
    if (!$scope.confirmPassword) {
      $scope.confirmPassErrorMessage = $scope.CONSTANT.messageRepeatPassword;
      $("[name='confirmPassword']").focus();
      return false;
    }
    //确认密码与新密码必须相同
    if ($scope.newPassword != $scope.confirmPassword) {
      $scope.confirmPassErrorMessage = $scope.CONSTANT.messageRepeatPasswordDif;
      $("[name='confirmPassword']").focus();
      return false;
    }
    return true;
  };


  $scope.$on('user2Child', function(){
    initData();
  });
  if (LoginService.user.userPermissions) {
    initData();
  }
  function initData(){
    $scope.sysUser = LoginService.user.sysUser;
  }

  //修改密码
  $scope.updatePassword = function(){
    if(validatePassword()){
      $scope.editPasswordService({
        "id": $scope.sysUser.id,
        "oldPassword": "abcd1234",
        "newPassword": $scope.newPassword
      }).success(function(result) {
        //成功
        if (result.code == LoginConfig.commonConStant.SUCCESS) {
          $scope.showFlag = false;
          $rootScope.toaster("success", "成功", "恭喜您，修改成功！");
        }else {
          $rootScope.toaster("error", "错误", result.message);
        }
      });
    }
  };
  //页面信息
  $scope.pageData = {};
  var level = {
    "warn": "warn",
    "error": "error",
    "success": "success"
  }
  var title = {
    "error": "错误",
    "success": "成功"
  }
  //法官模块对象封装
  function JudgeModuleVO() {
    this.moduleData = [
      {
        style: "panel-verdant",
        linkStyle:"under",
        images:"views/images/fa_logo_1.png",
        number: $scope.numberData.approvalPending == null ? 0 : $scope.numberData.approvalPending,
        link:"dashboard.approval",
        role:["approval"],
        text:'待审批'
      },
      {
        style: "panel-verdant",
        linkStyle:"under",
        images:"views/images/fa_logo_2.png",
        number: $scope.numberData.filingPending == null ? 0 : $scope.numberData.filingPending ,
        link:"dashboard.filing",
        role:["filing"],
        text:'待立案'
      },
      {
        style: "panel-verdant",
        linkStyle:"under",
        images:"views/images/fa_logo_3.png",
        number: $scope.numberData.divisionPending == null ? 0 : $scope.numberData.divisionPending ,
        link:"dashboard.division",
        role:["division"],
        text:'待分案'
      },
      {
        style: "panel-verdant",
        linkStyle:"under",
        images:"views/images/fa_logo_4.png",
        number: $scope.numberData.pretrialMediation == null ? 0 : $scope.numberData.pretrialMediation ,
        link:"dashboard.courtMediationList",
        role:["smallCase","commonCase"],
        text:'庭前调解需要介入'
      },
      {
        style: "panel-verdant",
        linkStyle:"under",
        images:"views/images/fa_logo_5.png",
        number: $scope.numberData.holdCourt == null ? 0 : $scope.numberData.holdCourt,
        link:"dashboard.online_sessionList",
        role:["smallCase","commonCase"],
        text:'今日开庭'
      },
      {
        style: "panel-blue",
        images:"views/images/fa_logo_6.png",
        number: (($scope.numberData.successRate && $scope.numberData.successRate.toFixed(1)) || 0) + "%",
        role:["queryCaseList"],
        text:'调解成功率'
      },
      {
        style: "panel-pink",
        images:"views/images/fa_logo_7.png",
        number: $scope.numberData.judicialCase == null ? 0 : $scope.numberData.judicialCase ,
        role:["queryCaseList"],
        text:'本年新收司法确认案件量'
      },
      {
        style: "panel-pink",
        images:"views/images/fa_logo_8.png",
        number: $scope.numberData.lawSuit == null ? 0 : $scope.numberData.lawSuit,
        role:["queryCaseList"],
        text:'本年新收诉讼案件量'
      },
      {
        style: "panel-verdant",
        linkStyle:"under",
        images:"views/images/fa_logo_1.png",
        number: $scope.numberData.appraisalReturn == null ? 0 : $scope.numberData.appraisalReturn,
        link:"dashboard.appraisalReturnList",
        role:["appraisalReturnList"],
        text:'鉴定退回'
      },
      {
        style: "panel-verdant",
        linkStyle:"under",
        images:"views/images/fa_logo_9.png",
        number: $scope.numberData.appraisalPendingEvaluation == null ? 0 : $scope.numberData.appraisalPendingEvaluation ,
        link:"dashboard.appraisalEvaluateList",
        role:["appraisalEvaluateList"],
        text:'鉴定评价'
      },
      {
        style: "panel-pink",
        images:"views/images/jian_logo_7.png",
        number: $scope.numberData.lawAppraisalMonthCase == null ? 0 : $scope.numberData.lawAppraisalMonthCase ,
        role:["appraisalQueryList"],
        text:'鉴定机构本月案件量'
      },
      {
        style: "panel-pink",
        images:"views/images/jian_logo_8.png",
        number: $scope.numberData.lawAppraisalYearCase == null ? 0 : $scope.numberData.lawAppraisalYearCase ,
        role:["appraisalQueryList"],
        text:'鉴定机构本年案件量'
      }
    ];
  }
  //调解模块对象封装
  function AdjustModuleVO() {
    this.moduleData = [
      {
        style: "panel-verdant",
        linkStyle:"under",
        images:"views/images/jie_logo_1.png",
        number: $scope.numberData.inHandCase == null ? 0 : $scope.numberData.inHandCase,
        link:"dashboard.processing",
        role:["adjustIn"],
        text:'处理中案件'
      },
      {
        style: "panel-verdant",
        linkStyle:"under",
        images:"views/images/jie_logo_1.png",
        number: $scope.numberData.myTodayCase == null ? 0 : $scope.numberData.myTodayCase,
        link:"dashboard.todayMediation",
        role:["adjustList"],
        text:'今日调解'
      },
      {
        style: "panel-verdant",
        linkStyle:"under",
        images:"views/images/jie_logo_1.png",
        number: $scope.numberData.myWeekCase == null ? 0 : $scope.numberData.myWeekCase,
        link:"dashboard.weekMediation",
        role:["adjustList"],
        text:'本周调解'
      },
      {
        style: "panel-blue",
        images:"views/images/fa_logo_6.png",
        number: (($scope.numberData.successRate && $scope.numberData.successRate.toFixed(1)) || 0)+ "%",
        role:["adjustList"],
        text:'调解成功率'
      }, {
        style: "panel-pink",
        images:"views/images/jie_logo_2.png",
        number: $scope.numberData.pointMonthCase == null ? 0 : $scope.numberData.pointMonthCase,
        role:["adjustList"],
        text:'调解点本月案件量'
      }, {
        style: "panel-pink",
        images:"views/images/jie_logo_2.png",
        number: $scope.numberData.pointTodayCase == null ? 0 : $scope.numberData.pointTodayCase,
        role:["adjustList"],
        text:'调解点今日案件量'
      }, {
        style: "panel-pink",
        images:"views/images/jie_logo_2.png",
        number:  $scope.numberData.pointWeekCase == null ? 0 : $scope.numberData.pointWeekCase,
        role:["adjustList"],
        text:'调解点本周案件量'
      }, {
        style: "panel-pink",
        images:"views/images/jie_logo_2.png",
        number:  $scope.numberData.pointYearCase == null ? 0 : $scope.numberData.pointYearCase ,
        role:["adjustList"],
        text:'调解点本年案件量'
      },
      {
        style: "panel-verdant",
        linkStyle:"under",
        images:"views/images/jie_logo_4.png",
        number: $scope.numberData.appraisalPending == null ? 0 : $scope.numberData.appraisalPending,
        link:"dashboard.appraisalToBeSubmit",
        role:["appraisalProgress"],
        text:'鉴定待提交'
      },
      {
        style: "panel-verdant",
        linkStyle:"under",
        images:"views/images/jian_logo_3.png",
        number: $scope.numberData.appraisalAdminicle == null ? 0 : $scope.numberData.appraisalAdminicle ,
        link:"dashboard.appraisalSupplement",
        role:["appraisalProgress"],
        text:'鉴定补充证据'
      },
      {
        style: "panel-pink",
        linkStyle:"under",
        images:"views/images/jie_logo_3.png",
        number: $scope.numberData.appraisalFinish == null ? 0 : $scope.numberData.appraisalFinish ,
        link:"dashboard.appraisalFinish",
        role:["adjustAppraisalQuery"],
        text:'鉴定完成'
      },
      {
        style: "panel-pink",
          images:"views/images/jian_logo_8.png",
        number: $scope.numberData.adjustAppraisalYearCase == null ? 0 : $scope.numberData.adjustAppraisalYearCase ,
        role:["adjustAppraisalQuery"],
        text:'鉴定机构本年案件量'
      }
    ];
  }
  //鉴定模块对象封装
  function AppraisalModuleVO() {
    this.moduleData = [
      {
        style: "panel-verdant",
        linkStyle:"under",
        images:"views/images/jian_logo_1.png",
        number: $scope.numberData.appraisalReceive == null ? 0 : $scope.numberData.appraisalReceive,
        link:"dashboard.appraisalTaskList",
        role:["appraisalTask"],
        text:'鉴定任务接收'
      },
      {
        style: "panel-verdant",
        linkStyle:"under",
        images:"views/images/fa_logo_7.png",
        number: $scope.numberData.appraisalPending == null ? 0 : $scope.numberData.appraisalPending,
        link:"dashboard.appraisalHandleList",
        role:["appraisalTask"],
        text:'鉴定处理'
      },
      {
        style: "panel-verdant",
        linkStyle:"under",
        images:"views/images/jian_logo_3.png",
        number: $scope.numberData.appraisalAdminicle == null ? 0 : $scope.numberData.appraisalAdminicle,
        link:"dashboard.addEvidenceList",
        role:["appraisalQuery"],
        text:'鉴定补充证据'
      },
      {
        style: "panel-verdant",
        linkStyle:"under",
        images:"views/images/jian_logo_4.png",
        number: $scope.numberData.appraisalReturn == null ? 0 : $scope.numberData.appraisalReturn,
        link:"dashboard.returnEvidenceList",
        role:["appraisalQuery"],
        text:'鉴定退回'
      },
      {
        style: "panel-pink",
        images:"views/images/jian_logo_5.png",
        number: $scope.numberData.appraisalTodayCase == null ? 0 : $scope.numberData.appraisalTodayCase,
        role:["appraisalQuery"],
        text:'鉴定机构今日案件量'
      },
      {
        style: "panel-pink",
        images:"views/images/jian_logo_6.png",
        number: $scope.numberData.appraisalWeekCase == null ? 0 : $scope.numberData.appraisalWeekCase,
        role:["appraisalQuery"],
        text:'鉴定机构本周案件量'
      },
      {
        style: "panel-pink",
        images:"views/images/jian_logo_7.png",
        number: $scope.numberData.appraisalMonthCase == null ? 0 : $scope.numberData.appraisalMonthCase,
        role:["appraisalQuery"],
        text:'鉴定机构本月案件量'
      },
      {
        style: "panel-pink",
        images:"views/images/jian_logo_8.png",
        number: $scope.numberData.appraisalYearCase == null ? 0 : $scope.numberData.appraisalYearCase,
        role:["appraisalQuery"],
        text:'鉴定机构本年案件量'
      }
    ]
  }

  //根据权限分配模块
  function isModuleShow() {
    console.log($scope.moduleVO.moduleData)
    $scope.moduleVO.moduleData.forEach(function (v) {
      LoginService.user.userPermissions.forEach(function (m) {
        if(m == v.role[0] || m == v.role[1]){
          v.roleShow = true;
        }
      })
    })
  }

  //法官和调解员是否存在 某个模块
  function isAppraisal(menu) {
    var flag = false;
    LoginService.user.userPermissions.forEach(function (m) {
      if(m == menu){
        flag = true;
      }
    });
    return flag;
  }

  //从后台获取数据
  $scope.getDataInfo = function (listData,moduleParam) {
    //查询模块数据
    if(moduleParam){
      if($scope.sysUser.userType == '1' || $scope.sysUser.userType == '2'){
        $scope.queryHomeStatisticsInfoService(moduleParam).success(function(res) {
          if (res.code == LawConfig.commonConstant.SUCCESS) {
            $scope.numberData = res.result ;
            console.log($scope.numberData)
            if($scope.sysUser.userType == '1'){ //法官
              $scope.moduleVO = new JudgeModuleVO();
            }else  if($scope.sysUser.userType == '2'){  //;调解员
              $scope.moduleVO = new AdjustModuleVO();
            }
            //根据权限分配模块
            isModuleShow();
          } else if (res.result == LawConfig.commonConstant.FAILURE) {
            $rootScope.toaster(level.error, title.error, res.message);
          }

        })
      }else  if($scope.sysUser.userType == '3') { //鉴定机构
        $scope.queryAppraisalStatisticsInfoService(moduleParam).success(function(res) {
          if (res.code == LawConfig.commonConstant.SUCCESS) {
            $scope.numberData = res.result ;
            $scope.moduleVO = new AppraisalModuleVO();
            //根据权限分配模块
            isModuleShow();
          } else if (result.res == LawConfig.commonConstant.FAILURE) {
            $rootScope.toaster(level.error, title.error, res.message);
          }
        })
      }

    }

    //查询列表
    if(listData){
      if($scope.sysUser.userType == '1') { //法官
        //立案部分
        if(isAppraisal('queryCaseList')){
          $scope.queryAllLawAdjustInfoService(listData).success(function (result) {
            if (result.code == LawConfig.commonConstant.SUCCESS) {
              $scope.showList = result.result;
            }
          });
        }
        //鉴定部分
        if(isAppraisal("appraisalQueryList")){
          //查询数据
          $scope.queryAppraisalDetailListService(listData).success(function (result) {
            if(result.code == AppraisalConfig.commonConstant.SUCCESS){
              $scope.caseList = result.result
            }else{
              $rootScope.toaster("error", "错误", result.message);
            }
          });
        }

      }else{    //调解员
        if(isAppraisal("adjustList")){
          $scope.getInquireList(listData).success(function(result) {
            if(result.result){
              $scope.showList = result.result;
            }
          })
        }
        //鉴定部分
        if(isAppraisal("adjustAppraisalQuery")){
          //查询数据
          $scope.queryAppraisalInHandingListService(listData).success(function (result) {
            if(result.code == AppraisalConfig.commonConstant.SUCCESS){
              $scope.caseList = result.result
            }else{
              $rootScope.toaster("error", "错误", result.message);
            }
          });
        }
      }
    }

  }
  //初始化获取组织
  $scope.getCurrentOrg = function () {
    $scope.$on('user2Child', function(){
      initOrg();
    });
    if (LoginService.user.userPermissions) {
      initOrg();
    }
  }
  //初始化数据
  $scope.getCurrentOrg();

  function ListQuery(){
    this.handing ='';
    this.lawOrgId = '';
    this.state = '';
    this.orgId = '';
    this.pageNo = 1;
    this.pageSize = 5;
    this.searchState = '';
  }
  //获取组织
  function initOrg(){
    $scope.userDepart = LoginService.user.sysUser.userDepartList[LoginService.user.sysUser.currentOrg];
    $scope.sysUser = LoginService.user.sysUser;
    var listData = new ListQuery();
    if($scope.sysUser.userType == '1'){ //法官
      // listData.handing = 1;
      listData.state = DictionaryConfig.appraisalDetailState.returnState;
      listData.lawOrgId = $scope.userDepart.orgId;
      $scope.getDataInfo(listData,{lawOrgId:$scope.userDepart.orgId, userId: $scope.sysUser.id});
    }else if($scope.sysUser.userType == '2' &&   $scope.sysUser.loginAccount != 'admin'){ //调解员
      // listData.searchState = '1000';
      listData.orgId = $scope.userDepart.orgId;
      listData.caseType = '1';
      listData.progressFlag = 1;
      listData.createPointId =  $scope.userDepart.deptId;
      listData.searchState = DictionaryConfig.lawState.adjustListState;
      $scope.getDataInfo(listData,{adjustPointCode:$scope.userDepart.deptId, userId: $scope.sysUser.id})
    }else if($scope.sysUser.userType == '3'){ // 鉴定机构
      console.log($scope.userDepart.orgId);
      $scope.getDataInfo('',{appraisalOrgId: $scope.userDepart.orgId, userId: $scope.sysUser.id})
    }
  }


  //跳转相应详细页
  $scope.goCase = function (res) {
    if($scope.sysUser.userType == '2'){
        //调解中
        if(res.state==DictionaryConfig.lawState.adjustListState){
            $state.go("dashboard.mediation",{id:res.id});
        }else{
            $state.go("dashboard.case_details",{serialNo:res.serialNo});
        }
    }else{
        if (res.state == $scope.LAW_STATE.prosecutionFinishState) {//待审批
            $scope.url = 'dashboard.filing_detail'
        } else if (res.state == $scope.LAW_STATE.approvalState) {//待立案
            $scope.url = 'dashboard.filing_detail'
        } else if (res.state == $scope.LAW_STATE.filingState) {//待分案
            $scope.url = 'dashboard.filing_detail'
        } else if (res.state == $scope.LAW_STATE.adjustState) {//庭前调节
            $scope.url = 'dashboard.courtMediation'
        } else if (res.state == $scope.LAW_STATE.notHearingState) {//办案
            if(res.operateType == 0){
                $scope.url = 'dashboard.confirmCase'
            }else{
                $scope.url = 'dashboard.online_session'
            }
        }
        $state.go($scope.url, {serialNo: res.serialNo});
    }
    /*if(res.state==DictionaryConfig.lawState.adjustListState){//处理中
      $state.go("dashboard.mediation",{id:res.id});
    }else{
      if (res.state == $scope.LAW_STATE.prosecutionFinishState) {//待审批
        $scope.url = 'dashboard.filing_detail'
      } else if (res.state == $scope.LAW_STATE.approvalState) {//待立案
        $scope.url = 'dashboard.filing_detail'
      } else if (res.state == $scope.LAW_STATE.filingState) {//待分案
        $scope.url = 'dashboard.filing_detail'
      } else if (res.state == $scope.LAW_STATE.adjustState) {//庭前调节
        $scope.url = 'dashboard.courtMediation'
      } else if (res.state == $scope.LAW_STATE.notHearingState) {//办案
        if(res.operateType == 0){
          $scope.url = 'dashboard.confirmCase'
        }else{
          $scope.url = 'dashboard.online_session'
        }
      }
      $state.go($scope.url, {serialNo: res.serialNo});
    }*/
  }

  //根据流水号查询详情
  $scope.queryDetail = function(appraisalInfo){
    if(appraisalInfo.state == DictionaryConfig.appraisalState.temporaryState){
      $scope.caseType = "1";
      if($scope.sysUser.userType == '0'){//公民
        $scope.caseType = "2";
      }
      var url = $state.href("appraisal_notice",{serialNo:appraisalInfo.serialNo, caseType:$scope.caseType,name:"appraisal_notice"});
      window.open(url,'_blank');
    }else{
      if($scope.sysUser.userType == '1'){ //法官
        $state.go("dashboard.appraisalReturnDetail",{serialNo:appraisalInfo.serialNo,appraisalDetailInfoId:appraisalInfo.id,appraisalNo:appraisalInfo.appraisalNo,appraisalInfoId:appraisalInfo.jyAppraisalInfoId});
      }else if($scope.sysUser.userType == '2' &&   $scope.sysUser.loginAccount != 'admin') { //调解员
        $state.go("dashboard.appraisalQueryDetail",{serialNo:appraisalInfo.serialNo,appraisalNo:appraisalInfo.appraisalNo,personType:1,appraisalInfoId:appraisalInfo.id});
      }
    }
  };
});

