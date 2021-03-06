'use strict';
var app = angular.module('sbAdminApp');

app.filter('selectedCount', function() {
    return function(arr) {
        return arr.filter(function(v) {
            return v.selected;
        }).length;
    }
});

app.filter('certificatesTypeToText', function() {
    return function(id,data) {
        var result = _.find(data, {
            id: id
        });
        return result ? result.value:""
    }
});

app.controller('mediationCtrl', function(AppraisalConfig,AppraisalService,$scope,PrejudgeService,PrejudgeConfig, toaster, $stateParams, $state, $location, $timeout, $http, $log, $filter, $modal, AdjustService, AdjustConfig, DictionaryConfig, Upload, LoginService,AdminConstant,$rootScope) {
    //案由类型
    $scope.factTypeList = DictionaryConfig.factTypeList;
    //与申请人的关系
    $scope.relationArray = DictionaryConfig.relation2Applicant;
    //代理人身份子类型
    $scope.agentIdentifySubList = DictionaryConfig.agentIdentifySubList;
    //查询调解Service
    $scope.adjustService = AdjustService;
    //查询鉴定Service
    $scope.queryInHandAppraisalInfoService = AppraisalService.queryInHandAppraisalInfo;
    //老道交鉴定对接鉴定点击完成调解是否强制取消
    $scope.oldBusinessAppraisal = AppraisalService.oldBusinessAppraisal;
    //查询认定书编号
    $scope.queryPoliceBySerialNoService = AdjustService.queryPoliceBySerialNo;
    //费用类型
    $scope.feeTypeList = DictionaryConfig.feeTypeList;
    //证件类型
    $scope.certificateType = DictionaryConfig.certificateTypeConstant;

    //二维码拼接路径
    $scope.codeFilePath = AdjustConfig.adjustConStant.codeFileUrl;

    $scope.imageAddress = AdjustConfig.pictureConstant.smallPictureUrl;
    $rootScope.buttSelf = $stateParams.isSelf;
    $scope.trafficPolice = $stateParams.isSelf;
    $scope.claiminfoInfoNew = {};

    
    var level = {
        "warn": "warn",
        "error": "error",
        "success": "success"
    }
    var title = {
        "error": "错误",
        "success": "成功"
    }

    //内部常量
    $scope.CONSTANT = {
        "messageApplicantNameNull": "申请人姓名不能为空",
        "messageRespondentNameNull": "被申请人姓名不能为空",
        "messageIdTypeNull": "证件类型不能为空",
        "messageIdNoNull": "证件号码不能为空",
        "messageBirthdayNull":"出生日期不能为空",
        "messageIdentityFormatError": "身份证号格式不正确",
        "messageAgentTypeNull": "代理类型不能为空",
        "messageBirthDayNull": "出生日期不能为空",
        "messageNationNull": "民族不能为空",
        "messageTelephoneNull": "电话号码不能为空",
        "messageTelephoneFormatError": "电话号码格式不正确",
        "messageAgentTelephoneNull": "代理人电话号码不能为空",
        "messageAgentTelephoneFormatError": "代理人电话号码格式不正确",
        "messagePlateNoNull":"被申请人车牌号不能为空",
        "messageEmailFormatError": "邮箱格式不正确",
        "messageDomicileNull": "户籍所在地不能为空",
        "messageSendAddressNull": "送达地址不能为空",
        "messageIsEmailNull": "请选择是否电子送达",
        "messageEmailNull": "电子送达地址不能为空",
        "messageOrgNameNull": "企业名称不能为空",
        "messageLegalNameNull": "代表人姓名不能为空",
        "messageJobNull": "公司职务不能为空",
        "messageOrgCodeNull": "组织代码不能为空",
        "messageRegisterCodeNull": "代表人姓名不能为空",
        "messageAgentNameNull": "代理人姓名不能为空",
        "messageAgentMaxError": "最多添加2位代理人",
        "messageUnitNameNull": "单位名称不能为空",
        "messageResidenceNull": "居住地不能为空",
        "messageSexNull": "性别不能为空",
        "messageReasonNull": "事故事实及责任不能为空",
        "messageEvidenceNull": "请您添加证据",
        "messageBackend": "后台忙,请稍候再试",
        "messageEvidenceNameNull": "证据名称不能为空",
        "messageEvidenceDescriptionNull": "证据描述不能为空",
        "messageEvidenceClassifyNull": "所属分类不能为空",
        "messageRegionNameError":"赔偿地不能为空!",
        "messageDeathDateError":"定残/死亡日期不能为空!",
        "messageCompensateRateError":"伤残赔偿系数不能为空!",
        "messageAdjustDateError":"调解日期不能为空!",
        "messageAdjustResultError":"调解结果不能为空!",
        "messageAtleastOneApplicant": "至少有一个申请人",
        "messageAtleastOneNoApplicant": "至少有一个被申请人",
        "messageSaveSuccess":"案件保存成功",
        "messageRespondentError":"请选择责任人",
        "messageLawMoneyDetailError":"请填写具体损失金额",
        "messageRespondentPlateNo":"请填写责任人车牌号",
        "messageForceCompanyError":"请选择责任人交强险投保保险公司",
        "messageBusinessError":"请选择责任人商业险投保保险公司",
        "appraisalError":"鉴定环节没有完成，不能调解完成",
        "netWorkError":"未生成二维码",
        "dutyRatio": "责任比率不可大于100%",
        "isLoading": "正在提交，请稍后",
        "messagepPlateNo": "车牌号有误，请重新填写",
    }
    // common object share by stepxx controller
    $scope.co = {
        mainFlow: true,
        defaultImg: "views/images/_r2_c2.png",
        defaultImg2: "views/images/7.png",
        defaultImg3: "views/images/6.png",
        stepArray: [{
            id: "2",
            value: "被申请人"
        }, {
            id: "3",
            value: "事实与理由"
        }, {
            id: "4",
            value: "添加证据"
        }, {
            id: "5",
            value: "调解信息"
        }, {
            id: "6",
            value: "调解协议"
        }],
        lblApplicant: "申请人",
        lblRespondent: "被申请人",
        isAdjust: true,
        isRiskTypes: false, //是否选择投保险种
        removeApplicant: function(applicant) {
            if(confirm("确认删除么?")){
                if ($scope.adjust.applicantArray.filter(function(v){return v.personType==applicant.personType;}).length > 1) {
                    var index = $scope.adjust.applicantArray.indexOf(applicant);
                    if (applicant.id) {
                        $scope.adjustService.removeApplicant({
                            "id": applicant.id
                        }).success(function(result) {
                            if (result.code == AdjustConfig.commonConStant.SUCCESS) {
                                $scope.adjust.applicantArray.splice(index, 1);
                            } else if (result.code == AdjustConfig.commonConStant.FAILURE) {
                                $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageApplicantRemoveError);
                            }
                        });
                    } else {
                        $scope.adjust.applicantArray.splice(index, 1)
                    }
                } else {
                    var message= "";
                    if(applicant.personType==0){
                        message = $scope.CONSTANT.messageAtleastOneApplicant;
                    }else{
                        message = $scope.CONSTANT.messageAtleastOneNoApplicant;
                    }
                    $rootScope.toaster(level.error, title.error, message);
                }
            }
        },
        removeAgent: function(applicant, agent) {
            var index = applicant.agentArray.indexOf(agent);
            if( ("您确认删除么？")){
                if (agent.id) {
                    $scope.adjustService.removeAgent({
                        "id": agent.id
                    }).success(function(result) {
                        if (result.code == AdjustConfig.commonConStant.SUCCESS) {
                            applicant.agentArray.splice(index, 1);
                        } else if (result.code == AdjustConfig.commonConStant.FAILURE) {
                            $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageAgentRemoveError);
                        }
                    });
                } else {
                    applicant.agentArray.splice(index, 1);
                }
            }
        },
        generateDocument: function() {

            $timeout(function() {
                function documentBuild(text) {
                    var bodyObj = '<body class="b1 b2">' + text + '</body>';
                    return bodyObj;
                }

                var result = $('#mediationDocument').html();
                result = documentBuild(result);
                var applicant = $scope.adjust.applicantArray.filter(function(e) {
                    return e.personType == 0 ;
                });
                var applicantName = applicant[0].idType =='0' ? applicant[0].personName : applicant[0].orgName;
                AdjustService.buildWord({
                    serialNo: $scope.adjust.serialNo,
                    type: DictionaryConfig.caseVerifyResultCode[0].code,
                    wordType:"0",
                    fileName: "调解协议（"+applicantName+"）",
                    content: result
                }).success(function(result) {
                    var data = result.result;
                    $log.info("shenwei======================");
                    $log.info(data);
                    if (result.code == AdjustConfig.commonConStant.FAILURE) {
                        $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageBackend);
                    }
                })
            },1000);

        },calculateMoney : function(){
            if($scope.adjust.lawMoney){
                $scope.moneyFeeList = DictionaryConfig.moneyFeeList;
                var currentMoney = $scope.adjust.lawMoney;
                var moneyFee = $scope.moneyFeeList.filter(function(v) {
                    return currentMoney >= v.startMoney*10000 && currentMoney < v.endMoney*10000;
                });
                $scope.acceptanceFee =$scope.adjust.lawMoney * moneyFee[0].feeMoney + moneyFee[0].plusMoney;
                //简易程序除以2
                $scope.acceptanceFee = $scope.acceptanceFee/2;
                $scope.acceptanceFee =  parseFloat($scope.acceptanceFee).toFixed(2);
            }
        }
    };

    function parseISO8601(dateStringInRange) {
        var isoExp = /^\s*(\d{4})-(\d\d)-(\d\d) (\d{2}):(\d{2}):(\d{2})\s*$/,
            date = new Date(NaN), month,
            parts = isoExp.exec(dateStringInRange);

        if(parts) {
            month = +parts[2];
            date.setFullYear(parts[1], month - 1, parts[3]);
            if(month != date.getMonth() + 1) {
                date.setTime(NaN);
            }
        }
        return date;
    }

    function filterQuery(adjust) {
        if (adjust.applicantArray) {
            var hashIndex = 1;
            var applicantSize = 1;
            var appelleeSize = 1;

            var respondentArray = adjust.applicantArray.filter(function(v){ return v.personType == 1 })
            if(!respondentArray || respondentArray.length == 0){
                adjust.applicantArray.push(new $scope.co.Applicant(1))
            }
            adjust.applicantArray.forEach(function(v) {
                if (v.birthDay) v.birthDay = parseISO8601(v.birthDay);//new Date(v.birthDay);
                if (v.riskTypes) v.riskTypes = JSON.parse(v.riskTypes);
                if(!v.isDeath) {
                    v.isDeath = '2';
                }

                if (v.personType == 0) v.hashName = applicantSize++;
                else if (v.personType == 1) v.hashName = appelleeSize++;
                if (!v.idFacePicture) v.idFacePicture = $scope.co.defaultImg;
                if (!v.idBackPicture) v.idBackPicture = $scope.co.defaultImg;
                if (!v.businessLicensePicture) v.businessLicensePicture = $scope.co.defaultImg;
                if (!v.legalPersonPicture) v.legalPersonPicture = $scope.co.defaultImg;
                //绝对免赔率集合
                v.absDeductibleList = angular.copy(DictionaryConfig.absDeductibleList);
                //绝对免赔率
                if(v.absDeductibleStr){
                    v.absDeductibleStr.split(",").forEach(function(k){
                        var absDeductibleSel = _.find(v.absDeductibleList, {id: k}) || {};
                        absDeductibleSel.selected = true;
                    });
                }
                //交强险承保公司集合
                //v.insuranceForceCompanyList = angular.copy(DictionaryConfig.insuranceList);
                //商业险承保公司集合
                //v.insuranceBusinessCompanyList = angular.copy(DictionaryConfig.insuranceList);
                if (v.agentArray) {
                    var agentIndex = 1;
                    v.agentArray.forEach(function(m) {
                        if (m.birthDay) m.birthDay = parseISO8601(m.birthDay)//new Date(m.birthDay);
                        if(m.agentIdentityItem)m.agentIdentityItem =m.agentIdentityItem.toString();
                        if(m.relation)m.relation = m.relation.toString();
                        if(!m.idFront) m.idFront = $scope.co.defaultImg;
                        if(!m.idBack) m.idBack = $scope.co.defaultImg;
                        if(!m.entrustFile) m.entrustFile = $scope.co.defaultImg;
                        if(!m.relationSupport) m.relationSupport = $scope.co.defaultImg;
                        if(!m.feeCertificate) m.feeCertificate = $scope.co.defaultImg;
                        m.hashIndex = hashIndex + "." + agentIndex;
                        m.hashName = agentIndex++;
                    })
                } else v.agentArray = [];
                v.hashIndex = hashIndex++;
            })
            if (adjust.evidenceArray && adjust.evidenceArray.length) {
                adjust.evidenceArray.forEach(function(v) {
                    if (v.classify) {
                        v.chooseTagArray = v.classify.split(",").map(function(v) {
                            return _.find($scope.feeTypeList, {
                                id: v
                            });
                        });
                    }
                });
                $scope.co.startShow = true;
            }
        }
        if (adjust.compensateStandard && typeof adjust.compensateStandard == 'string') adjust.compensateStandard = JSON.parse(adjust.compensateStandard);
        if (adjust.compensateTable && typeof adjust.compensateTable == 'string') adjust.compensateTable = JSON.parse(adjust.compensateTable);
        if (adjust.feeDetail && typeof adjust.feeDetail == 'string') adjust.feeDetail = JSON.parse(adjust.feeDetail);
        if (adjust.deathDate) adjust.deathDate = parseISO8601(adjust.deathDate);//new Date(adjust.deathDate);
        if (adjust.adjustDate) adjust.adjustDate = parseISO8601(adjust.adjustDate);//new Date(adjust.adjustDate);
        if (adjust.payDate) adjust.payDate =  parseISO8601(adjust.payDate);//new Date(adjust.payDate);
        if ($scope.adjust.lawMoney) $scope.adjust.willPayTotal = $scope.adjust.lawMoney - $scope.adjust.paidTotal;
        //保险外金额总和
        if($scope.adjust.feeDetail){
            var extraTotalLawMoney = 0;
            if(typeof $scope.adjust.feeDetail == 'string') $scope.adjust.feeDetail = JSON.parse($scope.adjust.feeDetail);
            $scope.adjust.feeDetail.forEach(function (val){
                if(val.extraAmount){
                    extraTotalLawMoney += parseFloat(val.extraAmount);
                }
            });
            $scope.adjust.extraTotalLawMoney = extraTotalLawMoney;
        }




    }

    var viewStep6Url = function(){
        if($scope.adjust.lawOrgId){
            AdjustService.getForwardUrl({
                orgId:$scope.adjust.lawOrgId
            }).success(function(res){
                //获取当前时间
                $scope.co.createDocumentDate = conversionDate(new Date());

                var currentApplicants = $scope.adjust.applicantArray.filter(function(v) {
                    return v.personType == 0 && v.isDeath != '1';
                }).map(function(v) {
                    if (v.idType == 0) return v.personName;
                    if (v.idType != 0) return v.orgName;
                }).join('、');

                var currentBg = $scope.adjust.applicantArray.filter(function(v) {
                    return v.personType == 1 ;
                }).map(function(v) {
                    if (v.idType == 0) return v.personName;
                    if (v.idType != 0) return v.orgName;
                }).join('、');

                var currentFee =  $scope.adjust.feeDetail.filter(function(v){
                    return v.isChecked == true;
                }).map(function(v){
                    return v.value+ v.applyAmount +"元";
                }).join('、');

                if(res.result && res.result.adjustmentAgreementDoc){
                    $scope.co.text = "当事人" + currentApplicants + "因交通事故损失的"  +currentFee+"，合计"+$scope.adjust.applyTotal+"元，要求当事人"+ currentBg + "赔偿。";
                    $scope.co.step6Url = res.result.adjustmentAgreementDoc;
                    $scope.co.currentDate  = getDate(new Date());
                } else{
                    $scope.co.text = "申请人" + currentApplicants + "因交通事故损失的"  +currentFee+"，合计"+$scope.adjust.applyTotal+"元，要求申请人"+ currentBg + "赔偿。";
                    $scope.co.step6Url = 'step6';
                }
            })
        }
    };


    function getDate (date) {
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        m = m < 10 ? '0' + m : m;
        var d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        return y + '-' + m + '-' + d;
    };


    //将日期格式改为大写
    function conversionDate(date) {
        //获取当前时间年月日
        var year = date.getFullYear();
        var month = date.getMonth()+1;
        var day = date.getDate();
        var mapDate = { //创建数字对应的大写对象
            time0: '〇',
            time1: '一',
            time2: '二',
            time3: '三',
            time4: '四',
            time5: '五',
            time6: '六',
            time7: '七',
            time8: '八',
            time9: '九',
            time10: '十'
        };
        //将每个数字转换成大写
        function getNumberUp(numberArr, type) {
            var arr = [];
            numberArr.forEach(function (v, index) {
                if(type != 'year' && index == '1') {
                    arr.push('十');
                }
                arr.push(mapDate['time'+v]);
            })
            return arr;
        }
        return (getNumberUp(year.toString().split(''), 'year').join('')+'年'+getNumberUp(month.toString().split(''), 'month').join('')+'月'+getNumberUp(day.toString().split(''), 'day').join('')+'日')
    }


    /*if ($stateParams.isSelf) {
        $scope.adjustService.simulationLogin().success(function(result) {
            if (result.code == AdjustConfig.commonConStant.SUCCESS) {
                query();
            }
        })
    }else{
        query();
    }*/

    //function query() {
        //查询调解单
        if ($stateParams.id) {
            $scope.adjustService.queryAdjust({
                "id": $stateParams.id
            }).success(function(result) {
                var data = result.result;
                if (result.code == AdjustConfig.commonConStant.SUCCESS) {
                    $scope.adjust = data;
                    //当是手机传来的案件，此属性时json字符串，需要转成数组
                    if($scope.adjust.compensateTable && typeof $scope.adjust.compensateTable == 'string') $scope.adjust.compensateTable = JSON.parse($scope.adjust.compensateTable);
                    $scope.adjust.standardYear? '' : $scope.adjust.standardYear = '2018';
                    $scope.adjust.compensateRateDeath = 100;
                    if(!$scope.adjust.step) $scope.adjust.step = 1;
                    filterQuery(data);
                    $scope.$broadcast('queryAdjust');
                    viewStep6Url();
                    //查询人伤关联信息
                    queryInjureApplyerInfo();
                    //查询公安信息
                    queryPoliceInfo();

                    $scope.evidenceTagChanged();
                } else {
                    $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageBackend);
                }
            })
        }
    //}

    function queryPoliceInfo() {
        $scope.queryPoliceBySerialNoService({"serialNo":$scope.adjust.serialNo}).success(function(res) {
            if (res.code == AdjustConfig.commonConStant.SUCCESS) {
                if(res.result){
                    //公安信息
                    $scope.adjust.police = new Police(res.result);

                    $scope.adjust.police.cityName = $scope.adjust.police.cityCode && _.find(AdminConstant.administrationRegions,{regionCode:$scope.adjust.police.cityCode}).fullName;
                }else{
                    $scope.adjust.police = new Police();
                }
            } else if (res.code == AdjustConfig.commonConStant.FAILURE) {
                $rootScope.toaster('error', '错误',res.message );
            }
        });

    }

    function queryInjureApplyerInfo(){
        //根据流水号查询关联信息
        $scope.queryInjureApplyerInfoService = AdjustService.queryInjureApplyerInfo;
        $scope.queryInjureApplyerInfoService({
            serialNo:$scope.adjust.serialNo
        }).success(function(result) {
            $scope.injureApplyerInfoList = result.result;
        });

    }

    $scope.change_options =function(e,t,num){
        if (num==1) {
            if (t==0) {
                e.idFacePicture ="views/images/7.png";
                e.idBackPicture ="views/images/6.png";
            }else{
                e.idFacePicture ="views/images/_r2_c2.png";
                e.idBackPicture ="views/images/_r2_c2.png";
            }
        }else if(num==2){
            if (t==0) {
                e.idFront ="views/images/7.png";
                e.idBack ="views/images/6.png";
            }else{
                e.idFront ="views/images/_r2_c2.png";
                e.idBack ="views/images/_r2_c2.png";
            }
        }else if (num==3) {
            if (t==0) {
                e.idFront ="views/images/7.png";
                e.idBack ="views/images/6.png";
            }else{
                e.idFront ="views/images/_r2_c2.png";
                e.idBack ="views/images/_r2_c2.png";
            }
        }

    };
    $scope.co.Applicant = function(personType, idType, legalType) {
        this.personType = personType;
        this.sex = "0";
        this.isDeath = '2';
        this.legalType = legalType? legalType : '1';
        this.enterpriseType = '1';
        this.certificatesType = "0";
        this.idType = idType? idType : "0";
        
       
        this.idFacePicture =$scope.co.defaultImg2;
        this.idBackPicture = $scope.co.defaultImg3; 
        this.businessLicensePicture = $scope.co.defaultImg;
        this.legalPersonPicture = $scope.co.defaultImg;
        var hashIndex = $scope.adjust.applicantArray.length + 1;
        var hashName = $scope.adjust.applicantArray.filter(function(v) {
                return v.personType == personType;
            }).length + 1;
        this.hashIndex = hashIndex;
        this.hashName = hashName;
        this.agentArray = [];
        this.isEmail = '0';
        //绝对免赔率集合
        this.absDeductibleList = angular.copy(DictionaryConfig.absDeductibleList);
        //交强险承保公司集合
        //this.insuranceForceCompanyList = angular.copy(DictionaryConfig.insuranceList);
        //商业险承保公司集合
        //this.insuranceBusinessCompanyList = angular.copy(DictionaryConfig.insuranceList);
    };

    //代理人类
    $scope.co.Agent = function(hashIndex, hashName) {
        this.agentType = "0";
        this.mainContacts = false;
        this.entrustPowerDetail = "";
        this.agentIdentity = "0";
        this.certificatesType = "4";
        this.entrustPower = "0";
        this.relation2Applicant = "";
        this.hashIndex = hashIndex;
        this.hashName = hashName;
        this.idFront = $scope.co.defaultImg2;
        this.idBack = $scope.co.defaultImg3;
        this.lawyerCard = $scope.co.defaultImg;
        this.relationSupport = $scope.co.defaultImg;
        this.entrustFile = $scope.co.defaultImg;
        this.letterFile = $scope.co.defaultImg;
        this.feeCertificate = $scope.co.defaultImg;
    };

    $scope.adjust = {
        "reason": "1",
        "household": "1",
        "paidTotal": "0",
        "feeDetail": angular.copy(DictionaryConfig.feeTypeList).filter(function(v){
            return v.type == '1';
        }),
        "compensateTable": [],
        "compensateStandard": {},
        "applicantArray": [],
        "evidenceArray": [],
        "step": "1" //当前步骤
    };

    $scope.dutyRatio = {};   //存储责任比率对象

    $scope.adjust.applicantArray.push(new $scope.co.Applicant(0));
    $scope.adjust.applicantArray.push(new $scope.co.Applicant(1), new $scope.co.Applicant(1, 1, 2));

    $scope.userDepart = {};

    function user2Child() {
        if (!$scope.adjust.id) {
            if(LoginService.user.sysUser.userDepartList){
                $scope.userDepart = LoginService.user.sysUser.userDepartList[LoginService.user.sysUser.currentOrg];
            }
            $scope.adjust.adjustOrgName = $scope.userDepart.orgName
            $scope.adjust.adjustOrgCode = $scope.userDepart.orgId
            $scope.adjust.adjustPointName = $scope.userDepart.deptName
            $scope.adjust.adjustPointCode = $scope.userDepart.deptId
            $scope.adjust.isSendDocument = $scope.userDepart.isSendDocument
        } else {
            $scope.userDepart.orgId = $scope.adjust.adjustOrgCode;
            $scope.userDepart.orgName = $scope.adjust.adjustOrgName;
            $scope.userDepart.deptName = $scope.adjust.adjustPointName;
        }
    }

    $scope.$on('user2Child', function() {
        user2Child();
    });
    if (LoginService.user.userPermissions) {
        user2Child();
    }

    function filterParam(adjust) {
        adjust.applicantArray.forEach(function(v) {
            if (v.birthDay) v.birthDay = $filter('date')(v.birthDay, 'yyyy-MM-dd HH:mm:ss');
            if (v.riskTypes) v.riskTypes = JSON.stringify(v.riskTypes);

            var absDeductibleStr = "";
            var absDeductibleStrFlag = true;
            v.absDeductibleList.forEach(function(val){
                if(val.selected){
                    if(!absDeductibleStrFlag){
                        absDeductibleStr += ",";
                    }
                    absDeductibleStr += val.id
                    absDeductibleStrFlag = false;
                }
            });
            v.absDeductibleStr = absDeductibleStr;
            v.agentArray.forEach(function(m) {
                if (m.birthDay) m.birthDay = $filter('date')(m.birthDay, 'yyyy-MM-dd HH:mm:ss');
            })
        });
        if (adjust.compensateStandard && adjust.compensateStandard instanceof Object) adjust.compensateStandard = JSON.stringify(adjust.compensateStandard);
        if (adjust.compensateTable && adjust.compensateTable instanceof Object) adjust.compensateTable = JSON.stringify(adjust.compensateTable);
        if (adjust.feeDetail && adjust.feeDetail instanceof Object) adjust.feeDetail = JSON.stringify(adjust.feeDetail);
        if (adjust.deathDate) adjust.deathDate = $filter('date')(adjust.deathDate, 'yyyy-MM-dd HH:mm:ss');
        if (adjust.payDate) adjust.payDate = $filter('date')(adjust.payDate, 'yyyy-MM-dd HH:mm:ss');
        if (adjust.adjustDate) adjust.adjustDate = $filter('date')(adjust.adjustDate, 'yyyy-MM-dd HH:mm:ss');
    }

    $scope.gotoStep6 = function(){
        $state.go('dashboard.mediation.step6', {"name": $scope.co.step6Url});
    };

    //点击相应步骤跳转页面
    $scope.handleSkipStep = function (step) {
        step = parseInt(step);
        if(step == $scope.co.step || step > $scope.adjust.step) return; //禁止点击当前步骤或未填写的步骤
        //跳转到相应页面
        switch(step) {
            case 1:
                $state.go('dashboard.mediation.step12', {
                    step: 1
                });
                break;
            case 2:
                $state.go('dashboard.mediation.step12', {
                    step: 2
                });
                break;
            case 3:
                $state.go('dashboard.mediation.step3');
                break;
            case 4:
                $state.go('dashboard.mediation.step4');
                break;
            case 5:
                $state.go('dashboard.mediation.step5');
                break;
            case 6:
                $state.go('dashboard.mediation.step6', {"name": $scope.co.step6Url});
                break;
        }
    };

    //下一步操作
    $scope.nextStep = function() {
        if (($scope.co.step == 1 || $scope.co.step == 2) && validateStep12()) {
            $scope.save(function() {
                if ($scope.co.step == 1)
                    $state.go('dashboard.mediation.step12', {
                        step: 2
                    });
                else $state.go('dashboard.mediation.step3');
            });
        } else if ($scope.co.step == 3 && validateStep3()) {
            $scope.save(function() {
                $state.go('dashboard.mediation.step4');
            });
        } else if ($scope.co.step == 4 && validateStep4()) {
            var respondents = $scope.adjust.applicantArray.filter(function(e) {
                return e.personType == 1 && (e.idType == '0' || e.idType == '2' || e.idType == '1') && e.riskTypes;
            });

            var tzFlag = true;
            //车牌号必填
            /*if(respondents){
                for(var i = 0; i<respondents.length; i++){
                    var v = respondents[i];
                    if (v.isVehicle == "1") {
                        if(!v.plateNo){
                            tzFlag = false;
                            $rootScope.toaster("error", "错误", "请填写责任人车牌号!");
                            return;
                        }
                    }
                }
            }*/
            //跳转标记成功
            if(tzFlag){
                $scope.save(function() {
                    $state.go('dashboard.mediation.step5');
                });
            }
        } else if ($scope.co.step == 5 && validateStep5()) {

            var currentApplicants = $scope.adjust.applicantArray.filter(function(v) {
                return v.personType == 0 && v.isDeath != '1';
            }).map(function(v) {
                if (v.idType == 0) return v.personName;
                if (v.idType != 0) return v.orgName;
            }).join('、');

            var currentBg = $scope.adjust.applicantArray.filter(function(v) {
                return v.personType == 1;
            }).map(function(v) {
                if (v.idType == 0) return v.personName;
                if (v.idType != 0) return v.orgName;
            }).join('、');

            var currentFee =  $scope.adjust.feeDetail.filter(function(v){
                return v.isChecked == true;
            }).map(function(v){
                return v.value+ v.applyAmount +"元";
            }).join('、');

            $scope.co.text = "当事人" + currentApplicants + "因交通事故损失的"  +currentFee+"，合计"+$scope.adjust.applyTotal+"元，要求当事人"+ currentBg + "赔偿。";
            $scope.co.currentDate  = getDate(new Date());

            $scope.save(function() {
                $scope.co.generateDocument();
                $scope.gotoStep6();

                $timeout(function() {
                    //调解笔录
                    if($scope.adjust.adjustResult == '0' || $scope.adjust.adjustResult == '4' || $scope.adjust.adjustResult == '1') {
                        //生成调解笔录
                        AdjustService.buildMediateRecord({
                            serialNo: $scope.adjust.serialNo,
                            moneyFee: $scope.acceptanceFee
                        }).success(function(result) {
                            var data = result.result;
                            console.log(data)
                            if (result.code == AdjustConfig.commonConStant.FAILURE) {
                                $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageBackend);
                            }
                        });
                    }
                    if($scope.adjust.adjustResult == '0'){
                        //司法确认,生成司法确认申请书
                        AdjustService.buildJudicialApply({
                            serialNo: $scope.adjust.serialNo,
                            resultRemark : $scope.adjust.adjustResultRemark
                        }).success(function(result) {
                            if (result.code == AdjustConfig.commonConStant.FAILURE) {
                                $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageBackend);
                            }
                        })
                    }else if($scope.adjust.adjustResult == '4'){
                        //达成调解并申请调解书
                        $scope.co.calculateMoney();
                        //生成调解起诉状
                        AdjustService.buildMediateIndictment({
                            serialNo: $scope.adjust.serialNo
                        }).success(function(result) {
                            var data = result.result;
                            if (result.code == AdjustConfig.commonConStant.FAILURE) {
                                $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageBackend);
                            }
                        });
                    }
                },10);


            }, function() {
                $scope.co.calculate();
            });
        }
    };

    //上一步操作
    $scope.preStep = function() {
        if ($scope.co.step == 2) {
            $state.go('dashboard.mediation.step12', {
                step: 1
            });
        } else if ($scope.co.step == 3) {
            $state.go('dashboard.mediation.step12', {
                step: 2
            });
        } else if ($scope.co.step == 4) {
            $state.go('dashboard.mediation.step3');
        } else if ($scope.co.step == 5) {
            $state.go('dashboard.mediation.step4');
        } else if ($scope.co.step == 6) {
            $state.go('dashboard.mediation.step5');
        }
    };

    $scope.showRespondentFilter = function(e) {  //在申请人与被申请人中找出被申请人
        var temp = e.responsibleRate ? e.responsibleRate != -1 : e.responsibleRate == 0 ? true : false;
        return e.personType == 1 && (e.idType == '0' || e.idType == '2' || (e.idType == '1' && e.enterpriseType != '1')) && temp;
    };
    
    //保存操作
    $scope.save = function(goState, preCond,insert,submit) {
    //alert("dsssdsdsssd"+goState+"======="+ preCond+"============"+insert);
        //当是第五步时  判断责任比率
        if(window.location.href.indexOf('step5') != -1) {
            //重置责任比例对象
            $scope.dutyRatio = {};
            //将每个责任人比率存入对象
            _.each($scope.adjust.applicantArray, function(obj, i) {
                if($scope.showRespondentFilter(obj) && obj.responsibleRate) {
                    $scope.dutyRatio[obj.personName+i] = obj.responsibleRate
                }
            });
            var total = 0;
            _.each($scope.dutyRatio, function (v,k) {
                total = total + parseInt(v);
            });
            if(total > 100) {
                $rootScope.toaster(level.error, title.error, $scope.CONSTANT.dutyRatio);
                return;
            }
            /*//判断是否选择保险协议
             if(!$scope.co.isRiskTypes) {
             $rootScope.toaster(level.error, title.error, "请选择投保险种");
             return;
             }*/
        }

        var saveFlag = goState;
        var isGoStep2 = ''
        if(goState && goState!='保存' && goState!='鉴定'){
            isGoStep2 = true
        }else{
            isGoStep2 = false
        }
        goState = goState || function() {};
        preCond = preCond || function() {};
        console.log($scope.adjust)

        /*//点击下一步时，step+1
         if(isGoStep2 && $scope.adjust.step < 6) $scope.adjust.step = parseInt($scope.adjust.step)+1;
         //当前步骤大于数据库中step时，赋值当前步骤
         if($scope.co.step > $scope.adjust.step) {
         $scope.adjust.step = $scope.co.step
         }*/
        if(isGoStep2 && $scope.co.step+1 > $scope.adjust.step) $scope.adjust.step = $scope.co.step + 1;

        var adjust = angular.copy($scope.adjust), url = $location.url();

        filterParam(adjust);
        var adjustService = '';
        if($stateParams.isSelf && submit){
            adjustService = $scope.adjustService.adjustComplete(adjust);
        }else{
            adjustService = $scope.adjustService.saveAdjust(adjust);
        }

        adjustService.success(function(result) {
            if (result.code == AdjustConfig.commonConStant.SUCCESS) {
                if((!saveFlag && saveFlag != 0) || saveFlag == '保存'){
                    $rootScope.toaster(level.success, title.success, $scope.CONSTANT.messageSaveSuccess);
                }
                if(url.indexOf("mediation//") > -1 ) {
                    if(isGoStep2){
                        $location.url('/dashboard/mediation/'+result.result.id+'/'+$stateParams.isSelf+'/step12/2');
                    } else{
                        $location.url('/dashboard/mediation/'+result.result.id+'/'+$stateParams.isSelf+'/step12/1');//防止刷新丢失数
                    }
                    $scope.mediateCode(result.result);
                    return;
                }
                //赋值返回值
                $scope.adjust.id = result.result.id;
                $scope.adjust.serialNo = result.result.serialNo;
                $scope.adjust.state = result.result.state;
                $scope.adjust.regulationNo = result.result.regulationNo;
                $scope.adjust.lawOrgId = result.result.lawOrgId;
                $scope.adjust.compensateRateDeath = 100;

                $scope.adjust.applicantArray.forEach(function(v, i) {
                    var applyer = result.result.jyApplyerResultVOList[i];


                    v.id = applyer.id;
                    if (v.agentArray) {
                        v.agentArray.forEach(function(m, j) {
                            m.id = applyer.jyAgentInfoList[j].id;
                        })
                    }
                })
                $scope.adjust.evidenceArray.forEach(function(v, i) {
                    v.id = result.result.jyEvidenceInfoVOList[i].id;
                });

                if(typeof $scope.adjust.feeDetail == 'string') $scope.adjust.feeDetail = JSON.parse($scope.adjust.feeDetail);
                $scope.adjust.feeDetail.forEach(function(fee){
                    if(!fee.applyAmount){
                        fee.applyAmount = 0;
                    }
                    if(!fee.claimAmount){
                        fee.claimAmount = 0;
                    }
                    if(!fee.extraAmount){
                        fee.extraAmount = 0;
                    }
                    fee.claimAndExtraAmount = parseFloat(fee.extraAmount) + parseFloat(fee.claimAmount);
                    fee.claimAndExtraAmount = fee.claimAndExtraAmount.toFixed(2);
                });

                
                if(goState!='保存' && goState!='鉴定'){
                    preCond();
                    goState();
                }
                //查询跳转路径
                if(!$scope.co.step6Url){
                    viewStep6Url();
                }

                if(insert){
                    //插入流程表
                    $scope.insertWorkFlow();
                }
                if((window.location.href.indexOf('step4') != -1 || window.location.href.indexOf('step5') != -1  || window.location.href.indexOf('step6') != -1) && $scope.adjust.isSendAppraisal == 0 && saveFlag == '鉴定') {
                    $scope.sendAppraisal();
                }
            } else {
                $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageBackend);
            }
        })
    };
   
   
    //对接鉴定平台是否取消鉴定
    function isFinish(){
        //查询法院是否对接了鉴定系统
        var loginAccount = LoginService.user.sysUser.loginAccount
        var userType = LoginService.user.sysUser.userType
        var data = {
            serialCode: $scope.adjust.serialNo, //流水号
            loginAccount: loginAccount,
            userType: userType,
            cancelAppraisal: 1
        }
        $scope.prejudgeService.identification(data).success(function (result) {
            if (result.code == PrejudgeConfig.commonConstant.SUCCESS) {
                if (result.result.errorCode == PrejudgeConfig.serviceConstant.SUC_JIANDING) {
                    $scope.submitAdjust();
                }else{
                    $rootScope.toaster("error", "提示", result.result.errorMessage);
                }
            }else {
                $rootScope.toaster("error", "错误", result.message);
            }
        })
    }

    //没有对接鉴定平台的是否强制取消鉴定
    function isFinishOld(){
        //查询法院是否对接了鉴定系统
        //var loginAccount = LoginService.user.sysUser.loginAccount
        var userType = LoginService.user.sysUser.userType
        var data = {
            serialCode: $scope.adjust.serialNo, //流水号
            //loginAccount: loginAccount,
            userType: userType,
            cancelAppraisal: 1
        }
        $scope.oldBusinessAppraisal(data).success(function (result) {
            if (result.code == PrejudgeConfig.commonConstant.SUCCESS) {
                $scope.submitAdjust();
            }else {
                $rootScope.toaster("error", "错误", result.message);
            }
        })
    }

