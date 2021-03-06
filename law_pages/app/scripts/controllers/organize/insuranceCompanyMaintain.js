/**
 * Created by Administrator on 2018/5/24.
 */
var app = angular.module('sbAdminApp');
app.filter('filterRegions', function () {
  return function(arr) {
    return  arr.filter(function(v) {
      //return v.level!= 4 && v.fullName != '台湾省' && v.fullName != '香港特别行政区' && v.fullName != '澳门特别行政区' && v.fullName != '境外';
      return v.level!= 4
    })
  }
});

app.controller('insuranceCompanyMaintainCtrl', function($scope,AdjustService,$filter,LoginService,LoginConfig,$log,toaster,$state,AdminConstant,DictionaryConfig,$timeout,$rootScope, Upload) {
  //查询调解Service
  $scope.adjustService = AdjustService;
  //填充区域信息
  $scope.adminRegion = $filter('filterRegions')(AdminConstant.administrationRegions);
  //保险公司
  $scope.insuranceList = DictionaryConfig.insuranceList;
  //代表人类型
  $scope.idTypeList = [{id: "1", value: "法定代表人"}, {id: "2", value: "负责人"}];
  //代理人类型
  $scope.agentTypeList = [{id: "0", value: "委托"}, {id: "1", value: "法定"}];
  //证件类型
  $scope.certificatesTypeList = DictionaryConfig.certificateTypeConstant;
  //委托授权
  $scope.proxyPermissionConstantList = DictionaryConfig.proxyPermissionConstant;

  //查询框数据对象
  function QueryInsuranceVO(totalPage, pageNo) {
    this.areaId = '';
    this.parentId = '';
    this.pageSize = '10';
    this.totalPage = totalPage || '';
    this.pageNo = pageNo || '1';
  }
  $scope.queryInsuranceVO = new QueryInsuranceVO();

  //保险公司数据对象（查看、编辑、新增使用）
  $scope.insuranceInfoVO = {};

  $scope.insuranceCompanyList = [];

  //选择系统保险公司
  $scope.queryInsuranceList = false;
  $scope.queryInsuranceFocus1 = function() {
    if (!$scope.queryInsuranceList) $scope.queryInsuranceList = true;
  };
  $scope.queryInsuranceFocus2 = function() {
    if (!$scope.queryInsuranceList) $scope.queryInsuranceList = true;
  };

  $scope.queryInsuranceBlur1 = function(){
    if($scope.queryInsuranceList){
      $timeout(function(){
        $scope.queryInsuranceList = false;
      }, 200);
    }
  };
  $scope.queryInsuranceBlur2 = function(){
    if($scope.queryInsuranceList){
      $timeout(function(){
        $scope.queryInsuranceList = false;
      }, 200);
    }
  };

  //总公司选择事件
  $scope.selectedCompanyName1 = function (company) {
    $scope.queryInsuranceVO.parentName = company.text;
    $scope.queryInsuranceVO.parentId = company.id;
  };
  $scope.selectedCompanyName2 = function (company) {
    $scope.insuranceInfoVO.parentName = company.text;
    $scope.insuranceInfoVO.parentId = company.id;
  };

  $scope.initData = function () {
    $scope.handleQueryInsurance()
  };

  //点击搜索事件
  $scope.handleQueryInsurance = function (isPage) {
    //调用后台接口
    console.log($scope.queryInsuranceVO)
    if(!isPage) $scope.queryInsuranceVO.pageNo = '1'; //重置成第一页
    //查询数据
    $scope.adjustService.queryInsuranceCompanyMessageInfoListUrl($scope.queryInsuranceVO).success(function (res) {
      console.log(res)
      if(res.code == '0') {
        $scope.insuranceCompanyList = res.result;
      } else {
        $rootScope.toaster("error", "错误", res.message);
      }
    })

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

  //新增或更新数据
  $scope.submitModal = function () {
    console.log($scope.insuranceInfoVO)
    if(!validData()) {
      return;
    }
    $scope.adjustService.insertOrUpdateInsuranceCompanyMessageInfoUrl($scope.insuranceInfoVO).success(function (res) {
      if(res.code == '0') {
        $scope.insuranceModal = false;
        $scope.initData();
        $rootScope.toaster("success", "成功", "保存成功！");
      } else {
        $rootScope.toaster("error", "错误", res.message);
      }
    })
  };

  //查看、编辑、新增操作
  $scope.checkDetail = function (insurance) {
    $scope.insuranceInfoVO = angular.copy(insurance) || {}; //有insurance，表示编辑
    $scope.insuranceModal = true; //显示弹出框
  };

  //删除保险公司
  $scope.deleteInsurance = function (id) {
    console.log(id)
    if(confirm('确认删除该保险公司吗？')) {
      $scope.adjustService.deleteInsuranceCompanyMessageInfoUrl({id: id}).success(function (res) {
        if(res.code == '0') {
          $scope.handleQueryInsurance();
          $rootScope.toaster("success", "成功", "删除成功！");
        } else {
          $rootScope.toaster("error", "错误", res.message);
        }
      })
    }
  };

  //关闭模态框
  $scope.closeModal = function () {
    $scope.insuranceModal = false; //隐藏弹出框
  };

  //分页跳转
  $scope.pageChanged = function () {
    $scope.pageNo = $scope.queryInsuranceVO.pageNo;
    $scope.handleQueryInsurance('isPage'); //执行搜索事件
  };

  //验证数据
  function validData() {
    var v = $scope.insuranceInfoVO;
    var telReg = /^[1][3,4,5,7,8,9][0-9]{9}$/;
    if(!v.companyName) {
      v.companyNameError = true;
      $rootScope.toaster("error", "错误", "企业名称不能为空！");
      return;
    } else v.companyNameError = undefined;
    if(!v.parentName) {
      v.parentNameError = true;
      $rootScope.toaster("error", "错误", "总公司不能为空！");
      return;
    } else v.parentNameError = undefined;
    if(!v.legalType) {
      v.legalTypeError = true;
      $rootScope.toaster("error", "错误", "代表人类型不能为空！");
      return;
    } else v.legalTypeError = undefined;
    if(!v.legalName) {
      v.legalNameError = true;
      $rootScope.toaster("error", "错误", "代表人姓名不能为空！");
      return;
    } else v.legalNameError = undefined;
    if(!v.telephone) {
      v.telephoneError = true;
      $rootScope.toaster("error", "错误", "代表人电话号码不能为空！");
      return;
    } else v.telephoneError = undefined;
    /*if(v.telephone && !telReg.test(v.telephone)) {
      v.telephoneError = true;
      $rootScope.toaster("error", "错误", "代表人电话号码格式不正确！");
      return;
    } else v.telephoneError = undefined;*/
    if(!v.areaName) {
      v.areaNameError = true;
      $rootScope.toaster("error", "错误", "所在地区不能为空！");
      return;
    } else v.areaNameError = undefined;
    if(!v.residence) {
      v.residenceError = true;
      $rootScope.toaster("error", "错误", "所住地址不能为空！");
      return;
    } else v.residenceError = undefined;
    if(!v.sendAddress) {
      v.sendAddressError = true;
      $rootScope.toaster("error", "错误", "送达地址不能为空！");
      return;
    } else v.sendAddressError = undefined;
    return true;
  };

  $scope.initData();

  ////////////////////////地区选择////////////////////////////
  //地区树的定义
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
  //搜索处地区树节点信息
  $scope.selectAdmin = function(node, selected, event) {
    var selectedNodes = selected.selected;
    if (selectedNodes.length > 0 && selected.node.original.level =='3') {
      var selectedRegion = $scope.adminRegion[selectedNodes[0]];
      if ($scope.queryInsuranceVO.areaName != selectedRegion.fullName) {
        $scope.queryInsuranceVO.areaName = selectedRegion.fullName;
        //$scope.queryInsurance.regionCode = selectedRegion.regionCode;
        $scope.queryInsuranceVO.areaId = selectedRegion.id;
        angular.element("#regNamebox").hide();
      }
    }
  };

  ////////弹出框地区树///////////
  //控制树阻止冒泡
  angular.element("#regNameInput2").click(function(e){
    angular.element("#regNamebox2").show();
    stopBubble(e);
  });
  angular.element("#regNamebox2").click(function(e){
    stopBubble(e);
  });
  angular.element("body").click(function(){
    angular.element("#regNamebox2").hide();
  });
  //搜索处地区树节点信息
  $scope.selectAdmin2 = function(node, selected, event) {
    var selectedNodes = selected.selected;
    if (selectedNodes.length > 0 && selected.node.original.level =='3') {
      var selectedRegion = $scope.adminRegion[selectedNodes[0]];
      if ($scope.insuranceInfoVO.areaName != selectedRegion.fullName) {
        $scope.insuranceInfoVO.areaName = selectedRegion.fullName;
        $scope.insuranceInfoVO.areaId = selectedRegion.id;
        angular.element("#regNamebox2").hide();
      }
    }
  };



  var insuranceCompany;
  $scope.importInsuranceCompanyExcel = function(file){
    if (!file) return;
    if(insuranceCompany){
        insuranceCompany.destroy();
        $('#original').show();
    }
    Upload.upload({
      url: LoginConfig.pictureConstant.importInsuranceCompanyExcel,
      data: {
        adminRegion:angular.toJson($scope.adminRegion),
        insuranceList:angular.toJson($scope.insuranceList)
      },
      file: file
    }).success(function(result) {
      if (result.code == LoginConfig.commonConStant.SUCCESS) {
        console.log('1111111111111111====成功');
        $scope.encryString = result.result;
        alert($scope.encryString);
        console.log('1111111111111111====' + $scope.headAddress);
      } else {
        $scope.encryString = result.result;
        alert($scope.encryString);
        console.log('1111111111111111====失败');
        // toaster.pop(level, title, $scope.CONSTANT.messageHeadUploadError);
      }
    });
  }
});
