/**
 * Created by Administrator on 2017/3/2 0002.
 */
'use strict';
var app = angular.module('sbAdminApp');
/**
 * @ngdoc function
 * @name sbAdminApp.controller:processingCtrl
 * @description
 * # processingCtrl
 * Controller of the sbAdminApp
 */
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
app.filter('isNotNull1', function() {
  return function(person) {
    return person == 'null' ? '-' : person;
  }
});
app.filter('valueNull1', function() {
  return function(val) {
    return val && val || '-';
  }
});
angular.module('sbAdminApp').controller('SettleCaseCtrl', function ($scope, $log, AdjustService, $state, $modal, DictionaryConfig, $location, $filter, LoginService) {
  $scope.search = null;
  //是否显示过滤选项框
  $scope.filterShow = false;
  //未搜索到结果显示
  $scope.blankShow = false;
  //每页显示条数
  $scope.itemNum = DictionaryConfig.pageNum;
  //页面信息
  $scope.pageData = {
    currentPage:'1',
    caseList:[],
    showList:[],
    listTitle: '调解案件'
  };
  //查询列表
  $scope.getInquireList = AdjustService.queryAdjustByInsurance;
  $scope.queryCountAdjust = AdjustService.queryCountAdjustByInsuranceUser;
  
  //案由类型
  $scope.factTypeList = DictionaryConfig.factTypeList;

  //初始化用户刷新
  $scope.userDepart = {};
  function initData(pageNo, pageSize){
    $scope.userDepart = LoginService.user.sysUser.userDepartList[LoginService.user.sysUser.currentOrg];
    $scope.sysUser = LoginService.user.sysUser;
    
    var url = $location.url();
    var pages;
    var arr =url.split("/");
    url = arr[arr.length-1];

    var now = new Date();
    var nowTime = now.getTime() ;
    var day = now.getDay();
    var oneDayLong = 24*60*60*1000 ;


    var MondayTime = nowTime - (day-1)*oneDayLong  ;
    var SundayTime =  nowTime + (7-day)*oneDayLong ;

    $scope.adjustStartDate = (url == 'todayMediation'&& new Date())|| (url == 'weekMediation'&& new Date(MondayTime)) || '';
    $scope.adjustEndDate = (url == 'todayMediation'&& new Date())|| (url == 'weekMediation'&& new Date(SundayTime)) || '';

    $scope.pageData.listTitle = '案件查询'; //列表的标题
    pages = JSON.stringify({pageNo:pageNo, pageSize:pageSize, caseType: '1',progressFlag: 1, insuranceCode: $scope.userDepart.insuranceCode});
    //从后台获取数据
    $scope.getDataInfo(pages,pages);
  }
  
  //初始化
  $scope.initPage = function () {
    //初始化组织
    //根据组织机构获取人员列表
    $scope.$on('user2Child', function(){
      initData(1, DictionaryConfig.pageNum);
    });
    if (LoginService.user.userPermissions) {
      initData(1, DictionaryConfig.pageNum);
    }
  };
  //从后台获取数据
  $scope.getDataInfo = function (lObj,cObj) {
    //查询列表
    if(lObj){
      $scope.getInquireList(lObj).success(function(qData) {
        if(qData.result){
          $scope.pageData.showList = [];
          $scope.pageData.caseList = qData.result;
          $scope.pageData.caseList.forEach(function (v,i) {
            if(i <  $scope.itemNum){
              $scope.pageData.showList.push(v);
            }
          });
          //空白页展示
          if(!$scope.pageData.caseList.length){
            $scope.blankShow = true;
          }
        }
      })
    }
    //查询总条数
    if(cObj){
      $scope.queryCountAdjust(cObj).success(function(count) {
          $scope.pageData.totalItems =  count.result;
      })
    }
  }
  $scope.initPage();

  //点击当前页面，展示数据
  $scope.pageChanged = function () {
    if(!$scope.search) $scope.search = {};
    $scope.search.searchState = $scope.searchState;
    $scope.search.pageNo = $scope.pageData.currentPage;
    $scope.search.pageSize = DictionaryConfig.pageNum;
    $scope.search.insuranceCode = $scope.userDepart.insuranceCode
    $scope.getDataInfo($scope.search)
  }
  
 // 全局查询
  $scope.queryAll =function () {
    var search = {"searchOverallSituation":$scope.searchOverallSituation, "searchState":$scope.searchState, "pageNo":1, "pageSize": DictionaryConfig.pageNum,insuranceCode:$scope.userDepart.insuranceCode}
    $scope.getDataInfo(search, search)
  }
  
 // 详细查询
  $scope.queryList = function () {
    if($scope.search){
      var searchList;
      //开始日期处理
      if($scope.search.searchAdjustStartDate instanceof Date){
        $scope.search.searchAdjustStartDate = $filter('date')( $scope.search.searchAdjustStartDate,"yyyy-MM-dd");
      }
      //结束日期处理
      if($scope.search.searchAdjustEndDate instanceof Date){
        $scope.search.searchAdjustEndDate = $filter('date')($scope.search.searchAdjustEndDate, 'yyyy-MM-dd');
      }
      //判断不为空和undefind
      for(var v in  $scope.search){
        if( $scope.search.hasOwnProperty(v)){
         if(!$scope.search[v] == null && $scope.search[v] != 0){
           delete $scope.search[v];
         }
        }
      }
      $scope.search.searchOverallSituation =undefined;
      $scope.search.pageNo = 1;
      $scope.search.pageSize = DictionaryConfig.pageNum;
      $scope.search.insuranceCode = $scope.userDepart.insuranceCode;
      searchList = JSON.stringify($scope.search);
      //从后台获取数据
      $scope.getDataInfo(searchList,searchList);
    }
  }

  // 重置查询
  $scope.reset = function () {
    $scope.search = null;
  }
  //页面跳转
  $scope.goCase = function (formCase) {
    $state.go("dashboard.case_details",{serialNo:formCase.serialNo});
  };
  
  //日历打开
  $scope.dateOpen = {
    opened:false,
    opened1:false
  };
  //日历打开方法
  $scope.open = function ($event,currentOpen) {
    $event.preventDefault();
    $event.stopPropagation();
    
    $scope.dateOpen[currentOpen] = true;
  };
  //跳转到案件详细页
  $scope.goStateCase = function () {
    $state.go("dashboard.case_details");
  }
  
  $scope.findTransferUser = function(orgId){
    $scope.queryTranseferUser({
      orgId: orgId
    }).success(function(res){
      console.log(res);
    })
  }
  // 弹出页
  $scope.openList = function(adjust){
    var modalInstance = $modal.open({
      templateUrl: 'views/pages/insurance/openlist.html',
      controller: 'OpenListCtrl',
      resolve: {
        items: function() {
          return {
            orgId: $scope.userDepart.orgId,
            adjustId:adjust.id,
            serialNo: adjust.serialNo
        }
        }
      }
    });
  
    //接收弹出窗返回的结果
    modalInstance.result.then(function(data) {
      adjust.isTransfered = data.isTransfered;
    }, function() {});
  }
});




