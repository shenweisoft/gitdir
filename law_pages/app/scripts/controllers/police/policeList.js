var app = angular.module('sbAdminApp');
app.filter('filterRegions', function () {
  return function (arr) {
    return arr.filter(function (v) {
      return v.level != 4;
    })
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
app.filter('id2Text', function() {
  return function(id,data) {
    var result = _.find(data, {
      id: id+""
    });
    return result? result.value:""
  }
});
app.filter('valueNull1', function() {
  return function(val) {
    return val && val || '-';
  }
});
angular.module('sbAdminApp').controller('PoliceListCtrl', function (AdminConstant,$location,$scope, $stateParams, $state, $http, $log, PoliceConfig, PoliceService, DictionaryConfig, toaster, $filter,IdentityService,$rootScope) {

  //案由
  $scope.causeTypeList = PoliceConfig.causeTypeList;

  //定义页面常量
  $scope.CONSTANT = {
    accidentNumberNullMessage: "请输入事故认定书编号",
    cityCodeNullMessage: "请输入事故地点",
    highSpeedNullMessage: "请选择是否是高速",
    idNoNullMessage: "请输入身份证号码",
    messageIdentityFormatError: "身份证号格式有误"
  };

  //是否高速
  $scope.highSpeedList = PoliceConfig.highSpeedList;
  //存储案件信息
  $scope.law = {
    police: {
      serialNo: "110101201800912", //默认值
      caseType: "1" //默认值
    }
  };
  //创建搜索对象
  $scope.searchVO = {
    state: '1000',
    pageNo: '1',
    pageSize: '10', //每页条数
    searchInfo: '', //搜索框文字
    totalPage: 0 //总页数
  };

  $scope.initData = function () {
    //获取案件列表
    $scope.queryPoliceInfoList($scope.searchVO);
    //获取案件列表总页数
    $scope.queryPoliceInfoSum();
  };

  //查询案件列表
  $scope.queryPoliceInfoList = function (data) {
    PoliceService.queryPoliceInfoListInfo(data).success(function (res) {
      if(res.code == PoliceConfig.commonConstant.SUCCESS){
        $scope.policeInfoList = res.result;
        console.log(res)
      }else {
        $rootScope.toaster("error", "错误", res.message);
      }
    })
  };

  //查询案件列表总数
  $scope.queryPoliceInfoSum = function () {
    PoliceService.queryPoliceInfoSumInfo($scope.searchVO).success(function (res) {
      if(res.code == PoliceConfig.commonConstant.SUCCESS){
        $scope.searchVO.totalPage = res.result;
        console.log(res)
      }else {
        $rootScope.toaster("error", "错误", res.message);
      }
    })
  };
  //搜索
  $scope.queryLawCase = function () {
    console.log($scope.searchVO);
    $scope.searchVO.pageNo = '1';
    //获取案件列表
    $scope.queryPoliceInfoList($scope.searchVO);
    //获取案件列表总页数
    $scope.queryPoliceInfoSum();
  };
  //分页跳转
  $scope.initOrg = function () {
    var data = angular.copy($scope.searchVO);
    data.searchInfo = '';
    $scope.queryPoliceInfoList(data);
  };

  //验证数据
  var validate = function () {
    var v = $scope.law.police;
    if(!v.accidentNumber) { //事故认定书编号
      v.accidentNumberError = true;
      $rootScope.toaster("error", "错误", $scope.CONSTANT.accidentNumberNullMessage);
      return false;
    } v.accidentNumberError = undefined;
    if(!v.cityCode) { //事故地点
      v.cityCodeError = true;
      $rootScope.toaster("error", "错误", $scope.CONSTANT.cityCodeNullMessage);
      return false;
    } v.cityCodeError = undefined;
    if(!v.highSpeed) { //是否高速
      v.highSpeedError = true;
      $rootScope.toaster("error", "错误", $scope.CONSTANT.highSpeedNullMessage);
      return false;
    } v.highSpeedError = undefined;
    if(!v.idNo) { //身份证号码
      v.idNoError = true;
      $rootScope.toaster("error", "错误", $scope.CONSTANT.idNoNullMessage);
      return false;
    } v.idNoError = undefined;
    if(!checkIdentity(v)) {
      v.idNoError = true;
      return false
    } v.idNoError = undefined;
    return true;
  };

  //查询交警案件
  $scope.queryDetail = function () {
    //验证数据
    if(validate()) {

      //格式化证书编号中的字符[]【】，()（）
      $scope.law.police.accidentNumber = $scope.law.police.accidentNumber.split('');
      if($scope.law.police.accidentNumber.indexOf('【') != -1) {
        $scope.law.police.accidentNumber.splice($scope.law.police.accidentNumber.indexOf('【'), 1, '[');
      }
      if($scope.law.police.accidentNumber.indexOf('】') != -1) {
        $scope.law.police.accidentNumber.splice($scope.law.police.accidentNumber.indexOf('】'), 1, ']');
      }
      /*if($scope.law.police.accidentNumber.indexOf('(') != -1) {
        $scope.law.police.accidentNumber.splice($scope.law.police.accidentNumber.indexOf('('), 1, '（');
      }
      if($scope.law.police.accidentNumber.indexOf(')') != -1) {
        $scope.law.police.accidentNumber.splice($scope.law.police.accidentNumber.indexOf(')'), 1, '）');
      }*/
      $scope.law.police.accidentNumber = $scope.law.police.accidentNumber.join('');

      //跳转到案件信息页面
      var url = $state.href("policeLawCaseDetail",{"police":JSON.stringify($scope.law.police),isShowBtn: 'true'});
      window.open(url,'_blank');
      /*PoliceService.selectPoliceAccidentInfo($scope.law.police).success(function (res) {
        if(res.code == PoliceConfig.commonConstant.SUCCESS){
          console.log(res)

          var url = $state.href("policeLawCaseDetail",{"police":JSON.stringify($scope.law.police),isShowBtn: 'true'});
          console.log(url)
          window.open(url,'_blank');
        }else {
          $rootScope.toaster("error", "错误", res.message);
        }
      })*/
    }
  };

  //清空查询数据
  $scope.handleReset = function () {
    if(confirm('确认清空？')) {
      $scope.law.police.accidentNumber = '';
      $scope.law.police.accidentRegion = '';
      $scope.law.police.cityCode = '';
      $scope.law.police.highSpeed = '';
      $scope.law.police.idNo = '';
    }
  };

  //补充案件
  $scope.supplementLawCase = function (police) {
    var policeId;
    if(police) {
      policeId = police.id;
    }
    //跳转到补充案件页面
    $state.go('dashboard.supplementPoliceLawCase', {"policeId": policeId});
  };

  /////////////////////////事故地点树状数据///////////////////////////
  //填充区域信息
  $scope.cityRegion = $filter('filterRegions')(AdminConstant.administrationRegions);
  //赔偿地树的定义
  $scope.treeConfig = {
    core: {
      multiple: false,
      animation: true,
      error: function(error) {
        $log.error('treeCtrl: error from js tree - ' + angular.toJson(error));
      },
      check_callback: true,
      worker: true
    },
    types: {
      "default": {
        icon: 'iconfont icon-dizhi'
      },
      folder: {
        icon: 'iconfont icon-wenjian1'
      }
    },
    version: 1,
    plugins: ['types']
  };
  //默认树为收起状态
  $scope.isShowTree = false;
  //控制树阻止冒泡
  $scope.cityNameClick = function (e) {
    angular.element("#cityNamebox").show();
    stopBubble(e);
  }
  $scope.cityNameboxClick = function (e) {
    stopBubble(e);
  }

  angular.element("body").click(function(){
    angular.element("#cityNamebox").hide();
  });
  function stopBubble(e) {
    // 如果提供了事件对象，则这是一个非IE浏览器
    if ( e && e.stopPropagation ) {
      // 因此它支持W3C的stopPropagation()方法
      e.stopPropagation();
    } else {
      // 否则，我们需要使用IE的方式来取消事件冒泡
      window.event.cancelBubble = true;
    }
  };
  //选择赔偿地树节点信息
  $scope.selectAdmin = function(node, selected, event) {
    var selectedNodes = selected.selected;
    if (selectedNodes.length > 0 && selected.node.original.level =='3') {
      var selectedRegion = $scope.cityRegion[selectedNodes[0]];
      if ($scope.law.police.cityName != selectedRegion.fullName) {
        $scope.law.police.accidentRegion = selectedRegion.fullName;
        $scope.law.police.cityCode = selectedRegion.regionCode;
        angular.element("#cityNamebox").hide();
        $scope.isShowTree = false;
      }
    }
  };

  ///////////////身份证验证/////////////////////
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

    if (applicant.idNo) {
      if(typeof applicant.idNo !== 'string') applicant.idNo = applicant.idNo.toString();
      applicant.idNo = applicant.idNo.replace(/ /g, "");
      if (applicant.idNo.length == 15) {
        var year = applicant.idNo.substring(6, 8);
        var month = applicant.idNo.substring(8, 10);
        var day = applicant.idNo.substring(10, 12);
        var tempDate = new Date(year, parseFloat(month) - 1, parseFloat(day));
        if (tempDate.getYear() == parseFloat(year) && tempDate.getMonth() == parseFloat(month) - 1 && tempDate.getDate() == parseFloat(day)) {
          applicant.idNoError = false;
        } else {
          applicant.idNoError = true;
          $rootScope.toaster("warn", "提示", $scope.CONSTANT.messageIdentityFormatError);
          return false;
        }
      } else if (applicant.idNo.length == 18 && isTrueValidateCodeBy18IdCard(applicant.idNo)) {
        var year = applicant.idNo.substring(6, 10);
        var month = applicant.idNo.substring(10, 12);
        var day = applicant.idNo.substring(12, 14);
        var tempDate = new Date(year, parseFloat(month) - 1, parseFloat(day));
        if (tempDate.getFullYear() == parseFloat(year) && tempDate.getMonth() == parseFloat(month) - 1 && tempDate.getDate() == parseFloat(day)) {
          applicant.idNoError = false;
        } else {
          applicant.idNoError = true;
          $rootScope.toaster("warn", "提示", $scope.CONSTANT.messageIdentityFormatError);
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
          $rootScope.toaster("warn", "提示", $scope.CONSTANT.messageIdentityFormatError);
          return false;
        } else applicant.idNoError = false;
      }
    }
    return true;
  };

  //初始化
  $scope.initData();
});

//原生js调用angular中的scope参数
function setAngularScopeParam(){
  // 通过controller来获取Angular应用
  var appElement = document.querySelector('#policeList');
  // //获取$scope变量
  var $scope = angular.element(appElement).scope();
  //将传来的数据放入数组
  //$scope.policeInfoList.push(msg);
  // //上一行改变了msg的值，如果想同步到Angular控制器中，则需要调用$apply()方法即可
  $scope.$apply();
  //调用控制器中的方法
  //获取案件列表
  $scope.queryPoliceInfoList($scope.searchVO);
  //获取案件列表总页数
  $scope.queryPoliceInfoSum();
}