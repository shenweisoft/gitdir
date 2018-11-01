'use strict';
var app = angular.module('sbAdminApp');
app.filter('id2Text', function() {
  return function(id,data) {
    var result = _.find(data, {
      id: id+""
    });
    return result? result.value:""
  }
});

app.filter('idToText', function() {
  return function(id,data) {
    var result = _.find(data, {
      id: id+""
    });
    return result? result.text:""
  }
});

app.filter('result2Text', function() {
  return function(result) {
    var text = "";
    if (result.payType == "1" || result.payType == "2") {
      text += result.companyName + "(车牌号:" + result.plateNo + ")";
    } else if (result.payType == "3") {
      if (result.personType == 1) {
        text += result.personName+" 自行承担"
      } else if (result.personType == 0) {
        text += result.personName+" 自行承担"
      }
    }
    return text
  }
});

app.filter('respondents2Company', function() {
  return function(result) {
    var arr = [];
    result.forEach(function(v) {
      if (v.personType == "1" && v.idType == "1" && v.enterpriseType == "1") {
        if(arr.indexOf(v.orgName) == -1) arr.push(v.orgName);
      }
    });
    return arr;
  }
});

app.filter('risk2Text', function() {
  return function(result, array) {
    var resultText = "";
    var arr = [0,1,2];
    for(var i = 0; i < arr.length ; i++){
      if(result[i]){
        resultText += resultText?","+array[i].value:array[i].value;
      }
    }
    return resultText;
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

/**
 * Created by Administrator on 2017/3/8 0008.
 */
angular.module('sbAdminApp').controller('DossierDetailCtrl', function($scope, $stateParams, $state, $location, $timeout, $http, $log, AdjustConfig,AdjustService, LawService,DictionaryConfig, AnchorSmoothScroll,$rootScope,toaster) {

  //定义阶段状态
  $scope.stageList = {
    "adjustState":"1",//调解阶段
    "litigationState":"2",//诉讼阶段
    "handlingState":"3"//办案阶段
  };

  $scope.currentTime = new Date();
  //与申请人的关系
  $scope.relationArray = DictionaryConfig.relation2Applicant;
  //从上级参数中获取调解信息
  $scope.adjustInfo = $stateParams.adjustInfo;

  //身份类型
  $scope.idTypeList = DictionaryConfig.idTypeConstant;
  //证件类型
  $scope.certificatesTypeList = DictionaryConfig.certificateTypeConstant;
  //代理人身份
  $scope.proxyTypeConstantList = DictionaryConfig.proxyTypeConstant;
  //公司类型
  $scope.companyTypeList = DictionaryConfig.companyTypeList;
  //委托授权
  $scope.proxyPermissionConstantList = DictionaryConfig.proxyPermissionConstant;
  //代理人为公民的子选项
  $scope.agentIdentifySubList = DictionaryConfig.agentIdentifySubList;
  //委托授权参数
  $scope.agentPowerList = DictionaryConfig.agentPowerList;
  //代表人类型
  $scope.legalTypeList = DictionaryConfig.legalTypeList;
  //与申请人得关系
  $scope.relation2Applicant = DictionaryConfig.relation2Applicant;
  //案由类型
  $scope.factTypeList = DictionaryConfig.factTypeList;
  //代理人身份子类型
  $scope.agentIdentifySubList = DictionaryConfig.agentIdentifySubList;
  //调解结果
  $scope.ajustResultArray = DictionaryConfig.adjustResultList;
  //主表头信息详细查询Service
  $scope.queryLawDetailService = LawService.queryLawDetail;
  //查询调解信息表详细Service
  $scope.queryAdjustBySerialNoService = AdjustService.queryAdjustBySerialNo;
  //查询诉讼信息表详细Service
  $scope.queryLawInfoService = LawService.queryLawInfo;
  //证件类型
  $scope.certificateType = DictionaryConfig.certificateTypeConstant;
  //责任比例
  $scope.dutyTypeList = DictionaryConfig.dutyTypeList;
  
  $scope.imageAddress = AdjustConfig.pictureConstant.smallPictureUrl;
  $scope.defaultImg = "views/images/_r2_c2.png";
  $scope.defaultImg2 = "views/images/6.png";
  $scope.defaultImg3 = "views/images/7.png";
  $scope.isNavHashOpened = false;

  $scope.isSelf = $stateParams.isSelf;

  $scope.co = {};
  
  //查询头部数据(根据流程查询相应的信息)
  $scope.queryLawDetailService({
    "serialNo": $stateParams.serialNo,
      "id":$stateParams.id,
      "lawPersonType":$stateParams.lawPersonType
  }).success(function (result) {
    $log.info(result);
    if(result.code ==  AdjustConfig.commonConStant.SUCCESS){
      $scope.showFlag = true;
      $scope.law = result.result;
    }else{
      $rootScope.toaster("error", "错误", result.message);
    }
  });
  //查询调解阶段信息
  $scope.queryAdjust = function(){
    $scope.queryAdjustBySerialNoService({
      "serialNo":$stateParams.serialNo,
        "id":$stateParams.id
    }).success(function(result){
      //如果成功
      if(result.code == AdjustConfig.commonConStant.SUCCESS){
        //获取对象
        $scope.adjust = result.result;
        $log.info("shenwei");
        $log.info($scope.adjust);
        filterQuery(result.result);
      }else{
        alert("请联系系统管理员");
      }
    }, function(error){
    });
  };

  //查询诉讼表信息
  $scope.queryLaw = function(){
    $scope.queryLawInfoService ({
      "serialNo":$stateParams.serialNo
    }).success(function(result){
      //如果成功
      if(result.code == AdjustConfig.commonConStant.SUCCESS){
        //获取对象
        $scope.adjust = result.result;
        filterQuery(result.result);
      }else{
        alert("请联系系统管理员");
      }
    }, function(error){
    });
  };

  var viewStep6Url = function(){
    //获取当前时间
    $scope.co.createDocumentDate = conversionDate(new Date());

    var currentApplicants = $scope.adjust.applicantArray.filter(function(v) {
      return v.personType == 0 && v.isDeath == '2';
    }).map(function(v) {
      if (v.idType == 0) return v.personName;
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

    if(($scope.fileType == 'adjustAgreement') && $scope.adjust.regionName.indexOf('浙江') > -1){
      $scope.co.text = "当事人" + currentApplicants + "因交通事故损失的"  +currentFee+"，合计"+$scope.adjust.applyTotal+"元，要求当事人"+ currentBg + "赔偿。";
      $scope.co.step6Url = res.result.adjustmentAgreementDoc;
      $scope.co.currentDate  = getDate(new Date());
    } else{
      $scope.co.text = "申请人" + currentApplicants + "因交通事故损失的"  +currentFee+"，合计"+$scope.adjust.applyTotal+"元，要求申请人"+ currentBg + "赔偿。";
      $scope.co.step6Url = 'step6';
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

  //查询阶段方法
  $scope.queryStage = function(stage){
    //点击阶段
    $scope.stage = stage;
    //如果为查看调解阶段
    if($scope.stage == $scope.stageList.adjustState){
      //默认查询申请人
      $scope.fileType = 'proposer';
      $scope.queryAdjust();
    }else if($scope.stage == $scope.stageList.litigationState){
      //默认查询申请人
      $scope.fileType = 'proposer';
      $scope.queryLaw();
    }else{
      $scope.fileType = "approval";
    }
  };
  //默认查询调解表信息
  $scope.queryStage($scope.stageList.adjustState);

  function filterQuery(adjust) {
    if (adjust.applicantArray) {
      var hashIndex = 1;
      var applicantSize = 1;
      var appelleeSize = 1;
      adjust.applicantArray.forEach(function(v) {
        if(v.birthDay) v.birthDay = parseISO8601(v.birthDay);
        if (v.riskTypes) v.riskTypes = JSON.parse(v.riskTypes);
        if (v.personType == 0) v.hashName = applicantSize++;
        else if (v.personType == 1) v.hashName = appelleeSize++;
        if(v.agentArray){
          var agentIndex = 1;
          v.agentArray.forEach(function(m){
            if(m.birthDay)m.birthDay = parseISO8601(m.birthDay);
            m.hashIndex = hashIndex + "." + agentIndex;
            m.hashName = agentIndex++;
          })
        }
        v.hashIndex = hashIndex++;
      })
    }
    if (adjust.compensateStandard) adjust.compensateStandard = JSON.parse(adjust.compensateStandard);
    if (adjust.compensateTable) adjust.compensateTable = JSON.parse(adjust.compensateTable);
    if (adjust.feeDetail) adjust.feeDetail = JSON.parse(adjust.feeDetail);

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

    if (adjust.deathDate) adjust.deathDate = parseISO8601(adjust.deathDate);
    if (adjust.adjustDate) adjust.adjustDate = parseISO8601(adjust.adjustDate);
    if (adjust.payDate) adjust.payDate = parseISO8601(adjust.payDate);
    if ($scope.adjust.lawMoney) $scope.adjust.willPayTotal = $scope.adjust.lawMoney - $scope.adjust.paidTotal;

    viewStep6Url();
  }
  
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
  
  $scope.locate = function(id) {
    var hashIndex = 'name'+id;
    $location.hash(hashIndex);
    $timeout(function() {
      AnchorSmoothScroll.scrollTo(hashIndex);
    });
  };
  
  $scope.riskTypes = [{
    id: "0",
    value: "交强险"
  }, {
    id: "1",
    value: "三者险"
  }, {
    id: "2",
    value: "不计免赔"
  }];
  
  $scope.showRespondentFilter = function(e) {
    var temp = e.responsibleRate? e.responsibleRate != -1 : e.responsibleRate == 0? true:false;
    return e.personType == 1 && (e.idType == '0' || e.idType == '2' || (e.idType == '1' && e.enterpriseType != '1')) && temp;
  }
  
  //计算总合计
  $scope.calcTotal = function(compensateTable, type){
    var total = 0.00;
    if(compensateTable){
      compensateTable.filter(function(v){
        return v.payType==type;
      }).forEach(function(v){
        total += parseFloat(v.calcIndemnitySum);
      })
    }
    return total.toFixed(2)
  }
  
  $scope.selectApplicantInArray = function(){
    var applicants="";
    $scope.adjust.applicantArray.filter(function(v){
      return v.personType=='0'
    }).forEach(function(v){
      if(v.idType==0){
        if(!applicants){
          applicants += v.personName
        }else{
          applicants += ","+v.personName
        }
      }else{
        if(!applicants){
          applicants += v.orgName
        }else{
          applicants += ","+v.orgName
        }
      }
    })
    return applicants;
  }

  //签字页
  $scope.signPage = function () {
    var url = $state.href('signDetail',{serialNo:$scope.adjust.serialNo});
    window.open(url)
  }
});