var app = angular.module('sbAdminApp');

app.filter('id2Text', function() {
  return function(id,data,value) {
    var result = _.find(data, function (v) {
      return (id+"" == v.id+"")
    });
    return result? result[value]:""
  }
});

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

angular.module('sbAdminApp').controller('injuryInfoFillCtrl', function (LoginService,Upload,AdjustConfig,AdminConstant,$location,$scope, $stateParams, $state, $http, $log, PoliceConfig, PoliceService, DictionaryConfig, toaster, $filter,IdentityService,$rootScope) {

  //重置保存，完成鉴定，完成补录等按钮状态
  $rootScope.isInspectReported = false;
  $rootScope.isIdentify = false;
  $rootScope.isSupplement = false;
  $rootScope.isReported = false;
  $rootScope.isInjury = false;

  $scope.co = {
    defaultImg: "views/images/_r2_c2.png",
    defaultImg2: "views/images/7.png",
    defaultImg3: "views/images/6.png",
    stateParams: $stateParams,
    parseISO8601: function parseISO8601(dateStringInRange) {
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
    },
    policeList: '0'
  };

  var CONTANT = {
    success: 'success',
    error: 'error',
    warn: 'warn',
    sucTxt: '成功',
    errTxt: '错误',
    warnTxt: '警告'
  };

  $scope.police = {
    ijuryPersonInfo: {},
    indMedInfo: {}
  };

  //上传申请人图片功能
  $scope.imageAddress = AdjustConfig.pictureConstant.smallPictureUrl;

  $scope.stateParams = $stateParams;

  console.log($scope.co.stateParams);
  console.log($stateParams)

  //数据有效性
  $scope.dataValid = function () {
    if($scope.co.stateParams.flag != 'injuryInfoSupplement') {
      var v = $scope.police.ijuryPersonInfo;
      if(!v.userName) {
        v.userNameError = true;
        $rootScope.toaster(CONTANT.error, CONTANT.errTxt, '请输入姓名！');
        return false;
      } else v.userNameError = undefined;
      if(!v.sex && v.sex != '0') {
        v.sexError = true;
        $rootScope.toaster(CONTANT.error, CONTANT.errTxt, '请选择性别！');
        return false;
      } else v.sexError = undefined;
      if(!v.personCard) {
        v.personCardError = true;
        $rootScope.toaster(CONTANT.error, CONTANT.errTxt, '请输入身份证号！');
        return false;
      } else if(!$scope.checkIdentity(v)) {
        return false;
      } else v.personCardError = undefined;
      if(!v.age) {
        v.ageError = true;
        $rootScope.toaster(CONTANT.error, CONTANT.errTxt, '请输入年龄！');
        return false;
      } else v.ageError = undefined;
      if(!v.placeDomicile) {
        v.placeDomicileError = true;
        $rootScope.toaster(CONTANT.error, CONTANT.errTxt, '请输入户籍地！');
        return false;
      } else v.placeDomicileError = undefined;
      if(!v.address) {
        v.addressError = true;
        $rootScope.toaster(CONTANT.error, CONTANT.errTxt, '请输入实际居住地！');
        return false;
      } else v.addressError = undefined;
    }
    var x = $scope.police.indMedInfo;
    if(!x.sendDate && $scope.co.stateParams.flag != 'injuryInfoFill') {
      x.sendDateError = true;
      $rootScope.toaster(CONTANT.error, CONTANT.errTxt, '请选择反馈时间！');
      return false;
    } else x.sendDateError = undefined;
    if(!x.indPastMuster) {
      x.indPastMusterError = true;
      $rootScope.toaster(CONTANT.error, CONTANT.errTxt, '请选择是否符合工伤要求！');
      return false;
    } else x.indPastMusterError = undefined;
    if(!x.medPastMuster) {
      x.medPastMusterError = true;
      $rootScope.toaster(CONTANT.error, CONTANT.errTxt, '请选择是否符合医保要求！');
      return false;
    } else x.medPastMusterError = undefined;
    return true;
  };

  //格式化数据
  $scope.formatData = function () {
    var v = $scope.police.indMedInfo;
    if(v.indRegisterTime) v.indRegisterTime = $filter('date')(v.indRegisterTime, 'yyyy-MM-dd HH:mm:ss');
    if(v.medRegisterTime) v.medRegisterTime = $filter('date')(v.medRegisterTime, 'yyyy-MM-dd HH:mm:ss');
    if(v.sendDate) v.sendDate = $filter('date')(v.sendDate, 'yyyy-MM-dd HH:mm:ss');
  };
  $scope.formatData2 = function () {
    var v = $scope.police.indMedInfo;
    if(v.indRegisterTime) v.indRegisterTime = $scope.co.parseISO8601(v.indRegisterTime);
    if(v.medRegisterTime) v.medRegisterTime = $scope.co.parseISO8601(v.medRegisterTime);
    if(v.sendDate) v.sendDate = $scope.co.parseISO8601(v.sendDate);
  };
  console.log($stateParams)
  //查询用户数据 - 关联用户
  $scope.queryIjurySearch = function () {
    PoliceService.queryIjurySearch({id: $stateParams.userId}).success(function (response) {
      if(response.code == PoliceConfig.commonConstant.SUCCESS) {
        $scope.police = response.result;
        //格式化数据
        $scope.formatData2();
        console.log(response)
      } else {
        $rootScope.toaster(CONTANT.error, CONTANT.errTxt, response.message);
      }
    });
  };

  //查询用户数据
  $scope.queryDepById = function (person) {
    PoliceService.queryDepById({id: $stateParams.id, type: 'Ind', person: person}).success(function (response) {
      if(response.code == PoliceConfig.commonConstant.SUCCESS) {
        $scope.police = response.result;
        if($scope.police.indMedInfo.sendType=='2') $rootScope.isInjury = true;
        else $rootScope.isInjury = false;
        //格式化数据
        $scope.formatData2();
        console.log(response)
      } else {
        $rootScope.toaster(CONTANT.error, CONTANT.errTxt, response.message);
      }
    });
  };

  //信息填报保存
  $scope.$on('addIjury', function (event, type) {
    //判断数据有效性
    if(!$scope.dataValid()) {
      return false;
    }
    var message = "保存成功！";
    //格式化日期数据
    $scope.formatData();
    if(type) {
      //完成补录信息
      $scope.police.indMedInfo.sendType='2';
      message = "完成补录成功！";
      $rootScope.isInjury = true;
    }
    //添加工伤医保部门信息
    if($stateParams.flag == 'injuryInfoFill' && !$stateParams.id && !$stateParams.userId) {
      $scope.police.indMedInfo.indInjuryDepartment = $scope.userDepart.orgId;
      $scope.police.indMedInfo.indInjuryDep = $scope.userDepart.orgName;
      $scope.police.indMedInfo.medInsuranceDepartment = $scope.userDepart.orgId;
      $scope.police.indMedInfo.medInsuranceDep = $scope.userDepart.orgName;
    }

    PoliceService.addIjury(JSON.stringify($scope.police)).success(function (response) {
      if(response.code == PoliceConfig.commonConstant.SUCCESS) {
        $scope.police = response.result;
        $scope.police.indMedInfo.sendDate = $scope.co.parseISO8601($scope.police.indMedInfo.sendDate);
        $rootScope.toaster(CONTANT.success, CONTANT.sucTxt, message);
      } else {
        $rootScope.toaster(CONTANT.error, CONTANT.errTxt, response.message);
      }
    });
  });

  //初始化
  $scope.initData = function () {
    //获取用户信息
    $scope.userDepart = $scope.user.sysUser.userDepartList[$scope.user.sysUser.currentOrg];
    console.log($scope.userDepart)
    console.log($stateParams)
    //关联伤者
    if($stateParams.userId || $stateParams.userId == '0') {
      $scope.queryIjurySearch();
    }
    //信息填报详情
    if($stateParams.flag == 'injuryInfoFill' && ($stateParams.id || $stateParams.id == '0')) {
      $scope.queryDepById('HEAL');
    }
    //信息补录
    if($stateParams.flag == 'injuryInfoSupplement' && ($stateParams.id || $stateParams.id == '0')) {
      $scope.queryDepById('POLICE');
    }

    //请求下拉数据字典
    //检测鉴定机构
    PoliceService.queryRelationOrgList({}).success(function (response) {
      if(response.code == PoliceConfig.commonConstant.SUCCESS) {
        //#01 法院 #02 调解机构  #03 鉴定 #04 保险公司 #05 公安交警 #06 医院 #07 医保
        $scope.appraisalMechanismList = response.result;
      } else {
        $rootScope.toaster(CONTANT.error, CONTANT.errTxt, response.message)
      }
    });
  };

  $scope.initPage = function () {
    LoginService.queryUserInfo().success(function(result) {
      if (result.result) {
        //用户赋值
        $scope.user = result.result;
        $scope.initData();
      }
    })
  };

  //初始化
  $scope.initPage();


  /////////////////////////时间选择器///////////////////////////////
  //反馈时间
  $scope.openSendDate1 = function($event, target) {
    $event.preventDefault();
    $event.stopPropagation();
    target.sendDate1IsOpen = true;
  };
  $scope.openSendDate2 = function($event, target) {
    $event.preventDefault();
    $event.stopPropagation();
    target.sendDate2IsOpen = true;
  };

  /////////////////////////验证身份证///////////////////////////////
  $scope.checkIdentity = function(applicant, isAgent) {
    var wi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1]; // 加权因子
    var valideCode = [1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2]; // 身份证验证位值.10代表X
    function isTrueValidateCodeBy18IdCard(idCard) {

      var idCardArray = [];
      for (var i = 0; i <= 17; i++) {
        var char = idCard.charAt(i);
        if(idCard.charAt(i).toUpperCase() == 'X'){
          char = 10;// 将最后位为x的验证码替换为10方便后续操作
        }
        idCardArray.push(parseInt(char));
      }

      var sum = 0; // 声明加权求和变量
      for (var i = 0; i < 17; i++) {
        sum += wi[i] * idCardArray[i]; // 加权求和
      }
      var valCodePosition = sum % 11; // 得到验证码所位置
      return idCardArray[17] == valideCode[valCodePosition];
    }
    if (applicant.personCard) {
      applicant.personCard = applicant.personCard.replace(/ /g, "");
      if (applicant.personCard.length == 15) {
        var year = applicant.personCard.substring(6, 8);
        var month = applicant.personCard.substring(8, 10);
        var day = applicant.personCard.substring(10, 12);
        var tempDate = new Date(year, parseFloat(month) - 1, parseFloat(day));
        if (tempDate.getYear() == parseFloat(year) && tempDate.getMonth() == parseFloat(month) - 1 && tempDate.getDate() == parseFloat(day)) {
          //applicant.birthDay = tempDate;
          applicant.sex = applicant.personCard.substring(14, 15) % 2 == 0 ? '1' : '0';
          applicant.personCardError = false;
        } else {
          applicant.personCardError = true;
          $rootScope.toaster(CONTANT.error, CONTANT.errTxt, '身份证号格式有误！');
          return false;
        }
      } else if (applicant.personCard.length == 18 && isTrueValidateCodeBy18IdCard(applicant.personCard)) {
        var year = applicant.personCard.substring(6, 10);
        var month = applicant.personCard.substring(10, 12);
        var day = applicant.personCard.substring(12, 14);
        var tempDate = new Date(year, parseFloat(month) - 1, parseFloat(day));
        if (tempDate.getFullYear() == parseFloat(year) && tempDate.getMonth() == parseFloat(month) - 1 && tempDate.getDate() == parseFloat(day)) {
          //applicant.birthDay = tempDate;
          applicant.sex = applicant.personCard.substring(16, 17) % 2 == 0 ? '1' : '0';
          applicant.personCardError = false;
        } else {
          applicant.personCardError = true;
          $rootScope.toaster(CONTANT.error, CONTANT.errTxt, '身份证号格式有误！');
          return false;
        }
      } else {
        //校验香港身份证规则
        var taiwanreg = /^[A-Z][0-9]{9}$/;
        //校验台湾身份证规则
        var xianggangreg = /^[A-Z][0-9]{6}\([0-9A-Z]\)$/;
        var xianggangreg1 = /^[A-Z][0-9]{6}\（[0-9A-Z]\）$/;
        //校验澳门身份证规则
        var aomenreg = /^[157][0-9]{6}\([0-9]\)$/;
        var aomenreg1 = /^[157][0-9]{6}\（[0-9]\）$/;
        if (!(taiwanreg.test(applicant.personCard) || xianggangreg.test(applicant.personCard) || xianggangreg1.test(applicant.personCard) || aomenreg.test(applicant.personCard) || aomenreg1.test(applicant.personCard))) {
          applicant.personCardError = true;
          $rootScope.toaster(CONTANT.error, CONTANT.errTxt, '身份证号格式有误！');
          return false;
        } else applicant.personCardError = false;
      }
    }
    return true;
  };

  /////////////////////////上传文件/////////////////////////////////
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
  //限制图片大小
  function imageSize(file) {
    if(file){
      if(parseInt(file.size/(1024*1024))>= 10 ){
        $rootScope.toaster(level.warn, "提示","请上传小于10M大小的图片");
      }
    }
  }

  //添加文件
  $scope.addEvidence = function(files, obj, type) {
    if(!files) return;
    if(type) files = [files];
    if (files.length) {
      for (var i = 0; i < files.length; i++) {
        imageSize(files[i]);
        var fileName = files[i].name.substring(0,files[i].name.lastIndexOf('.'));
        type? $scope.uploadPicture(fileName,files[i],files.length,obj,type) : $scope.uploadPicture(fileName,files[i],files.length,obj,'');
      }
    }
  };
  //遮罩层 - 图片上传期间出现
  $scope.fileUploading = false;
  //上传图片
  $scope.uploadPicture = function(fileName,file,length,obj,type){
    if(!file){
      $rootScope.toaster(level.warn, title.warn, $scope.CONSTANT.messagePictrueTypeError);
      return;
    }
    //var type = file.name.split('.')[1];
    //if(type == 'jpg'|| type == 'png'){
    if(!type) {
      var evidence = new $scope.co.Evidence("");
      obj.enclosureInfoList.unshift(evidence);
    }
    //}
    $scope.fileUploading = true;
    Upload.upload({
      url: AdjustConfig.pictureConstant.policeUploadImgUrl,
      data: {
        file: file,
        type: type? '0':'1'
      }
    }).progress(function (evt) {
      //进度条
      if(!type) evidence.progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
    }).success(function(resp) {
      console.log(resp);
      switch (type) {
        case 'face': obj.identityCardApic = resp.result.path; break;
        case 'back': obj.identityCardBpic = resp.result.path; break;
      }
      if (type == 'face') { //身份证正面照，解析
        $http({
          method: 'post',
          url: '/lawProject/common/cardDisc',
          data: {
            "path": resp.result.path,
            "type": "applicant"
          }
        }).success(function(res) {
          if (res.code == AdjustConfig.commonConStant.SUCCESS && res.result) {
            obj.userName = res.result.name;
            obj.personCard = res.result.code;
            obj.sex = res.result.sex == '男' ? 1 : 0;
            obj.age = $scope.GetAge(res.result.code);
            obj.placeDomicile = res.result.addr;
          } else if (res.code == AdjustConfig.commonConStant.FAILURE) {
            $rootScope.toaster(CONTANT.error, CONTANT.errTxt, "身份证识别失败!");
          }
        })
      }
      $scope.fileUploading = false;
      if(!type) {
        console.log(evidence)
        evidence.id = resp.result.id;
        evidence.oldname = resp.result.oldname;
        evidence.path = resp.result.path;
        evidence.fileType = resp.result.fileType;
        evidence.isChecked = false; //设置默认不选中样式
      }
    }).error(function (data, status, headers, config) {
      console.log('error status: ' + data);
      $scope.fileUploading = false;
    });
  };

  //文件选择
  $scope.handleEnclosure = function (enclosureInfo, list, obj) {
    enclosureInfo.isChecked = !enclosureInfo.isChecked;
    //获取已选择的个数
    obj.enclosureArr = _.filter(list, function(v) {
      return v.isChecked
    });
    //当全部选中时，勾选全选框
    if(obj.enclosureArr.length == list.length) {
      obj.isAllChecked = true;
    } else {
      obj.isAllChecked = false;
    }
  };

  //全选
  $scope.handleAllChecked = function (event, list, obj) {
    if($(event.target).prop('checked')){
      //全选
      _.each(list, function (v) {
        v.isChecked = true;
      })
    } else {
      //全不选
      _.each(list, function (v) {
        v.isChecked = false;
      })
    }
    //获取已选择的个数
    obj.enclosureArr = _.filter(list, function(v) {
      return v.isChecked
    })
  };

  //删除文件
  $scope.deleteEnclosure = function (obj) {
    if(confirm('确认删除所选文件？')) {
      var newEnclosureInfoList = angular.copy(obj.enclosureInfoList);
      //从前端删除所选文件
      function deleteFromThisLocality() {
        obj.enclosureInfoList.length = 0;
        _.each(newEnclosureInfoList, function (v) {
          if(!v.isChecked) obj.enclosureInfoList.push(v);
        });
        $rootScope.toaster(CONTANT.success, CONTANT.sucTxt, '删除成功！')
      }

      var idArr = [];
      _.each(newEnclosureInfoList, function (v) {
        if(v.id && v.isChecked) idArr.push(v.id);
      });
      //请求后台，删除文件
      PoliceService.deleteBatchFile({ids: idArr}).success(function (response) {
        if(response.code == PoliceConfig.commonConstant.SUCCESS) {
          console.log(response);
          deleteFromThisLocality();
        } else {
          $rootScope.toaster(CONTANT.error, CONTANT.errTxt, response.message)
        }
      })
    }
  };

  //删除证件照
  $scope.removeApplicantImage = function (person, type, attr) {
    if(window.confirm('确认删除该证件照？')) {
      var path = person[attr];
      PoliceService.deleCard({id: person.id, path: path, type: type}).success(function (response) {
        if(response.code == PoliceConfig.commonConstant.SUCCESS) {
          person[attr] = '';
          $rootScope.toaster(CONTANT.success, CONTANT.sucTxt, '删除成功！');
        } else {
          $rootScope.toaster(CONTANT.error, CONTANT.errTxt, response.message);
        }
      });
    }
  };

});