'use strict';
var app = angular.module('sbAdminApp');
app.controller('appraisalSupComplete', function($scope, LoginService) {
  $scope.co = {
    parentOrgName: ''
  };
  //获取登录用户信息
  $scope.queryUserInfoService = LoginService.queryUserInfo;
  $scope.queryUserInfoService().success(function(result) {
    if (result.result) {
      //用户赋值
      $scope.user = result.result;
      $scope.userDepart = $scope.user.sysUser.userDepartList[$scope.user.sysUser.currentOrg];
      $scope.co.parentOrgName = $scope.userDepart.parentOrgName;
    }
  })
});