/**
 * Created by design on 2017/9/20.
 */
angular.module('sbAdminApp').controller('InterfaceReturnRecordCtrl', function($scope, $log, $state,$stateParams, $filter, $modal, $timeout, DictionaryConfig, LoginService,LawService, LawConfig,LoginConfig, AdminConstant, IncomeNormConstant, CompensateStandardConstant, Upload, toaster,AdjustService,AdjustConfig,$rootScope) {

  //定义数据对象
  var logDefineData = function () {
    this.startDate = "";
    this.endDate = "";
    this.type = "";
    this.serialNo="";
    this.requestCode="";
    //每页条数
    this.pageSize = DictionaryConfig.pageNum;
    //当前页数 默认为第一页
    this.pageNo = 1;
  };
  $scope.logDefineData = new logDefineData();

  //开始日期（日期插件）
  $scope.startDate = false;
  $scope.logOpenStartDate = function($event, index) {
    $event.preventDefault();
    $event.stopPropagation();
    $scope.startDate = true;

  };
  //结束日期（日期插件）
  $scope.endDate = false;
  $scope.logOpenEndDate = function($event, index) {
    $event.preventDefault();
    $event.stopPropagation();
    $scope.endDate = true;
  };
  //获取当前日期
  $scope.currentTime = new Date();
  //格式化日期数据
  $scope.formatDate = function (date) {
    if(typeof date != 'string') {
      var year = date.getFullYear();
      var month = date.getMonth()+1;
      var day = date.getDate();
      return year+'-'+month+'-'+day;
    }
    return date;
  };

    $scope.qeuryInterfaceReturnRecord = LoginService.qeuryInterfaceSerive;
    $scope.qeuryInterfaceReturnRecordCount = LoginService.qeuryInterfaceCountSerive;
  //查询历史数据
    $scope.qeuryInterface = function () {
        $scope.logDefineData.startDate = $scope.formatDate($scope.logDefineData.startDate);  //格式化开始日期
        $scope.logDefineData.endDate = $scope.formatDate($scope.logDefineData.endDate);   //格式化结束日期
        $scope.qeuryInterfaceReturnRecord(
            $scope.logDefineData
        ).success(function (result) {
            console.log(result);
            if (result.code == LoginConfig.commonConStant.SUCCESS) {
                $scope.logCaseInfoList = result.result;
            } else {
                toaster.pop("error", "错误", "查询出错");
            }
        });
        //获取总条数
        $scope.qeuryInterfaceReturnRecordCount(
            $scope.logDefineData
        ).success(function (result) {
            var data = result.result;
            if (result.code == LoginConfig.commonConStant.SUCCESS) {
                $scope.logDefineData.totalPage = data;
            } else {
                toaster.pop("error", "错误", res.message);
            }
        });
    };
    $scope.pageChanged = function(){
        $scope.qeuryInterface();
    }

    $scope.showInterface = function (errorMessage) {
        console.log(errorMessage);
        alert(errorMessage);
    }

    $scope.interfaceMessage = function (errorMessage){
        var modalInstance = $modal.open({
            templateUrl: 'views/pages/caseCopy/interfaceMessage.html',
            controller: 'InterfaceMessageCtrl',
            size: 'lg',
            resolve: {
                items: function() {
                    return {
                        errorMessage: errorMessage
                    };
                }
            }
        });
    }


    /////////////////////////////////////////////////////////////

    //定义案件类型
    $scope.lawStateList = [
        {
            name: "调解案件",
            type: "1"
        }, {
            name: "诉讼案件",
            type: "0"
        }
    ];
    //定义案件类型
    $scope.caseType = [
        {
            name: "立案申请",
            requestCode: "01"
        }
    ];
    //定义数据对象
    var DefineData = function () {
        this.startDate = "";
        this.endDate = "";
        this.type = "";
        this.serialNo="";
        this.requestCode="";
    };
    $scope.defineData = new DefineData();

    //开始日期（日期插件）
    $scope.startDate = false;
    $scope.openStartDate = function($event, index) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.startDate = true;

    };
    //结束日期（日期插件）
    $scope.endDate = false;
    $scope.openEndDate = function($event, index) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.endDate = true;
    };
    //获取当前日期
    $scope.currentTime = new Date();
    //格式化日期数据
    $scope.formatDate = function (date) {
        if(typeof date != 'string') {
            var year = date.getFullYear();
            var month = date.getMonth()+1;
            var day = date.getDate();
            return year+'-'+month+'-'+day;
        }
        return date;
    };


    //发送历史数据
    $scope.sendData = function () {
        $scope.defineData.startDate = $scope.formatDate($scope.defineData.startDate);  //格式化开始日期
        $scope.defineData.endDate = $scope.formatDate($scope.defineData.endDate);   //格式化结束日期
        LoginService.sendAllCaseInfo($scope.defineData).success(function (res) {
            if(res.code == AdjustConfig.commonConStant.SUCCESS) {
                $rootScope.toaster("success", "发送成功");
            }else{
                $rootScope.toaster("error", "错误", res.message);
            }
        });
    };

    //查询数据
    $scope.selectAllCaseInfo = LoginService.selectAllCaseInfo;
    //获取总条数
    $scope.selectAllCaseInfoCount = LoginService.selectAllCaseInfoCount;
    //查询历史数据
    $scope.getDataInfo = function() {
        $scope.defineData.startDate = $scope.formatDate($scope.defineData.startDate);  //格式化开始日期
        $scope.defineData.endDate = $scope.formatDate($scope.defineData.endDate);   //格式化结束日期
        $scope.selectAllCaseInfo($scope.defineData).success(function (result) {
            console.log(result);
            if (result.code == LoginConfig.commonConStant.SUCCESS) {
                $scope.caseInfoList = result.result;
            } else {
                $rootScope.toaster("error", "错误","查询出错");
            }
        })
        //获取总条数
        /*$scope.selectAllCaseInfoCount($scope.defineData).success(function(result) {
         var data = result.result;
         if (result.code == LoginConfig.commonConStant.SUCCESS) {
         $scope.pageData.totalItems = data;
         } else {
         $rootScope.toaster("error", "错误", res.message);
         }
         })*/
    };
    //发送单条或多条数据
    $scope.sendFailDataUrl = LoginService.sendFailData;

    //查询错误信息
    $scope.selectErrorInfoUrl = LoginService.selectErrorInfo;


    //发送单条或多条数据
    $scope.sendFailData = function() {
        $scope.sendFailDataUrl($scope.defineData).success(function (res) {
            if(res.code == AdjustConfig.commonConStant.SUCCESS) {
                $rootScope.toaster("success", "发送成功");
            }else{
                $rootScope.toaster("error", "错误", res.message);
            }
        });
    };

    //查询错误信息
    $scope.selectErrorData = function() {
        $scope.selectErrorInfoUrl($scope.defineData).success(function (result) {
            console.log(result);
            if (result.code == LoginConfig.commonConStant.SUCCESS) {
                $scope.errorList = result.result;
            } else {
                $rootScope.toaster("error", "错误", res.message);
            }
        });
    };




