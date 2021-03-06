'use strict';
angular.module('sbAdminApp').constant('PrejudgeConfig', {
  httpCode: {//http请求常量
    SUCCESS: 200, //成功
    ERROR_REQUEST: 400, //错误请求。
    UNAUTHORIZED: 401, //未授权。
    PROHIBIT: 403, //禁止
    NOT_FOUND: 404, //未找到
    INTERNAL_ERROR: 500 //方法禁用
  },
  commonConstant: { //公用常量
    SUCCESS: 0,
    FAILURE: -1
  },
  serviceConstant:{//业务常量
    NET_ERROR:500,
    PHONE_CODE_ERROR:2007,
    PHONE_NOT_EXIST:3002,
    BIND_ERROR:3003,
    SUC_JIANDING: '000'
  },
  lawConstant: {//立案部分常量
    savePrejudgeCaseUrl:"/lawProject/homePage/saveJyPrejudgeInfo",
    getPrejudgeCaseUrl: "/lawProject/homePage/queryHistoryInfo",
    removeApplicantUrl: "/lawProject/homePage/deleteJyPrejudgeApplicant"
  },
  homeConstant:{
    queryNoticeListUrl:"/lawProject/homePage/queryNoticeList",
    queryCountNoticeUrl:"/lawProject/homePage/queryCountNotice",
    saveNoticeUrl:"/lawProject/homePage/saveNotice",
    deleteNoticeUrl:"/lawProject/homePage/deleteNotice"
  },
  oneMachine:{
    CalculateStandardUrl:"/lawProject/adjust/queryCalculateStandard",
    queryIndustryTypeUrl:"/lawProject/system/queryMtDictElement",
    queryIndustryIncomeNormByNameAndDateAndTypeCodeUrl: "/lawProject/system/queryIndustryIncomeNormByNameAndDateAndTypeCode",
    saveJyPrejudgeInfoUrl:"/lawProject/homePage/saveJyPrejudgeInfo",
    identificationUrl:"/lawProject/adjust/identification",
    assayLoginUrl: "/lawProject/adjust/assayLogin"
  }
});