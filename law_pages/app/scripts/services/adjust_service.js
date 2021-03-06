'use strict';

angular.module('sbAdminApp').factory('AdjustService', function($http, AdjustConfig) {
  return {
    adjust: {},
    setAdjust: function(adjust) { //调解案件
      this.adjust = adjust;
    },
    queryAdjust: function(data) { //查询调解案件
      return $http({
        method: 'post',
        url: AdjustConfig.adjustConStant.queryAdjustUrl,
        data: data
      })
    },
    adjustComplete: function(data) { //审判系统调解完成
      return $http({
        method: 'post',
        url: AdjustConfig.adjustConStant.adjustCompleteUrl,
        data: data
      })
    },
    simulationLogin: function(data) { //审判系统查询
      return $http({
        method: 'post',
        url: AdjustConfig.adjustConStant.simulationLoginUrl,
        data: data
      })
    },
    queryAdjustBySerialNo: function(data) { //查询调解案件
      return $http({
        method: 'post',
        url: AdjustConfig.adjustConStant.queryAdjustBySerialNoUrl,
        data: data
      })
    },
    saveAdjust: function(data) { //保存调解案件
      return $http({
        method: 'post',
        url: AdjustConfig.adjustConStant.saveAdjustUrl,
        data: data
      })
    },
    savePersonAdjust: function(data) { //保存调解案件
        return $http({
            method: 'post',
            url: AdjustConfig.adjustConStant.savePersonAdjustUrl,
            data: data
        })
    },
    removeAdjust: function(data) { //删除调解案件
      return $http({
        method: 'post',
        url: AdjustConfig.adjustConStant.removeAdjustUrl,
        data: data
      })
    },
    removeApplicant: function(data) { //删除案件申请人
      return $http({
        method: 'post',
        url: AdjustConfig.adjustConStant.removeApplicantUrl,
        data: data
      })
    },
    removeAgent: function(data) { //删除代理人
      return $http({
        method: 'post',
        url: AdjustConfig.adjustConStant.removeAgentUrl,
        data: data
      })
    },
    removeEvidence: function(data) { //删除证据
      return $http({
        method: 'post',
        url: AdjustConfig.adjustConStant.removeEvidenceUrl,
        data: data
      })
    },
    removeAppraisalEvidence: function(data) { //删除鉴定的证据
      return $http({
        method: 'post',
        url: AdjustConfig.adjustConStant.removeAppraisalEvidenceUrl,
        data: data
      })
    },
    queryAdjustEvidence: function(data) { //查询已有证据
      return $http({
        method: 'post',
        url: AdjustConfig.adjustConStant.queryAdjustEvidenceUrl,
        data: data
      })
    },
    getCommonInsurance: function(data) { //查询证据
      return $http({
        method: 'post',
        url: AdjustConfig.adjustConStant.getCommonInsuranceUrl,
        data: data
      })
    },
    saveCommonInsurance: function(data) { //保存证据
      return $http({
        method: 'post',
        url: AdjustConfig.adjustConStant.saveCommonInsuranceUrl,
        data: data
      })
    },
    //  yerr
    getInquireList: function(data) {
      return $http({
        method: 'post',
        url: AdjustConfig.adjustConStant.getInquireListUrl,
        data: data
      })
    },
    queryCountAdjust: function(data) {
      return $http({
        method: 'post',
        url: AdjustConfig.adjustConStant.queryCountAdjustUrl,
        data: data
      })
    },
    queryAdjustMainInfo: function(data) {
      return $http({
        method: 'post',
        url: AdjustConfig.adjustConStant.queryAdjustMainInfoUrl,
        data: data
      })
    },
    saveEvidence: function(data) {
      return $http({
        method: 'post',
        url: AdjustConfig.adjustConStant.saveEvidenceUrl,
        data: data
      })
    },
    queryJyEvidenceBySerialNo: function(data) {
      return $http({
        method: 'post',
        url: AdjustConfig.adjustConStant.queryJyEvidenceBySerialNoUrl,
        data: data
      })
    },
    updateJyAdjustEvidenceInfo: function(data) { //更新证据
      return $http({
        method: 'post',
        url: AdjustConfig.adjustConStant.updateJyAdjustEvidenceInfoUrl,
        data: data
      })
    },
    insertJyAdjustEvidenceInfo: function(data) { //插入证据
      return $http({
        method: 'post',
        url: AdjustConfig.adjustConStant.insertJyAdjustEvidenceInfoUrl,
        data: data
      })
    },
    getAdjustForSue: function(data) { //获取调解案件
      return $http({
        method: 'post',
        url: AdjustConfig.adjustConStant.getAdjustForSueUrl,
        data: data
      })
    },
    bindCaseForUser: function(data) { //绑定提取的案件
      return $http({
        method: 'post',
        url: AdjustConfig.adjustConStant.bindCaseForUserUrl,
        data: data
      })
    },
    insertAdjustJudgeInfo: function(data) {
      return $http({
        method: 'post',
        url: AdjustConfig.adjustConStant.insertAdjustJudgeInfoUrl,
        data: data
      })
    },
    sendMessage: function(data) {
      return $http({
        method: 'post',
        url: AdjustConfig.adjustConStant.sendMessageUrl,
        data: data
      })
    },
    queryWorkFlowDetailInfo: function(data) {
      return $http({
        method: 'post',
        url: AdjustConfig.adjustConStant.queryWorkFlowDetailInfoUrl,
        data: data
      })
    },
    buildWord:function(data){
      return $http({
        method: 'post',
        url: AdjustConfig.adjustConStant.buildWordUrl,
        data: data
      })
    },
    insertJyWorkFlow: function(data){
      return $http({
        method: 'post',
        url: AdjustConfig.adjustConStant.insertJyWorkFlowUrl,
        data: data
      })
    },
    saveOrUpdateEvidence:function(data){
      return $http({
        method: 'post',
        url: AdjustConfig.adjustConStant.saveOrUpdateEvidenceUrl,
        data: data
      })
    },
    getImageFile:function(data){
      return $http({
        method: 'post',
        url: AdjustConfig.pictureConstant.getImageFileUrl,
        data: data
      })
    },
    deleteFile:function(data){
      return $http({
        method: 'post',
        url: AdjustConfig.pictureConstant.deleteFileUrl,
        data: data
      })
    },
    querySysOrgAppraisalList:function(data){  //查询鉴定机构
      return $http({
        method: 'post',
        url: AdjustConfig.adjustConStant.querySysOrgAppraisalListUrl,
        data: data
      })
    },
    queryOrgAppraisalBySerialNo:function(data){  //查询鉴定机构
      return $http({
        method: 'post',
        url: AdjustConfig.adjustConStant.queryOrgAppraisalBySerialNoUrl,
        data: data
      })
    },
    getForwardUrl:function (data) {
      return $http({
        method: 'post',
        url: AdjustConfig.adjustConStant.getForwardUrlUrl,
        data: data
      })
    },
    queryHistoryLawNo:function (data) {
      return $http({
        method: 'post',
        url: AdjustConfig.adjustConStant.queryHistoryLawNoUrl,
        data: data
      })
    },
    queryPartyLawList:function (data) {
      return $http({
        method: 'post',
        url: AdjustConfig.adjustConStant.queryPartyLawListUrl,
        data: data
      })
    },
    queryHomeStatisticsInfo:function (data) {
      return $http({
        method: 'post',
        url: AdjustConfig.adjustConStant.queryHomeStatisticsInfoUrl,
        data: data
      })
    },
    queryPeopleInjured: function(data) {
      return $http({
        method: 'post',
        url: AdjustConfig.adjustConStant.queryPeopleInjuredUrl,
        data: data
      })
    },
    saveInjureApplyerInfo: function(data) {
      return $http({
        method: 'post',
        url: AdjustConfig.adjustConStant.saveInjureApplyerInfoUrl,
        data: data
      })
    },
    queryInjureApplyerInfo: function(data) {
      return $http({
        method: 'post',
        url: AdjustConfig.adjustConStant.queryInjureApplyerInfoUrl,
        data: data
      })
    },
    createMediateCode:function (data) {
      return $http({
          method: 'post',
          url: AdjustConfig.adjustConStant.createMediateCode,
          data: data
      })
    },
    queryAdjustByIdNo :function(data){
      return $http({
        method: 'post',
        url: AdjustConfig.adjustConStant.queryAdjustByIdNoUrl,
        data: data
      })
    },
    queryAdjustCountByIdNo :function(data){
      return $http({
        method: 'post',
        url: AdjustConfig.adjustConStant.queryAdjustCountByIdNoUrl,
        data: data
      })
    },
    documentMessageReturn :function(data){ //单证信息回传接口
      return $http({
        method: 'post',
        url: AdjustConfig.adjustConStant.documentMessageReturnUrl,
        data: data
      })
    },
    claimIdentificationReturn :function(data){ //一键理赔
        return $http({
            method: 'post',
            url: AdjustConfig.adjustConStant.claimIdentificationReturnUrl,
            data: data
        })
      },
    reconciliationOfClaimsResults :function(data){ //理赔信息
      return $http({
        method: 'post',
        url: AdjustConfig.adjustConStant.reconciliationOfClaimsResultsUrl,
        data: data
      })
    },
    policeAccidentInfo:function(data){ //公安信息
      return $http({
        method: 'post',
        url: AdjustConfig.adjustConStant.policeAccidentInfoUrl,
        data: data
      })
    },
    policeAcdphotosInfo:function(data){ //公安信息
    return $http({
      method: 'post',
      url: AdjustConfig.adjustConStant.policeAcdphotosInfoUrl,
      data: data
    })
   },
    policeAcr1And3:function(data){ //公安信息
      return $http({
        method: 'post',
        url: AdjustConfig.adjustConStant.policeAcr1And3Url,
        data: data
      })
    },
    queryPoliceBySerialNo:function(data){ //查询认定书编号
      return $http({
        method: 'post',
        url: AdjustConfig.adjustConStant.queryPoliceBySerialNoUrl,
        data: data
      })
    },
    queryCalculateStandard: function(data) {
      return $http({
        method: 'post',
        url: AdjustConfig.adjustConStant.queryCalculateStandardUrl,
        data: data
      })
    },
    savePolice: function(data) {
      return $http({
        method: 'post',
        url: AdjustConfig.adjustConStant.savePoliceUrl,
        data: data
      })
    },
    savePoliceAccidentinfo: function(data) {
      return $http({
        method: 'post',
        url: AdjustConfig.adjustConStant.savePoliceAccidentinfoUrl,
        data: data
      })
    },
    queryStartYear: function(data) {
      return $http({
        method: 'post',
        url: AdjustConfig.adjustConStant.queryStartYearUrl,
        data: data
      })
    },
    queryAdjustByInsurance:function(data){
      return $http({
        method: 'post',
        url: AdjustConfig.adjustConStant.queryAdjustByInsuranceUrl,
        data: data
      })
    },
    queryCountAdjustByInsuranceUser:function(data){
      return $http({
        method: 'post',
        url: AdjustConfig.adjustConStant.queryCountAdjustByInsuranceUserUrl,
        data: data
      })
    },
    queryTransferUser:function(data){
      return $http({
        method: 'post',
        url: AdjustConfig.adjustConStant.queryTransferUserUrl,
        data: data
      })
    },
    getDocumentFile:function(data){
      return $http({
        method: 'post',
        url: AdjustConfig.pictureConstant.getDocumentFileUrl,
        data: data
      })
    },
    transferAdjust:function(data){
      return $http({
        method: 'post',
        url: AdjustConfig.adjustConStant.transferAdjustUrl,
        data: data
      })
    },buildJudicialApply:function(data){
      return $http({
        method: 'post',
        url: AdjustConfig.adjustConStant.buildJudicialApplyUrl,
        data: data
      })
    },buildMediateRecord:function(data){
      return $http({
        method: 'post',
        url: AdjustConfig.adjustConStant.buildMediateRecordUrl,
        data: data
      })
    },buildMediateIndictment:function(data){
      return $http({
        method: 'post',
        url: AdjustConfig.adjustConStant.buildMediateIndictmentUrl,
        data: data
      })
    },serialNoCaseCopy: function(data){
      return $http({
        method: 'post',
        url: AdjustConfig.adjustConStant.serialNoCaseCopy,
        data: data
      })
    },caseDelete: function(data){
      return $http({
        method: 'post',
        url: AdjustConfig.adjustConStant.caseDelete,
        data: data
      })
    },deleteSerialNoJyAppraisalService: function(data){
      return $http({
        method: 'post',
        url: AdjustConfig.adjustConStant.deleteSerialNoJyAppraisalUrl,
        data: data
      })
    },caseModify: function(data){
      return $http({
        method: 'post',
        url: AdjustConfig.adjustConStant.caseModify,
        data: data
      })
    },modificationPassWordService: function(data){
        return $http({
            method: 'post',
            url: AdjustConfig.adjustConStant.modificationPassWordUrl,
            data: data
        })
    },modificationLoginService: function(data){
        return $http({
            method: 'post',
            url: AdjustConfig.adjustConStant.modificationLoginUrl,
            data: data
        })
    },selectPoliceAccidentInfo: function(data){
      return $http({
        method: 'post',
        url: AdjustConfig.adjustConStant.selectPoliceAccidentInfoUrl,
        data: data
      })
    },queryDataStatisticsService: function(data){
      return $http({
        method: 'post',
        url: AdjustConfig.adjustConStant.queryDataStatisticsServiceUrl,
        data: data
      })
    },queryHighDataStatisticsService: function(data){
      return $http({
          method: 'post',
          url: AdjustConfig.adjustConStant.queryHighDataStatisticsServiceUrl,
          data: data
      })
    },queryPersonDataStatisticsService: function(data){
      return $http({
          method: 'post',
          url: AdjustConfig.adjustConStant.queryPersonDataStatisticsServiceUrl,
          data: data
      })
      },queryDataStatisticsCountService: function(data){
      return $http({
        method: 'post',
        url: AdjustConfig.adjustConStant.queryDataStatisticsCountServiceUrl,
        data: data
      })
    },exportExcelService: function(data){
      return $http({
        method: 'post',
        url: AdjustConfig.adjustConStant.exportExcelServiceUrl,
        data: data
      })
    },selectCommonAgentList: function(data) {
      return $http({
        method: 'post',
        url: AdjustConfig.adjustConStant.selectCommonAgentListUrl,
        data: data
      })
    },deleteJyAgentCommonInfoById: function(data) {
      return $http({
        method: 'post',
        url: AdjustConfig.adjustConStant.deleteJyAgentCommonInfoByIdUrl,
        data: data
      })
    },saveJyAgentCommonInfo: function(data) {
      return $http({
        method: 'post',
        url: AdjustConfig.adjustConStant.saveJyAgentCommonInfoUrl,
        data: data
      })
    },queryMediationOrg: function(data) {
        return $http({
            method: 'post',
            url: AdjustConfig.adjustConStant.queryMediationOrgUrl,
            data: data
        })
    },queryMediationReceiveList: function(data) {
        return $http({
            method: 'post',
            url: AdjustConfig.adjustConStant.queryMediationReceiveListUrl,
            data: data
        })
    },queryMediationReceiveCount: function(data) {
        return $http({
            method: 'post',
            url: AdjustConfig.adjustConStant.queryMediationReceiveCountUrl,
            data: data
        })
    },selectSecondInstanceUser: function(data) {
        return $http({
            method: 'post',
            url: AdjustConfig.adjustConStant.selectSecondInstanceUserUrl,
            data: data
        })
    },selectSysUserOrDeptOrOrgByOrgId: function (data) { //查询历史信息
        return $http({
            method: 'post',
            url: AdjustConfig.adjustConStant.selectSysUserOrDeptOrOrgByOrgIdUrl,
            data: data
        })
    },allocationMediationPersonnelService: function(data) {
      return $http({
        method: 'post',
        url: AdjustConfig.adjustConStant.allocationMediationPersonnelUrl,
        data: data
      })
    },queryMediationFailureCaseListService: function(data) {
        return $http({
            method: 'post',
            url: AdjustConfig.adjustConStant.queryMediationFailureCaseListUrl,
            data: data
        })
    },queryMediationFailureCaseCountService: function(data) {
        return $http({
            method: 'post',
            url: AdjustConfig.adjustConStant.queryMediationFailureCaseCountUrl,
            data: data
        })
    },queryTransferCaseService: function(data) {
        return $http({
            method: 'post',
            url: AdjustConfig.adjustConStant.queryTransferCaseUrl,
            data: data
        })
    },queryMediationDataStatisticsService: function(data) {
        return $http({
            method: 'post',
            url: AdjustConfig.adjustConStant.queryMediationDataStatisticsUrl,
            data: data
        })
    },queryMediatorDataStatisticsService: function(data) {
        return $http({
            method: 'post',
            url: AdjustConfig.adjustConStant.queryMediatorDataStatisticsUrl,
            data: data
        })
    },selectAdjustDeptAndUserInfo: function(data) {
        return $http({
            method: 'post',
            url: AdjustConfig.adjustConStant.selectAdjustDeptAndUserInfoUrl,
            data: data
        })
    },turnJudicialService: function(data) {
        return $http({
            method: 'post',
            url: AdjustConfig.adjustConStant.turnJudicialUrl,
            data: data
        })
    },printEvidenceDataService: function(data) {
        return $http({
            method: 'post',
            url: AdjustConfig.adjustConStant.printEvidenceDataUrl,
            data: data
        })
    },getCarloss: function(data) {
        return $http({
          method: 'post',
          url: AdjustConfig.adjustConStant.getCarlossUrl,
          data: data
        })
    },queryInitDataStatisticsService: function(data){
        return $http({
            method: 'post',
            url: AdjustConfig.adjustConStant.queryInitDataStatisticsServiceUrl,
            data: data
        })
    },queryAdjustDataStatisticsService: function(data) {
      return $http({
        method: 'post',
        url: AdjustConfig.adjustConStant.queryAdjustDataStatisticsUrl,
        data: data
      })
    },
    queryAdjustDataStatisticsCountService: function(data) {
        return $http({
            method: 'post',
            url: AdjustConfig.adjustConStant.queryAdjustDataStatisticsCountUrl,
            data: data
        })
    },deleteGeneralInsuranceUrl: function(data) {
      return $http({
        method: 'post',
        url: AdjustConfig.adjustConStant.deleteGeneralInsuranceUrl,
        data: data
      })
    },queryInsuranceCompanyMessageInfoListUrl: function(data) {
      return $http({
        method: 'post',
        url: AdjustConfig.adjustConStant.queryInsuranceCompanyMessageInfoListUrl,
        data: data
      })
    },insertOrUpdateInsuranceCompanyMessageInfoUrl: function(data) {
      return $http({
        method: 'post',
        url: AdjustConfig.adjustConStant.insertOrUpdateInsuranceCompanyMessageInfoUrl,
        data: data
      })
    },queryInsuranceCompanyMessageInfoCountUrl: function(data) {
      return $http({
        method: 'post',
        url: AdjustConfig.adjustConStant.queryInsuranceCompanyMessageInfoCountUrl,
        data: data
      })
    },deleteInsuranceCompanyMessageInfoUrl: function(data) {
      return $http({
        method: 'post',
        url: AdjustConfig.adjustConStant.deleteInsuranceCompanyMessageInfoUrl,
        data: data
      })
    },queryLoginStatisticsListByOrgIdUrl: function(data) {
      return $http({
        method: 'post',
        url: AdjustConfig.adjustConStant.queryLoginStatisticsListByOrgIdUrl,
        data: data
      })
    },queryLoginStatisticsCountByOrgIdUrl: function(data) {
      return $http({
        method: 'post',
        url: AdjustConfig.adjustConStant.queryLoginStatisticsCountByOrgIdUrl,
        data: data
      })
    },selectByUserIdListUrl: function(data) {
      return $http({
        method: 'post',
        url: AdjustConfig.adjustConStant.selectByUserIdListUrl,
        data: data
      })
    },selectByUserIdCountUrl: function(data) {
      return $http({
        method: 'post',
        url: AdjustConfig.adjustConStant.selectByUserIdCountUrl,
        data: data
      })
    },queryCaseDeleteListUrl: function(data) {
      return $http({
        method: 'post',
        url: AdjustConfig.adjustConStant.queryCaseDeleteListUrl,
        data: data
      })
    },queryCaseDeleteCountUrl: function(data) {
      return $http({
        method: 'post',
        url: AdjustConfig.adjustConStant.queryCaseDeleteCountUrl,
        data: data
      })
    },saveCaseDeleteApplyUrl: function(data) {
      return $http({
        method: 'post',
        url: AdjustConfig.adjustConStant.saveCaseDeleteApplyUrl,
        data: data
      })
    },queryCaseIsExistUrl: function(data) {
      return $http({
        method: 'post',
        url: AdjustConfig.adjustConStant.queryCaseIsExistUrl,
        data: data
      })
    },queryCaseDeleteApplyUrl: function(data) {
      return $http({
        method: 'post',
        url: AdjustConfig.adjustConStant.queryCaseDeleteApplyUrl,
        data: data
      })
    },caseDeleteBySerialNoUrl: function(data) {
      return $http({
        method: 'post',
        url: AdjustConfig.adjustConStant.caseDeleteBySerialNoUrl,
        data: data
      })
    },getSessionBySerialNo: function(data) {
      return $http({
        method: 'post',
        url: AdjustConfig.adjustConStant.getSessionBySerialNoUrl,
        data: data
      })
    },loginAccountRelieveIsLockService: function(data) {
      return $http({
        method: 'post',
        url: AdjustConfig.adjustConStant.loginAccountRelieveIsLockUrl,
        data: data
      })
    }
  };
});

