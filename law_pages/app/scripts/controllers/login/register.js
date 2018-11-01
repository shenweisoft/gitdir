'use strict';

angular.module('sbAdminApp').controller('RegisterCtrl', function($scope, $timeout, LoginConfig, DictionaryConfig, LoginService, $state, $log, IdentityService) {

  //定义注册Service
  $scope.registerService = LoginService.register;
  //验证用户是否存在Service
  $scope.checkLoginAccountService = LoginService.checkLoginAccount;
  //APP.js常量
  $scope.loginErrorCode = LoginConfig.loginConStant.loginErrorCode;
  //身份证验证
  $scope.identityCode = IdentityService.identityCodeValid;
  //定义常量
  $scope.CONSTANT = {
    "messageName": "真实姓名不能为空",
    "messageNamelength": "真实姓名长度介于2~ 15个字符之间",
    "messageType": "请您选择证件信息",
    "messageLoginAccount": "证件号不能为空",
    "messageLoginAccountErorr": "身份证号不正确",
    "messagePassword": "请您输入密码",
    "messagePasswordLength": "请您设置6~16位密码",
    "messagePasswordValidate": "密码必须包含字母和数字",
    "messageRepeatPassword": "请您输入确认密码",
    "messageRepeatPasswordDif": "确认密码与密码输入不一致，请您重新输入",
    "messageVerificationCode": "请您输入验证码",
    "messageVerificationError": "验证码错误",
    "messageLoginAccountExit": "您输入的证件号已经存在"
  };
  //配置文件取得证件信息集合
   //$scope.dictionaryList = DictionaryConfig.certTypeConstant;
  $scope.dictionaryList =  [
    {"id": "0","value": "身份证" },
    {"id": "4","value":"律师证"}
  ];
  //点击验证码触发的方法
  $scope.chaptcha_click = function() {
    $scope.chaptcha = LoginConfig.loginConStant.randomCodeUrl + (new Date()).getTime()
  };
  //默认触发点击验证码方法
  $scope.chaptcha_click();
  //验证表单信息
  //验证姓名是否为空和长度

  $scope.validateUserName = function(){
    $scope.usernameErrorMessage = '';
    //姓名
    if (!$scope.username) {
      $scope.usernameErrorMessage = $scope.CONSTANT.messageName;
      return false;
    }else{
      if ($scope.username.length < 2 || $scope.username.length > 15) {
        $scope.usernameErrorMessage = $scope.CONSTANT.messageNamelength;
        $("[name='username']").focus();
        return false;
      }
    }
    return true;
  };
  $scope.flag = true;
  //验证登录名是否为空和是否正确
  $scope.validateLoginAccountEmpty = function(){
    if($scope.flag){
      $scope.IdErrorMessage = '';
    }
    //证件号验证
    if (!$scope.loginAccount) {
      $scope.IdErrorMessage = $scope.CONSTANT.messageLoginAccount;
      return false;
    }else{
      //身份证验证
      if($scope.certificateType.id =='0' && ! $scope.identityCode($scope.loginAccount)){
        $scope.IdErrorMessage = $scope.CONSTANT.messageLoginAccountErorr;
        return false;
      }
    }
    return true;
  };
  //验证登录名是否存在，证件号
  $scope.validateLoginAccount = function(){
    //验证登录名是否存在
    if($scope.validateLoginAccountEmpty()){
      $scope.checkLoginAccountService({
        "loginAccount": $scope.loginAccount
      }).success(function(result) {
        if (result.code == $scope.loginErrorCode.LOGIN_EXIST) {
          $scope.IdErrorMessage = $scope.CONSTANT.messageLoginAccountExit;
          $scope.flag = false;
        } else if (result.code == LoginConfig.commonConStant.SUCCESS) {
          $scope.flag = true;
        }else{
          $scope.flag = false;
          //TODO
          alert("请联系系统管理员");
        }
      });
    }
  };
  //验证密码
  $scope.validatePassword = function(){
    $scope.passwordErrorMessage = '';
    //密码
    if (!$scope.password) {
      $scope.passwordErrorMessage = $scope.CONSTANT.messagePassword;
      return false;
    }
    if ($scope.password.length < 6 || $scope.password.length > 16) {
      $scope.passwordErrorMessage = $scope.CONSTANT.messagePasswordLength;
      return false;
    }
    var regu = /\w*[0-9]+\w*$/;
    var regu2 = /\w*[a-zA-Z]+\w*$/;
    if (!regu.test($scope.password) || !regu2.test($scope.password)) {
      $scope.passwordErrorMessage = $scope.CONSTANT.messagePasswordValidate;
      return false;
    }
    return true;
  };
  //验证确认密码
  $scope.validateConfirmPassword = function(){
    $scope.repeatPasswordErrorMessage = '';
    //确认密码
    if (!$scope.repeatPassword) {
      $scope.repeatPasswordErrorMessage = $scope.CONSTANT.messageRepeatPassword;
      return false;
    }
    if ($scope.repeatPassword != $scope.password) {
      $scope.repeatPasswordErrorMessage = $scope.CONSTANT.messageRepeatPasswordDif;
      return false
    }
    return true;
  };

  //验证验证码
  $scope.validateVerificationCode = function(){
    //验证码
    $scope.verificationErrorMessage = "";
    if (!$scope.verificationCode) {
      $scope.verificationErrorMessage = $scope.CONSTANT.messageVerificationCode;
      return false;
    }
    return true;
  }

  //注册
  $scope.submitForm = function() {

    if ($scope.validateUserName() && $scope.validateLoginAccountEmpty() && $scope.validatePassword() && $scope.validateConfirmPassword() && $scope.validateVerificationCode() && $scope.flag) {
      $scope.registerService({
        "name": $scope.username,
        "loginAccount": $scope.loginAccount,
        "certificateType": $scope.certificateType.id,
        "password": $scope.password,
        "verificationCode": $scope.verificationCode,
        "userType": 0 //默认是公民类型
      }).success(function(result) {
        console.log(result);
        if (result.code == $scope.loginErrorCode.LOGIN_VERIFICATION_CODE_ERROR) {
          $scope.verificationErrorMessage = $scope.CONSTANT.messageVerificationError;
          //重置验证码
          $scope.chaptcha_click();
        } else if (result.code == LoginConfig.commonConStant.SUCCESS) {
          $state.go("register_success");
        }else{
          //TODO
          alert("请联系系统管理员");
        }
      })
    }
  };
});
