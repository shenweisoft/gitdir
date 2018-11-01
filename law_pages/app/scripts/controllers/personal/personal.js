'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp').controller('PersonalCtrl', function($scope, $log, $state, $modal, $location, LoginConfig, LoginService, DictionaryConfig,toaster,$rootScope) {
  //定义用户查询Service
  $scope.querySysUserService = LoginService.querySysUser;
  //配置文件取得证件信息集合
  $scope.dictionaryList = DictionaryConfig.certificateTypeConstant;
  
  var level = "error";
  var title = "错误";
  $scope.CONSTANT = {
    messageInitError:"用户信息初始化失败"
  }
  
  //查询用户基本信息
  $scope.initUserInfo = function() {
    $scope.querySysUserService({}).then(function(result) {
      $log.log(result.data);
      //请求成功
      if (result.data.code == LoginConfig.commonConStant.SUCCESS) {
        var sysUser = result.data.result;
        $scope.name = sysUser.text;
        //根据key取值
        $scope.certificateType = DictionaryConfig.getDictionaryValueByKey(DictionaryConfig.certificateTypeConstant, sysUser.certificateType);
        $scope.loginAccount = sysUser.loginAccount;
        $scope.certificateNumber = sysUser.certificateNumber;
        $scope.regionId = sysUser.regionId;
        $scope.regionName = sysUser.regionName;
        $scope.email = sysUser.email;
        $scope.mobile = sysUser.mobile;
        $scope.id = sysUser.id;
        $scope.head = sysUser.head ? LoginConfig.pictureConstant.smallPictureUrl + sysUser.head : "views/images/img01.jpg";
        $scope.codeFileName = sysUser.codeFileName ? LoginConfig.pictureConstant.codeFilePathUrl + sysUser.codeFileName : "views/images/0304.png";
      }
    }, function(error) {
      $rootScope.toaster(level, title, $scope.CONSTANT.messageInitError);
    });
  }

  //打开用户信息修改页面
  $scope.open = function(size) {
    var modalInstance = $modal.open({
      templateUrl: 'views/pages/personal/edit_personal.html',
      controller: 'EditUserCtrl',
      size: size,
      resolve: {
        items: function() {
          return {
            id: $scope.id,
            name: $scope.name,
            regionId: $scope.regionId,
            regionName: $scope.regionName
          }
        }
      }
    });

    //获取弹出窗口传回的值
    modalInstance.result.then(function(data) {
      $scope.name = data.name;
      $scope.regionId = data.regionId;
      $scope.regionName = data.regionName;
    }, function() {
      $log.info('Modal dismissed at: ' + new Date());
    });
  }

  //打开头像修改页面
  $scope.open_head = function(size) {
    var modalInstance = $modal.open({
      templateUrl: 'views/pages/personal/edit_head.html',
      controller: 'EditHeadImageCtrl',
      size: size,
      resolve: {
        items: function() {
          return {
            id: $scope.id
          }
        }
      }
    });

    //结果获取
    modalInstance.result.then(function(data) {
      $scope.head = data.head;
    }, function() {
      $log.info('Modal dismissed at: ' + new Date());
    });
  }

  //打开绑定手机页面
  $scope.open_phone = function(size) {
    var modalInstance = $modal.open({
      templateUrl: 'views/pages/personal/edit_phone.html',
      controller: 'EditPhoneCtrl',
      size: size,
      resolve: {
        items: function() {
          return {
            mobile: $scope.mobile,
            id: $scope.id
          }
        }
      }
    });

    //获取弹出窗口传回的值
    modalInstance.result.then(function(mobile) {
      $scope.mobile = mobile;
    }, function() {
      $log.info('Modal dismissed at: ' + new Date());
    });
  }

  //打开绑定邮箱页面
  $scope.open_mailbox = function(size) {
    $scope.items = [$scope.loginAccount, $scope.email];
    var modalInstance = $modal.open({
      templateUrl: 'views/pages/personal/edit_mailbox.html',
      controller: 'EditMailCtrl',
      size: size,
      resolve: {
        items: function() {
          return {
            loginAccount: $scope.loginAccount,
            email: $scope.email
          }
        }
      }
    });
  }

  //打开修改密码页面
  $scope.open_password = function(size) {
    var modalInstance = $modal.open({
      templateUrl: 'views/pages/personal/edit_password.html',
      controller: 'EditPasswordCtrl',
      size: size,
      resolve: {
        items: function() {
          return {
            id: $scope.id
          }
        }
      }
    });
  }

  //打开发送邮件成功页面
  $scope.mailReBindSuccess = function(popUp) {
    var templateUrl = '';
    switch (popUp) {
      case "1":
        templateUrl = 'views/pages/personal/edit_mailbox_success.html';
        break;
      case "0":
        templateUrl = 'views/pages/personal/edit_mailbox_fail.html';
        break;
    }
    $modal.open({
      templateUrl: templateUrl,
      resolve: {}
    });
  }

  //初始化后台链接打开弹出窗口
  $scope.initWindow = function() {
    //加载用户信息
    $scope.initUserInfo();

    //加载邮件绑定结果
    if ($location.search().popUp) {
      $scope.mailReBindSuccess($location.search().popUp);
      var oldUrl = $location.url(),
        targetUrl = oldUrl.substr(0, oldUrl.indexOf('?') + 1);
      $location.url(targetUrl);
    }
  }
  $scope.initWindow();

  //生成二维码
  $scope.createCode = function() {
      LoginService.createCode({
          "id": $scope.id
      }).success(function(result) {
          //成功
          if (result.code == LoginConfig.commonConStant.SUCCESS) {
              $scope.codeFileName = LoginConfig.pictureConstant.codeFilePathUrl + result.result
          } else {
            $rootScope.toaster(level, title, $scope.CONSTANT.netWorkError);
          }
      });
  };
});

