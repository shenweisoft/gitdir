'use strict';
angular.module('sbAdminApp').controller('MailboxValidationEntry', function($scope,$stateParams) {

	// TODO: cope with XiaoGUang to verify this usecase.
	$scope.toLoginEmail = function() {
		var address = "http://mail." + $stateParams.email.split('@')[1];
		window.open(address, '_blank');
	}
});