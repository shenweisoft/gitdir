'use strict';
angular.module('sbAdminApp').constant('CompensateConfig', {
    compensate: {
        queryCompensateInfoUrl:'/lawProject/adjust/queryCompensateInfo',
        saveCompensateInfoUrl:'/lawProject/adjust/saveCompensateInfo',
        deleteCompensationApplyerInfoUrl:'/lawProject/adjust/deleteCompensationApplyerInfo',
        queryCompensateInfoListInfo:'/lawProject/adjust/queryCompensateInfoList',
        queryCompensateInfoSumInfo:'/lawProject/adjust/queryCompensateInfoSum'
    }
});