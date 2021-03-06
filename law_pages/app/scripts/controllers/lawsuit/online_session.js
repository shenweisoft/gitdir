/**
 * Created by Administrator on 2017/3/22 0022.
 */
var app = angular.module('sbAdminApp');
app.filter('result2Text', function() {
  return function(result) {
    var text = "";
    if (result.payType == "1" || result.payType == "2") {
      text += result.companyName + "(车牌号:" + result.plateNo + ")";
    } else if (result.payType == "3") {
      if (result.personType == 1) {
        text += result.personName + "自行承担"
      } else if (result.personType == 0) {
        text += result.personName + " 自行承担"
      }
    }
    return text
  }
});
app.filter('id2Text', function () {
  return function (id, data) {
    var result = _.find(data, {
      id: id + ""
    });
    return result ? result.value : ""
  }
});
app.filter('respondents2Company', function() {
  return function(result) {
    var arr = [];
    result.forEach(function(v) {
      if (v.personType == "1" && v.idType == "1" && v.enterpriseType == "1") {
        if (arr.indexOf(v.orgName) == -1) arr.push(v.orgName);
      }
    });
    return arr;
  }
});

app.directive('intOnly', function($filter) {
  return {
    require: 'ngModel',
    link: function(scope, element, attrs, modelCtrl) {
      element.bind('keyup', function(inputValue, e) {
        var strinput = modelCtrl.$modelValue + "";
        strinput = strinput ? strinput.replace(/[^\d.]/g, '') : '0'
        modelCtrl.$setViewValue(parseInt(strinput));
        modelCtrl.$render();
      });
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

app.filter('filterRegions', function () {
  return function (arr) {
    return arr.filter(function (v) {
      return v.level != 4;
    })
  }
});

angular.module('sbAdminApp').controller('OnlineSessionCtrl', function($scope, $location, $log, $rootScope,PrejudgeService,PrejudgeConfig, PoliceConfig, $state,$stateParams, $filter, $modal, $timeout, DictionaryConfig, LoginService,LawService, LawConfig, AdminConstant, IncomeNormConstant, CompensateStandardConstant, Upload, toaster,AdjustService,AdjustConfig,InterfaceService) {
  $scope.lawService = LawService;
  $scope.interfaceService  = InterfaceService;
  //调解结果
  $scope.ajustResultArray = DictionaryConfig.adjustResultList;
  //取得户口类型字典
  $scope.accountTypeList = DictionaryConfig.accountTypeList;
  //填充区域信息
  $scope.adminRegion = AdminConstant.administrationRegions;
  $scope.incomeNorm = IncomeNormConstant.incomeNorm;
  $scope.compensateStandard = CompensateStandardConstant.compensateStandard;
  //获取赔偿年度
  $scope.yearList = DictionaryConfig.getYearList();
  //案由类型
  $scope.factTypeList = DictionaryConfig.factTypeList;
  //判决结果
  $scope.judgeResultList = DictionaryConfig.judgeResultList;
  //诉讼结案
  $scope.closedLawInfoService = LawService.closedLawInfo;
  //发送邮件
  $scope.sendEmailService = LawService.sendEmail;
  //证件类型
  $scope.certificateType = DictionaryConfig.certificateTypeConstant;
  //与申请人的关系
  $scope.relationArray = DictionaryConfig.relation2Applicant;
  //代理人身份子类型
  $scope.agentIdentifySubList = DictionaryConfig.agentIdentifySubList;
  //后台查询计算器的相关标准
  $scope.queryCalculateStandardService = AdjustService.queryCalculateStandard;

  var level = DictionaryConfig.toaster.level;
  var title = DictionaryConfig.toaster.title;
  
  $scope.CONSTANT = {
    "lawInitError":"案件初始化失败",
    "messageBackend": "后台忙,请稍候再试",
    "treeInitError":"地址树加载失败",
    "finishCaseError":"请选择结案日期",
    "closeCaseError":"请选择结案方式",
    "judgeCertificationError":"法院判定事实与理由不能为空",
    "determineReasonError":"裁判要旨不能为空",
    "determineContentError":"判决主文不能为空",
    "messageNoVideoError":"暂时没有视频",
    "dutyRatio":"责任比例之和不可大于100%"
  };
  
  //切换停车费、鉴定费、其它费用
  $scope.selectBxShow = function(fee){
      fee.selectShow = !fee.selectShow;
      $scope.computeChange(fee,true);

  };

    //绝对免赔率
    $scope.absDeductibleChanged = function (respondent) {
        if (respondent.absDeductible > 100) respondent.absDeductible = 100;
        if (respondent.absDeductible < 0) respondent.absDeductible = 0;

        $scope.co.calculate();
    };
  
  //查询头部详细案件
  $scope.queryFilingDetails = function () {
    $scope.lawService.queryLawDetail({
      "serialNo": $stateParams.serialNo
    }).success(function (result) {
      if(result.code ==  LawConfig.commonConstant.SUCCESS ){
        $scope.law = result.result;
        $scope.codeFileName = result.result.codeFileName?LawConfig.lawConstant.lawCodeFileUrl + result.result.codeFileName:'views/images/1(2).png';
      }else{
        $rootScope.toaster(level.error, title.error, $scope.CONSTANT.lawInitError);
      }
    })
  };
  $scope.queryFilingDetails();
  
  $scope.lawCase = {};
  $scope.queryLawDetails = function () {
    $scope.lawService.queryLawInfo({
      "serialNo": $stateParams.serialNo
    }).success(function (result) {
      if(result.code ==  LawConfig.commonConstant.SUCCESS ){
        $scope.lawCase = result.result;
        if ($scope.lawCase.feeDetail) $scope.lawCase.feeDetail = JSON.parse($scope.lawCase.feeDetail);
        if ($scope.lawCase.compensateTable) $scope.lawCase.compensateTable = JSON.parse($scope.lawCase.compensateTable)
        if ($scope.lawCase.deathDate) $scope.lawCase.deathDate = parseISO8601($scope.lawCase.deathDate);
        if ($scope.lawCase.adjustDate) $scope.lawCase.adjustDate = parseISO8601($scope.lawCase.adjustDate);
        if ($scope.lawCase.compensateStandard) $scope.lawCase.compensateStandard = JSON.parse($scope.lawCase.compensateStandard);
        console.log($scope.lawCase)
        if($scope.lawCase.applyAgree==1 && $scope.lawCase.respondentAgree==1){
          $scope.judgeResultList = DictionaryConfig.judgeResultList.filter(function(v){
            return v.id == 2
          })
        }

        $scope.lawCase.applicantArray.filter(function(m){
          return m.personType == 1
        }).forEach(function(n){
          if (n.riskTypes) n.riskTypes = JSON.parse(n.riskTypes);
        })
        //是否能开庭标识,默认不能开庭
        var isShowFlag = false;
        //查看开庭时间，是否允许开庭
        var nowDate = new Date(new Date().getTime() + DictionaryConfig.courtBeforeHour);
        if($scope.lawCase.nextCourtDate){
          if($scope.lawCase.nextCourtDate <= $filter('date')(nowDate,"yyyy-MM-dd HH:mm:ss")){
            isShowFlag = true;
          }
        }else{
          if($scope.lawCase.courtDate){
            if($scope.lawCase.courtDate <= $filter('date')(nowDate,"yyyy-MM-dd HH:mm:ss")){
              isShowFlag = true;
            }
          }
        }
        //如果不是暂缓缴费并且又没有付款，则不能开庭
        if($scope.lawCase.isDeferredCharges != '1' && $scope.lawCase.payState != '1'){
          isShowFlag = false;
        }
        $scope.lawCase.isShowFlag = isShowFlag;
      }else{
        $rootScope.toaster(level.error, title.error, $scope.CONSTANT.lawInitError);
      }
    })
  };
  $scope.queryLawDetails();
  
  $scope.isJudgeFileExist = false;
  $scope.isMediationExist = false;
  $scope.checkFileExist = function(wordType){
    LawService.isFilePageExist({
      wordType: wordType,
      serialNo:$stateParams.serialNo
    }).success(function(res) {
      if(res.code == -1){
        if(wordType == DictionaryConfig.docList[2].id){
          $scope.isJudgeFileExist = false;
        }
        if(wordType == DictionaryConfig.docList[3].id){
          $scope.isMediationExist = false;
        }
        if(wordType == DictionaryConfig.docList[18].id){
          $scope.isRepealExist = false;
        }
      }else{
        if(wordType == DictionaryConfig.docList[2].id){
          $scope.isJudgeFileExist = true;
        }
        if(wordType == DictionaryConfig.docList[3].id){
          $scope.isMediationExist = true;
        }
        if(wordType == DictionaryConfig.docList[18].id){
          $scope.isRepealExist = true;
        }
      }
    })
  }
  $scope.checkFileExist(DictionaryConfig.docList[2].id);
  $scope.checkFileExist(DictionaryConfig.docList[3].id);
  $scope.checkFileExist(DictionaryConfig.docList[18].id);
  
  //保存操作
  $scope.save = function(flag) {
    $scope.calculate();
    var lawCase = angular.copy($scope.lawCase);
    filterParam(lawCase);
    $scope.lawService.saveLawCase(lawCase).success(function(result) {
      if (result.code == LawConfig.commonConstant.SUCCESS) {
        if(flag){
          $rootScope.toaster(level.success, title.success, "保存成功!");
        }
      } else {
        $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageBackend);
      }
    })
  };

  //判断此案件是否要推送到审判系统
  $scope.isApprovalCase = function(){
    $scope.lawService.queryIsApprovalCase({
       serialNo : $stateParams.serialNo,
       operateType : "1" // 1 诉讼案件
    }).success(function(result){
      if (result.code == LawConfig.commonConstant.SUCCESS) {
        $scope.isShowApprovalButton = result.result;
      }
    })
  }
  $scope.isApprovalCase();
  
  //推送案件信息审判系统
  $scope.sendCaseToJudge = function(){

    //判断是否已经生成文书
    var writType = '';
    if(!$scope.lawCase.closeCaseType && $scope.lawCase.closeCaseType != '0') {
      $rootScope.toaster(level.error, title.error, "请选择结案方式!");
      return;
    }

    $scope.lawCase.closeCaseType == '2'?writType = 3: writType = 2;
    //请求文书数据
    $scope.lawService.viewInstrument({
      serialNo : $stateParams.serialNo
    }).success(function (res) {
      console.log(res)
      if (res.code == LawConfig.commonConstant.SUCCESS) {
        var len;
        len = res.result.filter(function (v) {
          return v.wordType == writType;
        }).length;
        if(!len) {
          $rootScope.toaster(level.error, title.error, "请先生成文书!");
        } else {
          $scope.interfaceService.sendClosedCaseToJudge({
            serialNo:$stateParams.serialNo
          }).success(function(result){
            if (result.code == LawConfig.commonConstant.SUCCESS) {
              $rootScope.toaster(level.success, title.success, "已推送!");
            }else{
              $rootScope.toaster(level.error, title.success, "推送失败，请稍后再试!");
            }
          })
        }
      } else {
        $rootScope.toaster(level.error, title.error, res.message);
      }
    });
  }
  
  function filterParam(lawCase) {
    if(lawCase.applicantArray){
      lawCase.applicantArray.forEach(function(v) {
        if (v.birthDay) v.birthDay = $filter('date')(v.birthDay, 'yyyy-MM-dd HH:mm:ss');
        if (v.riskTypes) v.riskTypes = JSON.stringify(v.riskTypes);
        if(v.agentArray){
          v.agentArray.forEach(function(m) {
            if (m.birthDay) m.birthDay = $filter('date')(m.birthDay, 'yyyy-MM-dd HH:mm:ss');
          })
        }
      });
    }
    if (lawCase.compensateStandard) lawCase.compensateStandard = JSON.stringify(lawCase.compensateStandard);
    if (lawCase.compensateTable) lawCase.compensateTable = JSON.stringify(lawCase.compensateTable);
    if (lawCase.feeDetail) lawCase.feeDetail = JSON.stringify(lawCase.feeDetail);
    if (lawCase.deathDate) lawCase.deathDate = $filter('date')(lawCase.deathDate, 'yyyy-MM-dd HH:mm:ss');
    if (lawCase.payDate) lawCase.payDate = $filter('date')(lawCase.payDate, 'yyyy-MM-dd HH:mm:ss');
    if (lawCase.adjustDate) lawCase.adjustDate = $filter('date')(lawCase.adjustDate, 'yyyy-MM-dd HH:mm:ss');
    if (lawCase.nextCourtDate) lawCase.nextCourtDate = $filter('date')(lawCase.nextCourtDate, 'yyyy-MM-dd HH:mm:ss');
    if (lawCase.closeCaseDate) lawCase.closeCaseDate = $filter('date')(lawCase.closeCaseDate, 'yyyy-MM-dd HH:mm:ss')    ;
  }

  function validateForm(){
    //结案日期
    if(!$scope.lawCase.closeCaseDate){
      $rootScope.toaster(level.error, title.error, $scope.CONSTANT.finishCaseError);
      return false;
    }
    //结案方式
    if(!$scope.lawCase.closeCaseType){
      $rootScope.toaster(level.error, title.error, $scope.CONSTANT.closeCaseError);
      return false;
    }

    //法院判定事实与理由
    if(!$scope.lawCase.judgeCertification){
      $rootScope.toaster(level.error, title.error, $scope.CONSTANT.judgeCertificationError);
      return false;
    }

    //法官认证
    if(!$scope.lawCase.determineReason){
      $rootScope.toaster(level.error, title.error, $scope.CONSTANT.determineReasonError);
      return false;
    }
  
    //判决主文
    if(!$scope.lawCase.determineContent){
      $rootScope.toaster(level.error, title.error, $scope.CONSTANT.determineContentError);
      return false;
    }

    //责任比例
    //重置责任比例对象
    $scope.dutyRatio = {};
    //将每个责任人比率存入对象
    _.each($scope.lawCase.applicantArray, function(obj,i) {
      if($scope.showRespondentFilter(obj) && obj.responsibleRate) {
        $scope.dutyRatio[obj.personName+i] = obj.responsibleRate
      }
    });
    var total = 0;
    _.each($scope.dutyRatio, function (v,k) {
      total = total + parseInt(v);
    })
    if(total > 100) {
      $rootScope.toaster(level.error, title.error, $scope.CONSTANT.dutyRatio);
      return false;
    }
    return true;
  }
  
  $scope.closeCaseTypeChanged = function(initParam){
    if(!$scope.documentLaw && initParam){
      $scope.lawService.queryLawInfo({
        "serialNo": $stateParams.serialNo
      }).success(function(res){
        $scope.documentLaw = res.result;
        if($scope.documentLaw.applicantArray){
          $scope.documentLaw.applicantArray.forEach(function(v){
            if (v.birthDay) v.birthDay = parseISO8601(v.birthDay);
            if(v.agentArray){
              v.agentArray.forEach(function (m) {
                if (m.birthDay) m.birthDay = parseISO8601(m.birthDay);
              })
            }
          })
        }
        if ($scope.documentLaw.adjustDate) $scope.documentLaw.adjustDate = parseISO8601($scope.documentLaw.adjustDate);
        if ($scope.documentLaw.courtDate) $scope.documentLaw.courtDate = parseISO8601($scope.documentLaw.courtDate);
        if ($scope.documentLaw.filingDate) $scope.documentLaw.filingDate = parseISO8601($scope.documentLaw.filingDate);
        $scope.documentLaw.feeDetail = JSON.parse($scope.documentLaw.feeDetail)
        $scope.documentLaw.compensateTable = JSON.parse($scope.documentLaw.compensateTable)
        //获取当前时间
        $scope.documentLaw.createDocumentDate = conversionDate(new Date());
        console.log($scope.documentLaw)
      })
    }
  }
  $scope.closeCaseTypeChanged(1);

  //生成文书
  $scope.generateDocument = function(wordType){
    if(wordType==2 && (validateForm() == false)){
      return;
    }
    function documentBuild(text) {
      var bodyObj = '<body class="b1 b2">' + text + '</body>';
      return bodyObj;
    }
    var applicant = $scope.lawCase.applicantArray.filter(function(e) {
      return e.personType == 0 ;
    });
    var applicantName = applicant[0].idType =='0' ? applicant[0].personName : applicant[0].orgName;
    var fileName = ( wordType==2?"判决书": wordType==3?"调解书":"撤诉裁定书" ) + "（"+applicantName+"）";
    console.log($scope.createDocumentDate)
    var result = wordType==2?$('#judgeDocument').html(): wordType==3?$('#mediationDocument').html():$('#repealDocument').html();
    result = documentBuild(result);
    //return;
    LawService.buildWord({
      serialNo: $scope.documentLaw.serialNo,
      type: 108,
      wordType:wordType,
      fileName: fileName,
      content: result
    }).success(function(result) {
      var data = result.result;
      if (result.code == LawConfig.commonConstant.FAILURE) {
        $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageBackend);
      }else{
        if(wordType==2) $scope.isJudgeFileExist=true;
        if(wordType==3) $scope.isMediationExist=true;
        if(wordType==41) $scope.isRepealExist=true;
      }
    })
  }

  //将日期格式改为大写
  function conversionDate(date) {
    //获取当前时间年月日
    var year = date.getFullYear();
    var month = date.getMonth()+1;
    var day = date.getDate();
    var mapDate = { //创建数字对应的大写对象
      time0: '〇',
      time1: '一',
      time2: '二',
      time3: '三',
      time4: '四',
      time5: '五',
      time6: '六',
      time7: '七',
      time8: '八',
      time9: '九',
      time10: '十'
    };
    //将每个数字转换成大写
    function getNumberUp(numberArr, type) {
      var arr = [];
      numberArr.forEach(function (v, index) {
        if(type != 'year' && index == '1') {
          arr.push('十');
        }
        arr.push(mapDate['time'+v]);
      })
      return arr;
    }
    return (getNumberUp(year.toString().split(''), 'year').join('')+'年'+getNumberUp(month.toString().split(''), 'month').join('')+'月'+getNumberUp(day.toString().split(''), 'day').join('')+'日')
  }

//是否取消鉴定
function isFinish(){
  //查询法院是否对接了鉴定系统
  var loginAccount = LoginService.user.sysUser.loginAccount
  var userType = LoginService.user.sysUser.userType
  var data = {
      serialCode: $scope.documentLaw.serialNo, //流水号
      loginAccount: loginAccount,
      userType: userType,
      cancelAppraisal: 1
  }
  $scope.prejudgeService = PrejudgeService;
  $scope.prejudgeService.identification(data).success(function (result) {
      if (result.code == PrejudgeConfig.commonConstant.SUCCESS) {
          if (result.result.errorCode == PrejudgeConfig.serviceConstant.SUC_JIANDING) {
              $scope.closeCase();
          }else{
              $rootScope.toaster("error", "提示", result.result.errorMessage);
          }
      }else {
          $rootScope.toaster("error", "错误", result.message);
      }
  })
}  

//没有对接鉴定平台的是否强制取消鉴定
function isFinishOld(){
  //查询法院是否对接了鉴定系统
  //var loginAccount = LoginService.user.sysUser.loginAccount
  var userType = LoginService.user.sysUser.userType
  var data = {
      serialCode: $scope.documentLaw.serialNo, //流水号
      //loginAccount: loginAccount,
      userType: userType,
      cancelAppraisal: 1
  }
  $scope.oldBusinessAppraisal(data).success(function (result) {
      if (result.code == PrejudgeConfig.commonConstant.SUCCESS) {
          $scope.closeCase();
      }else {
          $rootScope.toaster("error", "错误", result.message);
      }
  })
}

//是否对接鉴定平台方法封装
function isSendtrueOrFalse(isSendAppraisal){
  if(($scope.documentLaw.isSendAppraisal == 2 && $scope.documentLaw.isAppraisalFinish == 0) || ($scope.documentLaw.oldIsSendAppraisal == 2 && $scope.documentLaw.oldIsAppraisalFinish == 0) ){ //已提交未完成
    $rootScope.toaster("warn", "提示", "有已提交，未完成的鉴定，不能结案");
  }else if(($scope.documentLaw.isSendAppraisal == 1 && $scope.documentLaw.isAppraisalFinish == 0) || ($scope.documentLaw.oldIsSendAppraisal == 1 && $scope.documentLaw.oldIsAppraisalFinish == 0)){ //已发起未提交
      if(confirm("有一个未提交的鉴定，是否强制结案？")){
        isSendAppraisal==1?isFinish():isFinishOld()
      }
  }else{ //正常情况
    $scope.closeCase();
  }
}


//结案
$scope.finishTipFn = function () {
    //法院开启了权限$scope.isSendAppraisal==1
    var userDepart = LoginService.user.sysUser.userDepartList[LoginService.user.sysUser.currentOrg]
    isSendtrueOrFalse(userDepart.isSendAppraisal)
    // if(userDepart.isSendAppraisal==1){
    //     // if($scope.documentLaw.isSendAppraisal == 2 && $scope.documentLaw.isAppraisalFinish == 0){ //已提交未完成
    //     //     $rootScope.toaster("warn", "提示", "有已提交，未完成的鉴定，不能结案");
    //     // }else if($scope.documentLaw.isSendAppraisal == 1 && $scope.documentLaw.isAppraisalFinish == 0){ //已发起未提交
    //     //     if(confirm("有一个未提交的鉴定，是否强制结案？")){
    //     //         isFinish()
    //     //     }
    //     // }else{ //正常情况
    //     //   $scope.closeCase();
    //     // }
    //     isSendtrueOrFalse(1)
    // }else{
    //   // if($scope.documentLaw.isSendAppraisal == 2 && $scope.documentLaw.isAppraisalFinish == 0){ //已提交未完成
    //   //   $rootScope.toaster("warn", "提示", "有已提交，未完成的鉴定，不能结案");
    //   // }else if($scope.documentLaw.isSendAppraisal == 1 && $scope.documentLaw.isAppraisalFinish == 0){ //已发起未提交
    //   //     if(confirm("有一个未提交的鉴定，是否强制结案？")){
    //   //         isFinishOld()
    //   //     }
    //   // }else{ //正常情况
    //   //   $scope.closeCase();
    //   // }
    //   isSendtrueOrFalse(0)
    // }
}
  
  $scope.buttonDisabled = false;
  $scope.closeCase = function(){
   if(validateForm()){
      if(confirm("确认要结案吗？")) {
        //之前状态
        $scope.oldState = $scope.lawCase.state;
        //修改之后的状态
        $scope.lawCase.state = DictionaryConfig.lawState.finishState;
        $scope.save();
        //更新
        $scope.closedLawInfoService({
          "serialNo":$scope.law.serialNo
        }).success(function (result) {
          if(result.code ==  LawConfig.commonConstant.SUCCESS){
            $scope.buttonDisabled = true;
            //判决或者调解时发送邮件
            // if($scope.lawCase.closeCaseType == 1 || $scope.lawCase.closeCaseType == 2){
            //   sendEmail();
            // }
            //插流程表
            insertWorkFlow();
          }else{
            $rootScope.toaster("error", "错误", result.message);
            $scope.buttonDisabled = false;
          }
        })
      }
    }
  }
  //发送邮件
  function sendEmail() {
    $scope.sendEmailService({
      "emailType":$scope.lawCase.closeCaseType == 1 ? 3:4, //裁决书3，调解书4
      "serialNo":$scope.law.serialNo
      }).success(function (result) {
        if(result.code !=  LawConfig.commonConstant.SUCCESS){
          $rootScope.toaster("error", "错误", result.message);
        }
    })
  }
  function insertWorkFlow() {
    //插入流程表信息
    var workFlowData = initWorkFlowData($scope.lawCase);
    $scope.lawService.insertJyWorkFlow({
      type: DictionaryConfig.lawType.caseComplete,
      serialNo: $scope.lawCase.serialNo,
      orgCode: $scope.lawCase.lawOrgId,
      orgName: $scope.lawCase.lawOrgName,
      result: 0,
      resultName: "案件完结",
      remark: $scope.lawCase.closeCaseSuggest,
      tempData: JSON.stringify(workFlowData)
    }).success(function(result) {
      if (result.code == LawConfig.commonConstant.SUCCESS) {
        var sendInfo = angular.toJson({type:$scope.oldState,operateType:1,redirect:$scope.lawCase.isSmallAmount==1?"small":"common"});
        $state.go("dashboard.pending_complete",{pageInfo:sendInfo});
      } else {
        $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageBackend);
      }
    })
  }
  //在线开庭
  $scope.onlineCourt = function(lawCase){
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
  };
  
  //查看视频回放
  $scope.viewCourtVideo = function(lawCase){
    $scope.lawService.viewCourtVideo({
      serialNo:lawCase.serialNo
    }).success(function(res){
      if(res.result && res.result.length > 0){
        window.open(res.result[0],'_blank');
      }else{
        $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageNoVideoError);
      }
    })
  }
  
  //上传判决文书
  $scope.uploadJudgeFile = function(file){
    if(!file) return;
    if (file) {
      var fileName = file.name.substring(0,file.name.lastIndexOf('.'));
      $scope.uploadFile(fileName,file, '2', '判决文书');
    }
  };
  
  //上传调解书
  $scope.uploadConfirmFile = function(file){
    if(!file) return;
    if (file && file) {
      var fileName = file.name.substring(0,file.name.lastIndexOf('.'));
      $scope.uploadFile(fileName, file, '3', '调解书');
    }
  };
  
  //下载文书
  $scope.downloadFile = function(lawCase, wordType){
    return LawConfig.fileConstant.downloadInstrumentByWorkNoUrl + "?serialNo="+lawCase.serialNo + "&wordType="+wordType;
  };
  
  //上传文件
  $scope.uploadFile = function(fileName,file, wordType, name){
    Upload.upload({
      url: LawConfig.fileConstant.uploadUrlByWordType,
      data: {
        file: file,
        type:DictionaryConfig.lawType.courtInfo,
        name:name,
        wordType: wordType,
        serialNo:$scope.lawCase.serialNo
      }
    }).success(function(res){
      if(res.code ==  LawConfig.commonConstant.SUCCESS ){
        $rootScope.toaster(DictionaryConfig.toaster.level.success, DictionaryConfig.toaster.title.success, "文件上传成功!");
      }else{
        $rootScope.toaster(DictionaryConfig.toaster.level.error, DictionaryConfig.toaster.title.error, "文件上传失败!");
      }
    })
  }

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
    if(LoginService.user.sysUser.userDepartList.length>0){
      $scope.isSendAppraisal = $scope.userDepart.isSendAppraisal;
      }
  }
  //默认刷新组织
  $scope.getCurrentOrg();

  var initWorkFlowData = function(lawCase){
    var workFlowData = new DictionaryConfig.workFlowData();
    workFlowData.serialNo = lawCase.serialNo;
    var respondents = "";
    lawCase.applicantArray.filter(function(v){
      return v.personType==1 && v.delFlag==0;
    }).forEach(function(v){
      if(respondents) respondents += "," + v.personName;
      else respondents += v.personName;
    })
    workFlowData.respondent =respondents;
    workFlowData.adjustOrgName = lawCase.adjustOrgName;
    workFlowData.adjustPointName = lawCase.adjustPointName;
    workFlowData.regulationNo = lawCase.regulationNo;
    workFlowData.lawMoney = lawCase.lawMoney;
    workFlowData.adjustDate = lawCase.adjustDate;
    workFlowData.adjustResult = lawCase.adjustResult;
    workFlowData.adjustName = lawCase.adjustName;
    workFlowData.lawDeptName = $scope.userDepart.deptName;

    return workFlowData;
  }
  
  $scope.goback = function(){
    if($scope.lawCase.isSmallAmount == 1) $state.go("dashboard.smallCaseTodo");
    else $state.go("dashboard.commonCaseTodo");
  }
  
  $scope.$watch('lawCase.deathDate', function(newV, oldV, scope) {
    if (newV == oldV) return;
    if (newV > new Date()) scope.lawCase.deathDate = new Date();
  });
  
  $scope.treeConfig = {
    core: {
      multiple: false,
      animation: true,
      error: function(error) {
        $rootScope.toaster(level.error, title.error, $scope.CONSTANT.treeInitError);
      },
      check_callback: true,
      worker: true
    },
    types: {
      "default": {
        icon: 'iconfont icon-dizhi'
      },
      folder: {
        icon: 'iconfont icon-wenjian1'
      }
    },
    version: 1,
    plugins: ['types']
  };
  //默认数为收起状态
  $scope.isShowTree = false;
  
  $scope.blurAdmin = function(){
    if($scope.isShowTree){
      $timeout(function(){
        $scope.isShowTree = false;
      }, 200);
    }
  };
  
  //选择节点信息
  $scope.selectAdmin = function(node, selected, event) {
    var selectedNodes = selected.selected;
    if (selectedNodes.length > 0) {
      var selectedRegion = $scope.adminRegion[selectedNodes[0]];
      if ($scope.lawCase.regionName != selectedRegion.fullName) {
        $scope.lawCase.regionName = selectedRegion.fullName;
        $scope.isShowTree = false;
        $scope.findIncomeAndCompensate(true);
        //查询备注
        queryMtRegionalNameRemark();
      }
    }
  };
  
  function parseISO8601(dateStringInRange) {
    var isoExp = /^\s*(\d{4})-(\d\d)-(\d\d) (\d{2}):(\d{2}):(\d{2})\s*$/,
      date = new Date(NaN), month,
      parts = isoExp.exec(dateStringInRange);
    
    if(parts) {
      month = +parts[2];
      date.setFullYear(parts[1], month - 1, parts[3]);
      if(month != date.getMonth() + 1) {
        date.setTime(NaN);
      }
    }
    return date;
  }
  
  $scope.viewCourtPayment = function(){
    $state.go('dashboard.litigation_payment', {'serialNo':$scope.lawCase.serialNo, 'forward':"1"});
  }
  
  $scope.findIncomeAndCompensate = function(flag) {
    if ($scope.lawCase.regionName && $scope.lawCase.standardYear) {
      queryCalculateStandard(flag);
    }
  };

  //默认系统初始化居民收支标准以及赔偿标准(延时一秒钟处理)
  setTimeout($scope.findIncomeAndCompensate,1000);

  //计算器传输对象
  function CalculateVO(){
    this.regionName = $scope.lawCase.regionName;
    this.standardYear = $scope.lawCase.standardYear;
    this.household = $scope.lawCase.household;
  };
  //根据参数查询后端标准
  function queryCalculateStandard(flag){
    $scope.calculateVO = new CalculateVO();
    $scope.queryCalculateStandardService($scope.calculateVO).success(function(result) {
      //请求成功
      if (result.code == AdjustConfig.commonConStant.SUCCESS) {
        var calculateResultVO = result.result;
        //计算费用标准
        //误工费
        if(calculateResultVO.lostIncome){
          $scope.lawCase.compensateStandard.lostIncome = calculateResultVO.lostIncome;
        }else{
          $scope.lawCase.compensateStandard.lostIncome = "";
        }
        //护理费
        if(calculateResultVO.standardNurseFee){
          $scope.lawCase.compensateStandard.standardNurseFee = calculateResultVO.standardNurseFee;
        }else{
          $scope.lawCase.compensateStandard.standardNurseFee = "";
        }
        //住院伙食补助费
        if(calculateResultVO.hospitalFoodSubsidies){
          $scope.lawCase.compensateStandard.hospitalFoodSubsidies = calculateResultVO.hospitalFoodSubsidies;
        }else{
          $scope.lawCase.compensateStandard.hospitalFoodSubsidies = "";
        }
        //营养费
        if(calculateResultVO.thesePayments){
          $scope.lawCase.compensateStandard.thesePayments = calculateResultVO.thesePayments;
        }else{
          $scope.lawCase.compensateStandard.thesePayments = "";
        }
        //交通费
        if(calculateResultVO.transportationFee){
          $scope.lawCase.compensateStandard.transportationFee = calculateResultVO.transportationFee;
        }else{
          $scope.lawCase.compensateStandard.transportationFee = "";
        }
        //住宿费
        if(calculateResultVO.accommodationFee){
          $scope.lawCase.compensateStandard.accommodationFee = calculateResultVO.accommodationFee;
        }else{
          $scope.lawCase.compensateStandard.accommodationFee = "";
        }
        //丧葬费
        if(calculateResultVO.funeralFeeStandard){
          $scope.lawCase.compensateStandard.funeralFeeStandard = calculateResultVO.funeralFeeStandard;
        }else{
          $scope.lawCase.compensateStandard.funeralFeeStandard = "";
        }
        //精神抚慰金标准
        if(calculateResultVO.spiritualConsolationFee){
          $scope.lawCase.compensateStandard.spiritualConsolationFee = calculateResultVO.spiritualConsolationFee;
        }else{
          $scope.lawCase.compensateStandard.spiritualConsolationFee = "";
        }

        //计算居民收入支出标准
        //农村赔偿标准
        //城镇在岗职工收入标准
        if(calculateResultVO.urbanSalary){
          $scope.lawCase.compensateStandard.wageIncome = calculateResultVO.urbanSalary;
        }else{
          $scope.lawCase.compensateStandard.wageIncome = "";
        }

        if(!calculateResultVO.ruralNetIncome){
          calculateResultVO.ruralNetIncome = "";
        }
        if(!calculateResultVO.ruralAverageOutlay){
          calculateResultVO.ruralAverageOutlay = "";
        }
        if(!calculateResultVO.urbanDisposableIncome){
          calculateResultVO.urbanDisposableIncome = "";
        }
        if(!calculateResultVO.urbanAverageOutlay){
          calculateResultVO.urbanAverageOutlay = "";
        }

        $scope.lawCase.compensateStandard["1"] = {
          "income": calculateResultVO.ruralNetIncome,
          "expense": calculateResultVO.ruralAverageOutlay
        };
        //城镇赔偿标准
        $scope.lawCase.compensateStandard["2"] = {
          "income": calculateResultVO.urbanDisposableIncome,
          "expense": calculateResultVO.urbanAverageOutlay
        };
        //循环计算器详细表
        var householdStr =  $scope.lawCase.household == '1'?"农村":"城镇";
        $scope.lawCase.feeDetail.forEach(function(v) {
          var cityStr = v.value +"："+ $scope.lawCase.regionName+$scope.lawCase.standardYear+"年"+householdStr+"标准：";
          //住院伙食补助费
          if(v.id == '06'){
            if(calculateResultVO.hospitalFoodSubsidies){
              v.isClaimWarning = true;
              v.warningText = cityStr+calculateResultVO.hospitalFoodSubsidies+"元/天";
            }else{
              v.isClaimWarning = undefined;
              v.warningText = undefined;
            }
          }else if(v.id == '07'){//营养费
            if(calculateResultVO.thesePayments){
              v.isClaimWarning = true;
              v.warningText = cityStr+calculateResultVO.thesePayments+"元/天";
            }else{
              v.isClaimWarning = undefined;
              v.warningText = undefined;
            }
          }else if(v.id == '08' || v.id == '80'){//误工费与处理人误工费
            if(calculateResultVO.lostIncome){
              v.isClaimWarning = true;
              v.warningText = cityStr+calculateResultVO.lostIncome+"元/天";
            }else{
              v.isClaimWarning = undefined;
              v.warningText = undefined;
            }
          }else if(v.id == '09'){//护理费
            if(calculateResultVO.standardNurseFee){
              v.isClaimWarning = true;
              v.warningText = cityStr+calculateResultVO.standardNurseFee+"元/天";
            }else{
              v.isClaimWarning = undefined;
              v.warningText = undefined;
            }
          }else if(v.id == '11'){//住宿费
            if(calculateResultVO.accommodationFee){
              v.isClaimWarning = true;
              v.warningText = cityStr+calculateResultVO.accommodationFee+"元/天";
            }else{
              v.isClaimWarning = undefined;
              v.warningText = undefined;
            }
          }else if(v.id == '14'){//被抚养人生活费
            if($scope.lawCase.household == '1'){
              if(calculateResultVO.ruralAverageOutlay){
                v.isClaimWarning = true;
                v.warningText = cityStr+calculateResultVO.ruralAverageOutlay+"元/年";
              }else{
                v.isClaimWarning = undefined;
                v.warningText = undefined;
              }
            }else{
              if(calculateResultVO.urbanAverageOutlay){
                v.isClaimWarning = true;
                v.warningText = cityStr+calculateResultVO.urbanAverageOutlay+"元/年";
              }else{
                v.isClaimWarning = undefined;
                v.warningText = undefined;
              }
            }
          }else if (v.id == "12" || v.id == "15") {
            //农村或者城镇赔偿标准
            var ruleMoney = $scope.lawCase.compensateStandard[$scope.lawCase.household];
            if( ruleMoney && parseFloat(ruleMoney.income) > 0){
              //显示标准
              v.isClaimWarning = true;
              v.warningText = cityStr+ruleMoney.income+"元/年";
              //调解金额
              if((!flag && (!v.claimPerUnit || parseFloat(v.claimPerUnit) <= 0)) ||  flag){
                v.claimPerUnit = ruleMoney.income;
                v.claimAmount = v.claimPerUnit * v.claimUnit * $scope.lawCase.compensateRate / 100;
              }
            }else{
              v.isClaimWarning = undefined;
              v.warningText = undefined;
            }
          }else if(v.id == '16'){//丧葬费
            if(calculateResultVO.funeralFeeStandard){
              v.isClaimWarning = true;
              v.warningText = cityStr+parseFloat(calculateResultVO.funeralFeeStandard/12).toFixed(2)+"元/月";
            }else{
              v.isClaimWarning = undefined;
              v.warningText = undefined;
            }
          }else if (v.id == '17'){//精神抚慰金
            if(calculateResultVO.spiritualConsolationFee){
              v.isClaimWarning = true;
              v.warningText = cityStr+parseFloat(calculateResultVO.spiritualConsolationFee).toFixed(2)+"元";
            }else{
              v.isClaimWarning = undefined;
              v.warningText = undefined;
            }
          }
        });
      }else{
        //请求失败
        $rootScope.toaster("error", "错误", result.message);
      }
    });
  }

  $scope.changeYear = function(){
    $scope.findIncomeAndCompensate(true);
    //查询备注
    queryMtRegionalNameRemark();
  };

  //查询计算器备注
  function queryMtRegionalNameRemark() {

    //根据年度和区域查询计算器备注
    $scope.queryMtRegionalNameRemarkService = LoginService.queryMtRegionalNameRemark;
    $scope.calculateVO = new CalculateVO();
    //查询数据
    $scope.queryMtRegionalNameRemarkService($scope.calculateVO).success(function(result){
      if (result.code == AdjustConfig.commonConStant.SUCCESS) {
        if(result.result){
          //备注集合列表
          var mtRegionalNameRemark = result.result;
          //医疗费
          var medicalFee = _.find($scope.lawCase.feeDetail,{id:'03'});
          if(medicalFee)medicalFee.remark = mtRegionalNameRemark.medicalFee;
          //后续治疗费
          var followUpFee = _.find($scope.lawCase.feeDetail,{id:'04'});
          if(followUpFee) followUpFee.remark = mtRegionalNameRemark.followUpFee;
          //住院伙食补助费
          var foodSubsidy = _.find($scope.lawCase.feeDetail,{id:'06'});
          if(foodSubsidy) foodSubsidy.remark = mtRegionalNameRemark.foodSubsidy;
          //营养费
          var nutritionFee = _.find($scope.lawCase.feeDetail,{id:'07'});
          if(nutritionFee) nutritionFee.remark = mtRegionalNameRemark.nutritionFee;
          //误工费
          var lossOfWorking = _.find($scope.lawCase.feeDetail,{id:'08'});
          if(lossOfWorking) lossOfWorking.remark = mtRegionalNameRemark.lossOfWorking;
          //护理费
          var nursingFee = _.find($scope.lawCase.feeDetail,{id:'09'});
          if(nursingFee) nursingFee.remark = mtRegionalNameRemark.nursingFee;
          //残疾赔偿金
          var disabilityFee = _.find($scope.lawCase.feeDetail,{id:'12'});
          if(disabilityFee) disabilityFee.remark = mtRegionalNameRemark.disabilityFee;
          //残疾辅助器具费
          var disabilityAids = _.find($scope.lawCase.feeDetail,{id:'13'});
          if(disabilityAids) disabilityAids.remark = mtRegionalNameRemark.disabilityAids;
          //被抚养人生活费
          var dependentsFee = _.find($scope.lawCase.feeDetail,{id:'14'});
          if(dependentsFee) dependentsFee.remark = mtRegionalNameRemark.dependentsFee;
          //精神损害抚慰金
          var mentalDamage = _.find($scope.lawCase.feeDetail,{id:'17'});
          if(mentalDamage) mentalDamage.remark = mtRegionalNameRemark.mentalDamage;
          //死亡赔偿金
          var deathFee = _.find($scope.lawCase.feeDetail,{id:'15'});
          if(deathFee) deathFee.remark = mtRegionalNameRemark.deathFee;
          //丧葬费
          var funeralExpenses = _.find($scope.lawCase.feeDetail,{id:'16'});
          if(funeralExpenses) funeralExpenses.remark = mtRegionalNameRemark.funeralExpenses;
          //处理事故人员误工费
          var accidentPersonnel = _.find($scope.lawCase.feeDetail,{id:'80'});
          if(accidentPersonnel) accidentPersonnel.remark = mtRegionalNameRemark.accidentPersonnel;
          //交通费
          var trafficExpense = _.find($scope.lawCase.feeDetail,{id:'10'});
          if(trafficExpense) trafficExpense.remark = mtRegionalNameRemark.trafficExpense;
          //住宿费
          var hotelExpense = _.find($scope.lawCase.feeDetail,{id:'11'});
          if(hotelExpense) hotelExpense.remark = mtRegionalNameRemark.hotelExpense;
          //财产损失
          var propertyLoss = _.find($scope.lawCase.feeDetail,{id:'30'});
          if(propertyLoss) propertyLoss.remark = mtRegionalNameRemark.propertyLoss;
          //车辆损失
          var vehicleLoss = _.find($scope.lawCase.feeDetail,{id:'40'});
          if(vehicleLoss) vehicleLoss.remark = mtRegionalNameRemark.vehicleLoss;
          //拖车费
          var trailerFee = _.find($scope.lawCase.feeDetail,{id:'50'});
          if(trailerFee) trailerFee.remark = mtRegionalNameRemark.trailerFee;
          //施救费
          var rescueFee = _.find($scope.lawCase.feeDetail,{id:'70'});
          if(rescueFee) rescueFee.remark = mtRegionalNameRemark.rescueFee;
          //停车费
          var parkingRate = _.find($scope.lawCase.feeDetail,{id:'60'});
          if(parkingRate) parkingRate.remark = mtRegionalNameRemark.parkingRate;
          //鉴定费
          var appraisalFee = _.find($scope.lawCase.feeDetail,{id:'18'});
          if(appraisalFee) appraisalFee.remark = mtRegionalNameRemark.appraisalFee;
          //其它费用
          var otherExpenses = _.find($scope.lawCase.feeDetail,{id:'71'});
          if(otherExpenses) otherExpenses.remark = mtRegionalNameRemark.otherExpenses;
        }else{
          if($scope.lawCase.feeDetail){
            $scope.lawCase.feeDetail.forEach(function(val){
              val.remark = "";
            });
          }

        }
      }
    });
  }
  
  $scope.deathDateOpened = false;
  $scope.adjustDateOpened = false;
  $scope.payDateOpened = false;
  $scope.openDeathDate = function($event, index) {
    $event.preventDefault();
    $event.stopPropagation();
    $scope.deathDateOpened = true;
  };
  $scope.openAdjustDate = function($event, index) {
    $event.preventDefault();
    $event.stopPropagation();
    $scope.adjustDateOpened = true;
  };
  $scope.openPayDate = function($event, index) {
    $event.preventDefault();
    $event.stopPropagation();
    $scope.payDateOpened = true;
  };
  
  $scope.riskTypes = [{
    id: "0",
    value: "交强险"
  }, {
    id: "1",
    value: "三者险"
  }, {
    id: "2",
    value: "不计免赔"
  }];
  
  $scope.addRespondentFilter = function(e) {
    var temp = e.responsibleRate ? e.responsibleRate == -1 : e.responsibleRate == 0 ? false : true;
    return e.personType == 1 && (e.idType == '0' || e.idType == '2' || (e.idType == '1' && e.enterpriseType != '1')) && temp;
  }
  
  $scope.showRespondentFilter = function(e) {
    var temp = e.responsibleRate ? e.responsibleRate != -1 : e.responsibleRate == 0 ? true : false;
    return e.personType == 1 && (e.idType == '0' || e.idType == '2' || (e.idType == '1' && e.enterpriseType != '1')) && temp;
  }
  
  $scope.addRespondent = function(applicant) {
    applicant.responsibleRate = 0;
    applicant.isVehicle = applicant.plateNo ? "1" : "0";
    applicant.riskTypes = {
      "0": false,
      "1": false,
      "2": false
    };
  };
  
  $scope.deleteRespondent = function(respondent) {
    respondent.responsibleRate = -1;
  }
  
  $scope.riskTypeChanged = function(respondent, riskType) {
    if (riskType == "0") {
      if (!respondent.riskTypes['0'])
        respondent.riskTypes['1'] = respondent.riskTypes['2'] = false;
    } else if (riskType == "1") {
      if (!respondent.riskTypes['1'])
        respondent.riskTypes['2'] = false;
      else
        respondent.riskTypes['0'] = true;
    } else {
      if (respondent.riskTypes['2']) {
        respondent.riskTypes['0'] = respondent.riskTypes['1'] = true;
        respondent.thirdPartyFranchise = 0;
        respondent.thirdPartyRate = 100;
      }
    }
  }
  
  $scope.compensateRateChanged = function(lawCase) {
    if (lawCase.compensateRate > 100) lawCase.compensateRate = 100;
    if (lawCase.compensateRate < 0) lawCase.compensateRate = 0;
  }


    $scope.responsibleRateChanged = function(respondent) {
        if (respondent.responsibleRate > 100) respondent.responsibleRate = 100;
        if (respondent.responsibleRate < 0) respondent.responsibleRate = 0;
    }
    $scope.thirdPartyFranchiseChanged = function(respondent) {
    if (respondent.thirdPartyFranchise > 100) respondent.thirdPartyFranchise = 100;
    if (respondent.thirdPartyFranchise < 0) respondent.thirdPartyFranchise = 0;
    if (respondent.thirdPartyFranchise <= 100 && respondent.thirdPartyFranchise >= 0)
      respondent.thirdPartyRate = 100 - respondent.thirdPartyFranchise;
    $scope.calculate();
  }
  
  $scope.thirdPartyRateChanged = function(respondent) {
    if (respondent.thirdPartyRate > 100) respondent.thirdPartyRate = 100;
    if (respondent.thirdPartyRate < 0) respondent.thirdPartyRate = 0;
    if (respondent.thirdPartyRate <= 100 && respondent.thirdPartyRate >= 0)
      respondent.thirdPartyFranchise = 100 - respondent.thirdPartyRate;
  }
  
  $scope.feeCheckChanged = function(fee, id) {
    if (fee.isChecked) {
      if (!($scope.lawCase.regionName && $scope.lawCase.standardYear)) {
        $rootScope.toaster("error", "错误", "请输入赔偿地和赔偿年度!");
        fee.isChecked = false
        return;
      }
    }
    if (["12", "13", "14", "15", "16"].indexOf(id) != -1 && fee.isChecked) {
      if (!($scope.lawCase.deathDate && $scope.lawCase.compensateRate)) {
        $rootScope.toaster("error", "错误", "请输入定残/死亡日期和赔偿年度!");
        fee.isChecked = false
        return;
      }
      if (id == "12" || id == "13")
        $scope.lawCase.feeDetail.forEach(function(v) {
          if (v.id == "15" || v.id == "16") v.isChecked = false;
        });
      else if (id == "15" || id == "16") {
        $scope.lawCase.feeDetail.forEach(function(v) {
          if (v.id == "12" || v.id == "13") v.isChecked = false;
        });
        $scope.lawCase.compensateRate = 100;
      }
    }
    $scope.refreshTotal();
  };
  
  $scope.refreshTotal = function() {
    $scope.lawCase.applyTotal = 0;
    $scope.lawCase.lawMoney = 0;
    var checkedList = $scope.lawCase.feeDetail.filter(function(v) {
      return v.isChecked;
    });
    checkedList.forEach(function(v) {
      if (v.applyAmount && parseFloat(v.applyAmount)){
        $scope.lawCase.applyTotal += parseFloat(v.applyAmount)
      }
      if (v.claimAmount && parseFloat(v.claimAmount)){
        $scope.lawCase.lawMoney += parseFloat(v.claimAmount)
      }
      if(v.claimNonMed && parseFloat(v.claimNonMed)){//计算非医保金额
        $scope.lawCase.lawMoney += parseFloat(v.claimNonMed);
      }
    });
    
    $scope.lawCase.applyTotal = $scope.lawCase.applyTotal.toFixed(2);

    $scope.lawCase.willPayTotal = $scope.lawCase.lawMoney - $scope.lawCase.paidTotal;

    if($scope.lawCase.extraTotalLawMoney){
      $scope.lawCase.lawMoney = parseFloat($scope.lawCase.lawMoney) + parseFloat($scope.lawCase.extraTotalLawMoney);
    }
    $scope.lawCase.lawMoney = $scope.lawCase.lawMoney.toFixed(2);
    $scope.isJudgeFileExist = undefined;
    $scope.isMediationExist = undefined;
    
    //解决判决书不一致的问题
    $scope.documentLaw.compensateTable = $scope.lawCase.compensateTable;
    $scope.documentLaw.feeDetail = $scope.lawCase.feeDetail;
    $scope.documentLaw.lawMoney = $scope.lawCase.lawMoney;
  };
  
  $scope.initDocument = function(){
    $scope.documentLaw.determineReason = $scope.lawCase.determineReason;
  }
  
  $scope.computeChange = function(fee, isForward) {
    if (isForward) {
      if (fee.applyPerUnit && fee.applyUnit) {
        fee.applyAmount = fee.applyUnit * fee.applyPerUnit;
        if (fee.template == "3")
          fee.applyAmount *= ($scope.lawCase.compensateRate / 100);
        $scope.refreshTotal();
        $scope.calculate();
      }
      if (fee.claimPerUnit && fee.claimUnit) {
        fee.claimAmount = fee.claimUnit * fee.claimPerUnit;
        if (fee.template == "3")
          fee.claimAmount *= ($scope.lawCase.compensateRate / 100);
        $scope.refreshTotal();
        $scope.calculate();
      }
    } else {
      if (fee.applyPerUnit && fee.applyAmount) {
        fee.applyPerUnit = (fee.applyAmount / fee.applyUnit).toFixed(2);
        $scope.refreshTotal();
        $scope.calculate();
      }
      if (fee.claimPerUnit && fee.claimAmount) {
        fee.claimPerUnit = (fee.claimAmount / fee.claimUnit).toFixed(2);
        $scope.refreshTotal();
        $scope.calculate();
      }
    }


    function showOrHideWarning(id, feeAmount) {
      if (fee.id == id && fee.isChecked && feeAmount) {

        if(id == '17'){
          if (fee.claimAmount && fee.claimAmount > feeAmount) {
            fee.isClaimWarningFlag = true;
          } else {
            fee.isClaimWarningFlag = undefined;
          }
        }else{
          if (fee.claimPerUnit > feeAmount) {
            fee.isClaimWarningFlag = true;
          } else {
            fee.isClaimWarningFlag = undefined;
          }
        }
      } else if (fee.id == id && !fee.isChecked) {
        fee.isClaimWarningFlag = undefined;
      }else if(fee.id == id && fee.isChecked && !feeAmount){
        fee.isClaimWarningFlag = undefined;
      }
    }
    showOrHideWarning("06", $scope.lawCase.compensateStandard.hospitalFoodSubsidies);
    showOrHideWarning("07", $scope.lawCase.compensateStandard.thesePayments);
    showOrHideWarning("11", $scope.lawCase.compensateStandard.accommodationFee);
    showOrHideWarning("12", $scope.lawCase.compensateStandard[$scope.lawCase.household].income);
    showOrHideWarning("15", $scope.lawCase.compensateStandard[$scope.lawCase.household].income);
    showOrHideWarning("16", $scope.lawCase.compensateStandard.funeralFeeStandard/12);
    //精神抚慰金超过标准
    showOrHideWarning("17", $scope.lawCase.compensateStandard.spiritualConsolationFee);

  }
  
  $scope.selectApplicantInArray = function(){
    var applicants="";
    if($scope.lawCase.applicantArray){
      $scope.lawCase.applicantArray.filter(function(v){
        return v.personType=='0'
      }).forEach(function(v){
        if(v.idType==0){
          if(!applicants){
            applicants += v.personName
          }else{
            applicants += ","+v.personName
          }
        }else{
          if(!applicants){
            applicants += v.orgName
          }else{
            applicants += ","+v.orgName
          }
        }
      })
    }
    return applicants;
  }
  
  //计算两个日期的年限差
  function getDateYearSub(startDate, endDate) {
    var day = 24 * 60 * 60 *1000;
    //得到前一天(算头不算尾)
    var sDate = new Date(startDate.getTime() - day);
    var eDate = typeof(endDate)==Date?endDate:new Date(Date.parse(endDate.replace(/-/g, "/")));
    
    //获得各自的年、月、日
    var sY  = sDate.getFullYear();
    var eY  = eDate.getFullYear();
    var betweenYear = sY - eY;
    if(betweenYear > 0) {
      return betweenYear
    } else {
      return 0;
    }
  }


  $scope.calculateTime = function(){

    if (!$scope.lawCase.compensateTable) $scope.lawCase.compensateTable = [];
    if ($scope.lawCase.compensateTable.length)
      $scope.lawCase.compensateTable.splice(0, $scope.lawCase.compensateTable.length);
    var medicalLimits = 0;
    var deathLimits = 0;
    var propertyLimits = 0;
    // 一、计算侵权方交强险总保额
    var respondents = $scope.lawCase.applicantArray.filter(function(e) {
      return e.personType == 1 && (e.idType == '0' || e.idType == '2' || (e.idType == '1' && e.enterpriseType != '1')) && e.riskTypes;
    });
    if (!respondents.length) {
      $rootScope.toaster("error", "错误", "请选择责任人!");
      return;
    };
    if(!$scope.lawCase.feeDetail){
      $rootScope.toaster("error", "错误", "请填写具体损失金额!");
      return;
    }
    respondents.forEach(function(v) {
      if (v.isVehicle == "1") {
        if(!v.plateNo){
          $rootScope.toaster("error", "错误", "请填写责任人车牌号!");
          $("#plateNo").focus();
          return;
        }
        if(!v.insuranceForceCompany){
          $rootScope.toaster("error", "错误", "请选择责任人交强险投保保险公司!");
          return;
        }
        if((v.riskTypes['1'] || v.riskTypes['2']) && !v.insuranceBusinessCompany){
          $rootScope.toaster("error", "错误", "请选择责任人商业险投保保险公司!");
          return;
        }
        v.responsibleRate = v.responsibleRate ? parseInt(v.responsibleRate) : 0;
        v.thirdParty = v.thirdParty ? parseInt(v.thirdParty) : 0;
        v.thirdPartyRate = v.thirdPartyRate ? parseInt(v.thirdPartyRate) : 0;
        if (v.responsibleRate == 0) {
          v.medical = 1000;
          v.death = 11000;
          v.property = 100;
        } else {
          v.medical = 10000;
          v.death = 110000;
          v.property = 2000;
        }
        medicalLimits += v.medical;
        deathLimits += v.death;
        propertyLimits += v.property;
      }
    });

    $scope.lawCase.feeDetail.forEach(function(v) {
      if (v.isChecked) {
        if (v.claimAmount){
          v.claimAmount = parseFloat(v.claimAmount);
        }else{
          v.claimAmount = 0;
        }
      }
    });

    //计算器总金额
    var amount = 0.00;
    //计算器医疗费总金额
    var medicalAmount = 0.00;
    //计算器财产损失总金额
    var propertyAmount = 0.00;
    //计算器死亡伤残总金额
    var deathAmount = 0.00;
    //保险公司全部承担的费用(停车费、鉴定费、其它费用)
    var bxSumAmount = 0.00;
    //非保险公司承担的费用(停车费、鉴定费、其它费用)
    var noBxSumAmount = 0.00;
    //计算器精神损害抚慰金金额
    var spiritAmount = 0.00;
    //欠账的精神抚慰金总和
    var leftSpiritAmount = 0.00;

    // 二、计算被侵权方损失金额，按交强险三大类分医疗、死亡伤残、财产。其中余杭法院需要单独计算医疗费中非医保费用
    $scope.lawCase.feeDetail.forEach(function(v) {
      if (v.isChecked) {
        //1、累加总损失 claimAmount 调解总金额，claimNonMed：非医保金额
        if(v.claimAmount) amount += parseFloat(v.claimAmount);
        //2、累加医疗损失   医疗费、后续治疗费、住院伙食补助费、营养费
        if (["03", "04", "06", "07"].indexOf(v.id) != -1) {
          //医保金额
          if(v.claimAmount) medicalAmount += parseFloat(v.claimAmount);
        } else if (["30", "40", "50", "70"].indexOf(v.id) != -1) {
          //3、累加财产损失  财产损失、车辆损失、拖车费、施救费
          if(v.claimAmount) propertyAmount += parseFloat(v.claimAmount);
        } else if(v.id == "18" || v.id == '60' || v.id == '71'){
          // （鉴定费用、停车费、其它费用）表示保险公司全赔总金额
          if(v.claimAmount){
            if(v.selectShow) {
              bxSumAmount +=  parseFloat(v.claimAmount);
            }else{//个人全赔总金额
              noBxSumAmount += parseFloat(v.claimAmount);
            }
          }
        }else if(v.id == '17'){
          //精神抚慰金
          if(v.claimAmount) spiritAmount += parseFloat(v.claimAmount);
        }else {//死亡赔偿金
          if(v.claimAmount) deathAmount += parseFloat(v.claimAmount);
        }
      }
    });
    //保险外金额计算(按申请人计算总和)
    var extraMoneyList = [];
    $scope.lawCase.extraTotalLawMoney = 0.00;
    $scope.lawCase.feeDetail.forEach(function (val){
      if(val.respondentList){
        val.respondentList.forEach(function(k){
          if(k.extraMoney && k.extraMoney > 0){
            $scope.lawCase.extraTotalLawMoney = parseFloat($scope.lawCase.extraTotalLawMoney) + parseFloat(k.extraMoney);
            var obj = _.find(extraMoneyList,{personName: k.personName});
            if(obj){
              obj.extraMoney = parseFloat(obj.extraMoney) + parseFloat(k.extraMoney);
            }else{
              extraMoneyList.push({
                id: k.id,
                extraMoney: parseFloat(k.extraMoney).toFixed(2),
                personName: k.idType=='0'?k.personName:k.orgName,
                personType: k.personType
              });
            }
          }
        });
      }
    });
    //计算器计算规则
    //一、计算交强险
    //交强险赔付总金额
    var compulsoryInsuranceSum = 0.0;
    respondents.forEach(function(v) {
      if ("1" == v.isVehicle) {
        //1、先计算交强险赔付金额，从交强险中优先赔付精神损害抚慰金，如果超出保险公司的死亡伤残上线，商业险不予赔付，由双方按责任比例承担
        //每个人赔付死亡赔偿金的总金额
        v.personPayDeathSum = 0.0;
        v.personPaySpiritSum = 0.0;
        //初始化富于的伤残死亡金
        v.surplusPersonDeathSum = 0.0;
        //首先个人赔付精神抚慰金的金额
        var personPaySpiritAmount = spiritAmount * v.death / deathLimits;
        //个人赔偿精神抚慰金金额大于或者等于死亡伤残上线，按死亡线上赔付
        if(personPaySpiritAmount >= v.death){
          v.personPaySpiritSum += v.death;
          //所有人欠的精神抚慰金总和
          leftSpiritAmount += (personPaySpiritAmount - v.death);
        }else{
          //如果小于死亡赔偿日期，按计算的精神抚慰金金额赔付
          v.personPaySpiritSum += personPaySpiritAmount;
          //富于的个人死亡伤残金
          v.surplusPersonDeathSum = v.death - personPaySpiritAmount;
        }
        //2、如果仍然有剩余的个人死亡伤残金额，则继续赔付死亡伤残其它项目
        if(v.surplusPersonDeathSum && v.surplusPersonDeathSum > 0){
          //如果计算死亡伤残金额大于富于的死亡伤残金额，按剩下的来
          if(deathAmount * v.death / deathLimits >= v.surplusPersonDeathSum){
            v.personPayDeathSum += v.surplusPersonDeathSum;
          }else{
            v.personPayDeathSum += deathAmount * v.death / deathLimits;
          }
        }
        //3、赔付医疗费
        var personPayMedicalAmount = medicalAmount * v.medical / medicalLimits;
        //个人赔付医疗费大于个人赔付上线
        if(personPayMedicalAmount > v.medical){
          //个人付款医疗费金额
          v.personPayMedicalSum = v.medical;
          //个人欠医疗费金额
          v.leftPersonMedicalSum = personPayMedicalAmount - v.medical;
        }else{
          v.personPayMedicalSum = personPayMedicalAmount;
        }
        //4、赔付财产损失
        var personPayPropertyAmount = propertyAmount * v.property / propertyLimits;
        //个人赔付财产损失大于个人赔付上线
        if(personPayPropertyAmount > v.property){
          //个人付款财产损失费金额
          v.personPayPropertySum = v.property;
          //个人欠财产损失费金额
          v.leftPersonPropertySum = personPayPropertyAmount - v.property;
        }else{
          v.personPayPropertySum = personPayPropertyAmount;
        }
        //5、保存数据 1.交强 2.商业 3.自付
        $scope.lawCase.compensateTable.push({
          payType: "1",
          calcFormula: "",
          calcIndemnitySum: (v.personPayDeathSum + v.personPayMedicalSum + v.personPayPropertySum + v.personPaySpiritSum) .toFixed(2),
          companyName: v.insuranceForceCompany,
          plateNo: v.plateNo,
          idType: v.idType
        });
        //累加被告支付交强险计算总金额
        compulsoryInsuranceSum +=  v.personPayDeathSum + v.personPayMedicalSum +v.personPayPropertySum;
      }else{
        leftSpiritAmount = spiritAmount;
      }
    });

    //二、计算商业险
    //医疗费+死亡伤残+财产损失 - 总共支付交强险的费用= 剩余的资金由商业险按责任比例承担
    var leftPartSum = parseFloat(medicalAmount) + parseFloat(propertyAmount) + parseFloat(deathAmount) - parseFloat(compulsoryInsuranceSum);
    //保险公司支付商业险和被告支付的总金额
    var commercialInsuranceAndDefendantSum = 0.00;
    //剩余的交强险金额 +  剩余的精神抚慰金 + 保险公司全部承担的费用(停车费、鉴定费、其它费用)
    var noPaySum = leftPartSum  + leftSpiritAmount + bxSumAmount + noBxSumAmount;
    if(noPaySum > 0){
      //循环侵权人，计算每个侵权人商业险应该赔付的费用
      respondents.forEach(function(v) {
        //个人商业险赔付金额
        v.personBusinessIndemnitySum = 0.00;
        //剩余的保险公司赔付不了的金额 默认时所有
        v.leftCarAndAppraiseAndOtherSum = bxSumAmount;
        //表示为机动车并且有商业险
        if ("1" == v.isVehicle && v.riskTypes['1']) {
          //如果交强险赔付完仍需要交强险进行赔付 或者保险公司有赔付（停车、鉴定、其它费用）
          if(leftPartSum > 0 || bxSumAmount > 0){
            if(leftPartSum > 0){
              //如果被告的三者险金额 > 除交强险以外剩余应该赔付的金额 *  责任比例 *  三者险赔偿比例，则取后面的值
                //绝对免赔率
                v.absDeductibleRate = 100;
                if(v.absDeductible){
                    v.absDeductibleRate = 100 - v.absDeductible;
                }
              if (v.thirdParty > leftPartSum * v.responsibleRate / 100 * v.thirdPartyRate / 100 * v.absDeductibleRate/100) {
                v.personBusinessIndemnitySum = leftPartSum * v.responsibleRate / 100 * v.thirdPartyRate / 100 * v.absDeductibleRate/100;
              } else {
                //直接取三者险的金额
                v.personBusinessIndemnitySum = v.thirdParty;
              }
            }
            //保险公司应该赔付停车费、鉴定费以及其它费用的金额
            v.carAndAppraiseAndOtherSum = 0;
            //保险公司全部赔付
            if(bxSumAmount > 0){
              //剩余三者险金额
              var leftPersonBusinessIndemnitySum = v.thirdParty - v.personBusinessIndemnitySum;
              //如果剩余三者险金额大于0，并且保险公司有全部承担停车费 + 鉴定费 + 其它费用 > 0,由保险公司全部承担其费用
              if(leftPersonBusinessIndemnitySum > 0 && bxSumAmount > 0){
                //再进行判断，当保险公司承担的费用小于剩余的商业险的费用时，则取保险公司承担总费用
                if( bxSumAmount < leftPersonBusinessIndemnitySum ){
                  v.carAndAppraiseAndOtherSum = bxSumAmount;
                  v.leftCarAndAppraiseAndOtherSum = 0.00;
                }else{
                  //反之则取剩余的商业险的费用
                  v.carAndAppraiseAndOtherSum = leftPersonBusinessIndemnitySum;
                  v.leftCarAndAppraiseAndOtherSum = bxSumAmount - leftPersonBusinessIndemnitySum;
                }
              }
            }

            //保存商业险赔付金额 赔偿方式 1.交强 2.商业 3.自付
            $scope.lawCase.compensateTable.push({
              payType: "2",
              calcFormula: "",
              calcIndemnitySum: (v.personBusinessIndemnitySum + parseFloat(v.carAndAppraiseAndOtherSum)).toFixed(2),
              companyName: v.insuranceBusinessCompany,
              plateNo: v.plateNo,
              idType: v.idType
            });
            //保险公司支付商业险总金额
            commercialInsuranceAndDefendantSum += v.personBusinessIndemnitySum + v.carAndAppraiseAndOtherSum;
          }
        }
        //责任比例内保险未赔完，由被告自行承担(个人按责任比例赔付、剩余的精神费用，剩余的保险公司赔付的金额)
        v.personPayAmount = (leftPartSum  + noBxSumAmount + leftSpiritAmount + v.leftCarAndAppraiseAndOtherSum)  * v.responsibleRate / 100 - v.personBusinessIndemnitySum;
        //保存被告自负担金额
        //被申请人自负保险范围外金额
        var claimantExtraMoneyObject = _.find(extraMoneyList,{personName: v.personName});
        var claimantExtraMoney = 0;
        if(claimantExtraMoneyObject){
          claimantExtraMoney = parseFloat(claimantExtraMoneyObject.extraMoney);
        }
        if ((v.personPayAmount + claimantExtraMoney) > 0) {
          $scope.lawCase.compensateTable.push({
            payType: "3",
            calcFormula: "",
            calcIndemnitySum: (v.personPayAmount + claimantExtraMoney).toFixed(2),
            personName: v.idType=='0'?v.personName:v.orgName,
            personType: v.personType,
            idType: v.idType
          });
          //被告支付的总金额
          commercialInsuranceAndDefendantSum += v.personPayAmount;
        }
      });
    }else{//保险外金额被告赔付
      respondents.forEach(function(v) {
        //被申请人自负保险范围外金额
        var claimantExtraMoneyObject = _.find(extraMoneyList,{personName: v.personName});
        var claimantExtraMoney = 0;
        if(claimantExtraMoneyObject){
          claimantExtraMoney = claimantExtraMoneyObject.extraMoney;
        }
        if (claimantExtraMoney > 0) {
          $scope.lawCase.compensateTable.push({
            payType: "3",
            calcFormula: "",
            calcIndemnitySum: parseFloat(claimantExtraMoney).toFixed(2),
            personName: v.idType=='0'?v.personName:v.orgName,
            personType: v.personType,
            idType: v.idType
          });
        }
      });
    }

    //循环保险外支付的金额
    var applicantExtraSumMoney = 0;//取得申请人金额总和
    //调解时计算，诉讼时不计算
    if(extraMoneyList != null){
      extraMoneyList.forEach(function(val){
        if(val.personType == '0'){
          applicantExtraSumMoney += parseFloat(val.extraMoney);
        }
      });
    }


    //原告自行承担金额
    var plaintiffPayMoney = leftPartSum  + leftSpiritAmount + noBxSumAmount + bxSumAmount - commercialInsuranceAndDefendantSum + applicantExtraSumMoney;
    if (plaintiffPayMoney > 0) {
      var applicants = $scope.selectApplicantInArray();
      //被侵权方信息
      $scope.lawCase.compensateTable.push({
        payType: "3",
        calcFormula: "自已承担：" + plaintiffPayMoney,
        calcIndemnitySum: plaintiffPayMoney.toFixed(2),
        personName: applicants,
        personType: 0
      });
    }

    $scope.refreshTotal();
  };

  //设置一秒钟延时
  $scope.calculate = function() {
    var calculateTimeout;
    if(calculateTimeout){
      $timeout.cancel(calculateTimeout);
    }
    $timeout(function () {
      $scope.calculateTime();
    }, 1000);
  };

  
  //计算总合计
  $scope.calcTotal = function(compensateTable, type){
    var total = 0.00;
    if(compensateTable){
      compensateTable.filter(function(v){
        return v.payType==type;
      }).forEach(function(v){
        total += parseFloat(v.calcIndemnitySum);
      })
    }
    return total.toFixed(2)
  }
  
  $scope.lawCase.paidTotal = 0
  $scope.paidTotalChange = function() {
    $scope.lawCase.willPayTotal = $scope.lawCase.lawMoney - $scope.lawCase.paidTotal;
  }
  
  $scope.addDependent = function(val) {
    var dependents = _.find($scope.lawCase.feeDetail, {
      id: "14"
    }).dependents
    if (val == 'claim') {
      if (dependents.claim.length == 0 && dependents.apply.length != 0) {
        dependents.claim = angular.copy(dependents.apply);
      }
    }
    var modalInstance = $modal.open({
      templateUrl: 'views/pages/mediation_platform/litigation_mediation/adjust_information_popup.html',
      controller: 'AdjustInformationPopupCtrl',
      size: 'lg',
      resolve: {
        items: function() {
          var depent = _.find($scope.lawCase.feeDetail, {
            id: "14"
          }).dependents;
          return {
            dependents: depent[val],
            deathDate: $scope.lawCase.deathDate,
            compensateRate: $scope.lawCase.compensateRate,
            household: $scope.lawCase.household,
            refData: $scope.lawCase.compensateStandard
          }
        }
      }
    });
    //返回值
    modalInstance.result.then(function(data) {
      var target = _.find($scope.lawCase.feeDetail, {
        id: "14" // fuyangren
      });
      if (val == 'apply') {
        target.applyAmount = data;
        if (!target.claimAmount)
          target.claimAmount = data;
      } else {
        target.claimAmount = data;
      }
      $scope.refreshTotal();
    }, null);
  };
  
  $scope.adjustDateOpened = false;
  $scope.payDateOpened = false;
  $scope.openAdjustDate = function($event, index) {
    $event.preventDefault();
    $event.stopPropagation();
    $scope.adjustDateOpened = true;
  };
  //休庭设置
  $scope.openAdjourn = function (size) {
    var modalInstance = $modal.open({
      templateUrl: 'views/pages/lawsuit/adjourn.html',
      controller: 'ModalAdjournCtrl',
      size: size,
      resolve: {
        items: function () {
          return {
            nextCourtDate:$scope.lawCase.nextCourtDate
          }
        }
      }
    });
    modalInstance.result.then(function (selectedItem) {
      $scope.lawCase.nextCourtDate = selectedItem;
      $scope.save();
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };
  //选择依据
  $scope.openCriteria = function (lg, fee, hide) {
    var modalInstance = $modal.open({
      templateUrl: 'views/pages/lawsuit/criteria.html',
      controller: 'ModalLawItemsCtrl',
      size: lg,
      resolve: {
        items: function () {
          return {
                    selectedItemArray:fee.selectedItemArray==undefined?angular.copy(DictionaryConfig.lawItemArray.filter(function(v){return v.feeType == fee.id})):fee.selectedItemArray,
                    isShow:hide
               }
        }
      }
    });
    modalInstance.result.then(function (selectedItem) {
      fee.selectedItemArray = selectedItem;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };

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



  //保险外金额
  $scope.handleExtraAmount = function(fee){
    var handleExtraAmountModel = $modal.open({
      templateUrl: 'views/pages/mediation_platform/litigation_mediation/extraAmount.html',
      controller: 'ExtraAmountCtrl',
      backdrop:'static',
      size: 'md',
      resolve: {
        items: function() {
          return {
            fee: fee,
            adjust: $scope.lawCase
          }
        }
      }
    });

    handleExtraAmountModel.result.then(function(){
      $scope.refreshTotal();
      $scope.calculate();
    })
  };

  //添加护理费、误工费、处理人误工费
  $scope.addNursingFee = function(val,fee){
    var addNursingFeeModel =  $modal.open({
      templateUrl: 'views/pages/mediation_platform/litigation_mediation/nursingFee_popup.html',
      controller: 'NursingFeePopupCtrl',
      backdrop:'static',
      size: 'lg',
      resolve: {
        items: function() {
          return {
            fee: fee,
            val:val,
            adjust: $scope.lawCase
          }
        }
      }
    });

    addNursingFeeModel.result.then(function(){
      if(fee.claimAmount > 0){
        $scope.refreshTotal();
        $scope.calculate();
      }
    })
  };

  //选择依据
  $scope.openCriteria = function (lg, fee, hide) {
    var modalInstance = $modal.open({
      templateUrl: 'views/pages/lawsuit/criteria.html',
      controller: 'ModalLawItemsCtrl',
      size: lg,
      resolve: {
        items: function () {
          return {
            selectedItemArray:fee.selectedItemArray==undefined?angular.copy(DictionaryConfig.lawItemArray.filter(function(v){return v.feeType == fee.id})):fee.selectedItemArray,
            isShow:hide
          }

        }
      }
    });
    modalInstance.result.then(function (selectedItem) {
      fee.selectedItemArray = selectedItem;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };

  //处理已付金额
  $scope.queryPayMoney = function(){

    var payMoney = $modal.open({
      templateUrl: 'views/pages/mediation_platform/litigation_mediation/payMoney.html',
      controller: 'PayMoneyCtrl',
      size: 'md',
      resolve: {
        items: function() {
          return {
            adjust: $scope.lawCase
          }
        }
      }
    });
  };

  //鉴定伤残等级
  $scope.showRankAppraisal = function () {
      //判断当前所属的状态（调解、起诉）
      if($location.url().split('/').indexOf('mediation') !== -1) {
        //调解
        $scope.isMediation = 0;
      } else {
        //起诉、庭前调解时
        $scope.isMediation = 1;
      }
      if($scope.adjust || $scope.law) {
          var id = $scope.adjust? $scope.adjust.id: $scope.law.id;
          var serialNo = $scope.adjust? $scope.adjust.serialNo: $scope.law.serialNo;
          //打开等级鉴定页面，并将单子id与流水号通过url传入
          var url = $state.href('rankAppraisal');
          window.open(url+'?id='+id+'&serialNo='+serialNo+'&flag='+$scope.isMediation, '_blank');
      } else {
          //赔偿试算，不存在案件流水号
          var url = $state.href('rankAppraisal');
          window.open(url, '_blank');
      }
  };

  ///////////////////////////////交通事故信息///////////////////////////////
  PoliceFun = function () {
    this.accidentNumber = '';
    this.accidentRegion = '';
    this.highSpeed = '';
    this.idNo = '';
    this.serialNo = '110101201800912';
    this.caseType = '1';
    this.accidentNumberError = '';
    this.accidentNumberError = '';
    this.highSpeedError = '';
  };
  $scope.police = new PoliceFun();

  //是否高速
  $scope.highSpeedList = PoliceConfig.highSpeedList;

  //显示事故责任认定书信息按钮
  $scope.isCheckPoliceDetail = true;

  //查看事故信息 - 通过事故编号
  $scope.checkPoliceBow = false;
  $scope.getPoliceBow = false;

  //显示弹出框
  $scope.showCheckPoliceDetail = function () {
    $scope.checkPoliceBow = true;
  };
  $scope.showGetPoliceBow = function () {
    $scope.getPoliceBow = true;
  };
  
  //查询交警案件信息
  $scope.checkPoliceDetail = function () {
    if(validatePolice(true)) {
      //格式化证书编号中的字符[]【】，()（）
      $scope.police.accidentNumber = $scope.police.accidentNumber.split('');
      if($scope.police.accidentNumber.indexOf('【') != -1) {
        $scope.police.accidentNumber.splice($scope.police.accidentNumber.indexOf('【'), 1, '[');
      }
      if($scope.police.accidentNumber.indexOf('】') != -1) {
        $scope.police.accidentNumber.splice($scope.police.accidentNumber.indexOf('】'), 1, ']');
      }
      $scope.police.accidentNumber = $scope.police.accidentNumber.join('');

      AdjustService.selectPoliceAccidentInfo({"accidentNumber": $scope.police.accidentNumber}).success(function (res) {
        if(res.code == AdjustConfig.commonConStant.SUCCESS) {
          if(!res.result) { //未查到案件
            $rootScope.toaster("warn", "提示", "该案件未曾调取过公安信息或无相关事故信息");
          } else { //查到案件，跳转页面
            var url = $state.href("policeLawCaseDetail",{"police":JSON.stringify($scope.police),"isShowBtn": ""});
            window.open(url,'_blank');
          }
        } else {
          $rootScope.toaster("error", "错误", res.message);
        }
        console.log(res)
      })
    }
  };

  //选择当事人
  $scope.selectApplicant = function (applicant) {
    $scope.police.idNo = applicant.idNo;
  };

  //调取交警事故信息 - 通过编号 身份证 地点 是否高速
  $scope.getPoliceDetail = function () {
    if(validatePolice()) {
      //格式化证书编号中的字符[]【】，()（）
      $scope.police.accidentNumber = $scope.police.accidentNumber.split('');
      if($scope.police.accidentNumber.indexOf('【') != -1) {
        $scope.police.accidentNumber.splice($scope.police.accidentNumber.indexOf('【'), 1, '[');
      }
      if($scope.police.accidentNumber.indexOf('】') != -1) {
        $scope.police.accidentNumber.splice($scope.police.accidentNumber.indexOf('】'), 1, ']');
      }
      $scope.police.accidentNumber = $scope.police.accidentNumber.join('');
      //跳转到案件信息页面
      console.log($scope.police)
      var url = $state.href("policeLawCaseDetail",{"police":JSON.stringify($scope.police)});
      window.open(url,'_blank');
    }
  };

  //关闭弹框
  $scope.policeBowClose = function () {
    $scope.checkPoliceBow = false;
    $scope.getPoliceBow = false;
    //重置对象
    $scope.police = new PoliceFun();
  };

  //验证交警信息
  function validatePolice(isCheck) {
    var v = $scope.police;
    if(!v.accidentNumber) {
      v.accidentNumberError = true;
      $rootScope.toaster('error','错误','请输入事故责任认定书编号');
      return false;
    } else v.accidentNumberError = undefined;
    if(!isCheck) {
      if(!v.accidentRegion) {
        v.accidentRegionError = true;
        $rootScope.toaster("error", "错误", "请选择事故地点！");
        return false;
      } else v.accidentRegionError = undefined;
      if(!v.highSpeed) {
        v.highSpeedError = true;
        $rootScope.toaster("error", "错误", "请选择是否高速！");
        return false;
      } else v.highSpeedError = undefined;
      if(!v.idNo) {
        $rootScope.toaster("error", "错误", "请选择责任人！");
        return false;
      }
    }
    return true;
  }

  /////////////////////////事故地点树状数据///////////////////////////
  //填充区域信息
  $scope.cityRegion = $filter('filterRegions')(AdminConstant.administrationRegions);
  //赔偿地树的定义
  $scope.treeConfig = {
    core: {
      multiple: false,
      animation: true,
      error: function(error) {
        $log.error('treeCtrl: error from js tree - ' + angular.toJson(error));
      },
      check_callback: true,
      worker: true
    },
    types: {
      "default": {
        icon: 'iconfont icon-dizhi'
      },
      folder: {
        icon: 'iconfont icon-wenjian1'
      }
    },
    version: 1,
    plugins: ['types']
  };
  //默认树为收起状态
  $scope.isShowTree = false;
  //控制树阻止冒泡
  $scope.cityNameClick = function (e) {
    angular.element("#cityNamebox").show();
    stopBubble(e);
  }
  $scope.cityNameboxClick = function (e) {
    stopBubble(e);
  }

  angular.element("body").click(function(){
    angular.element("#cityNamebox").hide();
  });
  function stopBubble(e) {
    // 如果提供了事件对象，则这是一个非IE浏览器
    if ( e && e.stopPropagation ) {
      // 因此它支持W3C的stopPropagation()方法
      e.stopPropagation();
    } else {
      // 否则，我们需要使用IE的方式来取消事件冒泡
      window.event.cancelBubble = true;
    }
  };
  //选择赔偿地树节点信息
  $scope.selectAdmin = function(node, selected, event) {
    var selectedNodes = selected.selected;
    if (selectedNodes.length > 0 && selected.node.original.level =='3') {
      var selectedRegion = $scope.cityRegion[selectedNodes[0]];
      if ($scope.police.cityName != selectedRegion.fullName) {
        $scope.police.accidentRegion = selectedRegion.fullName;
        $scope.police.cityCode = selectedRegion.regionCode;
        angular.element("#cityNamebox").hide();
        $scope.isShowTree = false;
      }
    }
  };
});

//原生js调用angular中的scope参数  （伤残等级鉴定页面调用）
function saveRankAppraisal(count){
    //通过元素id来获取Angular应用
    var appElement = document.getElementById('OnlineSessionCtrl');
    //获取$scope变量
    var $scope = angular.element(appElement).scope();
    //调用$scope中的方法与赋值
    $scope.lawCase.compensateRate = count;
    //上一行改变了msg的值，如果想同步到Angular控制器中，则需要调用$apply()方法即可
    $scope.$apply();
}


app.controller('AdjustInformationPopupCtrl', function($scope, DictionaryConfig, $state, $modal, items, $modalInstance) {
  $scope.dependents = items.dependents;
  $scope.deathDate = items.deathDate;
  $scope.household = items.household;
  $scope.compensateStandard = items.refData;
  $scope.compensateRate = items.compensateRate;
  
  $scope.openBirthDate = function($event, dependent) {
    $event.preventDefault();
    $event.stopPropagation();
    dependent.birthDateOpened = true;
  };
  $scope.accountTypeList = DictionaryConfig.accountTypeList;
  
  $scope.add = function() {
    var dependent = {
      id: new Date().getTime(),
      birthDateOpened: false,
      household: "1"
    }
    $scope.dependents.push(dependent);
  }
  
  $scope.deleteDependent = function(index) {
    $scope.dependents.splice(index, 1);
  };
  
  $scope.computeFyAge = function(dependent) {
    dependent.age = Math.floor(($scope.deathDate.getTime() - dependent.birthDate.getTime()) / (24 * 365 * 3600000));
    if (dependent.age <= 18)
      dependent.fyAge = 18 - dependent.age;
    else if (dependent.age > 18 && dependent.age <= 60)
      dependent.fyAge = 20;
    else if (dependent.age > 60 && dependent.age < 75)
      dependent.fyAge = 80 - dependent.age;
    else if (dependent.age >= 75)
      dependent.fyAge = 5;
  }
  
  //点击确认
  $scope.ok = function() {
    var dependentStandard = $scope.compensateStandard[$scope.household].expense;
    $scope.dependents.forEach(function(v) {
      v.expense = $scope.compensateStandard[v.household].expense
    });
    $scope.dependents.sort(function(a, b) {
      return a.fyAge - b.fyAge;
    });
    
    var countFee = 0;
    $scope.dependents.forEach(function(v, i, arr) {
      var tmpFee = 0;
      var preYear = 0;
      var year = v.fyAge;
      for (var j = i; j < arr.length; j++) {
        tmpFee += (arr[j].expense * $scope.compensateRate / 100 / arr[j].count);
      }
      if (i != 0) {
        preYear = arr[i - 1].fyAge;
      }
      if (tmpFee > dependentStandard)
        tmpFee = dependentStandard;
      countFee += (tmpFee * (year - preYear));
    });
    
    $modalInstance.close(countFee.toFixed(2));
  };
  //点击取消
  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
})

//选择依据
angular.module('sbAdminApp').controller('ModalLawItemsCtrl', function ($scope, $modalInstance, DictionaryConfig, items) {
  //法律条文
  $scope.isShow = items.isShow;
  $scope.lawItemArray = items.selectedItemArray;
  
  $scope.selectLawItem = function($event, v){
    if($event.target.checked) v.selected = true;
    else v.selected = false;
  }
  
  $scope.ok = function () {
    $modalInstance.close($scope.lawItemArray);
  };
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});

//休庭
angular.module('sbAdminApp').controller('ModalAdjournCtrl', function ($scope, $modalInstance, items) {
  $scope.nextCourtDate = items.nextCourtDate;
  
  $scope.openNextCourtDate = function(e) {
    e.preventDefault();
    e.stopPropagation();
    $scope.nextCourtDateOpened = true;
  };
  
  $scope.ok = function () {
    $modalInstance.close($scope.nextCourtDate);
  };
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});