//修改用户信息
angular.module('sbAdminApp').controller('EditUserCtrl', function($scope, $log, $modalInstance, $state, $timeout, LoginConfig, LoginService, DictionaryConfig, AdminConstant, items) {
  //定义更新用户Service
  $scope.editSysUserService = LoginService.editSysUser;
  
  var level = "error";
  var title = "错误";
  //定义常量
  $scope.CONSTANT = {
    "messageName": "请您输入真实姓名",
    "messageRegionName": "请您选择所属区域",
    "messageUserEditError":"用户编辑失败"
  };

  //区域树配置
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
      'default': {
        icon: 'iconfont icon-dizhi'
      },
      folder: {
        icon: 'iconfont icon-wenjian1'
      }
    },
    version: 1,
    plugins: ['types']
  };

  $scope.applyModelChanges = function() {
    return true;
  };
  $scope.name = items.name;
  $scope.regionName = items.regionName;
  $scope.regionId = items.regionId;

  //验证表单信息
  var validateForm = function() {
    //姓名
    if (!$scope.name) {
      $scope.realNameMessage = $scope.CONSTANT.messageName;
      $("[name='name']").focus();
      return false;
    }
    if (!$scope.regionName) {
      $scope.regionNameMessage = $scope.CONSTANT.messageRegionName;
      $("[name='regionName']").focus();
      return false;
    }
    return true;
  }

  //更新用户资料
  $scope.updateSysUser = function() {
    //验证是否通过
    if (validateForm()) {
      $scope.editSysUserService({
        "id": items.id,
        "text": $scope.name,
        "regionId": $scope.regionId,
        "regionName": $scope.regionName
      }).success(function(result) {
        //请求成功
        if (result.code == LoginConfig.commonConStant.SUCCESS) {
          $modalInstance.close({
            "name": $scope.name,
            "regionId": $scope.regionId,
            "regionName": $scope.regionName
          });
        } else {
          $rootScope.toaster(level, title, $scope.CONSTANT.messageUserEditError);
        }
      });
    }
  }
  
  $scope.blurAdmin = function(){
    if($scope.isShowTree){
      $timeout(function(){
        $scope.isShowTree = false;
      }, 200);
    }
  };

  //填充区域信息
  $scope.adminRegion = AdminConstant.administrationRegions;
  $scope.isShowTree = false;
  $scope.selectAdmin = function(node, selected, event) {
    var selectedNodes = selected.selected;
    if (selectedNodes.length > 0) {
      var newValue = $scope.adminRegion[selectedNodes[0]].fullName;
      var newId = $scope.adminRegion[selectedNodes[0]].id;
      if ($scope.regionName != newValue) {
        $scope.regionName = newValue;
        $scope.regionId = newId;
        $scope.isShowTree = false;
      }
    }
  }

  //点击取消
  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
});