///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    //定义数据对象
    var Log = function () {
        this.caseCreateDate = '';
        this.createDate = '';
        this.serialNo="";
        //每页条数
        this.pageSize = DictionaryConfig.pageNum;
        //当前页数 默认为第一页
        this.pageNo = 1;
    };
    $scope.log = new Log();

    //开始日期（日期插件）
    $scope.date = {
        caseCreateDate:false,
        createDate:false
    };
    $scope.dateOpen = function($event,name) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.date[name] = true;

    };

    //查询数据
    $scope.querySenddataErrormessageList = LoginService.querySenddataErrormessageList;
    //获取总条数
    $scope.querySenddataErrormessageCount = LoginService.querySenddataErrormessageCount;
    //获取总条数
    $scope.updateSenddataErrormessage = LoginService.updateSenddataErrormessage;

    $scope.sendChongqingFailDataService = LoginService.sendChongqingFailDataService;

    $scope.qeuryLog = function () {
        $scope.log.caseCreateDate = $scope.formatDate($scope.log.caseCreateDate);  //格式化开始日期
        $scope.log.createDate = $scope.formatDate($scope.log.createDate);   //格式化结束日期
        $scope.querySenddataErrormessageList($scope.log).success(function (result) {
            if (result.code == LoginConfig.commonConStant.SUCCESS) {
                $scope.logInfoList = result.result;
            } else {
                $rootScope.toaster("error", "错误","查询出错");
            }
        })
        //获取总条数
        $scope.querySenddataErrormessageCount($scope.log).success(function(result) {
         var data = result.result;
         if (result.code == LoginConfig.commonConStant.SUCCESS) {
         $scope.log.totalPage = data;
         } else {
         $rootScope.toaster("error", "错误", res.message);
         }
         })
    }


    //重庆数据发送
    $scope.sendChongqingFailData = function() {
        $scope.sendChongqingFailDataService($scope.defineData).success(function (res) {
            if(res.code == AdjustConfig.commonConStant.SUCCESS) {
                $rootScope.toaster("success", "发送成功");
                alert(res.result);
            }else{
                $rootScope.toaster("error", "错误", res.message);
            }
        });
    };
});