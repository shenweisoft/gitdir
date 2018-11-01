/**
 * Created by Administrator on 2017/3/22 0022.
 */
angular.module('sbAdminApp').controller('JusticeConfirmCtrl', function($scope, $log,DictionaryConfig,$state,$stateParams,LoginService,AdjustService, LawService, LawConfig,toaster,Upload,InterfaceService,$rootScope) {

    $scope.lawService = LawService;
    $scope.interfaceService  = InterfaceService;

    var level = DictionaryConfig.toaster.level;
    var title = DictionaryConfig.toaster.title;

    //意见常量
    $scope.ISAGREE ={
        "agreeApproval":"准予申请",
        "againstApproval":"驳回申请",
        "evidence":"补充证据"
    };
    //验证常量
    $scope.VALIDATE_CONSTANT = {
        "type_error_message":"请您选择审批类型",
        "opinion_error_message":"请您输入审批意见"
    };
    //详细查询Service
    $scope.queryLawDetailService = LawService.queryLawDetail;
    //司法确认结案
    $scope.closedAdjustInfoService = LawService.closedAdjustInfo;
    //流程表插入
    $scope.insertJyWorkFlowService = AdjustService.insertJyWorkFlow;
    //发送短信
    $scope.sendMessageLaw =  LawService.sendMessage;
    //发送邮件
    $scope.sendEmailService = LawService.sendEmail;
    //service常量
    $scope.commonConstant = LawConfig.commonConstant;
    //查询主表信息
    $scope.queryLawDetailList = function(){
        //查询数据
        $scope.queryLawDetailService({
            "serialNo": $stateParams.serialNo
        }).success(function (result) {
            if (result.code == LawConfig.commonConstant.SUCCESS) {
                $scope.law = result.result;
                $scope.codeFileName = result.result.codeFileName?LawConfig.lawConstant.lawCodeFileUrl + result.result.codeFileName:'views/images/1(2).png';

                $scope.checkFileExist();
            }else{
              $rootScope.toaster("error", "错误", result.message);
            }
        });
    };

    $scope.getCurrentOrg = function () {
        //根据组织机构获取人员列表
        $scope.$on('user2Child', function(){
            initOrg();
        });
        if (LoginService.user.userPermissions) {
            initOrg();
        }
    };
    //查询数据
    function initOrg(){
        $scope.userDepart = LoginService.user.sysUser.userDepartList[LoginService.user.sysUser.currentOrg];
        $scope.sysUser = LoginService.user.sysUser;
        //查询详细数据
        $scope.queryLawDetailList();
    }
    //初始化组织以及主表数据
    $scope.getCurrentOrg();

    //定义流程主表信息
    var WorkFlow = function() {
        this.type = "";
        this.serialNo = $stateParams.serialNo;
        this.operatorId = $scope.sysUser.id;
        this.operatorName = $scope.sysUser.text;
        this.orgName = $scope.userDepart.orgName;
        this.remark = $scope.remark;
        this.tempData = "";
        this.type = DictionaryConfig.lawType.caseComplete;
        this.result = $scope.isAgree == '2'? '4':$scope.isAgree;
        if($scope.isAgree == '0'){
            this.resultName = $scope.ISAGREE.agreeApproval;
        }else if($scope.isAgree == '1'){
            this.resultName = $scope.ISAGREE.againstApproval;
        }else if($scope.isAgree == '2'){
            this.resultName = $scope.ISAGREE.evidence;
        }
    };

    $scope.isAgree = ''; //默认选中准予申请

    //封装流程信息
    $scope.packageWorkFlowData = function(){
        //主表
        $scope.workFlow = new WorkFlow();
        //业务表
        var tempData = new DictionaryConfig.workFlowData();
        //法院部门名称
        tempData.lawDeptName = $scope.userDepart.deptName;
        //封装子信息
        $scope.workFlow.tempData = JSON.stringify(tempData);
    };
    //插入流程表
    $scope.insertWorkFlow = function(){
        //封装流程表
        $scope.packageWorkFlowData();
        //插入流程表信息
        $scope.insertJyWorkFlowService($scope.workFlow).success(function(result) {
            if (result.code == LawConfig.commonConstant.SUCCESS) {
                var sendInfo = angular.toJson({type:$scope.flowState,result:$scope.isAgree,zzrCbr:$scope.law.zzrCbr,operateType:$scope.law.operateType});
                $state.go("dashboard.pending_complete",{pageInfo:sendInfo});
            } else {
                $rootScope.toaster("error", "错误", result.message);
            }
        })
    };
    //验证表单
    function validateForm(){
        if(!$scope.isAgree){
            $rootScope.toaster("error", "错误", $scope.VALIDATE_CONSTANT.type_error_message);
            return false;
        }else{
            if($scope.isAgree != '0' && !$scope.remark){
                $rootScope.toaster("error", "错误", $scope.VALIDATE_CONSTANT.opinion_error_message);
                $("[name='remark']").focus();
                return false;
            }
        }
        return true;
    }
    //提交数据
    $scope.submit = function(){
      //表单验证
      if (validateForm()) {
        if(confirm("确认要结案吗？")) {
          //当前状态
          $scope.flowState = $scope.law.state;
          //补充证据不结案
          if ($scope.isAgree == '2') {
            //插入流程表
            $scope.insertWorkFlow();
          } else {
            //更新结案状态
            if($scope.isAgree == '0'){
              $scope.law.state = DictionaryConfig.lawState.finishState;
            }else if($scope.isAgree == '1'){
              $scope.law.state = DictionaryConfig.lawState.reverseFinishState;
            }
            //更新
            $scope.closedAdjustInfoService({
              "serialNo": $stateParams.serialNo,
              "ahdm": $scope.law.ahdm,
              "zzrCbr": $scope.law.zzrCbr,
              "state":$scope.law.state
            }).success(function (result) {
              if (result.code == LawConfig.commonConstant.SUCCESS) {
                //先发短信再插流程表
                send();
              } else {
                $rootScope.toaster("error", "错误", result.message);
              }
            })
          }
        }
      }
    };
    
    //发送短信
    function send() {

        //adjustResult:4:表示为调解办案
        $scope.sendMessageLaw({
            "type":$scope.isAgree == 0 ? 10 :11, //同意10.不同意11
            "serialNo":$stateParams.serialNo,
            "adjustResult":$scope.law.adjustResult
        }).success(function(result){
            if(result.code ==  $scope.commonConstant.SUCCESS ){
                //准予申请时发送邮件
                // if($scope.isAgree == 0){
                //     sendEmail();
                // }
                //插入流程表
                $scope.insertWorkFlow();
            }else{
                $scope.law.state = $scope.state;
                $rootScope.toaster("error", "错误", result.message);
            }
        })
    }
    //发送邮件
    function sendEmail() {
        var emailType = '0';//司法确认邮件
        if($scope.law.adjustResult == '4'){
          emailType = '7';//调解立案邮件
        }

        $scope.sendEmailService({
            "emailType":emailType,
            "serialNo":$stateParams.serialNo
        }).success(function(result){
            if(result.code !=  LawConfig.commonConstant.SUCCESS ){
                $rootScope.toaster("error", "错误", result.message);
            }
        })
    }

  //上传确认文书
  $scope.uploadComfirmFile = function(file){
    if(!file) return;
    if (file && file) {
      var fileName = file.name.substring(0,file.name.lastIndexOf('.'));
      if($scope.law.adjustResult == '0'){
        $scope.uploadFile(fileName, file, '1', '司法确认裁定书');
      }else if($scope.law.adjustResult == '4'){
        $scope.uploadFile(fileName, file, '18', '民事调解书');
      }
    }
  };
  
  $scope.isFileExist = false;
  $scope.checkFileExist = function(){
    var wordType =  DictionaryConfig.docList[1].id;
    if($scope.law.adjustResult == '4'){
      wordType = "18";
    }
    LawService.isFilePageExist({
      wordType: wordType,
      serialNo:$stateParams.serialNo
    }).success(function(res) {
      if(res.code == -1){
        $scope.isFileExist = false;
      }else{
        $scope.isFileExist = true;
      }
    })
  }
  // $scope.checkFileExist();

  //下载文书
  $scope.downloadFile = function(wordType){
    wordType =  DictionaryConfig.docList[1].id;
    if($scope.law.adjustResult == '4'){
      wordType = "18";
    }
    return LawConfig.fileConstant.downloadInstrumentByWorkNoUrl + "?serialNo="+$stateParams.serialNo + "&wordType="+wordType;
  };

  //自动生成司法确认文书
  $scope.autoGenerateDoc = function(){

    if($scope.law.adjustResult == '0'){
      LawService.autoGenerateDoc({
        "serialNo":$stateParams.serialNo
      }).success(function(result){
        $scope.isFileExist = true;
      })
    }else if($scope.law.adjustResult == '4'){
        if($scope.law){
            $scope.moneyFeeList = DictionaryConfig.moneyFeeList;
            var currentMoney = $scope.law.lawMoney;
            var moneyFee = $scope.moneyFeeList.filter(function(v) {
                return currentMoney >= v.startMoney*10000 && currentMoney < v.endMoney*10000;
            });
            $scope.acceptanceFee =$scope.law.lawMoney * moneyFee[0].feeMoney + moneyFee[0].plusMoney;
            //简易程序除以2
            $scope.acceptanceFee = $scope.acceptanceFee/2;
            $scope.acceptanceFee =  parseFloat($scope.acceptanceFee).toFixed(2);
        }
      LawService.buildCivilMediationDoc({
        "serialNo":$stateParams.serialNo,
        "moneyFee":$scope.acceptanceFee
      }).success(function(result){
        $scope.isFileExist = true;
      })
    }
  }

  //上传文件
  $scope.uploadFile = function(fileName,file, wordType, name){
    Upload.upload({
      url: LawConfig.fileConstant.uploadUrlByWordType,
      data: {
        file: file,
        type:DictionaryConfig.lawType.confirmInfo,
        name:name,
        wordType: wordType,
        serialNo:$stateParams.serialNo
      }
    }).success(function(res){
      if(res.code ==  $scope.commonConstant.SUCCESS ){
        $rootScope.toaster(DictionaryConfig.toaster.level.success, DictionaryConfig.toaster.title.success, "文件上传成功!");
        $scope.isFileExist = true;
      }
    })
  }

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

  //签字页
  $scope.judiciarySignPage = function () {
      var url = $state.href('judiciarySign',{serialNo:$stateParams.serialNo});
      window.open(url)
  }


  //判断此案件是否要推送到审判系统
  $scope.isApprovalCase = function(){
    $scope.lawService.queryIsApprovalCase({
      serialNo : $stateParams.serialNo,
      operateType : "0" // 0 调解
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
    $scope.law.adjustResult == '4'?writType = 18: writType = 1;
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
              $rootScope.toaster(level.error, title.error, "推送失败，请稍后再试!");
            }
          })
        }
      } else {
        $rootScope.toaster(level.error, title.error, res.message);
      }
    });
  }
});