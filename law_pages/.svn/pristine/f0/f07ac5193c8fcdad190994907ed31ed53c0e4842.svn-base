//时间去除0
angular.module('sbAdminApp').filter('timeFormat', function() {
    return function (time) {
        return time.substr(0, time.indexOf(' '));
    }
});

//金钱保留两位小数
angular.module('sbAdminApp').filter('moneyFormat', function() {
    return function (money) {
        return money.toFixed(2);
    }
});

angular.module('sbAdminApp').controller('TradeIncomeForm', function($scope, $modal,$log,toaster,$state,LoginService,LawConfig,$rootScope) {

    //service常量
    $scope.commonConstant = LawConfig.commonConstant;

    //定义分页对象
    function PageObj() {
        this.pageNo = 1;        //当前页
        this.totalPage = 0;     //总页数
        this.itemNum = 10;   //每页条目数
    }
    //实例化分页对象
    $scope.pageObj = new PageObj();

    //定义行业收入表对象
    var TradeIncomeObj = function () {
        this.searchText = "";    //搜索框内容
        this.dataList = [];     //列表数据
    };
    //实例化行业收入表对象
    $scope.tradeIncomeObj = new TradeIncomeObj();

    //定义后台请求数据对象
    $scope.serverObj = {
        industryType: "",   //行业类别数据（名称与代码）
        regionNameList: []   //区域名称列表
    };

    //请求后台，获取区域数据
    LoginService.selectAdminRegion({regionName: ''}).success(function(res) {
        if(res.code === $scope.commonConstant.SUCCESS) {
            $scope.serverObj.regionNameList = res.result;
        } else {
            $rootScope.toaster("error", "错误", res.message);
        }
    });

    //请求后台，获取行业类别数据
    LoginService.queryJyIndustryNameInfo({}).success(function(res) {
        if(res.code === $scope.commonConstant.SUCCESS) {
            $scope.serverObj.industryType = res.result;
        } else {
            $rootScope.toaster("error", "错误", res.message);
        }
    });

    //请求后台，获取行业收入数据列表
    $scope.getDataList = function () {
        //获取数据列表
        LoginService.queryJyIndustryDataListInfo({pageNo: $scope.pageObj.pageNo, regionAndIndustry: $scope.tradeIncomeObj.searchText}).success(function(res) {
            if(res.code === $scope.commonConstant.SUCCESS) {
                $scope.tradeIncomeObj.dataList = res.result;
                console.log(res.result)
            } else {
                $rootScope.toaster("error", "错误", res.message);
            }
        });
        //获取总条数
        LoginService.queryJyIndustryPageCountInfo({regionAndIndustry: $scope.tradeIncomeObj.searchText}).success(function(res) {
            if(res.code === $scope.commonConstant.SUCCESS) {
                $scope.pageObj.totalPage = res.result;
            } else {
                $rootScope.toaster("error", "错误", res.message);
            }
        })
    };
    $scope.getDataList();

    //显示弹出框（新增/修改）
    $scope.handleModalShow = function (tradeIncomeFormObj) {
        var data = angular.copy(tradeIncomeFormObj);   //拷贝一次列表对象，避免列表对象对弹出框对象相互影响
        var tradeModal = $modal.open({//打开弹窗页
            templateUrl:'views/pages/tradeIncomeForm/tradeIncomePopup.html',
            controller:'TradeIncomePopup',
            size:'lg',
            resolve:{
                items:function(){
                    return {
                        tradeIncomeFormObj: data,   //将需要修改的数据通过items对象传给模态框控制器
                        serverObj: $scope.serverObj     //将获取的后台数据通过items对象传给模态框控制器
                    }
                }
            }
        });
        //弹出框返回值
        //getList
        tradeModal.result.then(function(data){
            //如果存在请求列表标识，调用请求函数
            if(data.getList) {
                $scope.getDataList();
            }
        })
    };

    //请求后台获取列表数据
    $scope.listArr = [
        {
            regionName: '北京',
            startDate: '2011',
            endDate: '2016',
            industryType: '金融业',
            industryTypeName: '会计',
            yearIncome: '120000',
            avgIncome: '10000'
        },{
            regionName: '上海',
            startDate: '2010',
            endDate: '2017',
            industryType: '教师',
            industryTypeName: '体育教师',
            yearIncome: '100000',
            avgIncome: '8000'
        }
    ];

    //点击分页
    $scope.pageChanged = function () {
        $scope.getDataList();
    };

    //点击搜索按钮
    $scope.handleSearch = function () {
        $scope.pageObj.pageNo = 1;
        $scope.getDataList();
    };

    //列表删除按钮
    $scope.handleDelBtn = function (tradeIncomeFormObj) {
        LoginService.deleteJyIndustryDataInfo({id: tradeIncomeFormObj.id}).success(function (res) {
            if(confirm('确认删除该项？')) {
                if(res.code === $scope.commonConstant.SUCCESS) {
                    if(res.result != null) {
                        $rootScope.toaster("error", "错误", '删除失败');
                    } else {
                        $rootScope.toaster("success", "成功", '删除成功');
                        $scope.getDataList();
                    }
                } else {
                    $rootScope.toaster("error", "错误", res.message);
                }
            }
        })
    };
});

