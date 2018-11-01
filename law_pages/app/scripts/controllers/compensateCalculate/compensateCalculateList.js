
angular.module('sbAdminApp').filter('valueNull1', function() {
  return function(val) {
    return val && val || '-';
  }
});

angular.module('sbAdminApp').filter('stringDate', function() {
  return function(dt) {
    if(typeof (dt) == "string")
    {
      dt = dt.replace(/\-/gi,"\/");
      dt = Date.parse(dt);
    }
    return dt && dt;
  }
});

angular.module('sbAdminApp').controller('CompensateCalculateListCtrl', function($scope,$state,$location,LoginConfig,DictionaryConfig,toaster,CompensateService,$rootScope) {
  // 赔偿标准数据
  $scope.queryCompensateInfoListInfo = CompensateService.queryCompensateInfoListInfo;
  //获取总条数
  $scope.queryCompensateInfoSumInfo = CompensateService.queryCompensateInfoSumInfo;

  //定义子键对象
  var QueryData = function () {
    this.conditionQuery = "";
    this.pageSize = 10;
    this.pageTotal = "";
    this.pageNo = 1;
  };
  //实例化子键对象
  $scope.queryData = new QueryData();

  //定义数据对象
  $scope.data = {
    lawCaseList: []
  };

  //请求后台数据
  $scope.initData = function () {
    //整理数据（后台需要）
    var data = angular.copy($scope.queryData);
    //请求数据
    $scope.queryCompensateInfoListInfo(data).success(function (res) {
      if (res.code == LoginConfig.commonConStant.SUCCESS) {
        console.log(res);
        $scope.data.lawCaseList = res.result;
      } else {
        $rootScope.toaster("error", "错误", res.message);
      }
    });

    //请求分页
    $scope.queryCompensateInfoSumInfo($scope.queryData).success(function (res) {
      if (res.code == LoginConfig.commonConStant.SUCCESS) {
        $scope.queryData.pageTotal = res.result;
      } else {
        $rootScope.toaster("error", "错误", res.message);
      }
    })
  };
  $scope.initData();

  //查询流水号
  $scope.goCase = function (lawCase) {
    console.log(lawCase)
    //lawCase.state = 2;
    //判断案件状态  state  1：进行中  2：已完结
    if(lawCase.state && lawCase.state == 1) {
      //如果案件状态是进行中，跳转到相应案件步骤
      $location.url("/dashboard/compensateCalculate/"+lawCase.id+"/compensateCalculateStep12/1");
    } else {
      //跳转到案件详情
      $location.url("/dashboard/compensateCalculate/"+lawCase.id+"/compensateCalculateDetail");
      //$state.go("dashboard.compensateCalculate.compensateCalculateDetail", {detailsId: lawCase.id});
    }
  };

  //点击分页
  $scope.pageChanged = function () {
    $scope.initData();
  };

  //搜索
  $scope.searchData = function () {
    $scope.initData();
  };


  /*$scope.mtDenizenIncomeNorm={
        pageSize:DictionaryConfig.pageNum
  }
  //toaster类型
  var level = {
        "warn": "warn",
        "error": "error",
        "success": "success"
    }
  //toaster 标题
  var title = {
        "error": "错误",
        "success": "成功"
    }
  //toaster 提示
    $scope.CONSTANT={
        "messageBackend":"查询后台数据失败！请联系管理员",
        "errormessag":"请联系系统管理员"
    }
  //获取数据
  $scope.getDataInfo = function(pageNo) {
        $scope.mtDenizenIncomeNorm.pageNo = pageNo;
       
        $scope.CompensationArr($scope.mtDenizenIncomeNorm).success(function (result) {
            if (result.code == LoginConfig.commonConStant.SUCCESS) {
                $scope.deleteIndexList = result.result;
            } else {
                $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageBackend);
            }
        })
        //获取总条数
        $scope.countCompensateStandard($scope.mtDenizenIncomeNorm).success(function(result) {
            var data = result.result;
            if (result.code == LoginConfig.commonConStant.SUCCESS) {
                $scope.pageData.totalItems = data;
            } else {
                $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageBackend);
            }
        })
  }

  $scope.getDataInfo($scope.pageData.currentPage, DictionaryConfig.pageNum);*/
 
});

