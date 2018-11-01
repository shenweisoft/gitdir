/**
 * Created by Administrator on 2018/3/21.
 */

'use strict';
var app = angular.module('sbAdminApp');

app.filter('filterRegions', function () {
  return function (arr) {
    return arr.filter(function (v) {
      return v.level != 4;
    })
  }
});

app.filter('querySelected', function () {
  return function(oneself, arr1, arr2, obj) { //oneself:循环的数组本身-personList  ， arr1：参数1 - personInfoVOList， arr2：参数2 - policeVehicleInfoVOList， obj：参数3 - vehicle
    //初始化自身personList数组   personList
    if(oneself) {
      oneself.length = 0;
      _.each(arr1, function (v) {
        oneself.push(v.personName);
      });
      //console.log(target.personList) //初始化全部数据
      //当前选择框选中的人名
      var curName = obj.litigantName === undefined? obj.applyerName: obj.litigantName;
      console.log(curName); //当前选中的人名
      //过滤出被选中的人名
      var selectedNameList = []; //已被选中的人名数组
      _.each(arr2, function (v) {
        v.litigantName === undefined? selectedNameList.push(v.applyerName): selectedNameList.push(v.litigantName);
      });

      //在已选中的人名中寻找当前选中的人名，并从中去掉
      if(selectedNameList.length > 0) {
        var index = selectedNameList.indexOf(curName);
        if(index != '-1') {
          selectedNameList.splice(index, 1);
        }
      }
      //console.log(selectedNameList); //被选中的人
      //在自身数组中，删去已选项
      var merge = oneself.concat(selectedNameList).filter(function(v, i, arr) {return arr.indexOf(v) == arr.lastIndexOf(v);});
      //target.personList = merge;
      console.log(merge)
      return merge;
      target.personList.length = 0;
      _.each(merge, function (v) {
        target.personList.push(v);
      });
      //console.log(target.personList)
    }
  }
});

