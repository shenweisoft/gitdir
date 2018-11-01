angular.module('sbAdminApp').controller('HarmGradeForm', function($scope, $modal,$log,toaster,$state,LoginService,LoginConfig,LawConfig,$rootScope) {

    //service常量
    $scope.commonConstant = LawConfig.commonConstant;

    //定义分页对象
    function PageObj() {
        this.pageNo = 1;        //当前页
        this.totalPage = "";     //总页数
        this.itemNum = 10;   //每页条目数
    }
    //实例化分页对象
    $scope.pageObj = new PageObj();

    //定义伤残等级表对象
    var HarmGradeObj = function () {
        this.searchText = "";   //搜索框文字
        this.dataList = [];     //伤残等级数据列表
    };
    //实例化伤残等级表对象
    $scope.harmGradeObj = new HarmGradeObj();

    //定义需要传给弹框的数据对象
    $scope.toModalData = {
        category: ""    //伤残等级所属分类
    };

    //请求后台，获取伤残等级所属分类编码
    LoginService.selectCategoryDisabilityInfo({}).success(function (res) {
        if(res.code === $scope.commonConstant.SUCCESS) {
            $scope.toModalData.category = res.result;
        } else {
            $rootScope.toaster("error", "错误", res.message);
        }
    });

    //请求后台，获取伤残等级列表与分页
    $scope.dataInfo = function () {
        //获取数据列表
        LoginService.queryMtDisabilityGradeInfo({pageNo: $scope.pageObj.pageNo, gradeName: $scope.harmGradeObj.searchText}).success(function (res) {
            if(res.code === $scope.commonConstant.SUCCESS) {
                $scope.harmGradeObj.dataList = res.result;
            } else {
                $rootScope.toaster("error", "错误", res.message);
            }
        });

        //获取总条数
        LoginService.queryMtDisabilityGradeTotalInfo({gradeName: $scope.harmGradeObj.searchText}).success(function (res) {
            if(res.code === $scope.commonConstant.SUCCESS) {
                $scope.pageObj.totalPage = res.result;
            } else {
                $rootScope.toaster("error", "错误", res.message);
            }
        })
    };
    $scope.dataInfo();

    //新增/修改按钮点击，打开弹出框
    $scope.handleModalShow = function (updateData) {

        //当修改时，根据所选项，获取后台标识（锁定模态框输入标识）
        var isLock;
        if(updateData) {
            LoginService.selectByDisabilityGradeIdInfo({id: updateData.id}).success(function(res) {
                if(res.result > 1) {
                    isLock = true;
                }
                showModal();
            });
        } else {
            showModal();
        }

        function showModal() {
            var toModalData = angular.copy($scope.toModalData);
            var harmModal = $modal.open({//打开弹窗页
                templateUrl:'views/pages/harmGradeForm/harmGradePopup.html',
                controller:'HarmGradePopup',
                size:'lg',
                resolve:{
                    items:function(){
                        return {
                            toModalData: toModalData,
                            updateData: updateData,
                            isLock: isLock    //弹出框内容锁定标识
                        }
                    }
                }
            });
            //弹出框返回值
            //getList
            harmModal.result.then(function(data){
                //如果存在请求列表标识，调用请求函数
                if(data.getList) {
                    $scope.dataInfo();
                }
            })
        }
    };

    //分页按钮点击
    $scope.pageChanged = function () {
        $scope.dataInfo();
    };

    //搜索按钮点击
    $scope.handleSearchBtn = function () {
        $scope.pageObj.pageNo = 1;
        $scope.dataInfo();
    };

    //删除按钮点击
    $scope.handleDelete = function (data) {
        if(confirm('确认删除该项？')) {
            LoginService.deleteCategoryDisabilityInfo({id: data.id}).success(function(res) {
                if(res.code === $scope.commonConstant.SUCCESS) {
                    $scope.dataInfo();
                    $rootScope.toaster("success", "成功", '删除成功');
                } else {
                    $rootScope.toaster("error", "错误", res.message);
                }
            })
        }
    };
});

