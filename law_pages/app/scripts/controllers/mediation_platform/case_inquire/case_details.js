/**
 * Created by Administrator on 2017/3/15 0015.
 */
var app = angular.module('sbAdminApp');
app.filter('userType2Text', function() {
  return function(id, data) {
    return  id && _.find(data, {
        id: id
      }).value || " ";
  }
});

app.controller('caseDetailCtrl', function ($scope, $log, $state, DictionaryConfig,$timeout, $stateParams, LawService,LawConfig,$modal,toaster,$filter,LoginService,$rootScope) {

  $scope.lawType = DictionaryConfig.lawType;

  $scope.lawState = DictionaryConfig.lawState;
  //后台查询
  $scope.lawService = LawService;
  //获取流水号
  $scope.serialNo =  $stateParams.serialNo;

  $scope.isReturn = $stateParams.isReturn;
  $scope.state = $stateParams.state;
  $scope.id = $stateParams.id;
  $scope.codeFileName = $stateParams.codeFileName;
  //其他平台接入
  $rootScope.buttSelf = $stateParams.isSelf;
  //二维码拼接路径
  $scope.codeFilePath = LawConfig.lawConstant.lawCodeFileUrl;

  $scope.userTypeConstant = DictionaryConfig.userTypeConstant;

  //从后台获取数据(头部信息)
  $scope.lawService.queryLawDetail({
    "serialNo": $scope.serialNo,
      "id":$scope.id
  }).success(function(result) {
    if(result.code == LawConfig.commonConstant.SUCCESS){
      $scope.law = result.result;
      //是否能开庭标识,默认不能开庭
      var isShowFlag = false;
      //需要查看开庭时间，是否允许开庭
      var nowDate = new Date(new Date().getTime() + DictionaryConfig.courtBeforeHour);
      if($scope.law.nextCourtDate){
        if($scope.law.nextCourtDate <= $filter('date')(nowDate,"yyyy-MM-dd HH:mm:ss")){
          isShowFlag = true;
        }
      }else{
        if($scope.law.courtDate){
          if($scope.law.courtDate <= $filter('date')(nowDate,"yyyy-MM-dd HH:mm:ss")){
            isShowFlag = true;
          }
        }
      }
      //如果不是暂缓缴费并且又没有付款，则不能开庭
      if($scope.law.isDeferredCharges != '1' && $scope.law.payState != '1'){
        isShowFlag = false;
      }
      $scope.law.isShowFlag = isShowFlag;

      //是否显示发起一键理赔按钮
      $scope.isClaim = false;
      if($scope.law.operateType == '0'  ){ //调解案件
          if($scope.law.adjustResult == '1' && $scope.law.state != $scope.lawState.adjustState && $scope.law.claimState == '1' ){ // 达成调解 并且 状态不为 1000  信息回传成功
            $scope.isClaim = true;
          }else if( ($scope.law.adjustResult == '0' ||  $scope.law.adjustResult == '4') && $scope.law.state ==  $scope.lawState.finishState){ //达成调解司法确认，或申请调解书  并且 已结案  信息回传成功
            $scope.isClaim = true;
          }
      }else{  //诉讼案件
          if($scope.law.state ==  $scope.lawState.finishState && $scope.law.claimState == '1'){ //已结案并且信息回传成功
            $scope.isClaim = true;
          }
      }
      
    }else{
      $rootScope.toaster("error", "错误", result.message);
    }
  });
})