/**
 * Created by shenwei on 2017/4/20.
 */
var app = angular.module('sbAdminApp');

app.filter('stringDate', function () {
  return function (dt) {
    if (typeof (dt) == "string") {
      dt = dt.replace(/\-/gi, "\/");
      dt = Date.parse(dt);
    }
    return dt && dt;
  }
});

angular.module('sbAdminApp').controller('deleteCaseApplyForListCtrl', function ($scope, $stateParams, $state, $location, $timeout, $http, $log, DictionaryConfig, LawService, $filter, LawConfig,toaster, LoginService, $rootScope, AdjustService, LoginConfig, AdjustConfig) {
  //调解状态集合
  $scope.mediationState = DictionaryConfig.mediationState;
  //诉讼状态集合
  $scope.judgeStateList = DictionaryConfig.judgeStateList;
  //弹框显示隐藏标识
  $scope.isApplyForShow = false;
  //弹出框类型标记
  $scope.applyForType = '';
  //删除申请数据对象
  $scope.applyForInfoVO = {
    serialNo: '',
    telephone: '',
    reason: ''
  };
  //搜索数据对象
  function QueryInfoVO() {
    if($scope.sysUser.userType == '1') { //法官
      this.lawOrgId = $scope.sysUser.userDepartList[0].orgId;
    }
    if($scope.sysUser.userType == '2') { //调解员
      this.adjustPointCode = $scope.sysUser.userDepartList[0].deptId;
      this.adjustPersonId = $scope.sysUser.id;
    }
    this.searchOverallSituation = '';
    this.pageSize = '10';
    this.pageNo = '1';
    this.pageTotal = '';
  }
  //页面数据对象
  function ApplyForInfoVO() {
    if($scope.sysUser.userType == '1') { //法官
      this.lawOrgId = $scope.sysUser.userDepartList[0].orgId;
    }
    if($scope.sysUser.userType == '2') { //调解员
      this.adjustPointCode = $scope.sysUser.userDepartList[0].deptId;
      this.adjustPersonId = $scope.sysUser.id;
    }
  }

  //弹出框style
  $scope.applyForStyle = {'width': '600px', 'margin-left': '-300px', 'height': '360px', 'margin-top': '-180px', 'padding-top': '10px'}
  //列表信息
  $scope.applyForList = [];

  //初始化数据
  $scope.initData = function () {
    //获取登录人员数据
    $scope.sysUser = LoginService.user.sysUser;
    console.log($scope.sysUser)
    //实例化搜索数据
    $scope.queryInfoVO = new QueryInfoVO();
    //实例化页面数据对象
    $scope.applyForInfoVO = new ApplyForInfoVO();
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

  //提交删除申请
  $scope.submitApplyFor = function () {
    //验证数据
    if(!validData()) {
      return;
    }
    //验证是否为本人经办的调解、诉讼案件
    AdjustService.queryCaseIsExistUrl($scope.applyForInfoVO).success(function (res) {
      if(res.code == '0' && res.result) {
        //填充数据
        $scope.applyForInfoVO.createDate = $scope.formatDate(new Date(), true);
        $scope.applyForInfoVO.createId = $scope.sysUser.id;
        $scope.applyForInfoVO.createName = $scope.sysUser.text;
        if($scope.applyForInfoVO.auditeResult) $scope.applyForInfoVO.auditeResult = '';

        AdjustService.saveCaseDeleteApplyUrl($scope.applyForInfoVO).success(function (res) {
          if(res.code == '0') {
            $rootScope.toaster("success", "成功", $scope.applyForType == 'again'? "重新申请成功！" : "提交成功！");
            $scope.isApplyForShow = false;
            //获取列表信息
            $scope.queryApplyForList();
          } else {
            $rootScope.toaster("error", "错误",res.message);
          }
        });
      } else {
        $rootScope.toaster("error", "错误", "未查询到此案件，请重新输入流水号！");
        return false;
      }
    });
  };

  //显示弹框（新增、修改）
  $scope.handleApplyFor = function (type, target) {
    $scope.isApplyForShow = true;
    $scope.applyForType = type;
    if(target) { //存在目标对象（查看、重新申请）
      if(type == 'detail') { //查看详情
        AdjustService.queryCaseDeleteApplyUrl({id: target.id}).success(function (res) {
          console.log(res)
          if(res.code == '0') {
            $scope.applyForInfoVO = angular.copy(res.result);
          } else {
            $rootScope.toaster('error', '错误', res.message);
          }
        })
      }
      if(type == 'again') { //重新申请
        $scope.applyForInfoVO = angular.copy(target);
      }
    } else {
      $scope.applyForInfoVO = new ApplyForInfoVO();
    }
  };

  //验证数据
  function validData() {
    var v = $scope.applyForInfoVO;
    if(!v.serialNo) {
      v.serialNoError = true;
      $rootScope.toaster('error', '错误', '请输入流水号！');
      return false
    } else v.serialNoError = undefined;
    if(!v.telephone) {
      v.telephoneError = true;
      $rootScope.toaster('error', '错误', '请输入联系方式！');
      return false
    } else v.telephoneError = undefined;
    if(!v.reason) {
      v.reasonError = true;
      $rootScope.toaster('error', '错误', '请输入删除原因！');
      return false
    } else v.reasonError = undefined;
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

  //获取用户
  if(LoginService.user.userPermissions){
    $scope.initData();
  }
  $scope.$on('user2Child', function(event){
    $scope.initData();
  });
});