/*'use strict';

var app = angular.module('sbAdminApp');
app.filter('stringDate', function() {
    return function(dt) {
        if(typeof (dt) == "string")
        {
            dt = dt.replace(/\-/gi,"\/");
            dt = Date.parse(dt);
        }
        return dt && dt;
    }
});*/

angular.module('sbAdminApp').controller('IncomeExpenditureCtrl', function($scope,$state,$modal,$log,toaster,DictionaryConfig, LoginService, PrejudgeConfig,$rootScope) {
    $scope.deleteMtDenizenIncomeNorm = LoginService.deleteMtDenizenIncomeNorm;
    //查询居民收支全部记录
    $scope.queryDenizenNormListService = LoginService.queryJyIncomeNormList;
    //查询居民收支记录条数
    $scope.queryDenizenNormListNumService = LoginService.queryJyIncomeNormNum;

    $scope.pageData={
        currentPage:'1',
        itemNum:DictionaryConfig.pageNum,
        showList:[]
    }
    var level = {
        "error": "error"
    }
    var title = {
        "error": "错误"
    }
    $scope.CONSTANT={
        "messageBackend":"查询后台数据失败！请联系管理员",
        "errormessag":"请联系系统管理员"
    }
    function MtDenizenIncomeNorm(){
        this.pageNo=0;
    }
    $scope.mtDenizenIncomeNorm = new MtDenizenIncomeNorm();
    //查询全部收支记录
    $scope.getDataInfo = function(pageNo) {
        $scope.mtDenizenIncomeNorm.pageNo = pageNo;
        $scope.queryDenizenNormListService($scope.mtDenizenIncomeNorm).success(function (result) {
            var data = result.result;
            if (result.code == PrejudgeConfig.commonConstant.SUCCESS) {
                $scope.pageData.showList = data;
            } else {
                $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageBackend);
            }
        })
        //获取总条数
        $scope.queryDenizenNormListNumService($scope.mtDenizenIncomeNorm).success(function(result) {
            var data = result.result;
            if (result.code == PrejudgeConfig.commonConstant.SUCCESS) {
                $scope.pageData.totalItems = data;
            } else {
                $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageBackend);
            }
        })
    }
    $scope.getDataInfo($scope.pageData.currentPage, $scope.pageData.itemNum);
    $scope.pageChanged = function () {
        $scope.getDataInfo($scope.pageData.currentPage,$scope.pageData.itemNum);
    }

	// 新增弹出框
	  $scope.newlyAdded = function(mtDenizenIncomeNorm) {
	    var popupModal = $modal.open({
	      templateUrl: 'views/pages/newlyAdded/newlyAdded.html',
	      controller: 'newlyAddedCtrl',
	      size: 'lg',
	      resolve: {
	        items: function(){
	          return {
                  mtDenizenIncomeNorm:mtDenizenIncomeNorm,
                  pageDataList:$scope.pageData.showList
	          }
	        }
	      }
	    });
	  };


    //删除
    $scope.deleteNorm = function(mtDenizenIncomeNorm) {
        if(confirm("您确认删除吗？")){
            var param = "";
            if(mtDenizenIncomeNorm){
                param = [mtDenizenIncomeNorm.id];
            }else{
                //param = $scope.pageData.showList.filter(function(v){ return v.checked;}).map(function(x){return x.id;});
                if(param.length < 1){
                    $rootScope.toaster("error", "错误", "至少选择一条数据！");
                }
            }
            console.log(param);
            $scope.deleteMtDenizenIncomeNorm({
                "id": param[0]
            }).success(function(result) {
                $log.log(result.data);
                //请求成功
                if (result.code == PrejudgeConfig.commonConstant.SUCCESS) {
                    //根据索引删除数据
                    var tempIndex =  _.findIndex( $scope.pageData.showList,{id:mtDenizenIncomeNorm.id});
                    /*$scope.pageData.showList.filter(function(val, index) {
                        if (val.id == mtDenizenIncomeNorm.id) {
                            tempIndex = index;
                            return true;
                        }
                        return false;
                    });*/
                    $scope.pageData.showList.splice(tempIndex, 1);
                }else{
                    //TODO
                   $rootScope.toaster(level.error, title.error, $scope.CONSTANT.errormessag);
                }
            });
        }
    };
})




