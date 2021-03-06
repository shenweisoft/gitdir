'use strict';

angular.module('sbAdminApp').factory('PrejudgeService', function($http, PrejudgeConfig) {
  return {
    getPrejudgeCase: function(data) {//查询案件预判历史
      return $http({
        method: 'post',
        url: PrejudgeConfig.lawConstant.getPrejudgeCaseUrl,
        data: data
      })
    },
    savePrejudgeCase: function(data) {//保存案件预判历史
      return $http({
        method: 'post',
        url: PrejudgeConfig.lawConstant.savePrejudgeCaseUrl,
        data: data
      })
    },
    removeApplicant: function(data){
      return $http({
        method: 'post',
        url: PrejudgeConfig.lawConstant.removeApplicantUrl,
        data: data
      })
    },
    queryNoticeList: function(data){
    return $http({
      method: 'post',
      url: PrejudgeConfig.homeConstant.queryNoticeListUrl,
      data: data
    })
   },
    queryCountNotice: function(data){
      return $http({
        method: 'post',
        url: PrejudgeConfig.homeConstant.queryCountNoticeUrl,
        data: data
      })
    },
    saveNotice: function(data){
      return $http({
        method: 'post',
        url: PrejudgeConfig.homeConstant.saveNoticeUrl,
        data: data
      })
    },
    deleteNotice: function(data){
      return $http({
        method: 'post',
        url: PrejudgeConfig.homeConstant.deleteNoticeUrl,
        data: data
      })
    },
    queryCalculateStandard: function(data){
      return $http({
        method: 'post',
        url: PrejudgeConfig.oneMachine.CalculateStandardUrl,
        data: data
      })
    },
    queryIndustryType: function(data){
      return $http({
        method: 'post',
        url: PrejudgeConfig.oneMachine.queryIndustryTypeUrl,
        data: data
      })
    },
    queryIndustryIncomeNormByNameAndDateAndTypeCode: function(data){
      return $http({
        method: 'post',
        url: PrejudgeConfig.oneMachine.queryIndustryIncomeNormByNameAndDateAndTypeCodeUrl,
        data: data
      })
    },
    saveJyPrejudgeInfo: function(data){
      return $http({
        method: 'post',
        url: PrejudgeConfig.oneMachine.saveJyPrejudgeInfoUrl,
        data: data
      })
    },
      assayLogin: function (data) {
          return $http({
              method: 'post',
              url: PrejudgeConfig.oneMachine.assayLoginUrl,
              data: data
          })
      },
      //发起鉴定
    identification: function(data){
      return $http({
        method: 'post',
        url: PrejudgeConfig.oneMachine.identificationUrl,
        data: data
      })
    }
  }
})