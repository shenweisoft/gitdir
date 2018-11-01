'use strict';

angular.module('sbAdminApp').factory('SecondLitigantionService', function ($http, SecondLitigantionConfig) {
  return{
    saveSecondIntanceInfo: function(data) { //保存数据
      return $http({
        method: 'post',
        url: SecondLitigantionConfig.lawCaseConStant.saveSecondIntanceInfoUrl,
        data: data
      })
    },
    querySecondIntanceInfo: function(data) { //查询数据
      return $http({
        method: 'post',
        url: SecondLitigantionConfig.lawCaseConStant.querySecondIntanceInfoUrl,
        data: data
      })
    },
    queryGeneralInsuranceInfo: function (data) { //查询常用保险公司
      return $http({
        method: 'post',
        url: SecondLitigantionConfig.lawCaseConStant.queryGeneralInsuranceUrl,
        data: data
      })
    },
    updateGeneralInsuranceInfo: function(data) { //保存到常用保险公司
      return $http({
        method: 'post',
        url: SecondLitigantionConfig.lawCaseConStant.updateGeneralInsuranceUrl,
        data: data
      })
    },
    deleteSecondInstanceAgentInfo: function (data) { //删除代理人
      return $http({
        method: 'post',
        url: SecondLitigantionConfig.lawCaseConStant.deleteSecondInstanceAgentInfoUrl,
        data: data
      })
    },
    deleteSecondInstanceApplyerInfo: function (data) { //删除上诉人、被上诉人、原审当事人
      return $http({
        method: 'post',
        url: SecondLitigantionConfig.lawCaseConStant.deleteSecondInstanceApplyerInfoUrl,
        data: data
      })
    },
    queryEvidenceFileListInfo: function (data) { //查询证据
      return $http({
        method: 'post',
        url: SecondLitigantionConfig.lawCaseConStant.queryEvidenceFileListUrl,
        data: data
      })
    },
    deleteEvidenceInfo: function (data) { //删除证据
      return $http({
        method: 'post',
        url: SecondLitigantionConfig.lawCaseConStant.deleteEvidenceUrl,
        data: data
      })
    },
    downLoadEvidenceInfo: function (data) { //下载证据
      return $http({
        method: 'post',
        url: SecondLitigantionConfig.lawCaseConStant.downLoadEvidenceUrl,
        data: data
      })
    },
    querySysOrgInfo: function (data) { //查询原审法院
      return $http({
        method: 'post',
        url: SecondLitigantionConfig.lawCaseConStant.querySysOrgInfoUrl,
        data: data
      })
    },
    querySecondIntanceInfoList: function (data) { //查询列表
      return $http({
        method: 'post',
        url: SecondLitigantionConfig.lawCaseConStant.querySecondIntanceInfoListUrl,
        data: data
      })
    },
    querySecondIntanceInfoSum: function (data) { //查询列表
      return $http({
        method: 'post',
        url: SecondLitigantionConfig.lawCaseConStant.querySecondIntanceInfoSumUrl,
        data: data
      })
    },
    selectSecondIntanceInfo: function (data) { //根据ID查询详细
      return $http({
        method: 'post',
        url: SecondLitigantionConfig.lawCaseConStant.selectSecondIntanceInfoUrl,
        data: data
      })
    },
    queryDepartByUserAndOrgInfo: function (data) { //查询承办部门
      return $http({
        method: 'post',
        url: SecondLitigantionConfig.lawCaseConStant.queryDepartByUserAndOrgUrl,
        data: data
      })
    },
    saveSecondInstanceWorkFlowInfo: function (data) { //查询承办部门
      return $http({
        method: 'post',
        url: SecondLitigantionConfig.lawCaseConStant.saveSecondInstanceWorkFlowUrl,
        data: data
      })
    },
    querySecondInstanceWorkFlow: function (data) { //查询历史信息
      return $http({
        method: 'post',
        url: SecondLitigantionConfig.lawCaseConStant.querySecondInstanceWorkFlowUrl,
        data: data
      })
    },
    secondInstanceSysUserByOrgIdInfo: function (data) { //查询历史信息
      return $http({
        method: 'post',
        url: SecondLitigantionConfig.lawCaseConStant.secondInstanceSysUserByOrgIdUrl,
        data: data
      })
    },
    selectSecondInstanceUserInfo: function (data) { //查询历史信息
      return $http({
        method: 'post',
        url: SecondLitigantionConfig.lawCaseConStant.selectSecondInstanceUserUrl,
        data: data
      })
    },
    queryOrgByUserIdInfo: function (data) { //查询历史信息
      return $http({
        method: 'post',
        url: SecondLitigantionConfig.lawCaseConStant.queryOrgByUserIdUrl,
        data: data
      })
    },
    checkSecondInstanceLawNoInfo: function (data) { //查询历史信息
      return $http({
        method: 'post',
        url: SecondLitigantionConfig.lawCaseConStant.checkSecondInstanceLawNoUrl,
        data: data
      })
    }
  }
});