
angular.module('sbAdminApp').filter('formatDate', function () {
  return function(data) {
    if(!data) {
      return '-';
    }
    if(typeof data == 'string') {
      return data.substring(0, 10);
    }
    var date = new Date(data);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    Y = date.getFullYear() + '-';
    M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    D = date.getDate() + ' ';
    h = date.getHours() + ':';
    m = date.getMinutes() + ':';
    s = date.getSeconds();
    D = D > 9? D : '0'+D;
    return Y+M+D;
  }
});

angular.module('sbAdminApp').controller('AIOCaseListCtrl', function (PoliceConfig,PoliceService,AdminConstant,$location,$scope, $stateParams, $state, $http, $log, AlgorithmConfig, AlgorithmService, DictionaryConfig, toaster, $filter,IdentityService) {
  $scope.showHeaderQuitBtn = true; //显示返回按钮

  $scope.press = '';//按键按下标识

  $scope.searchVO = {
    pageNo: 1, //当前页
    pageSize: 10, //每页条数
    pageTotal: 0 //总页数
  };

  //案件列表数组
  $scope.caseList = [];

  //初始化
  $scope.initData = function () {
    //添加查询案件标识
    $scope.checkCaseFlag = true;
    $scope.infoList();
  };

  $scope.list = []; //总数据

  //通过身份证信息获取案件列表
  $scope.infoList = function () {
    PoliceService.queryAccidentInfo({personCard: $stateParams.idNo, pageNo: $scope.searchVO.pageNo}).success(function (res) {
      if(res.code == PoliceConfig.commonConstant.SUCCESS){
        $scope.caseList = res.result;
        $scope.searchVO.pageTotal = res.total;
        //当只存在一条数据时，直接打开该案件
        if($scope.searchVO.pageTotal == '1') {
          //跳到案件信息页面
          $state.go('AIOCaseDetail', {"id":$scope.caseList[0].id, "personCard": $stateParams.idNo, "oneCase": true, "flag": $stateParams.flag});
        }
        //取消查询案件标识
        $scope.checkCaseFlag = false;
      }else {
        //toaster.pop("error", "错误", res.message);
      }
    });
    //格式化数据
    //formatJson($scope.police)
  };


  //查看案件详细
  $scope.checkCaseDetail = function (police) {
    console.log(police)
    $state.go("AIOCaseDetail",{"id":police.id, "personCard": $stateParams.idNo, "flag": $stateParams.flag});
  };

  //格式化数据 后台->前台
  function formatJson(v) {
    if (v.accidentDate) v.accidentDate = dateToString(v.accidentDate);
  }

  //格式化数据 前台->后台
  function formatData(v) {
    if (v.accidentDate) v.accidentDate = parseISO8601(v.accidentDate);
  }

  //假分页
  /*function pageationInit(list) {
    //caseList
    //判断是否需要分页
    if(list.length > $scope.searchVO.pageSize) {
      $scope.caseList = list.slice(($scope.searchVO.pageNo-1)*$scope.searchVO.pageSize, $scope.searchVO.pageNo*$scope.searchVO.pageSize);
    } else {
      $scope.caseList = list;
    }
  };*/

  $('.caseListJump').bind("selectstart", function () { return false; });//阻止元素双击变色

  //跳转页面
  $scope.jumpPage = function (type) {
    if(type == 'prev') {
      $scope.searchVO.pageNo--;
    }
    if(type == 'next') {
      $scope.searchVO.pageNo++;
    }
    $scope.infoList();
    //pageationInit($scope.list);
  };

  //////////////////////////格式化数据///////////////////////////////
  //日期对象转化成字符串
  var dateToString = function (date) {
    if(typeof date === 'object') {
      date = $filter('date')(date, 'yyyy-MM-dd HH:mm:ss');
    } else {
      var nowDate = new Date(date.split(',').join('/'));
      date = $filter('date')(nowDate, 'yyyy-MM-dd HH:mm:ss');
    }
    return date;
  };
  //将后台时间转化成字符串
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

  //初始化数据
  $scope.initData();
});