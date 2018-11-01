angular.module('sbAdminApp').controller('policeLoginCtrl', function($scope,$state,$stateParams,$modal,LoginService,LoginConfig,DictionaryConfig,toaster) {
  //获取环境配置Service
  $scope.queryJyEnvironmentInfoService = LoginService.queryJyEnvironmentInfo;
  //获取环境配置
  $scope.queryJyEnvironmentInfoService({}).success(function(result){
    if (result.code==LoginConfig.commonConStant.SUCCESS) {
      $scope.environmentalAllocation = result.result.environmentType;
    }
  })
  $scope.userType = $stateParams.type;
  /*if($scope.userType){
    $scope.loginTip = "请输入注册时的证件号";
  }else{
    $scope.loginTip = "请输入登录账号";
  }*/
  $scope.loginTip = "请输入登录账号";
  //登录service
  $scope.loginService = LoginService;
  //登录常量
  $scope.loginConstant = LoginConfig.loginConStant;

  //定义常量
  $scope.CONSTANT = {
    "messageForUsername": "用户名不为空",
    "messageForPassword": "密码不能少于6位",
    "messageForVerificationCode": "请输入正确验证码",
    "messageForFailedManyTimes": "错误次数太多",
    "messageForLoginPasswordError": "用户名或密码错误",
    "messageForLoginNonExist": "用户名不存在",
    "messageForLoginError": "后台服务暂时不可用",
    "messageForError": "网络不可用"
  };

  //登录，提交表单
  $scope.submitForm = function() {
    if (validateForm()) {
      sessionStorage.setItem("jtsptLoginType",$scope.userType);
      $scope.loginService.login({
        "username": $scope.username,
        "password": $scope.password,
        "verificationCode": $scope.verificationCode,
        "userType":$scope.userType
      }).success(function(result) {
        switch (result.code) {
          case $scope.loginConstant.loginErrorCode.SUCCESS:
            $scope.loginService.setUser(result.result);
            $scope.sysUser = result.result.sysUser;
            $scope.$emit('user2Root');
            if($scope.sysUser.userType == '0'){
              $state.go('party_page');
            }else{
              $state.go('dashboard.home');
            }
            break;
          case $scope.loginConstant.loginErrorCode.ERROR:
            $scope.errorMessage = $scope.CONSTANT.messageForLoginError;
            break;
          case $scope.loginConstant.loginErrorCode.LOGIN_NONEXIST:
            $scope.errorMessage = $scope.CONSTANT.messageForLoginNonExist;
            break;
          case $scope.loginConstant.loginErrorCode.LOGIN_PASSWD_FAILURE:
            $scope.errorMessage = $scope.CONSTANT.messageForLoginPasswordError;
            break;
          case $scope.loginConstant.loginErrorCode.LOGIN_VERIFICATION_CODE_ERROR:
            $scope.chaptchaClick();
            $scope.errorMessage = $scope.CONSTANT.messageForVerificationCode;
            break;
          case $scope.loginConstant.loginErrorCode.LOGIN_FAILED_MANY_TIMES:
            $scope.chaptchaClick();
            $scope.errorMessage = result.message;
            break;
        }
      }).error(function(error) {
        $scope.networkError = true;
        $scope.errorMessage = $scope.CONSTANT.messageForError;
      })
    }
  };
  //验证表单
  var validateForm = function() {
    if ($scope.loginForm.$invalid) {
      $scope.isUsernameError = $scope.loginForm.username.$invalid;
      if ($scope.isUsernameError) {
        $scope.errorMessage = $scope.CONSTANT.messageForUsername;
        $('[name="username"]').focus();
        return false;
      }
      $scope.isPasswordError = $scope.loginForm.password.$invalid;
      if ($scope.isPasswordError) {
        $scope.errorMessage = $scope.CONSTANT.messageForPassword;
        $('[name="password"]').focus();
        return false;
      }
    }
    return true;
  };
  //验证码
  $scope.chaptchaClick = function() {
    $scope.showVeriCode = true;
    $scope.chaptcha = $scope.loginConstant.randomCodeUrl + (new Date()).getTime()
  };

  //进入页面初始化
  $scope.loginInit = function () {
    $scope.loginService.getFailureTimes({}).then(function (data) {
      if(data.result >= 3 ){$scope.chaptchaClick() ;}
    })
  };
  $scope.loginInit();
});