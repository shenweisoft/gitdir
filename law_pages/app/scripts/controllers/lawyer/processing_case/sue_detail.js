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

app.controller('SueDetailCtrl', function($scope, toaster, $stateParams, $state, $location, $timeout, $http, $log, $filter, $modal, LawService, LawConfig, DictionaryConfig, Upload, LoginService, AdjustService,AppraisalService,AppraisalConfig,$rootScope) {
  $scope.lawService = LawService;
  $scope.adjustService = AdjustService;
  //费用类型
  $scope.feeTypeList = DictionaryConfig.feeTypeList;
  //案由类型
  $scope.factTypeList = DictionaryConfig.factTypeList;
  //代理人身份子类型
  $scope.agentIdentifySubList = DictionaryConfig.agentIdentifySubList;
  //查询鉴定Service
  $scope.queryInHandAppraisalInfoService = AppraisalService.queryInHandAppraisalInfo;
  //与申请人的关系
  $scope.relationArray = DictionaryConfig.relation2Applicant;
  //证件类型
  $scope.certificateType = DictionaryConfig.certificateTypeConstant;

  $scope.claiminfoInfoNew = {};

  function init(){
      $scope.user  = LoginService.user;
  }
  //获取用户
  if(LoginService.user.userPermissions){
      init();
  }
  $scope.$on('user2Child', function(event){
      init();
  });

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
    "messageApplicantNameNull": "当事人姓名不能为空",
    "messageIdTypeNull": "证件类型不能为空",
    "messageIdNoNull": "证件号码不能为空",
    "messageIdentityFormatError": "身份证号格式不正确",
    "messageAgentTypeNull": "代理类型不能为空",
    "messageBirthDayNull": "出生日期不能为空",
    "messageNationNull": "民族不能为空",
    "messageTelephoneNull": "手机号码不能为空",
    "messageTelephoneFormatError": "手机号码格式不正确",
    "messageAgentTelephoneNull": "代理人手机号码不能为空",
    "messageAgentTelephoneFormatError": "代理人手机号码格式不正确",
    "messageEmailFormatError": "邮箱格式不正确",
    "messageDomicileNull": "户籍所在地不能为空",
    "messageSendAddressNull": "送达地址不能为空",
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
    "messageRespondentError":"请选择责任人",
    "messageLawMoneyDetailError":"请填写具体损失金额",
    "messageRespondentPlateNo":"请填写责任人车牌号",
    "messageForceCompanyError":"请选择责任人交强险投保保险公司",
    "messageBusinessError":"请选择责任人商业险投保保险公司",
    "messageAtleastOneApplicant": "至少有一个申请人",
    "messageAtleastOneNoApplicant": "至少有一个被申请人",
    "appraisalError":"鉴定环节没有完成，不能提交诉讼",
    "dutyRatio": "责任比率不可大于100%",
    "isLoading": "正在提交，请稍后",
    "messagepPlateNo": "车牌号有误，请重新填写",
  }

  // common object share by stepxx controller
  $scope.co = {
    mainFlow: true,
    defaultImg: "views/images/_r2_c2.png",
    stepArray: [{
      id: "2",
      value: "被告"
    }, {
      id: "3",
      value: "事实与理由"
    }, {
      id: "4",
      value: "添加证据"
    }, {
      id: "5",
      value: "诉请信息"
    }, {
      id: "6",
      value: "诉状信息"
    }],
    addEvidenceShow:false,
    lblApplicant: "原告",
    lblRespondent: "被告",
    removeApplicant: function(applicant) {
      if ($scope.adjust.applicantArray.filter(function(v){return v.personType==applicant.personType;}).length > 1) {
        var index = $scope.adjust.applicantArray.indexOf(applicant);
        if (applicant.id) {
          $scope.lawService.removeApplicant({
            "id": applicant.id
          }).success(function(result) {
            if (result.code == LawConfig.commonConstant.SUCCESS) {
              $scope.adjust.applicantArray.splice(index, 1);
            } else if (result.code == LawConfig.commonConstant.FAILURE) {
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
    },
    removeAgent: function(applicant, agent) {
      var index = applicant.agentArray.indexOf(agent);
      if (agent.id) {
        $scope.lawService.removeAgent({
          "id": agent.id
        }).success(function(result) {
          if (result.code == LawConfig.commonConstant.SUCCESS) {
            applicant.agentArray.splice(index, 1);
          } else if (result.code == LawConfig.commonConstant.FAILURE) {
            $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageAgentRemoveError);
          }
        });
      } else {
        applicant.agentArray.splice(index, 1);
      }
    },
    generateDocument: function() {
      function documentBuild(text) {
        var bodyObj = '<body class="b1 b2">' + text + '</body>';
        return bodyObj;
      }
      
      var result = $('#mediationDocument').html();
      result = documentBuild(result);

      LawService.buildWord({
        serialNo: $scope.adjust.serialNo,
        type: DictionaryConfig.caseVerifyResultCode[1].code,
        wordType:"4",
        fileName: "起诉状",
        content: result
      }).success(function(result) {
        if (result.code == LawConfig.commonConstant.FAILURE) {
          $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageBackend);
        }
      })
    }
  };
  $scope.dutyRatio = {};  //存储责任比率对象
  
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
      adjust.applicantArray.forEach(function(v) {
          //绝对免赔率集合
          v.absDeductibleList = angular.copy(DictionaryConfig.absDeductibleList);
          //绝对免赔率
          if(v.absDeductibleStr){
              v.absDeductibleStr.split(",").forEach(function(k){
                  var absDeductibleSel = _.find(v.absDeductibleList, {id: k}) || {};
                  absDeductibleSel.selected = true;
              });
          }
        if (v.birthDay) v.birthDay = parseISO8601(v.birthDay);
        if (v.riskTypes) v.riskTypes = JSON.parse(v.riskTypes);
        if (v.personType == 0) v.hashName = applicantSize++;
        else if (v.personType == 1) v.hashName = appelleeSize++;
        if (v.agentArray) {
          var agentIndex = 1;
          v.agentArray.forEach(function(m) {
            if (m.birthDay) m.birthDay = parseISO8601(m.birthDay);
            if(m.agentIdentityItem)m.agentIdentityItem =m.agentIdentityItem.toString();
            if(m.relation)m.relation = m.relation.toString();
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
    if (adjust.payDate) adjust.payDate = parseISO8601(adjust.payDate);//new Date(adjust.payDate);
    if ($scope.adjust.lawMoney) $scope.adjust.willPayTotal = $scope.adjust.lawMoney - $scope.adjust.paidTotal;
    if($scope.adjust.applyTotal && $scope.adjust.paidTotal) $scope.adjust.willPayTotal = $scope.adjust.applyTotal - $scope.adjust.paidTotal;

  }

  //查询调解单
  if ($stateParams.serialNo || $stateParams.id) {
    $scope.lawService.queryLawInfo({
      "serialNo": $stateParams.serialNo,
        "swId":$stateParams.id
    }).success(function(result) {
      var data = result.result;
      if (result.code == LawConfig.commonConstant.SUCCESS) {
        $scope.adjust = data;
        if(!$scope.adjust.step) $scope.adjust.step = 1;
        //将每个责任人比率存入对象
        _.each($scope.adjust.applicantArray, function(obj) {
            if(obj.responsibleRate) {
                $scope.dutyRatio[obj.personName] = obj.responsibleRate
            }
        });
        $scope.codeFileName = $scope.adjust.codeFileName ? LawConfig.lawConstant.lawCodeFileUrl + $scope.adjust.codeFileName : "views/images/1(2).png";
        filterQuery(data);
        viewStep6Url();

        $scope.adjust.compensateRateDeath = 100;
      } else {
        $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageBackend);
      }
    })
  }

  $scope.co.Applicant = function(personType) {
    this.personType = personType;
    this.sex = "0";
    this.legalType = '1';
    this.enterpriseType = '1';
    this.certificatesType = "0";
    this.idType = "0";
    this.isDeath = '2';
    this.idFacePicture = $scope.co.defaultImg;
    this.idBackPicture = $scope.co.defaultImg;
    this.businessLicensePicture = $scope.co.defaultImg;
    this.legalPersonPicture = $scope.co.defaultImg;
    var hashIndex = $scope.adjust.applicantArray.length + 1;
    var hashName = $scope.adjust.applicantArray.filter(function(v) {
      return v.personType == personType;
    }).length + 1;
    this.hashIndex = hashIndex
    this.hashName = hashName;
    this.agentArray = [];
    //绝对免赔率集合
    this.absDeductibleList = angular.copy(DictionaryConfig.absDeductibleList);
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
    this.idFront = $scope.co.defaultImg;
    this.idBack = $scope.co.defaultImg;
    this.lawyerCard = $scope.co.defaultImg;
    this.relationSupport = $scope.co.defaultImg;
    this.entrustFile = $scope.co.defaultImg;
    this.feeCertificate = $scope.co.defaultImg;
    this.letterFile = $scope.co.defaultImg;
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
    "step": "1"
  };
  $scope.adjust.applicantArray.push(new $scope.co.Applicant(0));
  $scope.adjust.applicantArray.push(new $scope.co.Applicant(1));

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
    if(adjust.applyTotal) {
      if(!adjust.lawMoney){
        adjust.lawMoney = adjust.applyTotal;
      }
      if(!$scope.adjust.lawMoney){
        $scope.adjust.lawMoney = adjust.applyTotal;
      }
    }
    if (adjust.compensateStandard && adjust.compensateStandard instanceof Object) adjust.compensateStandard = JSON.stringify(adjust.compensateStandard);
    if (adjust.compensateTable && adjust.compensateTable instanceof Object) adjust.compensateTable = JSON.stringify(adjust.compensateTable);
    if (adjust.feeDetail && adjust.feeDetail instanceof Object) adjust.feeDetail = JSON.stringify(adjust.feeDetail);
    if (adjust.deathDate) adjust.deathDate = $filter('date')(adjust.deathDate, 'yyyy-MM-dd HH:mm:ss');
    if (adjust.payDate) adjust.payDate = $filter('date')(adjust.payDate, 'yyyy-MM-dd HH:mm:ss');
    if (adjust.adjustDate) adjust.adjustDate = $filter('date')(adjust.adjustDate, 'yyyy-MM-dd HH:mm:ss');
  }
  
  var viewStep6Url = function(){
    if($scope.adjust.lawOrgId){
      AdjustService.getForwardUrl({
        orgId:$scope.adjust.lawOrgId
      }).success(function(res){

        var currentApplicants = $scope.adjust.applicantArray.filter(function(v) {
            return v.personType == 0;
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

        var  willPayTotal = $scope.adjust.applyTotal-$scope.adjust.paidTotal;

        if(res.result && res.result.civilJudgmentDoc) {
          if($scope.adjust.paidTotal){
              $scope.text = "一、要求被告"+currentBg+"赔偿原告"+currentApplicants+""+$scope.adjust.applyTotal+"元，其中"+currentFee+"，扣除被告已支付的"+$scope.adjust.paidTotal+"，尚余"+willPayTotal+"元未支付。";
          }
          $scope.co.step6Url = res.result.civilJudgmentDoc;
        }else{
          if($scope.adjust.paidTotal){
              $scope.text = "一、要求被告"+currentBg+"赔偿原告"+currentApplicants+""+$scope.adjust.applyTotal+"元，其中"+currentFee+"，扣除被告已支付的"+$scope.adjust.paidTotal+"，尚余"+willPayTotal+"元未支付。";
          }
          $scope.co.step6Url = 'step6';
        }
      })
    }
  }
  
  $scope.gotoStep6 = function(){
    $state.go('dashboard.sue_detail.step6', {"name": $scope.co.step6Url});
  }

  //点击相应步骤跳转页面
  $scope.handleSkipStep = function (step) {
    step = parseInt(step);
    if(step == $scope.co.step || step > $scope.adjust.step) return; //禁止点击当前步骤或未填写的步骤
    //跳转到相应页面
    switch(step) {
      case 1:
        $state.go('dashboard.sue_detail.step12', {
          step: 1
        });
        break;
      case 2:
        $state.go('dashboard.sue_detail.step12', {
          step: 2
        });
        break;
      case 3:
        $state.go('dashboard.sue_detail.step3');
        break;
      case 4:
        $state.go('dashboard.sue_detail.step4');
        break;
      case 5:
        $state.go('dashboard.sue_detail.step5');
        break;
      case 6:
        $state.go('dashboard.sue_detail.step6', {"name": $scope.co.step6Url});
        break;
    }
  };

  //下一步操作
  $scope.nextStep = function() {
    if (($scope.co.step == 1 || $scope.co.step == 2) && validateStep12()) {
      $scope.save(function() {
        if ($scope.co.step == 1)
          $state.go('dashboard.sue_detail.step12', {
            step: 2
          });
        else $state.go('dashboard.sue_detail.step3');
      });
    } else if ($scope.co.step == 3 && validateStep3()) {
      $scope.save(function() {
        $state.go('dashboard.sue_detail.step4');
      });
    } else if ($scope.co.step == 4 && validateStep4()) {
      $scope.save(function() {
        $state.go('dashboard.sue_detail.step5');
      });
    } else if ($scope.co.step == 5 && validateStep5()) {
      $scope.save(function() {
        $scope.co.generateDocument();
        $scope.gotoStep6();
        viewStep6Url();
      }, function() {
        $scope.co.calculate();
      });
    }
  };
  
  //上一步操作
  $scope.preStep = function() {
    if ($scope.co.step == 2) {
      $state.go('dashboard.sue_detail.step12', {
        step: 1
      });
    } else if ($scope.co.step == 3) {
      $state.go('dashboard.sue_detail.step12', {
        step: 2
      });
    } else if ($scope.co.step == 4) {
      $state.go('dashboard.sue_detail.step3');
    } else if ($scope.co.step == 5) {
      $state.go('dashboard.sue_detail.step4');
    } else if ($scope.co.step == 6) {
      $state.go('dashboard.sue_detail.step5');
    }
  };

  $scope.showRespondentFilter = function(e) {  //在申请人与被申请人中找出被申请人
    var temp = e.responsibleRate ? e.responsibleRate != -1 : e.responsibleRate == 0 ? true : false;
    return e.personType == 1 && (e.idType == '0' || e.idType == '2' || (e.idType == '1' && e.enterpriseType != '1')) && temp;
  };

  //保存操作
  $scope.save = function(goState, preCond) {
    //当是第五步时  检查责任比率
    if(window.location.href.indexOf('step5') != -1) {
      //重置责任比例对象
      $scope.dutyRatio = {};
      //将每个责任人比率存入对象
      _.each($scope.adjust.applicantArray, function(obj,i) {
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
    }

    var saveFlag = goState;
    var isGoStep2 = goState ? true: false;
    goState = goState || function() {};
    preCond = preCond || function() {};

    //点击下一步时，step+1
    if(isGoStep2 && $scope.adjust.step < 6) $scope.adjust.step = parseInt($scope.adjust.step)+1;
    //当前步骤大于数据库中step时，赋值当前步骤
    if($scope.co.step > $scope.adjust.step) {
      $scope.adjust.step = $scope.co.step
    }
    //组织参数
    if($stateParams.courtCode){
        $scope.adjust.lawPersonType = '1';
        $scope.adjust.courtCode = $stateParams.courtCode;
    }
    var adjust = angular.copy($scope.adjust);
    //将伤残等级属性删除
    delete adjust.disabilityGradeId;
    filterParam(adjust);
    preCond();

    $scope.lawService.saveLawCase(adjust).success(function(result) {
      if (result.code == LawConfig.commonConstant.SUCCESS) {
        if(!saveFlag && saveFlag != undefined){
          $rootScope.toaster(level.success, title.success, "保存成功!");
        }
        $scope.adjust.serialNo = result.result.serialNo;
        $scope.adjust.id = result.result.id;
        $scope.adjust.compensateRateDeath = 100;

        var url = $location.url();
        if(url){
          var urlArray = url.split("//");
          if(urlArray.length > 2){
              if(isGoStep2){
                  $location.url('/dashboard/sue_detail//'+$stateParams.courtCode+'/'+result.result.id+'/step12/2');
              } else{
                  $location.url('/dashboard/sue_detail//'+$stateParams.courtCode+'/'+result.result.id+'/step12/1');//防止刷新丢失数
              }

              return;
          }
        }

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
        })
        goState();
        if(!$scope.co.step6Url){
          viewStep6Url();
        }
        $scope.createLawInfoCode(result.result);
      } else {
        $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageBackend);
      }
    })
  };

  function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
        + " " + date.getHours() + seperator2 + date.getMinutes()
        + seperator2 + date.getSeconds();
    return currentdate;
  }
  //提交调解信息
  $scope.submitLawCase = function() {
    if(confirm("提交诉讼后，不可撤回，确定要提交吗？")){
      //如果发起鉴定并且没有完成，则不让调解完成
      $scope.queryInHandAppraisalInfoService({
        serialNo:$scope.adjust.serialNo,
          swId:$stateParams.id
      }).success(function (result) {
        if (result.code == AppraisalConfig.commonConstant.SUCCESS) {
          //如果没发鉴定 或者发送鉴定并且已经完成可以调解完成
          if(!result.result ||(result.result && result.result.state == DictionaryConfig.appraisalState.finishState)){
            //当前状态
            $scope.currentState = $scope.adjust.state;
            $scope.adjust.state = DictionaryConfig.lawState.prosecutionFinishState;
            $scope.adjust.isReturn = "0";
            //修改诉讼时间
            $scope.adjust.adjustDate = getNowFormatDate();
            $log.info($scope.adjust.adjustDate);
            $scope.adjust.evidenceArray.forEach(function(v) { //提交所有的证据
              v.delFlag = 0;
            })
            $scope.save(undefined);

            var workFlowData = initWorkFlowData($scope.adjust);

            //插入流程表信息
            $scope.lawService.insertJyWorkFlow({
              type: "101",
              serialNo: $scope.adjust.serialNo,
              result: '4',
              resultName: '已提交诉讼',
              tempData: JSON.stringify(workFlowData)
            }).success(function(result) {
              if (result.code == LawConfig.commonConstant.SUCCESS) {
                //成功跳转页面
                var sendInfo = angular.toJson({type:$scope.currentState});
                $state.go("dashboard.pending_complete",{pageInfo:sendInfo});
              } else {
                $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageBackend);
              }
            })
          }else{
            $rootScope.toaster(level.error, title.error, $scope.CONSTANT.appraisalError);
          }
        }
      });
    }

  };
  
  var initWorkFlowData = function(adjust){
    var workFlowData = new DictionaryConfig.workFlowData();
    workFlowData.serialNo = adjust.serialNo;
    workFlowData.adjustOrgName = adjust.adjustOrgName;
    workFlowData.adjustPointName = adjust.adjustPointName;
    workFlowData.regulationNo = adjust.regulationNo;
    workFlowData.lawMoney = adjust.lawMoney;
    workFlowData.adjustDate = adjust.adjustDate;
    workFlowData.adjustResult = adjust.adjustResult;
  
    return workFlowData;
  }

  var validateStep3 = function() {
    if (!$scope.adjust.factReason) {
      $scope.adjust.factReasonError = true;
      $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageReasonNull);
      return false;
    } else $scope.adjust.factReasonError = undefined;
    return true;
  };

  var validateStep4 = function() {
    if ($scope.adjust.evidenceArray){
      var length = $scope.adjust.evidenceArray.length;
      for (var i = 0; i <length ;i++ ) {
        var e = $scope.adjust.evidenceArray[i];
        if (!e.name) {
          e.nameError = true;
          $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageEvidenceNameNull);
          return false;
        } else e.nameError = undefined;

     /*   if (!e.description) {
          e.descriptionError = true;
          toaster.pop(level.error, title.error, $scope.CONSTANT.messageEvidenceDescriptionNull);
          return false;
        } else e.descriptionError = undefined;*/

      /*  if (!e.classify && e.delFlag == '2') {
          $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageEvidenceClassifyNull);
          return false;
        }*/
      }
    }
    return true;
  };

  var validateStep5 = function() {
    if (!$scope.adjust.regionName) {
      $scope.adjust.regionNameError = true;
      $rootScope.toaster(level.error, title.error, "赔偿地不能为空!");
      return false;
    } else $scope.adjust.regionNameError = undefined;

    /*if (!$scope.adjust.adjustDate) {
      $scope.adjust.adjustDateError = true;
      $rootScope.toaster(level.error, title.error, "调解日期不能为空!");
      return false;
    } else $scope.adjust.adjustDateError = undefined;*/

    /*if (!$scope.adjust.adjustResult) {
      $rootScope.toaster(level.error, title.error, "调解结果不能为空!");
      return false;
    }*/
  
    if (!$scope.adjust.compensateTable) {
      $rootScope.toaster(level.error, title.error, "请重新计算诉请金额!");
      return false;
    }
  
    var respondents = $scope.adjust.applicantArray.filter(function(e) {
      return e.personType == 1 && (e.idType == '0' || e.idType == '2' || e.idType == '1') && e.riskTypes;
    });
    if (!respondents.length) {
      $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageRespondentError);
      return false;
    }
    if(!$scope.adjust.feeDetail){
      $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageLawMoneyDetailError);
      return false;
    }
    for(var i=0; i< respondents.length;i++){
      var v = respondents[i];
      if (v.isVehicle == 1) {
        if (!v.plateNo) {
          $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageRespondentPlateNo);
          return false;
        }
        /*if (!v.insuranceForceCompany) {
          $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageForceCompanyError);
          return false;
        }*/
        if ((v.riskTypes['1'] || v.riskTypes['2']) && !v.insuranceBusinessCompany) {//选择三者险/不计免赔
          $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageBusinessError);
          return false;
        }
      }
    }

    return true;
  };
  //验证当事人
  var validateStep12 = function() {
    var applicantList = $scope.adjust.applicantArray.filter(function(v) {
      return $scope.co.step - 1 == v.personType;
    });

    function clearIdType(v) {
      if (v.idType == "0") { //公民
        v.orgName = undefined;
        v.legalName = undefined;
        v.job = undefined;
        v.orgCode = undefined;
        v.registerCode = undefined;
      } else { //法人
        v.personName = undefined;
        v.idNo = undefined;
        v.sex = undefined;
        v.birthDay = undefined;
        v.nation = undefined;
        v.domicile = undefined;
        if (v.idType == "2") {
          v.registerCode = undefined; //其他
          if (v.personType == 1) { // 被告
            v.lossNo = undefined;
            v.companyName = undefined;
          }
        }
      }
    };

    function clearAgentType(m) {
      if (m.agentType == "0") { //委托
       // m.residence = undefined;
        //m.domicile = undefined;
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
    for (var i =0; i< applicantList.length;i++) {
      var v = applicantList[i];
      //公民
      clearIdType(v);
      if (v.idType == "0") {
        //原告姓名
        if (!v.personName) {
          v.personNameError = true;
          $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageApplicantNameNull);
          return false;
        } else v.personNameError = undefined;

        //证件号码
        if (!v.idNo) {
          v.idNoError = true;
          $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageIdNoNull);
          return false;
        } else if(v.certificatesType=='0' && !checkIdentity(v)){
          return false;
        } else v.idNoError = undefined;
        //民族
        if (!v.nation) {
          v.nationError = true;
          $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageNationNull);
          return false;
        } else v.nationError = undefined;
        //手机号码
        if (!v.telephone && $scope.co.lblApplicant == '原告' && $scope.co.step != '2') {
          v.telephoneError = true;
          $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageTelephoneNull);
          return false;
        } else {
          v.telephoneError = undefined;
          var phoneReg = /^((0\d{2,3}-\d{7,8})|(1[35847]\d{9}))$/;
          if (!phoneReg.test(v.telephone) && $scope.co.lblApplicant == '原告' && $scope.co.step != '2') {
            v.telephoneError = true;
            $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageTelephoneFormatError);
            return false;
          } else v.telephoneError = undefined;
        }
        //户籍所在地
        if (!v.domicile) {
          v.domicileError = true;
          $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageDomicileNull);
          return false;
        } else v.domicileError = undefined;
        //居住地
        if (!v.residence) {
          v.residenceError = true;
          $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageResidenceNull);
          return false;
        } else v.residenceError = undefined;
        //送达地址
        if (!v.sendAddress) {
          v.sendAddressError = true;
          $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageSendAddressNull);
          return false;
        } else v.sendAddressError = undefined;
        //车牌号验证方法
        if(v.personType == "1" && v.plateNo){
          var xreg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DF]$)|([DF][A-HJ-NP-Z0-9][0-9]{4}$))/;
          var creg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1}$/;
          if (v.plateNo.length == 7) {
              return creg.test(v.plateNo);
          } else if (v.plateNo.length == 8) {
              return xreg.test(v.plateNo);
          } else {
              v.plateNoError = true;
              $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messagepPlateNo);
              return false;
          }
        }
      }
      //法人
      if (v.idType == "1") {
        //企业名称
        if (!v.orgName) {
          v.orgNameError = true;
          $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageOrgNameNull);
          return false;
        } else v.orgNameError = undefined;
        //代表人姓名
        if (!v.legalName) {
          v.legalNameError = true;
          $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageLegalNameNull);
          return false;
        } else v.legalNameError = undefined;
        //公司职务
        if (!v.job) {
          v.jobError = true;
          $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageJobNull);
          return false;
        } else v.jobError = undefined;
        //手机号码
        if (!v.telephone && $scope.co.lblApplicant == '原告' && $scope.co.step != '2') {
            v.telephoneError = true;
            $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageTelephoneNull);
            return false;
        } else {
            var phoneReg = /^1[3|4|5|7|8][0-9]{9}$/;
            if ((v.telephone.length != 11 || !phoneReg.test(v.telephone)) && $scope.co.lblApplicant == '原告' && $scope.co.step != '2') {
                v.telephoneError = true;
                $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageTelephoneFormatError);
                return false;
            } else v.telephoneError = undefined;
        }
        //居住地
        if (!v.residence) {
          v.residenceError = true;
          $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageResidenceNull);
          return false;
        } else v.residenceError = undefined;
        //送达地址
        if (!v.sendAddress) {
          v.sendAddressError = true;
          $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageSendAddressNull);
          return false;
        } else v.sendAddressError = undefined;
      }
      //其他组织
      if (v.idType == "2") {
        //组织名称
        if (!v.orgName) {
          v.orgNameError = true;
          $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageOrgNameNull);
          return false;
        } else v.orgNameError = undefined;
        //代表人姓名
        if (!v.legalName) {
          v.legalNameError = true;
          $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageLegalNameNull);
          return false;
        } else v.legalNameError = undefined;
        //公司职务
        if (!v.job) {
          v.jobError = true;
          $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageJobNull);
          return false;
        } else v.jobError = undefined;
        //手机号码
        if (!v.telephone && $scope.co.lblApplicant == '原告' && $scope.co.step != '2') {
          v.telephoneError = true;
          $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageTelephoneNull);
          return false;
        } else {
          var phoneReg = /^1[3|4|5|7|8][0-9]{9}$/;
          if ((v.telephone.length != 11 || !phoneReg.test(v.telephone)) && $scope.co.lblApplicant == '原告' && $scope.co.step != '2') {
            v.telephoneError = true;
            $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageTelephoneFormatError);
            return false;
          } else v.telephoneError = false;
        }
        //居住地
        if (!v.residence) {
          v.residenceError = true;
          $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageResidenceNull);
          return false;
        } else v.residenceError = undefined;
        //送达地址
        if (!v.sendAddress) {
          v.sendAddressError = true;
          $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageSendAddressNull);
          return false;
        } else v.sendAddressError = undefined;
      }
      //邮箱
      if (v.email && !mailReg.test(v.email)) {
        v.emailError = true;
        $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageEmailFormatError);
        return false;
      } else v.emailError = undefined;
      //Agent
      if (v.agentArray) {
        for (var j = 0; j< v.agentArray.length;j++) {//多个代理人
          var m = v.agentArray[j];
          //委托
          clearAgentType(m)
          if (m.agentType == "0") {
            //证件类型
            if (!m.certificatesType) {
              m.certificatesTypeError = true;
              $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageIdTypeNull);
              return false;
            } else m.certificatesTypeError = undefined;
            if (m.agentIdentity == "1" && m.agentIdentityItem == "1" && !m.relation) {
              $rootScope.toaster(level.error, title.error, "与当事人关系不能为空!");
              return false;
            }
            //证件号码
            if (!m.idNo) {
              m.idNoError = true;
              $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageIdNoNull);
              return false;
            } else m.idNoError = undefined;
            //代理人姓名
            if (!m.agentName) {
              m.agentNameError = true;
              $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageAgentNameNull);
              return false;
            } else m.agentNameError = undefined;
            //手机号码
            if (!m.telephone) {
              m.telephoneError = true;
              $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageAgentTelephoneNull);
              return false;
            } else {
              var phoneReg = /^1[3|4|5|7|8][0-9]{9}$/;
              if (v.telephone.length != 11 || !phoneReg.test(m.telephone)) {
                m.telephoneError = true;
                $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageAgentTelephoneFormatError);
                return false;
              } else m.telephoneError = undefined;
            }
            //邮箱
            if (m.email && !mailReg.test(m.email)) {
              m.emailError = true;
              $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageEmailFormatError);
              return false;
            } else m.emailError = undefined;
            //单位名称
            if (!m.companyName  && (m.agentIdentity=='0' || m.agentIdentity=='2')) {
              m.companyNameError = true;
              $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageUnitNameNull);
              return false;
            } else m.companyNameError = undefined;
            //送达地址
            if (!m.sendAddress) {
              m.sendAddressError = true;
              $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageSendAddressNull);
              return false;
            } else m.sendAddressError = undefined;
          }
          //法定
          if (m.agentType == "1") {
            clearAgentType(m.agentType)
              //证件类型
            if (!m.certificatesType) {
              m.certificatesTypeError = true;
              $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageIdTypeNull);
              return false;
            } else m.certificatesTypeError = undefined;
            //证件号码
            if (!m.idNo) {
              m.idNoError = true;
              $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageIdNoNull);
              return false;
            } else m.idNoError = undefined;
            //代理人姓名
            if (!m.agentName) {
              m.agentNameError = true;
              $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageAgentNameNull);
              return false;
            } else m.agentNameError = undefined;
            //手机号码
            if (!m.telephone) {
              m.telephoneError = true;
              $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageAgentTelephoneNull);
              return false;
            } else {
              var phoneReg = /^1[3|4|5|7|8][0-9]{9}$/;
              if (v.telephone.length != 11 || !phoneReg.test(m.telephone)) {
                m.telephoneError = true;
                $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageAgentTelephoneFormatError);
                return false;
              } else m.telephoneError = undefined;
            }
            //邮箱
            if (m.email && !mailReg.test(m.email)) {
              m.emailError = true;
              $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageEmailFormatError);
              return false;
            } else m.emailError = undefined;
            //户籍所在地
            if (!m.domicile) {
              m.domicileError = true;
              $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageDomicileNull);
              return false;
            } else m.domicileError = undefined;
            //户籍所在地
            if (!m.residence) {
              m.residenceError = true;
              $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageResidenceNull);
              return false;
            } else m.residenceError = undefined;
            //送达地址
            if (!m.sendAddress) {
              m.sendAddressError = true;
              $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageSendAddressNull);
              return false;
            } else m.sendAddressError = undefined;
          }
        }
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
          $rootScope.toaster(level, title, $scope.CONSTANT.messageIdentityFormatError);
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
          $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageIdentityFormatError);
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
          $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageIdentityFormatError);
          return false;
        } else applicant.idNoError = false;
      }
      
      if (isAgent && applicant.certificatesType!=0) {
        applicant.birthDay = applicant.sex = undefined;
      }
    }
    return true;
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
    //根据流水号查询是否存在没有完成的鉴定任务
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
        //如果存在没有完成的鉴定任务跳转到公告
        if($scope.appraisalInfo.appraisalFlag){
          var url = $state.href("appraisal_notice",{serialNo:$scope.adjust.serialNo,caseType:'2',orgId:$scope.adjust.adjustOrgCode, name:"appraisal_notice",pointId:$scope.adjust.adjustPointCode,pointName:$scope.adjust.adjustPointName});
          //查询公告须知
          AdjustService.getForwardUrl({
            orgId:$scope.adjust.lawOrgId
          }).success(function(res){
            if(res.result && res.result.identificationInformationDoc){
              url = $state.href("appraisal_notice",{serialNo:$scope.adjust.serialNo,caseType:'2',orgId:$scope.adjust.adjustOrgCode, name:res.result.identificationInformationDoc,pointId:$scope.adjust.adjustPointCode,pointName:$scope.adjust.adjustPointName});
            }
            if(confirm("确定要发起鉴定吗？")){
              window.open(url,'_blank');
            }
          })
        }else{
          $state.go("dashboard.appraisalQueryDetail",{serialNo:$scope.appraisalInfo.serialNo,personType:$scope.appraisalInfo.personType,appraisalInfoId:$scope.appraisalInfo.appraisalInfoId});
        }
      }
    });
  };

  //发起鉴定
  $scope.sendAppraisal = function(){
    //根据流水号查询是否有鉴定的案件
    $scope.queryAppraisal();
  }

  //生成二维码
  $scope.createLawInfoCode = function() {
      $scope.lawService.createLawInfoCode({
          id:$scope.adjust.id,
          operateType:$scope.adjust.operateType = '1',
          serialNo:$scope.adjust.serialNo
      }).success(function(result) {
          //成功
          if (result.code == LawConfig.commonConstant.SUCCESS) {
              $scope.codeFileName = LawConfig.lawConstant.lawCodeFileUrl + result.result
          } else {
              $rootScope.toaster(level, title, $scope.CONSTANT.netWorkError);
          }
      });
  }
  
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
  $scope.co.existNoTag = false;
  $scope.evidenceTagChanged = function(){
    $scope.co.filterTag =[];
    $scope.adjust.evidenceArray.forEach(function(v){
      if(v.chooseTagArray.length==0){
        $scope.co.existNoTag = true;
      }
      v.chooseTagArray.forEach(function(tag){
        if($scope.co.filterTag.map(function(m){return m.id}).indexOf(tag.id) == -1){
          $scope.co.filterTag.push(tag);
        }
      })
    })
  }
})