angular.module('sbAdminApp').controller('supplementPoliceLawCaseCtrl', function($scope, $stateParams, $state, IdentityService, $location, PoliceService, $timeout, $http, $log, $filter, PoliceConfig, AdjustService, AdjustConfig, toaster,DictionaryConfig,AdminConstant,$rootScope) {
  //是否高速
  $scope.highSpeedList = PoliceConfig.highSpeedList;
  //驾驶证状态
  $scope.driverLicenseStateList = PoliceConfig.driverLicenseStateList;
  //号牌种类
  $scope.plateTypeList = PoliceConfig.plateTypeList;
  //车辆型号
  $scope.vehicleTypeList = PoliceConfig.vehicleTypeList;
  //使用性质
  $scope.usePropertyList = PoliceConfig.usePropertyList;
  //准驾车型
  $scope.vehicleList = PoliceConfig.vehicleList;
  //案由
  $scope.causeTypeList = PoliceConfig.causeTypeList;
  //鉴定机构
  $scope.identificationTypeList = PoliceConfig.identificationTypeList;

  //当前步骤flag
  $scope.stepFlag = 'person';
  $scope.step = 1;

  //创建页面常量
  $scope.CONSTANT = {
    accidentNumberNullMessage: "请输入事故认定书编号",
    cityCodeNullMessage: "请输入事故地点",
    accidentAddressNullMessage: "请输入事故详细地点",
    accidentDateNullMessage: "请选择事故时间",
    highSpeedNullMessage: "请选择是否是高速",
    idNoNullMessage: "请输入身份证号码",
    messageIdentityFormatError: "身份证号格式有误",
    personNameNullMessage: "请输入当事人姓名",
    telephoneNullMessage: "请输入电话号码",
    sexNullMessage: "请选择性别",
    residenceNullMessage: "请填写居住地",
    birthdayNullMessage: "请选择出生日期",
    personListMinMessage: "至少保留一项人员信息",
    recipientNameNullMessage: "请输入受案人",
    causeTypeNullMessage: "请选择案由",
    recipientDateNullMessage: "请选择受案时间",
    recipientRemarkNullMessage: "请填写受案人意见",
    litigantNameNullMessage: "请选择当事人",
    plateNoNullMessage: "请填写号牌号码",
    detainDrivingLicenseNullMessage: "请选择是否扣留行驶证",
    detainVehicleNullMessage: "请选择是否扣留车辆",
    detainDateNullMessage: "请选择扣留日期",
    returnDateNullMessage: "请选择返还日期",
    applyerNameNullMessage: "请选择申请人",
    accreditationBodiesNullMessage: "请选择鉴定机构",
    identificationTypeNullMessage: "请选择鉴定类型",
    identificationDateNullMessage: "请选择鉴定时间",
    identificationFinishDateNullMessage: "请选择鉴定完成时间"
  };

  //存储案件信息
  $scope.police = {
    id: $stateParams.policeId,
    serialNo: "110101201800912", //默认值
    caseType: "1", //默认值
    idNo: '', //身份证号
    accidentNumber: '', //事故认定书号
    cityCode: '', //事故地点编码
    highSpeed: '', //是否高速
    accidentRegion: '', //事故地点
    accidentAddress: '', //事故详细地点
    accidentDate: '', //事故时间
    personState: '0', //人员登记保存/提交标识  0：暂存 1：提交
    recipientState: '0', //扣留车辆保存/提交标识  0：暂存 1：提交
    appraiseState: '0', //委托鉴定保存/提交标识  0：暂存 1：提交
    personInfoVOList: [], //人员登记数据列表
    policeRecipientInfoVOList: [], //受案信息数据列表
    policeAppraiseInfoVOList: [], //扣留车辆数据列表
    policeVehicleInfoVOList: [] //委托鉴定数据列表
  };

  //创建人员登记构造函数
  var PersonFun = function () {
    this.personName = "";
    this.telephone = "";
    this.sex = "";
    this.idNo = "";
    this.residence = "";
    this.birthday = "";
    this.archivesNo = "";
    this.vehicle = "";
    this.certificateDate = "";
    this.validateStartDate = "";
    this.validateEndDate = "";
    this.limitTime = "";
    this.driverLicenseState = "";
    this.driverLicenseName = "";
    this.plateType = "";
    this.vehicleType = "";
    this.useProperty = "";
    this.endDate = "";
    this.drunkDriving = "";
    this.isEscape = "";
    this.personHitRemark = "";
    this.vehicleHitRemark = "";
    this.isShowDetail = false; //详情显隐控制
    this.showDeleBtn = false; //删除按钮显隐控制
  };
  //创建受案信息构造函数
  var RecipientFun = function () {
    this.recipientName = "";
    this.causeType = "";
    this.recipientDate = "";
    this.recipientRemark = "";
  };
  //创建扣留车辆信息登记
  var VehicleFun = function () {
    this.litigantName = "";
    this.plateNo = "";
    this.detainDrivingLicense = ""; //扣留行驶证 0：是 1：否
    this.detainVehicle = ""; //扣留车辆 0：是 1：否
    this.detainDate = "";
    this.returnDate = "";
    this.showDeleBtn = false; //删除按钮显隐控制
  };
  //创建委托鉴定构造函数
  var AppraiseFun = function () {
    this.applyerName = "";
    this.accreditationBodies = "";
    this.identificationType = "";
    this.identificationDate = "";
    this.identificationFinishDate = "";
    this.showDeleBtn = false; //删除按钮显隐控制
  };

  //将信息加入数组
  //初始化四个信息数组
  function initData() {
    if($scope.police.personState == '0') { //人员信息保存状态
      if($scope.police.personInfoVOList.length == 0) {
        $scope.police.personInfoVOList.push(new PersonFun());
      }
      $scope.step = '1';
      $scope.stepFlag == 'person';
    }
    if($scope.police.personState == '1') { //人员信息已保存，并且没有受案信息
      if($scope.police.policeRecipientInfoVOList.length == 0) {
        $scope.police.policeRecipientInfoVOList.push(new RecipientFun());
      }
      $scope.step = '2';
      $scope.stepFlag = 'recipient';
    }
    if($scope.police.recipientState == '1') {
      $scope.step = '3';
      $scope.stepFlag = 'end';
    }
  };


  //$scope.police.personInfoVOList.push(new PersonFun());
  //$scope.police.policeRecipientInfoVOList.push(new RecipientFun());
  //$scope.police.policeAppraiseInfoVOList.push(new VehicleFun());
  //$scope.police.policeVehicleInfoVOList.push(new AppraiseFun());

  //根据id查询主表信息
  if($scope.police.id) {
    PoliceService.queryPoliceInfoAllInfo({id: $scope.police.id}).success(function (res) {
      if(res.code == PoliceConfig.commonConstant.SUCCESS){
        console.log(res)
        $scope.police = res.result;
        formatJson();
        initData();
        console.log($scope.police)
      }else {
        $rootScope.toaster("error", "错误", res.message);
      }
    });
  } else {
    initData();
  }

  //人员信息登记与受案信息保存
  $scope.save12 = function (isJump) {
    //修改状态(保存：0  提交：1)
    isJump? $scope.police[$scope.stepFlag+'State'] = '1' : '';
    //格式化日期数据
    formatData();
    var method = $scope.stepFlag == 'person'? PoliceService.savePolicePersonInfo : PoliceService.savePoliceRecipientInfo;
    //将受案人数据放入主表对象
    if($scope.stepFlag == 'recipient'){
      if($scope.police.policeRecipientInfoVOList.length > 0){
        var policeRecipientInfoVO = $scope.police.policeRecipientInfoVOList[0];
        $scope.police.recipientName = policeRecipientInfoVO.recipientName;
        $scope.police.causeType = policeRecipientInfoVO.causeType;
        $scope.police.recipientDate = policeRecipientInfoVO.recipientDate;
      }
    }
    $scope.police.state = '1000';
    var data = JSON.stringify($scope.police);
    method(data).success(function (res) {
      if(res.code == PoliceConfig.commonConstant.SUCCESS){
        console.log(res)
        $scope.police = res.result;
        initData();
        //格式化数据（后台获取的）
        formatJson();
        console.log($scope.police)
        if(!isJump) {
          $rootScope.toaster("success", "成功", "保存成功");
        } else {
          isJump();
        }

        //首次保存时，判断此时主表是否有id，如果没有，则将回台返回的id存入url
        if($scope.step == '2' && !$stateParams.policeId) {
          $state.go('dashboard.supplementPoliceLawCase', {policeId: $scope.police.id});
        }
      }else {
        $rootScope.toaster("error", "错误", res.message);
      }
    })
  };

  ////////////////////////提交各类信息//////////////////////////////
  //人员信息登记与受案信息提交
  $scope.submit12 = function () {
    //验证数据
    if(validate12($scope.stepFlag) && confirm('确认提交？信息提交后无法修改！')) {
      //调用保存方法，提交数据
      $scope.save12(function () {
        $rootScope.toaster("success", "成功", "提交成功");
        console.log($scope.police)
      });

    }
  };
  //提交扣留车辆信息
  $scope.submitVehicle = function () {
    if(validateVehicle() && confirm('确认提交？信息提交后无法修改！')) {
      //格式化日期数据
      formatData();
      //修改案件state，锁住页面不可修改
      $scope.police.vehicleState = '1';
      PoliceService.savePoliceVehicleInfo(JSON.stringify($scope.police)).success(function (res) {
        if(res.code == PoliceConfig.commonConstant.SUCCESS){
          //$scope.police = res.result;
          console.log(res.result)
          //格式化日期数据
          formatJson();
          $rootScope.toaster("success", "成功", "提交成功");
        }else {
          $rootScope.toaster("error", "错误", res.message);
        }
      });
    }
  };
  //提交委托鉴定信息
  $scope.submitAppraise = function () {
    if(validateAppraise() && confirm('确认提交？信息提交后无法修改！')) {
      //格式化日期数据
      formatData();
      //修改案件state，锁住页面不可修改
      $scope.police.appraiseState = '1';
      PoliceService.savePoliceAppraiseInfo(JSON.stringify($scope.police)).success(function (res) {
        if(res.code == PoliceConfig.commonConstant.SUCCESS){
          console.log(res)
          //$scope.police = res.result;
          //格式化日期数据
          formatJson();
          $rootScope.toaster("success", "成功", "提交成功");
        }else {
          $rootScope.toaster("error", "错误", res.message);
        }
      });
    }
  };

  ////////////////////////显示删除按钮///////////////////////////////
  $scope.showDeleteBtn = function (index, target, data){
    if($scope.police[data+'State'] == '1') {
      return false;
    }
    $("["+data+"-flag="+index+"]").css({'borderColor': '#3F65D6'});
    target.showDeleBtn = true;
  };
  $scope.hideDeleteBtn = function (index, target, data){
    if($scope.police[data+'State'] == '1') {
      return false;
    }
    $("["+data+"-flag="+index+"]").css({'borderColor': 'transparent'});
    target.showDeleBtn = false;
  };

  ////////////////////////删除当前项////////////////////////////////
  //删除人员信息
  $scope.handleDeletePerson = function (index) {
    if(confirm('确认删除该项？')) {
      if($scope.police.personInfoVOList.length == 1) { //至少保留一项
        $rootScope.toaster("error", "错误", $scope.CONSTANT.personListMinMessage);
      } else {
        //前端页面删除
        $scope.police.personInfoVOList.splice(index, 1);
        //后台调用接口删除
      }
    }
  };
  //删除扣留车辆信息
  $scope.handleDeleteVehicle = function (index) {
    if(confirm('确认删除该项？')) {
      //前端页面删除
      $scope.police.policeVehicleInfoVOList.splice(index, 1);
      //后台调用接口删除
    }
  };
  //删除委托鉴定信息
  $scope.handleDeleteAppraise = function (index) {
    if(confirm('确认删除该项？')) {
      //前端页面删除
      $scope.police.policeAppraiseInfoVOList.splice(index, 1);
      //后台调用接口删除
    }
  };

  //////////////////////////添加各类信息/////////////////////////////
  //添加人员信息
  $scope.appendPerson = function () {
    $scope.police.personInfoVOList.push(new PersonFun());
  };
  //添加扣留车辆信息
  $scope.appendVehicle = function () {
    //判断当事人个数
    if($scope.police.policeVehicleInfoVOList.length >= $scope.police.personInfoVOList.length) {
      $rootScope.toaster("warm", "提示", "当事人已被全部选择");
    } else {
      var vehicle = new VehicleFun();
      vehicle.personList = [];
      _.each($scope.police.personInfoVOList, function (v) {
        vehicle.personList.push(v.personName);
      });
      $scope.police.policeVehicleInfoVOList.push(vehicle);
    }
  };
  //添加委托鉴定信息
  $scope.appendAppraise = function () {
    //判断当事人个数
    if($scope.police.policeAppraiseInfoVOList.length >= $scope.police.personInfoVOList.length) {
      $rootScope.toaster("warm", "提示", "当事人已被全部选择");
    } else {
      var appraise = new AppraiseFun();
      appraise.personList = [];
      _.each($scope.police.personInfoVOList, function (v) {
        appraise.personList.push(v.personName);
      });
      $scope.police.policeAppraiseInfoVOList.push(appraise);
    }
  };

  ////////////////////////底部按钮事件///////////////////////////////
  //关闭
  $scope.closeLawCase = function () {
    if(confirm('是否关闭当前案件？')) {
      $state.go("dashboard.policeList");
    }
  };
  //结束案件
  $scope.endLawCase = function () {
    if(confirm('确认补录完成？')) {
      $scope.police.state = '1001';
      formatData();
      PoliceService.savePoliceInfo($scope.police).success(function (res) {
        if (res.code == PoliceConfig.commonConstant.SUCCESS) {
          console.log(res)
          //跳转页面到列表
          $state.go('dashboard.policeList');
        } else {
          $rootScope.toaster("error", "错误", res.message);
        }
      })
    }
  };

  ////////////////////////验证数据//////////////////////////////////
  //验证查询交警案件数据
  var validate = function () {
    var v = $scope.police;
    if(!v.accidentNumber) { //事故认定书编号
      v.accidentNumberError = true;
      $rootScope.toaster("error", "错误", $scope.CONSTANT.accidentNumberNullMessage);
      return false;
    } v.accidentNumberError = undefined;
    if(!v.cityCode) { //事故地点
      v.cityCodeError = true;
      $rootScope.toaster("error", "错误", $scope.CONSTANT.cityCodeNullMessage);
      return false;
    } v.cityCodeError = undefined;
    if(!v.accidentAddress) { //事故详细地点
      v.accidentAddressError = true;
      $rootScope.toaster("error", "错误", $scope.CONSTANT.accidentAddressNullMessage);
      return false;
    } v.accidentAddressError = undefined;
    if(!v.accidentDate) { //事故时间
      v.accidentDateError = true;
      $rootScope.toaster("error", "错误", $scope.CONSTANT.accidentDateNullMessage);
      return false;
    } v.accidentDateError = undefined;
    if(!v.highSpeed) { //是否高速
      v.highSpeedError = true;
      $rootScope.toaster("error", "错误", $scope.CONSTANT.highSpeedNullMessage);
      return false;
    } v.highSpeedError = undefined;
    if(!v.idNo) { //身份证号码
      v.idNoError = true;
      $rootScope.toaster("error", "错误", $scope.CONSTANT.idNoNullMessage);
      return false;
    } v.idNoError = undefined;
    return true;
  };
  //验证人员登记与受案信息
  var validate12 = function (stepFlag) {
    if(stepFlag == 'person') { //验证人员信息
      for(var i = 0; i < $scope.police.personInfoVOList.length; i++) {
        var v = $scope.police.personInfoVOList[i];
        if(!v.personName) {
          v.personNameError = true;
          $rootScope.toaster("error", "错误", $scope.CONSTANT.personNameNullMessage);
          return false;
        } v.personNameError = undefined;
        if(!v.telephone) {
          v.telephoneError = true;
          $rootScope.toaster("error", "错误", $scope.CONSTANT.telephoneNullMessage);
          return false;
        } v.telephoneError = undefined;
        if(!v.idNo) {
          v.idNoError = true;
          $rootScope.toaster("error", "错误", $scope.CONSTANT.idNoNullMessage);
          return false;
        } v.idNoError = undefined;
        if($scope.checkIdentity(v, false)) {
          return false;
        } v.idNoError = undefined;
        if(!v.sex) {
          v.sexError = true;
          $rootScope.toaster("error", "错误", $scope.CONSTANT.sexNullMessage);
          return false;
        } v.sexError = undefined;
        if(!v.residence) {
          v.residenceError = true;
          $rootScope.toaster("error", "错误", $scope.CONSTANT.residenceNullMessage);
          return false;
        } v.residenceError = undefined;
        if(!v.birthday) {
          v.birthdayError = true;
          $rootScope.toaster("error", "错误", $scope.CONSTANT.birthdayNullMessage);
          return false;
        } v.birthdayError = undefined;
      }
    }
    if(stepFlag == 'recipient') { //验证受案信息
      for(var i = 0; i < $scope.police.policeRecipientInfoVOList.length; i++) {
        var v = $scope.police.policeRecipientInfoVOList[i];
        if(!v.recipientName) {
          v.recipientNameError = true;
          $rootScope.toaster("error", "错误", $scope.CONSTANT.recipientNameNullMessage);
          return false;
        } v.recipientNameError = undefined;
        if(!v.causeType) {
          v.causeTypeError = true;
          $rootScope.toaster("error", "错误", $scope.CONSTANT.causeTypeNullMessage);
          return false;
        } v.causeTypeError = undefined;
        if(!v.recipientDate) {
          v.recipientDateError = true;
          $rootScope.toaster("error", "错误", $scope.CONSTANT.recipientDateNullMessage);
          return false;
        } v.recipientDateError = undefined;
        if(!v.recipientRemark) {
          v.recipientRemarkError = true;
          $rootScope.toaster("error", "错误", $scope.CONSTANT.recipientRemarkNullMessage);
          return false;
        } v.recipientRemarkError = undefined;
      }
    }
    return true;
  };
  //验证车辆扣留信息
  var validateVehicle = function () {
    if($scope.police.policeVehicleInfoVOList.length > 0) { //当存在扣留车辆信息时，验证数据
      for(var i = 0; i< $scope.police.policeVehicleInfoVOList.length; i++) {
        var v = $scope.police.policeVehicleInfoVOList[i];
        if(!v.litigantName) {
          v.litigantNameError = true;
          $rootScope.toaster("error", "错误", $scope.CONSTANT.litigantNameNullMessage);
          return false;
        } v.litigantNameError = undefined;
        if(!v.plateNo) {
          v.plateNoError = true;
          $rootScope.toaster("error", "错误", $scope.CONSTANT.plateNoNullMessage);
          return false;
        } v.plateNoError = undefined;
        if(!v.detainDrivingLicense && v.detainDrivingLicense != '0') {
          v.detainDrivingLicenseError = true;
          $rootScope.toaster("error", "错误", $scope.CONSTANT.detainDrivingLicenseNullMessage);
          return false;
        } v.detainDrivingLicenseError = undefined;
        if(!v.detainVehicle && v.detainVehicle != '0') {
          v.detainVehicleError = true;
          $rootScope.toaster("error", "错误", $scope.CONSTANT.detainVehicleNullMessage);
          return false;
        } v.detainVehicleError = undefined;
        if(!v.detainDate && v.detainVehicle == '0') {
          v.detainDateError = true;
          $rootScope.toaster("error", "错误", $scope.CONSTANT.detainDateNullMessage);
          return false;
        } v.detainDateError = undefined;
        if(!v.returnDate && v.detainVehicle == '0') {
          v.returnDateError = true;
          $rootScope.toaster("error", "错误", $scope.CONSTANT.returnDateNullMessage);
          return false;
        } v.returnDateError = undefined;
      }
    }
    return true;
  };
  //验证委托鉴定信息
  var validateAppraise = function () {
    if($scope.police.policeAppraiseInfoVOList.length > 0) { //当存在委托登记信息时，验证数据
      for(var i = 0; i < $scope.police.policeAppraiseInfoVOList.length; i++) {
        var v = $scope.police.policeAppraiseInfoVOList[i];
        if(!v.applyerName) {
          v.applyerNameError = true;
          $rootScope.toaster("error", "错误", $scope.CONSTANT.applyerNameNullMessage);
          return false;
        } v.applyerNameError = undefined;
        if(!v.accreditationBodies) {
          v.accreditationBodiesError = true;
          $rootScope.toaster("error", "错误", $scope.CONSTANT.accreditationBodiesNullMessage);
          return false;
        } v.accreditationBodiesError = undefined;
        if(!v.identificationType) {
          v.identificationTypeError = true;
          $rootScope.toaster("error", "错误", $scope.CONSTANT.identificationTypeNullMessage);
          return false;
        } v.identificationTypeError = undefined;
        if(!v.identificationDate) {
          v.identificationDateError = true;
          $rootScope.toaster("error", "错误", $scope.CONSTANT.identificationDateNullMessage);
          return false;
        } v.identificationDateError = undefined;
        if(!v.identificationFinishDate) {
          v.identificationFinishDateError = true;
          $rootScope.toaster("error", "错误", $scope.CONSTANT.identificationFinishDateNullMessage);
          return false;
        } v.identificationFinishDateError = undefined;
      }
    }
    return true;
  };

  ////////////////////////时间选择控件///////////////////////////////
  $scope.today = new Date();
  //事故时间
  $scope.openAccidentDate = function($event, police) {
    $event.preventDefault();
    $event.stopPropagation();
    police.accidentDateIsOpen = true;
  };
  //出生日期
  $scope.openPersonBirthday = function($event, person) {
    $event.preventDefault();
    $event.stopPropagation();
    person.birthdayIsOpen = true;
  };
  //初次领证日期
  $scope.openCertificateDate = function($event, person) {
    $event.preventDefault();
    $event.stopPropagation();
    person.certificateDateIsOpen = true;
  };
  //有效期始
  $scope.openValidateStartDate = function($event, person) {
    $event.preventDefault();
    $event.stopPropagation();
    person.validateStartDateIsOpen = true;
  };
  //有效期止
  $scope.openValidateEndDate = function($event, person) {
    $event.preventDefault();
    $event.stopPropagation();
    person.validateEndDateIsOpen = true;
  };
  //保险终止日期
  $scope.openEndDate = function($event, person) {
    $event.preventDefault();
    $event.stopPropagation();
    person.endDateIsOpen = true;
  };
  //受案时间
  $scope.openRecipientDate = function($event, recipient) {
    $event.preventDefault();
    $event.stopPropagation();
    recipient.recipientDateIsOpen = true;
  };
  //车辆扣留日期
  $scope.openDetainDate = function($event, vehicle) {
    $event.preventDefault();
    $event.stopPropagation();
    vehicle.detainDateIsOpen = true;
  };
  //车辆返还日期
  $scope.openReturnDate = function($event, vehicle) {
    $event.preventDefault();
    $event.stopPropagation();
    vehicle.returnDateIsOpen = true;
  };
  //鉴定时间
  $scope.openIdentificationDate = function($event, appraise) {
    $event.preventDefault();
    $event.stopPropagation();
    appraise.identificationDateIsOpen = true;
  };
  //鉴定完成时间
  $scope.openIdentificationFinishDate = function($event, appraise) {
    $event.preventDefault();
    $event.stopPropagation();
    appraise.identificationFinishDateDateIsOpen = true;
  };

  //////////////////////////格式化数据///////////////////////////////
  //日期对象转化成字符串
  var dateToString = function (date) {
    if(typeof date === 'object') {
      date = $filter('date')(date, 'yyyy-MM-dd HH:mm:ss');
    } else {
      var nowDate = new Date(date.split(',').join('/'));
      date = $filter('date')(nowDate, 'yyyy-MM-dd HH:mm:ss');
    }
    return date;
  };
  //将后台时间转化成字符串
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

  ////////////////////////格式化数据/////////////////////////////////
  var formatData = function () {
    if ($scope.police.accidentDate) $scope.police.accidentDate = dateToString($scope.police.accidentDate);
    for(var i = 0; i < $scope.police.personInfoVOList.length; i++) {
      var v = $scope.police.personInfoVOList[i];
      if(v.birthday) v.birthday = dateToString(v.birthday);
      if(v.certificateDate) v.certificateDate = dateToString(v.certificateDate);
      if(v.validateStartDate) v.validateStartDate = dateToString(v.validateStartDate);
      if(v.validateEndDate) v.validateEndDate = dateToString(v.validateEndDate);
      if(v.endDate) v.endDate = dateToString(v.endDate);
    }
    for(var j = 0; j < $scope.police.policeRecipientInfoVOList.length; j++) {
      var v = $scope.police.policeRecipientInfoVOList[j];
      if (v.recipientDate) v.recipientDate = dateToString(v.recipientDate);
    }
    for(var k = 0; k < $scope.police.policeVehicleInfoVOList.length; k++) {
      var v = $scope.police.policeVehicleInfoVOList[k];
      if (v.detainDate) v.detainDate = dateToString(v.detainDate);
      if (v.returnDate) v.returnDate = dateToString(v.returnDate);
    }
    for(var o = 0; o < $scope.police.policeAppraiseInfoVOList.length; o++) {
      var v = $scope.police.policeAppraiseInfoVOList[o];
      if (v.identificationDate) v.identificationDate = dateToString(v.identificationDate);
      if (v.identificationFinishDate) v.identificationFinishDate = dateToString(v.identificationFinishDate);
    }
  };

  var formatJson = function () {
    if ($scope.police.accidentDate) $scope.police.accidentDate = parseISO8601($scope.police.accidentDate);
    for(var i = 0; i < $scope.police.personInfoVOList.length; i++) {
      var v = $scope.police.personInfoVOList[i];
      if(v.birthday) v.birthday = parseISO8601(v.birthday);
      if(v.certificateDate) v.certificateDate = parseISO8601(v.certificateDate);
      if(v.validateStartDate) v.validateStartDate = parseISO8601(v.validateStartDate);
      if(v.validateEndDate) v.validateEndDate = parseISO8601(v.validateEndDate);
      if(v.endDate) v.endDate = parseISO8601(v.endDate);
    }
    for(var j = 0; j < $scope.police.policeRecipientInfoVOList.length; j++) {
      var v = $scope.police.policeRecipientInfoVOList[j];
      if (v.recipientDate) v.recipientDate = parseISO8601(v.recipientDate);
    }
    for(var k = 0; k < $scope.police.policeVehicleInfoVOList.length; k++) {
      var v = $scope.police.policeVehicleInfoVOList[k];
      if (v.detainDate) v.detainDate = parseISO8601(v.detainDate);
      if (v.returnDate) v.returnDate = parseISO8601(v.returnDate);
    }
    for(var o = 0; o < $scope.police.policeAppraiseInfoVOList.length; o++) {
      var v = $scope.police.policeAppraiseInfoVOList[o];
      if (v.identificationDate) v.identificationDate = parseISO8601(v.identificationDate);
      if (v.identificationFinishDate) v.identificationFinishDate = parseISO8601(v.identificationFinishDate);
    }
  };


  function  NewPoliceInfo(){
    this.accidentAddress = $scope.police.accidentAddress;
    this.accidentDate = $scope.police.accidentDate;
    this.accidentNumber = $scope.police.accidentNumber;
    this.accidentRegion = $scope.police.accidentRegion;
    this.caseType = '1';
    this.idNo = $scope.police.idNo;
    this.cityCode = $scope.police.cityCode;
    this.highSpeed = $scope.police.highSpeed;
    this.serialNo = '110101201800912';

  }
  /////////////////////////查询交警案件并保存//////////////////////////////
  $scope.queryDetail = function () {
    //验证数据
    if(validate()) {

      //格式化证书编号中的字符[]【】，()（）
      $scope.police.accidentNumber = $scope.police.accidentNumber.split('');
      if($scope.police.accidentNumber.indexOf('【') != -1) {
        $scope.police.accidentNumber.splice($scope.police.accidentNumber.indexOf('【'), 1, '[');
      }
      if($scope.police.accidentNumber.indexOf('】') != -1) {
        $scope.police.accidentNumber.splice($scope.police.accidentNumber.indexOf('】'), 1, ']');
      }
      /*if($scope.police.accidentNumber.indexOf('(') != -1) {
        $scope.police.accidentNumber.splice($scope.police.accidentNumber.indexOf('('), 1, '（');
      }
      if($scope.police.accidentNumber.indexOf(')') != -1) {
        $scope.police.accidentNumber.splice($scope.police.accidentNumber.indexOf(')'), 1, '）');
      }*/
      $scope.police.accidentNumber = $scope.police.accidentNumber.join('');

      //格式化日期格式
      formatData();
      //保存数据到主表
      PoliceService.savePoliceInfo($scope.police).success(function (res) {
        if(res.code == PoliceConfig.commonConstant.SUCCESS){
          $scope.police = res.result;
          $rootScope.toaster("success", "成功", "正在查询数据，请稍后...");
          formatJson();
          var newPoliceInfo = new NewPoliceInfo();
          //跳转到案件信息页面
          var url = $state.href("policeLawCaseDetail",{"police":JSON.stringify(newPoliceInfo)});
          window.open(url,'_blank');
        }else {
          $rootScope.toaster("error", "错误", res.message);
        }
      });
    }
  };

  ////////////////////清空查询交警数据///////////////
  $scope.clearPolice = function () {
    if(confirm('确认清空？')) {
      var v = $scope.police;
      v.accidentNumber = "";
      v.cityCode = "";
      v.accidentRegion = "";
      v.accidentAddress = "";
      v.accidentDate = "";
      v.highSpeed = "";
      v.idNo = "";
    }
  };

  //验证身份证
  $scope.checkIdentity = function(person, isAgent) {
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
    if (person.idNo) {
      person.idNo = person.idNo.replace(/ /g, "");
      if (person.idNo.length == 15) {
        var year = person.idNo.substring(6, 8);
        var month = person.idNo.substring(8, 10);
        var day = person.idNo.substring(10, 12);
        var tempDate = new Date(year, parseFloat(month) - 1, parseFloat(day));
        if (tempDate.getYear() == parseFloat(year) && tempDate.getMonth() == parseFloat(month) - 1 && tempDate.getDate() == parseFloat(day)) {
          person.birthday = tempDate;
          person.sex = person.idNo.substring(14, 15) % 2 == 0 ? '1' : '0';
          person.idNoError = false;
        } else {
          person.idNoError = true;
          $rootScope.toaster("error", "错误", $scope.CONSTANT.messageIdentityFormatError);
        }
      } else if (person.idNo.length == 18 && isTrueValidateCodeBy18IdCard(person.idNo)) {
        var year = person.idNo.substring(6, 10);
        var month = person.idNo.substring(10, 12);
        var day = person.idNo.substring(12, 14);
        var tempDate = new Date(year, parseFloat(month) - 1, parseFloat(day));
        if (tempDate.getFullYear() == parseFloat(year) && tempDate.getMonth() == parseFloat(month) - 1 && tempDate.getDate() == parseFloat(day)) {
          person.birthday = tempDate;
          person.sex = person.idNo.substring(16, 17) % 2 == 0 ? '1' : '0';
          person.idNoError = false;
        } else {
          person.idNoError = true;
          $rootScope.toaster("error", "错误", $scope.CONSTANT.messageIdentityFormatError);
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
        if (!(taiwanreg.test(person.idNo) || xianggangreg.test(person.idNo) || xianggangreg1.test(person.idNo) || aomenreg.test(person.idNo) || aomenreg1.test(person.idNo))) {
          //TODO
          person.idNoError = true;
          $rootScope.toaster("error", "错误", $scope.CONSTANT.messageIdentityFormatError);
        } else person.idNoError = false;
      }

      if (isAgent && person.certificatesType!=0) {
        person.birthday = person.sex = undefined;
      }
    }
    return person.idNoError;
  };

  /////////////////////////展开、收起更多信息/////////////////////////
  $scope.handelDetailToggle = function (target) {
    target.isShowDetail = !target.isShowDetail;
  };

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

