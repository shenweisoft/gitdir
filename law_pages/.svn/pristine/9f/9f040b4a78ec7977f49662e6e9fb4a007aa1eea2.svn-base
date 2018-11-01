
angular.module('sbAdminApp').controller('compensateCalculateStep12Ctrl', function($scope, DictionaryConfig,$stateParams,$location,toaster,AdjustConfig,$state,LoginService,LoginConfig,LawConfig,CompensateService,$rootScope) {

    //当是详情时，替换头部信息
    if($location.url().split('/')[$location.url().split('/').length - 1] === 'compensateCalculateDetail') {
        $scope.options.isDetails = false;
    } else {
        $scope.options.isDetails = true;
    }

    //获取当前步骤
    $scope.options.step = parseInt($stateParams.step) || $scope.options.step;
    //身份类型
    $scope.idTypeList = DictionaryConfig.idTypeConstant;
    //删除索赔方、赔偿方
    $scope.deleteCompensationApplyer =function (compensationApplyer) {
        if(confirm('您确认删除吗？')) {
            //当数据库中存在数据时，调用后台
            if(compensationApplyer.id) {
                CompensateService.deleteCompensationApplyerInfo({
                    id: compensationApplyer.id
                }).success(function (res) {
                    if (res.code === AdjustConfig.commonConStant.SUCCESS) {
                        var index = _.findIndex($scope.compensateInfo.compensationApplyerInfoList,{id:compensationApplyer.id});
                        //从数组中删除该项
                        $scope.compensateInfo.compensationApplyerInfoList.splice(index, 1);
                    } else {
                        $rootScope.toaster("error", "错误", res.message);
                    }
                });
            } else {
                //获取所删除的对象在数组中的索引值
                var index = $scope.compensateInfo.compensationApplyerInfoList.indexOf(compensationApplyer);
                //从数组中删除该项
                $scope.compensateInfo.compensationApplyerInfoList.splice(index, 1);
            }
        }
    };
});


   