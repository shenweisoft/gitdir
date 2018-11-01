'use strict';
var app = angular.module('sbAdminApp');

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

app.filter('idToText', function() {
  return function(id,data) {
    var result = _.find(data, {
      id: id+""
    });
    return result? result.text:""
  }
});

angular.module('sbAdminApp').controller('compensateCalculateDetailCtrl', function($scope, $stateParams,AdjustService,$location,DictionaryConfig,toaster,$state,CompensateService,AdjustConfig) {
  console.log($stateParams);

  //查询调解信息表详细Service
  $scope.queryAdjustBySerialNoService = AdjustService.queryAdjustBySerialNo;

  //当是详情时，替换头部信息
  if($location.url().split('/')[$location.url().split('/').length - 1] === 'compensateCalculateDetail') {
      $scope.options.isDetails = false;
  } else {
      $scope.options.isDetails = true;
  }

  //案由类型
  $scope.factTypeList = DictionaryConfig.factTypeList;

  console.log($scope.factTypeList)

  //调解结果
  $scope.ajustResultArray = DictionaryConfig.adjustResultList;

  //定义用户信息
  $scope.user = {
    type: "1",  //1：索赔方 2：赔偿方 3：案件查询
    name: "索赔方"
  };

  //定义身份类型数组
  $scope.idTypeArr = ['公民', '法人', '其他组织'];

  //定义页面常量
  $scope.constant = [
    {
      name: "索赔方",
      type: "1"
    },{
      name: "赔偿方",
      type: "2"
    },{
      name: "案件查询",
      type: "3"
    }
  ];

  //在申请人与被申请人中找出被申请人
  $scope.showRespondentFilter = function(e) {
    var temp = e.responsibleRate? e.responsibleRate != -1 : e.responsibleRate == 0? true:false;
    return e.personType == 1 && (e.idType == '0' || e.idType == '2' || (e.idType == '1' && e.enterpriseType != '1')) && temp;
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

  //根据案件detailsId，获取数据
  $scope.initData = function () {
    //调用接口
    CompensateService.queryCompensateInfo({id: $stateParams.id}).success(function (res) {
      if (res.code === AdjustConfig.commonConStant.SUCCESS) {
        console.log(res);
        //将请求到的对象与user对象合并
        angular.extend($scope.user, res.result);
        //将对象json转换成数组
        filterQuery($scope.user);
        //将请求到的数据发送给父级
        $scope.$emit('getUserData', $scope.user);
        $scope.user.compensateResultRemark = $scope.user.compensateResultRemark.split('\r\n');
      } else {
        //请求失败
        $rootScope.toaster("error", "错误", res.message);
      }
    })
  };
  $scope.initData();

  //切换显示用户
  $scope.switchoverUser = function (data) {
    $scope.user.type = data.type;
    $scope.user.name = data.name;
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

  //获取申请人list
  $scope.selectApplicantInArray = function(){
    var applicants="";
    $scope.user.compensationApplyerInfoList.filter(function(v){
      return v.personType=='0'
    }).forEach(function(v){
        if(!applicants){
          applicants += v.personName
        }else{
          applicants += "，"+v.personName
        }
    });
    return applicants;
  }
});

   