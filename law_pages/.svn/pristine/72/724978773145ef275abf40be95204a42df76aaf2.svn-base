'use strict';

/**
 * @ngdoc directive
 * @name izzyposWebApp.directive:adminPosHeader
 * @description
 * # adminPosHeader
 */
angular.module('sbAdminApp')
	.directive('headerNotification',function(){
		return {
        templateUrl:'scripts/directives/header/header-notification/header-notification.html',
        restrict: 'E',
        replace: true,
      	controller: function ($scope, LoginService, $state, DictionaryConfig,$log) {
          $scope.logoutService = LoginService.logout;
        	$scope.logout = function(){
            $scope.logoutService({
            	"id":LoginService.user.id
						}).then(function(result){
              $state.go("login");
						}, function(error){
							
						})
					}
				}
    	}
	});


