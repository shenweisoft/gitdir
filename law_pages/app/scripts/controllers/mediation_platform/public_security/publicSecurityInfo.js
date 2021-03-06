/**
 * Created by Administrator on 2017/8/2 0002.
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
angular.module('sbAdminApp').controller('publicSecrityInfoCtrl', function($scope, $stateParams, $state, $location, $timeout, $http, $log, $filter, $modal, AdjustService, AdjustConfig, toaster,DictionaryConfig,$rootScope) {
  console.log($stateParams)
  //头部显示和隐藏
  $scope.detailsHeadShow = true;
  //初始化显示的第一个页面
  $scope.pagesChoose = 'environment';
  //请求公安信息
  $scope.policeAccidentInfoService = AdjustService.policeAccidentInfo;
  $scope.policeAcdphotosInfoService = AdjustService.policeAcdphotosInfo;
  //保存第一次返回的数据
  $scope.savePolice = AdjustService.savePolice;
  //保存公安信息
  $scope.savePoliceAccidentinfo = AdjustService.savePoliceAccidentinfo

  //公安信息请求参数
  $scope.police = JSON.parse($stateParams.police);
  $scope.police.caseType = "1"; //查询原因  1：调解2：诉讼
  $scope.noConetHide = true;
  //调解信息
  $scope.adjust = JSON.parse($stateParams.adjust);
  $scope.police.serialNo = $scope.adjust.serialNo || '1';

  $scope.police.cityCode = $scope.police.cityCode? $scope.police.cityCode : '131000 ';
  $scope.police.cityName = $scope.police.cityName? $scope.police.cityName : '河北省-廊坊市-市辖区 ';
  $scope.police.highSpeed = $scope.police.highSpeed? $scope.police.highSpeed : '1';

  //没有相关数据
  $scope.isEmpty = false;
  //查询数据出错
  $scope.isError = false;
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
  //图片请求头部
  $scope.imageAddress = AdjustConfig.pictureConstant.publicSecrityInfoImg;

  $scope.CONSTANT = {
    "messageNullError":"不能发送空信息",
    "messageSendError":"信息发送失败",
    "messageSessionDestroy":"会话已经销毁"
  }
  //$scope.noConetHide=true;
/*
  //请求公安信息
  $scope.policeAccidentInfoService($scope.police).success(function(res) {
    $scope.noConetHide = true;
    if (res.code == AdjustConfig.commonConStant.SUCCESS) {
      $scope.policeAccidentInfo = res.result.policeAccidentInfo;
      if($scope.policeAccidentInfo.duty){ //将子窗体中的值传递到父窗体中去
        window.opener.setAngularScopeParam($scope.policeAccidentInfo.duty.jbss);
      }else if($scope.policeAccidentInfo.proof){
        window.opener.setAngularScopeParam($scope.policeAccidentInfo.proof.jbss);
      }else if($scope.policeAccidentInfo.simpleduty){
        window.opener.setAngularScopeParam($scope.policeAccidentInfo.simpleduty.jbss);
      }
      if($scope.policeAccidentInfo.acdfile.djbh){
        $scope.police.registerNumber = $scope.policeAccidentInfo.acdfile.djbh;
        $scope.getAcdphotosInfo();
      }
    } else  {
      $rootScope.toaster('error', '错误',res.message );
    }
  });


  //请求公安图片信息
  $scope.getAcdphotosInfo = function(){
    $scope.policeAcdphotosInfoService($scope.police).success(function(res) {
      $scope.noConetHide = true;
      if (res.code == AdjustConfig.commonConStant.SUCCESS) {
        if(res.result){
          $scope.acdphotos =  res.result.acdphotos;
        }
      } else  {
        $rootScope.toaster('error', '错误',res.message );
      }
    });
  }
*/

  //判断浏览器当前协议，动态切换服务
  //var websocketUrl = document.location.protocol == 'http'? "ws://210.73.66.152/lawDataExchangeProject/websocket?" : "wss://210.73.66.152/lawDataExchangeProject/websocket?";
  var websocketUrl = "ws://210.73.66.152/lawDataExchangeProject/websocket?";
  //var websocketUrl = "ws://192.168.223.248:8080/lawDataExchange/websocket/?";
  if('WebSocket' in window) {
    console.log("此浏览器支持webSocket");
    var host = $location.host();
    var date =  Date.parse(new Date()) ;
    var urlParam = "serialNo="+$scope.police.serialNo+"&key="+date;
    $scope.webSocket = new WebSocket(websocketUrl+urlParam);
  } else if('MozWebSocket' in window) {
    console.log("此浏览器只支持MozWebSocket")
  } else {
    console.log("此浏览器只支持SockJS");
  }
  $scope.webSocket.onopen = function (event) {
    console.log("链接服务器成功!");
    var param = angular.copy($scope.police);
    param.jkid = "ACDR1";
    $scope.sendMessage(param);
  }


  // $scope.savePoliceData = function (data) {
  //   var param = "&serialNo="+data.serialNo+"&idNo="+data.idNo+"&accidentNumber="+data.accidentNumber+"&cityCode="+data.cityCode+"&isHighSpeed="+data.isHighSpeed+"&xmlDoc="+data.xmlDoc;
  //   // $http({
  //   //   method: 'JSONP',
  //   //   url: 'http://localhost:8088/lawDataExchangeProject/interface/savePolice?callback=JSON_CALLBACK'+param,
  //   //   data: data
  //   // }).success(function(res) {
  //   //   console.log("--------");
  //   //   if (res.code == AdjustConfig.commonConStant.SUCCESS) {
  //   //   } else  {
  //   //     $rootScope.toaster('error', '错误',res.message );
  //   //   }
  //   // });
  //   $http.jsonp("http://localhost:8088/lawDataExchangeProject/interface/savePolice?callback=JSON_CALLBACK"+param).success(function(data){
  //       console.log(data);
  //       // alert(data);
  //     }
  //   );
  //
  // }
  $scope.reload = function () {
    location.reload();
  }
  $scope.savePoliceAccident = function () {
    $scope.savePoliceAccidentinfo($scope.police).success(function (res) {
      if (res.code == AdjustConfig.commonConStant.SUCCESS) {

      }else{
        $scope.error();
        //toaster.pop('error','错误',res.message)
      }
    })
  }

  $scope.webSocket.onmessage = function(event) {
    console.log(event.data)
    $scope.savePoliceAccident();
    var data = JSON.parse(event.data)
    $scope.firstData = data
    if(data.body && data.body.acdfile){
      $scope.policeAccidentInfo = data.body;
      console.log($scope.policeAccidentInfo);

      //页面展示
      $scope.noConetHide = false;
      $scope.pagesChoose = 'environment';

      if($scope.policeAccidentInfo.duty){ //将子窗体中的值传递到父窗体中去
        window.opener.setAngularScopeParam($scope.policeAccidentInfo.duty.jbss);
      }else if($scope.policeAccidentInfo.proof){
        window.opener.setAngularScopeParam($scope.policeAccidentInfo.proof.jbss);
      }else if($scope.policeAccidentInfo.simpleduty){
        window.opener.setAngularScopeParam($scope.policeAccidentInfo.simpleduty.sgss);
      }

    }else if(data.body &&  data.body.acdphotos){
      $scope.acdphotos = data.body.acdphotos;
    }else{
      $scope.noConetHide = false;
      $scope.isEmpty = true;
      $scope.isError = false;
     // $rootScope.toaster('info', '提示','未查询到相关信息！' );
    }
    //隐藏查询图片的等待样式
    $scope.isImgSearch = false;
    $scope.$apply();

  };
  $scope.error = function () {
    $scope.noConetHide = false;
    $scope.isEmpty = false;
    $scope.isError = true;
  }
  $scope.webSocket.onerror = function(event) {};
  $scope.webSocket.onclose = function(event) {
    $scope.error();
    console.log("与服务器断开了链接!")
  }

  // 发送消息
  $scope.sendMessage = function(data) {
    if($scope.webSocket != null) {
      console.log('发送消息：' + JSON.stringify(data))
      $scope.webSocket.send(JSON.stringify(data));
    } else {
      console.log('未与服务器链接.');
      $scope.error();
      //toaster.pop(level.error, title.error, $scope.CONSTANT.messageSendError);
    }
  }

  window.onbeforeunload = function(){
    $scope.webSocket.close();
  }

  $scope.imageRecordClick = function () {
    if($scope.policeAccidentInfo.acdfile.sglx != '1') {
      return;
    }
    var data = $scope.firstData
    if(data.body && data.body.acdfile) {
      $scope.isImgSearch = true;
      $scope.policeAccidentInfo = data.body;
      console.log($scope.policeAccidentInfo);
      //发送第二条数据
      var param = angular.copy($scope.police);
      param.jkid = "ACDR2";
      param.registerNumber = data.body.acdfile.djbh;
      param.caseType = '1';
      $scope.sendMessage(param)
    }
  }



  $scope.popupModal1 = function (vehicle) { //机动车
    var popupModal = $modal.open({//打开弹窗页
      templateUrl:'views/pages/mediation_platform/public_security/car.html',
      controller:'carCtrl',
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
  }
  $scope.popupModal2 = function (drivinglicense) { //驾驶证
    var popupModal = $modal.open({//打开弹窗页
      templateUrl:'views/pages/mediation_platform/public_security/licenseInfo.html',
      controller:'carCtrl',
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
  }
  $scope.popupModal3 = function (asks) { //询话
    var popupModal = $modal.open({//打开弹窗页
      templateUrl:'views/pages/mediation_platform/public_security/inquiry.html',
      controller:'carCtrl',
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
  }
  $scope.popupModal4 = function (testtimes) { //检验
    var popupModal = $modal.open({//打开弹窗页
      templateUrl:'views/pages/mediation_platform/public_security/testResult.html',
      controller:'carCtrl',
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
  }
})
angular.module('sbAdminApp').controller('carCtrl', function($scope, $stateParams, $state,$modalInstance,items,DictionaryConfig,AdjustConfig) {
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
  $scope.carList = DictionaryConfig.carList
  //取消
  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
});