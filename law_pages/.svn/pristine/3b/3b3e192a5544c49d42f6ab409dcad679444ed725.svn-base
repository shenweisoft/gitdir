/**
 * Created by shenwei on 2017/4/20.
 */
var app = angular.module('sbAdminApp');



angular.module('sbAdminApp').controller('deleteCaseAffirmCtrl', function ($scope, $stateParams, $state, $location, $timeout, $http, $log, DictionaryConfig, LawService, $filter, LawConfig,toaster, LoginService, $rootScope, AdjustService, LoginConfig, AdjustConfig) {
  //调解状态集合
  $scope.mediationState = DictionaryConfig.mediationState;
  //弹框显示隐藏标识
  $scope.isApplyForShow = false;
  //删除申请数据对象
  $scope.applyForInfoVO = {
    serialNo: '',
    telephone: '',
    reason: ''
  };
  //搜索数据对象
  function QueryInfoVO() {
    this.searchOverallSituation = '';
    this.pageSize = '10';
    this.pageNo = '1';
    this.pageTotal = '';
  }
  $scope.queryInfoVO = new QueryInfoVO();

  //弹出框style
  $scope.applyForStyle = {'width': '600px', 'margin-left': '-300px', 'height': '360px', 'margin-top': '-180px', 'padding-top': '10px'}
  //列表信息
  $scope.applyForList = [];

  //初始化数据
  $scope.initData = function () {
    //获取列表信息
    $scope.queryApplyForList();
  };

  //获取列表信息
  $scope.queryApplyForList = function () {
    //请求后台，获取数据
    AdjustService.queryCaseDeleteListUrl($scope.queryInfoVO).success(function (res) {
      console.log(res)
      if(res.code == '0') {
        $scope.applyForList = res.result;
      } else {
        $rootScope.toaster("error", "错误",res.message);
      }
    });
    //获取案件条数
    AdjustService.queryCaseDeleteCountUrl($scope.queryInfoVO).success(function (res) {
      console.log(res)
      if(res.code == '0') {
        $scope.queryInfoVO.pageTotal = res.result;
      } else {
        $rootScope.toaster("error", "错误",res.message);
      }
    });
  };

  //搜索方法
  $scope.handleQueryApplyFor = function () {
    $scope.queryInfoVO.pageNo = '1';
    $scope.queryApplyForList();
  };

  //同意、驳回 删除申请
  $scope.applyForAffirm = function (type) {
    //验证数据
    if(type == 'return' && !validData()) {
      return;
    }
    //填充数据
    $scope.applyForInfoVO.auditeTime = $scope.formatDate(new Date(), true);
    $scope.applyForInfoVO.auditeResult = type == 'return'? '2' : '1';

    AdjustService.saveCaseDeleteApplyUrl($scope.applyForInfoVO).success(function (res) {
      console.log(res)
      if(res.code == '0') {
        $scope.isApplyForShow = false;
        $rootScope.toaster("success", "成功", type == 'return'? '驳回成功！':'删除成功!');
        $scope.queryApplyForList();
      } else {
        $rootScope.toaster("error", "错误",res.message);
      }
    })
  };

  //点击审核显示弹框
  $scope.handleApplyFor = function (type, target) {
    $scope.isApplyForShow = true;
    $scope.applyForType = type;
    $scope.applyForInfoVO = angular.copy(target);
  };

  //验证数据
  function validData() {
    var v = $scope.applyForInfoVO;
    if(!v.auditeReason) {
      v.auditeReasonError = true;
      $rootScope.toaster('error', '错误', '请输入驳回理由！');
      return false
    } else v.auditeReasonError = undefined;
    return true;
  }

  //格式化日期数据
  $scope.formatDate = function (date, isHSM) {
    if(typeof date != 'string') {
      var year = date.getFullYear();
      var month = date.getMonth()+1;
      var day = date.getDate();
      var hour = date.getHours() >= 10? date.getHours() : '0'+date.getHours();
      var min = date.getMinutes() >= 10? date.getMinutes() : '0'+date.getMinutes();
      var sec = date.getSeconds() >= 10? date.getSeconds() : '0'+date.getSeconds();
      if(isHSM) {
        return year+'-'+month+'-'+day+' '+hour+':'+min+':'+sec;
      }
      return year+'-'+month+'-'+day;
    }
    return date;
  };

  $scope.initData();

});