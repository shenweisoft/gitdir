'use strict';

angular.module('sbAdminApp').factory('LoginService', function($http, LoginConfig) {
  return {
    user: {},
    setUser: function(user) {
      this.user = user;
    },
    login: function(data) {
      return $http({
        method: 'post',
        url: LoginConfig.loginConStant.loginUrl,
        data: data
      })
    },
    logout: function(data) {
      return $http({
        method: 'post',
        url: LoginConfig.loginConStant.logoutUrl,
        data: data
      })
    },
    existUser: function(data) {
      return $http({
        method: 'post',
        url: LoginConfig.forgetPasswordConstant.existUserUrl,
        data: data
      })
    },
    getMobileCode: function(data) {
      return $http({
        method: 'post',
        url: LoginConfig.forgetPasswordConstant.sendMobileCodeUrl,
        data: data
      })
    },
    checkPhoneCode: function(data) {
      return $http({
        method: 'post',
        url: LoginConfig.forgetPasswordConstant.checkPhoneCodeUrl,
        data: data
      })
    },
    modifyPassword: function(data) {
      return $http({
        method: 'post',
        url: LoginConfig.forgetPasswordConstant.modifyPassword,
        data: data
      })
    },
    sendLinkMail: function(data) {
      return $http({
        method: 'post',
        url: LoginConfig.forgetPasswordConstant.sendLinkMail,
        data: data
      })
    },
    register: function(data) { //用户注册
      return $http({
        method: 'post',
        url: LoginConfig.registerConStant.registerUrl,
        data: data
      })
    },
    checkLoginAccount: function(data) { //验证登录名是否存在
      return $http({
        method: 'post',
        url: LoginConfig.registerConStant.checkLoginAccountUrl,
        data: data
      })
    },
    querySysUser: function(data) { //获取用户基本信息
      return $http({
        method: 'post',
        url: LoginConfig.sysUserConStant.querySysUserUrl,
        data: data
      })
    },
    getUserInfo: function(data) {
      return $http({
        method: 'post',
        url: LoginConfig.sysUserConStant.getUserInfoUrl,
        data: data
      })
    },
    editSysUser: function(data) {
      return $http({
        method: 'post',
        url: LoginConfig.sysUserConStant.editSysUserUrl,
        data: data
      })
    },
    uploadHeadImage: function(data) {
      return $http({
        method: 'post',
        url: LoginConfig.sysUserConStant.uploadHeadImageUrl,
        data: data
      })
    },
    bindPhone: function(data) {
      return $http({
        method: 'post',
        url: LoginConfig.sysUserConStant.bindPhoneUrl,
        data: data
      })
    },
    mailBinding: function(data) {
      return $http({
        method: 'post',
        url: LoginConfig.sysUserConStant.mailBindingUrl,
        data: data
      })
    },
    editPassword: function(data) {
      return $http({
        method: 'post',
        url: LoginConfig.sysUserConStant.editPasswordUrl,
        data: data
      })
    },
    queryRoleList: function() {
      return $http({
        method: 'post',
        url: LoginConfig.sysUserConStant.queryRoleListUrl,
      })
    },
    createRole: function(data) {
      return $http({
        method: 'post',
        url: LoginConfig.sysUserConStant.createRoleUrl,
        data: data
      })
    },
    editRole: function(data) {
      return $http({
        method: 'post',
        url: LoginConfig.sysUserConStant.editRoleUrl,
        data: data
      })
    },
    removeRoleById: function(data) {
      return $http({
        method: 'post',
        url: LoginConfig.sysUserConStant.removeRoleByIdUrl,
        data: data
      })
    },
    queryRoleById: function(data) {
      return $http({
        method: 'post',
        url: LoginConfig.sysUserConStant.queryRoleByIdUrl,
        data: data
      })
    },
    getOrgList: function(data) {
      return $http({
        method: 'post',
        url: LoginConfig.sysUserConStant.getOrgListUrl,
        data: data
      })
    },
    getDeptList: function(data) {
      return $http({
        method: 'post',
        url: LoginConfig.sysUserConStant.getDeptListUrl,
        data: data
      })
    },
    getUserList: function(data) {
      return $http({
        method: 'post',
        url: LoginConfig.sysUserConStant.getUserListUrl,
        data: data
      })
    },
    insertSysOrg: function(data) {
      return $http({
        method: 'post',
        url: LoginConfig.sysUserConStant.insertSysOrgUrl,
        data: data
      })
    },
    updateSysOrg: function(data) {
      return $http({
        method: 'post',
        url: LoginConfig.sysUserConStant.updateSysOrgUrl,
        data: data
      })
    },
    deleteSysOrg: function(data) {
      return $http({
        method: 'post',
        url: LoginConfig.sysUserConStant.deleteSysOrgUrl,
        data: data
      })
    },
    saveDepartmentByOrg: function(data) {
      return $http({
        method: 'post',
        url: LoginConfig.sysUserConStant.saveDepartmentByOrgUrl,
        data: data
      })
    },
    editDepartment: function(data) {
      return $http({
        method: 'post',
        url: LoginConfig.sysUserConStant.editDepartmentUrl,
        data: data
      })
    },
    removeDepartment: function(data) {
      return $http({
        method: 'post',
        url: LoginConfig.sysUserConStant.removeDepartmentUrl,
        data: data
      })
    },
    insertUser: function(data) {
      return $http({
        method: 'post',
        url: LoginConfig.sysUserConStant.insertUserUrl,
        data: data
      })
    },
    editPerson: function(data) {
      return $http({
        method: 'post',
        url: LoginConfig.sysUserConStant.editPersonUrl,
        data: data
      })
    },
    removePerson: function(data) {
      return $http({
        method: 'post',
        url: LoginConfig.sysUserConStant.removePersonUrl,
        data: data
      })
    },
    queryAllRole: function(data) {
      return $http({
        method: 'post',
        url: LoginConfig.sysUserConStant.queryAllRoleUrl,
        data: data
      })
    },
    addUserDeptRole: function(data) {
      return $http({
        method: 'post',
        url: LoginConfig.sysUserConStant.addUserDeptRoleUrl,
        data: data
      })
    },
    removeUserDeptRole: function(data) {
      return $http({
        method: 'post',
        url: LoginConfig.sysUserConStant.removeUserDeptRoleUrl,
        data: data
      })
    },
    queryOrgByUserId: function (data) {
      return $http({
        method: 'post',
        url: LoginConfig.sysUserConStant.queryOrgByUserIdUrl,
        data: data
      })
    },
    getFailureTimes: function (data) {
      return $http({
        method: 'post',
        url: LoginConfig.sysUserConStant.getFailureTimes,
        data: data,
        transformResponse: function(res) {  // 转换response
          return res;
        }
      })
    },
    queryUserInfo:function () {
      return $http({
        method: 'post',
        url: LoginConfig.sysUserConStant.queryUserInfo
      })
    },
    updateUserSession:function (data) {
      return $http({
        method: 'post',
        url: LoginConfig.sysUserConStant.updateUserSessionUrl,
        data: data
      })
    },
    queryCourtOrg:function () {
      return $http({
        method: 'post',
        url: LoginConfig.sysUserConStant.queryCourtOrgUrl
      })
    },
      selectCourtOrPolice:function () {
          return $http({
              method: 'post',
              url: LoginConfig.sysUserConStant.selectCourtOrPoliceUrl
          })
      },

    queryJyTemplateInfo:function (data) {
      return $http({
        method: 'post',
        url: LoginConfig.sysUserConStant.queryJyTemplateInfoUrl,
        data: data
      })
    },
    saveJyTemplateInfo:function (data) {
      return $http({
        method: 'post',
        url: LoginConfig.sysUserConStant.saveJyTemplateInfoUrl,
        data: data
      })
    },
    queryOrgCourtByOrgId:function (data) {
      return $http({
        method: 'post',
        url: LoginConfig.sysUserConStant.queryOrgCourtByOrgIdUrl,
        data: data
      })
    },
    saveSysOrgCourt:function (data) {
      return $http({
        method: 'post',
        url: LoginConfig.sysUserConStant.saveSysOrgCourtUrl,
        data: data
      })
    },
    deleteSysOrgCourtById:function (data) {
      return $http({
        method: 'post',
        url: LoginConfig.sysUserConStant.deleteSysOrgCourtByIdUrl,
        data: data
      })
    },
    querySysUserByIds:function (data) {
      return $http({
        method: 'post',
        url: LoginConfig.sysUserConStant.querySysUserByIdsUrl,
        data: data
      })
    },
    querySysOrgAppraisalList:function (data) {
      return $http({
        method: 'post',
        url: LoginConfig.sysUserConStant.querySysOrgAppraisalListUrl,
        data: data
      })
    },
    queryOrgAppraisalByName:function (data) {
      return $http({
        method: 'post',
        url: LoginConfig.sysUserConStant.queryOrgAppraisalByNameUrl,
        data: data
      })
    },
    insertSysOrgAppraisal:function (data) {
      return $http({
        method: 'post',
        url: LoginConfig.sysUserConStant.insertSysOrgAppraisalUrl,
        data: data
      })
    },
    deleteSysOrgAppraisal:function (data) {
      return $http({
        method: 'post',
        url: LoginConfig.sysUserConStant.deleteSysOrgAppraisalUrl,
        data: data
      })
    },
    queryInterfaceConfigList:function(data){
      return $http({
        method: 'post',
        url: LoginConfig.interfaceConstant.queryInterfaceConfigListUrl,
        data: data
      })
    },
    queryCountInterfaceConfig:function(data){
      return $http({
        method: 'post',
        url: LoginConfig.interfaceConstant.queryCountInterfaceConfigUrl,
        data: data
      })
    },
    queryJudgeCountInterfaceConfig:function(data){
      return $http({
        method: 'post',
        url: LoginConfig.interfaceConstant.queryJudgeCountInterfaceConfigUrl,
        data: data
      })
    },
    saveInterfaceConfig:function(data){
      return $http({
        method: 'post',
        url: LoginConfig.interfaceConstant.saveInterfaceConfigUrl,
        data: data
      })
    },
      saveJudgeInterfaceConfig:function(data){
      return $http({
        method: 'post',
        url: LoginConfig.interfaceConstant.saveJudgeInterfaceConfigUrl,
        data: data
      })
    },
    deleteInterfaceConfig:function(data){
      return $http({
        method: 'post',
        url: LoginConfig.interfaceConstant.deleteInterfaceConfigUrl,
        data: data
      })
    },
    deleteJudgeInterfaceConfig:function(data){
      return $http({
        method: 'post',
        url: LoginConfig.interfaceConstant.deleteJudgeInterfaceConfigUrl,
        data: data
      })
    },
    saveJyHelpInfo:function(data){
      return $http({
        method: 'post',
        url: LoginConfig.interfaceConstant.saveJyHelpInfoUrl,
        data: data
      })
    },
    deleteJyHelpInfo:function(data){
      return $http({
        method: 'post',
        url: LoginConfig.interfaceConstant.deleteJyHelpInfoUrl,
        data: data
      })
    },
    queryJyHelpInfoList:function(data){
      return $http({
        method: 'post',
        url: LoginConfig.interfaceConstant.queryJyHelpInfoListUrl,
        data: data
      })
    },
      queryJyIncomeNormList:function(data){
        return $http({
            method: 'post',
            url: LoginConfig.interfaceConstant.queryJyIncomeNormList,
            data: data
        })
      },
      queryJyIncomeNormNum:function(data){
          return $http({
              method: 'post',
              url: LoginConfig.interfaceConstant.queryJyIncomeNormNum,
              data: data
          })
      },
    queryJyHelpInfoCountList:function(data){
      return $http({
        method: 'post',
        url: LoginConfig.interfaceConstant.queryJyHelpInfoCountListUrl,
        data: data
      })
    },
    uploadHelpFile:function(data){
      return $http({
        method: 'post',
        url: LoginConfig.interfaceConstant.uploadHelpFileUrl,
        data: data
      })
    },
    queryJyIndustryNameInfo:function(data){
      return $http({
          method: 'post',
          url: LoginConfig.interfaceConstant.queryJyIndustryNameInfoUrl,
          data: data
      })
    },
    selectAdminRegionInfo:function(data){
        return $http({
            method: 'post',
            url: LoginConfig.interfaceConstant.selectAdminRegionInfoUrl,
            data: data
        })
    },
    queryJyIndustryDataListInfo:function(data){
        return $http({
            method: 'post',
            url: LoginConfig.interfaceConstant.queryJyIndustryDataListInfoUrl,
            data: data
        })
    },
    queryJyIndustryPageCountInfo:function(data){
        return $http({
            method: 'post',
            url: LoginConfig.interfaceConstant.queryJyIndustryPageCountInfoUrl,
            data: data
        })
    },
    deleteJyIndustryDataInfo:function(data){
        return $http({
            method: 'post',
            url: LoginConfig.interfaceConstant.deleteJyIndustryDataInfoUrl,
            data: data
        })
    },
    updateJyIndustryDataInfo:function(data){
        return $http({
            method: 'post',
            url: LoginConfig.interfaceConstant.updateJyIndustryDataInfoUrl,
            data: data
        })
    },
    queryIsDefaultPassword: function(data) {
      return $http({
        method: 'post',
        url: LoginConfig.sysUserConStant.queryIsDefaultPasswordUrl,
        data: data
      })
    },
    queryCourtDictionary: function(data) {  //查询法院
      return $http({
        method: 'post',
        url: LoginConfig.sysUserConStant.queryCourtDictionaryUrl,
        data: data
      })
    },
    queryJyOnlineState: function(data) {  //查询地区上线情况
        return $http({
            method: 'post',
            url: LoginConfig.sysUserConStant.queryJyOnlineStateUrl,
            data: data
        })
    },
    createCode: function(data) {
      return $http({
          method: 'post',
          url: LoginConfig.createCode.createCodeUrl,
          data: data
      })
    },
    saveJyOnlineStateService: function(data){
      return $http({
        method: 'post',
        url: LoginConfig.sysUserConStant.saveJyOnlineStateUrl,
        data: data
      })
    },
    getDataPermission: function(data){
      return $http({
        method: 'post',
        url: LoginConfig.sysUserConStant.getDataPermissionUrl,
        data: data
      })
    },
    queryDataPermission: function(data){
      return $http({
        method: 'post',
        url: LoginConfig.sysUserConStant.getUserDataPermissionUrl,
        data: data
      })
    },
    addUserDataPermission: function(data){
      return $http({
        method: 'post',
        url: LoginConfig.sysUserConStant.addUserDataPermission,
        data: data
      })
    },
    removeUserDataPermission:function(data){
      return $http({
        method: 'post',
        url: LoginConfig.sysUserConStant.removeUserDataPermissionUrl,
        data: data
      })
    },
    queryPortDealerList:function(data){
      return $http({
          method: 'post',
          url: LoginConfig.portDealerConstant.portDealerUrl,
          data: data
      })
    },
    queryJudgeInterfaceConfigList:function(data){
      return $http({
          method: 'post',
          url: LoginConfig.portDealerConstant.queryJudgeInterfaceConfigListUrl,
          data: data
      })
    },
    updateVoidSma:function(data){
      return $http({
        method: 'post',
        url: LoginConfig.portDealerConstant.updateVoidSmaUrl,
        data: data
      })
    },
    saveMtDenizenIncomeNorm:function (data) {
        return $http({
            method:'post',
            url:LoginConfig.sysUserConStant.saveMtDenizenIncomeNormUrl,
            data:data
        })
    },
    updateMtDenizenIncomeNorm:function (data) {
      return $http({
          method:'post',
          url:LoginConfig.sysUserConStant.updateMtDenizenIncomeNormUrl,
          data:data
      })
    },
    Compensation:function(data){
      return $http({
          method: 'post',
          url: LoginConfig.sysUserConStant.queryCompensationListUrl,
          data: data
      })
    },
    deleteCompensation:function(data){ //删除赔偿标准
      return $http({
          method: 'post',
          url: LoginConfig.sysUserConStant.deleteCompensationUrl,
          data: data
      })
    },
    addCompensation:function(data){ //新增赔偿标准
      return $http({
          method: 'post',
          url: LoginConfig.sysUserConStant.addCompensationUrl,
          data: data
      })
    },
    selectAdminRegion:function(data){ //区域名称
      return $http({
          method: 'post',
          url: LoginConfig.sysUserConStant.selectAdminRegionUrl,
          data: data
      })
    },
    insertIndustryIncomeNorm:function(data){ //区域名称
      return $http({
          method: 'post',
          url: LoginConfig.sysUserConStant.insertIndustryIncomeNormUrl,
          data: data
      })
    },
    modifyCompensateStandard:function(data){ //修改赔偿标准
      return $http({
          method: 'post',
          url: LoginConfig.sysUserConStant.updateCompensateStandardUrl,
          data: data
      })
    },
    deleteMtDenizenIncomeNorm:function(data){
      return $http({
          method: 'post',
          url: LoginConfig.sysUserConStant.deleteMtDenizenIncomeNormUrl,
          data: data
      })
    },
    countCompensateStandard:function(data){
      return $http({
          method: 'post',
          url: LoginConfig.sysUserConStant.countCompensateStandardUrl,
          data: data
      })
    },
    checkMtDenizenIncomeNormDataExists:function(data){
      return $http({
          method: 'post',
          url: LoginConfig.sysUserConStant.checkMtDenizenIncomeNormDataExistsUrl,
          data: data
      })
  },
    checkMtCompensateStandardDataExists:function(data){
      return $http({
          method: 'post',
          url: LoginConfig.sysUserConStant.checkMtCompensateStandardDataExistsUrl,
          data: data
      })
    },
    insertJyEnvironmentInfo:function(data){
      return $http({
        method: 'post',
        url: LoginConfig.sysUserConStant.insertJyEnvironmentInfoUrl,
        data: data
      })
    },
    updateJyEnvironmentInfo:function(data){
      return $http({
        method: 'post',
        url: LoginConfig.sysUserConStant.updateJyEnvironmentInfoUrl,
        data: data
      })
    },
    queryJyEnvironmentInfo:function(data){
      return $http({
        method: 'post',
        url: LoginConfig.sysUserConStant.queryJyEnvironmentInfoUrl,
        data: data
      })
    },
    queryMtDisabilityGradeInfo:function(data){
      return $http({
        method: 'post',
        url: LoginConfig.interfaceConstant.queryMtDisabilityGradeInfoUrl,
        data: data
      })
    },
    selectCategoryDisabilityInfo:function(data){
      return $http({
        method: 'post',
        url: LoginConfig.interfaceConstant.selectCategoryDisabilityInfoUrl,
        data: data
      })
    },
    selectBodyCategoryService:function(data){
        return $http({
            method: 'post',
            url: LoginConfig.interfaceConstant.selectBodyCategoryUrl,
            data: data
        })
    },
    queryMtDisabilityGradeTotalInfo:function(data){
      return $http({
        method: 'post',
        url: LoginConfig.interfaceConstant.queryMtDisabilityGradeTotalInfoUrl,
        data: data
      })
    },
    saveMtDisabilityGradeInfo:function(data){
      return $http({
        method: 'post',
        url: LoginConfig.interfaceConstant.saveMtDisabilityGradeInfoUrl,
        data: data
      })
    },
    updateMtDisabilityGradeInfo:function(data){
      return $http({
          method: 'post',
          url: LoginConfig.interfaceConstant.updateMtDisabilityGradeInfoUrl,
          data: data
      })
    },
    deleteCategoryDisabilityInfo:function(data){
      return $http({
          method: 'post',
          url: LoginConfig.interfaceConstant.deleteCategoryDisabilityInfoUrl,
          data: data
      })
    }
    ,selectByDisabilityGradeIdInfo: function(data){
      return $http({
          method: 'post',
          url: LoginConfig.interfaceConstant.selectByDisabilityGradeIdInfoUrl,
          data: data
      })
    },
    queryIndustryIncomeNormByNameAndDateAndTypeCode: function(data){
      return $http({
        method: 'post',
        url: LoginConfig.sysUserConStant.queryIndustryIncomeNormByNameAndDateAndTypeCodeUrl,
        data: data
      })
    },
    queryMtDisabilityGradeDetailInfo: function(data){
      return $http({
        method: 'post',
        url: LoginConfig.interfaceConstant.queryMtDisabilityGradeDetailInfoUrl,
        data: data
      })
    },
    queryCheckedMtDisabilityGradeInfo: function(data){
      return $http({
        method: 'post',
        url: LoginConfig.interfaceConstant.queryCheckedMtDisabilityGradeInfoUrl,
        data: data
      })
    },
    updateAdjustdisabilityGradeIdInfo: function(data){
      return $http({
        method: 'post',
        url: LoginConfig.interfaceConstant.updateAdjustdisabilityGradeIdInfoUrl,
        data: data
      })
    },
    updateLawdisabilityGradeIdInfo: function(data){
      return $http({
        method: 'post',
        url: LoginConfig.interfaceConstant.updateLawdisabilityGradeIdInfoUrl,
        data: data
      })
    },
    updateCompensateInfoDisabilityGradeIdInfo: function(data){
      return $http({
        method: 'post',
        url: LoginConfig.interfaceConstant.updateCompensateInfoDisabilityGradeIdUrl,
        data: data
      })
    },
    updateSecondInstanceDisabilityGradeIdInfo: function(data){
      return $http({
        method: 'post',
        url: LoginConfig.interfaceConstant.updateSecondInstanceDisabilityGradeIdUrl,
        data: data
      })
    },
    queryRegionalNameRemarkData:function(data){    //请求后台获取区域名称备注数据
      return $http({
        method: 'post',
        url: LoginConfig.interfaceConstant.queryRegionalNameRemarkDataUrl,
        data: data
      })
    },
    deleteQueryRegionalNameRemarkData:function(data){    //删除区域名称备注数据
      return $http({
        method: 'post',
        url: LoginConfig.interfaceConstant.deleteQueryRegionalNameRemarkDataUrl,
        data: data
      })
    },
    AddQueryRegionalNameRemarkData:function(data){    //新增后的区域名称备注数据
      return $http({
        method: 'post',
        url: LoginConfig.interfaceConstant.AddQueryRegionalNameRemarkDataUrl,
        data: data
      })
    },
    updateQueryRegionalNameRemarkData:function(data){    //修改后的区域名称备注数据
      return $http({
        method: 'post',
        url: LoginConfig.interfaceConstant.updateQueryRegionalNameRemarkDataUrl,
        data: data
      })
    },
    pagingQueryRegionalNameRemarkData:function(data){    //区域名称备注数据分页
      return $http({
        method: 'post',
        url: LoginConfig.interfaceConstant.pagingQueryRegionalNameRemarkDataUrl,
        data: data
      })
    },
    queryMtRegionalNameRemark:function(data){
      return $http({
        method: 'post',
        url: LoginConfig.interfaceConstant.queryMtRegionalNameRemarkUrl,
        data: data
      })
    },
    getImgListData:function(data){
      return $http({
        method: 'post',
        url: LoginConfig.interfaceConstant.getImgListDataUrl,
        data: data
      })
    },
    addImgListData:function(data){
      return $http({
        method:"post",
        url:LoginConfig.interfaceConstant.addImgListDataUrl,
        data: data
      })
    },
    deleteImgListData:function(data){
      return $http({
        method:'post',
        url:LoginConfig.interfaceConstant.deleteImgListDataUrl,
        data: data
      })
    },
    indexbannerImgListData:function(data){
      return $http({
        method:"post",
        url:LoginConfig.interfaceConstant.indexbannerImgListUrl,
        data:data
      })
    },
    sendSysOrgAndJudgeInfo: function(data){
      return $http({
        method: 'post',
        url: LoginConfig.sysUserConStant.sendSysOrgAndJudgeInfo,
        data: data
      })
    },
    sendAllCaseInfo: function(data){
      return $http({
        method: 'post',
        url: LoginConfig.sysUserConStant.sendAllCaseInfo,
        data: data
      })
    },
    selectAllCaseInfo: function(data){
      return $http({
        method: 'post',
        url: LoginConfig.sysUserConStant.selectAllCaseInfo,
        data: data
      })
    },
    selectAllCaseInfoCount: function(data){
      return $http({
        method: 'post',
        url: LoginConfig.sysUserConStant.selectAllCaseInfoCount,
        data: data
      })
    },
    sendFailData: function(data){
      return $http({
        method: 'post',
        url: LoginConfig.sysUserConStant.sendFailData,
        data: data
      })
    },
    selectErrorInfo: function(data){
      return $http({
        method: 'post',
        url: LoginConfig.sysUserConStant.selectErrorInfo,
        data: data
      })
    },
    qeuryInterfaceSerive: function(data){
      return $http({
        method: 'post',
        url: LoginConfig.sysUserConStant.qeuryInterfaceSeriveUrl,
        data: data
      })
    },
    qeuryInterfaceCountSerive: function(data){
      return $http({
        method: 'post',
        url: LoginConfig.sysUserConStant.qeuryInterfaceCountSeriveUrl,
        data: data
      })
    },
    selectDomainMaintainSum:function(data){
      return $http({
        method:'post',
        url:LoginConfig.sysUserConStant.selectDomainMaintainSumUrl,
        data:data
      })
    },
    selectDomainMaintainList:function(data){
      return $http({
        method:'post',
        url:LoginConfig.sysUserConStant.selectDomainMaintainListUrl,
        data:data
      })
    },
    deleteDomainMaintainById:function(data){
      return $http({
        method:'post',
        url:LoginConfig.sysUserConStant.deleteDomainMaintainUrl,
        data:data
      })
    },addDomainMaintain:function(data){
      return $http({
        method:'post',
        url:LoginConfig.sysUserConStant.addDomainMaintainUrl,
        data:data
      })
    },querySysOrgRelationList:function (data) {
      return $http({
        method: 'post',
        url: LoginConfig.sysUserConStant.queryPoliceRelationOrgListUrl,
        data: data
      })
    },querySysOrgByName:function (data) {
      return $http({
        method: 'post',
        url: LoginConfig.sysUserConStant.queryOrgByName,
        data: data
      })
    },deletePolcieSysOrgRelation:function (data) {
      return $http({
        method: 'post',
        url: LoginConfig.sysUserConStant.deletePolcieSysOrgRelationUrl,
        data: data
      })
    },insertPoliceOrgRelation:function (data) {
      return $http({
        method: 'post',
        url: LoginConfig.sysUserConStant.insertPoliceOrgRelationUrl,
        data: data
      })
    },
    queryCourtDictionaryList:function (data) {
      return $http({
        method: 'post',
        url: LoginConfig.sysUserConStant.queryCourtDictionaryListUrl,
        data: data
      })
    },
    querySysOrgByCourtCode:function (data) {
        return $http({
            method: 'post',
            url: LoginConfig.sysUserConStant.querySysOrgByCourtCodeUrl,
            data: data
        })
    },
    querySenddataErrormessageList:function (data) {//日志查询列表方法
      return $http({
        method: 'post',
        url: LoginConfig.sysUserConStant.querySenddataErrormessageListUrl,
        data: data
      })
    },
    querySenddataErrormessageCount:function (data) {
      return $http({
        method: 'post',
        url: LoginConfig.sysUserConStant.querySenddataErrormessageCountUrl,
        data: data
      })
    },
    updateSenddataErrormessage:function (data) { //更新数据状态方法
      return $http({
        method: 'post',
        url: LoginConfig.sysUserConStant.updateSenddataErrormessageUrl,
        data: data
      })
    },
    sendChongqingFailDataService:function (data) { //发送重庆数据方法
        return $http({
            method: 'post',
            url: LoginConfig.sysUserConStant.sendChongqingFailDataUrl,
            data: data
        })
    },
    saveEmailUser:function (data) { //新建用户修改用户邮箱
      return $http({
        method: 'post',
        url: LoginConfig.interfaceConstant.saveEmailUserUrl,
        data: data
      })
    },
    queryEmailUserList:function (data) { //查询用户列表
      return $http({
        method: 'post',
        url: LoginConfig.interfaceConstant.queryEmailUserListUrl,
        data: data
      })
    },
    deleteEmailUser:function (data) { //删除用户
      return $http({
        method: 'post',
        url: LoginConfig.interfaceConstant.deleteEmailUserUrl,
        data: data
      })
    },
    queryLogUser:function (data) { //查询角色
      return $http({
        method: 'post',
        url: LoginConfig.interfaceConstant.queryLogUserUrl,
        data: data
      })
    },
    anaLog:function (data) { //登录查询案件
      return $http({
        method: 'post',
        url: LoginConfig.interfaceConstant.anaLogUrl,
        data: data
      })
    },queryRedisListBySerialNoService:function (data) { //登录查询案件
      return $http({
        method: 'post',
        url: LoginConfig.interfaceConstant.queryRedisListBySerialNoUrl,
        data: data
      })
    },closeAlterFlagService:function (data) {
      return $http({
        method: 'post',
        url: LoginConfig.interfaceConstant.closeAlterFlagUrl,
        data: data
      })
    },
  };
})