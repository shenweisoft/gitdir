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

app.filter('stringDate', function() {
  return function(dt) {
    if(typeof (dt) == "string")
    {
      dt = dt.replace(/\-/gi,"\/");
      dt = Date.parse(dt);
    }
    return dt && dt;
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

app.controller('secondInstanceFileCtrl', function($scope, SecondLitigantionService,SecondLitigantionConfig, $stateParams,LoginService,$rootScope) {
  //预览图url
  $scope.imageAddress = SecondLitigantionConfig.path + '/common/image/getThumbnail/';
  //预览图默认路径
  $scope.defaultImg = "views/images/_r2_c2.png";
  $scope.defaultImg2 = "views/images/6.png";
  $scope.defaultImg3 = "views/images/7.png";
  //定义查询Service
  $scope.selectSecondIntanceInfoService = SecondLitigantionService.selectSecondIntanceInfo;
  //上诉、被上诉、原审当事人数据
  $scope.secondApplicantArray = [];
  //证据数据
  $scope.secondEvidenceArray = [];
  //默认显示上诉人信息
  $scope.fileType = "0";
  //默认显示立案登记信息
  $scope.stage = "0";
  //诉讼地位
  $scope.lawTypeList = SecondLitigantionConfig.lawTypeList;
  //身份类型
  $scope.idTypeConstant = SecondLitigantionConfig.idTypeConstant;
  //证件类型
  $scope.certificateTypeConstant = SecondLitigantionConfig.certificateTypeConstant;
  //代理人身份
  $scope.proxyTypeConstant = SecondLitigantionConfig.proxyTypeConstant;
  //与代理人关系
  $scope.agentIdentifySubList = SecondLitigantionConfig.agentIdentifySubList;
  //委托授权
  $scope.proxyPermissionConstant = SecondLitigantionConfig.proxyPermissionConstant;
  //委托权限
  $scope.agentPowerList = SecondLitigantionConfig.agentPowerList;
  //公司类型
  $scope.companyTypeList = SecondLitigantionConfig.companyTypeList;
  //代表人类型
  $scope.legalTypeList = SecondLitigantionConfig.legalTypeList;
  //案由
  $scope.factTypeList = SecondLitigantionConfig.factTypeList;
  //代理人与当事人关系
  $scope.relation2Applicant = SecondLitigantionConfig.relation2Applicant;
  //是否显示查看证据按钮
  $scope.evideceShow = $stateParams.evideceShow;

  //初始化页面数据
  $scope.initData = function(){
    //根据ID查询主表数据
    SecondLitigantionService.querySecondIntanceInfo({id: $stateParams.id}).success(function (res) {
      if(res.code == SecondLitigantionConfig.commonConStant.SUCCESS){
        $scope.secondIntanceInfo = res.result;
        console.log($scope.secondIntanceInfo)
        //填充数据
        $scope.secondApplicantArray = $scope.secondIntanceInfo.secondInstanceApplicantArray;
        $scope.secondEvidenceArray = $scope.secondIntanceInfo.secondInstanceEvidenceArray;
        //填充页面数据
        $scope.fillData();
        $scope.$broadcast('init', $scope.secondIntanceInfo, 'isDossier');
      } else {
        $rootScope.toaster($scope.validate.error, $scope.validate.errorTxt, res.message); //原审当事人人
      }
    });
  };

  //查询承办部门数据
  $scope.queryDepartment = function () {
    SecondLitigantionService.queryDepartByUserAndOrgInfo({userId: $scope.userId, orgId: $scope.secondIntanceInfo.secondintanceOrgId}).success(function (res) {
      if(res.code == SecondLitigantionConfig.commonConStant.SUCCESS) {
        $scope.departmentList = res.result;
      } else {
        $rootScope.toaster("error", "错误", res.message);
      }
      console.log($scope.departmentList);
    })
  };

  //获取计算结果string，并转化成array
  $scope.getCompensateResultRemarkList = function () {
    $scope.compensateResultRemarkList = $scope.secondIntanceInfo.compensateResultRemark.split('\r\n');
  };

  //获取申请人list
  $scope.selectApplicantInArray = function(){
    var applicants="";
    $scope.secondIntanceInfo.secondInstanceApplicantArray.filter(function(v){
      return v.personType=='0'
    }).forEach(function(v){
      if(!applicants){
        applicants += v.personName
      }else{
        applicants += "，"+v.personName
      }
    });
    return applicants;
  };

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
  };

  //格式化数据
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
    if (adjust.deathDate) adjust.deathDate = parseISO8601(adjust.deathDate);
    if (adjust.adjustDate) adjust.adjustDate = parseISO8601(adjust.adjustDate);
    if (adjust.payDate) adjust.payDate = parseISO8601(adjust.payDate);
    if (adjust.lawMoney) adjust.willPayTotal = adjust.lawMoney - adjust.paidTotal;
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

  //整理页面数据
  $scope.fillData = function () {
    filterQuery($scope.secondIntanceInfo);
    //获取计算结果数组
    if($scope.secondIntanceInfo.state == '1005') {
      $scope.getCompensateResultRemarkList();
    }
    console.log($scope.secondIntanceInfo)
  };

  $scope.initData();
});
