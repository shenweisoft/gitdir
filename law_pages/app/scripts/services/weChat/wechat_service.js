'use strict';

angular.module('sbAdminApp').factory('WeChatService', function($http, WeChatConfig) {
  return {
    getAnalysisUserPortrait: function(data) { //查询小程序用户画像
      return $http({
        method: 'post',
        url: WeChatConfig.weChatConstant.getAnalysisUserPortrait,
        data: data
      })
    },
    getAnalysisVisitPage: function(data) { //查询小程序页面访问次数
      return $http({
        method: 'post',
        url: WeChatConfig.weChatConstant.getAnalysisVisitPage,
        data: data
      })
    },
    getUserVisitDailysummary:  function(data) { //查询用户访问小程序次数
      return $http({
        method: 'post',
        url: WeChatConfig.weChatConstant.getUserVisitDailysummary,
        data: data
      })
    }
  };
});