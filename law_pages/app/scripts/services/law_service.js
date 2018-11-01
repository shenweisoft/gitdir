'use strict';

angular.module('sbAdminApp').factory('LawService', function($http, LawConfig) {
  return {
    law: {},
    setLaw: function(law) {//案件
      this.law = law;
    },
    queryFilingList: function(data) {//查询案件集合
      return $http({
        method: 'post',
        url: LawConfig.lawConstant.queryFilingListUrl,
        data: data
      })
    },
    queryFilingCount:function(data) {//查询案件集合
      return $http({
        method: 'post',
        url: LawConfig.lawConstant.queryFilingCountUrl,
        data: data
      })
    },
    queryLawDetail: function(data) {//查询案件详情
      return $http({
        method: 'post',
        url: LawConfig.lawConstant.queryLawDetailUrl,
        data: data
      })
    },
    queryJyWorkFlow: function(data) {//查询案件详情
      return $http({
        method: 'post',
        url: LawConfig.lawConstant.queryJyWorkFlowUrl,
        data: data
      })
    },
    updateFilingInfo: function (data) {//案件更新
      return $http({
        method: 'post',
        url: LawConfig.lawConstant.updateFilingInfoUrl,
        data: data
      })
    },
    queryHandleLawList: function(data) {//当事人查询诉讼案件列表
      return $http({
        method: 'post',
        url: LawConfig.lawConstant.queryHandleLawListUrl,
        data: data
      })
    },
    queryHandleLawCount: function(data) {//当事人查询诉讼案件列表条数
      return $http({
        method: 'post',
        url: LawConfig.lawConstant.queryHandleLawCountUrl,
        data: data
      })
    },
    getUserList : function(data) {//当事人查询组织人员列表
      return $http({
        method: 'post',
        url: LawConfig.lawConstant.getUserListUrl,
        data: data
      })
    },
    queryLawInfo : function(data){
      return $http({
        method: 'post',
        url: LawConfig.lawConstant.queryLawInfoUrl,
        data: data
      })
    },
    saveLawCase: function(data) {//保存案件信息
      return $http({
        method: 'post',
        url: LawConfig.lawConstant.saveLawCaseUrl,
        data: data
      })
    },
    buildWord: function(data) {
      return $http({
        method: 'post',
        url: LawConfig.lawConstant.buildWordUrl,
        data: data
      })
    },
    removeApplicant: function(data){
      return $http({
        method: 'post',
        url: LawConfig.lawConstant.removeApplicantUrl,
        data: data
      })
    },
    removeAgent: function(data){
      return $http({
        method: 'post',
        url: LawConfig.lawConstant.removeAgentUrl,
        data: data
      })
    },
    insertJyWorkFlow: function(data){
      return $http({
        method: 'post',
        url: LawConfig.lawConstant.insertJyWorkFlowUrl,
        data: data
      })
    },getCommonInsurance: function(data) { //查询证据
      return $http({
        method: 'post',
        url: LawConfig.lawConstant.getCommonInsuranceUrl,
        data: data
      })
    },
    saveCommonInsurance: function(data) { //保存证据
      return $http({
        method: 'post',
        url: LawConfig.lawConstant.saveCommonInsuranceUrl,
        data: data
      })
    },
    querySysUserByOrgId: function(data) { //部门下面的人员
      return $http({
        method: 'post',
        url: LawConfig.lawConstant.querySysUserByOrgIdUrl,
        data: data
      })
    },
    queryOrgCourtByOrgId: function(data) { //法庭名称
      return $http({
        method: 'post',
        url: LawConfig.lawConstant.queryOrgCourtByOrgIdUrl,
        data: data
      })
    },
    getCourtMediationMessage:function(data){//获取庭前调解信息[分段]
      return $http({
        method: 'post',
        url: LawConfig.lawConstant.getCourtMediationMessageUrl,
        data: data
      })
    },
    insertCourtMediationMessage:function(data){//发送庭前调解信息
      return $http({
        method: 'post',
        url: LawConfig.lawConstant.insertCourtMediationMessageUrl,
        data: data
      })
    },
    queryLawBindInfo:function(data){//获取人员类型，属于法官还是当事人
      return $http({
        method: 'post',
        url: LawConfig.lawConstant.queryLawBindInfoUrl,
        data: data
      })
    },
    queryAllLawAdjustInfo:function(data){//案件查询，详细查询
      return $http({
        method: 'post',
        url: LawConfig.lawConstant.queryAllLawAdjustInfoUrl,
        data: data
      })
    },
    queryAllLawAdjustInfoCount:function(data){
      return $http({
        method: 'post',
        url: LawConfig.lawConstant.queryAllLawAdjustInfoCountUrl,
        data: data
      })
    },
    viewInstrument:function(data){
      return $http({
        method: 'post',
        url: LawConfig.lawConstant.viewInstrumentUrl,
        data: data
      })
    },
    viewEmailSender:function(data){
      return $http({
        method: 'post',
        url: LawConfig.lawConstant.viewEmailSenderUrl,
        data: data
      })
    },
    getEmailUrl:function(data){
      return $http({
        method: 'post',
        url: LawConfig.lawConstant.getEmailUrl,
        data: data
      })
    },
    isAgreeMediation:function(data){//是否同意调解
      return $http({
        method: 'post',
        url: LawConfig.lawConstant.isAgreeMediationUrl,
        data: data
      })
    },
    endPretrialMediation:function(data){//结束调解
      return $http({
        method: 'post',
        url: LawConfig.lawConstant.endPretrialMediationUrl,
        data: data
      })
    },
    restartMediation:function(data){//重启调解
      return $http({
        method: 'post',
        url: LawConfig.lawConstant.restartMediationUrl,
        data: data
      })
    },
    applyForJudge:function(data){//申请司法介入
      return $http({
        method: 'post',
        url: LawConfig.lawConstant.applyForJudgeUrl,
        data: data
      })
    },
    onlineCourt:function(data){
      return $http({
        method: 'post',
        url: LawConfig.videoConstant.joinRoomUrl,
        data: data
      })
    },
    viewCourtVideo:function(data){
      return $http({
        method: 'post',
        url: LawConfig.videoConstant.viewCourtVideoUrl,
        data: data
      })
    },
    sendMessage:function(data){//发送短信
      return $http({
        method: 'post',
        url: LawConfig.massageConstant.sendMessageUrl,
        data: data
      })
    },
    closedAdjustInfo:function(data){//司法确认结案
      return $http({
        method: 'post',
        url: LawConfig.massageConstant.closedAdjustInfoUrl,
        data: data
      })
    },
    closedLawInfo:function(data){//诉讼结案
      return $http({
        method: 'post',
        url: LawConfig.massageConstant.closedLawInfoUrl,
        data: data
      })
    },
    sendEmail:function(data){//发送邮件
      return $http({
        method: 'post',
        url: LawConfig.massageConstant.sendEmailUrl,
        data: data
      })
    },
    queryLawPayList:function(data){
      return $http({
        method: 'post',
        url: LawConfig.lawConstant.queryLawPayListUrl,
        data: data
      })
    },
    queryLawPayCount:function(data){
      return $http({
        method: 'post',
        url: LawConfig.lawConstant.queryLawPayListCountUrl,
        data: data
      })
    },
    queryLawPayInfo:function(data){
      return $http({
        method: 'post',
        url: LawConfig.lawConstant.queryLawPayInfoUrl,
        data: data
      })
    },
    saveLawPayInfo:function(data){
      return $http({
        method: 'post',
        url: LawConfig.lawConstant.saveLawPayInfoUrl,
        data: data
      })
    },
    isFileExist:function(data){
      return $http({
        method: 'post',
        url: LawConfig.fileConstant.isFileExistUrl,
        data: data
      })
    },
    isFilePageExist:function(data){
      return $http({
        method: 'post',
        url: LawConfig.fileConstant.isFilePageExistUrl,
        data: data
      })
    },
    sendEvidenceToVideo:function(data){
      return $http({
        method: 'post',
        url: LawConfig.videoConstant.sendEvidenceToVideoUrl,
        data: data
      })
    },
    autoGenerateDoc:function(data){
      return $http({
        method: 'post',
        url: LawConfig.fileConstant.autoGenerateDocUrl,
        data: data
      })
    },
    getSingleLoginOnMail:function(data){
      return $http({
        method: 'post',
        url: LawConfig.massageConstant.getSingleLoginOnMailUrl,
        data: data
      })
    },
    checkLawNo:function(data){
      return $http({
        method: 'post',
        url: LawConfig.lawConstant.checkLawNoUrl,
        data: data
      })
    },
      checkJudgeUser:function(data){
      return $http({
        method: 'post',
        url: LawConfig.lawConstant.checkJudgeUserUrl,
        data: data
      })
    },
      revokeCase:function(data){
      return $http({
        method: 'post',
        url: LawConfig.lawConstant.revokeCaseUrl,
        data: data
      })
    },
    createLawInfoCode : function(data){
      return $http({
          method: 'post',
          url: LawConfig.lawConstant.createLawInfoCode,
          data: data
      })
    },
    buildCivilMediationDoc:function(data){
      return $http({
        method: 'post',
        url: LawConfig.fileConstant.buildCivilMediationDocUrl,
        data: data
      })
    },queryIsApprovalCase: function(data){
      return $http({
        method: 'post',
        url: LawConfig.lawConstant.queryIsApprovalCaseUrl,
        data: data
      })
    },printData: function(data){
      return $http({
          method: 'post',
          url: LawConfig.lawConstant.printDataUrl,
          data: data
      })
    }
  }
})