//修改用户头像
angular.module('sbAdminApp').controller('EditHeadImageCtrl', function($scope,$timeout, $modalInstance, $http, $log, Upload, LoginService, LoginConfig, items,toaster) {
  //更新用户信息
  $scope.editSysUserService = LoginService.editSysUser;
  $scope.crop = {};
  
  var level = "error";
  var title = "错误";
  $scope.CONSTANT = {
    "messageHeadUploadError":"头像上传失败",
    "messageUserEditError":"用户信息更新失败"
  }

  function updateCoords(c) {
    $scope.crop = c;
  };

  //图片路径
  var bigPictureUrl = LoginConfig.pictureConstant.bigPictureUrl;
  var imgJcrop;
  //上传头像
  $scope.uploadHeadIcon = function(file) {
    if (!file) return;
    if(imgJcrop){
      imgJcrop.destroy();
      $('#original').show();
    }
    
    Upload.upload({
      url: LoginConfig.pictureConstant.uploadImageUrl,
      data: {
        type: 'head'
      },
      file: file
    }).success(function(result) {
      if (result.code == LoginConfig.commonConStant.SUCCESS) {
        $scope.headAddress = bigPictureUrl + result.result;
        $scope.fileName = result.result;
        if(!imgJcrop) cropImg();
        else $timeout(cropImg, 2000)
      } else {
        $rootScope.toaster(level, title, $scope.CONSTANT.messageHeadUploadError);
      }
    });
  
    var cropImg = function(){
      $('#original').Jcrop({
        aspectRatio: 1,
        onSelect: updateCoords
      }, function() { imgJcrop = this;});
    }
  }
  //保存头像
  $scope.saveHead = function() {
    //剪切图片
    if ($scope.crop.x) {
      $http({
        method: 'post',
        url: LoginConfig.pictureConstant.cropImageUrl,
        data: {
          crop: $scope.crop,
          filePath: $scope.fileName,
          type: "head"
        }
      }).success(function(result) {
        $log.info(result);
        if (result.code == LoginConfig.commonConStant.SUCCESS) {
          updateUser(result.result);
        }
      });
    } else {
      updateUser($scope.fileName);
    }
  }

  //修改用户头像信息
  function updateUser(filePath) {

    $scope.editSysUserService({
      "id": items.id,
      "head": filePath
    }).success(function(result) {
      //请求成功
      if (result.code == LoginConfig.commonConStant.SUCCESS) {
        $modalInstance.close({
          "head": LoginConfig.pictureConstant.smallPictureUrl + filePath
        });
      } else {
        $rootScope.toaster(level, title, $scope.CONSTANT.messageUserEditError);
      }
    });
  }

  //点击取消
  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
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

});

