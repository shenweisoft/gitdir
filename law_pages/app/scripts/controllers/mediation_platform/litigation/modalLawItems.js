/**
 * Created by shenwei on 2017/12/13.
 */

var app = angular.module('sbAdminApp');
//选择依据
angular.module('sbAdminApp').controller('ModalLawItemsCtrl', function ($scope, $modalInstance, DictionaryConfig, items) {
    //法律条文
    $scope.isShow = items.isShow;
    $scope.lawItemArray = items.selectedItemArray;
    $scope.selectLawItem = function($event, v){
        if($event.target.checked) v.selected = true;
        else v.selected = false;
    }

    $scope.ok = function () {
        $modalInstance.close($scope.lawItemArray);
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});