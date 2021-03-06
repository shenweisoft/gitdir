'use strict';
var app = angular.module('sbAdminApp');
app.filter('id2Text', function () {
  return function (id, data) {
    var result = _.find(data, {
      id: id + ""
    });
    return result ? result.value : ""
  }
});
app.filter('stringDate', function () {
  return function (dt) {
    if (typeof (dt) == "string") {
      dt = dt.replace(/\-/gi, "\/");
      dt = Date.parse(dt);
    }
    return dt && dt;
  }
});
app.filter('appraisalOrg', function () {
    return function (arr, list) {
        var newArrayList = [];
        arr && arr.forEach(function (v) {
            var appraisalItemList = JSON.parse(v.extPro).appraisalItem;

            list && list.forEach(function (m) {
                if (appraisalItemList.indexOf(m.appraisalType) > -1) {
                    newArrayList.push(v);
                }
            })
        })

        newArrayList = _.uniq(newArrayList);
        return newArrayList;
    }
});
app.filter('orgName', function () {
  return function (arr) {
    arr && arr.forEach(function (v) {
      if(v.idType == 1 || v.idType == 2){
        v.personName = v.orgName || v.insuranceForceCompany
      }
    });
    return arr ;
  }
});
angular.module('sbAdminApp').controller('AppraisalCtrl', function ($scope, $stateParams, $state, $http, $log, AppraisalConfig, AppraisalService, DictionaryConfig, toaster, $filter, AdjustService, $rootScope) {
  $scope.serialNo = $stateParams.serialNo;
  $scope.appraisalInfoId = $stateParams.appraisalInfoId;
  $scope.caseType = $stateParams.caseType;
  //鉴定类型集合
  $scope.appraisalTypeList = DictionaryConfig.appraisalTypeList;
  //性别集合
  $scope.sexList = DictionaryConfig.sexList;
  //证件类型集合
  $scope.certificateTypeList = DictionaryConfig.certificateTypeConstant;
  //证据分类
  $scope.appraisalClassifyList = DictionaryConfig.appraisalClassifyList;
  //查询申请人和被申请集合Service
  $scope.queryAppraisalApplyerListService = AppraisalService.queryAppraisalApplyerList;
  //根据流水号查询鉴定详细信息
  $scope.queryAppraisalInfoService = AppraisalService.queryAppraisalInfo;
  //更新老道交的是否完成鉴定的字段
  $scope.oldBusinessAppraisalSubmitData = AppraisalService.oldBusinessAppraisalSubmitData;
  //保存信息
  $scope.saveAppraisalInfoService = AppraisalService.saveAppraisalInfo;
  //查询鉴定机构
  $scope.queryOrgAppraisalBySerialNoService = AdjustService.queryOrgAppraisalBySerialNo;
  //鉴定机构disabled
  $scope.appraisalOrgOnly = false;
  //鉴定详细信息表
  function AppraisalDetailInfo() {
    this.id = "";
    this.applyName = "";
    this.appraisalNo = "";
    this.appraisalType = "1";
    this.appraisalItem = "";
    this.appraisalItemList = angular.copy(DictionaryConfig.appraisalItemList.filter(function (val) {
      return val.type == 1;
    }));
    this.state = "";
    this.appraisalFee = "";
    this.principalAgent = "";
    this.identificationPurpose = "";
    this.estimateDate = "";
    this.jyAppraisalApplyerInfoId = "";
    this.jyAppraisalApplyerId = "";
    this.appraisalEvidenceList = [];
  }

  //初始化鉴定详细信息
  $scope.initAppraisalInfo = function () {
    //申请人集合
    $scope.queryAppraisalApplyerListService({
      serialNo: $scope.serialNo,
      id:$scope.appraisalInfoId
    }).success(function (result) {
      if (result.code == AppraisalConfig.commonConstant.SUCCESS) {
        //申请人集合
        $scope.applyerArray = result.result.filter(function(val){
          return val.isDeath !== '1';
        });
        //被鉴定人集合
        $scope.appraisalApplyerInfoList = result.result.filter(function (val) {
          return val.idType == '0';
        });
      } else {
        $rootScope.toaster("error", "错误", result.message);
      }
    });
    //查询鉴定详细信息
    $scope.queryAppraisalInfoService({
      serialNo: $scope.serialNo,
      id:$scope.appraisalInfoId
    }).success(function (result) {
      if (result.code == AppraisalConfig.commonConstant.SUCCESS) {
        $log.info(result.result);
        //查收结果
        $scope.appraisalInfo = result.result;
        //处理集合
        $scope.appraisalInfo.appraisalDetailList.forEach(function (val) {
          //如果申请人和被申请人在调解环节被删除

          //根据鉴定类型选择相应的鉴定项目集合
          val.appraisalItemList = angular.copy(DictionaryConfig.appraisalItemList.filter(function (appraisalItem) {
            return appraisalItem.type == val.appraisalType;
          }));
          //让集合被选中
          val.appraisalItem.split(",").forEach(function (val2) {
            var obj = _.find(val.appraisalItemList, {id: val2});
            obj.selected = true;
          });
          //循环证据
          val.appraisalEvidenceList.forEach(function (appraisalEvidence) {
            //证据类型
            appraisalEvidence.chooseTagArray = [];
            appraisalEvidence.classify.split(",").forEach(function (val3) {
              var obj4 = _.find($scope.appraisalClassifyList, {id: val3});
              appraisalEvidence.chooseTagArray.push(obj4);
            });
          });
        });
        //如果没有鉴定任务初始化一个任务
        if ($scope.appraisalInfo.appraisalDetailList.length == 0) {
          $scope.appraisalInfo.appraisalDetailList.push(new AppraisalDetailInfo());
        }
        //  第三步查询机构
        if ($scope.co.step == 3) {
          $scope.step3Query();
        }

        //初次进入页面加载，更新鉴定类型disabled
        $scope.updateItem();

      } else {
        $rootScope.toaster("error", "错误", result.message);
      }
    });
  };

  //初始化信息
  $scope.initAppraisalInfo();

  //保持信息
  $scope.saveAppraisal = function (goState) {
    var saveFlag = goState;
    goState = goState || function () {};
    //时间处理
    $scope.appraisalInfo.appalyDate = $filter('date')($scope.appraisalInfo.appalyDate, 'yyyy-MM-dd HH:mm:ss');
     if($scope.co.step == 3){
    	 //最后提交 鉴定增加 发短信表示
    	 $scope.appraisalInfo.sendType='1';
     }
    //保存信息
    $scope.saveAppraisalInfoService($scope.appraisalInfo).success(function (result) {
      if (result.code == AppraisalConfig.commonConstant.SUCCESS) {
        result.result.appraisalDetailList.forEach(function (val, index) {
          $scope.appraisalInfo.appraisalDetailList[index].id = val.id;
          $scope.appraisalInfo.appraisalDetailList[index].appraisalNo = val.appraisalNo;
          //证据id
          val.appraisalEvidenceList.forEach(function (v,i) {
            $scope.appraisalInfo.appraisalDetailList[index].appraisalEvidenceList[i].id = v.id;
          })
        });

        if(!saveFlag && saveFlag != 0){
          $rootScope.toaster("success", "成功", "保存成功！");
        }
        goState();
      } else {
        $rootScope.toaster("error", "错误", result.message);
      }
    });
  };

  $scope.CONSTANT = {
    "applyNameError": "请选择申请人",
    "jyAppraisalApplyerInfoIdError": "请选择被鉴定人",
    "appraisalItemError": "请选择鉴定项目",
    "evidenceNameError": "请输入证据名称",
    "evidenceDescriptionError": "请输入证据描述",
    "evidenceClassifyError": "请选择证据分类",
    "evidenceError": "请您添加证据",
    "principalAgentError": "请您选择委托主体",
    "identificationPurposeError": "请您选择鉴定用途",
    "appraisalOrgIdError": "请您选择鉴定机构",
    "appalyDateError": "请您选择申请日期",
    "hasSubmit":"已经发起鉴定，不可重复提交"
  };

  //封装表单验证信息
  function validateAppraisalForm() {

    if($scope.appraisalInfo.appraisalDetailList.length == 0){
      $rootScope.toaster("error", "错误", "请您添加被鉴定人！");
      return false;
    }

    for (var i = 0; i < $scope.appraisalInfo.appraisalDetailList.length; i++) {
      var appraisalDetail = $scope.appraisalInfo.appraisalDetailList[i];
      appraisalDetail.applyNameError = "";
      appraisalDetail.jyAppraisalApplyerInfoIdError = "";
      appraisalDetail.appraisalItemError = "";

      //验证申请人
      if (!appraisalDetail.applyName) {
        appraisalDetail.applyNameError = $scope.CONSTANT.applyNameError;
        $rootScope.toaster("error", "错误", appraisalDetail.applyNameError);
        return false;
      }
      //验证被鉴定人
      if (!appraisalDetail.jyAppraisalApplyerInfoId) {
        appraisalDetail.jyAppraisalApplyerInfoIdError = $scope.CONSTANT.jyAppraisalApplyerInfoIdError;
        $rootScope.toaster("error", "错误", appraisalDetail.jyAppraisalApplyerInfoIdError);
        return false;
      }
      //鉴定项目
      if (!appraisalDetail.appraisalItem) {
        appraisalDetail.appraisalItemError = $scope.CONSTANT.appraisalItemError;
        $rootScope.toaster("error", "错误", appraisalDetail.appraisalItemError);
        return false;
      }
    }
    return true;
  }

  //验证证据
  function validateEvidenceForm() {
    for (var i = 0; i < $scope.appraisalInfo.appraisalDetailList.length; i++) {
      var appraisalDetail = $scope.appraisalInfo.appraisalDetailList[i];
      appraisalDetail.evidenceError = "";
      //如果证据不存在
      if (!appraisalDetail.appraisalEvidenceList || appraisalDetail.appraisalEvidenceList.length == 0) {
        appraisalDetail.evidenceError = $scope.CONSTANT.evidenceError;
        $rootScope.toaster("error", "错误", appraisalDetail.evidenceError);
        return false;
      } else {
        for (var j = 0; j < appraisalDetail.appraisalEvidenceList.length; j++) {
          var appraisalEvidence = appraisalDetail.appraisalEvidenceList[j];
          appraisalEvidence.evidenceNameError = "";
          appraisalEvidence.evidenceDescriptionError = "";
          //证据名称
          if (!appraisalEvidence.name) {
            appraisalEvidence.evidenceNameError = $scope.CONSTANT.evidenceNameError;
            $rootScope.toaster("error", "错误", appraisalEvidence.evidenceNameError);
            return false;
          }
          //证据描述
          if (!appraisalEvidence.description) {
            appraisalEvidence.evidenceDescriptionError = $scope.CONSTANT.evidenceDescriptionError;
            $rootScope.toaster("error", "错误", appraisalEvidence.evidenceDescriptionError);
            return false;
          }
          //证据类型
        /*  if (!appraisalEvidence.classify) {
            appraisalEvidence.evidenceClassifyError = $scope.CONSTANT.evidenceClassifyError;
            $rootScope.toaster("error", "错误", appraisalEvidence.evidenceClassifyError);
            return false;
          }*/
        }
      }
    }
    return true;
  }

  //验证鉴定机构等
  function validateAppraisalOrgForm() {
    var appraisalInfo = $scope.appraisalInfo;

    appraisalInfo.principalAgentError = "";
    appraisalInfo.identificationPurposeError = "";
    appraisalInfo.appraisalOrgIdError = "";
    appraisalInfo.appalyDateError = "";

    //委托主体
    if (!appraisalInfo.principalAgent) {
      appraisalInfo.principalAgentError = $scope.CONSTANT.principalAgentError;
      $rootScope.toaster("error", "错误", appraisalInfo.principalAgentError);
      return false;
    }
    //鉴定用途
    if (!appraisalInfo.identificationPurpose) {
      appraisalInfo.identificationPurposeError = $scope.CONSTANT.identificationPurposeError;
      $rootScope.toaster("error", "错误", appraisalInfo.identificationPurposeError);
      return false;
    }
    //鉴定机构
    if (!appraisalInfo.appraisalOrgId) {
      appraisalInfo.appraisalOrgIdError = $scope.CONSTANT.appraisalOrgIdError;
      $rootScope.toaster("error", "错误", appraisalInfo.appraisalOrgIdError);
      return false;
    }
    //申请日期
    if (!appraisalInfo.appalyDate) {
      appraisalInfo.appalyDateError = $scope.CONSTANT.appalyDateError;
      $rootScope.toaster("error", "错误", appraisalInfo.appalyDateError);
      return false;
    }
    return true;
  }

  //封装上一步下一步对象，默认当前步骤为1
  function CO() {
    this.step = 1;
  }

  //初始化对象
  $scope.co = new CO();
  //跳转下一步
  $scope.nextStep = function () {
    if( $scope.co.step == 3){
      var data = {
        serialCode: $scope.serialNo,
        isAppraisalFinish: 2,
        loginAccount: sessionStorage.getItem("loginAccount")
      }
      $scope.oldBusinessAppraisalSubmitData(data).success(function (result) {
        if(result.code == AppraisalConfig.commonConstant.SUCCESS){
          sessionStorage.setItem("loginAccount",null)
          $scope.readNext();
        }else{
            $rootScope.toaster("error", "错误", result.message);
        }
      });
    }else{
      $scope.readNext();
    }
  
  }


  $scope.readNext = function () {
    if ($scope.co.step == 1 && validateAppraisalForm()) {
      $scope.saveAppraisal(function () {
        $scope.co.step = $scope.co.step + 1;
        $state.go('appraisal.step2');
      });
    } else if ($scope.co.step == 2 && validateEvidenceForm()) {
      $scope.saveAppraisal(function () {
        $scope.co.step = $scope.co.step + 1;
        $state.go('appraisal.step3');
        //查询机构
        $scope.step3Query();
      });
    } else if ($scope.co.step == 3 && validateAppraisalOrgForm()) {
      //已经发起鉴定，不可以重复提交
      if($scope.appraisalInfo.state != DictionaryConfig.appraisalState.temporaryState){
        $rootScope.toaster("error", "错误", $scope.CONSTANT.hasSubmit);
        return ;
      }
      $scope.stateAndItems();
      $scope.saveAppraisal(function() {
        if($stateParams.judge) {
            $state.go('appraisal_complete', {judge: true});
        } else {
            $state.go('appraisal_complete');
        }
      });
      window.opener.location.reload();
    }
  };
  //跳转上一步
  $scope.preStep = function () {
    if ($scope.co.step == 2) {
      $scope.co.step = $scope.co.step - 1;
      $state.go('appraisal.step1');
    } else if ($scope.co.step == 3) {
      $scope.co.step = $scope.co.step - 1;
      $state.go('appraisal.step2');
    }
  };
  //第三步请求机构
  $scope.step3Query = function () {
    //日期转格式
    $scope.appraisalInfo.appalyDate = (typeof $scope.appraisalInfo.appalyDate == 'string' && parseISO8601($scope.appraisalInfo.appalyDate) ) || new Date();
    //查询鉴定机构
    $scope.queryOrgAppraisalBySerialNoService({
        "serialNo": $scope.serialNo,
        "caseType": $scope.caseType
      }
    ).success(function (result) {
      if (result.code == AppraisalConfig.commonConstant.SUCCESS) {
        //过滤机构
        $scope.accreditationList = $filter('appraisalOrg')(result.result, $scope.appraisalInfo.appraisalDetailList);
        //数据初始化
        $scope.chooseAgency($scope.appraisalInfo.appraisalOrgId);
      } else if (result.code == AppraisalConfig.commonConStant.FAILURE) {
        $rootScope.toaster("error", "错误", result.message);
      }
    })
  }
  //选择鉴定机构
  $scope.chooseAgency = function (id) {
    $scope.agencyInfo = id && JSON.parse(
        $scope.accreditationList.filter(function (v) {
          return v.id == id;
        })[0].extPro
      )
    $scope.accreditationList.forEach(function (v) {
      if(v.id == id ) $scope.appraisalInfo.appraisalOrgName = v.text
    })

  }
  //提交时每个鉴定号的状态和鉴定类型
  $scope.stateAndItems = function () {
    $scope.appraisalInfo.appraisalItems = '';
    $scope.appraisalInfo.appraisalDetailList && $scope.appraisalInfo.appraisalDetailList.forEach(function (m) {
      //主表鉴定类型
      if ($scope.appraisalInfo.appraisalItems.indexOf(m.appraisalType) == -1) {
        var item = _.find(DictionaryConfig.appraisalTypeList, {id: m.appraisalType}).value;
        if(!$scope.appraisalInfo.appraisalItems){
          $scope.appraisalInfo.appraisalItems += item
        }else{
          $scope.appraisalInfo.appraisalItems += "," + item;
        }
      }
      //鉴定号state
      m.state = DictionaryConfig.appraisalDetailState.launchState;
    });
    //主表state
    $scope.appraisalInfo.state = DictionaryConfig.appraisalState.launchState;
  }

  function parseISO8601(dateStringInRange,flag) {
    var isoExp = /^\s*(\d{4})-(\d\d)-(\d\d) (\d{2}):(\d{2}):(\d{2})\s*$/,
      date = new Date(NaN), month,
      parts = isoExp.exec(dateStringInRange);
    if(parts) {
      month = +parts[2];
      date.setFullYear(parts[1], month - 1, parts[3]);
      if(flag){
        date.setHours(parts[4], parts[5], parts[6]);
        return date;
      }
      if(month != date.getMonth() + 1) {
        date.setTime(NaN);
      }
    }
    return date;
  }

  //随机匹配，鉴定机构
  $scope.random = function () {

    $scope.accreditationViewList = [];
    $scope.accreditationList.forEach(function(val){
      var extPro = JSON.parse(val.extPro);
      if(!extPro.isRandom || extPro.isRandom == '1'){
        $scope.accreditationViewList.push(val);
      }
    });

    $log.info($scope.accreditationViewList);
    if (!$scope.accreditationViewList || $scope.accreditationViewList.length == 0  || $scope.appraisalOrgOnly) {return}
    //生成数组里的随机数
    var item = Math.ceil(Math.random() * $scope.accreditationViewList.length) - 1;
    //机构详细字段
    $scope.agencyInfo = JSON.parse($scope.accreditationViewList[item].extPro);
    //下拉框
    $scope.appraisalInfo.appraisalOrgId = $scope.accreditationViewList[item].id;

    $scope.appraisalOrgOnly = true;
    //name
    $scope.chooseAgency($scope.appraisalInfo.appraisalOrgId );

    $scope.appraisalInfo.isRandom = true;
    //保存一遍
    $scope.saveAppraisal();
  }

  //更新鉴定项目disabled,防止选择重复的鉴定项目
  $scope.updateItem = function () {
    $scope.appraisalInfo.appraisalDetailList.forEach(function(val,index){
      val.appraisalItemList.forEach(function(m,i){
        if(m.selected){
          $scope.appraisalInfo.appraisalDetailList.forEach(function(v){
            //是同一个被鉴定人
            if(v.jyAppraisalApplyerInfoId && val.jyAppraisalApplyerInfoId && v.jyAppraisalApplyerInfoId == val.jyAppraisalApplyerInfoId){
              if(v.appraisalType == val.appraisalType){
                v.appraisalItemList[i].disabled = true;
              }
            }/*else if(v.jyAppraisalApplyerInfoId != val.jyAppraisalApplyerInfoId){//不是同一个被鉴定人,这种情况要特殊处理，因为最后一次比较是和上一个鉴定
              v.appraisalItemList[i].disabled = false;
            }*/
          });
          //此项选中，其他都disabled
          $scope.appraisalInfo.appraisalDetailList[index].appraisalItemList[i].disabled = false;
        }
      });
    });
  }

});