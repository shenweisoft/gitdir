var app = angular.module('sbAdminApp');

app.filter('id2Text', function () {
  return function (id, data) {
    var result = _.find(data, {
      id: id + ""
    });
    return result ? result.value : ""
  }
});
app.filter('idText', function () {
  return function (id, data) {
    var str = '';
    data.forEach(function (val,index) {
      if(id.indexOf(val.id) != -1){
        if(index == data.length-1){
          str += val.value
        }else{
          str += val.value + ' '
        }
      }
    })
    return  str && str
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

app.filter('stringSpace', function() {
  return function(str) {
    if(str)
    {
      str = str.replace(/\s/gi,"+");
    }
    return str && str;
  }
});

angular.module('sbAdminApp').controller('caseInfoRegisterCtrl', function (LoginService,$modal,AdminConstant,Upload,AdjustConfig,$sce,$timeout,$location,$scope, $stateParams, $state, $http, $log, PoliceConfig, PoliceService, DictionaryConfig, toaster, $filter,IdentityService,$rootScope) {

  //重置保存，完成鉴定，完成补录等按钮状态
  $rootScope.isInspectReported = false;
  $rootScope.isIdentify = false;
  $rootScope.isSupplement = false;
  $rootScope.isReported = false;
  $rootScope.isInjury = false;

  //定义html状态常量
  $scope.URL_CONSTANT = {
    "case": 'views/pages/policeInfo/policeInfoTab1.html',
    "parties": 'views/pages/policeInfo/policeInfoTab2.html',
    "accident": 'views/pages/policeInfo/policeInfoTab3.html',
    "health": 'views/pages/policeInfo/policeInfoTab4.html',
  };
  var CONTANT = {
    success: 'success',
    error: 'error',
    warn: 'warn',
    sucTxt: '成功',
    errTxt: '错误',
    warnTxt: '警告'
  };

  console.log($scope.co.tabFlag)
  function getIncludeUrl() {
    $scope.includeUrl = $sce.trustAsHtml($scope.URL_CONSTANT[$scope.co.tabFlag]);
  }
  getIncludeUrl();

  $scope.$on('switchTab', function () {
    getIncludeUrl();
  });

  //关联伤者
  $scope.correlationInjured = function (info) {
    //判断是否存在用户名
    if(!info.policePersonInformation.userName) {
      $rootScope.toaster(CONTANT.error, CONTANT.errTxt, '请输入需要关联的用户姓名！');
      return false;
    }
    var correlationInjuredModel = $modal.open({
      templateUrl: 'views/pages/policeInfo/correlationInjuredModel.html',
      controller: 'correlationInjuredModelCtrl',
      backdrop:'static',
      size: 'lg',
      resolve: {
        items: function() {
          return {
            userName: info.policePersonInformation.userName
          }
        }
      }
    });

    correlationInjuredModel.result.then(function(items){
      //获取需要关联的用户数据
      if(items) {
        console.log(items)
        info.policePersonInformation = items.user;
        info.policePersonInformation.id = null;
        info.policePersonInformation.placeOfDomicile = items.user.placeDomicile;
        info.vehiclePolicyInfoList = [];
        info.policePersonInformation.isWounded='0';
        $scope.co.addVehiclePolicyInfo(info, 'vehiclePolicyInfoList');
        //判断是工伤医保还是卫生
        items.user.tableName == 'hospital_person_info'? info.policePersonInformation.healthId = items.user.paId : info.policePersonInformation.indId = items.user.paId;
      }
    })
  };

  //根据原因编号获取原因内容
  $scope.queryAccidentCauseRemark = function (code, list, info, attr) {
    var obj = _.filter(list, function (v) {
      return v.code == code
    })
    if(obj.length) {
      info[attr] = obj[0].name
    } else {
      info[attr] = '';
      $rootScope.toaster(CONTANT.error, CONTANT.errTxt, '未找到相关项！');
    }
  };
  $scope.filterAccidentCauseRemark = function (remark, list, info, attr) {
    info[attr] = _.filter(list, function (v) {
      return v.name == remark
    })[0].code;
  };

  //选择id时，添加内容
  $scope.getValueById = function (id, obj, attr, list, value, isCorrelation) {
    obj[attr] = _.filter(list, function (v) {
      return (v.id == id || v.relationOrgId == id)
    })[0][value];
    if(isCorrelation) { //第四页 工商医保主管部门联动
      if(attr == 'indInjuryDep') { //选的是工伤  为医保加信息
        obj.medInsuranceDepartment = id;
        obj.medInsuranceDep = obj[attr];
      }
      if(attr = 'medInsuranceDep') { //选的是医保  为工伤加信息
        obj.indInjuryDepartment = id;
        obj.indInjuryDep = obj[attr];
      }
    }
  };

  //检测鉴定类型
  $scope.handleAppraisalType = function (info) {
    if(info.appraisalType != '4') {
      info.appraisalTypeRemark = '';
    }
  };

  //选择号牌号码
  $scope.handlePlateNo = function (palteNo1Name) {
    /*var palteNo1Obj = _.filter($scope.palteNoList, function (v) {
      return v.name == palteNo1Name
    })[0];
    $scope.palteNo2List = palteNo1Obj.seedList;*/
  };

  $scope.palteNo2List = function (vehicle) {
    if(vehicle.vehiclePolicyInfo.palteNo1 || (vehicle.vehiclePolicyInfo.palteNo && vehicle.vehiclePolicyInfo.palteNo.substring(0, 1))) {
      var palteNo1Name = vehicle.vehiclePolicyInfo.palteNo1 || (vehicle.vehiclePolicyInfo.palteNo && vehicle.vehiclePolicyInfo.palteNo.substring(0, 1));
      return _.filter($scope.palteNoList, function (v) {
        return v.value == palteNo1Name
      })[0].seedList;
    } else {
      return []
    }
  };

  //删除检验鉴定信息
  $scope.handleDeleteAppraisalInfo = function (index, appraisalInfo) {
    if(confirm('确认删除该项？')) {
      //判断是否含有id
      if(!appraisalInfo.id) {
        $scope.co.deleteAppraisalInfo(index)
      } else {
        //格式化日期
        if(appraisalInfo.entrustTime) appraisalInfo.entrustTime = $filter('date')(appraisalInfo.entrustTime, 'yyyy-MM-dd HH:mm:ss');
        if(appraisalInfo.promiseTime) appraisalInfo.promiseTime = $filter('date')(appraisalInfo.promiseTime, 'yyyy-MM-dd HH:mm:ss');
        if(appraisalInfo.effectiveDate) appraisalInfo.effectiveDate = $filter('date')(appraisalInfo.effectiveDate, 'yyyy-MM-dd HH:mm:ss');
        if(appraisalInfo.entrustFinishTime) appraisalInfo.entrustFinishTime = $filter('date')(appraisalInfo.entrustFinishTime, 'yyyy-MM-dd HH:mm:ss');
        if(appraisalInfo.completeTime) appraisalInfo.completeTime = $filter('date')(appraisalInfo.completeTime, 'yyyy-MM-dd HH:mm:ss');
        //请求后台
        PoliceService.deleteAppraisalInfo(JSON.stringify(appraisalInfo)).success(function (response) {
          if(response.code == PoliceConfig.commonConstant.SUCCESS) {
            $scope.co.deleteAppraisalInfo(index);
            $rootScope.toaster(CONTANT.success, CONTANT.sucTxt, '删除成功！');
          } else {
            $rootScope.toaster(CONTANT.error, CONTANT.errTxt, response.message)
          }
        })
      }
    }
  };

  //删除当事人登记信息
  $scope.deletejpoliceVehicInfo = function (list, index) {
    if(confirm('确认删除该项？')) {
      //判断是否存在id
      if(list[index].policePersonInformation.id) {
        PoliceService.delePerson({id: list[index].policePersonInformation.id}).success(function (response) {
          if(response.code == PoliceConfig.commonConstant.SUCCESS) {
            $scope.co.deletejpoliceVehicInfo(list, index);
            $rootScope.toaster(CONTANT.success, CONTANT.sucTxt, '删除成功！');
          } else {
            $rootScope.toaster(CONTANT.error, CONTANT.errTxt, response.message)
          }
        });
      } else {
        //前端删除
        $scope.co.deletejpoliceVehicInfo(list, index);
      }
    }
  };

  //删除机动车及保单信息
  $scope.deleteVehiclePolicyInfo = function (list, index) {
    if(confirm('确认删除该项？')) {
      //判断是否存在id
      if(list[index].vehiclePolicyInfo.id) {
        //格式化时间
        if(list[index].vehiclePolicyInfo.detainDate) list[index].vehiclePolicyInfo.detainDate = $filter('date')(list[index].vehiclePolicyInfo.detainDate, 'yyyy-MM-dd HH:mm:ss');
        if(list[index].vehiclePolicyInfo.returnDate) list[index].vehiclePolicyInfo.returnDate = $filter('date')(list[index].vehiclePolicyInfo.returnDate, 'yyyy-MM-dd HH:mm:ss');
        //调用后台接口
        PoliceService.deleVehiclePolicyInfo(JSON.stringify(list[index])).success(function (response) {
          if(response.code == PoliceConfig.commonConstant.SUCCESS) {
            $scope.co.deleteVehiclePolicyInfo(list, index); //前端删除
            $rootScope.toaster(CONTANT.success, CONTANT.sucTxt, '删除成功！');
          } else {
            $rootScope.toaster(CONTANT.error, CONTANT.errTxt, response.message)
          }
        })
      } else {
        //前端删除
        $scope.co.deleteVehiclePolicyInfo(list, index);
      }
    }
  };

  //事故时间
  $scope.openAccidentTime = function($event, target) {
    $event.preventDefault();
    $event.stopPropagation();
    target.accidentTimeIsOpen = true;
  };
  //现场勘查日期
  $scope.openSurveyDate = function($event, target) {
    $event.preventDefault();
    $event.stopPropagation();
    target.surveyDateIsOpen = true;
  };
  //委托日期
  $scope.police.entrustTimeIsOpen = false;
  $scope.openEntrustTime = function($event, target) {
    $event.preventDefault();
    $event.stopPropagation();
    target.entrustTimeIsOpen = true;
  };
  //预约完成日期
  $scope.openPromiseTime = function($event, target) {
    $event.preventDefault();
    $event.stopPropagation();
    target.promiseTimeIsOpen = true;
  };
  //委托完成时限
  $scope.openEntrustFinishTime = function($event, target) {
    $event.preventDefault();
    $event.stopPropagation();
    target.entrustFinishTimeIsOpen = true;
  };
  //实际完成日期
  $scope.openCompleteTime = function($event, target) {
    $event.preventDefault();
    $event.stopPropagation();
    target.completeTimeIsOpen = true;
  };
  //扣留/扣押时间
  $scope.openDetainTime = function($event, target) {
    $event.preventDefault();
    $event.stopPropagation();
    target.detainTimeIsOpen = true;
  };
  //返还时间
  $scope.openReturnTime = function($event, target) {
    $event.preventDefault();
    $event.stopPropagation();
    target.returnTimeIsOpen = true;
  };
  //扣留时间
  $scope.openDetainDate = function($event, target) {
    $event.preventDefault();
    $event.stopPropagation();
    target.detainDateIsOpen = true;
  };
  //返还时间
  $scope.openReturnDate = function($event, target) {
    $event.preventDefault();
    $event.stopPropagation();
    target.returnDateIsOpen = true;
  };
  //入院时间
  $scope.openBeHospitTime = function($event, target) {
    $event.preventDefault();
    $event.stopPropagation();
    target.beHospitTimeIsOpen = true;
  };
  //出院时间
  $scope.openOutHospitTime = function($event, target) {
    $event.preventDefault();
    $event.stopPropagation();
    target.outHospitTimeIsOpen = true;
  };
  //工伤反馈时间
  $scope.openIndRegisterTime = function($event, target) {
    $event.preventDefault();
    $event.stopPropagation();
    target.indRegisterTimeIsOpen = true;
  };
  //医保反馈时间
  $scope.openMedRegisterTime = function($event, target) {
    $event.preventDefault();
    $event.stopPropagation();
    target.medRegisterTimeIsOpen = true;
  };
  //生效日期
  $scope.openEffectiveDate = function($event, target) {
    $event.preventDefault();
    $event.stopPropagation();
    target.effectiveDateIsOpen = true;
  };


  /////////////////////////上传文件/////////////////////////////////
  //ie9一下检查flash版本
  function hasflash() {
    if(navigator.appName == "Microsoft Internet Explorer"&&parseInt(navigator.appVersion.split(";")[1].replace(/[ ]/g, "").replace("MSIE",""))<10){
      if (!FileAPI.hasFlash) {
        $scope.haveNoFlash = true;
        $rootScope.toaster("warn", '提示',"请先安装或者升级flash！");
      }
    }
  }
  hasflash();
  $scope.checkflash = function () {
    if($scope.haveNoFlash ){
      $rootScope.toaster("warn", '提示',"请先安装或者升级flash！");
    }
  }
  //限制图片大小
  function imageSize(file) {
    if(file){
      if(parseInt(file.size/(1024*1024))>= 10 ){
        $rootScope.toaster(level.warn, "提示","请上传小于10M大小的图片");
      }
    }
  }

  //添加文件
  $scope.addEvidence = function(files, obj, type) {
    if(!files) return;
    if(type) files = [files];
    if (files.length) {
      for (var i = 0; i < files.length; i++) {
        imageSize(files[i]);
        var fileName = files[i].name.substring(0,files[i].name.lastIndexOf('.'));
        type? $scope.uploadPicture(fileName,files[i],files.length,obj,type) : $scope.uploadPicture(fileName,files[i],files.length,obj,'');
      }
    }
  };
  //遮罩层 - 图片上传期间出现
  $scope.fileUploading = false;
  //上传图片
  $scope.uploadPicture = function(fileName,file,length,obj,type){
    if(!file){
      $rootScope.toaster(level.warn, title.warn, $scope.CONSTANT.messagePictrueTypeError);
      return;
    }
    //var type = file.name.split('.')[1];
    //if(type == 'jpg'|| type == 'png'){
    if(!type) {
      var evidence = new $scope.co.Evidence("");
      if(!obj.enclosureInfoList||obj.enclosureInfoList.length==0){
          obj.enclosureInfoList = [];
      }
      obj.enclosureInfoList.unshift(evidence);
    }
    //}
    $scope.fileUploading = true;
    Upload.upload({
      url: AdjustConfig.pictureConstant.policeUploadImgUrl,
      data: {
        file: file,
        type: type? '0':'1'
      }
    }).progress(function (evt) {
      //进度条
      if(!type) evidence.progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
    }).success(function(resp) {
      console.log(resp);
      switch (type) {
        case 'face': obj.identityCardApic = resp.result.path; break;
        case 'back': obj.identityCardBpic = resp.result.path; break;
      }
      if (type == 'face') { //身份证正面照，解析
        $http({
          method: 'post',
          url: '/lawProject/common/cardDisc',
          data: {
            "path": resp.result.path,
            "type": "applicant"
          }
        }).success(function(res) {
          if (res.code == AdjustConfig.commonConStant.SUCCESS && res.result) {
            obj.userName = res.result.name;
            obj.personCard = res.result.code;
            obj.age = $scope.GetAge(res.result.code);
            obj.sex = res.result.sex == '男' ? 1 : 0;
            obj.placeOfDomicile = res.result.addr;
          } else if (res.code == AdjustConfig.commonConStant.FAILURE) {
            $rootScope.toaster(CONTANT.error, CONTANT.errTxt, "身份证识别失败!");
          }
        })
      }
      $scope.fileUploading = false;
      if(!type) {
        evidence.id = resp.result.id;
        evidence.oldname = resp.result.oldname;
        evidence.path = resp.result.path;
        evidence.fileType = resp.result.fileType;
        evidence.isChecked = false; //设置默认不选中样式
      }
    }).error(function (data, status, headers, config) {
      console.log('error status: ' + data);
      $scope.fileUploading = false;
    });
  };

  //文件选择
  $scope.handleEnclosure = function (enclosureInfo, list, obj) {
    enclosureInfo.isChecked = !enclosureInfo.isChecked;
    //获取已选择的个数
    obj.enclosureArr = _.filter(list, function(v) {
      return v.isChecked
    });
    //当全部选中时，勾选全选框
    if(obj.enclosureArr.length == list.length) {
      obj.isAllChecked = true;
    } else {
      obj.isAllChecked = false;
    }
  };

  //全选
  $scope.handleAllChecked = function (event, list, obj) {
    if($(event.target).prop('checked')){
      //全选
      _.each(list, function (v) {
        v.isChecked = true;
      })
    } else {
      //全不选
      _.each(list, function (v) {
        v.isChecked = false;
      })
    }
    //获取已选择的个数
    obj.enclosureArr = _.filter(list, function(v) {
      return v.isChecked
    })
  };

  //删除文件
  $scope.deleteEnclosure = function (obj) {
    if(confirm('确认删除所选文件？')) {
      var newEnclosureInfoList = angular.copy(obj.enclosureInfoList);
      //从前端删除所选文件
      function deleteFromThisLocality() {
        obj.enclosureInfoList.length = 0;
        _.each(newEnclosureInfoList, function (v) {
          if(!v.isChecked) obj.enclosureInfoList.push(v);
        });
        $rootScope.toaster(CONTANT.success, CONTANT.sucTxt, '删除成功！')
      }

      var idArr = [];
      _.each(newEnclosureInfoList, function (v) {
        if(v.id && v.isChecked) idArr.push(v.id);
      });
      //请求后台，删除文件
      PoliceService.deleteBatchFile({ids: idArr}).success(function (response) {
        if(response.code == PoliceConfig.commonConstant.SUCCESS) {
          console.log(response);
          deleteFromThisLocality();
        } else {
          $rootScope.toaster(CONTANT.error, CONTANT.errTxt, response.message)
        }
      })
    }
  };

  //删除证件照
  $scope.removeApplicantImage = function (person, type, attr) {
    if(window.confirm('确认删除该证件照？')) {
      var path = person[attr];
      PoliceService.deleCard({id: person.id, path: path, type: type}).success(function (response) {
        if(response.code == PoliceConfig.commonConstant.SUCCESS) {
          person[attr] = '';
          $rootScope.toaster(CONTANT.success, CONTANT.sucTxt, '删除成功！');
        } else {
          $rootScope.toaster(CONTANT.error, CONTANT.errTxt, response.message);
        }
      });
    }
  };

  /////////////////////////tab1////////////////////////////////////
  $scope.handleSendEntrust = function (appraisalInfo, state) {
    //判断当前案件是否存在id（是否保存过）
    if(!appraisalInfo.id) {
      $rootScope.toaster(CONTANT.error, CONTANT.errTxt, '请先保存检验鉴定信息！');
      return;
    }
    //当是生效按钮时，判断是否选择了生效日期
    if(state == '3') {
      if(!appraisalInfo.isEffective) {
        appraisalInfo.isEffectiveError = true;
        $rootScope.toaster(CONTANT.error, CONTANT.errTxt, '请选择是否生效！');
        return false;
      } else appraisalInfo.isEffectiveError = undefined;
      if(appraisalInfo.isEffective == '0' && !appraisalInfo.effectiveDate) {
        appraisalInfo.effectiveDateError = true;
        $rootScope.toaster(CONTANT.error, CONTANT.errTxt, '请选择生效日期！');
        return false;
      } else appraisalInfo.effectiveDateError = undefined;
      //格式化时间参数
      if(appraisalInfo.effectiveDate) appraisalInfo.effectiveDate = $filter('date')(appraisalInfo.effectiveDate, 'yyyy-MM-dd HH:mm:ss');
    }
    appraisalInfo.appraisalState = state;
    //格式化时间参数
    if(appraisalInfo.entrustTime) appraisalInfo.entrustTime = $filter('date')(appraisalInfo.entrustTime, 'yyyy-MM-dd HH:mm:ss');
    if(appraisalInfo.promiseTime) appraisalInfo.promiseTime = $filter('date')(appraisalInfo.promiseTime, 'yyyy-MM-dd HH:mm:ss');
    if(appraisalInfo.completeTime) appraisalInfo.completeTime = $filter('date')(appraisalInfo.completeTime, 'yyyy-MM-dd HH:mm:ss');
    if(appraisalInfo.entrustFinishTime) appraisalInfo.entrustFinishTime = $filter('date')(appraisalInfo.entrustFinishTime, 'yyyy-MM-dd HH:mm:ss');
    PoliceService.updateAppraisalInfo(JSON.stringify(appraisalInfo)).success(function (response) {
      if(response.code == PoliceConfig.commonConstant.SUCCESS) {
        if(appraisalInfo.appraisalState == '3') {
          $rootScope.toaster(CONTANT.success, CONTANT.sucTxt, '完成委托成功！');
        } else {
          $rootScope.toaster(CONTANT.success, CONTANT.sucTxt, '发送成功！');
        }
        //格式化时间参数
        if(appraisalInfo.entrustTime) appraisalInfo.entrustTime = $scope.co.parseISO8601(appraisalInfo.entrustTime);
        if(appraisalInfo.promiseTime) appraisalInfo.promiseTime = $scope.co.parseISO8601(appraisalInfo.promiseTime);
        if(appraisalInfo.completeTime) appraisalInfo.completeTime = $scope.co.parseISO8601(appraisalInfo.completeTime);
        if(appraisalInfo.entrustFinishTime) appraisalInfo.entrustFinishTime = $scope.co.parseISO8601(appraisalInfo.entrustFinishTime);
        if(appraisalInfo.effectiveDate) appraisalInfo.effectiveDate = $scope.co.parseISO8601(appraisalInfo.effectiveDate);
      } else {
        $rootScope.toaster(CONTANT.error, CONTANT.errTxt, response.message);
      }
    });
  };


  /////////////////////////tab3////////////////////////////////////
  //天气列表
  $scope.weatherList = DictionaryConfig.weatherList;
  //////////webSocket/////////////
  $scope.creatWebSocket = function () {
    //检测浏览器是否支持websocket
    var websocketUrl = "ws://210.73.66.152/lawDataExchangeProject/websocket?";
    //var websocketUrl = "ws://192.168.130.26:8088/lawDataExchange/websocket/?";
    //  var websocketUrl = "ws://localhost:8088/lawDataExchangeProject/websocket?";
    if('WebSocket' in window) {
      console.log("此浏览器支持webSocket");
      var host = $location.host();
      var date =  Date.parse(new Date()) ;
      var urlParam = "serialNo="+$scope.queryPoliceCase.serialNo+"&key="+date;
      $scope.webSocket = new WebSocket(websocketUrl+urlParam);
    } else if('MozWebSocket' in window) {
      console.log("此浏览器只支持MozWebSocket")
    } else {
      console.log("此浏览器只支持SockJS");
    }

    //当websocket打开时
    $scope.webSocket.onopen = function (event) {
      console.log("链接服务器成功!");
      var param = angular.copy($scope.queryPoliceCase);
      //重新请求后台
      param.jkid = "ACDR1";
      $scope.sendMessage(param);
    };

    //发送信息
    $scope.sendMessage = function(data) {
      if($scope.webSocket != null) {
        console.log('发送消息：' + JSON.stringify(data))
        $scope.webSocket.send(JSON.stringify(data));
      } else {
        console.log('未与服务器链接.');
        toaster.pop('error', '错误', $scope.CONSTANT.messageSendError);
      }
    };

    //当webSocket发送数据时
    $scope.webSocket.onmessage = function(event) {
      //关闭等待文字
      $scope.loading = false;
      //将数据保存到本地
      //$scope.savePoliceAccident();
      $scope.resData = JSON.parse(event.data)
      if($scope.resData.body && $scope.resData.body.acdfile){
        //填充数据到页面
        $scope.policeAccidentInfo = $scope.resData.body;
        console.log($scope.resData)
        $scope.loading = false;

        //存入事故信息
        //$scope.police.accidentInfo.accidentMessageInfo = JSON.stringify($scope.resData);
        $scope.saveAccidentInfo();

        $rootScope.toaster('success', '成功', $scope.resData.head.message);
      }else if($scope.resData.body &&  $scope.resData.body.acdphotos){
        $scope.acdphotos = $scope.resData.body.acdphotos;
      }else{
        $rootScope.toaster('error', '错误', $scope.resData.head.message);
      }
      $scope.$apply();
    };
  };

  //保存事故信息
  $scope.saveAccidentInfo = function () {
    console.log($scope.police.accidentInfo)
    $scope.police.accidentInfo.identiNumber = $scope.police.accidentInfo.accidentNumber;
    $scope.police.accidentInfo.surveyDate = $filter('date')($scope.police.accidentInfo.surveyDate, 'yyyy-MM-dd HH:mm:ss');  //格式化开始日期
    $scope.police.accidentInfo.surveyDateThree  = $filter('date')($scope.police.accidentInfo.surveyDateThree, 'yyyy-MM-dd HH:mm:ss');   //格式化结束日期
    PoliceService.updateExtAcctime($scope.police.accidentInfo).success(function (res) {
      console.log(res)
    })
  };

  var QueryPoliceCase = function () {
    if(!$scope.police.accidentInfo){
        $rootScope.toaster(CONTANT.error, CONTANT.errTxt, '请填写事故信息！');
        return false;
    }
    if(!$scope.police.accidentInfo.id){
        $rootScope.toaster(CONTANT.error, CONTANT.errTxt, '请先保存事故信息！');
        return false;
    }
    if(!$scope.police.accidentInfo.accidentNumber){
        $rootScope.toaster(CONTANT.error, CONTANT.errTxt, '请填写事故认定书编号！');
        return false;
    }
    if(!$scope.police.jpoliceVehicVO[0]||!$scope.police.jpoliceVehicVO[0].policePersonInformation||!$scope.police.jpoliceVehicVO[0].policePersonInformation.personCard){
        $rootScope.toaster(CONTANT.error, CONTANT.errTxt, '请填加伤者信息！');
        return false;
    }
    if(!$scope.police.accidentInfo.cityCode){
        $scope.police.accidentInfo.cityCode = '0';
    }
    this.accidentNumber = $scope.police.accidentInfo.accidentNumber;//'第6401046201708532';
    this.caseType = '1';
    this.highSpeed = $scope.police.accidentInfo.highSpeed;
    this.idNo = $scope.police.jpoliceVehicVO[0].policePersonInformation.personCard;//'512922197408252094';
    this.serialNo = '110101201800912';
    this.cityCode = $scope.police.accidentInfo.cityCode;
  };

  //当police对象存在json时，表示之前查询过，直接显示数据
  $scope.$on('switchTab', function () {
    if($scope.co.tabFlag == 'accident') {
      $scope.queryPoliceJson();
    }
  });
  $scope.queryPoliceJson = function () {
    if($scope.police.json) {
      var response = JSON.parse($scope.police.json);
      console.log(response)
      $scope.adjust = response.result;
      $scope.policeAccidentInfo = response.result.policeAccidentInfo;
      $scope.acdphotos =  response.result.acdphotos;
    }
  }

  //查询案件
  $scope.handlePoliceCase = function () {
    $scope.queryPoliceCase = new QueryPoliceCase();
    if(!$scope.police.accidentInfo.accidentNumber) {
      $scope.police.accidentInfo.accidentNumberError = true;
      $rootScope.toaster(CONTANT.error, CONTANT.errTxt, '请输入事故认定书编号！');
      return false;
    } else $scope.police.accidentInfo.accidentNumberError = false;
    //格式化证书编号中的字符[]【】，()（）
    $scope.queryPoliceCase.accidentNumber = $scope.queryPoliceCase.accidentNumber.split('');
    if($scope.queryPoliceCase.accidentNumber.indexOf('【') != -1) {
      $scope.queryPoliceCase.accidentNumber.splice($scope.queryPoliceCase.accidentNumber.indexOf('【'), 1, '[');
    }
    if($scope.queryPoliceCase.accidentNumber.indexOf('】') != -1) {
      $scope.queryPoliceCase.accidentNumber.splice($scope.queryPoliceCase.accidentNumber.indexOf('】'), 1, ']');
    }
    $scope.queryPoliceCase.accidentNumber = $scope.queryPoliceCase.accidentNumber.join('');
    //调取当事人登记信息中的身份证号与输入的案件号查询六合一平台
    //显示正在查询文字
    $scope.loading = true;
    $scope.caseErr = false;
    $scope.queryPoliceCase.highSpeed = '1';

    //建立webSocket连接
    $scope.creatWebSocket();
  };

  $scope.popupModal1 = function (vehicle) { //机动车
    var popupModal = $modal.open({//打开弹窗页
      templateUrl:'views/pages/police/policeCar.html',
      controller:'policeCarCtrl',
      size:'lg',
      resolve:{
        items:function(){
          return {
            vehicle:vehicle
          }
        }
      }
    });
    //弹出框的返回值
    popupModal.result.then(function(data){

    })
  };
  $scope.popupModal2 = function (drivinglicense) { //驾驶证
    var popupModal = $modal.open({//打开弹窗页
      templateUrl:'views/pages/police/policeLicenseInfo.html',
      controller:'policeCarCtrl',
      size:'lg',
      resolve:{
        items:function(){
          return {
            drivinglicense:drivinglicense
          }
        }
      }
    });
    //弹出框的返回值
    popupModal.result.then(function(data){

    })
  };
  $scope.popupModal3 = function (asks) { //询话
    //if(asks) {
    var popupModal = $modal.open({//打开弹窗页
      templateUrl:'views/pages/police/policeInquiry.html',
      controller:'policeCarCtrl',
      size:'lg',
      resolve:{
        items:function(){
          return {
            asks:asks
          }
        }
      }
    });
    //弹出框的返回值
    popupModal.result.then(function(data){

    })
  };
  $scope.popupModal4 = function (testtimes) { //检验
    var popupModal = $modal.open({//打开弹窗页
      templateUrl:'views/pages/police/policeTestResult.html',
      controller:'policeCarCtrl',
      size:'lg',
      resolve:{
        items:function(){
          return {
            testtimes:testtimes
          }
        }
      }
    });
    //弹出框的返回值
    popupModal.result.then(function(data){

    })
  };

  /////////////////////////tab4////////////////////////////////////
  $scope.$on('switchTab', function () {
    if($scope.co.tabFlag == 'health') {
      //判断当前是否存在卫生/工伤信息
      _.each($scope.police.jpoliceVehicVO, function (v) {
        if(!v.indMedInfo) {
          //添加工伤对象
          $scope.co.addIndMedInfo(v);
        }
        if(!v.healthDepartmentInfo) {
          //添加卫生对象
          $scope.co.addHealthDepartmentInfo(v);
        }
      })
    }
  });

  //主管部门选择
  $scope.handleDepartment = function (orgCode, obj, attr) {
    obj[attr] = orgCode
  };
  // 发送医院
  $scope.sendHealth = function(obj){
      if(!obj.healthDepartmentInfo.id) {
          $rootScope.toaster(CONTANT.error, CONTANT.errTxt, '请先保存就医信息！');
          return;
      }
      PoliceService.updateSendHealth({id:obj.healthDepartmentInfo.id,type:'sendDate',sendType:'1'}).success(function (response) {
          if(response.code == PoliceConfig.commonConstant.SUCCESS) {
              var heal = response.result;
              obj.healthDepartmentInfo.sendDate = heal.sendDate;
              obj.healthDepartmentInfo.sendType = '1';
              $rootScope.toaster(CONTANT.success, CONTANT.sucTxt, "发送补充成功！");
          } else {
              $rootScope.toaster(CONTANT.error, CONTANT.errTxt, response.message);
          }
      });
  };
// 发送医保补充
  $scope.sendIndMed = function(obj){
      if(!obj.indMedInfo.id) {
          $rootScope.toaster(CONTANT.error, CONTANT.errTxt, '请先保存医保信息！');
          return;
      }
      obj.indMedInfo.sendType = '1';
      PoliceService.updateSendIndMed(JSON.stringify(obj.indMedInfo)).success(function (response) {
          if(response.code == PoliceConfig.commonConstant.SUCCESS) {
              var heal = response.result;
              obj.indMedInfo.sendDate = $scope.co.parseISO8601(heal.sendDate);
              $rootScope.toaster(CONTANT.success, CONTANT.sucTxt, "发送补充成功！");
          } else {
              obj.indMedInfo.sendType = '0';
              $rootScope.toaster(CONTANT.error, CONTANT.errTxt, response.message);
          }
      });
  };

  /////////////////////////保险公司事件//////////////////////////////
  //选择系统保险公司
  $scope.insuranceFocus = function(type) {
    if (!$scope.insuranceShow1 && type == 'insuranceForceCompany') $scope.insuranceShow1 = true;
    if (!$scope.insuranceShow2 && type == 'insuranceBusinessCompany') $scope.insuranceShow2 = true;
    if (!$scope.insuranceShow3 && type == 'insuranceVehicleCompany') $scope.insuranceShow3 = true;
  };
  $scope.blurInsurance = function(type){
    if($scope.insuranceShow1 && type == 'insuranceForceCompany'){
      $timeout(function(){
        $scope.insuranceShow1 = false;
      }, 200);
    }
    if($scope.insuranceShow2 && type == 'insuranceBusinessCompany'){
      $timeout(function(){
        $scope.insuranceShow2 = false;
      }, 200);
    }
    if($scope.insuranceShow3 && type == 'insuranceVehicleCompany'){
      $timeout(function(){
        $scope.insuranceShow3 = false;
      }, 200);
    }
  };
  //保险公司单击事件
  $scope.selectItems = function(info, company, attr, riskTypes) {
    _.filter(info[attr], function (v) {
      return v.riskTypes == riskTypes
    })[0].insuranceCompany = company.text;
    $scope.insuranceShow1 = false;
    $scope.insuranceShow2 = false;
    $scope.insuranceShow3 = false;
  };
  //将数据发送给保险公司
  $scope.sendToCompany = function (info, attr) {
    //if(!info[attr]) {
     // $rootScope.toaster('error', '错误', '请先选择保险公司');
     // return false;
    //}
    //判断是否存在id
    if(!info.id) {
      $rootScope.toaster('error', '错误', '请先保存数据');
      return false;
    }
  //  if(!info.insuranceCompany&&info.insuranceCompany.length<3){
  //      $rootScope.toaster('error', '错误', '请选择投保公司');
  //      return false;
  //  }
    //调用接口
    PoliceService.updateVehicleCompany(JSON.stringify({id: info.id,insuranceCompany:info.insuranceCompany,sendState:'2'})).success(function (response) {
      if(response.code == PoliceConfig.commonConstant.SUCCESS) {
        info.sendState = '2';
        $rootScope.toaster(CONTANT.success, CONTANT.sucTxt, '发送成功！');
      } else {
        $rootScope.toaster(CONTANT.error, CONTANT.errTxt, response.message)
      }
    });
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
      if ($scope.police.cityName != selectedRegion.fullName) {
        $scope.police.accidentInfo.accidentPlace = selectedRegion.fullName;
        $scope.police.accidentInfo.cityCode = selectedRegion.regionCode;
        angular.element("#cityNamebox").hide();
        $scope.isShowTree = false;
      }
    }
  };

  $scope.initData = function(){
      if(LoginService.user.userPermissions) {
          $scope.co.userDepar = LoginService.user.sysUser.userDepartList[LoginService.user.sysUser.currentOrg];
          $scope.police.accidentInfo.accidentPlace = eval('['+$scope.co.userDepar.extPro+']')[0].regionName;
      }
      //请求后台，获取数据列表
      console.log($scope.co.userDepar);
  };
  //初始化
  $scope.initPage = function () {
      $scope.$on('user2Child', function () {
          $scope.initData();
      });
  };

  $scope.initPage();

  /////////////////////////////////初始化/////////////////////////////////////

});

app.controller('correlationInjuredModelCtrl', function($scope, DictionaryConfig, $state, items, $modalInstance,PoliceService,PoliceConfig) {
  //通过姓名，请求未关联的用户列表
  $scope.queryRelPerList = function () {
    PoliceService.queryRelPerList({userName: items.userName}).success(function (response) {
      if(response.code == PoliceConfig.commonConstant.SUCCESS) {
        $scope.relPerList = response.result;
      } else {
        $rootScope.toaster(CONTANT.error, CONTANT.errTxt, response.message);
      }
    })
  };
  $scope.queryRelPerList();

  //查看用户信息
  $scope.handleUserInfo = function (info) {
    var url = '';
    //判断登记类型
    if(info.registerType == '卫生部门') {
      //卫生部信息
      url = $state.href('healthInfoFill', {userId: info.id, tableName: info.tableName});
    } else {
      //工伤部信息
      url = $state.href('injuryInfoFill', {userId: info.id, tableName: info.tableName});
    }
    window.open(url);
  };

  //关联用户
  $scope.correlation = function (info) {
    $modalInstance.close({user:info});
  };

  //关闭模态框
  $scope.closeModal = function () {
    $modalInstance.close();
  };
});

angular.module('sbAdminApp').controller('policeCarCtrl', function($scope, $stateParams, $state,$modalInstance,items,DictionaryConfig,AdjustConfig) {
  $scope.vehicle = items.vehicle;
  $scope.drivinglicense = items.drivinglicense;
  $scope.asks = items.asks;
  $scope.testtimes = items.testtimes;
  //号牌种类
  $scope.plateTypeList = DictionaryConfig.plateTypeList;
  //身份证明名称
  $scope.cardName = DictionaryConfig.cardName;
  //使用性质
  $scope.useNature = DictionaryConfig.useNature;
  //状态
  $scope.useNature = DictionaryConfig.useNature;
  //准驾类型
  $scope.drivingType = DictionaryConfig.drivingType;
  //驾驶证期限
  $scope.licenseDeadline = DictionaryConfig.licenseDeadline;
  //驾驶证状态
  $scope.licenseStatus = DictionaryConfig.licenseStatus;
  //检验类型
  $scope.inspectionType = DictionaryConfig.inspectionType;
  //机动车状态
  $scope.vehicleStatus = DictionaryConfig.vehicleStatus;
  //车辆类型
  $scope.carList = DictionaryConfig.carList;
  //取消
  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
});