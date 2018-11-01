angular.module('sbAdminApp').controller('AIOScanIdNoCtrl', function ($timeout,AdminConstant,$location,$scope, $stateParams, $state) {
  $scope.showHeaderBackBtn = true; //返回按钮显示

  var g_iPort = 1001;//端口号；USB = 1001 ~ 1016 ，COM端口 = 1~16
  function hxgc_ReadIDCard(){
      $scope.readTimeout = $timeout(function() {
          var iResult = 0;
          iResult = objActiveX.hxgc_ReadIDCard(g_iPort);//读二代证
          if(iResult == 0) {
              $scope.idNo = objActiveX.hxgc_GetIDCode();
              //跳转到案件列表页
              $state.go("AIOCaseList", {idNo: $scope.idNo, flag: $stateParams.flag});
          }else{
              hxgc_ReadIDCard();
              console.log( "读二代证信息失败，错误代码：" + iResult + ".");
          }
      }, 2000);
  }

  function hxgc_OpenReader(){
    var iResult = 0;
    iResult = objActiveX.hxgc_OpenReader(g_iPort);//打开设备
    if(iResult == 0){
      var strSAMID = objActiveX.hxgc_GetSamIdToStr(g_iPort);//获取SAMID
      hxgc_ReadIDCard();
      console.log("打开设备成功.\r\nSAMID = " + strSAMID + ".");
    }
    else{
      console.log("打开设备失败，错误代码：" + iResult + ".");
    }
  }

  //身份证移动动画
  function idCardAnimate() {
    $(".AIO_scan_card").animate({'left': '460px'},2200, 'linear', function () {
      $(".AIO_scan_card").css('left', '882px');
      idCardAnimate();
    })
  }
  idCardAnimate();

  //判断浏览器是否为ie 非ie下运行会报错
  function isIE() {
    if (!!window.ActiveXObject || "ActiveXObject" in window){
      hxgc_OpenReader();
    }
  }
  isIE();
});

