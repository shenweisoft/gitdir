var app = angular.module('sbAdminApp');

app.filter('id2Text', function() {
  return function(id,data) {
    var result = _.find(data, {
      id: id+""
    });
    return result? result.value:""
  }
});
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

angular.module('sbAdminApp').controller('policeInfoListCtrl', function (LoginService,AdminConstant,$location,$scope, $stateParams, $state, $http, $log, PoliceConfig, PoliceService, DictionaryConfig, toaster, $filter,IdentityService,$rootScope) {
  //保险公司数据
  $scope.companyList = PoliceConfig.insuranceList;
  //发送状态
  $scope.sendTypeList = PoliceConfig.sendTypeList;
  //发送状态
  $scope.sendHeTypeList = PoliceConfig.sendHeTypeList;
  //事故类型
  $scope.accidentTypeList = PoliceConfig.accidentTypeList;

  //创建flag常量
  $scope.FLAG = {
    case: '案件信息登记',
    inspect: '检验鉴定填报',
    insurance: '保险信息填报',
    healthInfoFill: '伤者信息登记',
    healthInfoSupplement: '卫生部门信息补录',
    injuryInfoFill: '伤者信息登记',
    injuryInfoSupplement: '工伤医保信息补录'
  };
  //创建页面数据对象
  $scope.co = {
    stateFlag: $stateParams.flag,
    listTitle: $scope.FLAG[$stateParams.flag],
    policeList: [],
    isAddBtnShow: ($stateParams.flag != 'inspect' && $stateParams.flag != 'insurance' && $stateParams.flag != 'healthInfoSupplement' && $stateParams.flag != 'injuryInfoSupplement')? true : false
  };
  $scope.riskTypesMap = {
    riskType0: '交强险',
    riskType1: '三者险',
    riskType2: '车损险'
  };
  //创建搜索对象
  $scope.queryVO = {
    pageNo: '1',
    pageSize: '10',
    pageTotal: '0',
    searchText: ''
  };
  //获取案件信息登记列表
  $scope.queryCaseList = function () {
    PoliceService.queryAccidentInfo({pageNo: $scope.queryVO.pageNo, searchText: $scope.queryVO.searchText}).success(function (response) {
      if(response.code == PoliceConfig.commonConstant.SUCCESS) {
        $scope.co.policeList = response.result;
        $scope.queryVO.pageTotal = response.total;
      } else {
        $rootScope.toaster("error", "错误", response.message)
      }
      console.log(response)
    })
  };
  //获取鉴定信息列表
  $scope.queryInspectList = function () {
      PoliceService.queryAppraisalInfo({pageNo: $scope.queryVO.pageNo, searchText: $scope.queryVO.searchText}).success(function (response) {
          if(response.code == PoliceConfig.commonConstant.SUCCESS) {
              $scope.co.policeList = response.result;
              $scope.queryVO.pageTotal = response.total;
          } else {
              $rootScope.toaster("error", "错误", response.message)
          }
          console.log(response)
      })
  };

  //获取信息填报菜单
  $scope.queryCompanyInfoList = function () {
    PoliceService.queryCompanyInfo({pageNo: $scope.queryVO.pageNo,searchText: $scope.queryVO.searchText}).success(function (response) {
      if(response.code == PoliceConfig.commonConstant.SUCCESS) {
        $scope.co.policeList = response.result;
        $scope.queryVO.pageTotal = response.total;
      } else {
        $rootScope.toaster("error", "错误", response.message)
      }
      console.log(response)
    })
  };
  //获取医院信息填报菜单
  $scope.queryHealthInfoFillList = function () {
      PoliceService.queryHealthInfo({pageNo: $scope.queryVO.pageNo, searchText: $scope.queryVO.searchText,type:'TB'}).success(function (response) {
          if(response.code == PoliceConfig.commonConstant.SUCCESS) {
              $scope.co.policeList = response.result;
              $scope.queryVO.pageTotal = response.total;
          } else {
              $rootScope.toaster("error", "错误", response.message)
          }
          console.log(response)
      })
  };
   //获取医院信息补录菜单
  $scope.queryHealthInfoSupplementList = function () {
        PoliceService.queryHealthInfo({pageNo: $scope.queryVO.pageNo, searchText: $scope.queryVO.searchText,type:'BL'}).success(function (response) {
            if(response.code == PoliceConfig.commonConstant.SUCCESS) {
                $scope.co.policeList = response.result;
                $scope.queryVO.pageTotal = response.total;
            } else {
                $rootScope.toaster("error", "错误", response.message)
            }
            console.log(response)
        })
  };
    //获取工伤信息填报菜单
    $scope.queryinjuryInfoFillList = function () {
        PoliceService.queryIndMedInfo({pageNo: $scope.queryVO.pageNo, searchText: $scope.queryVO.searchText,type:'TB'}).success(function (response) {
            if(response.code == PoliceConfig.commonConstant.SUCCESS) {
                $scope.co.policeList = response.result;
                $scope.queryVO.pageTotal = response.total;
            } else {
                $rootScope.toaster("error", "错误", response.message)
            }
            console.log(response)
        })
    };
//获取工伤信息填报菜单
    $scope.queryinjuryInfoSupplementList = function () {
        PoliceService.queryIndMedInfo({pageNo: $scope.queryVO.pageNo, searchText: $scope.queryVO.searchText,type:'BL'}).success(function (response) {
            if(response.code == PoliceConfig.commonConstant.SUCCESS) {
                $scope.co.policeList = response.result;
                $scope.queryVO.pageTotal = response.total;
            } else {
                $rootScope.toaster("error", "错误", response.message)
            }
            console.log(response)
        })
    };


  //请求后台，获取数据列表
  $scope.queryPoliceList = function () {
    switch($stateParams.flag) {
      case 'case': //案件信息登记菜单
        $scope.queryCaseList();
        break;
      case 'inspect': //检验鉴定填报
        $scope.queryInspectList();
        break;
      case 'insurance': //保险信息填报菜单
        $scope.queryCompanyInfoList();
        break;
      case 'healthInfoFill': //医院信息填报菜单
        $scope.queryHealthInfoFillList();
        break;
      case 'healthInfoSupplement': //医院信息补录填报菜单
        $scope.queryHealthInfoSupplementList();
        break;
      case 'injuryInfoFill': //工伤信息填报菜单
        $scope.queryinjuryInfoFillList();
        break;
      case 'injuryInfoSupplement': //工伤信息补录菜单
        $scope.queryinjuryInfoSupplementList();
        break;
    }
  };
  //初始化
  $scope.initData = function () {
    $scope.co.userDepar = LoginService.user.sysUser.userDepartList[LoginService.user.sysUser.currentOrg];
    //请求后台，获取数据列表
    $scope.queryPoliceList();
  };
  //搜索、分页
  $scope.initOrg = function (isSearch) {
    isSearch? $scope.queryVO.pageNo = 1 : '';
    $scope.queryPoliceList();
    console.log($scope.queryVO)
  };
  //新增案件
  $scope.appendPolice = function (stateFlag) {
    switch(stateFlag) {
      case 'case':
        $state.go('dashboard.policeInfo.caseInfoRegister', {flag: $stateParams.flag});
        break;
      case 'healthInfoFill':
        $state.go('dashboard.policeInfo.healthInfoFill', {flag: $stateParams.flag});
        break;
      case 'injuryInfoFill':
        $state.go('dashboard.policeInfo.injuryInfoFill', {flag: $stateParams.flag});
        break;
    }
  };
  //查看案件详情
  $scope.handleCaseInfo = function (police) {
    //根据flag，跳转到不同页面
    switch($stateParams.flag) {
      case 'case': //案件信息登记
        $state.go('dashboard.policeInfo.caseInfoRegister', {flag: $stateParams.flag, id: police.id});
        break;
      case 'inspect': //检验鉴定填报
        $state.go('dashboard.policeInfo.inspectReported', {flag: $stateParams.flag, id: police.id});
        break;
      case 'insurance': //保险信息填报
        $state.go('dashboard.policeInfo.insuranceReported', {flag: $stateParams.flag, id: police.id});
        break;
      case 'healthInfoFill': //卫生部信息填报&&卫生部信息补录
        $state.go('dashboard.policeInfo.healthInfoFill', {flag: $stateParams.flag, id: police.id});
        break;
      case 'healthInfoSupplement': //卫生部信息填报&&卫生部信息补录
        $state.go('dashboard.policeInfo.healthInfoFill', {flag: $stateParams.flag, id: police.id});
        break;
      case 'injuryInfoFill': //工伤医保信息填报&&工伤医保信息补录
        $state.go('dashboard.policeInfo.injuryInfoFill', {flag: $stateParams.flag, id: police.id});
        break;
      case 'injuryInfoSupplement': //工伤医保信息填报&&工伤医保信息补录
        $state.go('dashboard.policeInfo.injuryInfoFill', {flag: $stateParams.flag, id: police.id});
        break;
    }
  };
  //初始化
  $scope.initPage = function () {
    $scope.$on('user2Child', function () {
      $scope.initData();
    });
    if(LoginService.user.userPermissions) {
      $scope.initData();
    }
  };
  $scope.initPage();

});