'use strict';
var app = angular.module('sbAdminApp');
app.filter('filterRegions', function () {
  return function(arr) {
    return  arr.filter(function(v) {
      //return v.level!= 4 && (v.fullName != '台湾省' && v.fullName != '香港特别行政区' && v.fullName != '澳门特别行政区' && v.fullName != '境外');
      return v.level!= 4
    })
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

angular.module('sbAdminApp').controller('queryInsuranceListCtrl', function($scope, AdminConstant, $stateParams, $state, $location, $timeout, $http, $log, $filter, $modal, toaster, AdjustService, AdjustConfig, DictionaryConfig, Upload, IdentityService, AnchorSmoothScroll,$rootScope,LoginService) {
  console.log($stateParams)
  //查询调解Service
  $scope.adjustService = AdjustService;
  //填充区域信息
  $scope.adminRegion = $filter('filterRegions')(AdminConstant.administrationRegions);
  //保险公司
  $scope.insuranceList = DictionaryConfig.insuranceList;

  //数据常量
  //代表人类型
  $scope.idTypeList = [{id: "1", value: "法定代表人"}, {id: "2", value: "负责人"}];
  //代理人类型
  $scope.agentTypeList = [{id: "0", value: "委托"}, {id: "1", value: "法定"}];
  //证件类型
  $scope.certificatesTypeList = DictionaryConfig.certificateTypeConstant;
  //委托授权
  $scope.proxyPermissionConstantList = DictionaryConfig.proxyPermissionConstant;

  //代表当前搜索框所关联的被申请人（step2中的保险公司）数据
  var currApplicant = {};

  //查询框数据对象
  function QueryInsuranceVO(totalPage, pageNo) {
    this.areaId = '';
    this.parentId = '';
    this.pageSize = '10';
    this.totalPage = totalPage || '';
    this.pageNo = pageNo || '1';
  }
  $scope.queryInsuranceVO = new QueryInsuranceVO();

  //保险公司数据对象
  $scope.insuranceInfoVO = {};

  //保险公司列表数据
  $scope.insuranceCompanyList = [];

  //弹出框显示隐藏标识
  $scope.queryInsuranceShow = false;

  //显示查询框
  $scope.initData = function () {
    if($stateParams.region) {
      //赋值当前调解员所在区域（只要两级城市）
      $scope.queryInsuranceVO.areaName = $stateParams.region;
      for(var i = 0; i < $scope.adminRegion.length; i++) {
        if($scope.queryInsuranceVO.areaName == $scope.adminRegion[i].fullName) {
          $scope.queryInsuranceVO.areaId = $scope.adminRegion[i].id

          //赋值当前被申请人的总公司
          $scope.queryInsuranceVO.parentName = $stateParams.companyName;
          $scope.queryInsuranceVO.parentId = $stateParams.parentId;

          //执行搜索方法
          $scope.handleQueryInsurance();
          break;
        }
      }
    } else {
      //执行搜索方法
      $scope.handleQueryInsurance();
    }
  };

  //选择系统保险公司
  $scope.queryInsuranceList = false;
  $scope.queryInsuranceFocus = function() {
    if (!$scope.queryInsuranceList) $scope.queryInsuranceList = true;
  }

  $scope.queryInsuranceBlur = function(){
    if($scope.queryInsuranceList){
      $timeout(function(){
        $scope.queryInsuranceList = false;
      }, 200);
    }
  };
  //总公司选择事件
  $scope.selectedCompanyName = function (company) {
    $scope.queryInsuranceVO.parentName = company.text;
    $scope.queryInsuranceVO.parentId = company.id;
  };

  //点击搜索事件
  $scope.handleQueryInsurance = function (isPage) {
    //调用后台接口
    console.log($scope.queryInsuranceVO)
    if(!isPage) $scope.queryInsuranceVO.pageNo = '1'; //重置成第一页
    //查询列表数据
    $scope.adjustService.queryInsuranceCompanyMessageInfoListUrl($scope.queryInsuranceVO).success(function (res) {
      if(res.code == '0') {
        $scope.insuranceCompanyList = res.result;
      } else {
        $rootScope.toaster("error", "错误", res.message);
      }
    })
    //查询数据条数
    //查询条数
    $scope.adjustService.queryInsuranceCompanyMessageInfoCountUrl($scope.queryInsuranceVO).success(function (res) {
      console.log(res)
      if(res.code == '0') {
        $scope.queryInsuranceVO.totalPage = res.result;
        $scope.totalPage = res.result;
      } else {
        $rootScope.toaster("error", "错误", res.message);
      }
    })
  };

  //重置搜索项
  $scope.resetQuery = function () {
    $scope.queryInsuranceVO = new QueryInsuranceVO($scope.totalPage, $scope.pageNo);
  };

  //分页跳转
  $scope.pageChanged = function () {
    $scope.pageNo = $scope.queryInsuranceVO.pageNo;
    $scope.handleQueryInsurance('isPage');
  };

  //查看公司详细
  $scope.checkInsuranceDetail = function (insurance) {
    console.log(insurance)
    $scope.showInsuranceDetail = true;
    //将当前查看公司保存
    $scope.insuranceInfoVO = angular.copy(insurance);
  };

  //将本数据带入到当前的保险公司中
  $scope.chooseInsurance = function (insurance) {
    console.log(insurance)
    //关闭弹框
    $scope.showInsuranceDetail = false;
    $rootScope.toaster("success", "成功", "信息带入成功！");
    //调用父元素方法，将计算结果返回
    window.opener.saveInsuranceCompany(insurance);
  };

  //关闭公司详细信息
  $scope.closeInsuranceDetail = function () {
    $scope.showInsuranceDetail = false;
  };

  ////////////////////////地区选择////////////////////////////
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
  angular.element("#regNameInput").click(function(e){
    angular.element("#regNamebox").show();
    stopBubble(e);
  });
  angular.element("#regNamebox").click(function(e){
    stopBubble(e);
  });
  angular.element("body").click(function(){
    angular.element("#regNamebox").hide();
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
      var selectedRegion = $scope.adminRegion[selectedNodes[0]];
      if ($scope.queryInsuranceVO.areaName != selectedRegion.fullName) {
        $scope.queryInsuranceVO.areaName = selectedRegion.fullName;
        //$scope.queryInsurance.regionCode = selectedRegion.regionCode;
        $scope.queryInsuranceVO.areaId = selectedRegion.id;
        angular.element("#regNamebox").hide();
        $scope.isShowTree = false;
      }
    }
  };

  $scope.initData()

});