angular.module('sbAdminApp').service('AnchorSmoothScroll', function($document, $window) {
  var document = $document[0];
  var window = $window;

  var service = {
    scrollDown: scrollDown,
    scrollUp: scrollUp,
    scrollTo: scrollTo,
    scrollToTop: scrollToTop
  };
  return service;

  function getCurrentPagePosition(currentWindow, doc) {
    // Firefox, Chrome, Opera, Safari
    if (currentWindow.pageYOffset) return currentWindow.pageYOffset;
    // Internet Explorer 6 - standards mode
    if (doc.documentElement && doc.documentElement.scrollTop)
      return doc.documentElement.scrollTop;
    // Internet Explorer 6, 7 and 8
    if (doc.body.scrollTop) return doc.body.scrollTop;
    return 0;
  }

  function getElementY(doc, element) {
    var y = element.offsetTop;
    var node = element;
    while (node.offsetParent && node.offsetParent !== doc.body) {
      node = node.offsetParent;
      y += node.offsetTop;
    }
    return y;
  }

  function scrollDown(startY, stopY, speed, distance) {
    var timer = 0;
    var step = Math.round(distance / 25);
    var leapY = startY + step;
    for (var i = startY; i < stopY; i += step) {
      setTimeout('window.scrollTo(0, ' + leapY + ')', timer * speed);
      leapY += step;
      if (leapY > stopY) leapY = stopY;
      timer++;
    }
  };

  function scrollUp(startY, stopY, speed, distance) {
    var timer = 0;
    var step = Math.round(distance / 25);
    var leapY = startY - step;
    for (var i = startY; i > stopY; i -= step) {
      setTimeout('window.scrollTo(0, ' + leapY + ')', timer * speed);
      leapY -= step;
      if (leapY < stopY) leapY = stopY;
      timer++;
    }
  };

  function scrollToTop(stopY) {
    scrollTo(0, stopY);
  };

  function scrollTo(elementId, speed) {
    var element = document.getElementById(elementId);
    if (element) {
      var startY = getCurrentPagePosition(window, document);
      var stopY = getElementY(document, element);
      var distance = stopY > startY ? stopY - startY : startY - stopY;
      if (distance < 100) {
        this.scrollToTop(stopY);
      } else {
        var defaultSpeed = Math.round(distance / 100);
        speed = speed || (defaultSpeed > 20 ? 20 : defaultSpeed);
        if (stopY > startY) {
          this.scrollDown(startY, stopY, speed, distance);
        } else {
          this.scrollUp(startY, stopY, speed, distance);
        }
      }
    }
  };
})