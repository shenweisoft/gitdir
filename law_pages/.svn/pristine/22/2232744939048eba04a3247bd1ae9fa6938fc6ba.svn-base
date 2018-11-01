'use strict';

angular.module('sbAdminApp').controller('SueStep6Ctrl', function($scope,$state, DictionaryConfig) {
	$scope.co.step = 6;
	$scope.indentityList = DictionaryConfig.proxyTypeConstant
	$scope.currentTime = new Date();
    //签字页
    $scope.signPage = function () {
        var url = $state.href('signDetail',{serialNo:$scope.adjust.serialNo});
        window.open(url)
    }
})