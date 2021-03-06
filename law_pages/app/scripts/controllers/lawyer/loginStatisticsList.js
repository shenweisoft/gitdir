'use strict';
var app = angular.module('sbAdminApp');
app.filter('pointPersonFilter', function() {
  return function(arr,pointId) {
    arr = arr &&  arr.filter(function (val) {
      var insuranceCompany = val.insuranceCompany ? '('+val.insuranceCompany+')':''
      val.adjustName =   val.name +insuranceCompany;
      return val.deptId == pointId
    })
    return arr
  }
});
angular.module('sbAdminApp').controller('loginStatisticsListCtrl', function ($scope, $stateParams,$log,AdjustService, $state, DictionaryConfig, $location, $filter, LoginService,AdjustConfig,$rootScope,AdminConstant) {
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
  //当前日期
  $scope.currentDate = new Date();

  //定义数据对象
  function LoginStatisticsVO(){
    //开始时间
    this.startDate = "";
    //结束时间
    this.endDate = "";
    //当前登录人所在地区code
    this.lawOrgCode = "";
    //所选地区名称（市级法院功能）
    this.areaName = "";
    //调解机构id
    this.orgId = "";
    //调解点id
    this.deptId = "";
    //调解员id
    this.userId = "";
    this.pageSize = "10";
    this.pageNo = "1";
    this.pageTotal = "0"
  };
  $scope.loginStatisticsVO = new LoginStatisticsVO();

  $scope.loginStatisticsList = [];  //存储数据列表
  $scope.titleRegionName = ''; //当前请求的区域名
  $scope.adminRegion = AdminConstant.administrationRegions; //填充区域

  //初始化日期
  $scope.initDate = function(param){
    var now = new Date(); //当前日期
    var nowDayOfWeek = now.getDay(); //今天本周的第几天
    var nowDay = now.getDate(); //当前日
    var nowMonth = now.getMonth(); //当前月
    var nowYear = now.getYear(); //当前年
    nowYear += (nowYear < 2000) ? 1900 : 0;
    if(param == 'day'){
      $scope.loginStatisticsVO.startDate = new Date();
    }else if(param == 'weekday'){
      $scope.loginStatisticsVO.startDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek);
    }else if(param == 'month'){
      $scope.loginStatisticsVO.startDate = new Date(nowYear, nowMonth, 1);
    }else if(param == 'year'){
      $scope.loginStatisticsVO.startDate = new Date(nowYear, 0, 1);
    }
    $scope.loginStatisticsVO.endDate = new Date();

    //查询登录状态数据表
    $scope.queryLoginStatisticsList();
  };

  //格式化日期数据
  $scope.formatDate = function (date) {
    if(typeof date != 'string') {
      var year = date.getFullYear();
      var month = date.getMonth()+1;
      var day = date.getDate();
      return year+'-'+month+'-'+day;
    }
    return date;
  };

  //点击返回按钮
  $scope.statisticsSendBack = function(){
    $scope.loginStatisticsVO.startDate = "";  //格式化开始日期
    $scope.loginStatisticsVO.endDate = "";   //格式化结束日期
    $scope.loginStatisticsVO = new LoginStatisticsVO();
    $scope.loginStatisticsVO.areaName = $scope.sysUser.regionName;
    $scope.queryLoginStatisticsList();
  };

  //查询登录状态数据表
  $scope.queryLoginStatisticsList = function () {
    $scope.titleRegionName = $scope.sysExtPro.regionName.split('-').length == '3'? $scope.sysExtPro.regionName.split('-')[0]+$scope.sysExtPro.regionName.split('-')[2] : $scope.sysExtPro.regionName.split('-')[0];
    $scope.loginStatisticsVO.lawOrgCode = $scope.sysUser.userDepartList[0].orgId;
    //格式化时间
    if($scope.loginStatisticsVO.startDate) $scope.loginStatisticsVO.startDate = $scope.formatDate($scope.loginStatisticsVO.startDate);
    if($scope.loginStatisticsVO.endDate) $scope.loginStatisticsVO.endDate = $scope.formatDate($scope.loginStatisticsVO.endDate);
    //获取列表
    AdjustService.queryLoginStatisticsListByOrgIdUrl($scope.loginStatisticsVO).success(function (res) {
      if(res.code == '0') {
        $scope.loginStatisticsList = res.result;
      } else {
        $rootScope.toaster("error", "错误",res.message);
      }
    });
    //获取条目数
    AdjustService.queryLoginStatisticsCountByOrgIdUrl($scope.loginStatisticsVO).success(function (res) {
      if(res.code == '0') {
        $scope.loginStatisticsVO.pageTotal = res.result;
      } else {
        $rootScope.toaster("error", "错误",res.message);
      }
    });
  };

  //查询调解室与调解员数据
  var AdjustAllList = [];
  $scope.queryAdjustList = function () {
    AdjustService.selectAdjustDeptAndUserInfo({"orgId": $scope.loginStatisticsVO.lawOrgCode}).success(function (res) {
      if(res.code == '0') {
        var list = res.result;
        //过滤重复项
        $scope.adjustPersonList = [];
        list.forEach(function (val) {
          var exist =  _.find($scope.adjustPersonList,{deptId:val.deptId});
          if(!exist){
            $scope.adjustPersonList.push(val)
          }
        });
        AdjustAllList = angular.copy($scope.adjustPersonList);
        console.log(AdjustAllList)
      } else {
        $rootScope.toaster("error", "错误",res.message);
      }
    })
  };

  //根据当前登录人区域，填充区域选择框
  $scope.filterArea = function () {
    //$scope.adminRegion
    if($scope.sysUser.regionName.split('-').length != 3) {
      $scope.regionNameList = [];
      var regionName = $scope.sysUser.regionName.split('-')[0];
      $scope.adminRegion.filter(function (v) {
        if((v.fullName.indexOf(regionName) != -1 && v.level == '4') || v.fullName == $scope.sysUser.regionName) {
          $scope.regionNameList.push(v)
        }
      })
    }
  };

  //区县选择事件
  $scope.changeRegionName = function (regionName) {
    if(regionName.split('-').length != '3') { //中级法院默认查询全部
      $scope.queryAdjustList()
    } else {
      var region = _.find($scope.regionNameList, function (v) {
        return v.fullName == regionName
      });
      var regionCode = region.regionCode;
      //过滤数据
      $scope.adjustPersonList.length = 0;
      AdjustAllList.forEach(function (x) {
        if(regionCode == x.regionCode) {
          $scope.adjustPersonList.push(x)
        }
      })
    }
  };

  //点击查看人员详细信息
  $scope.handleCheckLogin = function (user) {
    $state.go('dashboard.loginStatisticsDetail', {userId: user.userId, userName: user.userName, loginStatisticsVO: JSON.stringify($scope.loginStatisticsVO)})
  };

  //导出
  $scope.exportExcel = function () {
    var url = 'lawProject/common/LoginSituationExportExcel?areaName='+$scope.loginStatisticsVO.areaName+'&deptId='+$scope.loginStatisticsVO.deptId+'&lawOrgCode='+$scope.loginStatisticsVO.lawOrgCode+'&orgId='+$scope.loginStatisticsVO.orgId+'&userId='+$scope.loginStatisticsVO.userId+'&startDate='+$scope.loginStatisticsVO.startDate+'&endDate='+$scope.loginStatisticsVO.endDate
    return url;
  };

  //初始化数据
  $scope.initData = function () {
    $scope.sysUser = LoginService.user.sysUser;
    $scope.sysExtPro = JSON.parse($scope.sysUser.userDepartList[0].extPro);
    //填充搜索的区域名称（区级固定为当前登录人地区，省级默认为登录人所在省，可根据下拉框详细选择所在区级）
    $scope.loginStatisticsVO.areaName = $scope.sysUser.regionName;
    //查询登录状态数据表
    $scope.queryLoginStatisticsList();
    //查询调解室与调解员数据
    $scope.queryAdjustList();
    //根据当前登录人区域，填充区域选择框
    $scope.filterArea();
  };

  //获取用户
  if(LoginService.user.userPermissions){
    $scope.initData();
  }
  $scope.$on('user2Child', function(event){
    $scope.initData();
  });
});