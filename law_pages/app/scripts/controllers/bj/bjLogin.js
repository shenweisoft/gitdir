'use strict';
angular.module('sbAdminApp').controller('bjLoginCtrl', function ($scope, $stateParams, AdjustService, AdjustConfig, $state,$log,$rootScope) {

    //获取流水号
    $scope.serialNo = $stateParams.serialNo;
    //定义根据流水号获得用户session
    $scope.getSessionBySerialNoService = AdjustService.getSessionBySerialNo;
    //根据流水号获取session服务
    $scope.getSessionBySerialNoService({
        serialNo: $scope.serialNo
    }).success(function (result) {
        $log.info(result);
        if (result.code === AdjustConfig.commonConStant.SUCCESS) {
            $scope.adjustInfo = result.result;
            //表示编辑
            if($scope.adjustInfo.updateOrDetail == '1'){
                $state.go('dashboard.mediation', {'id':result.result.id,'isSelf':'1'});
            }else if($scope.adjustInfo.updateOrDetail == '2'){
                //表示详情
                //serialNo/:isReturn/:state/:id/:codeFileName/:isSelf
                //http://192.168.223.150:9000/#/dashboard/case_details/110107201801410/1/1002/2641/d0e3_eaca04bcaeed1_ee0e02d0e30ebe0_0/
                $state.go('dashboard.case_details', {'serialNo':result.result.serialNo,'isSelf':'1','state':$scope.adjustInfo.state,'id':$scope.adjustInfo.id,'codeFileName':''});
            }else{
                //请求错误
                $rootScope.toaster('error','错误', '请求数据错误！');
            }

        }
    });
});