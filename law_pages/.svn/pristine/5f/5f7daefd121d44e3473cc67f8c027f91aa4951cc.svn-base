/**
 * Created by Administrator on 2018/3/21.
 */

'use strict';
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

angular.module('sbAdminApp').controller('placeLawCaseDetail', function($scope, $stateParams, $state, $location, $timeout, $http, $log, $filter, $modal, AdjustService, AdjustConfig, toaster,DictionaryConfig,PoliceService,PoliceConfig) {
  //头部显示和隐藏
  $scope.detailsHeadShow = true;
  //初始化显示的第一个页面
  $scope.pagesChoose = 'environment';
  //请求公安信息
  $scope.policeAccidentInfoService = AdjustService.policeAccidentInfo;
  //公安信息请求参数
  $scope.police = $stateParams.police? JSON.parse($stateParams.police) : '';
  //按钮显示隐藏控制
  $scope.isShowBtn = $stateParams.isShowBtn;
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


  //请求公安信息
  $scope.noConetHide = true;
  if(getObjAttrNum($scope.police) == 1) { //只有一个属性  证明是认定书号查询
    //道交法官页面而来，通过身份证号查找
    AdjustService.selectPoliceAccidentInfo({"accidentNumber": $scope.police.accidentNumber}).success(function (res) {
      if(res.code == PoliceConfig.commonConstant.SUCCESS){
        console.log(res)
        $scope.adjust = res.result;
        $scope.policeAccidentInfo = res.result.policeAccidentInfo;
        $scope.acdphotos =  res.result.acdphotos;
        $scope.noConetHide = false;
      } else {
        toaster.pop("error", "错误", res.message);
        $scope.adjustNull = true;
      }
    });
  } else {
    //交警页面跳转
    PoliceService.selectPoliceAccidentInfo($scope.police).success(function (res) {
      console.log(res)
      if(res.code == PoliceConfig.commonConstant.SUCCESS){
        $scope.adjust = res.result;
        $scope.policeAccidentInfo = res.result.policeAccidentInfo;
        $scope.acdphotos =  res.result.acdphotos;
        $scope.noConetHide = false;
      }else {
        toaster.pop("error", "错误", res.message);
        $scope.adjustNull = true;
      }
    });
  }

  //获取对象属性个数
  function getObjAttrNum(obj) {
    var num = 0;
    for(var i in obj) {
      if(obj[i]) {
        num++;
      }
    }
    return num;
  };

  $scope.popupModal1 = function (vehicle) { //机动车
    //if(vehicle) {
      var popupModal = $modal.open({//打开弹窗页
        templateUrl:'views/pages/police/policeCar.html',
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

      })
    //} else {
      //toaster.pop("error", "错误", "无相关数据");
    //}
  };
  $scope.popupModal2 = function (drivinglicense) { //驾驶证
    //if(drivinglicense) {
      var popupModal = $modal.open({//打开弹窗页
        templateUrl:'views/pages/police/policeLicenseInfo.html',
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
    //} else {
      //toaster.pop("error", "错误", "无相关数据");
    //}
  };
  $scope.popupModal3 = function (asks) { //询话
    //if(asks) {
      var popupModal = $modal.open({//打开弹窗页
        templateUrl:'views/pages/police/policeInquiry.html',
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
    //} else {
      //toaster.pop("error", "错误", "无相关数据");
    //}
  };
  $scope.popupModal4 = function (testtimes) { //检验
    //if(testtimes) {
      var popupModal = $modal.open({//打开弹窗页
        templateUrl:'views/pages/police/policeTestResult.html',
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
    //} else {
      //toaster.pop("error", "错误", "无相关数据");
    //}
  };
  //关闭当前页
  $scope.closePage = function () {
    if(confirm('是否关闭当前页')) {
      window.close();
    }
  };
  //添加至补录列表
  $scope.addLawCase = function () {
    $scope.police.accidentAddress = $scope.policeAccidentInfo.acdfile.sgdd; //事故地点
    //循环遍历受案人
    var people = [];
    for(var i = 0; i < $scope.policeAccidentInfo.humans.length; i++) {
      people.push($scope.policeAccidentInfo.humans[i].xm)
    }
    $scope.police.recipientName = people.join(',');
    $scope.police.causeType = "1";
    $scope.police.accidentDate = $scope.policeAccidentInfo.acdfile.sgfssj; //事故时间

    //处理时间格式
    if($scope.police.accidentDate.length == 16) {
      $scope.police.accidentDate = $scope.police.accidentDate+':00';
    } else if($scope.police.accidentDate.length == 13) {
      $scope.police.accidentDate = $scope.police.accidentDate+':00:00';
    }

    //保存至主表
    PoliceService.savePoliceInfo($scope.police).success(function (res) {
      if(res.code == PoliceConfig.commonConstant.SUCCESS){
        console.log(res);
        $scope.police.id = res.result.id;
        toaster.pop("success", "成功", "保存成功！");
        //d调用父页面方法
        window.opener.setAngularScopeParam();
      }else {
        toaster.pop("error", "错误", res.message);
      }
    });


    //$state.go("supplementPoliceLawCase");
  };
});
angular.module('sbAdminApp').controller('policeCarCtrl', function($scope, $stateParams, $state,$modalInstance,items,DictionaryConfig,AdjustConfig) {
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
    $modalInstance.dismiss('cancel');
  };
});
