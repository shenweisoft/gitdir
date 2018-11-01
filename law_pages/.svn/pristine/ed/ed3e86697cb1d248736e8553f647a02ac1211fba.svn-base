'use strict';
/**
 * @ngdoc directive
 * @name izzyposWebApp.directive:adminPosHeader
 * @description
 * # adminPosHeader
 */
angular.module('sbAdminApp').directive('header', function() {
    return {
        templateUrl: 'scripts/directives/header/header.html',
        restrict: 'E',
        replace: true,

        controller: function($scope, LoginService, DictionaryConfig, $log, $http) {
        	$scope.IsShow = true;
        	$scope.IsShowf= function(){
        		if ($scope.IsShow) {
        			$scope.IsShow = false;
        		}else{
        			$scope.IsShow = true;
        		}
        	}
        }
    }
});