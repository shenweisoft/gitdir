'use strict';

angular.module('sbAdminApp').controller('ForgetPassword', function($scope, $state, $location, $log, $interval , LoginConfig, LoginService ) {
  //手机
  $scope.iponeMessageCodeError = "";
  //忘记密码步骤
  $scope.forgetStep = 1;
  //如果loginAccount 不为空表示为邮箱验证过来的直接跳转到设置密码
  if($location.search().loginAccount){
    $scope.forgetStep = 3;
  }
  //手机验证方式还是邮箱验证方式 手机0 邮箱1
  $scope.phoneOrEmail = 0;
  //邮箱验证是否完成
  $scope.emailComplete = 0;
  //是否存在账号Service
  $scope.existUserService = LoginService.existUser;
  //发送邮件的Service
  $scope.mailVerificationService = LoginService.sendLinkMail;
  //获取手机验证码Service
  $scope.getMobileCodeService = LoginService.getMobileCode;
  //验证手机验证码是否正确Service
  $scope.checkPhoneCodeService = LoginService.checkPhoneCode;
  //修改密码Service
  $scope.modifyPasswordService = LoginService.modifyPassword;
  //登录常量
  $scope.loginConstant = LoginConfig.loginConStant;
  //忘记密码常量
  $scope.forgetPasswordConstant = LoginConfig.forgetPasswordConstant;
  //定义本区域常量
  $scope.CONSTANT = {
    "messageUserNameNotExist": "请填写用户名",
    "messageCodeNotExist": "请填写4位验证码",
    "messageUserNotExist": "用户不存在",
    "messageCodeError": "验证码错误",
    "messageCodeNull": "手机验证码不能为空",
    "messageIpnoneCodeError": "手机验证码错误",
    "messagePassword": "密码不能为空",
    "messageRepeatPassword": "请您输入确认密码",
    "messagePasswordLength": "请您设置6~16位密码",
    "messagePasswordValidate": "密码必须包含字母和数字",
    "messageRepeatPasswordDif": "密码不一致，请您重新输入"
  };

  //点击下一步按钮
  $scope.nextStep = function () {
    //第一步
    if($scope.forgetStep == 1){
      //验证用户
      $scope.existUser();
    }else if($scope.forgetStep == 2){
      if($scope.phoneOrEmail== 0){
        //验证手机
        $scope.checkPhoneCode();
      }else{
        //发送邮件
        $scope.sendMailLink();
      }
    }
  }
  //修改密码
  $scope.modifyPassword = function() {
    var loginAccount;
    if($scope.username){
      loginAccount = $scope.username;
    }else{//从邮箱的url中获取username
      loginAccount = $location.search().loginAccount;
    }
    if (validateFrom()) {
      if (loginAccount) {
        $scope.modifyPasswordService({
          "loginAccount": loginAccount,
          "password": $scope.newPassword,
          "confirmPassword": $scope.confirmPassword
        }).success(function(result) {
          if(result.code == $scope.loginConstant.loginErrorCode.SUCCESS){
            $state.go("modify_success");
          }else{
            //TODO
            alert("请联系系统管理员");
          }
        })
      }
    }
  }
  //验证表单方法
  var validateFrom = function() {
    $scope.iponeMessagePasswordError = "";
    $scope.iponeMessagePasswordErrorNew = "";
    //密码
    if (!$scope.newPassword) {
      $scope.iponeMessagePasswordError = $scope.CONSTANT.messagePassword;
      $("[name='newPassword']").focus();
      return false;
    }
    //密码的长度
    if ($scope.newPassword.length < 6 || $scope.newPassword.length > 16) {
      $scope.iponeMessagePasswordError = $scope.CONSTANT.messagePasswordLength;
      $("[name='newPassword']").focus();
      return false;
    }
    //密码必须包含字母和数字
    var regNumber = /\w*[0-9]+\w*$/;
    var regCharacter = /\w*[a-zA-Z]+\w*$/;
    if (!regNumber.test($scope.newPassword) || !regCharacter.test($scope.newPassword)) {
      $scope.iponeMessagePasswordError = $scope.CONSTANT.messagePasswordValidate;
      $("[name='newPassword']").focus();
      return false;
    }
    //确认密码
    if (!$scope.confirmPassword) {
      $scope.iponeMessagePasswordErrorNew = $scope.CONSTANT.messageRepeatPassword;
      $("[name='confirmPassword']").focus();
      return false;
    }
    //确认密码与新密码必须相同
    if ($scope.newPassword != $scope.confirmPassword) {
      $scope.iponeMessagePasswordErrorNew = $scope.CONSTANT.messageRepeatPasswordDif;
      $("[name='confirmPassword']").focus();
      return false;
    }
    return true;
  }
  //验证用户，表单验证方法
  var validateUser = function() {
    $scope.ErrorMessage=""
    $scope.verificationCodeErrorMessage=""
    
    /*用户账号*/
    if (!$scope.username) {
      $scope.ErrorMessage =$scope.CONSTANT.messageUserNameNotExist;
      $('[name="username"]').focus();
      return false;
    }
    /*验证码*/
    if (!$scope.verificationCode) {
      $scope.verificationCodeErrorMessage =$scope.CONSTANT.messageCodeNotExist
      $('[name="verificationCode"]').focus();
      return false;
    }
    return true;
  };
  //验证手机，表单验证方法
  var validateMobile = function() {
    if (!$scope.mobileCode) {
      $scope.iponeMessageCodeError = $scope.CONSTANT.messageCodeNull;
      $("[name='mobileCode']").focus();
      return false;
    }
    return true;
  };
  //确认账号，验证用户是否存在
  $scope.existUser = function() {
    if (validateUser()) {
      $scope.existUserService({
        "loginAccount": $scope.username,
        "verificationCode": $scope.verificationCode
      }).success(function(result) {
        $log.info(result);
        //请求成功
        if(result.code == LoginConfig.commonConStant.SUCCESS){
          //成功跳转第二部
          $scope.forgetStep = 2;
          $scope.email=result.result.email;
          //当前明文手机号
          $scope.currentMobile = result.result.mobile;
          //手机号中间四位隐藏
          var reg =/(\d{3})\d{4}(\d{4})/;
          if($scope.currentMobile){
            $scope.mobile = $scope.currentMobile.replace(reg,'$1****$2');
          }
        }else if(result.code == LoginConfig.forgetPasswordConstant.errorCode.USER_NOT_EXIST){
          //用户不存在
          $scope.ErrorMessage =$scope.CONSTANT.messageUserNotExist;
          $scope.chaptcha_click();
        }else if (result.code == $scope.forgetPasswordConstant.errorCode.VERIFICATION_CODE_ERROR){
          //验证码错误
          $scope.verificationCodeErrorMessage =$scope.CONSTANT.messageCodeError;
        }else{
          //TODO
          alert("请联系系统管理员");
        }

      })
    }
  };
  //验证手机验证码是否正确
  $scope.checkPhoneCode = function() {
    if (validateMobile()) {
      $scope.checkPhoneCodeService({
        "mobileCode": $scope.mobileCode
      }).success(function(result) {
        //成功
        if(result.code == LoginConfig.loginConStant.loginErrorCode.SUCCESS){
          $scope.forgetStep = 3;
        }else if(result.code == $scope.forgetPasswordConstant.errorCode.VERIFICATION_CODE_ERROR){
          $scope.iponeMessageCodeError = $scope.CONSTANT.messageIpnoneCodeError;
          $("[name='mobileCode']").focus();
        }else{
          //TODO
          alert("请联系系统管理员");
        }
      })
    }
  };
  //获取手机验证码
  $scope.getMobileCode = function() {

    if($scope.currentMobile &&  !$scope.codeTime){
      $scope.getMobileCodeService({
        "mobile": $scope.currentMobile
      }).success(function(result) {
        //如果成功
        if(result.code == LoginConfig.loginConStant.loginErrorCode.SUCCESS){
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
          //TODO
          alert("请联系系统管理员");
        }
      })
    }
  };
  //发送邮件
  $scope.sendMailLink = function() {
    if($scope.email){
      $scope.mailVerificationService({
        "loginAccount": $scope.username,
        "toUser": $scope.email
      }).success(function(result) {
        //请求成功
        if(result.code == $scope.loginConstant.loginErrorCode.SUCCESS){
          $state.go("mailbox_validation_entry",{email:$scope.email});
        }else{
          //TODO
          alert("请联系系统管理员");
        }
      })
    }
  };
  //验证码
  $scope.chaptcha_click = function() {
    $scope.chaptcha = $scope.loginConstant.randomCodeUrl + (new Date()).getTime()
  };
  //自动获取
  $scope.chaptcha_click();

});