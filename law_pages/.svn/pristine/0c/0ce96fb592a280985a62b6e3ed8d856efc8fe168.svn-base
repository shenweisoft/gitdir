angular.module('sbAdminApp').controller('acquireMessageCtrl', function ($scope, DictionaryConfig, $modalInstance, items, $rootScope, $location, AdjustService, AdjustConfig) {
  //保存公安信息
  $scope.savePoliceAccidentinfo = AdjustService.savePoliceAccidentinfo;
  //民族
  $scope.famousList = DictionaryConfig.famousList;

  //创建存储搜索项与插入的人员信息数据
  if(items.adjust.acquireMessageInfo) {
    $scope.acquireMessageInfo = JSON.parse(items.adjust.acquireMessageInfo);
  } else {
    $scope.acquireMessageInfo = {
      chooseArray: [{ //存储已填充的人员数据
        accidentNumber: '', //事故认定编号
        idNo: '', //当事人身份证号
        checkedUserType: '' //填充的人员类型 0：申请 1：被申请
      }],
      queryInfo: { //存储当前搜索的数据
        accidentNumber: '', //事故认定编号
        idNo: '' //当事人身份证号
      },
      dataInfo: [], //保存搜索到的数据
      factReason: '', //保存事件的事实与理由
      accidentNumber: '' //保存事故认定编号
    };
  }

  //创建当前页面数据对象
  $scope.applicantInfo = {
    caseType: '1', //查询条件 1：调解  2：诉讼
    accidentNumber: $scope.acquireMessageInfo.queryInfo.accidentNumber,
    highSpeed: '1',
    idNo: $scope.acquireMessageInfo.queryInfo.idNo,
    //serialNo: items.adjust.serialNo || undefined,
    serialNo: undefined,
    cityCode: '130100',
    cityName: '河北省-石家庄市'
  };
  $scope.policeInfoList = $scope.acquireMessageInfo.dataInfo? $scope.acquireMessageInfo.dataInfo : []; //存储搜索到的人员信息

  $scope.applicantInfoTypeList = [{
    id: '0',
    value: '申请人'
  },{
    id: '1',
    value: '被申请人'
  }];

  //检测数据
  function validData() {
    if(!$scope.applicantInfo.accidentNumber) {
      $scope.applicantInfo.accidentNumberError = true;
      $rootScope.toaster("error", "错误","请您输入事故认定编号！");
      return false;
    } else $scope.applicantInfo.accidentNumberError = undefined;
    if(!$scope.applicantInfo.idNo) {
      $scope.applicantInfo.idNoError = true;
      $rootScope.toaster("error", "错误","请您输入当事人身份证号！");
      return false;
    } else $scope.applicantInfo.idNoError = undefined;
    return true
  }

  $scope.handleApplicantInfo = function () {
    //检测数据
    if(!validData()) {
      return;
    }
    //显示等待文字
    $scope.isLoading = true;
    //建立webSocket连接
    $scope.creatWebSocket();
  };


  ///////////////////////////webSocket///////////////////////////
  $scope.creatWebSocket = function () {
    //检测浏览器是否支持websocket
    var websocketUrl = "ws://210.73.66.152/lawDataExchangeProject/websocket?";
    //  var websocketUrl = "ws://localhost:8088/lawDataExchangeProject/websocket?";
    if('WebSocket' in window) {
      console.log("此浏览器支持webSocket");
      var host = $location.host();
      var date =  Date.parse(new Date()) ;
      var urlParam = "serialNo="+$scope.applicantInfo.serialNo+"&key="+date;
      $scope.webSocket = new WebSocket(websocketUrl+urlParam);
    } else if('MozWebSocket' in window) {
      console.log("此浏览器只支持MozWebSocket")
    } else {
      console.log("此浏览器只支持SockJS");
    }

    //当websocket打开时
    $scope.webSocket.onopen = function (event) {
      console.log("链接服务器成功!");
      //查看是否存在搜索结果
      /*if($scope.policeInfoList.length != 0) {
        $scope.isLoading = false;
        $scope.$apply();
        return;
      }*/

      var param = angular.copy($scope.applicantInfo);
      //与之前搜索的数据做对比（修改了认定书号码时，重新搜索。只修改身份证号时，搜索当前人员是否有符合项）
      //获取上一次搜索的数据
      oldSearchVO = $scope.acquireMessageInfo.queryInfo;
      if(oldSearchVO.accidentNumber == $scope.applicantInfo.accidentNumber && oldSearchVO.idNo == $scope.applicantInfo.idNo) {
        //当没做任何修改时
        $rootScope.toaster('success', '成功', "查询成功！");
        $scope.isLoading = false;
        $scope.$apply();
        return;
      } else if(oldSearchVO.accidentNumber == $scope.applicantInfo.accidentNumber) { //当只修改了身份证时
        //在当前人员中搜索与身份证对应的人员
        var filterArray = $scope.policeInfoList.filter(function (v) {
          return v.sfzmhm == $scope.applicantInfo.idNo
        });
        //关闭等待文字
        $scope.isLoading = false;
        if(filterArray.length > 0) {
          $scope.policeInfoList = filterArray;
          $rootScope.toaster('success', '成功', "查询成功！");
        } else {
          $rootScope.toaster('error', '错误', "未查询到相关结果！");
        }
        $scope.$apply();
      } else {
        //重新请求后台
        param.jkid = "ACDR1";
        $scope.sendMessage(param);
      }
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
      $scope.isLoading = false;
      //将数据保存到本地
      //$scope.savePoliceAccident();
      $scope.resData = JSON.parse(event.data)
      if($scope.resData.body && $scope.resData.body.acdfile){
        //填充数据到页面
        $scope.policeInfoList = $scope.resData.body.humans;

        //为之前选择过的用户添加isChecked属性
        $scope.fillUserType();

        //将当前的搜索条件与数据保存到对象
        $scope.acquireMessageInfo.queryInfo.accidentNumber = $scope.applicantInfo.accidentNumber;
        $scope.acquireMessageInfo.queryInfo.idNo = $scope.applicantInfo.idNo;
        $scope.acquireMessageInfo.dataInfo = $scope.resData.body.humans;

        //存入事实与理由
        if($scope.resData.body.duty){
          $scope.acquireMessageInfo.factReason = $scope.resData.body.duty.jbss;
        }else if($scope.resData.proof){
          $scope.acquireMessageInfo.factReason = $scope.resData.body.proof.jbss;
        }else if($scope.resData.simpleduty){
          $scope.acquireMessageInfo.factReason = $scope.resData.body.simpleduty.sgss;
        }
        //存入事故认定编号
        $scope.acquireMessageInfo.accidentNumber = $scope.applicantInfo.accidentNumber;

        //将acquireMessageInfo保存至主表
        $scope.saveAcquireMessageInfo();

        $rootScope.toaster('success', '成功', $scope.resData.head.message);
      }else if($scope.resData.body &&  $scope.resData.body.acdphotos){
        $scope.acdphotos = $scope.resData.body.acdphotos;
      }else{
        $rootScope.toaster('error', '错误', $scope.resData.head.message);
      }
      $scope.$apply();
    };
  };

  //将线上数据保存到本地后台
  //$scope.savePoliceAccident = function () {
    //$scope.savePoliceAccidentinfo($scope.applicantInfo).success(function (res) {
      // if (res.code == AdjustConfig.commonConStant.SUCCESS) {
      // }else{
      //   $rootScope.toaster('error','错误',res.message)
      // }
    //})
  //}

  //确认填充数据到案件中
  $scope.fillData = function () {
    //找出被选择的人
    var chooseArr = $scope.policeInfoList.filter(function (v) {
      return v.userType == '0' || v.userType == '1';
    })
    if(chooseArr.length == 0) {
      $rootScope.toaster('error', '错误', "请选择要填充的人员！");
      return;
    }

    //与当前案件的申请人、被申请人对比，进行验证规则
    $scope.filterUserToApplicantArray = function (arr, v) {
      if(arr.length == 0) {
        //新增一条
        $scope.addUserToApplicantArray(v);
      } else {
        //检索当前案件已有的且非交警数据填入的申请人
        for(var i = 0; i < arr.length; i++) {
          var x = arr[i];
          if(!x.personName && !x.idNo) { //姓名与身份证都不存在
            if(!x.telephone && !x.domicile && !x.sendAddress) { //覆盖本条
              $scope.addUserToApplicantArray(v, x.telephone, x.domicile, x.sendAddress, arr[i]);
            } else { //新增一条
              $scope.addUserToApplicantArray(v);
            }
          } else if(x.personName && x.idNo){ //姓名与身份证都存在
            if(x.idNo == v.sfzmhm) { //存在匹配项
              $scope.addUserToApplicantArray(v, x.telephone, x.domicile, x.sendAddress, arr[i]);
            } else {
              $scope.addUserToApplicantArray(v, x.telephone, x.domicile, x.sendAddress);
            }
          } else { //姓名或身份证存在其一
            if(x.personName == v.xm || x.idNo == v.sfzmhm) { //存在匹配项
              $scope.addUserToApplicantArray(v, x.telephone, x.domicile, x.sendAddress, arr[i]);
            } else {
              $scope.addUserToApplicantArray(v, x.telephone, x.domicile, x.sendAddress);
            }
          }
          break;
        }
      }
    };

    //往主表中添加人员方法
    $scope.addUserToApplicantArray = function (v, telephone, domicile, sendAddress, user) {
      //主表新增(覆盖)人员，并填充数据
      if(user) {
        //覆盖
        var applicant = user;
      } else {
        //新增
        $parentScope.adjust.applicantArray.push(new $parentScope.co.Applicant(v.userType));
        var applicant = $parentScope.adjust.applicantArray[$parentScope.adjust.applicantArray.length - 1];
      }
      applicant.isAcquire = '1'; //表示该人员是从交警信息中添加的
      applicant.personName = v.xm;
      applicant.idNo = v.sfzmhm;
      applicant.telephone = user? (telephone? telephone : v.dh) : (v.dh? v.dh : '');
      applicant.domicile = user? (domicile? domicile : v.zz) : (v.zz? v.zz : '');
      applicant.residence = v.zz;
      applicant.sendAddress = user? (sendAddress? sendAddress : v.zz) : (v.zz? v.zz : '');
      applicant.sex = v.xb? (v.xb == '1'? '0':(v.xb == '2'? '1': '')):'';
      applicant.nation = v.mz? $scope.famousList.filter(function (x) {return x.id == v.mz})[0].value: '';
      //填入出生日期
      $step12Scope.checkIdentity(applicant, false);
      //填入事实与理由
      $parentScope.adjust.factReason = $scope.acquireMessageInfo.factReason;
      //填入事故认定编号
      $parentScope.adjust.police.accidentNumber = $scope.acquireMessageInfo.accidentNumber;
    };

    //将所选人员加入到主表的AcquireMessageInfo中，用于识别已带入的人员
    $scope.addUserToAcquireMessageInfo = function (v) {
      var repetition = $scope.acquireMessageInfo.chooseArray.filter(function (x) {
        return x.idNo == v.sfzmhm && x.accidentNumber == $scope.applicantInfo.accidentNumber;
      });
      if(repetition[0]) { //存在重复带入人员信息，只修改userType
        repetition[0].checkedUserType = v.userType;
      } else { //不存在重复人员，直接存入数据
        $scope.acquireMessageInfo.chooseArray.push({
          accidentNumber: $scope.applicantInfo.accidentNumber,
          idNo: v.sfzmhm,
          checkedUserType : v.userType
        })
      }
    };

    //获取mediation的$scope
    var appElement = document.getElementById('mediationCtrl');
    var $parentScope = angular.element(appElement).scope(); //获取mediation的scope
    //获取step12的$scope
    var appElementStep12 = document.getElementById('step12Ctrl');
    var $step12Scope = angular.element(appElementStep12).scope(); //获取step12的scope
    //将人员加入到主表数据中
    chooseArr.forEach(function (v) {
      //找出当前案件的申请人，被申请人（自行填写的，非交警数据填充的）
      var applicatArr = $parentScope.adjust.applicantArray.filter(function(x){return x.personType == '0' && !x.isAcquire && x.idType == '0'});
      var respondentArr = $parentScope.adjust.applicantArray.filter(function(x){return x.personType == '1' && !x.isAcquire && x.idType == '0'});
      //与当前案件的申请人、被申请人对比，进行验证规则
      //申请人
      if(v.userType == '0') {
        $scope.filterUserToApplicantArray(applicatArr, v);
      }

      //被申请人
      if(v.userType == '1') {
        $scope.filterUserToApplicantArray(respondentArr, v);
      }

      //$scope.addUserToApplicantArray(v);
      $scope.addUserToAcquireMessageInfo(v);
    });

    //去掉列表userType属性，防止下次自动选中
    $scope.acquireMessageInfo.dataInfo.forEach(function (v) {
      if(v.userType) delete v.userType;
    });

    //保存数据
    $scope.saveAcquireMessageInfo();

    //关闭模态框
    $scope.closeModal();
  };

  //根据已被填充人员数据，为查找出的人员添加userType
  $scope.fillUserType = function () {
    //判断是否存在已被填充的数据
    if($scope.acquireMessageInfo.chooseArray.length > 0 && $scope.policeInfoList.length > 0) {
      //找出符合当前事故编码的已选择人员
      var curChooseArray = $scope.acquireMessageInfo.chooseArray.filter(function (v) {
        return v.accidentNumber == $scope.applicantInfo.accidentNumber;
      });
      //找出与policeInfoList中相同人员，存入userType
      curChooseArray.forEach(function (v) {
        $scope.policeInfoList.forEach(function (x) {
          if(x.sfzmhm == v.idNo) {
            x.checkedUserType = v.checkedUserType;
          }
        })
      })
    }
  };

  //保存acquireMessageInfo到调解主表
  $scope.saveAcquireMessageInfo = function (body) {
    //获取mediation的$scope
    var appElement = document.getElementById('mediationCtrl');
    var $parentScope = angular.element(appElement).scope(); //获取mediation的scope
    //将本页面数据挂到主表数据中
    $parentScope.adjust.acquireMessageInfo = JSON.stringify($scope.acquireMessageInfo);
    //调用保存方法
    $parentScope.save();
  };

  //关闭模态框
  $scope.closeModal = function () {
    $modalInstance.dismiss('cancel');
  }

  if($scope.policeInfoList.length > 0) {
    //为之前选择过的用户添加checkedUserType属性
    $scope.fillUserType();
  }
});
