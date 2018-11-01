var app = angular.module('sbAdminApp');
app.filter('stateChangeText', function() {
  return function(id,data) {
    var result = _.find(data, {
      id: id
    });
    return result? result.value:""
  }
});
angular.module('sbAdminApp').controller('sueInputCtrl', function($interval,$scope, $log, LoginConfig, LoginService,DictionaryConfig, $state,$stateParams, LawService, AdjustService, AdjustConfig,$modal,toaster,$rootScope) {
  //提取案件Service
  $scope.getAdjustForSueService = AdjustService.getAdjustForSue;
  //绑定案件
  $scope.bindCaseForUserService = AdjustService.bindCaseForUser;
  //获取短信验证码
  // $scope.getMobileCodeService = LoginService.getMobileCode;
  //发送短信
  $scope.sendMessageService =  AdjustService.sendMessage;
  //发送短信
  $scope.sendMessageLaw =  LawService.sendMessage;
  //状态
  $scope.lawState = DictionaryConfig.lawState;
  //法律状态集合
  $scope.lawStateList = DictionaryConfig.lawStateList;
  //提取人身份
  $scope.personType = $stateParams.type;
  $scope.CONSTANT = {
    "messageTelephoneNull":"请填写手机号码",
    "messageTelephoneError":"请输入的电话格式不正确",
    "messageSerialNoNull":"请输入流水号",
    "messageVerificationCode":"请输入手机验证码",
    "messageError":"请联系系统管理员"
  };

  //验证手机号码
  var validatePhone = function() {
    $scope.messageTelephoneError = "";
    //手机号码
    if(!$scope.telephone){
      $scope.messageTelephoneError = $scope.CONSTANT.messageTelephoneNull;
      $rootScope.toaster("error", "错误", $scope.messageTelephoneError);
      $("[name='telephoneName']").focus();
      return false;
    }else{
      var phoneTest = /^1[3|4|5|7|8][0-9]{9}$/;
      if (!phoneTest.test($scope.telephone)) {
        $scope.messageTelephoneError = $scope.CONSTANT.messageTelephoneError;
        $rootScope.toaster("error", "错误", $scope.messageTelephoneError);
        $("[name='telephoneName']").focus();
        return false;
      }
    }
    return true;
  };
  //提取案件的验证
  var validateCase = function(){

    $scope.messageSerialNoNull = "";
    $scope.messageVerificationCode = "";
    //流水号
    if(!$scope.serialNo){
      $scope.messageSerialNoNull = $scope.CONSTANT.messageSerialNoNull;
      $rootScope.toaster("error", "错误", $scope.messageSerialNoNull);
      $("[name='serialNoName']").focus();
      return false;
    }
    //手机号
    if(!validatePhone()){
      return false;
    }
    //手机验证码
    if(!$scope.verificationCode){
      $scope.messageVerificationCode = $scope.CONSTANT.messageVerificationCode;
      $rootScope.toaster("error", "错误", $scope.messageVerificationCode);
      $("[name='verificationCodeName']").focus();
      return false;
    }
    return true;
  };
  //获取手机验证码
  $scope.getMobileCode = function(){

    $scope.messageSerialNoNull = "";
    //流水号
    if(!$scope.serialNo){
      $scope.messageSerialNoNull = $scope.CONSTANT.messageSerialNoNull;
      $rootScope.toaster("error", "错误", $scope.messageSerialNoNull);
      $("[name='serialNoName']").focus();
    }else{
      if(validatePhone()){
        $scope.sendMessageLaw({
          "type":$scope.personType == 1 ? 4 : 3 ,//应诉type是4,起诉type是3
          "telephone":$scope.telephone,
          "serialNo":$scope.serialNo
        }).success(function(result){
          if(result.code == AdjustConfig.commonConStant.SUCCESS){
            //倒计时
            (function countDown() {
              var times = 59;
              var stop = $interval(function () {
                $scope.codeTime = times + 's';
                times --;
                if( times == 0){
                  $interval.cancel(stop);
                  $scope.codeTime = null;
                }
              },1000);
            })();
          }else{
            $scope.queryResultFlag = false;
            $rootScope.toaster("error", "错误", result.message);
          }
        });
      }



    }
  };

  //提取案件
  $scope.extractCase = function () {
    if(validateCase()){
      $scope.getAdjustForSueService({
        "personType":$scope.personType,
        "serialNo": $scope.serialNo,
        "telephone": $scope.telephone,
        "verificationCode": $scope.verificationCode
      }).success(function(result){
        $log.info(result);
        if(result.code == AdjustConfig.commonConStant.SUCCESS){
          $scope.lawObj = result.result;
          $scope.queryResultFlag = true;
        }else{
          $scope.queryResultFlag = false;
          $rootScope.toaster("error", "错误", result.message);
        }
      });
    }
  };
  //绑定案件
  $scope.bindCaseForUser = function () {
    $scope.bindCaseForUserService({
      "serialNo":$scope.serialNo,
      "telephone":$scope.telephone,
      "personType":$scope.personType,
      "partyType":$scope.lawObj.partyType
    }).success(function(result){
      if(result.code == AdjustConfig.commonConStant.SUCCESS){
        $scope.lawObj.isBind = true;
        $rootScope.toaster("success", "成功", "恭喜您绑定成功");
      }else{
        $rootScope.toaster("error", "错误", result.message);
      }
    })
  };
  //发起起诉
  $scope.initiateProceedings = function (lawObj) {
    AdjustService.getForwardUrl({
      orgId:lawObj.jyLawInfoVO.lawOrgId
    }).success(function(res){
      if(res.result && res.result.civilProcedureDoc){
        $state.go('dashboard.reading_notes', {"serialNo":lawObj.jyLawInfoVO.serialNo, "name": res.result.civilProcedureDoc});
      }else{
        $state.go('dashboard.reading_notes', {"serialNo":lawObj.jyLawInfoVO.serialNo, "name": "reading_notes"});
      }
    })
  };
  //未经过调解发起起诉
  $scope.notMediatedSue = function () {
    $state.go('dashboard.sue_org');
  }
  
  //查看案件详细
  $scope.queryLawInfoDetail = function(lawObj){
    //查询详细  如果状态未1001 待起诉状态并且未起诉人进行起诉 应诉人直接查询详细
    if(lawObj.jyLawInfoVO.state == DictionaryConfig.lawState.prosecutionState){
      AdjustService.getForwardUrl({
        orgId:lawObj.jyLawInfoVO.lawOrgId
      }).success(function(res){
        if(res.result && res.result.civilProcedureDoc){
          $state.go('dashboard.reading_notes', {"serialNo":lawObj.jyLawInfoVO.serialNo, "name": res.result.civilProcedureDoc});
        }else{
          $state.go('dashboard.reading_notes', {"serialNo":lawObj.jyLawInfoVO.serialNo, "name": "reading_notes"});
        }
      })
    }else{
      $state.go("dashboard.case_details",{serialNo:lawObj.jyLawInfoVO.serialNo});
    }
  }
});