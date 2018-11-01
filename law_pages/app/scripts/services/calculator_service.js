'use strict';
/**
 * 计算器service
 * @param $http
 * @param AdjustConfig
 * @returns
 */
angular.module('sbAdminApp').factory('CalculatorService', function($http, AdjustConfig) {
    return {
    	savePartClaimData: function(data) {
            return $http({
                method: 'post',
                url: AdjustConfig.pictureConstant.savePartClaimDataUrl,
                data:angular.toJson(data.algorithmapplyerinfoname)
            })
        },
        listJyAlgorithmClaimantInfoBySeria: function(data) {
            return $http({
                method: 'post',
                url: AdjustConfig.pictureConstant.listJyAlgorithmClaimantInfoBySeriaUrl,
                data:data.serialNo
            })
        },
        removApplyerInfo: function(data) {
            return $http({
                method: 'post',
                url: AdjustConfig.pictureConstant.removapplyerUrl,
                data:data.id
            })
        },
       calculatorClaim: function(data) {
            return $http({
                method: 'post',
                url: AdjustConfig.pictureConstant.calculatorClaimUrl,
                data:angular.toJson(data.claminfos)
            })
        },
       
        
    };
});