//弹出框
angular.module('sbAdminApp').controller('OpenListCtrl', function ($scope, $log, AdjustService, $state, $modal, DictionaryConfig, items, $modalInstance, toaster,$rootScope) {
  $scope.adjustService = AdjustService;
  
  $scope.items = items;
  $scope.title = "分公司人员列表";
  
  $scope.initUserList = function(){
    $scope.adjustService.queryTransferUser({
      orgId: $scope.items.orgId
    }).success(function(res){
      $scope.insuranceUserList = res.result;
    })
  }
  
  $scope.initUserList();
  
  $scope.co = {}
  var validateForm = function(){
    if(!$scope.co.userId){
      $rootScope.pop("error", "错误", "请选择移交用户");
      return false;
    }
    return true;
  }
  
  //选择移交人
  $scope.selectTransferUser = function(){
    var selectedUser = $scope.insuranceUserList.filter(function(v){
      return v.userId == $scope.co.userId
    })
  
    $scope.adjustService.transferAdjust({
      userId: selectedUser[0].userId,
      userName: selectedUser[0].userName,
      adjustId: $scope.items.adjustId,
      serialNo: $scope.items.serialNo
    }).success(function(res){
      if(0 == res.code){
        $scope.isTransfered = "1";
        $modalInstance.close({
          isTransfered : $scope.isTransfered
        });
      }else{
        $rootScope.toaster("error", "错误", "系统问题，请联系管理员");
      }
    })
  }
  
  //点击确认
  $scope.ok = function() {
    if (validateForm()){
      $scope.selectTransferUser();
    }
  };
  //点击取消
  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
});
