/**
 * Created by shenwei on 2017/4/11.
 */
var app = angular.module('sbAdminApp');
app.filter('str2JsonContent', function() {
    return function(extPro) {
        var obj = JSON.parse(extPro);
        return obj.regionName;
    }
});
app.controller('TemplateManagementCtrl', function($scope, LoginService,LoginConfig,$log,toaster,$state,$modal, AdjustConfig,$rootScope) {

    //定义查询组织Service
    $scope.queryCourtOrgService = LoginService.selectCourtOrPolice;

    //刷新组织 暂时只要基层法院的列表
    $scope.refreshOrgList = function(){
        var regex = new RegExp('-', 'g'); // 使用g表示整个字符串都要匹配
        $scope.sysOrgViewList = $scope.sysOrgList.filter(function(v) {
            var result = JSON.parse(v.extPro).regionName.match(regex);
            if($scope.searchArea){
                if(result && result.length > 1 && v.text.indexOf($scope.searchArea) > -1){
                    return v;
                }
            }else{
                if(result && ((v.category == '#01' && result.length > 1) || (v.category == '#05' && result.length >= 1))){
                    return v;
                }
            }
        })
    };

    $scope.$on('saveSuccess', function () {
        $scope.refreshOrgList();
    });

    //查询组织数据
    $scope.queryCourtOrgService().success(function(result) {
        if (result.code == LoginConfig.commonConStant.SUCCESS) {
            $log.info(result);
            $scope.sysOrgList = result.result;
            //过滤组织
            $scope.refreshOrgList();
        }else{
          $rootScope.toaster("error", "错误", result.message);
        }
    });

    //编辑模板
    $scope.queryTemplate = function(sysOrg){

        $state.go("dashboard.templateDetail",{orgId:sysOrg.id,orgName:sysOrg.text});
    };

    //查询法庭
    $scope.queryCourtList = function(sysOrg){

        $state.go("dashboard.courtList",{orgId:sysOrg.id,orgName:sysOrg.text});
    };

    //鉴定机构设置
    $scope.handleAppraisal = function(sysOrg){
        $state.go("dashboard.appraisalList",{orgId:sysOrg.id,orgName:sysOrg.text});
    };

    //审判系统对接设置
    $scope.handleJudgeType = function(sysOrg){
      var popupModal = $modal.open({ //打开弹窗页
        templateUrl:'views/pages/organize_manage/templateJudge.html',
        controller:'TemplateJudgeCtrl',
        size:'min',
        resolve:{
          items:function(){
            return {
              sysOrg : sysOrg
            }
          }
        }
      });
      //弹出框的返回值
      popupModal.result.then(function(data){

      })
    };

    //推送数据按钮
    $scope.sendData = function (sysOrg) {
      LoginService.sendSysOrgAndJudgeInfo(sysOrg).success(function (res) {
        if (res.code == AdjustConfig.commonConStant.SUCCESS) {
          $rootScope.toaster("success", "发送成功");
        }else{
          $rootScope.toaster("error", "错误", res.message);
        }
      })
    }
  //视频开庭
  $scope.powerManage = function (sysOrg) {
    var popupModal = $modal.open({ //打开弹窗页
      templateUrl:'views/pages/organize_manage/powerManage.html',
      controller:'PowerManageCtrl',
      size:'min',
      resolve:{
        items:function(){
          return {
            sysOrg : sysOrg
          }
        }
      }
    });
    //弹出框的返回值
    popupModal.result.then(function(data){
      sysOrg.isSendAppraisal = data.isSendAppraisal
      sysOrg.smaProgPower = data.smaProgPower
      sysOrg.regisPushPower = data.regisPushPower
      sysOrg.smaProVidPower = data.smaProVidPower
      sysOrg.vidOpenPower = data.vidOpenPower
    })
  }
});

app.controller('TemplateJudgeCtrl', function($scope, LoginService,LoginConfig,$log,toaster,$state,DictionaryConfig,items,$modal,$modalInstance,$rootScope) {
  $scope.loginService = LoginService;
  $scope.sysOrg = angular.copy(items.sysOrg);
  $scope.sysOrg.interfaceAddressId = parseInt($scope.sysOrg.interfaceAddressId);

  $scope.judgeTypeArray = DictionaryConfig.juadgType;

  //获取接口商列表
   LoginService.queryPortDealerList({}).success(function (res) {
       $scope.portDealerArray = res.result;
   })

  $scope.save = function(){
    if($scope.sysOrg.judgeType && $scope.sysOrg.interfaceAddressId >= 0){
      $scope.loginService.updateSysOrg($scope.sysOrg).success(function(result){
        if (result.code == LoginConfig.commonConStant.SUCCESS) {
          $rootScope.toaster("success", "成功", "保存成功");

          items.sysOrg.judgeType = $scope.sysOrg.judgeType;
          items.sysOrg.interfaceAddressId = $scope.sysOrg.interfaceAddressId;

          $modalInstance.dismiss('cancel');
          $scope.$broadcast('saveSuccess');
        }else{
          $rootScope.toaster("error", "错误", result.message);
        }
      })
    }else{
      if(!$scope.sysOrg.judgeType) {
        $rootScope.toaster("warn", "提示", "请选择对接方案");
      } else {
        $rootScope.toaster("warn", "提示", "请选择接口商");
      }
    }
  }

 //取消
  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };


});
app.controller('PowerManageCtrl', function($scope, LoginService,LoginConfig,$log,toaster,$state,DictionaryConfig,items,$modal,$modalInstance,$rootScope) {
  $scope.loginService = LoginService;
  $scope.sysOrg = angular.copy(items.sysOrg);

  if(!$scope.sysOrg.isSendAppraisal){
    $scope.sysOrg.isSendAppraisal = '0';
    }
  $scope.save = function(){
    //视频等权限设置
    LoginService.updateVoidSma( $scope.sysOrg).success(function (res) {
      if (res.code == LoginConfig.commonConStant.SUCCESS) {
        $modalInstance.close($scope.sysOrg);
        //location.reload();
      }else{
        $rootScope.toaster("error", "错误", result.message);
      }
    })
  }

  //取消
  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };


});