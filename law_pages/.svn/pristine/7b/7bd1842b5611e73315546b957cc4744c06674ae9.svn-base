/**
 * Created by shenwei on 2017/5/6.
 */
'use strict';

angular.module('sbAdminApp').factory('AlgorithmService', function($http, AlgorithmConfig) {
    return {
        saveJyAlgorithmInfo: function(data) {
            return $http({
                method: 'post',
                url: AlgorithmConfig.algorithmConstant.saveJyAlgorithmInfoUrl,
                data: data
            })
        },
        queryJyAlgorithmInfo: function(data) {
            return $http({
                method: 'post',
                url: AlgorithmConfig.algorithmConstant.queryJyAlgorithmInfoUrl,
                data: data
            })
        },
        deleteJyAlgorithmApplyerInfo: function(data) {
            return $http({
                method: 'post',
                url: AlgorithmConfig.algorithmConstant.deleteJyAlgorithmApplyerInfoUrl,
                data: data
            })
        },
        idCardAnalysis: function(data) {
            return $http({
                method: 'post',
                url: AlgorithmConfig.algorithmConstant.idCardAnalysisUrl,
                data: data
            })
        },
        queryJyAlgorithmInfoList: function(data) {
            return $http({
                method: 'post',
                url: AlgorithmConfig.algorithmConstant.queryJyAlgorithmInfoListUrl,
                data: data
            })
        },
        queryJyAlgorithmInfoSum: function(data) {
            return $http({
                method: 'post',
                url: AlgorithmConfig.algorithmConstant.queryJyAlgorithmInfoSumUrl,
                data: data
            })
        },
        saveJyAlgorithmDutyInfo: function(data) {
            return $http({
                method: 'post',
                url: AlgorithmConfig.algorithmConstant.saveJyAlgorithmDutyInfoUrl,
                data: data
            })
        },
        deleteJyAlgorithmDutyInfo: function(data) {
            return $http({
                method: 'post',
                url: AlgorithmConfig.algorithmConstant.deleteJyAlgorithmDutyInfoUrl,
                data: data
            })
        }
    };
});
