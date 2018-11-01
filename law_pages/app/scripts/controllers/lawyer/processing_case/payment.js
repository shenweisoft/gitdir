/**
 * Created by wangzhandong on 2017/5/6.
 */
angular.module('sbAdminApp').controller('PaymentCtrl', function($scope, $stateParams, $state, $location, $timeout, $http, $log,DictionaryConfig,LawService,LawConfig) {
  //查询诉讼案件集合Service
  $scope.lawService = LawService;
  
  //每页显示条数
  $scope.itemNum = DictionaryConfig.pageNum;
  
  //页面信息
  $scope.pageData = {
    currentPage:'1',
    feeList:[]
  };
  
  //初始化数据列表
  $scope.initDataList = function(pageNo, pageSize){
    var pages = {"overall":$scope.searchContent, pageNo:pageNo, pageSize:pageSize};
    searchData(pages, pages)
  }
  $scope.initDataList(1, DictionaryConfig.pageNum);
  
  function searchData(pageA, pageB){
    var paramA = angular.copy(pageA);
    if(paramA.overall)paramA.overall = DictionaryConfig.filterWidthReg(paramA.overall)
    var paramB = angular.copy(pageB);
    if(paramB.overall)paramB.overall = DictionaryConfig.filterWidthReg(paramB.overall)
    if(paramA){
      $scope.lawService.queryLawPayList(paramA).success(function(res){
        if(res.code == LawConfig.commonConstant.SUCCESS){
          $scope.pageData.feeList = res.result;
        }
      })
      //空白页展示
      if(!$scope.pageData.feeList.length){
        $scope.blankShow = true;
      }
    }
    
    if(paramB){
      $scope.lawService.queryLawPayCount(paramB).success(function(res){
          $scope.pageData.totalItems = res.result;
      })
    }
  }
  
  $scope.queryDataList = function(){
    var pages = {"overall":$scope.searchContent, pageNo:1, pageSize:DictionaryConfig.pageNum};
    searchData(pages, pages)
  }
  
  //点击当前页面，展示数据
  $scope.pageChanged = function () {
    if(!$scope.pages) $scope.pages = {};
    $scope.pages.pageNo = $scope.pageData.currentPage;
    $scope.pages.pageSize = DictionaryConfig.pageNum;
    searchData($scope.pages)
  }
  
  //详情
  $scope.viewDetail = function(fee){
    $state.go('dashboard.litigation_payment', {'serialNo':fee.serialNo});
  }
  
});