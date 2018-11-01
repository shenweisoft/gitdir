'use strict';
angular.module('sbAdminApp').controller('ToBeDeletedCtrl', function($scope, $stateParams, $state, $location, $timeout, $http, $log, LoginService) {
	$scope.open = function($event) {
		$event.preventDefault();
		$event.stopPropagation();
		$scope.opened = true;
	};

	$scope.isOpen = false;

	$scope.openCalendar = function(e) {
		e.preventDefault();
		e.stopPropagation();

		$scope.isOpen = true;
	}
});