//是否对接鉴定平台方法封装
function isSendtrueOrFalse(isSendAppraisal){
    if(($scope.adjust.isSendAppraisal == 2 && $scope.adjust.isAppraisalFinish == 0) || ($scope.adjust.oldIsSendAppraisal == 2 && $scope.adjust.oldIsAppraisalFinish == 0)){ //已提交未完成
        $rootScope.toaster("warn", "提示", "有已提交，未完成的鉴定，不能完成调解");
    }else if(($scope.adjust.isSendAppraisal == 1 && $scope.adjust.isAppraisalFinish == 0) || ($scope.adjust.oldIsSendAppraisal == 1 && $scope.adjust.oldIsAppraisalFinish == 0)){ //已发起未提交
        if(confirm("有一个未提交的鉴定，是否强制完成调解？")){
           //是否发起鉴定
          isSendAppraisal==1?isFinish():isFinishOld() 
        }
    }else{
        $scope.submitAdjust();
    }
  }

    //提交调解信息 TODO
    var isLoading = false;  //表示是否正在提交数据
    $scope.finishTipFn = function () {
        //法院开启了权限LoginService.user.sysUser.userDepartList[LoginService.user.sysUser.currentOrg]
        var userDepart = LoginService.user.sysUser.userDepartList[LoginService.user.sysUser.currentOrg]
        isSendtrueOrFalse(userDepart.isSendAppraisal)
        // if(userDepart.isSendAppraisal==1){
        //     if($scope.adjust.isSendAppraisal == 2 && $scope.adjust.isAppraisalFinish == 0){ //已提交未完成
        //         $rootScope.toaster("warn", "提示", "有已提交，未完成的鉴定，不能完成调解");
        //     }else if($scope.adjust.isSendAppraisal == 1 && $scope.adjust.isAppraisalFinish == 0){ //已发起未提交
        //         if(confirm("有一个未提交的鉴定，是否强制完成调解？")){
        //             isFinish()
        //         }
        //     }else{
        //         $scope.submitAdjust();
        //     }
        // }else{
        //     if($scope.adjust.isSendAppraisal == 2 && $scope.adjust.isAppraisalFinish == 0){ //已提交未完成
        //         $rootScope.toaster("warn", "提示", "有已提交，未完成的鉴定，不能完成调解");
        //     }else if($scope.adjust.isSendAppraisal == 1 && $scope.adjust.isAppraisalFinish == 0){ //已发起未提交
        //         if(confirm("有一个未提交的鉴定，是否强制完成调解？")){
        //             isFinishOld()
        //         }
        //     }else{
        //         $scope.submitAdjust();
        //     }
        //     //$scope.submitAdjust();
        // }
    }
    
    $scope.submitAdjust = function() {
        var respondents = $scope.adjust.applicantArray.filter(function(e) {
            //idType:被告身份类型 0：公民 1： 法人  2：其他组织   enterpriseType：1表示保险公司  ? 为法人其它公司为什么没有
            return e.personType == 1 && (e.idType == '0' || e.idType == '2' || e.idType == '1') && e.riskTypes;
        });

        //车牌号必填
        /*if(respondents){
            for(var i = 0; i<respondents.length; i++){
                var v = respondents[i];
                if (v.isVehicle == "1") {
                    if(!v.plateNo){
                        $rootScope.toaster("error", "错误", "请填写责任人车牌号!");
                        return;
                    }
                }
            }
        }*/

        if (!respondents.length) {
            $rootScope.toaster("warn", "错误", "请选择责任人!");
            return;
        }

        if($scope.adjust.lawMoney == 0){
            $rootScope.toaster("warn", "警告", "需录入赔偿费用!");
            return;
        }

        if(isLoading) {
            $rootScope.toaster(DictionaryConfig.levelConstant.warn, DictionaryConfig.titleConstant.warn, $scope.CONSTANT.isLoading);
            return;
        }

        //判断伤残比率
        //重置责任比例对象
        $scope.dutyRatio = {};
        //将每个责任人比率存入对象
        _.each($scope.adjust.applicantArray, function(obj, i) {
            if($scope.showRespondentFilter(obj) && obj.responsibleRate) {
                $scope.dutyRatio[obj.personName+i] = obj.responsibleRate
            }
        });
        var total = 0;
        _.each($scope.dutyRatio, function (v,k) {
            total = total + parseInt(v);
        })
        if(total > 100) {
            $rootScope.toaster(level.error, title.error, $scope.CONSTANT.dutyRatio);
            return;
        }

        if(confirm("调解完成后，不可修改，确定要提交吗？")){
            //如果发起鉴定并且没有完成，则不让调解完成
            $scope.queryInHandAppraisalInfoService({
                serialNo:$scope.adjust.serialNo
            }).success(function (result) {
                if (result.code == AppraisalConfig.commonConstant.SUCCESS) {
                    //如果没发鉴定 或者发送鉴定并且已经完成可以调解完成
                    if(!result.result ||(result.result && result.result.state == DictionaryConfig.appraisalState.finishState)){
                        //调节没更新之前的状态
                        $scope.flowState = $scope.adjust.state;
                        //更新之后的状态
                        if($scope.adjust.adjustType == '3'){
                            $scope.adjust.state = DictionaryConfig.lawState.approvalState;
                        }else{
                            $scope.adjust.state = DictionaryConfig.lawState.prosecutionFinishState;
                        }
                        $scope.save(0,0,1,true);
                        //调解笔录
                        if($scope.adjust.adjustResult == '2') {
                            //生成调解笔录
                            AdjustService.buildMediateRecord({
                                serialNo: $scope.adjust.serialNo,
                                moneyFee: $scope.acceptanceFee
                            }).success(function(result) {
                                var data = result.result;
                                console.log(data)
                                if (result.code == AdjustConfig.commonConStant.FAILURE) {
                                    $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageBackend);
                                }
                            });
                        }
                        isLoading = true;
                    }else{
                        toaster.pop(DictionaryConfig.levelConstant.warn, DictionaryConfig.titleConstant.warn, $scope.CONSTANT.appraisalError);
                    }
                }
            });
        }
    };
    //插入流程表
    $scope.insertWorkFlow = function () {
        var adjustResultName =  _.find(DictionaryConfig.adjustResultList, {id: $scope.adjust.adjustResult}).text;
        var adjustRemark = _.find(DictionaryConfig.adjustResultList, {id: $scope.adjust.adjustResult}).text;

        var workFlowData = initWorkFlowData($scope.adjust);
        var result = "";
        //司法确认
        if($scope.adjust.adjustResult == '1' || $scope.adjust.adjustResult == '4'){
            result = "3"
        }else if ($scope.adjust.adjustResult == '2' || $scope.adjust.adjustResult == '3'){//调解未成功
            result = "1"
        }
        //插入流程表信息
        $scope.adjustService.insertJyWorkFlow({
            type: DictionaryConfig.caseVerifyResultCode[0].code,
            serialNo: $scope.adjust.serialNo,
            orgCode: $scope.adjust.adjustOrgCode,
            orgName: $scope.adjust.adjustOrgName,
            result: result,
            resultName: adjustResultName,
            remark: adjustRemark,
            tempData: JSON.stringify(workFlowData)
        }).success(function(result) {
            if (result.code == AdjustConfig.commonConStant.SUCCESS) {
                //成功跳转页面
                var sendInfo = angular.toJson({type:$scope.flowState,result:$scope.adjust.adjustResult,adjustType:$scope.adjust.adjustType});
                $state.go("dashboard.pending_complete",{pageInfo:sendInfo});
            } else {
                $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageBackend);
            }
        })
    };

    var initWorkFlowData = function(adjust){
        var workFlowData = new DictionaryConfig.workFlowData();
        workFlowData.serialNo = adjust.serialNo;
        var respondents = "";
        adjust.applicantArray.filter(function(v){
            return v.personType==1 && v.delFlag==0;
        }).forEach(function(v){
            if(respondents) respondents += "," + v.personName;
            else respondents += v.personName;
        });
        workFlowData.respondent =respondents;
        workFlowData.adjustOrgName = adjust.adjustOrgName;
        workFlowData.adjustPointName = adjust.adjustPointName;
        workFlowData.regulationNo = adjust.regulationNo;
        workFlowData.lawMoney = adjust.lawMoney;
        workFlowData.adjustDate = adjust.adjustDate;
        workFlowData.adjustResult = adjust.adjustResult;
        workFlowData.adjustName = adjust.adjustName;

        return workFlowData;
    }

    var validateStep3 = function() {
        if (!$scope.adjust.factReason) {
            $scope.adjust.factReasonError = true;
            $rootScope.toaster(DictionaryConfig.levelConstant.warn, DictionaryConfig.titleConstant.warn, $scope.CONSTANT.messageReasonNull);
            return false;
        } else $scope.adjust.factReasonError = undefined;
        return true;
    };

    var validateStep4 = function() {
        /*if (!$scope.adjust.evidenceArray.length) {
         toaster.pop(level.error, title.error, $scope.CONSTANT.messageEvidenceNull);
         return false;
         } else */
        if ($scope.adjust.evidenceArray.length) {
            for (var i=0; i<$scope.adjust.evidenceArray.length; i++) {
                var e = $scope.adjust.evidenceArray[i];
                if (!e.name) {
                    e.nameError = true;
                    $rootScope.toaster(DictionaryConfig.levelConstant.warn, DictionaryConfig.titleConstant.warn, $scope.CONSTANT.messageEvidenceNameNull);
                    return false;
                } else e.nameError = undefined;

                /*if (!e.description) {
                 e.descriptionError = true;
                 toaster.pop(DictionaryConfig.levelConstant.warn, DictionaryConfig.titleConstant.warn, $scope.CONSTANT.messageEvidenceDescriptionNull);
                 return false;
                 } else e.descriptionError = undefined;*/
                /*if (!e.classify) {
                    $rootScope.toaster(DictionaryConfig.levelConstant.warn, DictionaryConfig.titleConstant.warn, $scope.CONSTANT.messageEvidenceClassifyNull);
                    return false;
                }*/
            }
        }
        return true;
    };

    var validateStep5 = function() {
        if (!$scope.adjust.regionName) {
            $scope.adjust.regionNameError = true;
            $rootScope.toaster(DictionaryConfig.levelConstant.warn, DictionaryConfig.titleConstant.warn, $scope.CONSTANT.messageRegionNameError);
            return false;
        } else $scope.adjust.regionNameError = undefined;

        if (!$scope.adjust.standardYear) {
            $rootScope.toaster(DictionaryConfig.levelConstant.warn, DictionaryConfig.titleConstant.warn, "请选择赔偿年度");
            return false;
        }

        if($scope.adjust.deathDate && !$scope.adjust.compensateRate){
            $scope.adjust.compensateRateError = true;
            $rootScope.toaster(DictionaryConfig.levelConstant.warn, DictionaryConfig.titleConstant.warn, $scope.CONSTANT.messageCompensateRateError);
            return false;
        }else $scope.adjust.compensateRateError = undefined;

        var respondents = $scope.adjust.applicantArray.filter(function(e) {
            return e.personType == 1 && (e.idType == '0' || e.idType == '2' || e.idType == '1' ) && e.riskTypes;
        });
        console.log(respondents)
        if (!respondents.length) {
            $rootScope.toaster(DictionaryConfig.levelConstant.warn, DictionaryConfig.titleConstant.warn, $scope.CONSTANT.messageRespondentError);
            return false;
        }
        if(!$scope.adjust.feeDetail || !$scope.adjust.lawMoney){
            $rootScope.toaster(DictionaryConfig.levelConstant.warn, DictionaryConfig.titleConstant.warn, $scope.CONSTANT.messageLawMoneyDetailError);
            return false;
        }
        for(var i = 0; i < respondents.length; i++){
            var v = respondents[i];
            if (v.isVehicle == 1) {
                /*if (!v.plateNo) {
                    $rootScope.toaster(DictionaryConfig.levelConstant.warn, DictionaryConfig.titleConstant.warn, $scope.CONSTANT.messageRespondentPlateNo);
                    return false;
                }*/
                if (!v.insuranceForceCompany && v.riskTypes['0'] ) {
                    $rootScope.toaster(DictionaryConfig.levelConstant.warn, DictionaryConfig.titleConstant.warn, $scope.CONSTANT.messageForceCompanyError);
                    return false;
                }
                if ((v.riskTypes['1'] || v.riskTypes['2']) && !v.insuranceBusinessCompany) {//选择三者险/不计免赔
                    $rootScope.toaster(DictionaryConfig.levelConstant.warn, DictionaryConfig.titleConstant.warn, $scope.CONSTANT.messageBusinessError);
                    return false;
                }
            }
        }

        if (!$scope.adjust.adjustDate) {
            $scope.adjust.adjustDateError = true;
            $rootScope.toaster(DictionaryConfig.levelConstant.warn, DictionaryConfig.titleConstant.warn, $scope.CONSTANT.messageAdjustDateError);
            return false;
        } else $scope.adjust.adjustDateError = undefined;

        if (!$scope.adjust.adjustResult) {
            $rootScope.toaster(DictionaryConfig.levelConstant.warn, DictionaryConfig.titleConstant.warn, $scope.CONSTANT.messageAdjustResultError);
            return false;
        }

        return true;
    };
    //验证申请人
    var validateStep12 = function() {
        var applicantList = $scope.adjust.applicantArray.filter(function(v) {
            return $scope.co.step - 1 == v.personType;
        });

        function clearIdType(v) {
            if (v.idType == "0") { //公民
                v.orgName = undefined;
                // v.legalType = undefined;
                v.legalName = undefined;
                v.job = undefined;
                v.orgCode = undefined;
                v.registerCode = undefined;
            } else { //法人
                v.personName = undefined;
                // v.certificatesType = undefined;
                v.idNo = undefined;
                v.sex = undefined;
                v.birthDay = undefined;
                v.nation = undefined;
                v.domicile = undefined;
                if (v.idType == "2") {
                    v.registerCode = undefined; //其他
                    if (v.personType == 1) { // 被申请人
                        v.lossNo = undefined;
                        v.companyName = undefined;
                    }
                }
            }
        };

        function clearAgentType(m) {
            if (m.agentType == "0") { //委托
                m.residence = undefined;
                if (m.agentIdentity != 1 || (m.agentIdentity == 1 && m.agentIdentityItem != 1)) {
                    m.relation = undefined
                }
            } else if (m.agentType == "1") { //法定
                m.companyName = undefined;
                m.entrustPowerDetail = "";
                m.entrustPower = "0";
            }
        }
        var mailReg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        for (var i=0; i < applicantList.length;i++) {
            var v = applicantList[i];
            //公民
            clearIdType(v);
            if (v.idType == "0") {//公民
                //申请人姓名
                if (!v.personName) {
                    v.personNameError = true;
                    if($scope.co.step == 1){
                        $rootScope.toaster(DictionaryConfig.levelConstant.warn, DictionaryConfig.titleConstant.warn, $scope.CONSTANT.messageApplicantNameNull); //申请人
                    }else{
                        $rootScope.toaster(DictionaryConfig.levelConstant.warn, DictionaryConfig.titleConstant.warn, $scope.CONSTANT.messageRespondentNameNull); //被申请人
                    }
                    return false;
                } else v.personNameError = undefined;

                //证件号码
                if (!v.idNo) {
                    if(v.certificatesType != '6' && v.certificatesType != '5') {
                        v.idNoError = true;
                        $rootScope.toaster(DictionaryConfig.levelConstant.warn, DictionaryConfig.titleConstant.warn, $scope.CONSTANT.messageIdNoNull);
                        return false;
                    } v.idNoError = undefined;
                } else if((v.certificatesType==0 || v.certificatesType=='08') && !checkIdentity(v)){
                    return false;
                } else v.idNoError = undefined;
                // 出生日期
                if (!v.birthDay) {
                    v.birthDayError = true;
                    $rootScope.toaster(DictionaryConfig.levelConstant.warn, DictionaryConfig.titleConstant.warn, $scope.CONSTANT.messageBirthdayNull);
                    return false;
                }else v.birthDayError = undefined;
                //民族
                if (!v.nation) {
                    v.nationError = true;
                    $rootScope.toaster(DictionaryConfig.levelConstant.warn, DictionaryConfig.titleConstant.warn, $scope.CONSTANT.messageNationNull);
                    return false;
                } else v.nationError = undefined;
                //手机号码
                if (!v.telephone) {
                    v.telephoneError = true;
                    $rootScope.toaster(DictionaryConfig.levelConstant.warn, DictionaryConfig.titleConstant.warn, $scope.CONSTANT.messageTelephoneNull);
                    return false;
                }
                //邮箱
                if (v.email && !mailReg.test(v.email)) {
                    v.emailError = true;
                    $rootScope.toaster(DictionaryConfig.levelConstant.warn, DictionaryConfig.titleConstant.warn, $scope.CONSTANT.messageEmailFormatError);
                    return false;
                } else v.emailError = undefined;
                //户籍所在地
                if (!v.domicile) {
                    v.domicileError = true;
                    $rootScope.toaster(DictionaryConfig.levelConstant.warn, DictionaryConfig.titleConstant.warn, $scope.CONSTANT.messageDomicileNull);
                    return false;
                } else v.domicileError = undefined;
                //居住地
                if (!v.residence) {
                    v.residenceError = true;
                    $rootScope.toaster(DictionaryConfig.levelConstant.warn, DictionaryConfig.titleConstant.warn, $scope.CONSTANT.messageResidenceNull);
                    return false;
                } else v.residenceError = undefined;
                //送达地址
                if (!v.sendAddress) {
                    v.sendAddressError = true;
                    $rootScope.toaster(DictionaryConfig.levelConstant.warn, DictionaryConfig.titleConstant.warn, $scope.CONSTANT.messageSendAddressNull);
                    return false;
                } else v.sendAddressError = undefined;
                //电子送达
                /*if(($scope.userDepart.isPassDocument =='0' || $scope.userDepart.isEndDocument =='0') && !v.isEmail && v.isEmail != '0') {
                    v.isEmailError = true;
                    $rootScope.toaster(DictionaryConfig.levelConstant.warn, DictionaryConfig.titleConstant.warn, $scope.CONSTANT.messageIsEmailNull);
                    return false;
                } else v.isEmailError = undefined;*/
                //中途插进来的案子没有isEmail属性，默认选否
                if(($scope.userDepart.isPassDocument =='0' || $scope.userDepart.isEndDocument =='0') && !v.isEmail && v.isEmail != '0') {
                    v.isEmail = '1'
                }
                //车牌号验证方法
                /*if(v.personType == "1" && v.plateNo){
                    var xreg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DF]$)|([DF][A-HJ-NP-Z0-9][0-9]{4}$))/;
                    var creg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1}$/;
                    if (v.plateNo.length == 7) {
                        if(!creg.test(v.plateNo)) {
                          v.plateNoError = true;
                          $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messagepPlateNo);
                          return false;
                        } else v.plateNoError = undefined;
                    } else if (v.plateNo.length == 8) {
                        if(!xreg.test(v.plateNo)) {
                          v.plateNoError = true;
                          $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messagepPlateNo);
                          return false;
                        } else v.plateNoError = undefined;
                    } else {
                        v.plateNoError = true;
                        $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messagepPlateNo);
                        return false;
                    }
                } else v.plateNoError = undefined;*/
            }
            //法人
            if (v.idType == "1") {
                //企业名称
                if (!v.orgName) {
                    v.orgNameError = true;
                    $rootScope.toaster(DictionaryConfig.levelConstant.warn, DictionaryConfig.titleConstant.warn, $scope.CONSTANT.messageOrgNameNull);
                    return false;
                } else v.orgNameError = undefined;
                //代表人姓名
                if (!v.legalName) {
                    v.legalNameError = true;
                    $rootScope.toaster(DictionaryConfig.levelConstant.warn, DictionaryConfig.titleConstant.warn, $scope.CONSTANT.messageLegalNameNull);
                    return false;
                } else v.legalNameError = undefined;
                //公司职务
                if (!v.job) {
                    v.jobError = true;
                    $rootScope.toaster(DictionaryConfig.levelConstant.warn, DictionaryConfig.titleConstant.warn, $scope.CONSTANT.messageJobNull);
                    return false;
                } else v.jobError = undefined;
                //手机号码
                if (!v.telephone) {
                    v.telephoneError = true;
                    $rootScope.toaster(DictionaryConfig.levelConstant.warn, DictionaryConfig.titleConstant.warn, $scope.CONSTANT.messageTelephoneNull);
                    return false;
                }
                //居住地
                if (!v.residence) {
                    v.residenceError = true;
                    $rootScope.toaster(DictionaryConfig.levelConstant.warn, DictionaryConfig.titleConstant.warn, $scope.CONSTANT.messageResidenceNull);
                    return false;
                } else v.residenceError = undefined;
                //送达地址
                if (!v.sendAddress) {
                    v.sendAddressError = true;
                    $rootScope.toaster(DictionaryConfig.levelConstant.warn, DictionaryConfig.titleConstant.warn, $scope.CONSTANT.messageSendAddressNull);
                    return false;
                } else v.sendAddressError = undefined;
                //电子送达
                /*if(!v.isEmail && v.isEmail != '0') {
                    v.isEmailError = true;
                    $rootScope.toaster(DictionaryConfig.levelConstant.warn, DictionaryConfig.titleConstant.warn, $scope.CONSTANT.messageIsEmailNull);
                    return false;
                } else v.isEmailError = undefined;*/
                //中途插进来的案子没有isEmail属性，默认选否
                if(($scope.userDepart.isPassDocument =='0' || $scope.userDepart.isEndDocument =='0') && !v.isEmail && v.isEmail != '0') {
                    v.isEmail = '1'
                }
                //邮箱
                if (v.email && !mailReg.test(v.email)) {
                    v.emailError = true;
                    $rootScope.toaster(DictionaryConfig.levelConstant.warn, DictionaryConfig.titleConstant.warn, $scope.CONSTANT.messageEmailFormatError);
                    return false;
                } else v.emailError = undefined;
                /*if(v.personType==1 && v.enterpriseType==1){//保险公司 //车牌号
                    if(!v.plateNo){
                        v.plateNoError = true;
                        $rootScope.toaster(DictionaryConfig.levelConstant.warn, DictionaryConfig.titleConstant.warn, $scope.CONSTANT.messagePlateNoNull);
                        return false;
                    }else v.plateNoError = undefined;
                    var appelleeArray = applicantList.filter(function(m){return m.personType==1});
                    for (var j=0; j < appelleeArray.length;j++) {
                        var appellee = appelleeArray[j];
                        if(!appellee.plateNo){
                            appellee.plateNoError = true;
                            $rootScope.toaster(DictionaryConfig.levelConstant.warn, DictionaryConfig.titleConstant.warn, $scope.CONSTANT.messagePlateNoNull);
                            $("#plateNo").focus();
                            return false;
                        }else appellee.plateNoError = undefined;
                    }
                }*/
            }
            //其他组织
            if (v.idType == "2") {
                //组织名称
                if (!v.orgName) {
                    v.orgNameError = true;
                    $rootScope.toaster(DictionaryConfig.levelConstant.warn, DictionaryConfig.titleConstant.warn, $scope.CONSTANT.messageOrgNameNull);
                    return false;
                } else v.orgNameError = undefined;
                //代表人姓名
                if (!v.legalName) {
                    v.legalNameError = true;
                    $rootScope.toaster(DictionaryConfig.levelConstant.warn, DictionaryConfig.titleConstant.warn, $scope.CONSTANT.messageLegalNameNull);
                    return false;
                } else v.legalNameError = undefined;
                //公司职务
                if (!v.job) {
                    v.jobError = true;
                    $rootScope.toaster(DictionaryConfig.levelConstant.warn, DictionaryConfig.titleConstant.warn, $scope.CONSTANT.messageJobNull);
                    return false;
                } else v.jobError = undefined;
                //手机号码
                if (!v.telephone) {
                    v.telephoneError = true;
                    $rootScope.toaster(DictionaryConfig.levelConstant.warn, DictionaryConfig.titleConstant.warn, $scope.CONSTANT.messageTelephoneNull);
                    return false;
                }
                //居住地
                if (!v.residence) {
                    v.residenceError = true;
                    $rootScope.toaster(DictionaryConfig.levelConstant.warn, DictionaryConfig.titleConstant.warn, $scope.CONSTANT.messageResidenceNull);
                    return false;
                } else v.residenceError = undefined;
                //送达地址
                if (!v.sendAddress) {
                    v.sendAddressError = true;
                    $rootScope.toaster(DictionaryConfig.levelConstant.warn, DictionaryConfig.titleConstant.warn, $scope.CONSTANT.messageSendAddressNull);
                    return false;
                } else v.sendAddressError = undefined;
                //电子送达
                /*if(!v.isEmail && v.isEmail != '0') {
                    v.isEmailError = true;
                    $rootScope.toaster(DictionaryConfig.levelConstant.warn, DictionaryConfig.titleConstant.warn, $scope.CONSTANT.messageIsEmailNull);
                    return false;
                } else v.isEmailError = undefined;*/
                //中途插进来的案子没有isEmail属性，默认选否
                if(($scope.userDepart.isPassDocument =='0' || $scope.userDepart.isEndDocument =='0') && !v.isEmail && v.isEmail != '0') {
                    v.isEmail = '1'
                }
                //邮箱
                if (v.email && !mailReg.test(v.email)) {
                    v.emailError = true;
                    $rootScope.toaster(DictionaryConfig.levelConstant.warn, DictionaryConfig.titleConstant.warn, $scope.CONSTANT.messageEmailFormatError);
                    return false;
                } else v.emailError = undefined;
            }
            //Agent
            if (v.agentArray) {
                for (var j = 0; j< v.agentArray.length;j++) { //多个代理人
                    var m = v.agentArray[j];
                    //委托
                    clearAgentType(m)
                    if (m.agentType == "0") {
                        //证件类型
                        if (!m.certificatesType) {
                            m.certificatesTypeError = true;
                            $rootScope.toaster(DictionaryConfig.levelConstant.warn, DictionaryConfig.titleConstant.warn, $scope.CONSTANT.messageIdTypeNull);
                            return false;
                        } else m.certificatesTypeError = undefined;
                        if (m.agentIdentity == "1") {
                            if(!m.agentIdentityItem){
                                $rootScope.toaster(DictionaryConfig.levelConstant.warn, DictionaryConfig.titleConstant.warn, "代理人身份不能为空!");
                                return false;
                            }

                            if(m.agentIdentityItem == "1" && !m.relation){
                                $rootScope.toaster(DictionaryConfig.levelConstant.warn, DictionaryConfig.titleConstant.warn, "与申请人关系不能为空!");
                                return false;
                            }
                            //证件号码
                            if (!m.idNo) {
                                m.idNoError = true;
                                $rootScope.toaster(DictionaryConfig.levelConstant.warn, DictionaryConfig.titleConstant.warn, $scope.CONSTANT.messageIdNoNull);
                                return false;
                            }else if(m.certificatesType=='0' && !checkIdentity(m, true)){

                                return false;
                            } else m.idNoError = undefined;

                            if(!m.birthDay){
                                $rootScope.toaster(DictionaryConfig.levelConstant.warn, DictionaryConfig.titleConstant.warn, "代理人生日不能为空!");
                                return false;
                            }
                            if(!m.sex){
                                $rootScope.toaster(DictionaryConfig.levelConstant.warn, DictionaryConfig.titleConstant.warn, "代理人性别不能为空!");
                                return false;
                            }
                            if(!m.nation){
                                $rootScope.toaster(DictionaryConfig.levelConstant.warn, DictionaryConfig.titleConstant.warn, "代理人民族不能为空!");
                                return false;
                            }
                        }
                        //证件号码
                        if (!m.idNo) {
                            m.idNoError = true;
                            $rootScope.toaster(DictionaryConfig.levelConstant.warn, DictionaryConfig.titleConstant.warn, $scope.CONSTANT.messageIdNoNull);
                            return false;
                        }else if(m.certificatesType=='0' && !checkIdentity(m, true)){
                            return false;
                        } else m.idNoError = undefined;
                        //代理人姓名
                        if (!m.agentName) {
                            m.agentNameError = true;
                            $rootScope.toaster(DictionaryConfig.levelConstant.warn, DictionaryConfig.titleConstant.warn, $scope.CONSTANT.messageAgentNameNull);
                            return false;
                        } else m.agentNameError = undefined;
                        //手机号码
                        if (!m.telephone) {
                            m.telephoneError = true;
                            $rootScope.toaster(DictionaryConfig.levelConstant.warn, DictionaryConfig.titleConstant.warn, $scope.CONSTANT.messageAgentTelephoneNull);
                            return false;
                        }
                        //邮箱
                        if (m.email && !mailReg.test(m.email)) {
                            m.emailError = true;
                            $rootScope.toaster(DictionaryConfig.levelConstant.warn, DictionaryConfig.titleConstant.warn, $scope.CONSTANT.messageEmailFormatError);
                            return false;
                        } else m.emailError = undefined;
                        //单位名称
                        if (!m.companyName && (m.agentIdentity=='0' || m.agentIdentity=='2')) {//律师与法律工作者验证单位
                            m.companyNameError = true;
                            $rootScope.toaster(DictionaryConfig.levelConstant.warn, DictionaryConfig.titleConstant.warn, $scope.CONSTANT.messageUnitNameNull);
                            return false;
                        } else m.companyNameError = undefined;


                        if (!m.domicile && m.agentIdentity=='1') {//公民时需要填写户籍地
                            m.domicileError = true;
                            $rootScope.toaster(DictionaryConfig.levelConstant.warn, DictionaryConfig.titleConstant.warn, $scope.CONSTANT.messageDomicileNull);
                            return false;
                        } else m.domicileError = undefined;

                        //送达地址
                        if (!m.sendAddress) {
                            m.sendAddressError = true;
                            $rootScope.toaster(DictionaryConfig.levelConstant.warn, DictionaryConfig.titleConstant.warn, $scope.CONSTANT.messageSendAddressNull);
                            return false;
                        } else m.sendAddressError = undefined;
                    }
                    //法定
                    if (m.agentType == "1") {
                        clearAgentType(m.agentType)
                        //证件类型
                        if (!m.certificatesType) {
                            m.certificatesTypeError = true;
                            $rootScope.toaster(DictionaryConfig.levelConstant.warn, DictionaryConfig.titleConstant.warn, $scope.CONSTANT.messageIdTypeNull);
                            return false;
                        } else m.certificatesTypeError = undefined;
                        //证件号码
                        if (!m.idNo) {
                            m.idNoError = true;
                            $rootScope.toaster(DictionaryConfig.levelConstant.warn, DictionaryConfig.titleConstant.warn, $scope.CONSTANT.messageIdNoNull);
                            return false;
                        } else m.idNoError = undefined;
                        //代理人姓名
                        if (!m.agentName) {
                            m.agentNameError = true;
                            $rootScope.toaster(DictionaryConfig.levelConstant.warn, DictionaryConfig.titleConstant.warn, $scope.CONSTANT.messageAgentNameNull);
                            return false;
                        } else m.agentNameError = undefined;
                        //手机号码
                        if (!m.telephone) {
                            m.telephoneError = true;
                            $rootScope.toaster(DictionaryConfig.levelConstant.warn, DictionaryConfig.titleConstant.warn, $scope.CONSTANT.messageAgentTelephoneNull);
                            return false;
                        }
                        //邮箱
                        if (m.email && !mailReg.test(m.email)) {
                            m.emailError = true;
                            $rootScope.toaster(DictionaryConfig.levelConstant.warn, DictionaryConfig.titleConstant.warn, $scope.CONSTANT.messageEmailFormatError);
                            return false;
                        } else m.emailError = undefined;
                        //户籍所在地
                        if (!m.domicile) {
                            m.domicileError = true;
                            $rootScope.toaster(DictionaryConfig.levelConstant.warn, DictionaryConfig.titleConstant.warn, $scope.CONSTANT.messageDomicileNull);
                            return false;
                        } else m.domicileError = undefined;
                        //户籍所在地
                        if (!m.residence) {
                            m.residenceError = true;
                            $rootScope.toaster(DictionaryConfig.levelConstant.warn, DictionaryConfig.titleConstant.warn, $scope.CONSTANT.messageResidenceNull);
                            return false;
                        } else m.residenceError = undefined;
                        //送达地址
                        if (!m.sendAddress) {
                            m.sendAddressError = true;
                            $rootScope.toaster(DictionaryConfig.levelConstant.warn, DictionaryConfig.titleConstant.warn, $scope.CONSTANT.messageSendAddressNull);
                            return false;
                        } else m.sendAddressError = undefined;
                    }
                }
            }
        }



        if($scope.co.step == 1){
            var k = $scope.adjust.applicantArray.filter(function(v) {
                return v.personType == '0' && v.isDeath == '2';
            });

            if(k.length == 0){
                $rootScope.toaster(DictionaryConfig.levelConstant.warn, DictionaryConfig.titleConstant.warn, "不能只有死者作为申请人！");
                return false;
            }

        }
        return true;
    }

    //验证身份证
    var checkIdentity = function(applicant, isAgent) {
        var wi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1]; // 加权因子
        var valideCode = [1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2]; // 身份证验证位值.10代表X
        function isTrueValidateCodeBy18IdCard(idCard) {

            var idCardArray = [];
            for (var i = 0; i <= 17; i++) {
                var char = idCard.charAt(i);
                if(idCard.charAt(i).toUpperCase() == 'X'){
                    char = 10;// 将最后位为x的验证码替换为10方便后续操作
                }
                idCardArray.push(parseInt(char));
            }

            var sum = 0; // 声明加权求和变量
            for (var i = 0; i < 17; i++) {
                sum += wi[i] * idCardArray[i]; // 加权求和
            }
            var valCodePosition = sum % 11; // 得到验证码所位置
            return idCardArray[17] == valideCode[valCodePosition];
        }
        if ((applicant.certificatesType == 0 || applicant.certificatesType == '08') && applicant.idNo) {
            applicant.idNo = applicant.idNo.replace(/ /g, "");

            //验证港澳台身份证
            if(applicant.certificatesType == '08') {
              //校验香港身份证规则
              var taiwanreg = /^[A-Z][0-9]{9}$/;
              //校验台湾身份证规则
              var xianggangreg = /^[A-Z][0-9]{6}\([0-9A-Z]\)$/;
              var xianggangreg1 = /^[A-Z][0-9]{6}\（[0-9A-Z]\）$/;
              //校验澳门身份证规则
              var aomenreg = /^[157][0-9]{6}\([0-9]\)$/;
              var aomenreg1 = /^[157][0-9]{6}\（[0-9]\）$/;
              if (!(taiwanreg.test(applicant.idNo) || xianggangreg.test(applicant.idNo) || xianggangreg1.test(applicant.idNo) || aomenreg.test(applicant.idNo) || aomenreg1.test(applicant.idNo))) {
                applicant.idNoError = true;
                $rootScope.toaster(DictionaryConfig.levelConstant.warn, DictionaryConfig.titleConstant.warn, $scope.CONSTANT.messageIdentityFormatError);
                return false;
              } else applicant.idNoError = false;
            }

            //大陆居民身份证
            if(applicant.certificatesType == '0') {
                if (applicant.idNo.length == 15) {
                    var year = applicant.idNo.substring(6, 8);
                    var month = applicant.idNo.substring(8, 10);
                    var day = applicant.idNo.substring(10, 12);
                    var tempDate = new Date(year, parseFloat(month) - 1, parseFloat(day));
                    if (tempDate.getYear() == parseFloat(year) && tempDate.getMonth() == parseFloat(month) - 1 && tempDate.getDate() == parseFloat(day)) {
                        applicant.birthDay = tempDate;
                        applicant.sex = applicant.idNo.substring(14, 15) % 2 == 0 ? '1' : '0';
                        applicant.idNoError = false;
                    } else {
                        applicant.idNoError = true;
                        $rootScope.toaster(DictionaryConfig.levelConstant.warn, DictionaryConfig.titleConstant.warn, $scope.CONSTANT.messageIdentityFormatError);
                        return false;
                    }
                } else if (applicant.idNo.length == 18 && isTrueValidateCodeBy18IdCard(applicant.idNo)) {
                    var year = applicant.idNo.substring(6, 10);
                    var month = applicant.idNo.substring(10, 12);
                    var day = applicant.idNo.substring(12, 14);
                    var tempDate = new Date(year, parseFloat(month) - 1, parseFloat(day));
                    if (tempDate.getFullYear() == parseFloat(year) && tempDate.getMonth() == parseFloat(month) - 1 && tempDate.getDate() == parseFloat(day)) {
                        applicant.birthDay = tempDate;
                        applicant.sex = applicant.idNo.substring(16, 17) % 2 == 0 ? '1' : '0';
                        applicant.idNoError = false;
                    } else {
                        applicant.idNoError = true;
                        $rootScope.toaster(DictionaryConfig.levelConstant.warn, DictionaryConfig.titleConstant.warn, $scope.CONSTANT.messageIdentityFormatError);
                        return false;
                    }
                }  else {
                    applicant.idNoError = true;
                    $rootScope.toaster(DictionaryConfig.levelConstant.warn, DictionaryConfig.titleConstant.warn, $scope.CONSTANT.messageIdentityFormatError);
                    return false;
                }
            }

            if (isAgent && applicant.certificatesType!=0) {
                applicant.birthDay = applicant.sex = undefined;
            }
        }
        return true;
    };

    function initOrg(){
        if(LoginService.user.sysUser.userDepartList.length>0){
$scope.userDepart = LoginService.user.sysUser.userDepartList[LoginService.user.sysUser.currentOrg];
$scope.isSendAppraisal = $scope.userDepart.isSendAppraisal;
        }
        var loginAccount = LoginService.user.sysUser.loginAccount
        var userType = LoginService.user.sysUser.userType
        var url = $state.href("appraisal_notice",{serialNo:$scope.adjust.serialNo,caseType:'1',orgId:$scope.userDepart.orgId,orgName:$scope.userDepart.orgName, name:"appraisal_notice",pointId:$scope.adjust.adjustPointCode,pointName:$scope.adjust.adjustPointName,loginAccount:loginAccount,userType:userType});

        AdjustService.getForwardUrl({
            orgId:$scope.adjust.lawOrgId
        }).success(function(res){
            if(res.result && res.result.identificationInformationDoc){
                url = $state.href("appraisal_notice",{serialNo:$scope.adjust.serialNo,caseType:'1',orgId:$scope.userDepart.orgId,orgName:$scope.userDepart.orgName, name:res.result.identificationInformationDoc,pointId:$scope.adjust.adjustPointCode,pointName:$scope.adjust.adjustPointName,loginAccount:loginAccount,userType:userType});
            }
        })
        window.open(url,'_blank');
    }

    $scope.getCurrentOrg = function () {
        //根据组织机构获取人员列表
        $scope.$on('user2Child', function(){
            initOrg();
        });
        if (LoginService.user.userPermissions) {
            initOrg();
        }
    };

    function AppraisalInfo(){
        this.appraisalFlag = false;
        this.serialNo = "";
        this.personType = 1;
        this.appraisalInfoId = "";
    }
    //根据流水号查询鉴定案件
    $scope.queryAppraisal = function(){

        $scope.appraisalInfo = new AppraisalInfo();
        $scope.appraisalInfo.serialNo = $scope.adjust.serialNo;

        $scope.queryInHandAppraisalInfoService({
            serialNo:$scope.adjust.serialNo
        }).success(function (result) {
            if (result.code == AppraisalConfig.commonConstant.SUCCESS) {
                if(result.result){
                    if(result.result.state == DictionaryConfig.appraisalState.finishState || result.result.state == DictionaryConfig.appraisalState.temporaryState || $scope.adjust.oldIsSendAppraisal == 0){//第三个
                        $scope.appraisalInfo.appraisalFlag = true;
                    }else{
                        $scope.appraisalInfo.appraisalInfoId = result.result.id;
                    }
                }else{
                    $scope.appraisalInfo.appraisalFlag = true;
                }
                if($scope.appraisalInfo.appraisalFlag){
                    $scope.getCurrentOrg();
                }else{
                    $state.go("dashboard.appraisalQueryDetail",{serialNo:$scope.appraisalInfo.serialNo,personType:$scope.appraisalInfo.personType,appraisalInfoId:$scope.appraisalInfo.appraisalInfoId,step12EvidenceArray:$scope.step12EvidenceArray});
                }
            }
        });
    };

    $scope.isInformation = false;
    $scope.Information = function (isSendAppraisal) {
        var userDepart = LoginService.user.sysUser.userDepartList[LoginService.user.sysUser.currentOrg];
        if(userDepart.isSendAppraisal == 1 && isSendAppraisal == 0){
          $scope.isInformation = true;
        }else{
          $scope.queryAppraisal($scope.adjust.serialNo);
        }
    }

    //发起鉴定
    $scope.prejudgeService = PrejudgeService;
    $scope.sendAppraisal = function(){
        //查询法院是否对接了鉴定系统
        var loginAccount = LoginService.user.sysUser.loginAccount
        var userType = LoginService.user.sysUser.userType
        var data = {
            serialCode: $scope.adjust.serialNo, //流水号
            loginAccount: loginAccount,
            userType: userType
        }
        $scope.prejudgeService.identification(data).success(function (result) {
            if (result.code == PrejudgeConfig.commonConstant.SUCCESS) {
                if (result.result.errorCode == PrejudgeConfig.serviceConstant.SUC_JIANDING) {
                    var url = result.result.openUrl;
                    //查询法院是否对接了鉴定系统请求相对应的方法
                    if(url){
                       
                        if(url.toLowerCase().indexOf("http") != -1){
                            // $scope.newUrl = url
                            // document.getElementById('new_url').click();
                            window.open(url,"_blank")
                        } else {
                            // $scope.newUrl = "http://"+url
                            // document.getElementById('new_url').click();
                            window.open("http://"+url,"_blank")
                        }
                        location.reload();
                    }else{
                        $scope.queryAppraisal($scope.adjust.serialNo);
                    }
                }else{
                    $rootScope.toaster("error", "提示", result.result.errorMessage);
                    $scope.queryAppraisal($scope.adjust.serialNo);
                }
            }else {
                $rootScope.toaster("error", "错误", result.message);
            }
        })
    }

    //公安信息
    function Police (obj) {
        this.serialNo =$scope.adjust.serialNo;
        this.idNo = obj && obj.idNo || ''; //身份证,
        this.accidentNumber = obj &&  obj.accidentNumber ||''; // 事故认定书号
        this.cityCode = obj && obj.cityCode || ''; // 事故发生地地市代码
        this.cityName = obj && obj.cityName ||'';
        this.highSpeed =obj &&  obj.isHighSpeed ||''; ///是否高速
        this.caseType = obj && $scope.co.isAdjust ? '1': '2' ;//1 调解  2 诉讼
    }

    $scope.mediateCode = function(adjust){
        AdjustService.createMediateCode({
            id : adjust.id,
            serialNo : adjust.serialNo,
            operateType : adjust.operateType = '0'
        }).success(function (result) {
            //成功
            if (result.code == AdjustConfig.commonConStant.SUCCESS) {
                adjust.codeFileName = result.result;
            } else {
                //toaster.pop(level, title, $scope.CONSTANT.netWorkError);
            }
        });
    };

    //生成二维码
    /*$scope.createMediateCode = function() {
     AdjustService.createMediateCode({
     id:$scope.adjust.id,
     serialNo: $scope.adjust.serialNo,
     operateType:$scope.adjust.operateType = '0'
     }).success(function(result) {
     //成功
     if (result.code == AdjustConfig.commonConStant.SUCCESS) {
     //$scope.adjust.codeFileName = result.result
     $scope.adjust.codeFileName = result.result?'/lawProject/common/codeFile/' + result.result:'views/images/1(2).png';
     } else {
     //toaster.pop(level.error, title.error, $scope.CONSTANT.netWorkError)
     }
     });
     }*/

    //显示隐藏
    $scope.batchSetting = false;
    $scope.batchSettingTag = function(){
        if($scope.adjust.evidenceArray.length <= 0){
            $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageEvidenceNull);
            return;
        }
        $scope.selectedTagList = [];
        $scope.selectedTagStr = "";
        $scope.batchSetting = !$scope.batchSetting;
    }

    //批量设置标签
    $scope.selectedTagList = [];
    $scope.selectedTagStr = "";
    $scope.batchSelectTag = function(tag){
        if($scope.selectedTagList.map(function(v){
                return v.id
            }).indexOf(tag.id) == -1){
            $scope.selectedTagList.push(tag);
            $scope.selectedTagStr += ","+tag.id;
        }
    }

    //删除标签
    $scope.removeTag = function(tag){
        var tagIndex = $scope.selectedTagList.indexOf(tag);
        $scope.selectedTagList.splice(tagIndex, 1)
        $scope.evidenceTagChanged();
    }

    //批量保存证据标签
    $scope.batchSaveEvidenceTag = function(){
        $scope.adjust.evidenceArray.filter(function(v){
            return v.selected == true;
        }).forEach(function(evidence){
            evidence.chooseTagArray = [];
            evidence.classify = "";
            $scope.selectedTagList.forEach(function(tag){
                evidence.chooseTagArray.push(tag);
                evidence.classify += "," + tag.id;
            })
        })

        $scope.batchSetting = false;
        $scope.evidenceTagChanged();
    }

    $scope.co.filterTag = [];
    $scope.step12EvidenceArray = [];
    $scope.co.existNoTag = false;
    $scope.evidenceTagChanged = function(){
        $scope.co.filterTag =[];
        $scope.adjust.evidenceArray.forEach(function(v){
            if(!v.chooseTagArray || v.chooseTagArray.length==0){
                $scope.co.existNoTag = true;
            }else{
                v.chooseTagArray.forEach(function(tag){
                    if(tag && $scope.co.filterTag.map(function(m){return m.id}).indexOf(tag.id) == -1){
                        $scope.co.filterTag.push(tag);
                    }
                })
            }
        })
        $scope.step12EvidenceArray.forEach(function(v){
            if(!v.chooseTagArray || v.chooseTagArray.length==0){
                $scope.co.existNoTag = true;
            }else{
                v.chooseTagArray.forEach(function(tag){
                    if(tag && $scope.co.filterTag.map(function(m){return m.id}).indexOf(tag.id) == -1){
                        $scope.co.filterTag.push(tag);
                    }
                })
            }
        })
        sessionStorage.setItem($scope.adjust.serialNo,JSON.stringify($scope.step12EvidenceArray));
    }

    /*
    * 调取申请人、被申请人信息
    */
    $scope.acquireApplicantInfo = function () {
        var modalInstance = $modal.open({
          templateUrl: 'views/pages/mediation_platform/acquireMessage/acquireMessage.html',
          controller: 'acquireMessageCtrl',
          size: 'lg',
          backdrop: 'static',
          resolve: {
            loadMyFile: function($ocLazyLoad) {
              return $ocLazyLoad.load({
                name: 'sbAdminApp',
                files: ['scripts/controllers/mediation_platform/acquireMessage/acquireMessage.js']
              })
            },
            items: function() {
              return {
                adjust: $scope.adjust
              };
            }
          }
        });
        //返回值
        modalInstance.result.then(function (data) {
          scope.refreshAllData();
        }, function () {
        });
    }

  ///////////留言板//////////////////
  $scope.openMessageBoard = function () {
      if($scope.adjust.serialNo){
          var modalInstance = $modal.open({
              templateUrl: 'views/pages/messageBoard/messageBoard.html',
              controller: 'openMessageBoardCtrl',
              size: 'lg',
              backdrop: false,
              keyboard:false,
              resolve: {
                  loadMyFile: function($ocLazyLoad) {
                      return $ocLazyLoad.load({
                          name: 'sbAdminApp',
                          files: ['scripts/controllers/messageBoard/messageBoard.js']
                      })
                  },
                  items: function() {
                      return {
                          law: $scope.law,
                          userType:$scope.userType,
                          serialNo:$scope.adjust.serialNo
                      };
                  }
              }
          });
          //返回值
          modalInstance.result.then(function (data) {
              scope.refreshAllData();
          }, function () {
          });
      }else{
          $rootScope.toaster('warn', '友情提示：', '请保存案件后再留言！');
      }
  }
})