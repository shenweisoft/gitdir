'use strict';

angular.module('sbAdminApp').factory('CompensateService', function($http, CompensateConfig) {
    return {
        queryCompensateInfo:function(data){  //查询
            return $http({
                method: 'post',
                url: CompensateConfig.compensate.queryCompensateInfoUrl,
                data: data
            })
        },
        saveCompensateInfo:function(data){  //保存
            return $http({
                method: 'post',
                url: CompensateConfig.compensate.saveCompensateInfoUrl,
                data: data
            })
        },
        deleteCompensationApplyerInfo:function(data){  //删除
            return $http({
                method: 'post',
                url: CompensateConfig.compensate.deleteCompensationApplyerInfoUrl,
                data: data
            })
        },
        queryCompensateInfoListInfo:function(data){  //查询列表
            return $http({
                method: 'post',
                url: CompensateConfig.compensate.queryCompensateInfoListInfo,
                data: data
            })
        },
        queryCompensateInfoSumInfo:function(data){  //查询列表
            return $http({
                method: 'post',
                url: CompensateConfig.compensate.queryCompensateInfoSumInfo,
                data: data
            })
        }
    }
});