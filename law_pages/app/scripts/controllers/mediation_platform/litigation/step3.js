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
app.filter('stringDate', function () {
  return function (dt) {
    if (typeof (dt) == "string") {
      dt = dt.replace(/\-/gi, "\/");
      dt = Date.parse(dt);
    }
    return dt && dt;
  }
});
app.filter('filterRegions', function () {
  return function(arr) {
    return  arr.filter(function(v) {
      return v.level!= 4
    })
  }
});
angular.module('sbAdminApp').controller('step3Ctrl', function($scope, $stateParams, $state, $location, $timeout, $http, $log, $filter, $modal, AdjustService, AdjustConfig, DictionaryConfig, AdminConstant,toaster,$rootScope) {
	$scope.co.step = 3;
  //性别集合
  $scope.sexList = DictionaryConfig.sexList;
  //填充区域信息
  $scope.cityRegion = AdminConstant.administrationRegions.filter(function (v) {return v.level!= 4});
  //请求公安信息
  $scope.policeAccidentInfoService = AdjustService.policeAccidentInfo;

  $scope.CONSTANT = {
    accidentNumberErrorMessage:'事故认定书编号不能为空',
    highSpeedErrorMessage:'请选择是否高速',
    idNoErrorMessage:'请选择一个当事人',
    cityCodeErrorMessage:'请选择事故地点'
  }

  //公安接口弹出框
  $scope.model = function(){
    var popupModal = $modal.open({//打开弹窗页
      templateUrl:'views/pages/mediation_platform/litigation_mediation/police.html',
      controller:'PolicePopupCtrl',
      size:'lg',
      resolve:{
        items:function(){
          return {
            serialNo : $scope.adjust.serialNo
          }
        }
      }
    });
    //弹出框的返回值
    popupModal.result.then(function(data){

    })

  }

  //提交公安信息
  $scope.policeSubmit = function () {
    if(validateForm()){
      //格式化证书编号中的字符[]【】，()（）
      $scope.adjust.police.accidentNumber = $scope.adjust.police.accidentNumber.split('');
      if($scope.adjust.police.accidentNumber.indexOf('【') != -1) {
        $scope.adjust.police.accidentNumber.splice($scope.adjust.police.accidentNumber.indexOf('【'), 1, '[');
      }
      if($scope.adjust.police.accidentNumber.indexOf('】') != -1) {
        $scope.adjust.police.accidentNumber.splice($scope.adjust.police.accidentNumber.indexOf('】'), 1, ']');
      }
      $scope.adjust.police.accidentNumber = $scope.adjust.police.accidentNumber.join('');

      var adjust = {};
      $scope.adjust.applicantArray.filter(function(v){
        return v.personType==0;
      }).forEach(function(v){
        if(adjust.applicant)  adjust.applicant += "," + v.personName;
        else  adjust.applicant = v.personName;
      });

      adjust.respondent = $scope.adjust.applicantArray.filter(function(v){
          return v.personType==1;
      }).map(function(k){
        if(k.personName){
          return k.personName;
        }else{
          return k.orgName;
        }
      }).join(",");

      adjust.serialNo = $scope.adjust.serialNo;
      adjust.adjustDate = $filter("date")($scope.adjust.adjustDate,'yyyy-MM-dd');
      adjust.lawMoney = $scope.adjust.lawMoney;
      adjust.adjustOrgName = $scope.adjust.adjustOrgName;
      var url = $state.href("publicSecurity",{"police":JSON.stringify($scope.adjust.police),"adjust":JSON.stringify(adjust)});
      window.open(url,'_blank');
    }
  }

  //验证提交的公安信息
  function validateForm() {
    $scope.idNoError="";
    $scope.accidentNumberError="";
    $scope.cityCodeError="";
    $scope.highSpeedError="";
    //编号
    if(!$scope.adjust.police.accidentNumber){
      $("[name='accidentNumber']").focus();
      $scope.accidentNumberError = $scope.CONSTANT.accidentNumberErrorMessage;
      $rootScope.toaster('error', '错误', $scope.accidentNumberError);
      return false;
    }
    /*if(!$scope.adjust.police.cityCode){
      $("[name='cityName']").focus();
      $scope.cityCodeError = $scope.CONSTANT.cityCodeErrorMessage;
      $rootScope.toaster('error', '错误', $scope.cityCodeError);
      return false;
    }
    //高速
    if(!$scope.adjust.police.highSpeed){
      $("[name='highSpeed']").focus();
      $scope.highSpeedError = $scope.CONSTANT.highSpeedErrorMessage;
      $rootScope.toaster('error', '错误', $scope.highSpeedError);
      return false;
    }*/
    //身份证
    if(!$scope.adjust.police.idNo){
      $("[name='idNo']").focus();
      $scope.idNoError = $scope.CONSTANT.idNoErrorMessage;
      $rootScope.toaster('error', '错误', $scope.idNoError);
      return false;
    }
    //填充地区，是否高速
    //if(!$scope.adjust.police.cityCode) $scope.adjust.police.cityCode = '130100';
    //if(!$scope.adjust.police.cityName) $scope.adjust.police.cityName = '河北省-石家庄市';
    //if(!$scope.adjust.police.highSpeed) $scope.adjust.police.highSpeed = '1';

    $scope.adjust.police.cityCode = '';
    $scope.adjust.police.cityName = '';
    $scope.adjust.police.highSpeed = '';
    return true;
  }
  //选择申请人呢
  $scope.selectApplicant = function (applicant) {
    $scope.adjust.police.idNo = applicant.idNo;
  }
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
      if ($scope.adjust.police.cityName != selectedRegion.fullName) {
        $scope.adjust.police.cityName = selectedRegion.fullName;
        $scope.adjust.police.cityCode = selectedRegion.regionCode;
        $scope.cityNameError = undefined;
        angular.element("#cityNamebox").hide();
        $scope.isShowTree = false;
      }

    }
  };

})