//修改手机号码
angular.module('sbAdminApp').controller('EditPhoneCtrl', function($scope, $log, $modalInstance, $state, LoginConfig, LoginService, items, $interval,toaster) {

  //APP.js常量
  $scope.loginErrorCode = LoginConfig.loginConStant.loginErrorCode;
  //获取手机验证码Service
  $scope.getMobileCodeService = LoginService.getMobileCode;
  //验证手机验证码是否正确Service
  $scope.bindPhoneService = LoginService.bindPhone;
  
  var level = "error";
  var title = "错误";
  //定义常量
  $scope.CONSTANT = {
    "messagePhone": "请您输入手机号",
    "messageValidatePhone": "号码格式不正确",
    "messageVerificationCode": "请输入验证码",
    "messageVerificationCodeError": "验证码输入错误",
    "messageBindingSuccess": "绑定成功",
    "messageCodeGetError":"手机验证码发送失败",
    "messagePhoneBindError":"手机号码绑定失败",
    "netWorkError": "网络异常"
  };

  //初始化数据
  $scope.id = LoginService.user.id;
  $scope.items = items;
  $scope.mobile = $scope.items.mobile;
  $scope.id = $scope.items.id;

  //手机号验证表单
  var validateForm = function(flag) {
    $scope.phoneErrorMessage = "";
    $scope.phoneCodeErrorMessage = "";
    if (!$scope.mobile) {
      $scope.phoneErrorMessage = $scope.CONSTANT.messagePhone;
      $("[name='mobile']").focus();
      return false;
    } else {
      var phoneTest = /^1[3|4|5|7|8|9][0-9]{9}$/;
      if (!phoneTest.test($scope.mobile)) {
        $scope.phoneErrorMessage = $scope.CONSTANT.messageValidatePhone;
        $("[name='mobile']").focus();
        return false;
      }
    }
    if (flag) {
      if (!$scope.verificationCode) {
        $scope.phoneCodeErrorMessage = $scope.CONSTANT.messageVerificationCode;
        $("[name='verificationCode']").focus();
        return false;
      }
    }
    return true;
  }

  //获取手机验证码
  $scope.getMobileCode = function() {
    if (validateForm() && !$scope.codeTime) {
      $scope.getMobileCodeService({
        "mobile": $scope.mobile,
        "message":"您正在修改手机号，验证码："
      }).success(function(result) {
        //如果不成功
        if (result.code == LoginConfig.commonConStant.SUCCESS) {
          //倒计时
          (function countDown() {
            var times = 59;
            var stop = $interval(function() {
              $scope.codeTime = times + 's';
              times--;
              if (times == 0) {
                $interval.cancel(stop);
                $scope.codeTime = null;
              }
            }, 1000);
          })();
        } else {
          $rootScope.toaster(level, title, $scope.CONSTANT.messageCodeGetError);
        }
      })
    }
  }

  //绑定手机号
  $scope.bindMobile = function() {
    if (validateForm(true)) {
      $scope.bindPhoneService({
        "id": $scope.id,
        "mobileCode": $scope.verificationCode,
        "mobile": $scope.mobile
      }).success(function(result) {
        $log.info(result);
        //绑定成功
        if (result.code == LoginConfig.commonConStant.SUCCESS) {
          $modalInstance.close($scope.mobile);
        } else if (result.code == $scope.loginErrorCode.LOGIN_VERIFICATION_CODE_ERROR) {
          //验证码输入错误
          $scope.phoneCodeErrorMessage = $scope.CONSTANT.messageVerificationCodeError;
          $("[name='verificationCode']").focus();
        } else {
          $rootScope.toaster(level, title, $scope.CONSTANT.messagePhoneBindError);
        }
      });
    }
  }

  //点击取消
  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
});

