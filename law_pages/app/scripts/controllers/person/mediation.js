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

app.controller('personMediationCtrl', function(AppraisalConfig,AppraisalService,$scope,PrejudgeService, toaster, $stateParams, $state, $location, $timeout, $http, $log, $filter, $modal, AdjustService, AdjustConfig, DictionaryConfig, Upload, LoginService,AdminConstant,$rootScope) {
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
    //查询认定书编号
    $scope.queryPoliceBySerialNoService = AdjustService.queryPoliceBySerialNo;
    //费用类型
    $scope.feeTypeList = DictionaryConfig.feeTypeList;
    //证件类型
    $scope.certificateType = DictionaryConfig.certificateTypeConstant;

    //二维码拼接路径
    $scope.codeFilePath = AdjustConfig.adjustConStant.codeFileUrl;

    //获取所有调解机构的部门 （根据区域）
    $scope.queryMediationOrgService = AdjustService.queryMediationOrg;

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
        "isLoading": "正在提交，请稍后"
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
                if (v.personType == 0) v.hashName = applicantSize++;
                else if (v.personType == 1) v.hashName = appelleeSize++;
                if (!v.idFacePicture) v.idFacePicture = $scope.co.defaultImg;
                if (!v.idBackPicture) v.idBackPicture = $scope.co.defaultImg;
                if (!v.businessLicensePicture) v.businessLicensePicture = $scope.co.defaultImg;
                if (!v.legalPersonPicture) v.legalPersonPicture = $scope.co.defaultImg;
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

    function getDate (date) {
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        m = m < 10 ? '0' + m : m;
        var d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        return y + '-' + m + '-' + d;
    };

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
                //查询人伤关联信息
                queryInjureApplyerInfo();
                //查询公安信息
                queryPoliceInfo();

                if($scope.adjust.adjustCityName){
                    queryPointList($scope.adjust.adjustCityName);
                }

                $scope.evidenceTagChanged();
            } else {
                $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageBackend);
            }
        })
    }

    //根据区域名称查询所有调节点的集合
    function queryPointList(adjustCityName){
        //根据区域名称查询查询调节点
        $scope.queryMediationOrgService({
            "adjustCityName":adjustCityName
        }).success(function(result){
            $scope.pointList = result.result;
            $scope.pointList.forEach(function(val){
                if(val.address){
                    val.adjustPointName += '（'+val.address+'）';
                }
            });


        });
    }


    function queryPoliceInfo() {
        $scope.queryPoliceBySerialNoService({"jyAdjustInfoId":$scope.adjust.id}).success(function(res) {
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
        this.legalType = legalType? legalType : '1';
        this.enterpriseType = '1';
        this.isDeath = '2';
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
            $scope.adjust.isSendDocument = $scope.userDepart.isSendDocument
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

    //点击相应步骤跳转页面
    $scope.handleSkipStep = function (step) {
        step = parseInt(step);
        if(step == $scope.co.step || step > $scope.adjust.step) return; //禁止点击当前步骤或未填写的步骤
        //跳转到相应页面
        switch(step) {
            case 1:
                $state.go('dashboard.personMediation.step12', {
                    step: 1
                });
                break;
            case 2:
                $state.go('dashboard.personMediation.step12', {
                    step: 2
                });
                break;
            case 3:
                $state.go('dashboard.personMediation.step3');
                break;
            case 4:
                $state.go('dashboard.personMediation.step4');
                break;
            case 5:
                $state.go('dashboard.personMediation.step5');
                break;
            case 6:
                $state.go('dashboard.personMediation.step6', {"name": $scope.co.step6Url});
                break;
        }
    };

    //下一步操作
    $scope.nextStep = function() {
        if (($scope.co.step == 1 || $scope.co.step == 2) && validateStep12()) {
            $scope.save(function() {
                if ($scope.co.step == 1)
                    $state.go('dashboard.personMediation.step12', {
                        step: 2
                    });
                else $state.go('dashboard.personMediation.step3');
            });
        } else if ($scope.co.step == 3 && validateStep3()) {
            $scope.save(function() {
                $state.go('dashboard.personMediation.step4');
            });
        } else if ($scope.co.step == 4 && validateStep4()) {
            $scope.save(function() {
                $state.go('dashboard.personMediation.step5');
            });
        } else if ($scope.co.step == 5 && validateStep5()) {

        }
    };

    //上一步操作
    $scope.preStep = function() {
        if ($scope.co.step == 2) {
            $state.go('dashboard.personMediation.step12', {
                step: 1
            });
        } else if ($scope.co.step == 3) {
            $state.go('dashboard.personMediation.step12', {
                step: 2
            });
        } else if ($scope.co.step == 4) {
            $state.go('dashboard.personMediation.step3');
        } else if ($scope.co.step == 5) {
            $state.go('dashboard.personMediation.step4');
        } else if ($scope.co.step == 6) {
            $state.go('dashboard.personMediation.step5');
        }
    };

    $scope.showRespondentFilter = function(e) {  //在申请人与被申请人中找出被申请人
        var temp = e.responsibleRate ? e.responsibleRate != -1 : e.responsibleRate == 0 ? true : false;
        return e.personType == 1 && (e.idType == '0' || e.idType == '2' || (e.idType == '1' && e.enterpriseType != '1')) && temp;
    };

    //保存操作
    $scope.save = function(goState, preCond,insert) {

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
        }

        var saveFlag = goState;
        var isGoStep2 = goState ? true: false;
        goState = goState || function() {};
        preCond = preCond || function() {};

        if(isGoStep2 && $scope.co.step+1 > $scope.adjust.step) $scope.adjust.step = $scope.co.step + 1;

        var adjust = angular.copy($scope.adjust), url = $location.url();

        filterParam(adjust);
        $scope.adjustService.savePersonAdjust(adjust).success(function(result) {
            if (result.code == AdjustConfig.commonConStant.SUCCESS) {
                $log.info(result);
                if(!saveFlag && saveFlag != 0){
                    $rootScope.toaster(level.success, title.success, $scope.CONSTANT.messageSaveSuccess);
                }
                if(url.indexOf("//") > -1) {
                    if(isGoStep2){
                        $location.url('/dashboard/personMediation/'+result.result.id+'/step12/2');
                    } else{
                        $location.url('/dashboard/personMediation/'+result.result.id+'/step12/1');//防止刷新丢失数
                    }
                    $scope.mediateCode(result.result);
                    return;
                }
                //赋值返回值
                $scope.adjust.id = result.result.id;
                $scope.adjust.serialNo = result.result.serialNo;
                $scope.adjust.state = result.result.state;
                $scope.adjust.regulationNo = result.result.regulationNo;
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
                    if(!fee.claimAmount){
                        fee.claimAmount = 0;
                    }
                    if(!fee.extraAmount){
                        fee.extraAmount = 0;
                    }
                    fee.claimAndExtraAmount = parseFloat(fee.extraAmount) + parseFloat(fee.claimAmount);
                    fee.claimAndExtraAmount = fee.claimAndExtraAmount.toFixed(2);
                });

                preCond();
                goState();

                if(insert){
                    //插入流程表
                   $scope.insertWorkFlow();
                }
            } else {
                $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageBackend);
            }
        })
    };

    //提交调解信息 TODO
    var isLoading = false;  //表示是否正在提交数据
    $scope.submitAdjust = function() {

        if(validateStep5()){
            if(confirm("确定要提交吗？")){
                $scope.adjust.state = "2001";
                $scope.save(0,0,1);
                isLoading = true;
            }
        }


    };
    //插入流程表
    $scope.insertWorkFlow = function () {

        var workFlowData = initWorkFlowData($scope.adjust);
        //插入流程表信息
        $scope.adjustService.insertJyWorkFlow({
            type: "001",
            orgCode: $scope.adjust.adjustOrgCode,
            orgName: $scope.adjust.adjustOrgName,
            jyAdjustInfoId:$scope.adjust.id,
            result: '0',
            resultName: "提交审核",
            tempData: JSON.stringify(workFlowData)
        }).success(function(result) {
            if (result.code == AdjustConfig.commonConStant.SUCCESS) {
                //成功跳转页面
                var sendInfo = angular.toJson({type:"1000",result:5});
                $state.go("dashboard.pending_complete",{pageInfo:sendInfo});
            } else {
                $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageBackend);
            }
        })
    };

    var initWorkFlowData = function(adjust){
        var workFlowData = new DictionaryConfig.workFlowData();
        workFlowData.adjustOrgName = adjust.adjustOrgName;
        workFlowData.adjustPointName = adjust.adjustPointName;
        workFlowData.applyTotal = adjust.applyTotal;

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
        if (!respondents.length) {
            $rootScope.toaster(DictionaryConfig.levelConstant.warn, DictionaryConfig.titleConstant.warn, $scope.CONSTANT.messageRespondentError);
            return false;
        }
        for(var i = 0; i < respondents.length; i++){
            var v = respondents[i];
            if (v.isVehicle == 1) {
                if (!v.plateNo) {
                    $rootScope.toaster(DictionaryConfig.levelConstant.warn, DictionaryConfig.titleConstant.warn, $scope.CONSTANT.messageRespondentPlateNo);
                    return false;
                }
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

        //调解机构
        if(!$scope.adjust.adjustCityName){
            $rootScope.toaster(DictionaryConfig.levelConstant.warn, DictionaryConfig.titleConstant.warn, "请在调解点选择栏中选择所在城市！");
            return false;
        }

        //调解机构
        if(!$scope.adjust.adjustPointCode){
            $rootScope.toaster(DictionaryConfig.levelConstant.warn, DictionaryConfig.titleConstant.warn, "请在调解点选择栏中选择调解资源！");
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
                    if ($scope.co.step == 1) {
                        $rootScope.toaster(DictionaryConfig.levelConstant.warn, DictionaryConfig.titleConstant.warn, $scope.CONSTANT.messageApplicantNameNull); //申请人
                    } else {
                        $rootScope.toaster(DictionaryConfig.levelConstant.warn, DictionaryConfig.titleConstant.warn, $scope.CONSTANT.messageRespondentNameNull); //被申请人
                    }
                    return false;
                } else v.personNameError = undefined;
            }
            //法人
            if (v.idType == "1") {
                //企业名称
                if (!v.orgName) {
                    v.orgNameError = true;
                    $rootScope.toaster(DictionaryConfig.levelConstant.warn, DictionaryConfig.titleConstant.warn, $scope.CONSTANT.messageOrgNameNull);
                    return false;
                } else v.orgNameError = undefined;
            }
            //其他组织
            if (v.idType == "2") {
                //组织名称
                if (!v.orgName) {
                    v.orgNameError = true;
                    $rootScope.toaster(DictionaryConfig.levelConstant.warn, DictionaryConfig.titleConstant.warn, $scope.CONSTANT.messageOrgNameNull);
                    return false;
                } else v.orgNameError = undefined;
            }

            if(v.personType==0) {
                if (v.idType == "0") {//公民
                    //证件号码
                    if (!v.idNo) {
                        v.idNoError = true;
                        $rootScope.toaster(DictionaryConfig.levelConstant.warn, DictionaryConfig.titleConstant.warn, $scope.CONSTANT.messageIdNoNull);
                        return false;
                    } else if (v.certificatesType == 0 && !checkIdentity(v)) {
                        return false;
                    } else v.idNoError = undefined;
                    // 出生日期
                    if (!v.birthDay) {
                        v.birthDayError = true;
                        $rootScope.toaster(DictionaryConfig.levelConstant.warn, DictionaryConfig.titleConstant.warn, $scope.CONSTANT.messageBirthdayNull);
                        return false;
                    } else v.birthDayError = undefined;
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
                    if (($scope.userDepart.isPassDocument == '0' || $scope.userDepart.isEndDocument == '0') && !v.isEmail && v.isEmail != '0') {
                        v.isEmailError = true;
                        $rootScope.toaster(DictionaryConfig.levelConstant.warn, DictionaryConfig.titleConstant.warn, $scope.CONSTANT.messageIsEmailNull);
                        return false;
                    } else v.isEmailError = undefined;
                }
                //法人
                if (v.idType == "1") {
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
                    if (!v.isEmail && v.isEmail != '0') {
                        v.isEmailError = true;
                        $rootScope.toaster(DictionaryConfig.levelConstant.warn, DictionaryConfig.titleConstant.warn, $scope.CONSTANT.messageIsEmailNull);
                        return false;
                    } else v.isEmailError = undefined;
                    //邮箱
                    if (v.email && !mailReg.test(v.email)) {
                        v.emailError = true;
                        $rootScope.toaster(DictionaryConfig.levelConstant.warn, DictionaryConfig.titleConstant.warn, $scope.CONSTANT.messageEmailFormatError);
                        return false;
                    } else v.emailError = undefined;
                    if (v.personType == 1 && v.enterpriseType == 1) {//保险公司
                        if (!v.plateNo) {
                            v.plateNoError = true;
                            $rootScope.toaster(DictionaryConfig.levelConstant.warn, DictionaryConfig.titleConstant.warn, $scope.CONSTANT.messagePlateNoNull);
                            return false;
                        } else v.plateNoError = undefined;
                        var appelleeArray = applicantList.filter(function (m) {
                            return m.personType == 1
                        });
                        for (var j = 0; j < appelleeArray.length; j++) {
                            var appellee = appelleeArray[j];
                            if (!appellee.plateNo) {
                                appellee.plateNoError = true;
                                $rootScope.toaster(DictionaryConfig.levelConstant.warn, DictionaryConfig.titleConstant.warn, $scope.CONSTANT.messagePlateNoNull);
                                $("#plateNo").focus();
                                return false;
                            } else appellee.plateNoError = undefined;
                        }
                    }
                }
                //其他组织
                if (v.idType == "2") {
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
                    if (!v.isEmail && v.isEmail != '0') {
                        v.isEmailError = true;
                        $rootScope.toaster(DictionaryConfig.levelConstant.warn, DictionaryConfig.titleConstant.warn, $scope.CONSTANT.messageIsEmailNull);
                        return false;
                    } else v.isEmailError = undefined;
                    //邮箱
                    if (v.email && !mailReg.test(v.email)) {
                        v.emailError = true;
                        $rootScope.toaster(DictionaryConfig.levelConstant.warn, DictionaryConfig.titleConstant.warn, $scope.CONSTANT.messageEmailFormatError);
                        return false;
                    } else v.emailError = undefined;
                }
                //Agent
                if (v.agentArray) {
                    for (var j = 0; j < v.agentArray.length; j++) { //多个代理人
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

                                if (m.agentIdentityItem == "1" && !m.relation) {
                                    $rootScope.toaster(DictionaryConfig.levelConstant.warn, DictionaryConfig.titleConstant.warn, "与申请人关系不能为空!");
                                    return false;
                                }
                                //证件号码
                                if (!m.idNo) {
                                    m.idNoError = true;
                                    $rootScope.toaster(DictionaryConfig.levelConstant.warn, DictionaryConfig.titleConstant.warn, $scope.CONSTANT.messageIdNoNull);
                                    return false;
                                } else if (m.certificatesType == '0' && !checkIdentity(m, true)) {
                                    return false;
                                } else m.idNoError = undefined;

                                if (!m.birthDay) {
                                    $rootScope.toaster(DictionaryConfig.levelConstant.warn, DictionaryConfig.titleConstant.warn, "代理人生日不能为空!");
                                    return false;
                                }
                                if (!m.sex) {
                                    $rootScope.toaster(DictionaryConfig.levelConstant.warn, DictionaryConfig.titleConstant.warn, "代理人性别不能为空!");
                                    return false;
                                }
                                if (!m.nation) {
                                    $rootScope.toaster(DictionaryConfig.levelConstant.warn, DictionaryConfig.titleConstant.warn, "代理人民族不能为空!");
                                    return false;
                                }
                            }
                            //证件号码
                            if (!m.idNo) {
                                m.idNoError = true;
                                $rootScope.toaster(DictionaryConfig.levelConstant.warn, DictionaryConfig.titleConstant.warn, $scope.CONSTANT.messageIdNoNull);
                                return false;
                            } else if (m.certificatesType == '0' && !checkIdentity(m, true)) {
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
                            if (!m.companyName && (m.agentIdentity == '0' || m.agentIdentity == '2')) {//律师与法律工作者验证单位
                                m.companyNameError = true;
                                $rootScope.toaster(DictionaryConfig.levelConstant.warn, DictionaryConfig.titleConstant.warn, $scope.CONSTANT.messageUnitNameNull);
                                return false;
                            } else m.companyNameError = undefined;


                            if (!m.domicile && m.agentIdentity == '1') {//公民时需要填写户籍地
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
        if (applicant.certificatesType == 0 && applicant.idNo) {
            applicant.idNo = applicant.idNo.replace(/ /g, "");
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
            } else {
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
            if (isAgent && applicant.certificatesType!=0) {
                applicant.birthDay = applicant.sex = undefined;
            }
        }
        return true;
    };

    function initOrg(){
        $scope.userDepart = LoginService.user.sysUser.userDepartList[LoginService.user.sysUser.currentOrg];
        var url = $state.href("appraisal_notice",{serialNo:$scope.adjust.serialNo,caseType:'1',orgId:$scope.userDepart.orgId,orgName:$scope.userDepart.orgName, name:"appraisal_notice",pointId:$scope.adjust.adjustPointCode,pointName:$scope.adjust.adjustPointName});

        AdjustService.getForwardUrl({
            orgId:$scope.adjust.lawOrgId
        }).success(function(res){
            if(res.result && res.result.identificationInformationDoc){
                url = $state.href("appraisal_notice",{serialNo:$scope.adjust.serialNo,caseType:'1',orgId:$scope.userDepart.orgId,orgName:$scope.userDepart.orgName, name:res.result.identificationInformationDoc,pointId:$scope.adjust.adjustPointCode,pointName:$scope.adjust.adjustPointName});
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
                    if(result.result.state == DictionaryConfig.appraisalState.finishState || result.result.state == DictionaryConfig.appraisalState.temporaryState){
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
                    $state.go("dashboard.appraisalQueryDetail",{serialNo:$scope.appraisalInfo.serialNo,personType:$scope.appraisalInfo.personType,appraisalInfoId:$scope.appraisalInfo.appraisalInfoId});
                }
            }
        });
    };

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
                    $scope.save();
                    //查询法院是否对接了鉴定系统请求相对应的方法
                    url?window.location.href=url:$scope.queryAppraisal($scope.adjust.serialNo);
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
                    if($scope.co.filterTag.map(function(m){return m.id}).indexOf(tag.id) == -1){
                        $scope.co.filterTag.push(tag);
                    }
                })
            }
        })
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
})