angular.module('sbAdminApp').controller('PolicePopupCtrl', function($scope, $stateParams, $state,$modalInstance, InterfaceService,InterfaceConfig,items,$location, $timeout, $http, $log, $filter, $modal, AdjustService, AdjustConfig, DictionaryConfig) {

  $scope.interfaceService = InterfaceService;

  $scope.queryCondition = {
    idNo : "",
    accidentNumber : "",
    cityCode : "",
    highSpeed : "",
    queryReason : "1"
  }

  //定义错误信息常量
  $scope.CONSTANT = {
    "idNoErrorMessage": "请您输入身份证号",
    "accidentNumberErrorMessage": "请您输入事故认定书号",
    "cityCodeErrorMessage": "请您输入发生地代码",
    "highSpeedErrorMessage" :"请您选择是否高速"
  };

  function validateForm(){
    $scope.idNoError="";
    $scope.accidentNumberError="";
    $scope.cityCodeError="";
    $scope.highSpeedError="";
    if(!$scope.queryCondition.idNo){
      $("[name='idNo']").focus();
      $scope.idNoError = $scope.CONSTANT.idNoErrorMessage;
      return false;
    }
    if(!$scope.queryCondition.accidentNumber){
      $("[name='accidentNumber']").focus();
      $scope.accidentNumberError = $scope.CONSTANT.accidentNumberErrorMessage;
      return false;
    }
    if(!$scope.queryCondition.cityCode){
      $("[name='cityCode']").focus();
      $scope.cityCodeError = $scope.CONSTANT.cityCodeErrorMessage;
      return false;
    }
    if(!$scope.queryCondition.highSpeed){
      $("[name='highSpeed']").focus();
      $scope.highSpeedError = $scope.CONSTANT.highSpeedErrorMessage;
      return false;
    }


    return true;
  }
  
  $scope.ok = function(){
    if(validateForm()){
      $scope.queryCondition.serialNo = items.serialNo;
      $scope.interfaceService.policeAcr1Url($scope.queryCondition).success(function(result){
        //请求成功
        if (result.code ==  InterfaceConfig.commonConstant.SUCCESS) {
          console.log(result)
          // $modalInstance.close({
          //   interfaceConfig:$scope.interfaceConfigNew
          // });
        }else{
          //TODO
          alert("请联系系统管理员");
        }
      })
    }

  }

  //取消
  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };


});

//原生js调用angular中的scope参数
function setAngularScopeParam(msg){
  // 通过controller来获取Angular应用
  var appElement = document.querySelector('[ng-controller=step3Ctrl]');
  // //获取$scope变量
  var $scope = angular.element(appElement).scope();
  //调用msg变量，并改变msg的值
  if(!$scope.adjust.factReason){
      $scope.adjust.factReason = msg;
  }
  // //上一行改变了msg的值，如果想同步到Angular控制器中，则需要调用$apply()方法即可
  $scope.$apply();
}