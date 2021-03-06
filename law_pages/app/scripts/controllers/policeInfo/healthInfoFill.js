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

angular.module('sbAdminApp').controller('healthInfoFillCtrl', function (LawConfig,LoginService, AdjustConfig,AdminConstant,$location,$scope, Upload,$stateParams, $state, $http, $log, PoliceConfig, PoliceService, DictionaryConfig, toaster, $filter,IdentityService,$rootScope) {

  //重置保存，完成鉴定，完成补录等按钮状态
  $rootScope.isInspectReported = false;
  $rootScope.isIdentify = false;
  $rootScope.isSupplement = false;
  $rootScope.isReported = false;
  $rootScope.isInjury = false;

  //就医医院
  $scope.hospitalPlaceList = DictionaryConfig.hospitalPlaceList;


  var queryDictionaries = function () {
      //检测鉴定机构，计生委
      LoginService.querySysOrgByName({
          'category':'#06'
      }).success(function (response) { //#01 法院 #02 调解机构  #03 鉴定 #04 保险公司 #05 公安交警 #06 医院 #07 医保
          if(response.code == PoliceConfig.commonConstant.SUCCESS) {
              $scope.orgList = response.result;


              $scope.orgInfo = _.find($scope.orgList,{id:$scope.police.healthDepartmentInfo.hospitalId});
              if($scope.orgInfo){
                $scope.hospitalValue = $scope.orgInfo.text;
              }
              console.info($scope.hospitalValue);


          } else {
              $rootScope.toaster(CONTANT.error, CONTANT.errTxt, response.message)
          }
      });
  };

  $scope.co = {
    defaultImg: "views/images/_r2_c2.png",
    defaultImg2: "views/images/7.png",
    defaultImg3: "views/images/6.png",
    stateParams: $stateParams,
    Evidence: function(picture) {
      this.path = '';
      this.oldname = '';
      this.delFlag = 0;
    },
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
    }
  };
  console.log($stateParams)

  var CONTANT = {
    success: 'success',
    error: 'error',
    warn: 'warn',
    sucTxt: '成功',
    errTxt: '错误',
    warnTxt: '警告'
  };

  $scope.police = {
    healthDepartmentInfo: {
      enclosureInfoList: []
    },
    hospitalPersonInfo: {}
  };

  console.log($scope.co.stateParams);

  //上传申请人图片功能
  $scope.imageAddress = AdjustConfig.pictureConstant.smallPictureUrl;
  $scope.stateParams = $stateParams;

  //查询用户数据 - 关联用户
  $scope.queryRelPerPage = function () {
    PoliceService.queryRelPerPage({id: $stateParams.userId, tableName: $stateParams.tableName}).success(function (response) {
      if(response.code == PoliceConfig.commonConstant.SUCCESS) {
        $scope.police = response.result;
        console.log(response)
      } else {
        $rootScope.toaster(CONTANT.error, CONTANT.errTxt, response.message);
      }
    });
  };

  //查询用户数据
  $scope.queryDepById = function (person) {
    PoliceService.queryDepById({id: $stateParams.id, type: 'Hosp', person: person}).success(function (response) {
      if(response.code == PoliceConfig.commonConstant.SUCCESS) {
        $scope.police = response.result;
        if($scope.police.healthDepartmentInfo.sendType >= '2') $rootScope.isSupplement = true;
        else $rootScope.isSupplement = false;
        //格式化时间数据
        $scope.formatDate2();
        console.log(response);

          queryDictionaries();
      } else {
        $rootScope.toaster(CONTANT.error, CONTANT.errTxt, response.message);
      }
    });
  };

  //信息填报保存
  $scope.$on('addHosp', function (event, type) {
    //验证数据
    if(!$scope.dataValidity()) {
      return;
    }
    var message = "保存成功！";
    if(type) {
      message = "完成补录成功！";
      $scope.police.healthDepartmentInfo.sendType = '2';
      $rootScope.isSupplement = true;
    }
    //格式化时间数据
    $scope.formatDate();
    //添加医院数据
    if($stateParams.flag == 'healthInfoFill' && !$stateParams.id && !$stateParams.userId) {
      $scope.police.healthDepartmentInfo.hospitalId = $scope.userDepart.orgId;
      $scope.police.healthDepartmentInfo.hospital = $scope.userDepart.orgName;
    }
    PoliceService.addHosp(JSON.stringify($scope.police)).success(function (response) {
      if(response.code == PoliceConfig.commonConstant.SUCCESS) {
        $scope.police = response.result;
        //格式化时间
        if($scope.police.healthDepartmentInfo.beHospitTime) $scope.police.healthDepartmentInfo.beHospitTime = $scope.co.parseISO8601($scope.police.healthDepartmentInfo.beHospitTime);
        if($scope.police.healthDepartmentInfo.outHospitTime) $scope.police.healthDepartmentInfo.outHospitTime = $scope.co.parseISO8601($scope.police.healthDepartmentInfo.outHospitTime);
        $rootScope.toaster(CONTANT.success, CONTANT.sucTxt, message);
      } else {
        $rootScope.toaster(CONTANT.error, CONTANT.errTxt, response.message);
      }
    })
  });

  //格式化时间数据
  $scope.formatDate = function () {
    if($scope.police.healthDepartmentInfo) {
      var v = $scope.police.healthDepartmentInfo;
      if(v.beHospitTime) v.beHospitTime = $filter('date')(v.beHospitTime, 'yyyy-MM-dd HH:mm:ss');
      if(v.outHospitTime) v.outHospitTime = $filter('date')(v.outHospitTime, 'yyyy-MM-dd HH:mm:ss');
    }
  };

  //格式化时间
  $scope.formatDate2 = function () {
    if($scope.police.healthDepartmentInfo) {
      var v = $scope.police.healthDepartmentInfo;
      if(v.beHospitTime) v.beHospitTime = $scope.co.parseISO8601(v.beHospitTime);
      if(v.outHospitTime) v.outHospitTime = $scope.co.parseISO8601(v.outHospitTime);
    }
  };

  //验证数据有效性
  $scope.dataValidity = function () {
    if($stateParams.flag == 'healthInfoFill') {
        var v = $scope.police.hospitalPersonInfo;
        if (!v.userName) {
            v.userNameError = true;
            $rootScope.toaster(CONTANT.error, CONTANT.errTxt, '请输入姓名！');
            return false;
        } else v.userNameError = undefined;
        if (!v.sex && v.sex != '0') {
            v.sexError = true;
            $rootScope.toaster(CONTANT.error, CONTANT.errTxt, '请选择性别！');
            return false;
        } else v.sexError = undefined;
        if (!v.personCard) {
            v.personCardError = true;
            $rootScope.toaster(CONTANT.error, CONTANT.errTxt, '请输入身份证号！');
            return false;
        } else if(!$scope.checkIdentity(v)) {
          return false;
        } else v.personCardError = undefined;
        if (!v.age) {
            v.ageError = true;
            $rootScope.toaster(CONTANT.error, CONTANT.errTxt, '请输入年龄！');
            return false;
        } else v.ageError = undefined;
        if (!v.placeDomicile) {
            v.placeDomicileError = true;
            $rootScope.toaster(CONTANT.error, CONTANT.errTxt, '请输入户籍地！');
            return false;
        } else v.placeDomicileError = undefined;
        if (!v.address) {
            v.addressError = true;
            $rootScope.toaster(CONTANT.error, CONTANT.errTxt, '请输入实际居住地！');
            return false;
        } else v.addressError = undefined;
    }
    var x = $scope.police.healthDepartmentInfo;
    if(!x.department) {
        x.departmentError = true;
        $rootScope.toaster(CONTANT.error, CONTANT.errTxt, '请输入科室！');
        return false;
    } else x.departmentError = undefined;
    if(!x.roomNumber) {
        x.roomNumberError = true;
        $rootScope.toaster(CONTANT.error, CONTANT.errTxt, '请输入病房号！');
        return false;
    } else x.roomNumberError = undefined;
    if(!x.attendingDoctor) {
        x.attendingDoctorError = true;
        $rootScope.toaster(CONTANT.error, CONTANT.errTxt, '请输入主治医师！');
        return false;
    } else x.attendingDoctorError = undefined;
    if(!x.hospitalization && x.hospitalization != '0') {
        x.hospitalizationError = true;
        $rootScope.toaster(CONTANT.error, CONTANT.errTxt, '请选择是否住院！');
        return false;
    } else x.hospitalizationError = undefined;
    if(x.hospitalization == '1' && !x.beHospitTime) {
        x.beHospitTimeError = true;
        $rootScope.toaster(CONTANT.error, CONTANT.errTxt, '请选择入院时间！');
        return false;
    } else x.beHospitTimeError = undefined;
    return true;
  };

  //初始化
  $scope.initData = function () {
    //获取用户信息
    $scope.userDepart = $scope.user.sysUser.userDepartList[$scope.user.sysUser.currentOrg];
    //区分方式 关联有userId 填报有id 且flag是healthInfoFill 交警传来的补录案件有id 并且flag是healthInfoSupplement 新增 没有id
    //关联伤者
    console.log($stateParams)
    if($stateParams.userId || $stateParams.userId == '0') {
      $scope.queryRelPerPage();
    }
    //信息填报
    if($stateParams.flag == 'healthInfoFill' && ($stateParams.id || $stateParams.id == '0')) {
      $scope.queryDepById('HEAL');
    }
    //信息补录
    if($stateParams.flag == 'healthInfoSupplement' && ($stateParams.id ||$stateParams.id == '0')) {
      $scope.queryDepById('POLICE');
    }
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
          applicant.sex = applicant.personCard.substring(14, 15) % 2 == 0 ? '0' : '1';
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
          applicant.sex = applicant.personCard.substring(16, 17) % 2 == 0 ? '0' : '1';
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

  /////////////////////////时间选择器///////////////////////////////
  //入院时间
  $scope.openBeHospitTime = function($event, target) {
    $event.preventDefault();
    $event.stopPropagation();
    target.beHospitTimeIsOpen = true;
  };
  //出院时间
  $scope.openHealthDepartment = function($event, target) {
    $event.preventDefault();
    $event.stopPropagation();
    target.outHospitTimeIsOpen = true;
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

  //下载文件
  $scope.downloadFile = function (file) {
      window.location.href=PoliceConfig.policeConstant.policeUploadUrl+'?id='+file.id;
    //return PoliceConfig.policeConstant.policeUploadUrl+'?id='+file.id;
  }
});