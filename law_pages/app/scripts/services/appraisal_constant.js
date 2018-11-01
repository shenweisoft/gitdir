/**
 * Created by shenwei on 2017/5/6.
 */
'use strict';
angular.module('sbAdminApp').constant('AppraisalConfig', {
    //公用常量
    commonConstant: {
        SUCCESS: 0,
        FAILURE: -1
    },
    appraisalConstant: {
        initiateAppraisalUrl: '/lawProject/appraisal/initiateAppraisal',
        oldBusinessAppraisalSubmitDataUrl: '/lawProject/adjust/oldBusinessAppraisalSubmitData',//老道交鉴定完成接口
        oldBusinessAppraisalUrl:'/lawProject/adjust/oldBusinessAppraisal',//老道交强制取消鉴定完成调解
        queryAppraisalApplyerListUrl:'/lawProject/appraisal/queryAppraisalApplyerList',
        queryAppraisalInfoUrl:'/lawProject/appraisal/queryAppraisalInfo',
        saveAppraisalInfoUrl:'/lawProject/appraisal/saveAppraisalInfo',
        saveAppraisalEvidenceUrl:'/lawProject/appraisal/saveAppraisalEvidence',
        deleteAppraisalDetailUrl:'/lawProject/appraisal/deleteAppraisalDetail',
        queryAppraisalListUrl:'/lawProject/appraisal/queryAppraisalList',
        queryAppraisalCountUrl:'/lawProject/appraisal/queryAppraisalCount',
        updateAppraisalDetailInfoUrl:'/lawProject/appraisal/updateAppraisalDetailInfo',
        queryAppraisalDetailListUrl:'/lawProject/appraisal/queryAppraisalDetailList',
        queryAppraisalDetailCountUrl:'/lawProject/appraisal/queryAppraisalDetailCount',
        queryAppraisalDetailInfoUrl:'/lawProject/appraisal/queryAppraisalDetailInfo',
        insertAppraisalWorkFlowUrl:"/lawProject/appraisal/insertAppraisalWorkFlow",
        queryAppraisalWorkFlowUrl: "/lawProject/appraisal/queryAppraisalWorkFlow",
        queryInHandAppraisalInfoUrl:"/lawProject/appraisal/queryInHandAppraisalInfo",
        updateAppraisalInfoUrl:"/lawProject/appraisal/updateAppraisalInfo",
        uploadAppraisalImageFileUrl:"/lawProject/appraisal/uploadAppraisalImageFile",
        coverAppraisalFileByWordTypeUrl:"/lawProject/appraisal/coverAppraisalFileByWordType",
        dowAppraisalDocByNoWordTypeUrl:"/lawProject/appraisal/dowAppraisalDocByNoWordType",
        getAppraisalImageFileUrl:"/lawProject/appraisal/getAppraisalImageFile",
        isExistByAppraisalNoWordTypeUrl:"/lawProject/appraisal/isExistByAppraisalNoWordType",
        insertAppraisalEvaluateUrl:"/lawProject/appraisal/insertAppraisalEvaluate",
        queryAppraisalEvaluateListUrl:"/lawProject/appraisal/queryAppraisalEvaluateList",
        queryAppraisalStatisticsInfoUrl:"/lawProject/appraisal/queryAppraisalStatisticsInfo",
        checkAppraisalDetailLawNoUrl:"/lawProject/appraisal/checkAppraisalDetailLawNo",
        queryAppraisalInHandingListUrl:"/lawProject/appraisal/queryAppraisalInHandingList",
        queryCountAppraisalInHandingUrl:"/lawProject/appraisal/queryCountAppraisalInHanding",
        queryUnEvaluateAppraisalListUrl:"/lawProject/appraisal/queryUnEvaluateAppraisalList",
        queryCountUnEvaluateAppraisalListUrl:"/lawProject/appraisal/queryCountUnEvaluateAppraisalList",
        queryAppraisalReceiveListUrl:"/lawProject/appraisal/queryAppraisalReceiveList",
        queryCountAppraisalReceiveUrl:"/lawProject/appraisal/queryCountAppraisalReceive",
        appraisalLaunchListUrl:"/lawProject/adjust/appraisalLaunchList",
        appraisalLaunchCountUrl:"/lawProject/adjust/appraisalLaunchCount"
    },
    pictureConstant:{
        bigPictureUrl:"/lawProject/common/image/get/",
        smallPictureUrl:"/lawProject/common/image/getThumbnail/",
        uploadImageUrl:"/lawProject/common/uploadImage",
        cropImageUrl:"/lawProject/common/cropImage",
        uploadImageFileUrl:"/lawProject/common/uploadImageFile",
        getImageFileUrl:"/lawProject/common/getImageFile"
    }
});