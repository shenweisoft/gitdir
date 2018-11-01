angular.module('sbAdminApp').controller('regionalNameRemarkFormPopup', function($scope,$state,$modal,items,$modalInstance,LoginService,LoginConfig,toaster,LawConfig,$filter,$rootScope) {
    //区域名称查询
    $scope.selectAdminRegion = LoginService.selectAdminRegion;
    //service常量
    $scope.commonConstant = LawConfig.commonConstant;
    //新增后的区域名称备注数据
    $scope.AddQueryRegionalNameRemarkData = LoginService.AddQueryRegionalNameRemarkData;
    //修改后的区域名称备注数据
    $scope.updateQueryRegionalNameRemarkData = LoginService.updateQueryRegionalNameRemarkData;

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
        "startDateErrorMessage": "请输入起始时间",
        "endDateErrorMessage": "请输入终止时间"
    };
    //定义区域名称备注对象
    function regionalNameRemarkObj(){
        this.id="";
        this.startDate ="";  //起始时间
        this.endDate ="";  //终止时间
        this.regionName ="";  //区域名称
        this.medicalFee =""; //医疗费备注
        this.followUpFee =""; //后续治疗费备注
        this.foodSubsidy ="";  //住院伙食补助费备注 
        this.nutritionFee ="";  //营养费备注
        this.lossOfWorking ="";  //误工费备注
        this.nursingFee ="";  //护理费备注
        this.disabilityFee ="";  //残疾赔偿金备注
        this.disabilityAids ="";  //残疾辅助器具费备注
        this.dependentsFee ="";  //被抚养人生活费备注
        this.mentalDamage ="";  //精神损害抚慰金备注
        this.deathFee ="";  //死亡赔偿金备注
        this.funeralExpenses ="";  //丧葬费备注
        this.accidentPersonnel ="";  //处理事故人员误工费备注
        this.trafficExpense ="";  //交通费备注
        this.hotelExpense ="";  //住宿费备注
        this.propertyLoss ="";  //财产损失备注
        this.vehicleLoss ="";  //车辆损失备注
        this.trailerFee ="";  //拖车费备注
        this.rescueFee ="";  //施救费备注
        this.parkingRate ="";  //停车费备注
        this.appraisalFee ="";  //鉴定费备注
        this.otherExpenses ="";  //其它费用备注
        this.delFlag = "0";
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
    $scope.openStartDate = function($event, regionalNameRemarkObj) {
        $event.preventDefault();
        $event.stopPropagation();
        regionalNameRemarkObj.calendarIsOpenStartDate = true;
    };
    //选择终止日期
    $scope.openEndDate = function($event, regionalNameRemarkObj) {
        $event.preventDefault();
        $event.stopPropagation();
        regionalNameRemarkObj.calendarIsOpenEndDate = true;
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
    $scope.regionalNameRemarkObj = angular.copy(items.regionalNameRemarkObj);
    if(!$scope.regionalNameRemarkObj){
        $scope.regionalNameRemarkObj = new regionalNameRemarkObj();
        $scope.addFlag = true;
        
    }
    //获取主页面数据数据
    $scope.pageDataList = items.pageDataList;
    function validateForm(){
        $scope.nameErrorMessage="";
        //验证区域名称
        if(!$scope.regionalNameRemarkObj.regionName){
            $("[name='regionName']").focus();
            $scope.nameErrorMessage = $scope.CONSTANT.nameErrorMessage;
            return false;
        }
        //起始时间
        $scope.startDateErrorMessage=""
        if(!$scope.regionalNameRemarkObj.startDate){
            $("[name='startDate']").focus();
            $scope.startDateErrorMessage = $scope.CONSTANT.startDateErrorMessage;
            return false;
        }
        //结束时间
        $scope.endDateErrorMessage=""
        if(!$scope.regionalNameRemarkObj.endDate){
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
                "regionName":$scope.regionalNameRemarkObj.regionName
            }).success(function(result) {
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
            // 时间参数转换成字符串
            $scope.regionalNameRemarkObj.startDate = $filter('date')($scope.regionalNameRemarkObj.startDate, 'yyyy-MM-dd HH:mm:ss');
            $scope.regionalNameRemarkObj.endDate = $filter('date')($scope.regionalNameRemarkObj.endDate, 'yyyy-MM-dd HH:mm:ss');
            if($scope.addFlag) {
                //新增
                $scope.AddQueryRegionalNameRemarkData($scope.regionalNameRemarkObj).success(function (result) {
                    //请求成功
                    if (result.code == LoginConfig.commonConStant.SUCCESS) {
                        //关闭
                        $modalInstance.close({
                            regionalNameRemarkObj:$scope.regionalNameRemarkObj,
                            addFlag:$scope.addFlag
                        });
                    } else {
                        //TODO
                        alert("请联系系统管理员");
                    }
                });
            }else {//修改
                $scope.updateQueryRegionalNameRemarkData($scope.regionalNameRemarkObj).success(function (result) {
                    //请求成功
                    if (result.code == LoginConfig.commonConStant.SUCCESS) {
                        $modalInstance.close({
                            regionalNameRemarkObj:$scope.regionalNameRemarkObj
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
        $scope.regionalNameRemarkObj.regionId = region.id;
        $scope.regionalNameRemarkObj.regionName = region.regionFullName;
        $scope.regionFlag = false;

    }
})