var app = angular.module('sbAdminApp');

app.filter('filterRegions', function () {
  return function (arr) {
    return arr.filter(function (v) {
      return v.level != 4;
    })
  }
});
app.filter('certificatesTypeToText', function() {
  return function(id,data) {
    var result = _.find(data, {
      id: id
    });
    return result ? result.value:""
  }
});
app.filter('id2Text', function() {
  return function(id,data) {
    var result = _.find(data, {
      id: id+""
    });
    return result? result.value:""
  }
});
app.filter('stringSpace', function() {
  return function(str) {
    if(str)
    {
      str = str.replace(/\s/gi,"+");
    }
    return str && str;
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
app.filter('isWounded', function () {
  return function(list) {
    var arr = _.filter(list, function (v) {
      return v.policePersonInformation.isWounded == '0'
    })
    return arr;
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

angular.module('sbAdminApp').controller('policeInfoCtrl', function ($timeout,LoginService,AdminConstant,AdjustConfig,accidentCauseRemarConstant,$location,$scope, $stateParams, $state, $http, $log, PoliceConfig, PoliceService, DictionaryConfig, toaster, $filter,IdentityService,$rootScope) {

  //重置保存，完成鉴定，完成补录等按钮状态
  $rootScope.isInspectReported = false;
  $rootScope.isIdentify = false;
  $rootScope.isSupplement = false;
  $rootScope.isReported = false;
  $rootScope.isInjury = false;

  //是否高速
  $scope.highSpeedList = PoliceConfig.highSpeedList;
  //事故类型
  $scope.accidentTypeList = PoliceConfig.accidentTypeList;
  //现场形态
  $scope.sceneList = PoliceConfig.sceneList;
  //事故认定原因 - 含有9开头的数据
  $scope.accidentCauseRemarkList = accidentCauseRemarConstant.accidentCauseRemarkList;
  //违法行为 - 不含9开头的数据
  //$scope.unlawfulActList = PoliceConfig.unlawfulActList;
  $scope.unlawfulActList = accidentCauseRemarConstant.accidentCauseRemarkList;
  //交通方式
  $scope.trafficTypeList = PoliceConfig.trafficTypeList;
  //准驾车型
  $scope.drivingList = PoliceConfig.drivingList;
  //事故责任
  $scope.accidentLiabilityList = PoliceConfig.accidentLiabilityList;
  //伤害程度
  $scope.hurtList = PoliceConfig.hurtList;
  //恶劣情节
  $scope.abominablePlotList = PoliceConfig.abominablePlotList;
  //驾驶证
  $scope.drivingLicenceList = PoliceConfig.drivingLicenceList;
  //投保险种
  $scope.riskTypesList = PoliceConfig.riskTypesList;
  //保险公司
  $scope.insuranceList = PoliceConfig.insuranceList;
  //检测鉴定类型
  $scope.policeAppraisalType = PoliceConfig.policeAppraisalType;
  //车辆类型
  $scope.vehicleTypeList = PoliceConfig.vehicleTypeList;
  //号牌种类
  $scope.plateTypeList = PoliceConfig.plateTypeList;
  //号牌区域数组
  $scope.palteNo1List = PoliceConfig.palteNo1List;
  //号牌字符数组
  $scope.palteNo2List = PoliceConfig.palteNo1List;
  //车辆损失
  $scope.vehicleLossList = PoliceConfig.vehicleLossList;
  //号牌号码
  $scope.palteNoList = PoliceConfig.palteNoList;
  //计生委
  $scope.hospitalList = [];
  //发送状态
  $scope.sendTypeList = PoliceConfig.sendTypeList;

  $scope.sendHeTypeList = PoliceConfig.sendHeTypeList;
  //工伤主管部门
  $scope.indInjuryDepartmentList = [];
  //医院主管部门
  $scope.medInsuranceDepartmentList = [];
  //天气列表
  $scope.weatherList = DictionaryConfig.weatherList;
  //就医医院
  $scope.hospitalPlaceList = DictionaryConfig.hospitalPlaceList;


  //上传申请人图片功能
  $scope.imageAddress = AdjustConfig.pictureConstant.smallPictureUrl;

  var CONTANT = {
    success: 'success',
    error: 'error',
    warn: 'warn',
    sucTxt: '成功',
    errTxt: '错误',
    warnTxt: '警告'
  };

  $scope.co = {
    stateParams: $stateParams.flag,
    stateParamsId: $stateParams.id,
    tabFlag: 'case',
    userRegName1: '', //车牌号默认选中城市
    userRegName2: '', //车牌号默认选中字母
    pagesChoose: 'environment', //tab3 左侧菜单切换
    defaultImg: "views/images/_r2_c2.png",
    defaultImg2: "views/images/7.png",
    defaultImg3: "views/images/6.png",
    isCorrelation: $stateParams.tableName,
    pagesChoose: 'environment',
    addAppraisalInfo: function (isAppraisal) {
      if(isAppraisal) {
        if($scope.police.appraisalInfoList.length == 0) $scope.police.appraisalInfoList.push(new AppraisalInfo());
      } else {
        $scope.police.appraisalInfoList.push(new AppraisalInfo());
      }
    },
    deleteAppraisalInfo: function (index) {
      //前端删除
      $scope.police.appraisalInfoList.splice(index, 1);
    },
    addJpoliceVehicVO: function () {
      if(!$scope.police.accidentInfo.id) {
        $rootScope.toaster('error', '错误', '请先填写并保存事故信息!')
        return;
      }
      $scope.police.jpoliceVehicVO.push(new JpoliceVehicVO());
    },
    addVehiclePolicyInfo: function (info, attr) {
      info[attr] = info[attr]? info[attr] : [];
      info[attr].push(new VehiclePolicyInfo());
    },
    deleteVehiclePolicyInfo: function (list, index) {
      list.splice(index, 1);
    },
    deletejpoliceVehicInfo: function (list, index) {
      list.splice(index, 1);
    },
    addVehicleCompany: function (vehicle, id) {
      var riskTypes = id;
      if(id == '2') riskTypes = '1';
      if(id == '3') riskTypes = '2';
      var num = _.filter(vehicle.vehicleCompany, function (v) {
        return v.riskTypes == riskTypes;
      }).length;
      if(!num) vehicle.vehicleCompany.push(new VehicleCompany(riskTypes))
    },
    addIndMedInfo: function (obj) {
      obj.indMedInfo = new IndMedInfo();
    },
    addHealthDepartmentInfo: function (obj) {
      obj.healthDepartmentInfo = new HealthDepartmentInfo();
    },
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
    },
    /////////////////////////验证身份证///////////////////////////////
    checkIdentity: function(applicant, isAgent) {
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
    }
  };

  $scope.police = {
    accidentInfo: {}, //事故信息
    appraisalInfoList: [new AppraisalInfo()], //事故检测鉴定
    jpoliceVehicVO: [{ //当事人信息
      policePersonInformation: {},
      vehiclePolicyInfoList: [{
        vehiclePolicyInfo:{
          riskTypes: '0' //接车信息 默认勾选交强险
        },
        vehicleCompany: [{ //保单信息 riskTypes:0 交强 1：三者 2：车损 -- 初始时，添加一个交强险
            riskTypes: '0',
            sendState: '1'
        }]
      }],
      indMedInfo: {
        sendType: '0'
      },
      healthDepartmentInfo: {
        enclosureInfoList: []
      }
    }]
  };

  //检测鉴定信息构造函数
  function AppraisalInfo() {
    this.appraisalType = '';
    this.appraisalTypeRemark = '';
    this.appraisalMechanism = '';
    this.entrustTime = '';
    this.promiseTime = '';
    this.party = '';
    this.entrustFinishTime = '';
    this.completeTime = '';
    this.enclosureInfoList = []; //检验鉴定报告
    this.appraisalState = '0';  //鉴定状态 0：未发送鉴定委托，1：发送委托鉴定，2:完成鉴定 3:完成委托 4：结果鉴定
  };

  //当事人信息构造函数
  function JpoliceVehicVO() {
    this.policePersonInformation = {};
    this.vehiclePolicyInfoList = [new VehiclePolicyInfo()];
    this.indMedInfo = {
      sendType: '0'
    };
    this.healthDepartmentInfo = {
      enclosureInfoList: []
    };
  }

  //机动车及保单信息构造函数
  function VehiclePolicyInfo() {
    this.vehiclePolicyInfo = {
      riskTypes: '0' //默认勾选交强险
    }; //机动车信息
    this.vehicleCompany = [{
      riskTypes: '0',  //保单信息 riskTypes:0 交强 1：三者 2：车损 -- 初始时，添加一个交强险
      sendState: '1'
    }];
  }

  //工伤信息构造函数
  function IndMedInfo() {
    
  }

  //卫生信息构造函数
  function HealthDepartmentInfo() {
    this.enclosureInfoList = [];
  }
  
  //保险构造函数
  function VehicleCompany(riskTypes) {
    this.riskTypes = riskTypes;
    this.sendState = '1';
  }

  //默认添加对象到数组
  //$scope.police.appraisalInfoList.push(new AppraisalInfo());
  //$scope.police.jpoliceVehicVO.push(new JpoliceVehicVO());
  //$scope.police.jpoliceVehicVO[0].vehiclePolicyInfoList.push(new VehiclePolicyInfo());

  
  //tab切换
  $scope.handleTabFlag = function (type) {
    $scope.co.tabFlag = type;
    $scope.$broadcast('switchTab', type)
  };

  //请求案件信息数据
  var queryPoliceInfo = function () {
    if($stateParams.id) {
      PoliceService.queryAccident({id: $stateParams.id}).success(function (response) {
        if(response.code == PoliceConfig.commonConstant.SUCCESS) {
          console.log(response)
          $scope.police = response.result;
          $scope.police.accidentInfo.accidentNumber = $scope.police.accidentInfo.identiNumber;
          //判断是否存在当事人登记信息
          if($scope.police.jpoliceVehicVO && $scope.police.jpoliceVehicVO.length == 0) {
            $scope.co.addJpoliceVehicVO();
          }
          //格式化数据
          dataFormate();
        } else {
          $rootScope.toaster(CONTANT.error, CONTANT.errTxt, response.message)
        }
      })
    }
  };

  //下载文件
  $scope.downloadFile = function (file) {
      window.location.href=PoliceConfig.policeConstant.policeUploadUrl+'?id='+file.id;
  };
  //多选框点击赋值
  $scope.handleCheckBox = function (event, info, attr, id, vehicle) {
    var obj = {}, arr = [];
    if(info[attr] || info[attr] == '0') {
      arr = info[attr].split(',');
      _.each(arr, function (v) {
        obj['id'+v] = true;
      })
    }

    obj['id'+id] = $(event.target).prop('checked');

    //驾车逃逸与弃车逃逸  酒后驾车与醉酒驾车不可同时选择
    var abominablePlotFilter = [{name: 'abscond', value: ['0', '1']}, {name: 'drunkenness', value: ['2', '3']}];
    abominablePlotFilter.forEach(function (v) {
      if(v.value.indexOf(id) != -1) {
        var exclusionArr = v.value
        exclusionArr.forEach(function (x) {
          if(x != id && obj['id'+x]) { //互斥项存在
            obj['id'+x] = false;
            $('#abominablePlotId'+x).prop('checked', false);
          }
        })
      }
    });

    if(vehicle) {
      //根据所选的内容，添加保险公司
      if (obj['id' + id]) $scope.co.addVehicleCompany(vehicle, id);
      //else $scope.co.deleteVehicleCompany(vehicle, id);

      if (id == '2' && obj['id' + id]) {
        obj['id1'] = true;
      }
      if (id == '1' && !obj['id' + id]) {
        obj['id2'] = false;
      }
    }
    arr.length = 0;
    for(var i in obj) {
      if(obj[i]) arr.push(i.substring(2));
    }
    info[attr] = arr.join(',');

    if(vehicle) {
      //通过选择的险种，为保险公司赔偿率赋值
      if (info[attr].indexOf('2') != -1) { //不计免赔
        _.filter(vehicle.vehicleCompany, {riskTypes: '1'})[0].thirdPartyFranchise = 0;
        _.filter(vehicle.vehicleCompany, {riskTypes: '1'})[0].thirdPartyRate = 100;
      } else if (info[attr].indexOf('1') != -1) { //三者险
        _.filter(vehicle.vehicleCompany, {riskTypes: '1'})[0].thirdPartyFranchise = 30;
        _.filter(vehicle.vehicleCompany, {riskTypes: '1'})[0].thirdPartyRate = 70;
      } else {
        _.filter(vehicle.vehicleCompany, {riskTypes: '2'})[0].vehicleRate = 0;
        _.filter(vehicle.vehicleCompany, {riskTypes: '2'})[0].vehiceFranchise = 0;
      }
    }
  };

  //输入框限制
  $scope.inputVerify = function (info, attr, max, correlationAttr) {
    if(info[attr]*1 > max) info[attr] = max;
    if(correlationAttr) {
      if((info[attr]*1 + info[correlationAttr]*1) > 100) {
        info[attr] = 100 - info[correlationAttr]*1;
      }
    }
  };

  //多选框文字显示
  $scope.riskTypesCheckedFun = function (checked, list) {
    if(!checked) {
      return '';
    }
    var arr = checked.split(',');
    var str = [];
    for(var i = 0; i < arr.length; i++) {
      str.push(list[arr[i]].value);
    }
    return str.join('，');
  };

  //格式数据
  var dataFormate = function () {
    if($scope.police.accidentInfo && $scope.police.accidentInfo.accidentTime) $scope.police.accidentInfo.accidentTime = $filter('date')($scope.police.accidentInfo.accidentTime, 'yyyy-MM-dd HH:mm:ss');
    if($scope.police.accidentInfo && $scope.police.accidentInfo.surveyDate) $scope.police.accidentInfo.surveyDate = $scope.co.parseISO8601($scope.police.accidentInfo.surveyDate);
    if($scope.police.accidentInfo && $scope.police.accidentInfo.surveyDateThree) $scope.police.accidentInfo.surveyDateThree = $scope.co.parseISO8601($scope.police.accidentInfo.surveyDateThree);
    _.each($scope.police.appraisalInfoList, function (v) {
      if(v.entrustTime) v.entrustTime = $scope.co.parseISO8601(v.entrustTime);
      if(v.promiseTime) v.promiseTime = $scope.co.parseISO8601(v.promiseTime);
      if(v.effectiveDate) v.effectiveDate = $scope.co.parseISO8601(v.effectiveDate);
      if(v.entrustFinishTime) v.entrustFinishTime = $scope.co.parseISO8601(v.entrustFinishTime);
      if(v.completeTime) v.completeTime = $scope.co.parseISO8601(v.completeTime);
    });
    _.each($scope.police.jpoliceVehicVO, function (v) {
      //当事人信息
      if(v.policePersonInformation.detainTime) v.policePersonInformation.detainTime = $scope.co.parseISO8601(v.policePersonInformation.detainTime);
      if(v.policePersonInformation.returnTime) v.policePersonInformation.returnTime = $scope.co.parseISO8601(v.policePersonInformation.returnTime);
      //机动车及保单信息
      if(v.vehiclePolicyInfoList) {
        _.each(v.vehiclePolicyInfoList, function (x) {
          if(x.vehiclePolicyInfo.detainDate) x.vehiclePolicyInfo.detainDate = $scope.co.parseISO8601(x.vehiclePolicyInfo.detainDate);
          if(x.vehiclePolicyInfo.returnDate) x.vehiclePolicyInfo.returnDate = $scope.co.parseISO8601(x.vehiclePolicyInfo.returnDate);
        })
      }
      //工伤保险
      if(v.indMedInfo) {
        if(v.indMedInfo.indRegisterTime) v.indMedInfo.indRegisterTime = $scope.co.parseISO8601(v.indMedInfo.indRegisterTime);
        if(v.indMedInfo.medRegisterTime) v.indMedInfo.medRegisterTime = $scope.co.parseISO8601(v.indMedInfo.medRegisterTime);
        if(v.indMedInfo.sendDate) v.indMedInfo.sendDate = $scope.co.parseISO8601(v.indMedInfo.sendDate);
      }
      //卫生部门
      if(v.healthDepartmentInfo) {
        if(v.healthDepartmentInfo.beHospitTime) v.healthDepartmentInfo.beHospitTime = $scope.co.parseISO8601(v.healthDepartmentInfo.beHospitTime);
        if(v.healthDepartmentInfo.outHospitTime) v.healthDepartmentInfo.outHospitTime = $scope.co.parseISO8601(v.healthDepartmentInfo.outHospitTime);
      }
    });
  };
  //格式数据
  var dataFormate2 = function () {
    if($scope.police.accidentInfo && $scope.police.accidentInfo.accidentTime) $scope.police.accidentInfo.accidentTime = $filter('date')($scope.police.accidentInfo.accidentTime, 'yyyy-MM-dd HH:mm:ss');
    if($scope.police.accidentInfo && $scope.police.accidentInfo.surveyDate) $scope.police.accidentInfo.surveyDate = $filter('date')($scope.police.accidentInfo.surveyDate, 'yyyy-MM-dd HH:mm:ss');
    if($scope.police.accidentInfo && $scope.police.accidentInfo.surveyDateThree) $scope.police.accidentInfo.surveyDateThree =  $filter('date')($scope.police.accidentInfo.surveyDateThree, 'yyyy-MM-dd HH:mm:ss');
      _.each($scope.police.appraisalInfoList, function (v) {
      if(v.entrustTime) v.entrustTime = $filter('date')(v.entrustTime, 'yyyy-MM-dd HH:mm:ss');
      if(v.promiseTime) v.promiseTime = $filter('date')(v.promiseTime, 'yyyy-MM-dd HH:mm:ss');
      if(v.effectiveDate) v.effectiveDate = $filter('date')(v.effectiveDate, 'yyyy-MM-dd HH:mm:ss');
      if(v.entrustFinishTime) v.entrustFinishTime = $filter('date')(v.entrustFinishTime, 'yyyy-MM-dd HH:mm:ss');
      if(v.completeTime) v.completeTime = $filter('date')(v.completeTime, 'yyyy-MM-dd HH:mm:ss');
    });
    _.each($scope.police.jpoliceVehicVO, function (v) {
      //当事人信息
      if(v.policePersonInformation.detainTime) v.policePersonInformation.detainTime = $filter('date')(v.policePersonInformation.detainTime, 'yyyy-MM-dd HH:mm:ss');
      if(v.policePersonInformation.returnTime) v.policePersonInformation.returnTime = $filter('date')(v.policePersonInformation.returnTime, 'yyyy-MM-dd HH:mm:ss');
      //机动车及保单信息
      if(v.vehiclePolicyInfoList) {
        _.each(v.vehiclePolicyInfoList, function (x) {
          if(x.vehiclePolicyInfo.detainDate) x.vehiclePolicyInfo.detainDate = $filter('date')(x.vehiclePolicyInfo.detainDate, 'yyyy-MM-dd HH:mm:ss');
          if(x.vehiclePolicyInfo.returnDate) x.vehiclePolicyInfo.returnDate = $filter('date')(x.vehiclePolicyInfo.returnDate, 'yyyy-MM-dd HH:mm:ss');
        })
      }
      //工伤保险
      if(v.indMedInfo) {
        if(v.indMedInfo.indRegisterTime) v.indMedInfo.indRegisterTime = $filter('date')(v.indMedInfo.indRegisterTime, 'yyyy-MM-dd HH:mm:ss');
        if(v.indMedInfo.medRegisterTime) v.indMedInfo.medRegisterTime = $filter('date')(v.indMedInfo.medRegisterTime, 'yyyy-MM-dd HH:mm:ss');
        if(v.indMedInfo.sendDate) v.indMedInfo.sendDate = $filter('date')(v.indMedInfo.sendDate, 'yyyy-MM-dd HH:mm:ss');
      }
      //卫生部门
      if(v.healthDepartmentInfo) {
        if(v.healthDepartmentInfo.beHospitTime) v.healthDepartmentInfo.beHospitTime = $filter('date')(v.healthDepartmentInfo.beHospitTime, 'yyyy-MM-dd HH:mm:ss');
        if(v.healthDepartmentInfo.outHospitTime) v.healthDepartmentInfo.outHospitTime = $filter('date')(v.healthDepartmentInfo.outHospitTime, 'yyyy-MM-dd HH:mm:ss');
      }
    })
  };

  //保存数据
  $scope.save = function (flag) {
    if($scope.co.stateParams != 'healthInfoFill' && $scope.co.stateParams != 'injuryInfoFill' && $scope.co.stateParams != 'injuryInfoSupplement' && $scope.co.stateParams != 'healthInfoSupplement' && $scope.co.stateParams != 'insurance') {
      //判断数据完整度
      if(!dataValid($scope.co.tabFlag)) {
        return false;
      }
      console.log($scope.police)
      //格式时间数据
      dataFormate2();
    }

    ////////////案件信息登记部分////////////////////
    console.log($scope.co.tabFlag)
    console.log($scope.co.stateParams)
    if($scope.co.tabFlag == 'case' && $scope.co.stateParams != 'healthInfoFill' && $scope.co.stateParams != 'injuryInfoFill' && $scope.co.stateParams != 'injuryInfoSupplement' && $scope.co.stateParams != 'healthInfoSupplement' && $scope.co.stateParams != 'inspect' &&　$scope.co.stateParams != 'insurance') {
      PoliceService.addAccidentFirst($scope.police).success(function (response) {
        callback(response)
      });
    }

    if($scope.co.tabFlag == 'parties' && $scope.co.stateParams == 'case') {
      _.each($scope.police.jpoliceVehicVO, function (v) {
        if(v.vehiclePolicyInfoList) {
          _.each(v.vehiclePolicyInfoList, function (x) {
            //拼接号牌号码
            x.vehiclePolicyInfo.palteNo = x.vehiclePolicyInfo.palteNo1+x.vehiclePolicyInfo.palteNo2+x.vehiclePolicyInfo.palteNo3;
            //获取投保险种
            var riskTypes = x.vehiclePolicyInfo.riskTypes;
            riskTypes = riskTypes.split(',');
            if(riskTypes.indexOf('3') != -1) {
              riskTypes.splice(riskTypes.indexOf('3'), 1, '2');
            }
            //整理机动车保险公司
            var vehicleCompanyArr = angular.copy(x.vehicleCompany);
            x.vehicleCompany.length = 0;
            _.each(vehicleCompanyArr, function (k) {
              if(riskTypes.indexOf(k.riskTypes+'') != -1) {
                x.vehicleCompany.push(k)
              }
            })
          })
        }
      });

      PoliceService.addAccidentSecond($scope.police).success(function (response) {
        callback(response)
      });
    }
    if($scope.co.tabFlag == 'health') {
      PoliceService.addAccidentFour($scope.police).success(function (response) {
        callback(response)
      });
    }

    ////////////检验鉴定信息填报///////////////////////
    if($scope.co.stateParams == 'inspect') {
      if(flag && confirm('确认完成鉴定？')) $scope.$broadcast('updateAppraisalInfo', 'BL');
      else $scope.$broadcast('updateAppraisalInfo');
    }

    ////////////保险信息填报///////////////////////
    if($scope.co.stateParams == 'insurance') {
      if(flag && confirm('确认完成补录？')) $scope.$broadcast('addAccidentSecond', 'BL');
      else $scope.$broadcast('addAccidentSecond');
    }

    ////////////卫生部门信息部分////////////////////
    if($scope.co.stateParams == 'healthInfoFill') {  //信息填报
      //调用子页面保存
      $scope.$broadcast('addHosp');
    }
    if($scope.co.stateParams == 'healthInfoSupplement' ) {  //信息补录
      //调用子页面保存
      if(flag && confirm('确认完成补录？')) $scope.$broadcast('addHosp', 'BL');
      else $scope.$broadcast('addHosp');
    }

    ////////////工伤医保信息部分////////////////////
    if($scope.co.stateParams == 'injuryInfoFill') {  //信息填报
      //调用子页面保存
      $scope.$broadcast('addIjury');
    }
    if($scope.co.stateParams == 'injuryInfoSupplement') {  //信息补录
      //调用子页面保存
      if(flag && confirm('确认完成补录？')) $scope.$broadcast('addIjury', 'BL');
      else $scope.$broadcast('addIjury');
    }

    function callback(response) {
      if(response.code == PoliceConfig.commonConstant.SUCCESS) {
        $scope.police = response.result;
        //添加默认保险公司交强险
        if($scope.police.jpoliceVehicVO.length == 0) {
          $scope.co.addJpoliceVehicVO();
        }
        //格式化数据
        dataFormate();
        $rootScope.toaster(CONTANT.success, CONTANT.sucTxt, '保存成功！');
      } else {
        $rootScope.toaster(CONTANT.error, CONTANT.errTxt, response.message);
      }
    }
  };

  //报案号提取
  $scope.queryPeopleInjured = function () {
    $scope.$broadcast('queryPeopleInjured');
  };

  //验证数据
  var dataValid = function (step) {
    if(step == 'case' && $scope.co.stateParams != 'healthInfoFill'&& $scope.co.stateParams != 'injuryInfoFill'&& $scope.co.stateParams != 'healthInfoSupplement' && $scope.co.stateParams != 'inspect') { //事故信息
      var v = $scope.police;
      if(!v.accidentInfo.accidentCode) {
        v.accidentInfo.accidentCodeError = true;
        $rootScope.toaster(CONTANT.error, CONTANT.errTxt, '事故编号不能为空！');
        return false;
      } else v.accidentInfo.accidentCodeError = undefined;
      if(!v.accidentInfo.accidentTime) {
        v.accidentInfo.accidentTimeError = true;
        $rootScope.toaster(CONTANT.error, CONTANT.errTxt, '事故时间不能为空！');
        return false;
      } else v.accidentInfo.accidentTimeError = undefined;
      if(!v.accidentInfo.accidentPlace) {
        v.accidentInfo.accidentPlaceError = true;
        $rootScope.toaster(CONTANT.error, CONTANT.errTxt, '事故地点不能为空！');
        return false;
      } else v.accidentInfo.accidentPlaceError = undefined;
      /*if(!v.accidentInfo.highSpeed && v.highSpeed != '0') {
        v.accidentInfo.highSpeedError = true;
        $rootScope.toaster(CONTANT.error, CONTANT.errTxt, '请选择是否高速！');
        return false;
      } else v.accidentInfo.highSpeedError = undefined;*/
      if(v.accidentInfo.deathNumber == 0){

      }else if(!v.accidentInfo.deathNumber) {
        v.accidentInfo.deathNumberError = true;
        $rootScope.toaster(CONTANT.error, CONTANT.errTxt, '死亡人数不能为空！');
        return false;
      } else v.accidentInfo.deathNumberError = undefined;
      if(v.accidentInfo.injuredNumber==0){

      }else if(!v.accidentInfo.injuredNumber) {
        v.accidentInfo.injuredNumberError = true;
        $rootScope.toaster(CONTANT.error, CONTANT.errTxt, '受伤人数不能为空！');
        return false;
      } else v.accidentInfo.injuredNumberError = undefined;
      if(!v.accidentInfo.accidentType) {
        v.accidentInfo.accidentTypeError = true;
        $rootScope.toaster(CONTANT.error, CONTANT.errTxt, '请选择事故类型！');
        return false;
      } else v.accidentInfo.accidentTypeError = undefined;
      if(!v.accidentInfo.scene) {
        v.accidentInfo.sceneError = true;
        $rootScope.toaster(CONTANT.error, CONTANT.errTxt, '请选择现场形态！');
        return false;
      } else v.accidentInfo.sceneError = undefined;
      if(!v.accidentInfo.briefCase) {
        v.accidentInfo.briefCaseError = true;
        $rootScope.toaster(CONTANT.error, CONTANT.errTxt, '请输入简要案情！');
        return false;
      } else v.accidentInfo.briefCaseError = undefined;
      if(!v.accidentInfo.propertyLoss) {
        v.accidentInfo.propertyLossError = true;
        $rootScope.toaster(CONTANT.error, CONTANT.errTxt, '请输入直接财产损失！');
        return false;
      } else v.accidentInfo.propertyLossError = undefined;
      if(!v.accidentInfo.accidentCauseCode) {
        v.accidentInfo.accidentCauseCodeError = true;
        $rootScope.toaster(CONTANT.error, CONTANT.errTxt, '请输入事故认定原因编号！');
        return false;
      } else v.accidentInfo.accidentCauseCodeError = undefined;
      if(!v.accidentInfo.accidentCauseRemark) {
        v.accidentInfo.accidentCauseRemarkError = true;
        $rootScope.toaster(CONTANT.error, CONTANT.errTxt, '请选择事故认定原因！');
        return false;
      } else v.accidentInfo.accidentCauseRemarkError = undefined;
      if(!v.accidentInfo.surveyDate) {
        v.accidentInfo.surveyDateError = true;
        $rootScope.toaster(CONTANT.error, CONTANT.errTxt, '请选择现场勘查日期！');
        return false;
      } else v.accidentInfo.surveyDateError = undefined;
      if(!v.accidentInfo.isAppraisal && v.isAppraisal != '0') {
        v.accidentInfo.isAppraisalError = true;
        $rootScope.toaster(CONTANT.error, CONTANT.errTxt, '请选择现场检验鉴定！');
        return false;
      } else v.accidentInfo.isAppraisalError = undefined;
      if(v.accidentInfo.isAppraisal == '1') {
        //选择现场检验鉴定
        for(var i = 0; i < v.appraisalInfoList.length; i++) { //循环检验鉴定信息
          var x = v.appraisalInfoList[i];
          if(!x.appraisalType && x.appraisalType != '0') {
            x.appraisalTypeError = true;
            $rootScope.toaster(CONTANT.error, CONTANT.errTxt, '请选择检验鉴定类型！');
            return false;
          } else x.appraisalTypeError = undefined;

          if(!x.appraisalType && x.appraisalType != '0') {
            x.appraisalTypeError = true;
            $rootScope.toaster(CONTANT.error, CONTANT.errTxt, '请选择检验鉴定类型！');
            return false;
          } else x.appraisalTypeError = undefined;

          if(x.appraisalType == '4' && !x.appraisalTypeRemark) {
            x.appraisalTypeRemarkError = true;
            $rootScope.toaster(CONTANT.error, CONTANT.errTxt, '请填写其他检验鉴定类型！');
            return false;
          } else x.appraisalTypeRemarkError = undefined;
          if(!x.entrustTime) {
            x.entrustTimeError = true;
            $rootScope.toaster(CONTANT.error, CONTANT.errTxt, '请选择委托日期！');
            return false;
          } else x.entrustTimeError = undefined;
          if(!x.promiseTime) {
            x.promiseTimeError = true;
            $rootScope.toaster(CONTANT.error, CONTANT.errTxt, '请选择预约完成日期！');
            return false;
          } else x.promiseTimeError = undefined;
        }
      }
    } else if( step == 'parties') {
      for(var i = 0; i < $scope.police.jpoliceVehicVO.length; i++) {
        var x = $scope.police.jpoliceVehicVO[i].policePersonInformation;
        if(!x.userName) {
          x.userNameError = true;
          $rootScope.toaster(CONTANT.error, CONTANT.errTxt, '姓名不能为空！');
          return false;
        } else x.userNameError = undefined;
        if(!x.sex && x.sex != '0') {
          x.sexError = true;
          $rootScope.toaster(CONTANT.error, CONTANT.errTxt, '请选择性别！');
          return false;
        } else x.sexError = undefined;
        if(!x.personCard) {
          x.personCardError = true;
          $rootScope.toaster(CONTANT.error, CONTANT.errTxt, '请输入证件号码！');
          return false;
        } else if(!$scope.co.checkIdentity(x)) {
          return false;
        } else x.personCardError = undefined;
        if(!x.age) {
          x.ageError = true;
          $rootScope.toaster(CONTANT.error, CONTANT.errTxt, '请输入年龄！');
          return false;
        } else x.ageError = undefined;
        if(!x.placeOfDomicile) {
          x.placeOfDomicileError = true;
          $rootScope.toaster(CONTANT.error, CONTANT.errTxt, '请输入户籍地！');
          return false;
        } else x.placeOfDomicileError = undefined;
        if(!x.address) {
          x.addressError = true;
          $rootScope.toaster(CONTANT.error, CONTANT.errTxt, '请输入实际居住地！');
          return false;
        } else x.addressError = undefined;
        if(!x.trafficType) {
          x.trafficTypeError = true;
          $rootScope.toaster(CONTANT.error, CONTANT.errTxt, '请选择交通方式！');
          return false;
        } else x.trafficTypeError = undefined;
        /*if(!x.drivingType) {
          x.drivingTypeError = true;
          $rootScope.toaster(CONTANT.error, CONTANT.errTxt, '请选择准驾车型！');
          return false;
        } else x.drivingTypeError = undefined;*/
        /*if(!x.illegality) {
          x.illegalityError = true;
          $rootScope.toaster(CONTANT.error, CONTANT.errTxt, '请输入违法行为编号！');
          return false;
        } else x.illegalityError = undefined;
        if(!x.illegalityRemark) {
          x.illegalityRemarkError = true;
          $rootScope.toaster(CONTANT.error, CONTANT.errTxt, '请选择违法行为！');
          return false;
        } else x.illegalityRemarkError = undefined;*/
        if(!x.accidentLiability) {
          x.accidentLiabilityError = true;
          $rootScope.toaster(CONTANT.error, CONTANT.errTxt, '请选择事故责任！');
          return false;
        } else x.accidentLiabilityError = undefined;
        if(!x.hurt) {
          x.hurtError = true;
          $rootScope.toaster(CONTANT.error, CONTANT.errTxt, '请选择伤害程度！');
          return false;
        } else x.hurtError = undefined;
        if(!x.drivingLicence && x.drivingLicence != '0') {
          x.drivingLicenceError = true;
          $rootScope.toaster(CONTANT.error, CONTANT.errTxt, '请选择驾驶证状态！');
          return false;
        } else x.drivingLicenceError = undefined;
        if((x.drivingLicence == '0' || x.drivingLicence == '1') && !x.detainTime) {
          x.detainTimeError = true;
          $rootScope.toaster(CONTANT.error, CONTANT.errTxt, '请选择扣留/扣押时间！');
          return false;
        } else x.detainTimeError = undefined;
        if(!x.isWounded && x.isWounded != '0') {
          x.isWoundedError = true;
          $rootScope.toaster(CONTANT.error, CONTANT.errTxt, '请选择是否伤者！');
          return false;
        } else x.isWoundedError = undefined;
        if(!x.phoneNumber) {
          x.phoneNumberError = true;
          $rootScope.toaster(CONTANT.error, CONTANT.errTxt, '请输入手机号！');
          return false;
        } else x.phoneNumberError = undefined;
        //机动车及保单信息
        if($scope.police.jpoliceVehicVO[i].vehiclePolicyInfoList && $scope.police.jpoliceVehicVO[i].vehiclePolicyInfoList.length > 0) {
          for(var k = 0; k < $scope.police.jpoliceVehicVO[i].vehiclePolicyInfoList.length; k++) {
            var v = $scope.police.jpoliceVehicVO[i].vehiclePolicyInfoList[k].vehiclePolicyInfo;
            if(!v.vehicleType) {
              v.vehicleTypeError = true;
              $rootScope.toaster(CONTANT.error, CONTANT.errTxt, '请选择车辆类型！');
              return false;
            } else v.vehicleTypeError = undefined;
            if(!v.plateType) {
              v.plateTypeError = true;
              $rootScope.toaster(CONTANT.error, CONTANT.errTxt, '请选择号牌种类！');
              return false;
            } else v.plateTypeError = undefined;
            if(!v.palteNo1 || !v.palteNo2 || !v.palteNo3) {
              v.palteNo1Error = true;v.palteNo2Error = true;v.palteNo3Error = true;
              $rootScope.toaster(CONTANT.error, CONTANT.errTxt, '请填写完整号牌号码！');
              return false;
            } else v.palteNo1Error = undefined;v.palteNo2Error = undefined;v.palteNo3Error = undefined;
            if(!v.vehicleLoss) {
              v.vehicleLossError = true;
              $rootScope.toaster(CONTANT.error, CONTANT.errTxt, '请选择车辆损失！');
              return false;
            } else v.vehicleLossError = undefined;
            if(!v.riskTypes) {
              v.riskTypesError = true;
              $rootScope.toaster(CONTANT.error, CONTANT.errTxt, '请选择投保险种！');
              return false;
            } else v.riskTypesError = undefined;
            if(!v.detainVehicle) {
              v.detainVehicleError = true;
              $rootScope.toaster(CONTANT.error, CONTANT.errTxt, '请选择是否扣留！');
              return false;
            } else v.detainVehicleError = undefined;
            if(v.detainVehicle == '0' && !v.detainDate) {
              v.detainDateError = true;
              $rootScope.toaster(CONTANT.error, CONTANT.errTxt, '请选择扣留时间！');
              return false;
            } else v.detainDateError = undefined;
          }
        }
      }
    } else if(step == 'health') {
      for(var i = 0; i< $scope.police.jpoliceVehicVO.length; i++) {
    	  if($scope.police.jpoliceVehicVO[i].policePersonInformation.isWounded=='0'){
	    		  var heal = $scope.police.jpoliceVehicVO[i].healthDepartmentInfo; //就医信息
	    		  if(!heal.hospitalPlace && heal.hospitalPlace != '0') {
	    			  heal.hospitalPlaceError = true;
	    			  $rootScope.toaster(CONTANT.error, CONTANT.errTxt, '请选择就医医院！');
	    			  return false;
	    		  } else heal.hospitalIdError = undefined;
	    		  
	    		  var ind = $scope.police.jpoliceVehicVO[i].indMedInfo; //工伤医保信息
	    		  if(!ind.indInjuryDepartment) {
	    			  ind.indInjuryDepartmentError = true;
	    			  $rootScope.toaster(CONTANT.error, CONTANT.errTxt, '请选择工伤主管部门！');
	    			  return false;
	    		  } else ind.indInjuryDepartmentError = undefined;
	    		  if(!ind.medInsuranceDepartment) {
	    			  ind.medInsuranceDepartmentError = true;
	    			  $rootScope.toaster(CONTANT.error, CONTANT.errTxt, '请选择医保主管部门！');
	    			  return false;
	    		  } else ind.medInsuranceDepartmentError = undefined;
	    		  /*if(!heal.department) {
	          heal.departmentError = true;
	          $rootScope.toaster(CONTANT.error, CONTANT.errTxt, '请填写科室！');
	          return false;
	        } else heal.departmentError = undefined;
	        if(!heal.roomNumber) {
	          heal.roomNumberError = true;
	          $rootScope.toaster(CONTANT.error, CONTANT.errTxt, '请输入病房号！');
	          return false;
	        } else heal.roomNumberError = undefined;
	        if(!heal.attendingDoctor) {
	          heal.attendingDoctorError = true;
	          $rootScope.toaster(CONTANT.error, CONTANT.errTxt, '请输入主治医师！');
	          return false;
	        } else heal.attendingDoctorError = undefined;
	        if(!heal.hospitalization) {
	          heal.hospitalizationError = true;
	          $rootScope.toaster(CONTANT.error, CONTANT.errTxt, '请选择是否住院！');
	          return false;
	        } else heal.hospitalizationError = undefined;
	        if(heal.hospitalization == '1' && !heal.beHospitTime) {
	          heal.beHospitTimeError = true;
	          $rootScope.toaster(CONTANT.error, CONTANT.errTxt, '请选择入院时间！');
	          return false;
	        } else heal.beHospitTimeError = undefined;
	        if(heal.hospitalization == '1' && !heal.outHospitTime) {
	          heal.outHospitTimeError = true;
	          $rootScope.toaster(CONTANT.error, CONTANT.errTxt, '请选择出院时间！');
	          return false;
	        } else heal.outHospitTimeError = undefined;
	        if(!heal.thrMediFe) {
	          heal.thrMediFeError = true;
	          $rootScope.toaster(CONTANT.error, CONTANT.errTxt, '请输入三日内医疗费！');
	          return false;
	        } else heal.thrMediFeError = undefined;
	        if(!heal.enclosureInfoList || heal.enclosureInfoList.length == '0') {
	          $rootScope.toaster(CONTANT.error, CONTANT.errTxt, '请上传伤情诊断！');
	          return false;
	        }*/
    	  }
      }
    }
    return true;
  };

  //请求下拉数据字典
  var queryDictionaries = function () {
    //检测鉴定机构，计生委
    PoliceService.queryRelationOrgList({}).success(function (response) { //#01 法院 #02 调解机构  #03 鉴定 #04 保险公司 #05 公安交警 #06 医院 #07 医保
      if(response.code == PoliceConfig.commonConstant.SUCCESS) {
        console.log(response)
        $scope.appraisalMechanismList = response.result;
      } else {
        $rootScope.toaster(CONTANT.error, CONTANT.errTxt, response.message)
      }
    });
  };

  /////////////////////////保险公司事件//////////////////////////////
  //选择系统保险公司
  $scope.insuranceFocus = function(type) {
    if (!$scope.insuranceShow1 && type == 'insuranceForceCompany') $scope.insuranceShow1 = true;
    if (!$scope.insuranceShow2 && type == 'insuranceBusinessCompany') $scope.insuranceShow2 = true;
    if (!$scope.insuranceShow3 && type == 'insuranceVehicleCompany') $scope.insuranceShow3 = true;
  };
  $scope.blurInsurance = function(type){
    if($scope.insuranceShow1 && type == 'insuranceForceCompany'){
      $timeout(function(){
        $scope.insuranceShow1 = false;
      }, 200);
    }
    if($scope.insuranceShow2 && type == 'insuranceBusinessCompany'){
      $timeout(function(){
        $scope.insuranceShow2 = false;
      }, 200);
    }
    if($scope.insuranceShow3 && type == 'insuranceVehicleCompany'){
      $timeout(function(){
        $scope.insuranceShow3 = false;
      }, 200);
    }
  };
  //保险公司单击事件
  $scope.selectItems = function(info, company, attr, riskTypes) {
    console.log(info[attr])
    _.filter(info[attr], function (v) {
      console.log(v)
      return v.riskTypes == riskTypes
    })[0].insuranceCompany = company.text;
    $scope.insuranceShow1 = false;
    $scope.insuranceShow2 = false;
    $scope.insuranceShow3 = false;
  };
  //勘察现场时间变动 +3天  surveyDateThree 修改
  $scope.changeSurDate = function(obj){
      PoliceService.queryWorkDay({day:3,date:$filter('date')(obj.accidentInfo.surveyDate, 'yyyy-MM-dd')}).success(function (response) {
          if(response.code == PoliceConfig.commonConstant.SUCCESS) {
              obj.accidentInfo.surveyDateThree = response.result;
          } else {
              $rootScope.toaster(CONTANT.error, CONTANT.errTxt, response.message);
          }
      })
      //勘查现场日期变动  关联鉴定的委托日期  约定完成日期
      angular.forEach(obj.appraisalInfoList, function (each) {  
          each.entrustTime = null;
          each.promiseTime = null;
      });
  };
  //【委托日期】填写控制：本日<=【委托日期】<=【现场勘查日期】+3个工作日
  $scope.changeEntTime = function(apprais,obj){
    if(!obj.accidentInfo.surveyDateThree){
      apprais.entrustTime = null;
      $rootScope.toaster(CONTANT.error, CONTANT.errTxt, "请先填写事故的现场勘查日期!");
      return false;
    }
    if(!apprais.entrustTime){
      return false;
    }
    if(!(typeof obj.accidentInfo.surveyDateThree =='object')){
        obj.accidentInfo.surveyDateThree = $scope.co.parseISO8601(obj.accidentInfo.surveyDateThree);
    }

    var time = new Date();
    if(!((time.getTime()<apprais.entrustTime.getTime() || time.getDate()==apprais.entrustTime.getDate())&&(apprais.entrustTime.getTime()<obj.accidentInfo.surveyDateThree.getTime() || apprais.entrustTime.getDate()==obj.accidentInfo.surveyDateThree.getDate()))){
      apprais.entrustTime = null;
      $rootScope.toaster(CONTANT.error, CONTANT.errTxt, "本日<=【委托日期】<=【现场勘查日期】+3个工作日");
        return false;
    }
  };
  //【约定完成日期】填写控制：【委托日期】<=【约定完成日期】<=【委托日期】+30天
  $scope.changePromTime = function(apprais){
      if(!apprais.entrustTime){
          apprais.promiseTime = null;
          $rootScope.toaster(CONTANT.error, CONTANT.errTxt, "请先填写委托日期!");
          return false;
      }
      if(!(typeof apprais.entrustTime =='object')){
          apprais.entrustTime = $scope.co.parseISO8601(apprais.entrustTime);
      }
      var entrSuperDate = new Date();
      entrSuperDate.setDate(apprais.entrustTime.getDate() + 30);
      if(!((apprais.entrustTime.getTime()<apprais.promiseTime.getTime()||apprais.entrustTime.getDate()==apprais.promiseTime.getDate())&&(apprais.promiseTime.getTime()<entrSuperDate.getTime()||apprais.promiseTime.getDate()==entrSuperDate.getDate()))){
        apprais.promiseTime = null;
        $rootScope.toaster(CONTANT.error, CONTANT.errTxt, "【委托日期】<=【约定完成日期】<=【委托日期】+30天");
          return false;
      }
  };

  $scope.changePersonCard = function (policePerson) {
    policePerson.age = $scope.GetAge(policePerson.personCard)
  };

  /*根据出生日期算出年龄*/
  $scope.GetAge = function (identityCard){
    var len = (identityCard + "").length;
    if (len == 0) {
      return 0;
    } else {
      if ((len != 15) && (len != 18))//身份证号码只能为15位或18位其它不合法
      {
        return 0;
      }
    }
    var strBirthday = "";
    if (len == 18)//处理18位的身份证号码从号码中得到生日和性别代码
    {
      strBirthday = identityCard.substr(6, 4) + "/" + identityCard.substr(10, 2) + "/" + identityCard.substr(12, 2);
    }
    if (len == 15) {
      strBirthday = "19" + identityCard.substr(6, 2) + "/" + identityCard.substr(8, 2) + "/" + identityCard.substr(10, 2);
    }
    //时间字符串里，必须是“/”
    var birthDate = new Date(strBirthday);
    var nowDateTime = new Date();
    var age = nowDateTime.getFullYear() - birthDate.getFullYear();
    //再考虑月、天的因素;.getMonth()获取的是从0开始的，这里进行比较，不需要加1
    if (nowDateTime.getMonth() < birthDate.getMonth() || (nowDateTime.getMonth() == birthDate.getMonth() && nowDateTime.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }


  //初始化数据
  $scope.initData = function () {//$scope.user.sysUser.regionName.split('-')[0]

    _.filter($scope.palteNoList, function (v) {
      if(v.name == $scope.user.sysUser.regionName.split('-')[0]) {
        $scope.co.userRegName1 = v.value;
        if(v.seedList && v.seedList.length > 0) {
          _.filter(v.seedList, function (x) {
            if(x.name == $scope.user.sysUser.regionName.split('-')[1]) {
              $scope.co.userRegName2 = x.value;
            }
          })
        }
      }
    });

    //请求下拉数据
    queryDictionaries();

    if($stateParams.flag != 'healthInfoFill' && $stateParams.flag != 'injuryInfoFill' && $stateParams.flag != 'inspect' && $stateParams.flag != 'insurance') {
      //请求案件信息数据
      queryPoliceInfo();
    }
  };

  LoginService.queryUserInfo().success(function(result) {
    if (result.result) {
      //用户赋值
      $scope.user = result.result;
      $scope.initData();
    }
  })

});



//my97datePicker
function my97dateClick(dp) {
  var appElement = document.getElementById('policeTab1');
  var $scope = angular.element(appElement).scope();
  $scope.police.accidentInfo.accidentTime = dp.cal.getNewDateStr();
};