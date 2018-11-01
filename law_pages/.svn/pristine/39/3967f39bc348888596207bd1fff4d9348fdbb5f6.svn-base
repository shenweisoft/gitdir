angular.module('sbAdminApp').controller('OnLineConfiguration', function($scope, $modal,$log,toaster,$state,LoginService,LoginConfig,$rootScope) {

    //查询环境配置表Service
    $scope.queryJyEnvironmentInfoService = LoginService.queryJyEnvironmentInfo;
    //更新环境配置表Service
    $scope.updateJyEnvironmentInfoService = LoginService.updateJyEnvironmentInfo;
    //插入环境配置表Service
    $scope.insertJyEnvironmentInfoService = LoginService.insertJyEnvironmentInfo;
    //定义页面对象
    function JyEnvironmentInfo(){
        //主键
        this.id = "";
        //类型
        this.environmentType = "";
    }
    //新建空对象
    $scope.jyEnvironmentInfo = new JyEnvironmentInfo();
    //请求接口，获取onlineConfigId
    var getOnlineConfig = function() {
        $scope.queryJyEnvironmentInfoService($scope.jyEnvironmentInfo).success(function(res) {
            if(res.code == LoginConfig.commonConStant.SUCCESS) {
                if(res.result) {
                    $scope.jyEnvironmentInfo = res.result;
                }
            } else {
                $rootScope.toaster("error", "错误", res.message);
            }
        })
    }
    //初始化数据
    getOnlineConfig();

    //点击确定按钮
    $scope.insertOrUpdateJyEnvironmentInfo = function() {
        //判断是否存在onlineConfigId，存在 -> 修改   不存在 -> 插入
        if($scope.jyEnvironmentInfo.id) {
            //调用修改接口
            $scope.updateJyEnvironmentInfoService($scope.jyEnvironmentInfo).success(function(res) {
                if(res.code == LoginConfig.commonConStant.SUCCESS) {
                    $rootScope.toaster("success", "成功", "修改成功");
                } else {
                    $rootScope.toaster("error", "错误", res.message);
                }
            })
        } else {
            //调用插入接口
            $scope.insertJyEnvironmentInfoService($scope.jyEnvironmentInfo).success(function(res) {
                if(res.code == LoginConfig.commonConStant.SUCCESS) {
                    //赋予ID
                    $scope.jyEnvironmentInfo.id = res.result;
                    $rootScope.toaster("success", "成功", "修改成功");
                } else {
                    $rootScope.toaster("error", "错误", res.message);
                }
            })
        }
    }
});

