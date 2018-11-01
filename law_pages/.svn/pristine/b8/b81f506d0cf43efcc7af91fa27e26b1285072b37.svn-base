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
angular.module('sbAdminApp').controller('AlgorithmListCtrl', function ($scope, $stateParams, $state, $http, $log, AlgorithmConfig, AlgorithmService, DictionaryConfig, toaster, $filter,$rootScope) {

    //查询集合
    $scope.queryJyAlgorithmInfoListService = AlgorithmService.queryJyAlgorithmInfoList;
    //查询分页
    $scope.queryJyAlgorithmInfoSumService = AlgorithmService.queryJyAlgorithmInfoSum;

    //创建对象构造器
    function JyAlgorithmInfoVO(){
        //查询区域
        this.searchArea = "";
        //当事人
        this.applicantArray = "";
        //流水号
        this.serailNo = "";
        //每页条数
        this.pageSize = DictionaryConfig.pageNum;
        //当前页数 默认为第一页
        this.pageNo = 1;
        //总共页数 默认一页
        this.totalPage = 1;
    }
    //初始化对象
    $scope.jyAlgorithmInfoVO = new JyAlgorithmInfoVO();
    //后台查询数据
    $scope.initData = function(){
        //查询数据
        $scope.queryJyAlgorithmInfoListService($scope.jyAlgorithmInfoVO).success(function(result) {
            //请求成功
            if (result.code == AlgorithmConfig.commonConstant.SUCCESS) {
                $scope.jyAlgorithmInfoList = result.result;
            }else{
                $rootScope.toaster("error", "错误", "请联系系统管理员");
            }
        });
        //查询总条数
        $scope.queryJyAlgorithmInfoSumService($scope.jyAlgorithmInfoVO).success(function(result) {
            if (result.code == AlgorithmConfig.commonConstant.SUCCESS) {
                $scope.jyAlgorithmInfoVO.totalPage =  result.result;
            }else{
                $rootScope.toaster("error", "错误", "请联系系统管理员");
            }
        })
    };
    //开始调用数据
    $scope.initData();
    //点击当前页面，展示数据
    $scope.pageChanged = function () {
        $scope.initData();
    };
    //搜索数据
    $scope.searchData = function(){
        $scope.initData();
    };
    //查询详细
    $scope.queryDetail = function(jyAlgorithmInfo){

        $state.go("dashboard.algorithm",{id:jyAlgorithmInfo.id});
    }
});