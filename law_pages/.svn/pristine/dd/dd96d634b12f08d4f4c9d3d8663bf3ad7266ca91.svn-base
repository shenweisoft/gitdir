/**
 * Created by shenwei on 2017/5/11.
 */
angular.module('sbAdminApp').controller('PersonDetailCtrl', function($scope, $modal, items, $modalInstance,$log,DictionaryConfig) {

    //当事人信息
    $scope.applyerArray = items.applyerArray;
    //性别集合
    $scope.sexList = DictionaryConfig.sexList;
    //证件类型集合
    $scope.certificateTypeList = DictionaryConfig.certificateTypeConstant;

    $log.info($scope.applyerArray);
    //取消
    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
});