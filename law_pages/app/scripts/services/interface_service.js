/**
 * Created by design on 2017/8/1.
 */
/**
 * Created by shenwei on 2017/5/6.
 */
'use strict';

angular.module('sbAdminApp').factory('InterfaceService', function($http, InterfaceConfig) {
  return {
    policeAcr1Url: function(data) {
      return $http({
        method: 'post',
        url: InterfaceConfig.interfaceConstant.policeAcr1Url,
        data: data
      })
    },
    claimMessageReturn : function(data) {
      return $http({
        method: 'post',
        url: InterfaceConfig.interfaceConstant.claimMessageReturnUrl,
        data: data
      })
    },
    claimIdentificationReturn : function(data){
      return $http({
        method: 'post',
        url: InterfaceConfig.interfaceConstant.claimIdentificationReturnUrl,
        data: data
      })
    },
    documentMessageReturn : function(data){
        return $http({
            method: 'post',
            url: InterfaceConfig.interfaceConstant.documentMessageReturnUrl,
            data: data
        })
    },
    reconciliationOfClaimsResults : function(data){
      return $http({
        method: 'post',
        url: InterfaceConfig.interfaceConstant.reconciliationOfClaimsResultsUrl,
        data: data
      })
    },
    sendClosedCaseToJudge : function(data){
        return $http({
            method: 'post',
            url: InterfaceConfig.interfaceConstant.sendClosedCaseToJudgeUrl,
            data: data
        })
    }
  };
});
