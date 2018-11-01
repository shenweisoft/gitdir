'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:FilingListCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
var app = angular.module('sbAdminApp');
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
angular.module('sbAdminApp').controller('ConfirmCaseTodoCtrl', function($scope, $stateParams, $state, $location, $timeout, $http, $log, DictionaryConfig, LawService, LawConfig, LoginService, toaster, $rootScope) {
  //案件Service
  $scope.lawService = LawService;
  //查找不到空白页
  $scope.blankShow = false;
  var level = {
    "success":"success",
    "warn":"warn",
    "error":"error"
  }
  var title = {
    "success":"成功",
    "warn":"警告",
    "error":"错误"
  }
  
  $scope.CONSTANT = {
    "messageBackend":"请联系管理员"
  };

  //定义状态常量
  $scope.STATE_CONSTANT = {
    "courtSessionState": "1007",
    "confirmCaseType":0 //司法确认
  };

  var url = $location.url();
  $scope.type = $scope.STATE_CONSTANT.confirmCaseType;
  $scope.title = "司法确认办案";
  if(url.indexOf("confirmCaseTodoAdjustList") > 0) {//调解办案
    $scope.type = 2;
    $scope.title = "调解办案";
  }
  //创建对象构造器
  function CaseSearchVO(){
    this.state = DictionaryConfig.lawState.notHearingState;
    this.type = $scope.type;
    this.lawOrgId = $scope.userDepart.orgId;
    this.isSmallAmount = '';
    this.pageNo = 1;
    this.pageSize = DictionaryConfig.pageNum;
  }
  
  //每页显示条数
  $scope.itemNum = DictionaryConfig.pageNum;
  $scope.pageData = {
    currentPage:'1',
    caseList:[],
    showList:[],
    listTitle: ''
  };
  $scope.pages = {};

  $scope.searchData = function(){
    if(!$scope.pages) $scope.pages = new CaseSearchVO();
    $scope.queryCaseList($scope.pages, $scope.pages);
  }
  //单击查询
  $scope.queryCaseList = function(pageA, pageB){
    if(!pageA) pageA = $scope.pages;
    var paramA = angular.copy(pageA)
    if(paramA.searchArea) paramA.searchArea = DictionaryConfig.filterWidthReg(paramA.searchArea)
    $scope.lawService.queryFilingList(paramA).success(function(result) {
      if (result.code == LawConfig.commonConstant.SUCCESS) {//请求成功
        $scope.pageData.showList = [];
        $scope.pageData.caseList = result.result;
        $scope.pageData.caseList.forEach(function (v,i) {
          if(i <  $scope.itemNum){
            $scope.pageData.showList.push(v);
          }
        });
        //空白页展示
        if(!$scope.pageData.caseList.length){
          $scope.blankShow = true;
        }
      }else if(result.code == LawConfig.commonConstant.FAILURE){
        $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageBackend);
      }
    });

    //Todo查询总条数
    if(pageB){
      var paramB = angular.copy(pageA)
      if(paramB.searchArea) paramB.searchArea = DictionaryConfig.filterWidthReg(paramB.searchArea)
      $scope.lawService.queryFilingCount(paramB).success(function(count) {
          $scope.pageData.totalItems =  count.result;
      })
    }
  };

  //初始化
  $scope.initPage = function () {
    //根据组织机构获取人员列表
    $scope.$on('user2Child', function(){
      initData();
    });
    if (LoginService.user.userPermissions) {
      initData();
    }
  };
  $scope.initPage();
  
  function initData(){
    $scope.userDepart = LoginService.user.sysUser.userDepartList[LoginService.user.sysUser.currentOrg];
    $scope.sysUser = LoginService.user.sysUser;
    $scope.pages = new CaseSearchVO();
    $scope.pages.isSmallAmount = $location.url().indexOf("smallCaseTodo") > 0? 1:0;
    
    //初始化集合
    $scope.queryCaseList($scope.pages, $scope.pages);
  }
  
  //点击当前页面，展示数据
  $scope.pageChanged = function () {
    if(!$scope.pages) $scope.pages = new CaseSearchVO();
    $scope.pages.pageNo = $scope.pageData.currentPage;
    $scope.queryCaseList($scope.pages, $scope.pages);
  }
  
  //切换类型[1007:庭前调解， 1008:在线开庭]
  $scope.selectType = function(val){
    $scope.pages.state = val;
    $scope.queryCaseList();
  };
  
  //查询详细
  $scope.queryDetail = function(lawCase){
    $state.go("dashboard.confirmCase",{serialNo:lawCase.serialNo});
  }
});
