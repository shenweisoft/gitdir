/**
 * Created by shenwei on 2017/4/20.
 */
var app = angular.module('sbAdminApp');
app.filter('stateChangeText', function () {
  return function (id, data) {
    var result = _.find(data, {
      id: id
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
app.filter('valueNull', function () {
  return function (dt) {
    return dt && dt || '-';
  }
});
app.filter('stateFilter', function () {
  return function (data) {
    var result = _.filter(data, function (item) {
      return item.id != '1001'
    });
    return result && result;
  }
});
angular.module('sbAdminApp').controller('AllCaseListCtrl', function ($scope, $stateParams, $state, $location, $timeout, $http, $log, DictionaryConfig, LawService, $filter, LawConfig,toaster, LoginService, $rootScope) {
  //案由类型
  $scope.factTypeList = DictionaryConfig.factTypeList;
  //查询立案集合Service
  $scope.lawService = LawService;
  //法律状态集合
  $scope.lawStateList = DictionaryConfig.lawStateList;
  //定义状态常量，更新的类型
  $scope.LAW_STATE = DictionaryConfig.lawState;

  //每页显示条数
  $scope.itemNum = DictionaryConfig.pageNum;
  $scope.pageData = {
    // currentPage: '1',
    caseList:[],
    showList:[],
    listTitle: ''
  };
  //空白页面
  $scope.blankShow = false;
  //获取url
  var url = $location.url();
  var arr =url.split("/");
  $scope.url = $stateParams.pageNo ?arr[arr.length-3] : arr[arr.length-1];
  //定义查询调解对象
  var Search = function () {
    //全局搜索
    this.overall = $stateParams.overall || '';
    //流水号
    this.serialNo = "";
    //案号/调解号
    this.lawNo = "";
    //立案类型(0:司法确认 1：诉讼)
    this.operateType = "";
    //调解开始日期
    this.adjustStartDate = "";
    //调解结束日期
    this.adjustEndDate = "";
    //立案开始日期
    this.filingStartDate = "";
    //立案结束日期
    this.filingEndDate = "";
    //开庭开始日期
    this.courtStartDate = "";
    //开庭结束日期
    this.courtEndDate = "";
    //申请人或者被申请人
    this.applicantOrRespondent = "";
    //调解员
    this.adjustName = "";
    //法官
    this.judgeName = "";
    //书记员
    this.clerkName = "";
    //调解中心
    this.adjustOrgName = "";
    //法院机构
    this.lawOrgName = "";
    //案由
    this.reason = "";
    //案件状态
    this.state = "";
    //每页几条
    this.pageSize = DictionaryConfig.pageNum;
    //第几页
    this.pageNo = $stateParams.pageNo ||  1;
    //组织机构
    this.lawOrgId =  $scope.url == 'sysAllCaseList' ? '': $scope.userDepart.orgId  ;
    //管理员
    this.isAdmin =  $scope.url == 'sysAllCaseList' ? 1: ''  ;
  };

  function  Fold() {
   this.serialNoShow = true;
    this.lawNoShow = true;
    this.operateTypeShow = true;
    this.adjustDateShow =true;
    this.filingDateShow =true;
    this.courtDateShow =true;
    this.applicantShow =true;
    this.adjustNameShow =false;
    this.chiefNameShow =false;
    this.clerkNameShow =false;
    this.adjustOrgNameShow =false;
    this.lawOrgNameShow =false;
    this.stateShow =true;
    this.lawMoneyShow =false;

  }
  $scope.fo = new Fold();

  //改变显示列表
  $scope.listChange = function (show) {
    var listCount = 0;
    for(var i in $scope.fo){
      if ($scope.fo.hasOwnProperty(i)) {
        if($scope.fo[i]){
          listCount ++;
        }
      }
    }

    if(listCount > 8){
      confirm("最多只能选择8个字段");
      $scope.fo[show] = false;
    }
  }

  //初始化数据
  $scope.init = function (param) {
    var inputParam = angular.copy(param);
    if(inputParam.overall) inputParam.overall = DictionaryConfig.filterWidthReg(inputParam.overall);
    $scope.lawService.queryAllLawAdjustInfo(inputParam).success(function (result) {
      if (result.code == LawConfig.commonConstant.SUCCESS) {
        $scope.pageData.showList = result.result;
        //空白页展示
        if(!$scope.pageData.caseList.length){
          $scope.blankShow = true;
        }
      } else {
        $rootScope.toaster("error", "错误", result.message);
      }
    })

    //Todo查询总条数
    $scope.lawService.queryAllLawAdjustInfoCount(inputParam).success(function(count) {
        $scope.search.totalItems =  count.result;
    })
  };

  //查询列表
  $scope.queryAllCaseList = function () {
    //选择日期类型
    $scope.changeDateType();
    //请求数据
    $scope.init($scope.search);
  }

  $scope.queryAll = function () {
    if(  $scope.url== 'allCaseList'){
      $location.url('/dashboard/allCaseList/1/'+$scope.search.overall);
    }else{
      //选择日期类型
      $scope.changeDateType();
      //请求数据
      $scope.init($scope.search);
    }

  }

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
    $scope.search = new Search();

    //初始化集合
    $scope.init($scope.search);
  }

  //点击当前页面，展示数据
  $scope.pageChanged = function () {
    if(  $scope.url== 'allCaseList'){
      $location.url('/dashboard/allCaseList/'+$scope.search.pageNo+'/');
    }else{
      if(!$scope.search) $scope.search = new Search();
      $scope.queryAllCaseList();
    }
  }

  //日历打开方法
  $scope.open = function ($event, currentOpen) {
    $event.preventDefault();
    $event.stopPropagation();
    $scope.dateOpen[currentOpen] = true;
  };
  //日历打开
  var DateOpen = function () {
    this.opened = false;
    this.opened1 = false;
  }
  $scope.dateOpen = new DateOpen();

  //更换日期类型
  $scope.changeDateType = function () {
    $scope.search.adjustStartDate = '';
    $scope.search.adjustEndDate = '';
    $scope.search.filingStartDate = '';
    $scope.search.filingEndDate = '';
    $scope.search.courtStartDate = '';
    $scope.search.courtEndDate = '';
    if ($scope.dateType == 'adjustDate') {
      $scope.search.adjustStartDate = $filter('date')($scope.startDate, "yyyy-MM-dd");
      $scope.search.adjustEndDate = $filter('date')($scope.endDate, "yyyy-MM-dd");
    }
    if ($scope.dateType == 'filingDate') {
      $scope.search.filingStartDate = $filter('date')($scope.startDate, "yyyy-MM-dd");
      $scope.search.filingEndDate = $filter('date')($scope.endDate, "yyyy-MM-dd");
    }
    if ($scope.dateType == 'courtDate') {
      $scope.search.courtStartDate = $filter('date')($scope.startDate, "yyyy-MM-dd");
      $scope.search.courtEndDate = $filter('date')($scope.endDate, "yyyy-MM-dd");
    }
  }

  //跳转相应详细页
  $scope.goCase = function (res) {

 /*   if (res.state == $scope.LAW_STATE.adjustListState) {//当前状态为调节中
      $scope.url = 'dashboard.case_details'
    } else if (res.state == $scope.LAW_STATE.prosecutionState) {//起诉环节
      $scope.url = 'dashboard.case_details'
    } else*/
    if (res.state == $scope.LAW_STATE.prosecutionFinishState) {//待审批
      $scope.url = 'dashboard.filing_detail'
    } else if (res.state == $scope.LAW_STATE.approvalState) {//待立案
      $scope.url = 'dashboard.filing_detail'
    } else if (res.state == $scope.LAW_STATE.filingState) {//待分案
      $scope.url = 'dashboard.filing_detail'
    } else if (res.state == $scope.LAW_STATE.scheduleState) {//待排期
        $scope.url = 'dashboard.filing_detail'
    } else if (res.state == $scope.LAW_STATE.adjustState) {//庭前调节
      $scope.url = 'dashboard.courtMediation'
    } else if (res.state == $scope.LAW_STATE.notHearingState) {//办案
      if(res.operateType == 0){
        $scope.url = 'dashboard.confirmCase'
      }else{
        $scope.url = 'dashboard.online_session'
      }
    } else if (res.state == $scope.LAW_STATE.finishState || res.state == '2003') {//完结 或者诉前转调解
      $scope.url = 'dashboard.case_details'
    }
    $state.go($scope.url, {serialNo: res.serialNo});
  };

  //重置详细搜索数据
  $scope.reset  = function () {
      $scope.search = new Search();
  };
});