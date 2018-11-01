/**
 * Created by shenwei on 2017/5/5.
 */


'use strict';
angular.module('sbAdminApp').controller('AppraisalStep3Ctrl', function ($scope, DictionaryConfig, AdjustService, AdjustConfig, $stateParams, $modal) {
  $scope.co.step = 3;
  //委托主体
  $scope.principalAgentList = DictionaryConfig.principalAgentList;
  //鉴定用途
  $scope.identificationPurposeList = DictionaryConfig.identificationPurposeList;
  //日历打开
  $scope.open = function ($event, info) {
    $event.preventDefault();
    $event.stopPropagation();
    info.opened = true;
  };

  //点击随机匹配，显示弹框
  $scope.isRandom = false;
  $scope.showRandom = function () {
    $scope.isRandom = true;
  };
  $scope.handleRandom = function () {
    $scope.isRandom = false;
    $scope.random();
  };

  //打开鉴定评价
  $scope.appraisalCommet = function () {
    var modalInstance = $modal.open({
      templateUrl: 'views/pages/appraisal/appraisal_comment.html',
      controller: 'appraisalCommentCtrl',
      size: 'lg',
      resolve: {
        loadMyFile: function ($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/appraisal/appraisal_comment.js']
          })
        },
        orgId:function(){
          return  $scope.appraisalInfo.appraisalOrgId;
        }
      }
    });
    //返回值
    modalInstance.result.then(function (res) {
      console.log(res);
    }, function () {
    });
  };

});