//绑定邮箱
angular.module('sbAdminApp').controller('EditMailCtrl', function($scope, $modalInstance, $modal, $state, $log, LoginService, LoginConfig, items) {
  //绑定邮箱Service
  $scope.mailBindingService = LoginService.mailBinding;
  
  var level = "error";
  var title = "错误";
  //定义常量
  $scope.CONSTANT = {
    "messageBindingSuccess": "绑定成功",
    "messageEmailBindError":"邮箱绑定失败",
    "messageEmailRegError": "邮箱地址格式不正确"
  };

  //初始化邮箱信息
  $scope.loginAccount = items.loginAccount;
  $scope.email = items.email;
  $scope.oldEmail = items.email;

  //验证邮箱
  var validateMailBox = function() {
    var mailReg = /^([0-9A-Za-z\-_\.]+)@([0-9a-z]+\.[a-z]{2,3}(\.[a-z]{2})?)$/;
    if (!mailReg.test($scope.email)) {
      $scope.emailErrorMessage = $scope.CONSTANT.messageEmailRegError;
      $("[name='email']").focus();
      return false;
    }
    return true;
  }

  //发送邮件绑定新邮箱
  $scope.sendEmailToActive = function() {
    //验证邮箱
    if (validateMailBox()) {
      $scope.toUser = $scope.oldEmail || $scope.email; //修改绑定邮箱，发送至老邮箱；新绑邮箱，发送至新邮箱
      //发送邮件
      $scope.mailBindingService({
        "loginAccount": $scope.loginAccount,
        "toUser": $scope.toUser,
        "newBindEmail": $scope.email
      }).success(function(result) {
        //请求成功
        if (result.code == LoginConfig.commonConStant.SUCCESS) {
          $modalInstance.close();
          $scope.sendSuccess();
        } else {
          $rootScope.toaster(level, title, $scope.CONSTANT.messageEmailBindError);
        }
      });
    }
  };
  //打开发送邮件成功页面
  $scope.sendSuccess = function(size) {
    $modal.open({
      templateUrl: 'views/pages/personal/go_mailbox.html',
      controller: 'SendEmailSuccessCtrl',
      size: size,
      resolve: {
        items: function() {
          return {
            email: $scope.toUser
          }
        }
      }
    });
  };
  //点击取消
  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };

});

//绑定邮箱成功
angular.module('sbAdminApp').controller('SendEmailSuccessCtrl', function($scope, $modalInstance, items) {
  $scope.email = items.email;
  //打开邮箱
  $scope.openEmail = function() {
    var address = "http://mail." + $scope.email.split('@')[1];
    window.open(address, '_blank');
  };
  //取消
  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
});

//修改密码
angular.module('sbAdminApp').controller('EditPasswordCtrl', function($scope, $modalInstance, $state, LoginService, LoginConfig, $log, items,toaster) {
  //修改密码Service
  $scope.editPasswordService = LoginService.editPassword;
  
  var level = "error";
  var title = "错误";
  //定义常量
  $scope.CONSTANT = {
    "messagePassword": "密码不能为空",
    "messageNewPassword": "密码不能为空",
    "messageRepeatPassword": "请您输入确认密码",
    "messagePasswordLength": "请您设置6~16位密码",
    "messagePasswordValidate": "密码必须包含字母和数字",
    "messageRepeatPasswordDif": "确认密码与密码输入不一致，请您重新输入",
    "messageAccountNotExist": "账号不存在",
    "messageOldPasswordError": "旧密码错误",
    "messageEditSuccess": "修改成功",
    "messagePassEditError":"密码修改失败"
  };
  //验证密码输入
  var validatePassword = function() {
    $scope.oldPassErrorMessage = "";
    $scope.newPassErrorMessage = "";
    $scope.confirmPassErrorMessage = "";

    //旧密码
    if (!$scope.password) {
      $scope.oldPassErrorMessage = $scope.CONSTANT.messagePassword;
      $("[name='password']").focus();
      return false;
    }
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
  }

  //修改密码
  $scope.editPassword = function() {
    if (validatePassword()) {
      $scope.editPasswordService({
        "id": items.id,
        "oldPassword": $scope.password,
        "newPassword": $scope.newPassword
      }).success(function(result) {
        //成功
        if (result.code == LoginConfig.commonConStant.SUCCESS) {
          $modalInstance.close();
        } else if (result.code == LoginConfig.loginConStant.loginErrorCode.LOGIN_PASSWD_FAILURE) {
          $scope.oldPassErrorMessage = $scope.CONSTANT.messageOldPasswordError;
          $("[name='password']").focus();
        } else {
          $rootScope.toaster(level, title, $scope.CONSTANT.messagePassEditError);
        }
      });
    }
  };
  //点击取消
  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
});