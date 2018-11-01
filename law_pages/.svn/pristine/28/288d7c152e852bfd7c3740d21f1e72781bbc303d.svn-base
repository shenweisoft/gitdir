/**
 * Created by shenwei on 2017/5/5.
 */
'use strict';
angular.module('sbAdminApp').controller('AppraisalNoticeCtrl', function($scope, $stateParams, LoginService,PrejudgeConfig,toaster,$state,$log, AppraisalConfig,AppraisalService, LawService, LawConfig, DictionaryConfig,$rootScope) {

    //初始化鉴定信息
    $scope.initiateAppraisalService = AppraisalService.initiateAppraisal;
    //老道交鉴定对接
    $scope.oldBusinessAppraisalSubmitData = AppraisalService.oldBusinessAppraisalSubmitData;
    $scope.oldBusinessAppraisal = AppraisalService.oldBusinessAppraisal;
    //鉴定对象
    function Appraisal(){
        this.serialNo = $stateParams.serialNo;
        this.caseType = $stateParams.caseType;
        this.createOrgId = $stateParams.orgId;
        this.createOrgName = $stateParams.orgName;
        this.createPointId= $stateParams.pointId;
        this.createPointName=$stateParams.pointName
    }

    //调解完成（结案）的时候提示接口
    $scope.readNotice= function () {
      var data = {
        serialCode: $stateParams.serialNo,
        userType: $stateParams.userType//用户名
      }
      $scope.oldBusinessAppraisal(data).success(function (result) {
        if(result.code == AppraisalConfig.commonConstant.SUCCESS){
          $scope.readNext();
        }else{
            $rootScope.toaster("error", "错误", result.message);
        }
      });
    }

    //阅读完成
    $scope.readNext = function(){
      $scope.generateDocument();
      $scope.initiateAppraisalService(new Appraisal()).success(function (result) {
          if(result.code == AppraisalConfig.commonConstant.SUCCESS){
              $log.info(result);
              sessionStorage.setItem("loginAccount",$stateParams.loginAccount);
              //判断是否是法官鉴定
              if($stateParams.judge) {
                  $state.go("appraisal",{serialNo:$stateParams.serialNo,caseType:$stateParams.caseType,appraisalInfoId:result.result,judge:true});
              } else {
                  $state.go("appraisal",{serialNo:$stateParams.serialNo,caseType:$stateParams.caseType,appraisalInfoId:result.result});
              }

          }else{
              $rootScope.toaster("error", "错误", result.message);
          }
      });
    }
  
  $scope.generateDocument = function() {
    function documentBuild(text) {
      var bodyObj = '<body class="b1 b2">' + text + '</body>';
      return bodyObj;
    }
    
    var result = $('#content').html();
    result = documentBuild(result);
    
    LawService.buildWord({
      serialNo: $stateParams.serialNo,
      type: DictionaryConfig.caseVerifyResultCode[1].code,
      wordType:"10",
      fileName: "民事诉讼须知",
      content: result
    }).success(function(result) {
      if (result.code == LawConfig.commonConstant.FAILURE) {
        $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageBackend);
      }
    })
  }
});