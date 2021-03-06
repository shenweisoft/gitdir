'use strict';
angular.module('sbAdminApp').constant('LoginConfig', {
  httpCode: {
    SUCCESS: 200, //服务器已成功处理了请求
    ERROR_REQUEST: 400, //（错误请求） 服务器不理解请求的语法。
    UNAUTHORIZED: 401, //（未授权） 请求要求身份验证。 对于需要登录的网页，服务器可能返回此响应。
    PROHIBIT: 403, //（禁止） 服务器拒绝请求。
    NOT_FOUND: 404, //（未找到） 服务器找不到请求的网页。
    INTERNAL_ERROR: 500 //（方法禁用） 禁用请求中指定的方法。
  },
  commonConStant: { //公用常量
    SUCCESS: 0,
    FAILURE: -1
  },
  pictureConstant:{
    bigPictureUrl:"/lawProject/common/image/get/",
    smallPictureUrl:"/lawProject/common/image/getThumbnail/",
    cropImageUrl:"/lawProject/common/cropImage",
    uploadImageUrl:"/lawProject/common/uploadImage",
    codeFilePathUrl:"/lawProject/common/codeFile/",
    uploadBannerImageUrl:"/lawProject/common/uploadImagesHierarchy",//上传banner图
    importCourtExcel:"/lawProject/common/importCourtExcel",
    importIdentificationExcel:"/lawProject/common/importIdentificationExcel",
    importCourtUserInfoExcel:"/lawProject/common/importCourtUserInfo",
    importMediateUserInfoExcel:"/lawProject/common/importMediateUserInfo",
    importApplyerUserInfoExcel:"/lawProject/common/importApplyerUserInfo",
    importInsuranceCompanyExcel:"/lawProject/common/importInsuranceCompanyExcel"
  },
  dictionaryConStant: {
    CERTIFICATES: '1000' //身份信息定义
  },
  loginConStant: {
    loginUrl: '/lawProject/login/dologin', //登录后台地址
    logoutUrl: '/lawProject/login/dologout',
    randomCodeUrl: '/lawProject/login/RandomCodeCtrl?', //验证码后台地址
    loginErrorCode: {
      SUCCESS: 0,
      FAILURE: -1,
      LOGIN_PASSWD_FAILURE: 2001, //"密码错误"
      LOGIN_FAILED_MANY_TIMES: 2002, //"失败次数过多"
      LOGIN_VERIFICATION_CODE_ERROR: 2007, //"验证码错误"
      LOGIN_NONEXIST: 2008, //"账号不存在"
      LOGIN_EXIST: 2009, //"账号已存在"
      LOGIN_ROLE:2010,  //没有当前入口登录权限
      LOGIN_LOCKED:2012  //账号锁定
    }
  },
  forgetPasswordConstant: {
    existUserUrl: '/lawProject/login/verificUserNameCode',
    sendMobileCodeUrl: '/lawProject/login/sendMobileCode',
    checkPhoneCodeUrl: '/lawProject/login/verificMobileCode',
    modifyPassword: '/lawProject/login/updatePassWord',
    sendLinkMail: '/lawProject/login/sendEmail',
    errorCode: {
      VERIFICATION_CODE_ERROR: 2007,
      USER_NOT_EXIST: 2008
    }
  },
  registerConStant: {
    registerUrl: '/lawProject/login/register',
    checkLoginAccountUrl: '/lawProject/login/checkLoginAccount'
  },
  sysUserConStant: {
    queryRoleListUrl: '/lawProject/system/queryRoleByParentId',
    createRoleUrl: '/lawProject/system/insertRole',
    editRoleUrl: '/lawProject/system/updateRole',
    removeRoleByIdUrl: '/lawProject/system/deleteRoleById',
    queryRoleByIdUrl: '/lawProject/system/queryRoleById',
    querySysUserUrl: '/lawProject/system/querySysUser',
    bindPhoneUrl: 'lawProject/login/verificCodeAndModifyMobile',
    editSysUserUrl: '/lawProject/system/updateUser',
    mailBindingUrl: '/lawProject/login/mailBinding',
    editPasswordUrl: "/lawProject/login/verificUpdatePassword",
    getOrgListUrl: "/lawProject/system/getOrgList",
    getDeptListUrl: "/lawProject/system/getDeptList",
    getUserListUrl: "/lawProject/system/getUserList",
    insertSysOrgUrl:"/lawProject/system/insertOrg",
    updateSysOrgUrl:"/lawProject/system/updateOrg",
    deleteSysOrgUrl:"/lawProject/system/deleteOrg",
    saveDepartmentByOrgUrl:"/lawProject/system/insertOrgDepartment",
    editDepartmentUrl:"/lawProject/system/updateDepartment",
    removeDepartmentUrl:"/lawProject/system/deleteDepartment",
    insertUserUrl: "/lawProject/system/insertUser",
    queryAllRoleUrl:"/lawProject/system/queryAllRole",
    editPersonUrl: "/lawProject/system/updateUser",
    removePersonUrl:"/lawProject/system/deleteUser",
    addUserDeptRoleUrl:"/lawProject/system/insertUserDeptRole",
    removeUserDeptRoleUrl:"/lawProject/system/deleteUserDeptRole",
    getUserInfoUrl:"/lawProject/system/querySysUserById",
    queryOrgByUserIdUrl:"/lawProject/system/queryOrgByUserId",
    getFailureTimes: "/lawProject/login/getFailureTimes",
    queryUserInfo:"/lawProject/system/queryUserInfo",
    updateUserSessionUrl:"/lawProject/login/updateUserSession",
    queryCourtOrgUrl:"/lawProject/system/queryCourtOrg",
    selectCourtOrPoliceUrl:"/lawProject/system/selectCourtOrPolice",
    queryJyTemplateInfoUrl:"/lawProject/system/queryJyTemplateInfo",
    saveJyTemplateInfoUrl:"/lawProject/system/saveJyTemplateInfo",
    queryOrgCourtByOrgIdUrl:"/lawProject/system/queryOrgCourtByOrgId",
    saveSysOrgCourtUrl:"/lawProject/system/saveSysOrgCourt",
    deleteSysOrgCourtByIdUrl:"/lawProject/system/deleteSysOrgCourtById",
    querySysUserByIdsUrl:"/lawProject/system/querySysUserByIds",
    querySysOrgAppraisalListUrl:"/lawProject/system/querySysOrgAppraisalList",
    queryOrgAppraisalByNameUrl:"/lawProject/system/queryOrgAppraisalByName",
    insertSysOrgAppraisalUrl:"/lawProject/system/insertSysOrgAppraisal",
    deleteSysOrgAppraisalUrl:"/lawProject/system/deleteSysOrgAppraisal",
    queryIsDefaultPasswordUrl:"lawProject/login/queryIsDefaultPassword",
    queryCourtDictionaryUrl:'/lawProject/system/queryCourtDictionary',
    queryJyOnlineStateUrl:'/lawProject/system/queryJyOnlineState',
    saveJyOnlineStateUrl: '/lawProject/system/saveJyOnlineState',
    sendSysOrgAndJudgeInfo: '/lawProject/system/sendSysOrgAndJudgeInfo',
    getDataPermissionUrl:'/lawProject/system/queryOrgByParam',
    getUserDataPermissionUrl:'/lawProject/system/getUserDataPermission',
    addUserDataPermission:'/lawProject/system/addUserDataPermission',
    removeUserDataPermissionUrl: '/lawProject/system/removeUserDataPermission',
    saveMtDenizenIncomeNormUrl: '/lawProject/system/addDenizenNorm',
    updateMtDenizenIncomeNormUrl:'/lawProject/system/updateDenizenNorm',
    queryCompensationListUrl: '/lawProject/system/selectCompensateStandard',
    deleteCompensationUrl:'/lawProject/system/deleteCompensateStandard',
    addCompensationUrl:'/lawProject/system/addCompensateStandard',
    deleteMtDenizenIncomeNormUrl:'/lawProject/system/deleteDenizenNorm',
    selectAdminRegionUrl:'/lawProject/system/selectAdminRegion',
    updateCompensateStandardUrl:'/lawProject/system/updateCompensateStandard',
    countCompensateStandardUrl:'/lawProject/system/countCompensateStandard',
    checkMtDenizenIncomeNormDataExistsUrl:'/lawProject/system/checkMtDenizenIncomeNormDataExists',
    checkMtCompensateStandardDataExistsUrl:'/lawProject/system/checkMtCompensateStandardDataExists',
    insertJyEnvironmentInfoUrl:'/lawProject/system/insertJyEnvironmentInfo',
    updateJyEnvironmentInfoUrl:'/lawProject/system/updateJyEnvironmentInfo',
    queryJyEnvironmentInfoUrl:'/lawProject/system/queryJyEnvironmentInfo',
    insertIndustryIncomeNormUrl:'/lawProject/system/insertIndustryIncomeNorm',
    queryIndustryIncomeNormByNameAndDateAndTypeCodeUrl:'/lawProject/system/queryIndustryIncomeNormByNameAndDateAndTypeCode',
    sendAllCaseInfo:'/lawProject/system/sendAllCaseInfo',
    selectAllCaseInfo:'/lawProject/system/selectAllCaseInfo',
    selectAllCaseInfoCount:'/lawProject/system/selectAllCaseInfoCount',
    sendFailData:'/lawProject/system/sendFailCaseInfo',
    selectErrorInfo:'/lawProject/system/selectErrorInfo',
    qeuryInterfaceSeriveUrl:'/lawProject/system/querySendDataErrorMessage',
    qeuryInterfaceCountSeriveUrl:'/lawProject/system/querySendDataErrorMessageCount',
    selectDomainMaintainSumUrl:'/lawProject/system/selectDomainMaintainSum',
    selectDomainMaintainListUrl:'/lawProject/system/selectDomainMaintainList',
    deleteDomainMaintainUrl:'/lawProject/system/deleteDomainMaintainById',
    addDomainMaintainUrl:'/lawProject/system/insertOrupdateDomainMaintain',
    queryPoliceRelationOrgListUrl:'/lawProject/system/queryPoliceRelationOrgList',
    queryOrgByName:'/lawProject/system/queryOrgByName',
    deletePolcieSysOrgRelationUrl:"/lawProject/system/deletePolcieSysOrgRelation",
    insertPoliceOrgRelationUrl:"/lawProject/system/insertPoliceOrgRelation",
    queryCourtDictionaryListUrl:"/lawProject/adjust/queryCourtDictionaryList",
    querySysOrgByCourtCodeUrl:"/lawProject/adjust/querySysOrgByCourtCode",
    querySenddataErrormessageListUrl:"/lawProject/system/querySenddataErrormessageList",
    querySenddataErrormessageCountUrl:"/lawProject/system/querySenddataErrormessageCount",
    updateSenddataErrormessageUrl:"/lawProject/system/updateSenddataErrormessage",
    sendChongqingFailDataUrl:"/lawProject/system/sendChongqingFailCaseInfo",
    errorCode: {
      VERIFICATION_CODE_ERROR: 2007
    }
  },
  interfaceConstant:{
    queryInterfaceConfigListUrl:"/lawProject/system/queryInterfaceConfigList",
    queryCountInterfaceConfigUrl:"/lawProject/system/queryCountInterfaceConfig",
    queryJudgeCountInterfaceConfigUrl:"/lawProject/system/queryJudgeCountInterfaceConfig",
    saveInterfaceConfigUrl:"/lawProject/system/saveInterfaceConfig",
    saveJudgeInterfaceConfigUrl:"/lawProject/system/saveJudgeInterfaceConfig",
    deleteInterfaceConfigUrl:"/lawProject/system/deleteInterfaceConfig",
    deleteJudgeInterfaceConfigUrl:"/lawProject/system/deleteJudgeInterfaceConfig",
    saveJyHelpInfoUrl:"/lawProject/system/saveJyHelpInfo",
    deleteJyHelpInfoUrl:"/lawProject/system/deleteJyHelpInfo",
    queryJyHelpInfoListUrl:"/lawProject/system/queryJyHelpInfoList",
    queryJyIncomeNormList:"lawProject/system/selectDenizenNorm",
    queryJyIncomeNormNum:"lawProject/system/countDenizenNorm",
    queryJyHelpInfoCountListUrl:"/lawProject/system/queryJyHelpInfoCountList",
    uploadHelpFileUrl:"/lawProject/common/uploadHelpFile",
    downloadHelpFile:"/lawProject/common/downloadHelpFile",
    queryJyIndustryNameInfoUrl:"/lawProject/system/queryMtDictElement",
    queryJyIndustryDataListInfoUrl:"/lawProject/system/queryIndustryIncomeNorm",
    queryJyIndustryPageCountInfoUrl:"/lawProject/system/queryIndustryIncomeNormCount",
    deleteJyIndustryDataInfoUrl:"/lawProject/system/deleteIndustryIncomeNorm",
    updateJyIndustryDataInfoUrl:"/lawProject/system/updateIndustryIncomeNorm",
    queryMtDisabilityGradeInfoUrl:"/lawProject/system/queryMtDisabilityGrade",
    selectCategoryDisabilityInfoUrl:"/lawProject/system/selectCategoryDisability",
    selectBodyCategoryUrl:"/lawProject/system/selectBodyCategory",
    queryMtDisabilityGradeTotalInfoUrl:"/lawProject/system/queryMtDisabilityGradeTotal",
    saveMtDisabilityGradeInfoUrl:"/lawProject/system/saveMtDisabilityGrade",
    updateMtDisabilityGradeInfoUrl:"/lawProject/system/updateMtDisabilityGrade",
    deleteCategoryDisabilityInfoUrl:"/lawProject/system/deleteCategoryDisability",
    selectByDisabilityGradeIdInfoUrl:"/lawProject/system/selectByDisabilityGradeId",
    queryMtDisabilityGradeDetailInfoUrl:"/lawProject/system/queryMtDisabilityGradeDetail",
    queryCheckedMtDisabilityGradeInfoUrl:"/lawProject/system/queryCheckedMtDisabilityGrade",
    updateAdjustdisabilityGradeIdInfoUrl:"/lawProject/adjust/updateAdjustdisabilityGradeId",
    updateLawdisabilityGradeIdInfoUrl:"/lawProject/adjust/updateLawdisabilityGradeId",
    updateCompensateInfoDisabilityGradeIdUrl:"/lawProject/adjust/updateCompensateInfoDisabilityGradeId",
    updateSecondInstanceDisabilityGradeIdUrl: "/lawProject/secondinstance/updateSecondInstanceDisabilityGradeId",
    queryRegionalNameRemarkDataUrl:"/lawProject/system/queryMtRegionalNameRemarkList", //请求后台获取区域名称备注数据
    AddQueryRegionalNameRemarkDataUrl:"/lawProject/system/insertMtRegionalNameRemark",  //新增后的区域名称备注数据
    deleteQueryRegionalNameRemarkDataUrl:"/lawProject/system/deleteMtRegionalNameRemarkById",  //删除区域名称备注数据
    updateQueryRegionalNameRemarkDataUrl:"/lawProject/system/updateMtRegionalNameRemark",  //修改区域名称备注数据
    pagingQueryRegionalNameRemarkDataUrl:"/lawProject/system/queryMtRegionalNameRemarkCount", //区域名称备注分页
    queryMtRegionalNameRemarkUrl:"/lawProject/system/queryMtRegionalNameRemark",//根据年度或者区域查询计算器备注
    getImgListDataUrl:"/lawProject/system/queryImagesInfo",//banner图片list查看
    deleteImgListDataUrl:"/lawProject/system/deleteImagesInfo",//banner图片删除
    addImgListDataUrl:"/lawProject/system/saveImagesInfo",//banner图片增加修改
    indexbannerImgListUrl:"/lawProject/system/selectByStateList",// 首页初始化banner图
    queryEmailUserListUrl:"/lawProject/anaLogin/queryEmailUserList",
    saveEmailUserUrl:"/lawProject/anaLogin/saveEmailUser",
    deleteEmailUserUrl:"/lawProject/anaLogin/deleteEmailUser",
    queryLogUserUrl:"/lawProject/anaLogin/queryLogUser",
    anaLogUrl:"/lawProject/anaLogin/anaLog",
    queryRedisListBySerialNoUrl:"/lawProject/adjust/queryRedisListBySerialNo",
    closeAlterFlagUrl:"/lawProject/message/closeAlterFlag"
  },
  createCode: {
    createCodeUrl: '/lawProject/system/createCode'
  },
  portDealerConstant: {
    portDealerUrl:'/lawProject/system/queryInterfaceAddress',
    queryJudgeInterfaceConfigListUrl:'/lawProject/system/queryJudgeInterfaceConfigList',
    updateVoidSmaUrl:'/lawProject/system/updateVoidSma',
  }
});