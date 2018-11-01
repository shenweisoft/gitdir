var app = angular.module('sbAdminApp');

app.filter('id2Text', function () {
  return function (id, data) {
    var result = _.find(data, {
      id: id + ""
    });
    return result ? result.value : ""
  }
});
app.filter('idText', function () {
  return function (id, data) {
    var str = '';
    data.forEach(function (val,index) {
      if(id.indexOf(val.id) != -1){
        if(index == data.length-1){
          str += val.value
        }else{
          str += val.value + ' '
        }
      }
    })
    return  str && str
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

app.filter('stringSpace', function() {
  return function(str) {
    if(str)
    {
      str = str.replace(/\s/gi,"+");
    }
    return str && str;
  }
});

angular.module('sbAdminApp').controller('AIOCaseDetailCtrl', function (PoliceService, PoliceConfig,AdminConstant,$location,$scope, $stateParams, $state, $modal, AdjustConfig, AdjustService, $http, $log, AlgorithmConfig, AlgorithmService, DictionaryConfig, $timeout) {
  $scope.showHeaderQuitBtn = true; //显示头部退出按钮
  $scope.showHeaderBackBtn = true; //显示头部返回按钮
  $scope.flag = $stateParams.flag; //默认显示事故基础信息
  $scope.press = '';
  $scope.hintShow = true;
  $scope.hineTxt = "正在加载案件信息";

  //天气列表
  $scope.weatherList = DictionaryConfig.weatherList;
  //性别列表
  $scope.sexList = DictionaryConfig.sexLists;
  //名族U
  $scope.famousList = DictionaryConfig.famousList;
  //国籍
  $scope.countryList = DictionaryConfig.countryList;
  //交通方式
  $scope.transportationList = DictionaryConfig.transportationList;
  //事故类型
  $scope.accidentTypeList = PoliceConfig.accidentTypeList;
  //检测鉴定类型
  $scope.policeAppraisalType = PoliceConfig.policeAppraisalType;
  //交通方式
  $scope.trafficTypeList = PoliceConfig.trafficTypeList;
  //准驾车型
  $scope.drivingList = PoliceConfig.drivingList;
  //伤害程度
  $scope.hurtList = PoliceConfig.hurtList;
  //恶劣情节
  $scope.abominablePlotList = PoliceConfig.abominablePlotList;
  //驾驶证
  $scope.drivingLicenceList = PoliceConfig.drivingLicenceList;
  //车辆类型
  $scope.vehicleTypeList = PoliceConfig.vehicleTypeList;
  //号牌种类
  $scope.plateTypeList = DictionaryConfig.plateTypeList;
  //车辆损失
  $scope.vehicleLossList = PoliceConfig.vehicleLossList;
  //请求公安信息
  $scope.policeAccidentInfoService = AdjustService.policeAcr1And3;
  //投保险种
  $scope.riskTypesList = PoliceConfig.riskTypesList;

  $scope.imageAddress = AdjustConfig.pictureConstant.OneMachinePictureUrl;

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
  //交警对象构造函数
  function  NewPoliceInfo(police){
    this.accidentAddress = police.accidentAddress;
    this.accidentDate = police.accidentDate;
    this.accidentNumber = police.accidentNumber;
    this.accidentRegion = police.accidentRegion;
    this.caseType = '1';
    this.idNo = "142601198809064630";//police.idNo;
    this.cityCode = police.cityCode;
    this.highSpeed = police.highSpeed;
    this.serialNo = '110101201800912';
  }

  //初始化数据
  $scope.initData = function () {
    //请求公安信息
    /*var police = new NewPoliceInfo($scope.police);
    $scope.policeAccidentInfoService(police).success(function(res) {
      $scope.noConetHide = true;
      if (res.code == AdjustConfig.commonConStant.SUCCESS) {
        $scope.policeAccidentInfo = res.result.policeAccidentInfo;
        $scope.acdphotos =  res.result.acdphotos;
        //隐藏等待文字，显示信息
        $scope.hintShow = false;
      } else  {
        //toaster.pop('error', '错误',res.message );
      }
    });*/

    //请求公安案件信息
    PoliceService.queryAccident({id: $stateParams.id, personCard: $stateParams.personCard, type: 'YTJ'}).success(function (res) {
      $scope.noConetHide = true;
      if (res.code == AdjustConfig.commonConStant.SUCCESS) {
        $scope.police = res.result;
        if($scope.police.json) { //判断是否存在交警数据
          $scope.police.json = JSON.parse($scope.police.json);
          console.log($scope.police.json)
        }
        console.log($scope.police)
        //如果没有检验鉴定信息，则显示事故信息
        if(!$scope.police.appraisalInfoList || $scope.police.appraisalInfoList.length == '0') {
          $scope.flag = 'accident';
        }
        //隐藏等待文字，显示信息
        $scope.hintShow = false;
      } else  {
        //toaster.pop('error', '错误',res.message );
      }
    });
  };

  ////////////////////事故人员信息查看/////////////////////////
  $scope.popupModal1 = function (vehicle) { //机动车
    var popupModal = $modal.open({//打开弹窗页
      templateUrl:'views/pages/AIO/AIOPoliceCar.html',
      controller:'policeCarCtrl',
      size:'lg',
      resolve:{
        items:function(){
          return {
            vehicle:vehicle
          }
        }
      }
    });
    //弹出框的返回值
    popupModal.result.then(function(data){
    }, function () {
    })
  };
  $scope.popupModal2 = function (drivinglicense) { //驾驶证
    var popupModal = $modal.open({//打开弹窗页
      templateUrl:'views/pages/AIO/AIOPoliceLicenseInfo.html',
      controller:'policeCarCtrl',
      size:'lg',
      resolve:{
        items:function(){
          return {
            drivinglicense:drivinglicense
          }
        }
      }
    });
    //弹出框的返回值
    popupModal.result.then(function(data){
    })
  };
  $scope.popupModal3 = function (asks) { //询话
    var popupModal = $modal.open({//打开弹窗页
      templateUrl:'views/pages/AIO/AIOPoliceInquiry.html',
      controller:'policeCarCtrl',
      size:'lg',
      resolve:{
        items:function(){
          return {
            asks:asks
          }
        }
      }
    });
    //弹出框的返回值
    popupModal.result.then(function(data){
    })
  };
  $scope.popupModal4 = function (testtimes) { //检验
    var popupModal = $modal.open({//打开弹窗页
      templateUrl:'views/pages/AIO/AIOPoliceTestResult.html',
      controller:'policeCarCtrl',
      size:'lg',
      resolve:{
        items:function(){
          return {
            testtimes:testtimes
          }
        }
      }
    });
    //弹出框的返回值
    popupModal.result.then(function(data){
    })
  };
  ///////////////////////////////////////////////////////////////////

  //左侧菜单切换显示信息
  $scope.handleMenu = function (type) {
    $scope.flag = type;
  };

  //打印
  $scope.handleStamp = function () {
    $timeout(function () {
      $scope.hintShow = true;
      $scope.hineTxt = "正在连接打印机";
      PoliceService.printDataInfo({serialNo: $scope.policeAccidentInfo.acdfile.djbh}).success(function (res) {
        if (res.code == AdjustConfig.commonConStant.SUCCESS) {
          $scope.infoBoxShow = true;
          $scope.infoBoxShowTxt = '正在打印，请稍候';
        } else {
          $scope.infoBoxShow = true;
          $scope.infoBoxShowTxt = '打印失败，请重试';
        }
        $scope.hintShow = false;
      })
    }, 101)
  };
  $scope.bigPic = function(appraisalInfo) {
    $state.go("AIOPic", {appraisalId: appraisalInfo.id});
  };
  //初始化数据
  $scope.initData();
});

angular.module('sbAdminApp').controller('policeCarCtrl', function($scope, $stateParams, $state,$modalInstance,items,$timeout,DictionaryConfig) {
  $scope.vehicle = items.vehicle;
  $scope.drivinglicense = items.drivinglicense;
  $scope.asks = items.asks;
  $scope.testtimes = items.testtimes;
  //号牌种类
  $scope.plateTypeList = DictionaryConfig.plateTypeList;
  //身份证明名称
  $scope.cardName = DictionaryConfig.cardName;
  //使用性质
  $scope.useNature = DictionaryConfig.useNature;
  //状态
  $scope.useNature = DictionaryConfig.useNature;
  //准驾类型
  $scope.drivingType = DictionaryConfig.drivingType;
  //驾驶证期限
  $scope.licenseDeadline = DictionaryConfig.licenseDeadline;
  //驾驶证状态
  $scope.licenseStatus = DictionaryConfig.licenseStatus;
  //检验类型
  $scope.inspectionType = DictionaryConfig.inspectionType;
  //机动车状态
  $scope.vehicleStatus = DictionaryConfig.vehicleStatus;
  //车辆类型
  $scope.carList = DictionaryConfig.carList;
  //取消
  $scope.cancel = function() {
    $timeout(function () {
      $modalInstance.dismiss('cancel');
    }, 101)
  };
});