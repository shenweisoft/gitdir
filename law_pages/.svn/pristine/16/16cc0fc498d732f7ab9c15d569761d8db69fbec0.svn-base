/**
 * Created by Administrator on 2017/3/7 0007.
 */
'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:divisionCtrl
 * @description
 * # 分案controller
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp').controller('divisionCtrl', function ($scope, $log, $state, $modal) {

  //是否显示过滤选项框
  $scope.filterShow = false;
  //案件查询详细页头部
  $scope.detailsHeadShow = true;
  //案件类型
  $scope.fileType = 'all';

  //文书
  $scope.instrumentList = function () {
    var modalInstance = $modal.open({
      templateUrl: 'views/pages/on_file/instrument_list.html',
      controller: 'instrumentCtrl',
      size: 'lg',
      resolve: {
        items: function () {
          return {}
        }
      }
    });
    //返回值
    modalInstance.result.then(function (data) {
      $scope.refreshAllData();
    }, function () {
    });
  };
  //司法邮件
  $scope.judicialEmail =function () {
    var modalInstance = $modal.open({
      templateUrl: 'views/pages/on_file/judicial_email.html',
      controller: 'judicialCtrl',
      size: 'lg',
      resolve: {
        items: function () {
          return {}
        }
      }
    });
    //返回值
    modalInstance.result.then(function (data) {
      $scope.refreshAllData();
    }, function () {
    });
  }


})

