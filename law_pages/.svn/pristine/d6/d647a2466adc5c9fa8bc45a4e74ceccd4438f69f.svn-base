'use strict';
angular.module('sbAdminApp').constant('SecondLitigantionConfig', {
  path: "/lawProject",
  httpCode: {
    SUCCESS: 200, //成功
    ERROR_REQUEST: 400, //错误请求。
    UNAUTHORIZED: 401, //未授权。
    PROHIBIT: 403, //禁止
    NOT_FOUND: 404, //未找到
    INTERNAL_ERROR: 500 //方法禁用
  },
  commonConStant: { //公用常量
    SUCCESS: 0,
    FAILURE: -1
  },
  lawCaseConStant: { //后台接口
    "saveSecondIntanceInfoUrl": "/lawProject/secondinstance/saveSecondIntanceInfo",
    "querySecondIntanceInfoUrl": "/lawProject/secondinstance/querySecondIntanceInfo",
    "updateGeneralInsuranceUrl": "/lawProject/secondinstance/updateGeneralInsurance",
    "deleteSecondInstanceAgentInfoUrl": "/lawProject/secondinstance/deleteSecondInstanceAgentInfo",
    "deleteSecondInstanceApplyerInfoUrl": "/lawProject/secondinstance/deleteSecondInstanceApplyerInfo",
    "queryGeneralInsuranceUrl": "/lawProject/secondinstance/queryGeneralInsurance",
    "queryEvidenceFileListUrl": "/lawProject/secondinstance/queryEvidenceFileList",
    "querySysOrgInfoUrl": "/lawProject/secondinstance/querySysOrgInfo",
    "deleteEvidenceUrl": "/lawProject/secondinstance/deleteEvidence",
    "downLoadEvidenceUrl": "/lawProject/secondinstance/downLoadEvidence",
    "querySecondIntanceInfoListUrl":"/lawProject/secondinstance/querySecondIntanceInfoList",
    "querySecondIntanceInfoSumUrl":"/lawProject/secondinstance/querySecondIntanceInfoSum",
    "selectSecondIntanceInfoUrl":"/lawProject/secondinstance/selectSecondIntanceInfo",
    "queryDepartByUserAndOrgUrl": "/lawProject/system/queryDepartByUserAndOrg",
    "saveSecondInstanceWorkFlowUrl": "/lawProject/secondinstance/saveSecondInstanceWorkFlow",
    "querySecondInstanceWorkFlowUrl":"/lawProject/secondinstance/querySecondInstanceWorkFlow",
    "secondInstanceSysUserByOrgIdUrl": "/lawProject/secondinstance/secondInstanceSysUserByOrgId",
    "selectSecondInstanceUserUrl": "/lawProject/system/selectSecondInstanceUser",
    "queryOrgByUserIdUrl": "/lawProject/system/queryOrgByUserId",
    "checkSecondInstanceLawNoUrl": "/lawProject/secondinstance/checkSecondInstanceLawNo"
  },
  //保险公司
  insuranceList: [{"code":"PICC","id":"0","text":"中国人民财产保险股份有限公司"},{"code":"PAIC","id":"1","text":"中国平安财产保险股份有限公司"},{"code":"CPIC","id":"2","text":"中国太平洋财产保险股份有限公司"},{"code":"CCIC","id":"3","text":"中国大地财产保险股份有限公司"},{"code":"CICP","id":"4","text":"中华联合财产保险股份有限公司"},{"code":"GPIC","id":"5","text":"中国人寿财产保险股份有限公司"},{"code":"YGBX","id":"6","text":"阳光财产保险股份有限公司"},{"code":"ABIC","id":"7","text":"安邦财产保险股份有限公司"},{"code":"TPIC","id":"8","text":"太平财产保险有限公司"},{"code":"TAIC","id":"9","text":"天安财产保险股份有限公司"},{"code":"MACN","id":"10","text":"民安财产保险有限公司"},{"code":"AAIC","id":"11","text":"安信农业保险股份有限公司"},{"code":"ACIC","id":"12","text":"安诚财产保险股份有限公司"},{"code":"AHIC","id":"13","text":"安华农业保险股份有限公司"},{"code":"AICS","id":"14","text":"永诚财产保险股份有限公司"},{"code":"AIGC","id":"15","text":"美亚财产保险有限公司"},{"code":"AMIC","id":"16","text":"中航安盟财产保险有限公司"},{"code":"AZCN","id":"17","text":"安联财产保险（中国）有限公司"},{"code":"BGIC","id":"18","text":"北部湾财产保险股份有限公司"},{"code":"BOCI","id":"19","text":"中银保险有限公司"},{"code":"BPIC","id":"20","text":"渤海财产保险股份有限公司"},{"code":"CAIC","id":"21","text":"长安责任保险股份有限公司"},{"code":"CATH","id":"22","text":"国泰财产保险有限责任公司"},{"code":"CHAC","id":"23","text":"诚泰财产保险股份有限公司"},{"code":"CJCX","id":"24","text":"长江财产保险股份有限公司"},{"code":"CRCIC","id":"25","text":"中国铁路财产保险自保有限公司"},{"code":"CRIC","id":"26","text":"富德财产保险股份有限公司"},{"code":"DBIC","id":"27","text":"都邦财产保险股份有限公司"},{"code":"DHIC","id":"28","text":"鼎和财产保险股份有限公司"},{"code":"DICC","id":"29","text":"史带财产保险股份有限公司"},{"code":"FPIC","id":"30","text":"富邦财产保险有限公司"},{"code":"GYIC","id":"31","text":"国元农业保险股份有限公司"},{"code":"HAIC","id":"32","text":"华安财产保险股份有限公司"},{"code":"HBIC","id":"33","text":"恒邦财产保险股份有限公司"},{"code":"HHBX","id":"34","text":"华海财产保险股份有限公司"},{"code":"HNIC","id":"35","text":"华农财产保险股份有限公司"},{"code":"HTIC","id":"36","text":"华泰财产保险股份有限公司"},{"code":"HYIC","id":"37","text":"现代财产保险（中国）有限公司"},{"code":"JLIC","id":"38","text":"久隆财产保险有限公司"},{"code":"JTIC","id":"39","text":"锦泰财产保险股份有限公司"},{"code":"LIHI","id":"40","text":"利宝保险有限公司"},{"code":"MSIC","id":"41","text":"三井住友海上火灾保险（中国）有限公司"},{"code":"QHIC","id":"42","text":"新疆前海联合财产保险股份有限公司"},{"code":"SJIC","id":"43","text":"日本财产保险（中国）有限公司"},{"code":"SMIC","id":"44","text":"阳光农业相互保险公司"},{"code":"SPIC","id":"45","text":"三星财产保险（中国）有限公司"},{"code":"TMNF","id":"46","text":"东京海上日动火灾保险(中国）有限公司"},{"code":"TPBX","id":"47","text":"安盛天平财产保险股份有限公司"},{"code":"TSBX","id":"48","text":"泰山财产保险股份有限公司"},{"code":"ULIC","id":"49","text":"合众财产保险股份有限公司"},{"code":"UTIC","id":"50","text":"众诚汽车保险股份有限公司"},{"code":"XAIC","id":"51","text":"鑫安汽车保险股份有限公司"},{"code":"XDCX","id":"52","text":"信达财产保险股份有限公司"},{"code":"YAIC","id":"53","text":"永安财产保险股份有限公司"},{"code":"YDCX","id":"54","text":"英大泰和财产保险股份有限公司"},{"code":"YZIC","id":"55","text":"燕赵财产保险股份有限公司"},{"code":"ZAPA","id":"56","text":"众安在线财产保险股份有限公司"},{"code":"ZKIC","id":"57","text":"紫金财产保险股份有限公司"},{"code":"ZLIC","id":"58","text":"中路交通财产保险股份有限公司"},{"code":"ZMBX","id":"59","text":"中煤财产保险股份有限公司"},{"code":"ZSIC","id":"60","text":"浙商财产保险股份有限公司"},{"code":"ZYBX","id":"61","text":"中原农业保险股份有限公司"},{"code":"ZYIC","id":"62","text":"中意财产保险有限公司"},{"code":"LIG","id":"63","text":"乐爱金财险"}],
  //定义原审诉讼地位对象
  lawTypeList: [{
    "id": "1",
    "value": "原审原告"
  },{
    "id": "2",
    "value": "原审被告"
  }],
  //身份证类型
  idTypeConstant: [{
    "id": "0",
    "value": "公民",
  }, {
    "id": "1",
    "value": "法人"
  }, {
    "id": "2",
    "value": "其它组织"
  }],
  agentTypeConstant: [{ //代理人类型
    "id": "0",
    "value": "委托"
  }, {
    "id": "1",
    "value": "法定"
  }],
  proxyPermissionConstant: [{ //委托授权
    "id": "0",
    "value": "一般授权代理"
  }, {
    "id": "1",
    "value": "特别授权代理"
  }],
  proxyTypeConstant: [{ //代理人身份
    "id": "0",
    "value": "律师"
  }, {
    "id": "1",
    "value": "公民"
  }, {
    "id": "2",
    "value": "法律工作者"
  }, {
    "id": "3",
    "value": "其他"
  }],
  agentIdentifySubList: [{ //与代理人关系（代理人身份公民时显示）
    "id": "1",
    "value": "近亲属"
  }, {
    "id": "2",
    "value": "单位职员"
  }, {
    "id": "3",
    "value": "公司员工"
  }, {
    "id": "4",
    "value": "有关社会团体推荐"
  }, {
    "id": "5",
    "value": "其他"
  }],
  companyTypeList: [{ //公司类型
    "id": "1",
    "value": "保险公司"
  }, {
    "id": "2",
    "value": "其他公司"
  }],
  legalTypeList: [{ //代表人类型
    "id": "1",
    "value": "法定代表人"
  }, {
    "id": "2",
    "value": "负责人"
  }],
  agentPowerList: [{ //委托权限详情
    "id": "1",
    "name": "代为参加庭审、进行辩论"
  }, {
    "id": "2",
    "name": "代进行和解、签订调解协议"
  }, {
    "id": "3",
    "name": "代承认、放弃、变更诉讼请求"
  }, {
    "id": "4",
    "name": "代提起上诉"
  }, {
    "id": "5",
    "name": "代签收法律文书"
  }, {
    "id": "6",
    "name": "代退诉讼费"
  }, {
    "id": "7",
    "name": "代领执行款（须授权委托书特别明确)"
  }],
  certificateTypeConstant: [{ //定义用户证件类型
    "id": "0",
    "value": "身份证"
  }, {
    "id": "1",
    "value": "驾驶证"
  }, {
    "id": "2",
    "value": "外籍在华驾驶证"
  }, {
    "id": "3",
    "value": "军队驾驶证"
  }, {
    "id": "4",
    "value": "律师证"
  }, {
    "id": "5",
    "value": "暂未获取"
  }],
  relation2Applicant: [{ //与上诉人关系（代理人类型为法定时，显示）
    "id": "1",
    "value": "父亲"
  }, {
    "id": "2",
    "value": "母亲"
  }, {
    "id": "3",
    "value": "儿子"
  }, {
    "id": "4",
    "value": "女儿"
  }, {
    "id": "5",
    "value": "配偶"
  }],
  factTypeList: [{ //案由类型
    "id": "1",
    "value": "机动车交通事故责任纠纷"
  }, {
    "id": "2",
    "value": "生命权、健康权、身体权纠纷"
  }, {
    "id": "3",
    "value": "保险人代位求偿权纠纷"
  }],
  lawState: [{ //案件状态
    "id": "1000",
    "value": "立案登记"
  },{
    "id": "1001",
    "value": "立案审批"
  },{
    "id": "1002",
    "value": "分案"
  },{
    "id": "1003",
    "value": "排期"
  },{
    "id": "1004",
    "value": "庭审赔偿计算（办案）"
  },{
    "id": "1005",
    "value": "结案"
  }],
  pictureConstant:{
    bigPictureUrl:"/lawProject/common/image/get/",
    smallPictureUrl:"/lawProject/common/image/getThumbnail/",
    uploadImageUrl:"/lawProject/common/uploadImage",
    cropImageUrl:"/lawProject/common/cropImage",
    uploadImageFileUrl:"/lawProject/common/uploadImageFile",
    getImageFileUrl:"/lawProject/common/getImageFile",
    uploadFileUrl:"/lawProject/common/uploadFile",
    deleteFileUrl:"/lawProject/common/deleteFile",
    getDocumentFileUrl:"/lawProject/common/getDocumentFile",
    upLoadEvidenceFile: "/lawProject/secondinstance/upLoadEvidenceFile"
  },
  //定义流程表数据
  workFlowData:{
    secondStateList:[ //二审状态集合
      {id: '1000', value: '立案登记'},
      {id: '1001', value: '立案审批'},
      {id: '1002', value: '分案'},
      {id: '1003', value: '排期'},
      {id: '1004', value: '办案'},
      {id: '1005', value: '结案'}
    ],
    workFlowData: function () { //定义业务主表
      this.serialNo = ""; //流水号
      this.orgLawNo = ""; //原审案号
      this.orgLawName = ""; //原审法院
      this.reason = ""; //案由
      this.filingDate = ""; //立案登记日期
      this.claims = ""; //诉讼请求
      this.factReason = ""; //事实与理由
      this.contractorDepartment = ""; //承办部门
      this.checkDate = ""; //审批时间
      this.secondLawNo = ""; //二审案号
      this.underlyingAsset = ""; //标的金额
      this.acceptanceFee = ""; //预收受理费
      this.chiefJudgeName = ""; //审判长
      this.clerkName = ""; //书记员
      this.memberOneName = ""; //合议庭成员一
      this.memberTwoName = ""; //合议庭成员二
      this.undertakerName = ""; //承办人
      this.courtName = ""; //法庭名称
      this.courtNum = ""; //庭次
      this.courtDate = ""; //开庭时间
      this.remark = ""; //审批意见
    }
  }
});