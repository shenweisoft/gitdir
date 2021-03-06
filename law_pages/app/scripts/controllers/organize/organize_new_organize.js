app.controller('CreateOrUpdateSysOrgCtrl', function($log, $scope, $modalInstance, $timeout, AdminConstant, DictionaryConfig, LoginConfig, LoginService, items) {
  //保存组织Service
  $scope.insertSysOrg = LoginService.insertSysOrg;
  //修改组织Service
  $scope.updateSysOrg = LoginService.updateSysOrg;
  //鉴定项目
  $scope.appraisalItemList = angular.copy(DictionaryConfig.appraisalTypeList);
  //查询法院组织名称
  $scope.queryCourtDictionary = LoginService.queryCourtDictionary;
  //保险公司
  $scope.insuranceList = DictionaryConfig.insuranceList;
  //填充区域信息
  $scope.adminRegion = AdminConstant.administrationRegions;
  //获取并复制调解选项
  $scope.organizeTypeList = assignObj(DictionaryConfig.newOrganizeType);
  //调解机构的类型代码集合
  $scope.typeCodeList = DictionaryConfig.typeCodeList;

  //默认不显示树
  $scope.isShowTree = false;
  //标题
  $scope.title = "新建组织";
  //定义错误信息常量
  $scope.CONSTANT = {
    "regionNameErrorMessage": "请您选择所选区域",
    "orgCodeErrorMessage": "请您输入组织代码",
    "orgNameErrorMessage": "请您选择组织名称",
    "orgFullNameErrorMessage": "请您输入组织全称",
    "licenceErrorMessage": "请您输入许可证号",
    "legalPersonErrorMessage": "请您输入法人",
    "personLiableErrorMessage": "请您输入责任人",
    "telephoneErrorMessage": "请您输入电话",
    "faxErrorMessage": "请您输入传真",
    "emailErrorMessage": "请您输入邮箱",
    "rangeErrorMessage": "请您输入业务范围",
    "addressErrorMessage": "请您输入地址",
    "appraisalItemErrorMessage": "请您选择鉴定类型",
    'typeCodeErrorMessage':'请您选择组织类型代码'
  };
  //区域树配置
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
      'default': {
        icon: 'iconfont icon-dizhi'
      },
      folder: {
        icon: 'iconfont icon-wenjian1'
      }
    },
    version: 1,
    plugins: ['types']
  };

  //查询上级机构方法(法院和调解机构)
  $scope.queryParentOrg = function() {
    $scope.superiorCourtList = items.originalOrgList.filter(function(val) {
      //法院地市级取上级结构
      if ($scope.sysOrg.extPro.regionLevel != "1" && $scope.sysOrg.category == "#01") {
        return val.extPro.regionId == $scope.sysOrg.extPro.regionParentId && val.category == "#01";
      }else if ($scope.sysOrg.extPro.regionLevel != "1" && $scope.sysOrg.category == "#05") {
          return val.extPro.regionId == $scope.sysOrg.extPro.regionParentId && val.category == "#05";
      }  else if ($scope.sysOrg.extPro.regionLevel != "1" && $scope.sysOrg.category == "#04") {
        return val.extPro.regionId == $scope.sysOrg.extPro.regionParentId && val.category == "#04";
      } else {
        return val.extPro.regionId == $scope.sysOrg.extPro.regionId && val.category == "#01";
      }
    });
    //获取调解结果设定
    var chooseArr = $scope.sysOrg.extPro.justiceType && $scope.sysOrg.extPro.justiceType.split(',') || []
    _.each(assignObj(DictionaryConfig.newOrganizeType, 'true'), function (obj) {
      _.each(chooseArr, function (item) {
         if(item == obj.id) {
           obj.select = true
         }
      })
    })
  };

  //复制调解选项
  function assignObj(arr, type) {
    var newArr = [];
    _.each(arr, function(obj) {
      var newObj = {};
      _.each(obj, function(v, k) {
        if(type && k == 'select') {
          newObj[k] = false
        } else {
          newObj[k] = v
            console.log(newObj)
        }
      });
      newArr.push(newObj);
    });
    $scope.organizeTypeList = newArr;
    return $scope.organizeTypeList
  }

  $scope.blurAdmin = function(){
    if($scope.isShowTree){
      $timeout(function(){
        $scope.isShowTree = false;
      }, 200);
    }
  };

  // select the admin regions
  $scope.selectAdmin = function(node, selected, event) {
    var selectedNodes = selected.selected;
    if (selectedNodes.length > 0) {
      var selectedRegion = $scope.adminRegion[selectedNodes[0]];
      $scope.sysOrg.extPro.regionId = selectedRegion.id;
      $scope.sysOrg.extPro.regionName = selectedRegion.fullName;
      $scope.sysOrg.extPro.regionCode = selectedRegion.regionCode;
      $scope.sysOrg.extPro.regionLevel = selectedRegion.level;
      $scope.sysOrg.extPro.regionParentId = selectedRegion.parent;
      //查询上级机构列表
      $scope.queryParentOrg();
      $scope.sysOrg.orgCode = "01" + $scope.sysOrg.extPro.regionCode + "00";
      $scope.isShowTree = false;
    }
  };

  //组织主表
  function SysOrg() {
    this.id = "";
    this.text = "";
    this.category = items.selectedNode.id;
    this.orgCode = "";
    this.parentId = "";
    this.extPro = {};
    this.courtCode = '8';
    this.orgFullName = '';
    this.regionName = '';
    this.regionCode = '';
    this.typeCode = '';
  }
  //扩展表信息
  function ExtPro() {
    this.regionName = "";
    this.regionId = "";
    this.regionParentId = "";
    this.regionCode = "";
    this.regionLevel = "";
    //机构简称
    this.orgNameShort = "";
    //许可证
    this.licence = "";
    //法人
    this.legalPerson = "";
    //责任人
    this.personLiable = "";
    //电话
    this.telephone = "";
    //传真
    this.fax = "";
    //邮箱
    this.email = "";
    //业务范围
    this.range = "";
    //地址
    this.address = "";
    //鉴定项目
    this.appraisalItem = "";
    //收款单位
    this.company = "";
    //开户行
    this.bankAccount = "";
    //账户
    this.account = "";
    //账号
    this.accountNumber = "";
    //鉴定机构随机
    this.isRandom = "1";

  }

  //如果为司法鉴定则查询处理鉴定项目
  $scope.handleQueryAppraisalItemList = function() {
    $scope.sysOrg.extPro.appraisalItem.split(",").forEach(function(val) {
      var appraisalItem = _.find($scope.appraisalItemList, {
        id: val
      });
      appraisalItem.selected = true;
    });
  };
  //组织类型默认赋值
  $scope.typeList = DictionaryConfig.orgTypeConstant;
  //如果存在
  if (items.sysOrg) {
    $scope.sysOrg = angular.copy(items.sysOrg);
    $scope.sysOrg.parentId = $scope.sysOrg.parentId + "";
    //上级机构列表
    $scope.queryParentOrg();
    //如果为司法鉴定则查询处理鉴定项目
    if ($scope.sysOrg.category == "#03") {
      $scope.handleQueryAppraisalItemList();
    }
  } else {
    $scope.sysOrg = new SysOrg();
    $scope.sysOrg.extPro = new ExtPro();
    //表示为调解机构
    if($scope.sysOrg.category == "#02"){
      $scope.sysOrg.extPro.template = "（<year>）<shortName>调<regulationNo>";
      $scope.sysOrg.extPro.regulationNum = "5";
    }
  }

  //类型改变是上级法院以及所属机构之间切换
  $scope.changeType = function() {
    if ($scope.sysOrg.extPro.regionName) {
      $scope.queryParentOrg();
    }
  };
  //验证
  function validateForm() {
    $scope.regionNameErrorMessage = '';
    $scope.orgCodeErrorMessage = '';
    $scope.orgNameErrorMessage = "";
    $scope.orgFullNameErrorMessage = '';
    $scope.licenceErrorMessage = "";
    $scope.legalPersonErrorMessage = "";
    $scope.personLiableErrorMessage = "";
    $scope.telephoneErrorMessage = "";
    $scope.faxErrorMessage = "";
    $scope.emailErrorMessage = "";
    $scope.rangeErrorMessage = "";
    $scope.addressErrorMessage = "";
    $scope.appraisalItemErrorMessage = "";
    $scope.typeCodeErrorMessage = "";

    if (!$scope.sysOrg.extPro.regionId) {
      $scope.regionNameErrorMessage = $scope.CONSTANT.regionNameErrorMessage;
      return false;
    }
    if (!$scope.sysOrg.orgCode) {
      $("[name='orgCodeName']").focus();
      $scope.orgCodeErrorMessage = $scope.CONSTANT.orgCodeErrorMessage;
      return false;
    }
    if (!$scope.sysOrg.text && $scope.sysOrg.category != '#05') {
      $scope.orgNameErrorMessage = $scope.CONSTANT.orgNameErrorMessage;
      $("[name='organizationName']").focus();
      return false;
    }
    //法院验证
    if($scope.sysOrg.category == '#01'){
      if (!$scope.sysOrg.orgFullName ) {
        $scope.orgFullNameErrorMessage = $scope.CONSTANT.orgFullNameErrorMessage;
        $("[name='orgFullName']").focus();
        return false;
      }
    }
    //如果为调解机构
    if ($scope.sysOrg.category == "#02") {
        //如果类型代码为空
        if (!$scope.sysOrg.typeCode) {
            $("[name='typeCode']").focus();
            $scope.typeCodeErrorMessage = $scope.CONSTANT.typeCodeErrorMessage;
            return false;
        }
    }

    //鉴定机构验证
    if ($scope.sysOrg.category == "#03") {
      //许可证
      if (!$scope.sysOrg.extPro.licence) {
        $("[name='licence']").focus();
        $scope.licenceErrorMessage = $scope.CONSTANT.licenceErrorMessage;
        return false;
      }
      //法人
      if (!$scope.sysOrg.extPro.legalPerson) {
        $("[name='legalPerson']").focus();
        $scope.legalPersonErrorMessage = $scope.CONSTANT.legalPersonErrorMessage;
        return false;
      }
      //负责人
      if (!$scope.sysOrg.extPro.personLiable) {
        $("[name='personLiable']").focus();
        $scope.personLiableErrorMessage = $scope.CONSTANT.personLiableErrorMessage;
        return false;
      }
      //电话
      if (!$scope.sysOrg.extPro.telephone) {
        $("[name='telephone']").focus();
        $scope.telephoneErrorMessage = $scope.CONSTANT.telephoneErrorMessage;
        return false;
      }
      //传真
      if (!$scope.sysOrg.extPro.fax) {
        $("[name='fax']").focus();
        $scope.faxErrorMessage = $scope.CONSTANT.faxErrorMessage;
        return false;
      }
      //邮箱
      if (!$scope.sysOrg.extPro.email) {
        $("[name='email']").focus();
        $scope.emailErrorMessage = $scope.CONSTANT.emailErrorMessage;
        return false;
      }
      //业务范围
      if (!$scope.sysOrg.extPro.range) {
        $("[name='range']").focus();
        $scope.rangeErrorMessage = $scope.CONSTANT.rangeErrorMessage;
        return false;
      }
      //地址
      if (!$scope.sysOrg.extPro.address) {
        $("[name='address']").focus();
        $scope.addressErrorMessage = $scope.CONSTANT.addressErrorMessage;
        return false;
      }
      //鉴定项目
      var appraisalItemFlag = false;
      $scope.appraisalItemList.forEach(function(val) {
        if (val.selected) {
          appraisalItemFlag = true;
        }
      });

      if (!appraisalItemFlag) {
        $scope.appraisalItemErrorMessage = $scope.CONSTANT.appraisalItemErrorMessage;
        return false;
      }
    }
    return true;
  };

  //处理保存集合
  $scope.handleSaveAppraisalItemList = function() {

    var appraisalItem = "";
    var appraisalItemFlag = true;
    $scope.appraisalItemList.forEach(function(val) {
      if (val.selected) {
        if (!appraisalItemFlag) {
          appraisalItem += ",";
        }
        appraisalItem += val.id
        appraisalItemFlag = false;
      }
    });

    $scope.sysOrg.extPro.appraisalItem = appraisalItem;
  };
 
  //保存
  $scope.saveSysOrg = function() {
    //验证信息
    if (validateForm()) {
      //鉴定机构处理鉴定项目
      if ($scope.sysOrg.category == "#03") {
        $scope.sysOrg.parentId = "";
        $scope.handleSaveAppraisalItemList();
      }else{
        $scope.sysOrg.parentId = $scope.sysOrg.parentId != 'undefined'? $scope.sysOrg.parentId:"";
      }
      if ($scope.sysOrg.category == "#05") {
        $scope.sysOrg.text = $scope.sysOrg.orgFullName;
      }

      $scope.sysOrg.regionName = $scope.sysOrg.extPro.regionName;
      $scope.sysOrg.regionCode = $scope.sysOrg.extPro.regionCode;
      //添加结果设定
      $scope.sysOrg.extPro.justiceType = getjusticeType($scope.organizeTypeList);
      $scope.sysOrg.extPro = JSON.stringify($scope.sysOrg.extPro);
      //console.log($scope.sysOrg.extPro)
      //return false
      $log.info($scope.sysOrg);
      //表示修改
      if (items.sysOrg) {
        //请求成功
        $scope.updateSysOrg($scope.sysOrg).success(function(result) {
          if (result.code == LoginConfig.commonConStant.SUCCESS) {
            $modalInstance.close();
          } else {
            //TODO
            alert("请联系系统管理员");
          }
        });
      } else {
        $scope.insertSysOrg($scope.sysOrg).success(function(result) {
          //请求成功
          if (result.code == LoginConfig.commonConStant.SUCCESS) {
            $modalInstance.close();
          } else {
            //TODO
            alert("请联系系统管理员");
          }
        });
      }
    }
  };

  //获取调解结果状态
  var getjusticeType = function(arr) {
    var list = [];
    _.each(arr, function (obj) {
        if(obj.select) {
          list.push(obj.id)
        }
    })
    return list.join(',');
  }
  
  //
  $scope.confirmValue = 0;
  $scope.adjustValue = 0;
  $scope.chooseAdjustResult = function(e,flag){
    if(e.currentTarget.checked){
      flag == 1?$scope.confirmValue = "1":$scope.adjustValue = "2"
    }else{
      flag == 1?$scope.confirmValue = "0":$scope.adjustValue = "0"
    }
    $scope.sysOrg.extPro.adjustResult = $scope.confirmValue +""+ $scope.adjustValue;
  }

  //点击取消
  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };

  $scope.selectedCourtOpen = function (e) {
    $scope.isShowTree1 = true;
    angular.element("#courtTree").show();
    stopBubble(e);
  }

  angular.element("body").click(function(){
    angular.element("#courtTree").hide();
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
});