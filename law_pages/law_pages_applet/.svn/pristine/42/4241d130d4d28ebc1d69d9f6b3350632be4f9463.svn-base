var caseType = [
  {
    id:"1",
    value:"伤残"
  },
  {
    id: "2",
    value: "死亡"
  },
  {
    id: "3",
    value: "一般损伤"
  }
]

var accidentType=[{
  id:'0',
  value:'机动车与行人或非机动车'
},{
  id: '1',
  value: '机动车之间'
},{
  id: '2',
  value: '单车事故'
}]

var feeTypeList = [{
  "id": "03",
  "value": "医疗费",
  "template": "1",
  "group": '1',
  "remark":"医疗费指已发生的费用、住院期间院外购买的器具、药品等，需有诊断证明、费用清单、医嘱等作证。"
},
{
  "id": "04",
  "value": "后续治疗费",
  "template": "1",
  "group": '2',
  "remark": "最后一次出院医嘱门诊费、手术费。"
}, {
  "id": "07",
  "value": "营养费",
  "template": "2",
  "group": '2',
  "remark": "需有医嘱证明需要加强营养。"
}, {
  "id": "06",
  "value": "住院伙食补助费",
  "template": "2",
  "group": '2',
  "remark": "住院期间伙食补助费用。"
}, {
  "id": "11",
  "value": "住宿费",
  "template": "1",
  "group": '2',
  "remark": "请根据实际发生的住宿费并结合票据填写。"
}, {
  "id": "10",
  "value": "交通费",
  "template": "1",
  "group": '2',
  "remark": "请根据实际发生的交通费并结合票据填写。"
},
{
  "id": "12",
  "value": "残疾赔偿金",
  "template": "5",
  "group": '4',
  "remark": "根据伤残等级、赔偿标准以及受害人年龄自动计算。"
}, {
  "id": "13",
  "value": "残疾辅助器具费",
  "template": "1",
  "group": '4',
  "remark": '残疾辅助器具费按照普通适用器具的合理费用标准计算。'
}
  , {
  "id": "19",
  "value": "处理事故人员误工费",
  "template": "4",
  "group": '9',
  "personArray": [],
  "remark":"收入证明包括劳动合同、社保记录、工资单、完税证明、银行流水等，且需有收入减少的证明。"
}
  , {
  "id": "15",
  "value": "死亡赔偿金",
  "template": "5",
  "group": '5',
  "remark": '根据当事人出生日期、死亡时间计算赔偿年限。'
}, {
  "id": "16",
  "value": "丧葬费",
  "template": "3",
  "group": '5',
  "remark": '根据当地上一年度月均工资乘以六个月。'
}, {
  "id": "14",
  "value": "被抚养人生活费",
  "template": "6",
  "group": '10',
  "dependents": {
    "apply": [],
    "reply": [],
    "claim": []
  },
  "remark":'该项费用为受害人依法承担扶养义务的未成年人或丧失劳动能力又无其他生活来源的成年近亲属，一般包括子女（18岁以下）、父母（父60周岁以上、母55周岁以上），父母的需提供无生活来源证明。'
}
  , {
  "id": "17",
  "value": "精神损害抚慰金",
  "template": "6",
  "group": '6',
  "remark":"根据当地赔偿标准及伤残情况自动计算。"
},
{
  "id": "18",
  "value": "鉴定费",
  "template": "1",
  "group": '3',
  "remark":"请根据实际发生的鉴定费并结合票据填写。"
}, {
  "id": "08",
  "value": "误工费",
  "template": "4",
  "group": '9',
  "remark":"收入证明包括劳动合同、社保记录、工资单、完税证明、银行流水等，且需有收入减少的证明。"
}, {
  "id": "09",
  "value": "护理费",
  "template": "2",
  "group": '9',
  "remark":"仅计算住院时间的护理费，且需有医院证明需要护理；护理人员身份明确的，需有医院证明具体的护理人员身份及护理人员的收入证明。",
  "nursingArray":[
    {
      "title": "住院护理费",
      "type": "1",
      "isFixedIncome": false,
      "incomeEvidence": 2
    },
    {
      "title": "出院护理费",
      "type": "2",
      "isFixedIncome": false,
      "nursingType": 1,
      "incomeEvidence": 2
    }
  ]
},
{
  "id": "40",
  "value": "车辆损失",
  "template": "1",
  "group": "7",
  "remark":"请根据实际发生的车辆损失费用并结合票据填写。"
},
{
  "id": "70",
  "value": "施救费",
  "template": "1",
  "group": "7",
  "remark": "请根据实际发生的施救费用并结合票据填写。"
},
{
  "id": "30",
  "value": "财产损失",
  "template": "1",
  "group": "7",
  "remark": "请根据实际发生的财产损失并结合票据填写。"
},
{
  "id": "60",
  "value": "停车费",
  "template": "1",
  "group": "7",
  "remark": "请根据实际发生的停车费并结合票据填写。"
},
{
  "id": "71",
  "value": "其他项目",
  "template": "1",
  "group": "7",
  "remark": "如有其他损失的，请据实填写，并提供相应证据。"
}]

var workFlowData = function() { 
  this.serialNo = "", 
  this.adjustName = "", 
  this.regulationNo = "", 
  this.respondent = "", 
  this.adjustDate = "", 
  this.lawMoney = "", 
  this.adjustResult = "", 
  this.adjustOrgName = "", 
  this.adjustPointName = "", 
  this.receiveDate = "", 
  this.lawNo = "", 
  this.filingName = "", 
  this.filingDate = "", 
  this.chiefJudgeId = "", 
  this.chiefJudgeName = "", 
  this.clerkId = "", 
  this.clerkName = "", 
  this.memberOneId = "", 
  this.memberOneName = "", 
  this.memberTwoId = "", 
  this.memberTwoName = "", 
  this.undertakerId = "", 
  this.undertakerName = "", 
  this.payType = "", 
  this.applicationProducer = "", 
  this.jurisdictionReason = "", 
  this.acceptanceFee = "", 
  this.isSmallAmount = "", 
  this.courtId = "", 
  this.courtName = "", 
  this.courtNum = "", 
  this.courtDate = "", 
  this.closeCaseType = "", 
  this.addEvidenceNum = "", 
  this.lawOrgName = "", 
  this.lawDeptName = "", 
  this.judgeMoney = "", 
  this.undertakerPhone = "", 
  this.evidenceNum = "" 
}

module.exports = {
  caseType: caseType,
  accidentType: accidentType,
  feeTypeList: feeTypeList,
  workFlowData: workFlowData
}