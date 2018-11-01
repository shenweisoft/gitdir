'use strict';
var app = angular.module('sbAdminApp');
app.filter('reason2Text', function() {
  return function(id, data) {
    var obj = id && _.find(data, {id: id});
    return obj? obj.value : " ";
  }
});
angular.module('sbAdminApp').controller('secondInstanceLitigantionListCtrl', function($scope, $log,SecondLitigantionService,SecondLitigantionConfig, $stateParams, $state,DictionaryConfig,toaster,$rootScope) {
  //状态集合
  $scope.stateList = SecondLitigantionConfig.workFlowData.secondStateList;
  //案由
  $scope.factTypeList = SecondLitigantionConfig.factTypeList;
  //定义查询列表liseService
  $scope.querySecondIntanceInfoListService = SecondLitigantionService.querySecondIntanceInfoList;
  //定义查询列表总数Service
  $scope.querySecondIntanceInfoSumService = SecondLitigantionService.querySecondIntanceInfoSum;
  //定义搜索对象
  var SearchVO = function () {
    this.searchPerson = "";  //搜索内容
    this.pageNo = "1";  //当前页
    this.pageSize = DictionaryConfig.pageNum;  //每页显示条数
  };
  //定义页面对象
  $scope.options = {
    //获取页面分类flag  0：立案登记 1：立案审批 2：分案 3：排期 4：在线开庭 5：二审案件查询
    flag: $stateParams.flag,
    title: "",  //当前页标题
    dataList: []  //当前页列表数据
  };

  //定义页面初始化函数
  $scope.init = function () {
    //初始化搜索对象
    //如果为空创建对象
    if(!$scope.searchVO){
        $scope.searchVO = new SearchVO();
    }
    //根据页面flag填充数据
    filterFlag();
    //获取数据列表
    $scope.queryLawCaseList();
  };

  //根据当前页面flag，填充数据
  var filterFlag = function () {
    switch($scope.options.flag) {
      case "0":
        $scope.options.title = "立案登记";
        $scope.searchVO.state = '1000';
        break;
      case "1":
        $scope.options.title = "立案审批";
        $scope.searchVO.state = '1001';
        break;
      case "2":
        $scope.options.title = "分案";
        $scope.searchVO.state = '1002';
        break;
      case "3":
        $scope.options.title = "排期";
        $scope.searchVO.state = '1003';
        break;
      case "4":
        $scope.options.title = "在线开庭";
        $scope.searchVO.state = '1004';
        break;
      case "5":
        $scope.options.title = "二审案件查询";
        $scope.searchVO.state = '';
        break;
    }
  };

  //请求后台获取列表数据
  $scope.queryLawCaseList = function () {
    $scope.querySecondIntanceInfoListService($scope.searchVO).success(function (res) {
      if (res.code === SecondLitigantionConfig.commonConStant.SUCCESS) {
        $scope.secondIntanceInfoList = res.result;
        $log.info($scope.secondIntanceInfoList);
      } else {//请求失败
        $rootScope.toaster("error", "错误", res.message);
      }
    });

    $scope.querySecondIntanceInfoSumService($scope.searchVO).success(function (res) {
      if (res.code === SecondLitigantionConfig.commonConStant.SUCCESS) {
        $scope.searchVO.pageTotal = res.result;
        $log.info($scope.searchVO);
      } else {//请求失败
        $rootScope.toaster("error", "错误", res.message);
      }
    });
  };
  //搜索数据
  $scope.handleSearch = function () {
    var searchPerson = $scope.searchVO.searchPerson;
    $scope.searchVO = new SearchVO();
    $scope.searchVO.searchPerson = searchPerson;
    $scope.init();
  };

  //添加案件
  $scope.addLawCase = function () {
    $state.go("dashboard.secondInstanceLitigantion.secondStep123", {step: 1});
  };

  //执行页面初始化函数（页面最后执行）
  $scope.init();
  //点击当前页面，展示数据
  $scope.pageChanged = function () {
      $scope.queryLawCaseList();
  };

  //查询案件详细
  $scope.queryDetail = function(secondInstanceProcess){
    if(secondInstanceProcess.state == "1000") { //立案登记（立案未结束）
      $state.go("dashboard.secondInstanceLitigantion", {id: secondInstanceProcess.id});
    } else if(secondInstanceProcess.state == "1001") { //立案审批（立案已结束）
      $state.go("dashboard.secondInstanceProcess", {id: secondInstanceProcess.id,serialNo:secondInstanceProcess.serialNo});
    } else if(secondInstanceProcess.state == "1002") { //分案
      $state.go("dashboard.secondInstanceProcess", {id: secondInstanceProcess.id,serialNo:secondInstanceProcess.serialNo});
    } else if(secondInstanceProcess.state == "1003") { //排期
      $state.go("dashboard.secondInstanceProcess", {id: secondInstanceProcess.id,serialNo:secondInstanceProcess.serialNo});
    } else if(secondInstanceProcess.state == "1004") { //在线开庭
      $state.go("dashboard.secondInstanceOnlineCourt", {id: secondInstanceProcess.id});
    } else if(secondInstanceProcess.state == "1005") { //结案
      window.open($state.href("secondInstanceFile", {id: secondInstanceProcess.id, evideceShow: true}));
    }
  }
});