angular.module('sbAdminApp').controller('newlyAddedCtrl', function($scope,$state,$modal,items,$modalInstance,LoginService,LoginConfig,toaster,$rootScope) {

    $scope.saveMtDenizenIncomeNorm=LoginService.saveMtDenizenIncomeNorm;
    $scope.updateMtDenizenIncomeNorm = LoginService.updateMtDenizenIncomeNorm;
    $scope.selectAdminRegion = LoginService.selectAdminRegion;
    //检查居民收入表新增数据是否存在
    $scope.checkMtDenizenIncomeNormDataExists = LoginService.checkMtDenizenIncomeNormDataExists;
    $scope.addFlag =false;
	//取消
      $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
      };
    var level = {
        "error": "error"
    }
    var title = {
        "error": "错误"
    }
    $scope.CONSTANT={
        "messageBackend":"查询后台数据失败！请联系管理员",
        "errormessag":"请联系系统管理员"
    }
    //定义错误信息常量
    $scope.CONSTANT = {
        "nameErrorMessage": "请您选择区域名称",
        "urbanDisposableIncomeErrorMessage": "请输入城镇死亡/伤残标准",
        "ruralNetIncomeErrorMessage": "请输入农村死亡/伤残标准",
        "urbanAverageOutlayErrorMessage": "请输入城镇被抚养人生活费",
        "ruralAverageOutlayErrorMessage": "请输入农村被抚养人生活费",
        "startDateErrorMessage": "请输入起始时间",
        "endDateErrorMessage": "请输入终止时间",
        "funeralFeeStandardErrorMessage": "请输入丧葬费标准"
    };
    //定义居民收入支出标准表对象
    function MtDenizenIncomeNorm(){
        this.id="";
        this.regionId="";
        this.regionName="";
        this.residentNature="3";
        this.urbanDisposableIncome="";
        this.ruralNetIncome="";
        this.urbanAverageOutlay="";
        this.ruralAverageOutlay="";
        this.startDate ="";
        this.endDate =""
        this.funeralFeeStandard="";
        this.delFlag = "0";
        this.updateUserId = "admin";
        this.updateUserName = "admin";
        this.createUserId = "admin";
        this.createUserName = "admin";
        this.updateDate = getTime();
        this.createDate = getTime();
    }

    //获取时间格式是 yyyy-mm-dd hh:mm:ss
    function getTime(){

        var date = new Date();
        this.year = date.getFullYear();
        this.month = date.getMonth() + 1;
        this.date = date.getDate();
        return this.year +"-"+this.month + "-" + this.date + " 00:00:00";
    }

    //选择起始日期
    $scope.openStartDate = function($event, mtDenizenIncomeNorm) {
        $event.preventDefault();
        $event.stopPropagation();
        mtDenizenIncomeNorm.calendarIsOpenStartDate = true;
    };
    //选择终止日期
    $scope.openEndDate = function($event, mtDenizenIncomeNorm) {
        $event.preventDefault();
        $event.stopPropagation();
        mtDenizenIncomeNorm.calendarIsOpenEndDate = true;
    };
    //处理起始，终止日期格式  为：yyyy-mm-dd hh:mm:ss
    function startDateAndEndDate(times){

        var date = new Date(times);
        this.year = date.getFullYear();
        this.month = date.getMonth() + 1;
        this.date = date.getDate();
        return this.year +"-"+this.month + "-" + this.date + " 00:00:00";
    }
    //初始化对象 如果对象不存在 undefined  需要new对象
    $scope.mtDenizenIncomeNorm = items.mtDenizenIncomeNorm;
    if(!$scope.mtDenizenIncomeNorm){
        $scope.mtDenizenIncomeNorm = new MtDenizenIncomeNorm();
        $scope.addFlag = true;
    }
    //获取主页面数据数据
    $scope.pageDataList = items.pageDataList;
    function validateForm(){
        $scope.nameErrorMessage="";
        //验证区域名称
        if(!$scope.mtDenizenIncomeNorm.regionName){
            $("[name='regionName']").focus();
            $scope.nameErrorMessage = $scope.CONSTANT.nameErrorMessage;
            return false;
        }
        //起始时间
        $scope.startDateErrorMessage=""
        if(!$scope.mtDenizenIncomeNorm.startDate){
            $("[name='startDate']").focus();
            $scope.startDateErrorMessage = $scope.CONSTANT.startDateErrorMessage;
            return false;
        }
        //结束时间
        $scope.endDateErrorMessage=""
        if(!$scope.mtDenizenIncomeNorm.endDate){
            $("[name='endDate']").focus();
            $scope.endDateErrorMessage = $scope.CONSTANT.endDateErrorMessage;
            return false;
        }
        return true;
    };
    //回车查询区域列表
    $scope.regionNameListShow = function(){

        if (event.keyCode == 13){
            $scope.selectAdminRegion({
                "regionName":$scope.mtDenizenIncomeNorm.regionName
            }).success(function(result) {
                console.log(result);
                //请求成功
                if (result.code == LoginConfig.commonConStant.SUCCESS) {
                    $scope.AdminRegionList = result.result;
                    $scope.regionFlag = true;
                }else{
                    //TODO
                     $rootScope.toaster(level.error, title.error, $scope.CONSTANT.errormessag);
                }
            });
        }

    }
    //保存
    $scope.save = function(){
        if(validateForm()){
            if($scope.addFlag) {//新增
                /*$scope.mtDenizenIncomeNorm.startDate = startDateAndEndDate($scope.mtDenizenIncomeNorm.startDate);
                $scope.mtDenizenIncomeNorm.endDate = startDateAndEndDate($scope.mtDenizenIncomeNorm.endDate);
                $scope.checkMtDenizenIncomeNormDataExists($scope.mtDenizenIncomeNorm).success(function (result) {
                    var data = result.result;
                    console.log(data);
                    if(data=="0"){
                        $scope.saveMtDenizenIncomeNorm($scope.mtDenizenIncomeNorm).success(function (result) {
                            //请求成功
                            console.log(result);
                            if (result.code == LoginConfig.commonConStant.SUCCESS) {
                                //将数据添加到数组的开始位置
                                $scope.pageDataList.unshift($scope.mtDenizenIncomeNorm);
                                //关闭
                                $modalInstance.dismiss('cancel');
                            } else {
                                //TODO
                                $rootScope.toaster(level.error, title.error, $scope.CONSTANT.errormessag);
                            }
                        });
                    }else {
                        //TODO
                        $rootScope.toaster("error", "此区域居民收入支出标准已存在！");
                    }
                })*/
                $scope.mtDenizenIncomeNorm.startDate = startDateAndEndDate($scope.mtDenizenIncomeNorm.startDate);
                $scope.mtDenizenIncomeNorm.endDate = startDateAndEndDate($scope.mtDenizenIncomeNorm.endDate);
                $scope.saveMtDenizenIncomeNorm($scope.mtDenizenIncomeNorm).success(function (result) {
                    //请求成功
                    console.log(result);
                    if (result.code == LoginConfig.commonConStant.SUCCESS) {
                        //将数据添加到数组的开始位置
                        $scope.pageDataList.unshift($scope.mtDenizenIncomeNorm);
                        //关闭
                        $modalInstance.dismiss('cancel');
                    } else {
                        //TODO
                        alert("请联系系统管理员");
                    }
                });
            }else {//修改
                $scope.updateMtDenizenIncomeNorm($scope.mtDenizenIncomeNorm).success(function (result) {
                    //请求成功
                    console.log(result);
                    if (result.code == LoginConfig.commonConStant.SUCCESS) {
                        $modalInstance.close({
                            mtDenizenIncomeNorm:$scope.mtDenizenIncomeNorm
                        });
                    } else {
                        //TODO
                        $rootScope.toaster(level.error, title.error, $scope.CONSTANT.errormessag);
                    }
                });
            }
        }
    }
    //选择区域名称后赋值区域名称和区域ID
    $scope.selectRegionName =function(region){
        $scope.mtDenizenIncomeNorm.regionId = region.id;
        $scope.mtDenizenIncomeNorm.regionName = region.regionFullName;
        $scope.regionFlag = false;

    }
})