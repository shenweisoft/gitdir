/**
 * Created by shenwei on 2017/5/6.
 */
'use strict';

angular.module('sbAdminApp').factory('AppraisalService', function($http, AppraisalConfig) {
    return {
        initiateAppraisal: function(data) {
            return $http({
                method: 'post',
                url: AppraisalConfig.appraisalConstant.initiateAppraisalUrl,
                data: data
            })
        },
        oldBusinessAppraisalSubmitData: function(data) {
            return $http({
                method: 'post',
                url: AppraisalConfig.appraisalConstant.oldBusinessAppraisalSubmitDataUrl,
                data: data
            })
        },
        oldBusinessAppraisal: function(data) {
            return $http({
                method: 'post',
                url: AppraisalConfig.appraisalConstant.oldBusinessAppraisalUrl,
                data: data
            })
        },
        queryAppraisalApplyerList: function(data) {
            return $http({
                method: 'post',
                url: AppraisalConfig.appraisalConstant.queryAppraisalApplyerListUrl,
                data: data
            })
        },
        queryAppraisalInfo: function(data) {
            return $http({
                method: 'post',
                url: AppraisalConfig.appraisalConstant.queryAppraisalInfoUrl,
                data: data
            })
        },
        saveAppraisalInfo: function(data) {
            return $http({
                method: 'post',
                url: AppraisalConfig.appraisalConstant.saveAppraisalInfoUrl,
                data: data
            })
        },
        saveAppraisalEvidence: function(data) {
            return $http({
                method: 'post',
                url: AppraisalConfig.appraisalConstant.saveAppraisalEvidenceUrl,
                data: data
            })
        },

        deleteAppraisalDetail : function(data) {
            return $http({
                method: 'post',
                url: AppraisalConfig.appraisalConstant.deleteAppraisalDetailUrl,
                data: data
            })
        },
        queryAppraisalList : function(data) {
            return $http({
                method: 'post',
                url: AppraisalConfig.appraisalConstant.queryAppraisalListUrl,
                data: data
            })
        },
        queryAppraisalCount : function(data) {
            return $http({
                method: 'post',
                url: AppraisalConfig.appraisalConstant.queryAppraisalCountUrl,
                data: data
            })
        },
        updateAppraisalDetailInfo : function(data) {
            return $http({
                method: 'post',
                url: AppraisalConfig.appraisalConstant.updateAppraisalDetailInfoUrl,
                data: data
            })
        },
        queryAppraisalDetailList: function(data) {
            return $http({
                method: 'post',
                url: AppraisalConfig.appraisalConstant.queryAppraisalDetailListUrl,
                data: data
            })
        },
        queryAppraisalDetailCount : function(data) {
            return $http({
                method: 'post',
                url: AppraisalConfig.appraisalConstant.queryAppraisalDetailCountUrl,
                data: data
            })
        },
        saveAppraisalDetailInfo: function(data) {
            return $http({
                method: 'post',
                url: AppraisalConfig.appraisalConstant.queryAppraisalDetailInfoUrl,
                data: data
            })
        },
        insertAppraisalWorkFlow: function(data) {
            return $http({
                method: 'post',
                url: AppraisalConfig.appraisalConstant.insertAppraisalWorkFlowUrl,
                data: data
            })
        },
        queryAppraisalWorkFlow: function(data) {
            return $http({
                method: 'post',
                url: AppraisalConfig.appraisalConstant.queryAppraisalWorkFlowUrl,
                data: data
            })
        },
        updateAppraisalInfo: function(data) {
            return $http({
                method: 'post',
                url: AppraisalConfig.appraisalConstant.updateAppraisalInfoUrl,
                data: data
            })
        },
        queryInHandAppraisalInfo: function(data) {
            return $http({
                method: 'post',
                url: AppraisalConfig.appraisalConstant.queryInHandAppraisalInfoUrl,
                data: data
            })
        },
        isExistByAppraisalNoWordType: function(data) { //是否存在签字页和鉴定报告
            return $http({
                method: 'post',
                url: AppraisalConfig.appraisalConstant.isExistByAppraisalNoWordTypeUrl,
                data: data
            })
        },
        getAppraisalImageFile: function(data) { //查看签字页
            return $http({
                method: 'post',
                url: AppraisalConfig.appraisalConstant.getAppraisalImageFileUrl,
                data: data
            })
        },
        insertAppraisalEvaluate: function(data) { //插入评价
            return $http({
                method: 'post',
                url: AppraisalConfig.appraisalConstant.insertAppraisalEvaluateUrl,
                data: data
            })
        },
        queryAppraisalEvaluateList: function(data) { //查询评价信息
            return $http({
                method: 'post',
                url: AppraisalConfig.appraisalConstant.queryAppraisalEvaluateListUrl,
                data: data
            })
        },
        queryAppraisalStatisticsInfo: function(data) { //查询评价信息
            return $http({
                method: 'post',
                url: AppraisalConfig.appraisalConstant.queryAppraisalStatisticsInfoUrl,
                data: data
            })
        },
        checkAppraisalDetailLawNo: function(data) { //查询案号
        return $http({
            method: 'post',
            url: AppraisalConfig.appraisalConstant.checkAppraisalDetailLawNoUrl,
            data: data
          })
        },queryAppraisalInHandingList: function(data) { //进行中查询列表
            return $http({
                method: 'post',
                url: AppraisalConfig.appraisalConstant.queryAppraisalInHandingListUrl,
                data: data
            })
        },queryCountAppraisalInHanding: function(data) { //进行中查询条数
        return $http({
            method: 'post',
            url: AppraisalConfig.appraisalConstant.queryCountAppraisalInHandingUrl,
            data: data
            })
        },queryUnEvaluateAppraisalList: function(data) { //评价查询列表
            return $http({
                method: 'post',
                url: AppraisalConfig.appraisalConstant.queryUnEvaluateAppraisalListUrl,
                data: data
            })
        },queryCountUnEvaluateAppraisalList: function(data) { //评价查询条数
            return $http({
                method: 'post',
                url: AppraisalConfig.appraisalConstant.queryCountUnEvaluateAppraisalListUrl,
                data: data
            })
        },queryAppraisalReceiveList: function(data) { //接收查询条数
            return $http({
                method: 'post',
                url: AppraisalConfig.appraisalConstant.queryAppraisalReceiveListUrl,
                data: data
            })
        },
        queryCountAppraisalReceive: function(data) { //接收查询条数
            return $http({
                method: 'post',
                url: AppraisalConfig.appraisalConstant.queryCountAppraisalReceiveUrl,
                data: data
            })
        },appraisalLaunchList: function(data) { //法官发起鉴定查询列表
            return $http({
                method: 'post',
                url: AppraisalConfig.appraisalConstant.appraisalLaunchListUrl,
                data: data
            })
        },appraisalLaunchCount: function(data) { //接收查询条数
            return $http({
                method: 'post',
                url: AppraisalConfig.appraisalConstant.appraisalLaunchCountUrl,
                data: data
            })
        }
    };
});
