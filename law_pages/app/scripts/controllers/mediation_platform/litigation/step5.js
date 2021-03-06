'use strict';
var app = angular.module('sbAdminApp');

app.filter('result2Text', function() {
    return function(result) {
        var text = "";
        if (result.payType == "1" || result.payType == "2") {
            text += result.companyName + "(车牌号:" + result.plateNo + ")";
        } else if (result.payType == "3") {
            if (result.personType == 1) {
                text += result.personName+" 自行承担"
            } else if (result.personType == 0) {
                text += result.personName+" 自行承担"
            }
        }
        return text
    }
});

app.filter('respondents2Company', function() {
    return function(result) {
        var arr = [];
        result.forEach(function(v) {
            if (v.personType == "1" && v.idType == "1" && v.enterpriseType == "1") {
                if (arr.indexOf(v.orgName) == -1) arr.push(v.orgName);
            }
        });
        return arr;
    }
});

app.filter('formatMoney', function () {
    return function (result) {
        if(result){
            if(parseInt(result).toString().indexOf('.') === -1) {
                return parseInt(result).toFixed(2)*1;
            }
        }else{
            result = 0;
        }
        return result;
    }
});


app.directive('intOnly', function($filter) {
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, modelCtrl) {
            element.bind('keyup', function(inputValue, e) {
                var strinput = modelCtrl.$modelValue + "";
                strinput = strinput ? strinput.replace(/[^\d.]/g, '') : '0'
                modelCtrl.$setViewValue(parseInt(strinput));
                modelCtrl.$render();
            });
        }
    }
});


app.directive('floatOnly', function($filter, $timeout) {
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, modelCtrl) {
            var checkTimeout;
            element.bind('keyup', function(inputValue, e) {
                if(checkTimeout){
                    $timeout.cancel(checkTimeout)
                    checkTimeout = null;
                }
                var strinput = modelCtrl.$modelValue;
                checkTimeout = $timeout(function() {
                    if(strinput && !isNaN(strinput)){
                        strinput = strinput ? strinput.toString().replace(/[^\d.]/g, '') : "";
                        if(strinput.indexOf(".") > 0 && strinput.length - 1 != strinput.indexOf(".")){
                            var floatLength = strinput.length - strinput.indexOf(".") - 1;
                            floatLength = floatLength > 2 ? 2:floatLength;
                            strinput = parseFloat(strinput).toFixed(floatLength)*1;
                        }
                    }else{
                        strinput = "";
                    }
                    modelCtrl.$setViewValue(strinput);
                    modelCtrl.$render();
                }, 1500);
            });
        }
    }
})

app.controller('step5Ctrl', function(LoginService,$scope, $stateParams, $interpolate, toaster, $state, $location, $timeout, $http, $log, $filter, $modal, AdjustService, AdjustConfig, LawService, DictionaryConfig, CompensateStandardConstant, Upload, IncomeNormConstant, AdminConstant,$rootScope) {
    $scope.co.step = 5;
    //调解结果
    $scope.ajustResultArray = DictionaryConfig.adjustResultList;
    //取得户口类型字典
    $scope.accountTypeList = DictionaryConfig.accountTypeList;
    //取得调解金额说明
    $scope.conciliationStatement = DictionaryConfig.conciliationStatement;
    //填充区域信息
    $scope.adminRegion = AdminConstant.administrationRegions;
    //后台查询计算器的相关标准
    $scope.queryCalculateStandardService = AdjustService.queryCalculateStandard;
    //居民收入支出标准表
    $scope.incomeNorm = IncomeNormConstant.incomeNorm;
    //赔偿标准字典表
    $scope.compensateStandard = CompensateStandardConstant.compensateStandard;
    //获取调解结果全部选项id
    $scope.organizeTypeAll = getOrganizeArr(DictionaryConfig.newOrganizeType);
    //点击传输数据
    $scope.getCarlossService = AdjustService.getCarloss;

    //从session中获取人员信息 默认省份城市
    $scope.$on('user2Child', function(){
        initData();
    });
    if (LoginService.user.userPermissions) {
        initData();
    }
    //初始化省份城市数据
    function initData(){
        $scope.sysUser = LoginService.user.sysUser;
        if(!$scope.adjust.regionName){
            $scope.adjust.regionName = $scope.sysUser.regionName;
            if($scope.adjust.regionName){
                $scope.adjust.regionCode = _.find(AdminConstant.administrationRegions, {fullName:$scope.adjust.regionName}).regionCode;
            }
        }

        if(LoginService.user.sysUser.userDepartList[0]) {
            if(JSON.parse(LoginService.user.sysUser.userDepartList[0].extPro).justiceType) {
                $scope.justiceTypeList = JSON.parse(LoginService.user.sysUser.userDepartList[0].extPro).justiceType.split(',')
            }
        }

        //获取筛选后的调解结果选项
        $scope.ajustResultArray = _.filter($scope.ajustResultArray, function(obj) {
            if(obj.id == 0 || obj.id == 4) {
                if($.inArray(obj.id, $scope.justiceTypeList) != -1) {
                    return obj
                }
            } else {
                return obj
            }
        })

        setTimeout(function () {
            $scope.findIncomeAndCompensate();
        },500);
    }
    //获取赔偿年度
    $scope.yearList = DictionaryConfig.getYearList();
    //获取当前日期
    $scope.currentTime = new Date();
    //死亡日期（日期插件）
    $scope.deathDateOpened = false;
    $scope.openDeathDate = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.deathDateOpened = true;
    };
    //调解日期（日期插件）
    $scope.adjustDateOpened = false;
    $scope.openAdjustDate = function($event, index) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.adjustDateOpened = true;
    };
    //付款日期（日期插件）
    $scope.payDateOpened = false;
    $scope.openPayDate = function($event, index) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.payDateOpened = true;
    };
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
        if (selectedNodes.length > 0 && selected.node.type=='default') {
            var selectedRegion = $scope.adminRegion[selectedNodes[0]];
            if ($scope.adjust.regionName != selectedRegion.fullName) {
                $scope.adjust.regionName = selectedRegion.fullName;
                $scope.adjust.regionCode = selectedRegion.regionCode;
                $scope.adjust.regionNameError = undefined
                angular.element("#regNamebox").hide();
                $scope.isShowTree = false;
                //选择区域的时候进行触发计算赔偿标准和居民收入支出标准
                $scope.findIncomeAndCompensate(true);
                //查询备注
                //queryMtRegionalNameRemark();
            }
        }
    };

    //选择区域的时候进行触发计算赔偿标准和居民收入支出标准
    $scope.findIncomeAndCompensate = function(flag){
        if ($scope.adjust.regionName && $scope.adjust.standardYear) {
            //计算居民收支标准以及赔偿标准
            queryCalculateStandard(flag);
        }
    };

    $scope.changeYear = function(){

        $scope.findIncomeAndCompensate(true);
        //查询备注
        //queryMtRegionalNameRemark();
    };

    //查询计算器备注
    function queryMtRegionalNameRemark() {
        //根据年度和区域查询计算器备注
        $scope.queryMtRegionalNameRemarkService = LoginService.queryMtRegionalNameRemark;
        $scope.calculateVO = new CalculateVO();
        //查询数据
        $scope.queryMtRegionalNameRemarkService($scope.calculateVO).success(function(result){
            if (result.code == AdjustConfig.commonConStant.SUCCESS) {
                if(result.result){
                    //备注集合列表
                    var mtRegionalNameRemark = result.result;
                    //医疗费x
                    var medicalFee = _.find($scope.adjust.feeDetail,{id:'03'});
                    //medicalFee.remark = mtRegionalNameRemark.medicalFee;
                    if(mtRegionalNameRemark.medicalFee){
                        medicalFee.isClaimWarning = true;
                        medicalFee.warningText = (medicalFee.warningText? medicalFee.warningText:"") +'【'+mtRegionalNameRemark.medicalFee+'】';
                    }
                    //后续治疗费
                    var followUpFee = _.find($scope.adjust.feeDetail,{id:'04'});
                    //followUpFee.remark = mtRegionalNameRemark.followUpFee;
                    if(mtRegionalNameRemark.followUpFee){
                        followUpFee.isClaimWarning = true;
                        followUpFee.warningText = (followUpFee.warningText? followUpFee.warningText:"")+'【'+mtRegionalNameRemark.followUpFee+'】';
                    }
                    //住院伙食补助费
                    var foodSubsidy = _.find($scope.adjust.feeDetail,{id:'06'});
                    //foodSubsidy.remark = mtRegionalNameRemark.foodSubsidy;
                    if(mtRegionalNameRemark.foodSubsidy){
                        foodSubsidy.isClaimWarning = true;
                        foodSubsidy.warningText = (foodSubsidy.warningText? foodSubsidy.warningText:"")+'【'+mtRegionalNameRemark.foodSubsidy+'】';
                    }
                    //营养费
                    var nutritionFee = _.find($scope.adjust.feeDetail,{id:'07'});
                    //nutritionFee.remark = mtRegionalNameRemark.nutritionFee;
                    if(mtRegionalNameRemark.nutritionFee){
                        nutritionFee.isClaimWarning = true;
                        nutritionFee.warningText = (nutritionFee.warningText? nutritionFee.warningText:"")+'【'+mtRegionalNameRemark.nutritionFee+'】';
                    }
                    //误工费
                    var lossOfWorking = _.find($scope.adjust.feeDetail,{id:'08'});
                    //lossOfWorking.remark = mtRegionalNameRemark.lossOfWorking;
                    if(mtRegionalNameRemark.lossOfWorking){
                        lossOfWorking.isClaimWarning = true;
                        lossOfWorking.warningText = (lossOfWorking.warningText? lossOfWorking.warningText:"")+'【'+mtRegionalNameRemark.lossOfWorking+'】';
                    }


                    //护理费
                    var nursingFee = _.find($scope.adjust.feeDetail,{id:'09'});
                    //nursingFee.remark = mtRegionalNameRemark.nursingFee;
                    if(mtRegionalNameRemark.nursingFee){
                        nursingFee.isClaimWarning = true;
                        nursingFee.warningText = (nursingFee.warningText? nursingFee.warningText:"")+'【'+mtRegionalNameRemark.nursingFee+'】';
                    }

                    //残疾赔偿金
                    var disabilityFee = _.find($scope.adjust.feeDetail,{id:'12'});
                    //disabilityFee.remark = mtRegionalNameRemark.disabilityFee;
                    if(mtRegionalNameRemark.disabilityFee){
                        disabilityFee.isClaimWarning = true;
                        disabilityFee.warningText = (disabilityFee.warningText? disabilityFee.warningText:"")+ '【'+ mtRegionalNameRemark.disabilityFee+'】';
                    }


                    //残疾辅助器具费
                    var disabilityAids = _.find($scope.adjust.feeDetail,{id:'13'});
                    //disabilityAids.remark = mtRegionalNameRemark.disabilityAids;
                    if(mtRegionalNameRemark.disabilityAids){
                        disabilityAids.isClaimWarning = true;
                        disabilityAids.warningText = (disabilityAids.warningText? disabilityAids.warningText:"")+'【'+mtRegionalNameRemark.disabilityAids+'】';
                    }
                    //被抚养人生活费
                    var dependentsFee = _.find($scope.adjust.feeDetail,{id:'14'});
                    //dependentsFee.remark = mtRegionalNameRemark.dependentsFee;
                    if(mtRegionalNameRemark.dependentsFee){
                        dependentsFee.isClaimWarning = true;
                        dependentsFee.warningText = (dependentsFee.warningText? dependentsFee.warningText:"")+'【'+mtRegionalNameRemark.dependentsFee+'】';
                    }
                    //精神损害抚慰金
                    var mentalDamage = _.find($scope.adjust.feeDetail,{id:'17'});
                    //mentalDamage.remark = mtRegionalNameRemark.mentalDamage;
                    if(mtRegionalNameRemark.mentalDamage){
                        mentalDamage.isClaimWarning = true;
                        mentalDamage.warningText = (mentalDamage.warningText? mentalDamage.warningText:"")+'【'+mtRegionalNameRemark.mentalDamage+'】';
                    }
                    //死亡赔偿金
                    var deathFee = _.find($scope.adjust.feeDetail,{id:'15'});
                    //deathFee.remark = mtRegionalNameRemark.deathFee;
                    if(mtRegionalNameRemark.deathFee){
                        deathFee.isClaimWarning = true;
                        deathFee.warningText = (deathFee.warningText? deathFee.warningText:"") + '【'+ mtRegionalNameRemark.deathFee+'】';
                    }
                    //丧葬费
                    var funeralExpenses = _.find($scope.adjust.feeDetail,{id:'16'});
                    //funeralExpenses.remark = mtRegionalNameRemark.funeralExpenses;
                    if(mtRegionalNameRemark.funeralExpenses){
                        funeralExpenses.isClaimWarning = true;
                        funeralExpenses.warningText = (funeralExpenses.warningText? funeralExpenses.warningText:"")+'【'+mtRegionalNameRemark.funeralExpenses+'】';
                    }
                    //处理事故人员误工费
                    var accidentPersonnel = _.find($scope.adjust.feeDetail,{id:'80'});
                    //accidentPersonnel.remark = mtRegionalNameRemark.accidentPersonnel;
                    if(mtRegionalNameRemark.accidentPersonnel){
                        accidentPersonnel.isClaimWarning = true;
                        accidentPersonnel.warningText = (accidentPersonnel.warningText? accidentPersonnel.warningText:"")+'【'+mtRegionalNameRemark.accidentPersonnel+'】';
                    }
                    //交通费
                    var trafficExpense = _.find($scope.adjust.feeDetail,{id:'10'});
                    //trafficExpense.remark = mtRegionalNameRemark.trafficExpense;
                    if(mtRegionalNameRemark.trafficExpense){
                        trafficExpense.isClaimWarning = true;
                        trafficExpense.warningText = (trafficExpense.warningText? trafficExpense.warningText:"")+'【'+mtRegionalNameRemark.trafficExpense+'】';
                    }
                    //住宿费
                    var hotelExpense = _.find($scope.adjust.feeDetail,{id:'11'});
                    //hotelExpense.remark = mtRegionalNameRemark.hotelExpense;
                    if(mtRegionalNameRemark.hotelExpense){
                        hotelExpense.isClaimWarning = true;
                        hotelExpense.warningText = (hotelExpense.warningText? hotelExpense.warningText:"")+'【'+mtRegionalNameRemark.hotelExpense+'】';
                    }
                    //财产损失
                    var propertyLoss = _.find($scope.adjust.feeDetail,{id:'30'});
                    //propertyLoss.remark = mtRegionalNameRemark.propertyLoss;
                    if(mtRegionalNameRemark.propertyLoss){
                        propertyLoss.isClaimWarning = true;
                        propertyLoss.warningText = (propertyLoss.warningText? propertyLoss.warningText:"")+'【'+mtRegionalNameRemark.propertyLoss+'】';
                    }
                    //车辆损失
                    var vehicleLoss = _.find($scope.adjust.feeDetail,{id:'40'});
                    //vehicleLoss.remark = mtRegionalNameRemark.vehicleLoss;
                    if(mtRegionalNameRemark.vehicleLoss){
                        vehicleLoss.isClaimWarning = true;
                        vehicleLoss.warningText = (vehicleLoss.warningText? vehicleLoss.warningText:"")+'【'+mtRegionalNameRemark.vehicleLoss+'】';
                    }
                    //拖车费
                    var trailerFee = _.find($scope.adjust.feeDetail,{id:'50'});
                    //trailerFee.remark = mtRegionalNameRemark.trailerFee;
                    if(mtRegionalNameRemark.trailerFee){
                        trailerFee.isClaimWarning = true;
                        trailerFee.warningText = (trailerFee.warningText? trailerFee.warningText:"")+'【'+mtRegionalNameRemark.trailerFee+'】';
                    }
                    //施救费
                    var rescueFee = _.find($scope.adjust.feeDetail,{id:'70'});
                    //rescueFee.remark = mtRegionalNameRemark.rescueFee;
                    if(mtRegionalNameRemark.rescueFee){
                        rescueFee.isClaimWarning = true;
                        rescueFee.warningText = (rescueFee.warningText? rescueFee.warningText:"")+'【'+mtRegionalNameRemark.rescueFee+'】';
                    }
                    //停车费
                    var parkingRate = _.find($scope.adjust.feeDetail,{id:'60'});
                    //parkingRate.remark = mtRegionalNameRemark.parkingRate;
                    if(mtRegionalNameRemark.parkingRate){
                        parkingRate.isClaimWarning = true;
                        parkingRate.warningText = (parkingRate.warningText? parkingRate.warningText:"")+'【'+mtRegionalNameRemark.parkingRate+'】';
                    }
                    //鉴定费
                    var appraisalFee = _.find($scope.adjust.feeDetail,{id:'18'});
                    //appraisalFee.remark = mtRegionalNameRemark.appraisalFee;
                    if(mtRegionalNameRemark.appraisalFee){
                        appraisalFee.isClaimWarning = true;
                        appraisalFee.warningText = (appraisalFee.warningText? appraisalFee.warningText:"")+'【'+mtRegionalNameRemark.appraisalFee+'】';
                    }
                    //其它费用
                    var otherExpenses = _.find($scope.adjust.feeDetail,{id:'71'});
                    //otherExpenses.remark = mtRegionalNameRemark.otherExpenses;
                    if(mtRegionalNameRemark.otherExpenses){
                        otherExpenses.isClaimWarning = true;
                        otherExpenses.warningText = (otherExpenses.warningText? otherExpenses.warningText:"")+'【'+mtRegionalNameRemark.otherExpenses+'】';
                    }
                }/*else{
                    if($scope.adjust.feeDetail){
                        $scope.adjust.feeDetail.forEach(function(val){
                            val.remark = "";
                        });
                    }

                }*/
            }
        });
    }


    function caluldateHosehole(dependents){
        var countFee = 0;
        var dependentStandard = $scope.adjust.compensateStandard[$scope.adjust.household].expense;
        dependents.forEach(function(v) {
            v.expense = dependentStandard;
        });
        dependents.sort(function(a, b) {
            return a.fyAge - b.fyAge;
        });
        dependents.forEach(function(v, i, arr) {
            var tmpFee = 0;
            var preYear = 0;
            var year = v.fyAge;
            for (var j = i; j < arr.length; j++) {
                tmpFee += (arr[j].expense * $scope.adjust.compensateRate / 100 / arr[j].count);
            }
            if (i != 0) {
                preYear = arr[i - 1].fyAge;
            }
            if (tmpFee > dependentStandard)
                tmpFee = dependentStandard;
            countFee += (tmpFee * (year - preYear));
        });
        return countFee.toFixed(2)*1;
    }


    //切换赔偿标准
    $scope.changeHosehole = function(){

        $scope.findIncomeAndCompensate(true);
        //获取赔偿标准ID
        var household = $scope.adjust.household;
        var depent = _.find($scope.adjust.feeDetail, {id: "14"});
        if(depent){
            depent.dependents['apply'].forEach(function(val){
                val.household = household;
            });
            depent.dependents['claim'].forEach(function(val){
                val.household = household;
            });
            depent.applyAmount = caluldateHosehole(depent.dependents['apply']);
            depent.claimAmount = caluldateHosehole(depent.dependents['claim']);
        }
    };

    //获取所有调解选项id
    function getOrganizeArr(arr) {
        var list = [];
        _.each(arr, function(obj) {
            list.push(obj.id)
        })
        return list
    }

    //默认系统初始化居民收支标准以及赔偿标准(延时一秒钟处理)
    setTimeout(function () {
        $scope.findIncomeAndCompensate();
    },1000);


    //计算器传输对象
    function CalculateVO(){
        this.regionName = $scope.adjust.regionName;
        this.standardYear = $scope.adjust.standardYear;
        this.household = $scope.adjust.household;
    };

    //根据参数查询后端标准
    function queryCalculateStandard(flag){
        $scope.calculateVO = new CalculateVO();
        $scope.queryCalculateStandardService($scope.calculateVO).success(function(result) {
            //请求成功
            if (result.code == AdjustConfig.commonConStant.SUCCESS) {
                var calculateResultVO = result.result;
                $scope.adjust.compensateStandard = {};
                //计算费用标准
                //误工费
                if(calculateResultVO.lostIncome){
                    $scope.adjust.compensateStandard.lostIncome = calculateResultVO.lostIncome;
                }else{
                    $scope.adjust.compensateStandard.lostIncome = "";
                }
                //护理费
                if(calculateResultVO.standardNurseFee){
                    $scope.adjust.compensateStandard.standardNurseFee = calculateResultVO.standardNurseFee;
                }else{
                    $scope.adjust.compensateStandard.standardNurseFee = "";
                }
                //住院伙食补助费
                if(calculateResultVO.hospitalFoodSubsidies){
                    $scope.adjust.compensateStandard.hospitalFoodSubsidies = calculateResultVO.hospitalFoodSubsidies;
                }else{
                    $scope.adjust.compensateStandard.hospitalFoodSubsidies = "";
                }
                //营养费
                if(calculateResultVO.thesePayments){
                    $scope.adjust.compensateStandard.thesePayments = calculateResultVO.thesePayments;
                }else{
                    $scope.adjust.compensateStandard.thesePayments = "";
                }
                //交通费
                if(calculateResultVO.transportationFee){
                    $scope.adjust.compensateStandard.transportationFee = calculateResultVO.transportationFee;
                }
                //住宿费
                if(calculateResultVO.accommodationFee){
                    $scope.adjust.compensateStandard.accommodationFee = calculateResultVO.accommodationFee;
                }else{
                    $scope.adjust.compensateStandard.accommodationFee = "";
                }
                //丧葬费
                if(calculateResultVO.funeralFeeStandard){
                    $scope.adjust.compensateStandard.funeralFeeStandard = calculateResultVO.funeralFeeStandard;
                }else{
                    $scope.adjust.compensateStandard.funeralFeeStandard = "";
                }
                //精神抚慰金标准
                if(calculateResultVO.spiritualConsolationFee){
                    $scope.adjust.compensateStandard.spiritualConsolationFee = calculateResultVO.spiritualConsolationFee;
                }else{
                    $scope.adjust.compensateStandard.spiritualConsolationFee = "";
                }

                //计算居民收入支出标准
                //农村赔偿标准
                //城镇在岗职工收入标准
                if(calculateResultVO.urbanSalary){
                    $scope.adjust.compensateStandard.wageIncome = calculateResultVO.urbanSalary;
                }else{
                    $scope.adjust.compensateStandard.wageIncome = "";
                }

                if(!calculateResultVO.ruralNetIncome){
                    calculateResultVO.ruralNetIncome = "";
                }
                if(!calculateResultVO.ruralAverageOutlay){
                    calculateResultVO.ruralAverageOutlay = "";
                }
                if(!calculateResultVO.urbanDisposableIncome){
                    calculateResultVO.urbanDisposableIncome = "";
                }
                if(!calculateResultVO.urbanAverageOutlay){
                    calculateResultVO.urbanAverageOutlay = "";
                }
                //农村的
                $scope.adjust.compensateStandard["1"] = {
                    "income": calculateResultVO.ruralNetIncome,
                    "expense": calculateResultVO.ruralAverageOutlay
                };
                //城镇赔偿标准
                $scope.adjust.compensateStandard["2"] = {
                    "income": calculateResultVO.urbanDisposableIncome,
                    "expense": calculateResultVO.urbanAverageOutlay
                };
                //循环计算器详细表
                var householdStr =  $scope.adjust.household == '1'?"农村":"城镇";
                console.log($scope.adjust.feeDetail)
                $scope.adjust.feeDetail.forEach(function(v) {


                    v.warningText = "";
                    v.isClaimWarning = undefined;

                    var cityStr = v.value + "：" + $scope.adjust.regionName+$scope.adjust.standardYear+ "年" +householdStr+"标准：";
                    //住院伙食补助费
                    if(v.id == '06'){
                        if(calculateResultVO.hospitalFoodSubsidies){
                            v.isClaimWarning = true;
                            v.warningText = cityStr+calculateResultVO.hospitalFoodSubsidies+"元/天";
                        }else{
                            v.isClaimWarning = undefined;
                            v.warningText = undefined;
                        }
                    }else if(v.id == '07'){//营养费
                        if(calculateResultVO.thesePayments){
                            v.isClaimWarning = true;
                            v.warningText = cityStr+calculateResultVO.thesePayments+"元/天";
                        }else{
                            v.isClaimWarning = undefined;
                            v.warningText = undefined;
                        }
                    }else if(v.id == '08' || v.id == '80'){//误工费 /处理人误工费
                        if(calculateResultVO.lostIncome){
                            v.isClaimWarning = true;
                            v.warningText = cityStr+calculateResultVO.lostIncome+"元/天";
                        }else{
                            v.isClaimWarning = undefined;
                            v.warningText = undefined;
                        }
                    }else if(v.id == '09'){//护理费
                        if(calculateResultVO.standardNurseFee){
                            v.isClaimWarning = true;
                            v.warningText = cityStr+calculateResultVO.standardNurseFee+"元/天";
                        }else{
                            v.isClaimWarning = undefined;
                            v.warningText = undefined;
                        }
                    }else if(v.id == '11'){//住宿费
                        if(calculateResultVO.accommodationFee){
                            v.isClaimWarning = true;
                            v.warningText = cityStr+calculateResultVO.accommodationFee+"元/天";
                        }else{
                            v.isClaimWarning = undefined;
                            v.warningText = undefined;
                        }
                    }else if(v.id == '14'){//被抚养人生活费
                        if($scope.adjust.household == '1'){
                            if(calculateResultVO.ruralAverageOutlay){
                                v.isClaimWarning = true;
                                v.warningText = cityStr+calculateResultVO.ruralAverageOutlay+"元/年";
                            }else{
                                v.isClaimWarning = undefined;
                                v.warningText = undefined;
                            }
                        }else{
                            if(calculateResultVO.urbanAverageOutlay){
                                v.isClaimWarning = true;
                                v.warningText = cityStr+calculateResultVO.urbanAverageOutlay+"元/年";
                            }else{
                                v.isClaimWarning = undefined;
                                v.warningText = undefined;
                            }
                        }
                    }else if (v.id == "12" || v.id == "15") {
                        //农村或者城镇赔偿标准
                        var ruleMoney = $scope.adjust.compensateStandard[$scope.adjust.household];
                        if( ruleMoney && parseFloat(ruleMoney.income) > 0){
                            //显示标准
                            v.isClaimWarning = true;
                            v.warningText = cityStr+ruleMoney.income+"元/年";
                            //申请金额
                            if((!flag && (!v.applyPerUnit || parseFloat(v.applyPerUnit) <= 0)) || flag){
                                v.applyPerUnit = ruleMoney.income;
                                v.applyAmount = v.applyPerUnit * v.applyUnit * $scope.adjust.compensateRate / 100;
                            }
                            //调解金额
                            if((!flag && (!v.claimPerUnit || parseFloat(v.claimPerUnit) <= 0)) ||  flag){
                                v.claimPerUnit = ruleMoney.income;
                                v.claimAmount = v.claimPerUnit * v.claimUnit * $scope.adjust.compensateRate / 100;
                            }
                        }else{
                            v.isClaimWarning = undefined;
                            v.warningText = undefined;
                        }
                    }else if(v.id == '16'){//丧葬费
                        if(calculateResultVO.funeralFeeStandard){
                            v.isClaimWarning = true;
                            v.warningText = cityStr+parseFloat(calculateResultVO.funeralFeeStandard/12).toFixed(2)*1+"元/月";
                        }else{
                            v.isClaimWarning = undefined;
                            v.warningText = undefined;
                        }
                    }else if (v.id == '17'){//精神抚慰金
                        if(calculateResultVO.spiritualConsolationFee){
                            v.isClaimWarning = true;
                            v.warningText = cityStr+parseFloat(calculateResultVO.spiritualConsolationFee).toFixed(2)*1+"元";
                        }else{
                            v.isClaimWarning = undefined;
                            v.warningText = undefined;
                        }
                    }
                });
                //查询备注
                queryMtRegionalNameRemark();
            }else{
                //请求失败
              $rootScope.toaster("error", "错误", result.message);
            }
        });
    }
    //计算预填残疾赔偿金与死亡赔偿金的年限 [定残死亡日期与出生日期的关系]
    //（1）定残日期—出生时间<=60，赔偿年限自动填充20年
    //（2）60<定残日期—出生时。间<=75，赔偿年限填充：20—（定残日期—出生时间—60）
    //（3） 定残日期—出生时间>75，赔偿年限填充5年
    $scope.computePayYear = function(){
        //取第一个申请人的出生日期
        var applicant = $scope.adjust.applicantArray.filter(function(v){
            return v.personType==0
        });
        if($scope.adjust.deathDate && applicant[0].birthDay){
            //死亡赔偿金和伤残赔偿金赔偿年限
            var payYear = getDateYearSub($scope.adjust.deathDate, applicant[0].birthDay);
            //循环计算器详细表
            $scope.adjust.feeDetail.forEach(function(v) {
                if (v.id == "12" || v.id == "15"){
                    v.applyUnit = v.claimUnit = payYear;
                }
            });
        }
    };
    //计算两个日期的年限差
    function getDateYearSub(deathDate, birthDate) {
        //得到前一天(算头不算尾) ,获得各自的年、月、日
        var deathYear  = (new Date(deathDate.getTime() - 24 * 60 * 60 *1000)).getFullYear();
        var birthYear  = birthDate.getFullYear();
        var betweenYear = deathYear - birthYear;
        var payYear = 0;
        if(betweenYear > 0 && betweenYear <= 60 ){
            payYear = 20;
        }else if(betweenYear > 60 && betweenYear <= 75){
            payYear = 20-(betweenYear - 60);
        }else if(betweenYear > 75){
            payYear = 5;
        }
        return payYear;
    }

    //增加人方法
    $scope.addPerson = function(){
        var array = $scope.adjust.applicantArray.filter(function(e){
            var temp = e.responsibleRate ? e.responsibleRate == -1 : e.responsibleRate == 0 ? false : true;
            //return e.personType == 1 && (e.idType == '0' || e.idType == '2' || (e.idType == '1' && e.enterpriseType != '1')) && temp;
            //return e.personType == 1 && (e.idType == '0' || e.idType == '2' || e.idType == '1') && temp;
            //根据标识，过滤责任人选项
            switch ($scope.dutySelectedType) {
                case '0':
                return e.personType == 1 && (e.idType == '0' || e.idType == '2' || e.idType == '1') && temp;
                break;
                case '1':
                return e.personType == 1 && (e.idType == '0' || e.idType == '2' || (e.idType == '1' && e.enterpriseType != '1')) && temp;
                break;
                case '2':
                return e.idType == '1' && temp && e.enterpriseType == '1';
                break;
            }
        });
        if(!array || array.length == 0){
          $rootScope.toaster("warn", "警告", "责任承担被申请人已全部被选择!");
        }
    };

    $scope.riskTypes = [{
        id: "0",
        value: "交强险"
    }, {
        id: "1",
        value: "三者险"
    }, {
        id: "2",
        value: "不计免赔"
    }];

    $scope.addRespondentFilter = function(e) {
        var temp = e.responsibleRate ? e.responsibleRate == -1 : e.responsibleRate == 0 ? false : true;
        //return e.personType == 1 && (e.idType == '0' || e.idType == '2' || (e.idType == '1' && e.enterpriseType != '1')) && temp;
        //根据标识，过滤责任人选项
        switch ($scope.dutySelectedType) {
            case '0':
            return e.personType == 1 && (e.idType == '0' || e.idType == '2' || e.idType == '1') && temp;
            break;
            case '1':
            return e.personType == 1 && (e.idType == '0' || e.idType == '2' || (e.idType == '1' && e.enterpriseType != '1')) && temp;
            break;
            case '2':
            return e.idType == '1' && temp && e.enterpriseType == '1';
            break;
        }
    };

    $scope.showRespondentFilter = function(e) {  //在申请人与被申请人中找出被申请人
        var temp = e.responsibleRate ? e.responsibleRate != -1 : e.responsibleRate == 0 ? true : false;
        //return e.personType == 1 && (e.idType == '0' || e.idType == '2' || (e.idType == '1' && e.enterpriseType != '1')) && temp;
        return e.personType == 1 && (e.idType == '0' || e.idType == '2' || e.idType == '1') && temp;
    };

    //获取已被选择的责任人
    $scope.dutySelectedType = '0'; //增加的责任人类型  '0'-未选择  '1'-人员  '2'-保险公司
    if($scope.adjust.applicantArray.length > 0) {
      getSelectedApplicant();
    }
    $scope.$on('queryAdjust', function () { //首次进入或页面刷新时执行
      getSelectedApplicant();
    });
    function getSelectedApplicant() {
      _.each($scope.adjust.applicantArray, function(obj, i) {
        if($scope.showRespondentFilter(obj)) {
          if(obj.idType == '1' && obj.enterpriseType == '1') {
            $scope.dutySelectedType = '2';
          } else {
            $scope.dutySelectedType = '1';
          }
        }
      });
    }

    $scope.addRespondent = function(applicant) {
        applicant.responsibleRate = 0;  //重置责任比
        applicant.absDeductible = 0;  //重置免赔率
        applicant.isVehicle = applicant.plateNo ? "1" : "0";
        applicant.riskTypes = {
            //"0": applicant.plateNo?true:false,
            "0": false,
            "1": $scope.claiminfoInfoNew.sumBusiness > 0 ? true:false,
            "2": false
        };
        //商业险保额
        applicant.thirdParty = $scope.claiminfoInfoNew.sumBusiness;
        //不计免赔率
        applicant.thirdPartyFranchise = $scope.claiminfoInfoNew.franchise;
        //免赔率
        if(!applicant.thirdPartyFranchise){
            applicant.thirdPartyFranchise = 30;
            applicant.thirdPartyRate = 70;
        }

        //判断选择的是保险公司还是人员
        if(applicant.idType == '1' && applicant.enterpriseType == '1') {
            //保险公司
            $scope.dutySelectedType = '2';
        } else {
            //保险公司
            $scope.dutySelectedType = '1';
        }
    };
    $scope.deleteRespondent = function(respondent) {
        respondent.responsibleRate = -1;
        respondent.riskTypes = undefined;

        var num = 0;
        //选出被申请人
        var arr = $scope.adjust.applicantArray.filter(function (e) {
          return e.personType == 1 && (e.idType == '0' || e.idType == '2' || e.idType == '1');
        })
        //获取剩余的责任承担人数量
        _.each(arr, function (applicant) {
            if(applicant.responsibleRate != undefined && applicant.responsibleRate != -1) {
                num++
            }
        });
        //当人数为零时，重置过滤标识
        if(num == 0) {
            $scope.dutySelectedType = '0';
        }
    };

    $scope.riskTypeChanged = function(respondent, riskType) {
        if (riskType == "0") {
            if (!respondent.riskTypes['0']){
                respondent.riskTypes['1'] = false;
            }else{
                if(!respondent.insuranceForceCompany){
                    respondent.insuranceForceCompany = ($filter('respondents2Company')($scope.adjust.applicantArray))[0]
                }
            }

        } else if (riskType == "1") {
            if (!respondent.riskTypes['1']){
                respondent.riskTypes['2'] = false;
                respondent.absDeductible = 0;
            }
            else{
                $scope.changeAbsDeductible(respondent);

            }
        }else {
            if (respondent.riskTypes['2']) {
                //respondent.riskTypes['0'] = respondent.riskTypes['1'] = true;
                respondent.riskTypes['1'] = true;
                respondent.thirdPartyFranchise = 0;
                respondent.thirdPartyRate = 100;
            }else{
                respondent.thirdPartyFranchise = 30;
                respondent.thirdPartyRate = 70;
            }
        }
    };

    $scope.compensateRateChanged = function(adjust) {
        if (adjust.compensateRate > 100) adjust.compensateRate = 100;
        if (adjust.compensateRate < 0) {
            adjust.compensateRate = 0;
        }
        handleDeathAndDisability();
    };

    function handleDeathAndDisability(){
        if($scope.adjust.feeDetail){
            $scope.adjust.feeDetail.forEach(function(val) {
                //残疾赔偿金和死亡赔偿金
                if (val.id == "12" || val.id == "15"){
                    if(val.applyUnit && val.applyPerUnit){
                        val.applyAmount = parseFloat(val.applyUnit) * parseFloat(val.applyPerUnit) * parseFloat($scope.adjust.compensateRate) / 100;
                        val.applyAmount = val.applyAmount.toFixed(2)*1;
                    }
                    if(val.claimUnit && val.claimPerUnit){
                        val.claimAmount = parseFloat(val.claimUnit) * parseFloat(val.claimPerUnit) * parseFloat($scope.adjust.compensateRate) / 100;
                        val.claimAmount = val.claimAmount.toFixed(2)*1;
                    }
                }
            });
        }
    }

    $scope.responsibleRateChanged = function(respondent) {
        if (respondent.responsibleRate > 100) respondent.responsibleRate = 100;
        if (respondent.responsibleRate < 0) respondent.responsibleRate = 0;

        //将责任人填入对象，在保存时验证责任比率
        $scope.dutyRatio[respondent.personName] = respondent.responsibleRate;
        var firstPerson = _.find($scope.adjust.applicantArray, function(obj) {
            return obj.responsibleRate
        });
        if(firstPerson){
            $scope.dutyRatio[firstPerson.personName] = firstPerson.responsibleRate;
        }
    };


    //改变绝对免赔率触发的请求
    $scope.changeAbsDeductible = function(respondent){

        var flag = false;
        if(respondent.absDeductibleList){
            respondent.absDeductibleList.forEach(function(val){
               if(val.selected){
                   flag = true;
               }
            });
        }
        if(flag){
            respondent.absDeductible = 10;
        }else{
            respondent.absDeductible = 0;
        }
    }

    //绝对免赔率
    $scope.absDeductibleChanged = function (respondent) {
        if (respondent.absDeductible > 100) respondent.absDeductible = 100;
        if (respondent.absDeductible < 0) respondent.absDeductible = 0;

        $scope.co.calculate();
    };

    $scope.thirdPartyChanged = function(respondent){
        if (parseFloat(respondent.thirdParty) < 0) respondent.thirdParty = 0;
    };

    $scope.thirdPartyFranchiseChanged = function(respondent) {
        if (respondent.thirdPartyFranchise > 100) respondent.thirdPartyFranchise = 100;
        if (respondent.thirdPartyFranchise < 0) respondent.thirdPartyFranchise = 0;
        if (respondent.thirdPartyFranchise <= 100 && respondent.thirdPartyFranchise >= 0)
            respondent.thirdPartyRate = 100 - respondent.thirdPartyFranchise;
        $scope.co.calculate();
    };

    $scope.thirdPartyRateChanged = function(respondent) {
        if (respondent.thirdPartyRate > 100) respondent.thirdPartyRate = 100;
        if (respondent.thirdPartyRate < 0) respondent.thirdPartyRate = 0;
        if (respondent.thirdPartyRate <= 100 && respondent.thirdPartyRate >= 0)
            respondent.thirdPartyFranchise = 100 - respondent.thirdPartyRate;
    };

    var calculateTimeout;

    $scope.feeCheckChanged = function(fee, id) {
        if (fee.isChecked) {
            if (!$scope.adjust.regionName) {
                $rootScope.toaster("error", "错误", "请选择赔偿地!");
                fee.isChecked = false;
                return;
            }
            if (!$scope.adjust.standardYear) {
                $rootScope.toaster("error", "错误", "请选择赔偿年度!");
                fee.isChecked = false;
                return;
            }
        }
        if (["12", "13", "14", "15", "16"].indexOf(id) != -1 && fee.isChecked) {
            if (!$scope.adjust.deathDate) {
                $rootScope.toaster("error", "错误", "请输入定残/死亡日期!");
                fee.isChecked = false;
                return;
            }
            if (!$scope.adjust.compensateRate || $scope.adjust.compensateRate ==0) {
                $rootScope.toaster("error", "错误", "请输入伤残赔偿系数!");
                fee.isChecked = false;
                return;
            }
            if (id == "12" || id == "13"){
                if(!fee.compensateRate) fee.compensateRate = $scope.adjust.compensateRate;
                $scope.adjust.feeDetail.forEach(function(v) {
                    if (v.id == "15" || v.id == "16") v.isChecked = false;

                });
            } else if (id == "15" || id == "16") {
                $scope.adjust.feeDetail.forEach(function(v) {
                    if (v.id == "12" || v.id == "13") v.isChecked = false;
                });
            }
        }
        //如果选择的是包干费用
        if(id == "90" ){
            $scope.adjust.feeDetail.forEach(function(val){
                if(val.id != "90"){
                    if(fee.isChecked){
                        val.isChecked  = !fee.isChecked;
                    }
                    val.disabled = fee.isChecked;
                }
            });
        }

        $scope.refreshTotal();
    };

    $scope.refreshTotal = function(compute,isApply) {
        $scope.adjust.applyTotal = 0.00;
        $scope.adjust.lawMoney = 0.00;
        var checkedList = $scope.adjust.feeDetail.filter(function(v) {
            return v.isChecked;
        });
        checkedList.forEach(function(v) {
            //残疾赔偿金或者死亡赔偿金
            if(v.id == "12" || v.id == "15"){

                if(v.id == "15"){
                    if(v.applyPerUnit && v.applyUnit  && $scope.adjust.compensateRate && ((compute && !isApply) || !compute )){
                        v.applyAmount = v.applyPerUnit * v.applyUnit ;
                    }
                    if(v.claimPerUnit && v.claimUnit && $scope.adjust.compensateRate && ((compute && isApply) || !compute )){
                        v.claimAmount = v.claimPerUnit * v.claimUnit ;
                    }
                }else{
                    if(v.applyPerUnit && v.applyUnit  && $scope.adjust.compensateRate && ((compute && !isApply) || !compute )){
                        v.applyAmount = v.applyPerUnit * v.applyUnit * $scope.adjust.compensateRate / 100;
                    }
                    if(v.claimPerUnit && v.claimUnit && v.compensateRate && ((compute && isApply) || !compute )){
                        v.claimAmount = v.claimPerUnit * v.claimUnit * v.compensateRate / 100;
                    }
                }


            }
            if (v.applyAmount && parseFloat(v.applyAmount))
                $scope.adjust.applyTotal += parseFloat(v.applyAmount);
            if (v.claimAmount  && parseFloat(v.claimAmount))
                $scope.adjust.lawMoney += parseFloat(v.claimAmount);
            if (v.claimNonMed && parseFloat(v.claimNonMed)){//计算非医保金额
                $scope.adjust.lawMoney += parseFloat(v.claimNonMed);
            }
            if(v.extraAmount && parseFloat(v.extraAmount)) {//计算保险外金额
                $scope.adjust.lawMoney += parseFloat(v.extraAmount);
            }
        });

        $scope.adjust.applyTotal = $scope.adjust.applyTotal.toFixed(2)*1;
        $scope.adjust.lawMoney = $scope.adjust.lawMoney.toFixed(2)*1;


        if($scope.co.isAdjust){
            $scope.adjust.willPayTotal = $scope.adjust.lawMoney - $scope.adjust.paidTotal;
        }else{
            $scope.adjust.willPayTotal = $scope.adjust.applyTotal - $scope.adjust.paidTotal;
        }

        if(calculateTimeout){
            $timeout.cancel(calculateTimeout);
        }

        calculateTimeout = $timeout(function () {
            $scope.co.calculate();
        }, 1000);
    };

    $scope.computeChange = function(fee, isForward,isApply) { //isForward代表正算反算 isApply代表是不是申请金额

        //isForward true 乘法 false：除法
        if (isForward) {
            if(fee.template=='3' && (!$scope.adjust.compensateRate || $scope.adjust.compensateRate == 0)){
              $rootScope.toaster("error", "错误", "请认真填写伤残系数!");
                return false;
            }
            //申请金额
            if (fee.applyPerUnit && fee.applyUnit &&　!isApply) {
                fee.applyAmount = fee.applyUnit * fee.applyPerUnit;
                //例如 残疾赔偿金得乘以系数
                if (fee.template == "3"){
                    fee.applyAmount *= ($scope.adjust.compensateRate / 100);
                }
                fee.applyAmount = parseFloat(fee.applyAmount).toFixed(2)*1;
            }
            //调解金额
            if (fee.claimPerUnit && fee.claimUnit &&　isApply) {
                fee.claimAmount = fee.claimUnit * fee.claimPerUnit;
                if (fee.template == "3"){
                    fee.claimAmount *= ($scope.adjust.compensateRate / 100);
                }
                fee.claimAmount = parseFloat(fee.claimAmount).toFixed(2)*1;
            }
            //刷新计算
            $scope.refreshTotal(true,isApply);
        }else{
            //计算器除法（申请金额）
            if (fee.applyUnit && fee.applyAmount &&　!isApply) {
                if(fee.applyUnit != 0){
                    //残疾赔偿金
                    if(fee.id == "12"){
                        fee.applyPerUnit = (fee.applyAmount / fee.applyUnit /$scope.adjust.compensateRate* 100).toFixed(2)*1;
                    }else{
                        fee.applyPerUnit = (fee.applyAmount / fee.applyUnit).toFixed(2)*1;
                    }
                }else{
                    fee.applyPerUnit = 0;
                }
            }else{
                if(!fee.applyPerUnit)fee.applyPerUnit = 0;
                if(!fee.applyUnit)fee.applyUnit = 0;
            }
            //计算器除法（调解金额）
            if (fee.claimUnit && fee.claimAmount &&　isApply) {
                if(fee.claimUnit != 0){
                    //残疾赔偿金
                    if(fee.id == "12"){
                        fee.claimPerUnit = (fee.claimAmount / fee.claimUnit /$scope.adjust.compensateRate* 100).toFixed(2)*1;
                    }else{
                        fee.claimPerUnit = (fee.claimAmount / fee.claimUnit).toFixed(2)*1;
                    }
                }else{
                    fee.claimPerUnit = "";
                }
            }else{
                if(!fee.claimUnit)fee.claimUnit = 0;
                if(!fee.claimPerUnit)fee.claimPerUnit = 0;
            }

            // $scope.refreshTotal();
        }

        //perFlag 单项金额标记
        function showOrHideWarning(id, feeAmount) {
            if (fee.id == id && fee.isChecked && feeAmount) {
                if(id == '17'){
                    if (fee.claimAmount && fee.claimAmount > feeAmount) {
                        fee.isClaimWarningFlag = true;
                    } else {
                        fee.isClaimWarningFlag = undefined;
                    }
                }else{
                    if (fee.claimPerUnit > feeAmount) {
                        fee.isClaimWarningFlag = true;
                    } else {
                        fee.isClaimWarningFlag = undefined;
                    }
                }
            } else if (fee.id == id && !fee.isChecked) {
                fee.isClaimWarningFlag = undefined;
            }else if(fee.id == id && fee.isChecked && !feeAmount){
                fee.isClaimWarningFlag = undefined;
            }
        }
        //住院伙食补助费超过标准
        showOrHideWarning("06", $scope.adjust.compensateStandard.hospitalFoodSubsidies);
        //营养费超过标准
        showOrHideWarning("07", $scope.adjust.compensateStandard.thesePayments);
        //误工费超过标准
        //showOrHideWarning("08", $scope.adjust.compensateStandard.lostIncome,false);
        //护理费超过标准
        //showOrHideWarning("09", $scope.adjust.compensateStandard.standardNurseFee,false);
        //住宿费超过标准
        showOrHideWarning("11", $scope.adjust.compensateStandard.accommodationFee);
        //残疾赔偿金超过标准
        showOrHideWarning("12", $scope.adjust.compensateStandard[$scope.adjust.household].income);
        //死亡赔偿金超过标准
        showOrHideWarning("15", $scope.adjust.compensateStandard[$scope.adjust.household].income);
        //丧葬费超过标准
        showOrHideWarning("16", $scope.adjust.compensateStandard.funeralFeeStandard/12);
        //精神抚慰金超过标准
        showOrHideWarning("17", $scope.adjust.compensateStandard.spiritualConsolationFee);
    };

    $scope.adjustResultChanged = function(x) {
        var zjFlag = false;
        var sysOrgZj = LoginService.user.sysUser.userDepartList[LoginService.user.sysUser.currentOrg].extPro;
        var sysOrgZjJson = JSON.parse(sysOrgZj);
        if(sysOrgZjJson && sysOrgZjJson.regionName && sysOrgZjJson.regionName.indexOf("浙江") >-1){
            zjFlag = true;
        }
        //申请人拼接
        var applicants = $scope.adjust.applicantArray.filter(function(v) {
            return v.personType == 0 && v.isDeath != '1';
        }).map(function(v) {
            if (v.idType == 0) return v.personName;
            if (v.idType != 0) return v.orgName;
        }).join('、');
        //被申请人拼接
        var responses = $scope.adjust.applicantArray.filter(function(v) {
            return v.personType == 1 && v.idType == 0 ;
        }).map(function(v) {
            return v.personName;
        }).join('、');
       /* //费用集合拼接
        var feeDetail = $scope.adjust.feeDetail.filter(function(v) {
            return v.isChecked
        });*/
        var feeDetailList = [];
        if($scope.adjust.feeDetail){
          $scope.adjust.feeDetail.forEach(function(val){
              if(val.isChecked){
                  if(val.id == '60' || val.id == '18' || val.id == '71' ){
                    if(val.selectShow){
                        feeDetailList.push(val);
                    }
                  }else{
                      feeDetailList.push(val);
                  }
              }
          })
        };
        var feeDetail = feeDetailList.map(function(v) {
            return v.value;
        }).join('、');
        var payDate = "";
        if ($scope.adjust.payDate) {
            payDate = "于" + $filter('date')($scope.adjust.payDate, 'yyyy年MM月dd日') + "前付清。"
        } else {
            payDate = "当场付清。"
        }
        var applicantCurrent = $scope.adjust.applicantArray.filter(function(val){
            return val.personType == '1';
        });

        //第一套模板
        var template = "由申请人{{name}}";
        if(applicantCurrent[0].isVehicle == '1'){
            template += "在保险责任范围内";
        }
        template += "按责赔偿申请人" + applicants + "本次交通事故造成的损失" + feeDetail + "合计{{amount}}元，{{payMoneyStr}}" + payDate;
        //第二套模板
        var templateNew = "由申请人{{name}}赔偿申请人" + applicants + "本次交通事故造成的损失合计{{amount}}元，{{payMoneyStr}}" + payDate;
        //第三套模板

        $log.info($scope.adjust);
        var pjStr0 = "诉讼请求";
        var pjStr1 = "再无纠葛";
        if($scope.adjust.adjustOrgName.indexOf("蓬江") >= 0){
            pjStr0 = "赔偿请求权利";
            pjStr1 = "互不追究任何责任";
        }
        var str = "申请人" + applicants + "自愿放弃其他"+pjStr0+"，就本次交通事故赔偿事宜一次性处理结案，今后双方"+pjStr1+"。";
        //南京模式模板
        var templateNj = "由申请人"+responses+"按责赔偿申请人" + applicants + "本次交通事故造成的损失" + feeDetail + "合计{{amount|formatMoney}}元，{{payMoneyStr}}" + payDate;
        //南京新增模板
        var templateNjNew = "上述赔偿款由申请人"+responses+"支付完毕后自行向{{name}}理赔。";




        if (x.id == 2) $scope.adjust.adjustResultRemark = "未达成调解";
        else if (x.id == 3) $scope.adjust.adjustResultRemark = "未达成调解，当事双方同意线下开庭";
        else if (x.id == 0 || x.id == 1 || x.id == 4) {
            var companies = _.groupBy($scope.adjust.compensateTable, 'companyName');
            var arr = [];
            var jqCompany = "";
            var companyIndex = 0;
            for (var i in companies) {
                if (i != "undefined") {
                    var company = companies[i];
                    var amount = company.reduce(function(sum, item) {return sum + parseFloat(item.calcIndemnitySum)}, 0);
                    var payMoneyObject = _.find($scope.adjust.applicantArray,{orgName:company[0].companyName});
                    var payMoney;
                    if(payMoneyObject){
                        payMoney = payMoneyObject.payMoney;
                    }

                    if(companyIndex == 0){
                        jqCompany = company[0].companyName
                    }
                    companyIndex ++;
                    var payMoneyStr = "";
                    if(payMoney){
                        if(parseFloat(payMoney) < parseFloat(amount)){
                            //表示保险公司所有费用都承担
                            if($scope.adjust.compensateTable.length == companies[i].length){
                                var payMoneyObject = _.find($scope.adjust.applicantArray,{idType:'0',personType:'1'});


                                payMoneyStr = "扣除已支付的"+payMoneyObject.payMoney+"元，尚余"+(amount-payMoneyObject.payMoney).toFixed(2)*1+"元，";
                            }else{
                                payMoneyStr = "扣除已支付的"+payMoney+"元，尚余"+(amount-payMoney).toFixed(2)*1+"元，";
                            }

                        }
                    }
                    arr.push({
                        name: i,
                        amount: amount? amount.toFixed(2)*1:0,
                        payMoneyStr:payMoneyStr,
                        payFlag:true
                    });
                } else delete companies[i];
            }

            //南京模式 如果只有保险公司承担时采取新的模式 判断依据为payType== 3 的个数大于2时走特殊情况
            var newModelFlag = 0;
            if($scope.adjust.compensateTable){
                $scope.adjust.compensateTable.forEach(function(v) {
                    if(v.payType== 3){
                        newModelFlag ++;
                    }
                    //personType :1  被申请人
                    if (v.personType == 1) {
                        var payMoneyObject = _.find($scope.adjust.applicantArray,{personName: v.personName});
                        var payMoney;
                        if(payMoneyObject){
                            payMoney = payMoneyObject.payMoney;
                        }
                        var payMoneyStr = "";
                        if(payMoney){
                            if(parseFloat(payMoney) < parseFloat(v.calcIndemnitySum)){
                                payMoneyStr = "扣除申请人"+v.personName+"已垫付的"+payMoney+"元，尚余"+(v.calcIndemnitySum-payMoney).toFixed(2)*1+"元，";
                            }else if(parseFloat(payMoney) > parseFloat(v.calcIndemnitySum)){
                                payMoneyStr = "扣除申请人"+v.personName+"已垫付的"+payMoney+"元，申请人"+jqCompany+"在保险责任范围内按责返还申请人"+ v.personName+(payMoney-v.calcIndemnitySum).toFixed(2)*1+"元，此费用从申请人"+applicants+"交通事故赔偿中扣除。";
                            }
                        }
                        arr.push({
                            "name": v.personName,
                            "amount": v.calcIndemnitySum,
                            "payMoneyStr":payMoneyStr
                        });
                    }
                });
            }


            //如果保险公司在保险中已经赔付，当事人仍然垫付的 或者保险公司也赔付不够，不存在此人赔付仍然赔付的
            $scope.adjust.applicantArray.forEach(function(v) {
                if (v.personType == 1 && v.idType == 0) {
                    var obj = _.find($scope.adjust.compensateTable,{personName: v.personName});
                    var payMoneyStr = "";
                    if(v.payMoney && !obj){
                        payMoneyStr = "由申请人"+jqCompany+"在保险责任范围内按责返还申请人"+v.personName+"垫付的费用合计"+ v.payMoney+"元，"+"此费用从申请人"+applicants+"交通事故赔偿中扣除。"+payDate;
                        arr.push({
                            "name": v.personName,
                            "amount": v.calcIndemnitySum,
                            "payMoneyStr":payMoneyStr,
                            "flag":true
                        });
                    }
                }
            });

            //获取赔偿数据 payType:1 交强险 2：商业险 3：个人  personType:1 为被告
            $scope.adjust.adjustResultRemark = "";
            var chinaArray = [ "一", "二", "三", "四", "五", "六", "七", "八", "九"];
            if((newModelFlag >=2 || newModelFlag == 1) || $scope.adjust.payDate){
                arr.forEach(function(v,index) {
                    //表明是保险公司企业 v.payFlag = true
                    if(v.payFlag){
                        $scope.adjust.adjustResultRemark += chinaArray[index]+"、"+$interpolate(template)(v) + "\r\n";
                    }else{
                        //表示是个人person //如果保险公司在保险中已经赔付，当事人仍然垫付的 或者保险公司也赔付不够，不存在此人赔付仍然赔付的
                        if(v.flag){
                            $scope.adjust.adjustResultRemark += chinaArray[index]+"、"+ v.payMoneyStr + "\r\n";
                        }else{
                            $scope.adjust.adjustResultRemark += chinaArray[index]+"、"+$interpolate(templateNew)(v) + "\r\n";
                        }
                    }
                });
                $scope.adjust.adjustResultRemark += chinaArray[arr.length]+"、"+str;
            }else{
                arr.forEach(function(v,index) {
                    //表明是保险公司企业 v.payFlag = true
                    if(v.payFlag){
                        $scope.adjust.adjustResultRemark += "一、"+$interpolate(templateNj)(v) + "\r\n";
                        $scope.adjust.adjustResultRemark += "二、"+$interpolate(templateNjNew)(v) + "\r\n";
                        $scope.adjust.adjustResultRemark += "三、"+str;
                    }
                });
            }


            if(zjFlag && $scope.adjust.adjustResultRemark){
                $scope.adjust.adjustResultRemark = $scope.adjust.adjustResultRemark.replace(new RegExp("申请人","gm"),"当事人");
            }
        }
    };

    //计算调解赔偿信息
    $scope.co.calculate = function(isHandle) {
        $scope.co.isRiskTypes = true;
        //当只选择保险公司时，提示选择投保险种
        //选出被申请人
        var arr = $scope.adjust.applicantArray.filter(function (e) {
          //根据标识，过滤责任人选项
          switch ($scope.dutySelectedType) {
            case '0':
              return e.personType == 1 && (e.idType == '0' || e.idType == '2' || e.idType == '1');
              break;
            case '1':
              return e.personType == 1 && (e.idType == '0' || e.idType == '2' || (e.idType == '1' && e.enterpriseType != '1'));
              break;
            case '2':
              return e.idType == '1' && e.enterpriseType == '1';
              break;
          }
        });

        //获取保险公司的数量
        for(var i = 0; i < arr.length; i++) {
          var applicant = arr[i];
          if(applicant.idType == '1' && applicant.enterpriseType == '1' && ((applicant.responsibleRate || applicant.responsibleRate == '0') &&　applicant.responsibleRate != '-1')) {
            if(applicant.riskTypes) {
              var num = 0; //存储被选中的个数
              for(var k in applicant.riskTypes) {
                if(applicant.riskTypes[k]) num++;
              }
              if(num == 0) {
                $rootScope.toaster("error", "错误", "请选择投保险种");
                $scope.co.isRiskTypes = false;
                return;
              }
            } else{
              $rootScope.toaster("error", "错误", "请选择投保险种");
              $scope.co.isRiskTypes = false;
              return;
            }
          }
        }

        //判断责任比
        //重置责任比例对象
        $scope.dutyRatio = {};
        //将每个责任人比率存入对象
        _.each($scope.adjust.applicantArray, function(obj, i) {
            if($scope.showRespondentFilter(obj) && obj.responsibleRate) {
                if(obj.personName) $scope.dutyRatio[obj.personName+i] = obj.responsibleRate;
                else $scope.dutyRatio[obj.orgName+i] = obj.responsibleRate;
            }
        });
        var total = 0;
        _.each($scope.dutyRatio, function (v,k) {
            total = total + parseInt(v);
        })
        if(total > 100) {
          $rootScope.toaster("error", "错误", "责任比例之和不可大于100%");
          return;
        }

        //当是手动点击计算按钮时，遍历费用项，检索数据是否修改
        if(isHandle) {
            $scope.adjust.feeDetail.forEach(function (v) {
                if(v.isChecked) {
                    if(v.extraAmount) {
                        v.extraAmount = 0;
                    }
                    _.each(v.respondentList, function (k) {
                        if(_.find($scope.adjust.applicantArray, {personName: k.personName})) {
                            if(k.extraMoney) v.extraAmount += parseInt(k.extraMoney);
                        }
                    })
                }
            });
            $scope.refreshTotal();
        }

        if (!$scope.adjust.compensateTable) $scope.adjust.compensateTable = [];
        if ($scope.adjust.compensateTable.length)
            $scope.adjust.compensateTable.splice(0, $scope.adjust.compensateTable.length);
        dryInCalculate();
    };




    //没有包干费用的的计算方法
    function dryInCalculate(){


        var dryFlag = false;
        for(var i = 0 ; i < $scope.adjust.feeDetail.length; i ++){
            if($scope.adjust.feeDetail[i].id == "90" && $scope.adjust.feeDetail[i].isChecked) {
                dryFlag = true;
            }
        }
        var medicalLimits = 0;
        var deathLimits = 0;
        var propertyLimits = 0;
        // 一、计算侵权方交强险总保额
        var respondents = $scope.adjust.applicantArray.filter(function(e) {
            //idType:被告身份类型 0：公民 1： 法人  2：其他组织   enterpriseType：1表示保险公司  ? 为法人其它公司为什么没有
            // return e.personType == 1 && (e.idType == '0' || e.idType == '2' || (e.idType == '1' && e.enterpriseType != '1')) && e.riskTypes;
            return e.personType == 1 && (e.idType == '0' || e.idType == '2' || e.idType == '1') && e.riskTypes;
        });
        if (!respondents.length) {
            $rootScope.toaster("error", "错误", "请选择责任人!");
            return;
        }
        if(!$scope.adjust.feeDetail){
            $rootScope.toaster("error", "错误", "请填写具体损失金额!");
            return;
        }
        for(var i = 0; i<respondents.length; i++){
            var v = respondents[i];

            if (v.isVehicle == "1") {
                if(!v.plateNo){
                    $rootScope.toaster("error", "错误", "请填写责任人车牌号!");
                    return;
                }
                if(!v.insuranceForceCompany && v.riskTypes['0'] ){
                    $rootScope.toaster("error", "错误", "请选择责任人交强险投保保险公司!");
                    return;
                }
                if((v.riskTypes['1'] || v.riskTypes['2']) && !v.insuranceBusinessCompany){
                    $rootScope.toaster("error", "错误", "请选择责任人商业险投保保险公司!");
                    return;
                }
                v.responsibleRate = v.responsibleRate ? parseInt(v.responsibleRate) : 0;
                v.thirdParty = v.thirdParty ? parseInt(v.thirdParty) : 0;
                v.thirdPartyRate = v.thirdPartyRate ? parseInt(v.thirdPartyRate) : 0;
                //责任比例
                if (v.responsibleRate == 0) {
                    v.medical = 1000;
                    v.death = 11000;
                    v.property = 100;
                } else {
                    v.medical = 10000;
                    v.death = 110000;
                    v.property = 2000;
                }

                medicalLimits += v.medical;
                deathLimits += v.death;
                propertyLimits += v.property;
            }
        };

        //计算器总金额
        var amount = 0.00;
        //计算器医疗费总金额
        var medicalAmount = 0.00;
        //计算器财产损失总金额
        var propertyAmount = 0.00;
        //计算器死亡伤残总金额
        var deathAmount = 0.00;
        //保险公司全部承担的费用(停车费、鉴定费、其它费用)
        var bxSumAmount = 0.00;
        //非保险公司承担的费用(停车费、鉴定费、其它费用)
        var noBxSumAmount = 0.00;
        //计算器精神损害抚慰金金额
        var spiritAmount = 0.00;
        //欠账的精神抚慰金总和
        var leftSpiritAmount = 0.00;

        //将申请以及调解总费用保留两位小数
        $scope.adjust.feeDetail.forEach(function(v) {
            if (v.isChecked) {
                if($scope.co.isAdjust){
                    //claimAmount 调解总金额，claimNonMed：非医保金额
                    if (v.claimAmount)
                        v.claimAmount = parseFloat(v.claimAmount);
                }else{
                    //applyAmount：申请总金额 applyNonMed：非医保金额
                    if (v.applyAmount)
                        v.applyAmount = parseFloat(v.applyAmount);
                }
            }
        });

        //计算计算器中各项费用的总计
        $scope.adjust.feeDetail.forEach(function(v) {
            if (v.isChecked) {
                if($scope.co.isAdjust){
                    //1、累加总损失 claimAmount 调解总金额
                    if(v.claimAmount) amount += parseFloat(v.claimAmount);
                    //2、累加医疗损失   医疗费、后续治疗费、住院伙食补助费、营养费
                    if (["03", "04", "06", "07"].indexOf(v.id) != -1) {
                        if(v.claimAmount) medicalAmount += parseFloat(v.claimAmount);
                    } else if (["30", "40", "50", "70"].indexOf(v.id) != -1) {
                        //3、累加财产损失  财产损失、车辆损失、拖车费、施救费
                        if(v.claimAmount) propertyAmount += parseFloat(v.claimAmount);
                    } else if(v.id == "18" || v.id == '60' || v.id == '71'){
                        // （鉴定费用、停车费、其它费用）表示保险公司全赔总金额
                        if(v.claimAmount){
                            if(v.selectShow) {
                                bxSumAmount +=  parseFloat(v.claimAmount);
                            }else{//个人全赔总金额
                                noBxSumAmount += parseFloat(v.claimAmount);
                            }
                        }
                    }else if(v.id == '17'){
                        //精神抚慰金
                        if(v.claimAmount) spiritAmount += parseFloat(v.claimAmount);
                    }else {
                        if(v.claimAmount) deathAmount += parseFloat(v.claimAmount);
                    }
                }else{
                    //1、累加总损失
                    if(v.applyAmount) amount += parseFloat(v.applyAmount);
                    //2、累加医疗损失   医疗费、后续治疗费、住院伙食补助费、营养费
                    if (["03", "04", "06", "07"].indexOf(v.id) != -1) {
                        if(v.applyAmount) medicalAmount += parseFloat(v.applyAmount);
                    }else if (["30", "40", "50", "70"].indexOf(v.id) != -1) {
                        //3、累加财产损失 财产损失、车辆损失、拖车费、施救费
                        if(v.applyAmount) propertyAmount += parseFloat(v.applyAmount);
                    } else if(v.id == "18" || v.id == '60' || v.id == '71'){
                        // （鉴定费用、停车费、其它费用）表示保险公司全赔总金额
                        if(v.applyAmount){
                            if(v.selectShow) {
                                bxSumAmount +=  parseFloat(v.applyAmount);
                            }else{//个人全赔总金额
                                noBxSumAmount += parseFloat(v.applyAmount);
                            }
                        }
                    }else if(v.id == '17'){
                        //精神抚慰金
                        if(v.applyAmount) spiritAmount += parseFloat(v.applyAmount);
                    }else {
                        //死亡伤残金额
                        if(v.applyAmount)deathAmount += parseFloat(v.applyAmount);
                    }
                }
            }
        });

        //保险外金额计算(按申请人计算总和)
        var extraMoneyList = [];
        //调解时计算，诉讼时不计算
        if($scope.co.isAdjust){
            $scope.adjust.feeDetail.forEach(function (val){
                //当该项被勾选时
                if(val.respondentList && val.isChecked){
                    val.respondentList.forEach(function(k){
                        if(k.extraMoney && k.extraMoney > 0){
                            var obj = _.find(extraMoneyList,{id: k.id});
                            if(obj){
                                obj.extraMoney = parseFloat(obj.extraMoney) + parseFloat(k.extraMoney);
                            }else{
                                extraMoneyList.push({
                                    id: k.id,
                                    extraMoney: parseFloat(k.extraMoney).toFixed(2)*1,
                                    personName: k.idType=='0'?k.personName:k.orgName,
                                    personType: k.personType
                                });
                            }
                        }
                    });
                }
            });
        }

        //计算器计算规则
        //一、计算交强险
        //交强险赔付总金额
        //交强险或者商业险剩余总数
        var syxLeftSum = amount;
        var compulsoryInsuranceSum = 0.0;
        respondents.forEach(function(v) {
            if ("1" == v.isVehicle) {
                //1、先计算交强险赔付金额，从交强险中优先赔付精神损害抚慰金，如果超出保险公司的死亡伤残上线，商业险不予赔付，由双方按责任比例承担
                //每个人赔付死亡赔偿金的总金额
                v.personPayDeathSum = 0.0;
                v.personPaySpiritSum = 0.0;
                //初始化富于的伤残死亡金
                v.surplusPersonDeathSum = 0.0;
                //首先个人赔付精神抚慰金的金额
                var personPaySpiritAmount = spiritAmount * v.death / deathLimits;
                //个人赔偿精神抚慰金金额大于或者等于死亡伤残上线，按死亡线上赔付
                if(personPaySpiritAmount >= v.death){
                    v.personPaySpiritSum += v.death;
                    //所有人欠的精神抚慰金总和
                    leftSpiritAmount += (personPaySpiritAmount - v.death);
                }else{
                    //如果小于死亡赔偿上线，按计算的精神抚慰金金额赔付
                    v.personPaySpiritSum += personPaySpiritAmount;
                    //富于的个人死亡伤残金
                    v.surplusPersonDeathSum = v.death - personPaySpiritAmount;
                }
                //2、如果仍然有剩余的个人死亡伤残金额，则继续赔付死亡伤残其它项目
                if(v.surplusPersonDeathSum && v.surplusPersonDeathSum > 0){
                    //如果计算死亡伤残金额大于富于的死亡伤残金额，按剩下的来
                    if(deathAmount * v.death / deathLimits >= v.surplusPersonDeathSum){
                        v.personPayDeathSum += v.surplusPersonDeathSum;
                    }else{
                        v.personPayDeathSum += deathAmount * v.death / deathLimits;
                    }
                }
                //3、赔付医疗费
                var personPayMedicalAmount = medicalAmount * v.medical / medicalLimits;
                //个人赔付医疗费大于个人赔付上线
                if(personPayMedicalAmount > v.medical){
                    //个人付款医疗费金额
                    v.personPayMedicalSum = v.medical;
                    //个人欠医疗费金额
                    v.leftPersonMedicalSum = personPayMedicalAmount - v.medical;
                }else{
                    v.personPayMedicalSum = personPayMedicalAmount;
                }
                //4、赔付财产损失
                var personPayPropertyAmount = propertyAmount * v.property / propertyLimits;
                //个人赔付财产损失大于个人赔付上线
                if(personPayPropertyAmount > v.property){
                    //个人付款财产损失费金额
                    v.personPayPropertySum = v.property;
                    //个人欠财产损失费金额
                    v.leftPersonPropertySum = personPayPropertyAmount - v.property;
                }else{
                    v.personPayPropertySum = personPayPropertyAmount;
                }
                //5、保存数据 payType  1.交强 2.商业 3.自付

                //如果有交强险
                if(v.riskTypes['0']){
                    //有包干费用
                    if(dryFlag){
                            v.jqxSum = v.death + v.medical + v.property;
                            if(v.jqxSum < amount){
                                syxLeftSum = amount - v.jqxSum;
                            }
                            $scope.adjust.compensateTable.push({
                                payType: "1",
                                calcFormula: "",
                                calcIndemnitySum: v.jqxSum >= amount?amount.toFixed(2)*1:v.jqxSum.toFixed(2)*1,
                                companyName: v.insuranceForceCompany,
                                plateNo: v.plateNo,
                                idType: v.idType
                            });

                        if(v.jqxSum >= amount){
                            syxLeftSum = 0;
                        }
                    }else{
                        $scope.adjust.compensateTable.push({
                            payType: "1",
                            calcFormula: "",
                            calcIndemnitySum: (v.personPayDeathSum + v.personPayMedicalSum + v.personPayPropertySum + v.personPaySpiritSum) .toFixed(2)*1,
                            companyName: v.insuranceForceCompany,
                            plateNo: v.plateNo,
                            idType: v.idType
                        });
                        $scope.noStrongInsurance = 0;
                    }
                }else{
                    $scope.noStrongInsurance = (v.personPayDeathSum + v.personPayMedicalSum + v.personPayPropertySum + v.personPaySpiritSum) .toFixed(2)*1;
                }
                //累加被告支付交强险计算总金额
                compulsoryInsuranceSum +=  v.personPayDeathSum + v.personPayMedicalSum +v.personPayPropertySum;
            }else{
                leftSpiritAmount = spiritAmount;
            }
        });

        //二、计算商业险
        //医疗费+死亡伤残+财产损失 - 总共支付交强险的费用= 剩余的资金由商业险按责任比例承担
        var leftPartSum = (parseFloat(medicalAmount) + parseFloat(propertyAmount) + parseFloat(deathAmount) - parseFloat(compulsoryInsuranceSum)).toFixed(2)*1;
        //保险公司支付商业险和被告支付的总金额
        var commercialInsuranceAndDefendantSum = 0.00;
        //剩余的交强险金额 +  剩余的精神抚慰金 + 保险公司全部承担的费用(停车费、鉴定费、其它费用)
        var noPaySum = (parseFloat(leftPartSum)  + parseFloat(leftSpiritAmount) + parseFloat(bxSumAmount) + parseFloat(noBxSumAmount)).toFixed(2)*1;
        if(noPaySum > 0 || dryFlag){
            //循环侵权人，计算每个侵权人商业险应该赔付的费用
            respondents.forEach(function(v) {
                //个人商业险赔付金额
                v.personBusinessIndemnitySum = 0.00;
                //剩余的保险公司赔付不了的金额 默认时所有
                v.leftCarAndAppraiseAndOtherSum = bxSumAmount;
                //表示为机动车并且有商业险
                if ("1" == v.isVehicle && v.riskTypes['1']) {
                    //保险包干费用
                    if(dryFlag){
                        if(syxLeftSum > 0){
                            //交强险剩余大于商业险

                            $scope.adjust.compensateTable.push({
                                payType: "2",
                                calcFormula: "",
                                calcIndemnitySum: v.thirdParty >= syxLeftSum? syxLeftSum.toFixed(2)*1:(v.thirdParty).toFixed(2)*1,
                                companyName: v.insuranceBusinessCompany,
                                plateNo: v.plateNo,
                                idType: v.idType
                            });

                            if(v.thirdParty < syxLeftSum){
                                syxLeftSum = syxLeftSum - v.thirdParty;
                            }else{
                                syxLeftSum = 0;
                            }

                        }
                    }else{
                        //如果交强险赔付完仍需要交强险进行赔付 或者保险公司有赔付（停车、鉴定、其它费用）
                        if(leftPartSum > 0 || bxSumAmount > 0){
                            if(leftPartSum > 0){
                                //如果被告的三者险金额 > 除交强险以外剩余应该赔付的金额 *  责任比例 *  三者险赔偿比例，则取后面的值
                                //绝对免赔率
                                v.absDeductibleRate = 100;
                                if(v.absDeductible){
                                    v.absDeductibleRate = 100 - v.absDeductible;
                                }
                                if (v.thirdParty > leftPartSum * v.responsibleRate / 100 * v.thirdPartyRate / 100 * v.absDeductibleRate/100) {
                                    v.personBusinessIndemnitySum = parseFloat(leftPartSum * v.responsibleRate / 100 * v.thirdPartyRate / 100 * v.absDeductibleRate/100).toFixed(2)*1;
                                } else {
                                    //直接取三者险的金额
                                    v.personBusinessIndemnitySum = v.thirdParty;
                                }
                            }
                            //保险公司应该赔付停车费、鉴定费以及其它费用的金额
                            v.carAndAppraiseAndOtherSum = 0;
                            //保险公司全部赔付
                            if(bxSumAmount > 0){
                                //剩余三者险金额
                                var leftPersonBusinessIndemnitySum = v.thirdParty - v.personBusinessIndemnitySum;
                                //如果剩余三者险金额大于0，并且保险公司有全部承担停车费 + 鉴定费 + 其它费用 > 0,由保险公司全部承担其费用
                                if(leftPersonBusinessIndemnitySum > 0 && bxSumAmount > 0){
                                    //再进行判断，当保险公司承担的费用小于剩余的商业险的费用时，则取保险公司承担总费用
                                    if( bxSumAmount < leftPersonBusinessIndemnitySum ){
                                        v.carAndAppraiseAndOtherSum = bxSumAmount;
                                        v.leftCarAndAppraiseAndOtherSum = 0.00;
                                    }else{
                                        //反之则取剩余的商业险的费用
                                        v.carAndAppraiseAndOtherSum = leftPersonBusinessIndemnitySum;
                                        v.leftCarAndAppraiseAndOtherSum = bxSumAmount - leftPersonBusinessIndemnitySum;
                                    }
                                }
                            }

                            //保存商业险赔付金额 赔偿方式 1.交强 2.商业 3.自付
                            $scope.adjust.compensateTable.push({
                                payType: "2",
                                calcFormula: "",
                                calcIndemnitySum: (parseFloat(v.personBusinessIndemnitySum) + parseFloat(v.carAndAppraiseAndOtherSum)).toFixed(2)*1,
                                companyName: v.insuranceBusinessCompany,
                                plateNo: v.plateNo,
                                idType: v.idType
                            });
                            //保险公司支付商业险总金额
                            commercialInsuranceAndDefendantSum += parseFloat(v.personBusinessIndemnitySum) + parseFloat(v.carAndAppraiseAndOtherSum);
                        }
                    }
                }
                //
                if(!dryFlag){
                    //责任比例内保险未赔完，由被告自行承担(个人按责任比例赔付、剩余的精神费用，剩余的保险公司赔付的金额)
                    v.personPayAmount = parseFloat((leftPartSum  + noBxSumAmount + leftSpiritAmount + v.leftCarAndAppraiseAndOtherSum)  * v.responsibleRate / 100 - v.personBusinessIndemnitySum).toFixed(2)*1;
                    //保存被告自负担金额
                    //被申请人自负保险范围外金额
                    var claimantExtraMoneyObject = _.find(extraMoneyList,{personName: v.personName});
                    var claimantExtraMoney = 0;
                    if(claimantExtraMoneyObject){
                        claimantExtraMoney = parseFloat(claimantExtraMoneyObject.extraMoney);
                    }
                    if (parseFloat(v.personPayAmount + claimantExtraMoney) > 0) {
                        //保险公司作为被告人
                        var bxgsFlag = false;
                        respondents.forEach(function(val){
                            if(parseFloat(val.responsibleRate) > -1 && val.idType == '1' && val.enterpriseType == '1'){
                                bxgsFlag = true;
                            }
                        });
                        //如果保险公司作为被告则不显示被告的费用
                        if(!bxgsFlag){
                            var noStrongInsurance =  $scope.noStrongInsurance? $scope.noStrongInsurance:0;
                            $scope.adjust.compensateTable.push({
                                payType: "3",
                                calcFormula: "",
                                calcIndemnitySum: (parseFloat(v.personPayAmount) + parseFloat(claimantExtraMoney) + parseFloat(noStrongInsurance)).toFixed(2)*1,
                                personName: v.idType=='0'?v.personName:v.orgName,
                                personType: v.personType,
                                idType: v.idType
                            });
                        }
                        //被告支付的总金额
                        commercialInsuranceAndDefendantSum = parseFloat(commercialInsuranceAndDefendantSum) + parseFloat(v.personPayAmount) ;
                    }
                }
            });
        }else{
            //保险外金额被告赔付
            respondents.forEach(function(v) {
                //被申请人自负保险范围外金额
                var claimantExtraMoneyObject = _.find(extraMoneyList,{personName: v.personName});
                var claimantExtraMoney = 0;
                if(claimantExtraMoneyObject){
                    claimantExtraMoney = claimantExtraMoneyObject.extraMoney;
                }
                if (claimantExtraMoney > 0) {
                    $scope.adjust.compensateTable.push({
                        payType: "3",
                        calcFormula: "",
                        calcIndemnitySum: parseFloat(claimantExtraMoney).toFixed(2)*1,
                        personName: v.idType=='0'?v.personName:v.orgName,
                        personType: v.personType,
                        idType: v.idType
                    });
                }
            });
        }

        //如果
        if(dryFlag){
            if(syxLeftSum > 0){
                respondents.forEach(function(v) {
                    $scope.adjust.compensateTable.push({
                        payType: "3",
                        calcFormula: "",
                        calcIndemnitySum: parseFloat(syxLeftSum).toFixed(2)*1,
                        personName: v.idType=='0'?v.personName:v.orgName,
                        personType: v.personType,
                        idType: v.idType
                    });
                });
            }
        }else{
            //循环保险外支付的金额
            var applicantExtraSumMoney = 0;//取得申请人金额总和
            //调解时计算，诉讼时不计算
            if($scope.co.isAdjust){
                if(extraMoneyList != null){
                    extraMoneyList.forEach(function(val){
                        if(val.personType == '0'){
                            applicantExtraSumMoney += parseFloat(val.extraMoney);
                        }
                    });
                }
            }

            //原告自行承担金额
            var plaintiffPayMoney = leftPartSum  + leftSpiritAmount + noBxSumAmount + bxSumAmount - commercialInsuranceAndDefendantSum + applicantExtraSumMoney;
            if (plaintiffPayMoney > 0) {
                var applicants = $scope.selectApplicantInArray();
                //被侵权方信息
                $scope.adjust.compensateTable.push({
                    payType: "3",
                    calcFormula: "自已承担：" + plaintiffPayMoney,
                    calcIndemnitySum: plaintiffPayMoney.toFixed(2)*1,
                    personName: applicants,
                    personType: 0
                });
            }

            //计算器金额，申请人全责，没有免赔率，被申请人为机动车，没有选择险种，计算部分金额有误
            if($scope.adjust.compensateTable){
                var totalMoney = 0;
                $scope.adjust.compensateTable.forEach(function(val){
                    if(val.calcIndemnitySum){
                        totalMoney += parseFloat(val.calcIndemnitySum);
                    }
                });
                //如果金额不相等 则把剩余的钱算到被告头上
                if($scope.co.isAdjust){
                    if(totalMoney != $scope.adjust.lawMoney){
                        var bsqrList = $scope.adjust.applicantArray.filter(function(v){
                            return v.personType=='1'
                        });
                        var bsqr;
                        if(bsqrList){
                            bsqr = bsqrList[0];
                        }
                        if(bsqr){
                            if(($scope.adjust.lawMoney - totalMoney).toFixed(2) > 0){
                                //被侵权方信息
                                $scope.adjust.compensateTable.push({
                                    payType: "3",
                                    calcFormula: "自已承担：" + ($scope.adjust.lawMoney - totalMoney).toFixed(2)*1,
                                    calcIndemnitySum: ($scope.adjust.lawMoney - totalMoney).toFixed(2)*1,
                                    personName: bsqr.personName?bsqr.personName:bsqr.orgName,
                                    personType: 0
                                });
                            }

                        }
                    }
                }else{
                    if(totalMoney != $scope.adjust.applyTotal){
                        var bsqrList = $scope.adjust.applicantArray.filter(function(v){
                            return v.personType=='1'
                        });
                        var bsqr;
                        if(bsqrList){
                            bsqr = bsqrList[0];
                        }
                        if(bsqr){
                            //被侵权方信息
                            if(($scope.adjust.applyTotal - totalMoney).toFixed(2) > 0){
                                $scope.adjust.compensateTable.push({
                                    payType: "3",
                                    calcFormula: "自已承担：" + ($scope.adjust.applyTotal - totalMoney).toFixed(2)*1,
                                    calcIndemnitySum: ($scope.adjust.applyTotal - totalMoney).toFixed(2)*1,
                                    personName: bsqr.personName?bsqr.personName:bsqr.orgName,
                                    personType: 0
                                });
                            }
                        }
                    }
                }
            }
        }
    }

    $scope.selectApplicantInArray = function(){
        var applicants="";
        $scope.adjust.applicantArray.filter(function(v){
            return v.personType=='0' && v.isDeath != '1';
        }).forEach(function(v){
            if(v.idType==0){
                if(!applicants){
                    applicants += v.personName
                }else{
                    applicants += ","+v.personName
                }
            }else{
                if(!applicants){
                    applicants += v.orgName
                }else{
                    applicants += ","+v.orgName
                }
            }
        })
        return applicants;
    };

    //计算总合计
    $scope.calcTotal = function(compensateTable, type){
    	debugger;
        var total = 0.00;
        if(compensateTable){
            compensateTable.filter(function(v){
                return v.payType==type;
            }).forEach(function(v){
                total += parseFloat(v.calcIndemnitySum);
            })
        }
        return total.toFixed(2)*1  //去除.00的情况
    };

    $scope.addDependent = function(val) {

        var dependents = _.find($scope.adjust.feeDetail, {
            id: "14"
        }).dependents
        if (val == 'claim') {
            if (dependents.claim.length == 0 && dependents.apply.length != 0) {
                dependents.claim = angular.copy(dependents.apply);
            }
        }
        var modalInstance = $modal.open({
            templateUrl: 'views/pages/mediation_platform/litigation_mediation/adjust_information_popup.html',
            controller: 'AdjustInformationPopupCtrl',
            backdrop:'static',
            size: 'lg',
            resolve: {
                items: function() {
                    var depent = _.find($scope.adjust.feeDetail, {
                        id: "14"
                    }).dependents;
                    return {
                        dependents: depent[val],
                        deathDate: $scope.adjust.deathDate,
                        compensateRate: $scope.adjust.compensateRate,
                        household: $scope.adjust.household,
                        refData: $scope.adjust.compensateStandard,
                        serialNo:$scope.adjust.serialNo
                    }
                }
            }
        });
        //返回值
        modalInstance.result.then(function(data) {
            var target = _.find($scope.adjust.feeDetail, {
                id: "14" // fuyangren
            });
            if (val == 'apply') {
                target.applyAmount = data;
                if (!target.claimAmount)
                    target.claimAmount = data;
            } else {
                target.claimAmount = data;
            }
            $scope.refreshTotal();
        }, null);
    };

    //批量上传文件
    $scope.uploadFile = function(files){
        if(!files) return;
        if (files && files.length) {
            for (var i = 0; i < files.length; i++) {
                var fileName = files[i].name.substring(0,files[i].name.lastIndexOf('.'));
                $scope.uploadDocPicture(fileName,files[i]);
            }
        }
    };
    //下载确认文书
    $scope.downloadFile = function(){
        var url = $state.href("downloadFile",{serialNo:$scope.adjust.serialNo});
        window.open(url,'_blank');
    };
    //上传文件
    $scope.uploadDocPicture = function(fileName,file){
        Upload.upload({
            url: AdjustConfig.pictureConstant.uploadImageFileUrl,
            data: {
                file: file,
                wordType: '30',
                serialNo:$scope.adjust.serialNo
            }
        }).success(function(resp) {
          $rootScope.toaster("success", "成功", "文件上传成功!");
            $scope.isFileExist = true;
        });
    }

    $scope.checkFileExist = function(){
        LawService.isFilePageExist({
            wordType: '30',
            serialNo:$scope.adjust.serialNo
        }).success(function(res) {
            if(res.code == -1){
                $scope.isFileExist = false;
            }else{
                $scope.isFileExist = true;
            }
        })
    }
    $scope.checkFileExist();
    //签字页
    $scope.signPage = function () {
        var url = $state.href('signDetail',{serialNo:$scope.adjust.serialNo,isSelf:$scope.trafficPolice});
        window.open(url)
    }
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
    //处理已付金额
    $scope.queryPayMoney = function(){
        var payMoney = $modal.open({
            templateUrl: 'views/pages/mediation_platform/litigation_mediation/payMoney.html',
            controller: 'PayMoneyCtrl',
            size: 'md',
            resolve: {
                items: function() {
                    return {
                        adjust: $scope.adjust
                    }
                }
            }
        });
    };

    //处理保险外金额
    $scope.handleExtraAmount = function(fee){
        var handleExtraAmountModel = $modal.open({
            templateUrl: 'views/pages/mediation_platform/litigation_mediation/extraAmount.html',
            controller: 'ExtraAmountCtrl',
            backdrop:'static',
            size: 'md',
            resolve: {
                items: function() {
                    return {
                        fee: fee,
                        adjust: $scope.adjust
                    }
                }
            }
        });

        handleExtraAmountModel.result.then(function(){
            $scope.refreshTotal();
            fee.isChecked = true;
        })
    };

    //添加护理费、误工费、处理人误工费
    $scope.addNursingFee = function(val,fee){
        var addNursingFeeModel =  $modal.open({
            templateUrl: 'views/pages/mediation_platform/litigation_mediation/nursingFee_popup.html',
            controller: 'NursingFeePopupCtrl',
            backdrop:'static',
            size: 'lg',
            resolve: {
                items: function() {
                    return {
                        fee: fee,
                        val:val,
                        adjust: $scope.adjust
                    }
                }
            }
        });

        addNursingFeeModel.result.then(function(data){
            $scope.refreshTotal();
        })
    };

    //选择依据
    $scope.openCriteria = function (lg, fee, hide) {
        var modalInstance = $modal.open({
          templateUrl: 'views/pages/lawsuit/criteria.html',
          controller: 'ModalLawItemsCtrl',
          size: lg,
          resolve: {
            items: function () {
               return {
                    selectedItemArray:fee.selectedItemArray==undefined?angular.copy(DictionaryConfig.lawItemArray.filter(function(v){return v.feeType == fee.id})):fee.selectedItemArray,
                    isShow:hide
               }

            }
          }
        });
        modalInstance.result.then(function (selectedItem) {
          fee.selectedItemArray = selectedItem;
        }, function () {
          $log.info('Modal dismissed at: ' + new Date());
        });
    };


    //鉴定伤残等级
    $scope.co.showRankAppraisal = function () {
        //判断当前所属的状态（调解、起诉）
        if($location.url().split('/').indexOf('mediation') !== -1) {
            //调解
            $scope.isMediation = 0;
        } else {
            //起诉、庭前调解时
            $scope.isMediation = 1;
        }
        if($scope.adjust || $scope.law) {
            var id = $scope.adjust? $scope.adjust.id: $scope.law.id;
            var serialNo = $scope.adjust? $scope.adjust.serialNo: $scope.law.serialNo;
            console.log($scope.adjust)
            //打开等级鉴定页面，并将单子id与流水号通过url传入
            var url = $state.href('rankAppraisal');
            $log.info("shenwei:" + $scope.trafficPolice);
            window.open(url+'?id='+id+'&serialNo='+serialNo+'&flag='+$scope.isMediation+"&isSelf="+$scope.trafficPolice, '_blank');
        } else {
            //赔偿试算，不存在案件流水号
            var url = $state.href('rankAppraisal');
            window.open(url, '_blank');
        }
    };

    //切换停车费、鉴定费、其它费用
    $scope.selectBxShow = function(fee){
        fee.selectShow = !fee.selectShow;
        $scope.computeChange(fee,true);

    }


    //点击按钮
    $scope.carDamageCalculation = function () {
        var regionName = $scope.adjust.regionName.substring(0,2);
        var company = DictionaryConfig.provinceList.filter(function (val) {
         return val.text.substring(0,2) == regionName
        })[0];
        var data = {
            lossNo:$scope.adjust.serialNo,
            plateNo:$scope.adjust.applicantArray.filter(function (val) {return val.personType == 1})[0].plateNo,
            vinNo:'',
            comCode:company.code,
            company:company.text,
            accidentCourse:$scope.adjust.factReason
        }
        $scope.getCarlossService(data).success(function (result) {
            //请求成功
            if (result.code == AdjustConfig.commonConStant.SUCCESS) {
                var url = result.result;
                window.open(url,'_blank')
            }else{
                toaster.pop("error", "错误", result.message)
            }
        })
    }

    //清除备注说明
    $scope.clearRemark = function () {
      $scope.adjust.feeDetail.forEach(function (x) {
        x.remark = '';
      })
    }
});

app.controller('AdjustInformationPopupCtrl', function($scope, DictionaryConfig, $state, $modal, items, $modalInstance, toaster,$rootScope) {
    $scope.dependents = items.dependents;
    $scope.deathDate = items.deathDate;
    $scope.household = items.household;
    $scope.compensateStandard = items.refData;
    $scope.compensateRate = items.compensateRate;

    $scope.openBirthDate = function($event, dependent) {
        $event.preventDefault();
        $event.stopPropagation();
        dependent.birthDateOpened = true;
    };
    $scope.accountTypeList = DictionaryConfig.accountTypeList;

    $scope.add = function() {
        var dependent = {
            id: new Date().getTime(),
            birthDateOpened: false,
            household: $scope.household
        }
        $scope.dependents.push(dependent);
    }

    $scope.deleteDependent = function(index) {
        $scope.dependents.splice(index, 1);
    };

    $scope.computeFyAge = function(dependent) {
        dependent.age = Math.floor(($scope.deathDate.getTime() - dependent.birthDate.getTime()) / (24 * 365 * 3600000));
        if (dependent.age <= 18)
            dependent.fyAge = 18 - dependent.age;
        else if (dependent.age > 18 && dependent.age <= 60)
            dependent.fyAge = 20;
        else if (dependent.age > 60 && dependent.age < 75)
            dependent.fyAge = 80 - dependent.age;
        else if (dependent.age >= 75)
            dependent.fyAge = 5;
    }

    //点击确认
    $scope.ok = function() {
        var dependentStandard = $scope.compensateStandard[$scope.household].expense;
        var flag = true;
        $scope.dependents.forEach(function(v) {
            if(!v.name){
                $rootScope.toaster("error", "错误", "请填写抚养人姓名!");
                $scope.nameError = true;
                flag = false;
            }else $scope.nameError = false;
            if(!v.birthDate){
                $rootScope.toaster("error", "错误", "请填写抚养人真实出生日期!");
                $scope.birthDateError = true;
                flag = false;
            }else $scope.birthDateError = false;
            if(!v.count){
                $rootScope.toaster("error", "错误", "请填写共同抚养人数!");
                $scope.countError = true;
                flag = false;
            }else $scope.countError = false;

            v.expense = $scope.compensateStandard[v.household].expense
        });
        $scope.dependents.sort(function(a, b) {
            return a.fyAge - b.fyAge;
        });

        var countFee = 0;
        $scope.dependents.forEach(function(v, i, arr) {
            var tmpFee = 0;
            var preYear = 0;
            var year = v.fyAge;
            for (var j = i; j < arr.length; j++) {
                tmpFee += (arr[j].expense * $scope.compensateRate / 100 / arr[j].count);
            }
            if (i != 0) {
                preYear = arr[i - 1].fyAge;
            }
            if (tmpFee > dependentStandard)
                tmpFee = dependentStandard;
            countFee += (tmpFee * (year - preYear));
        });
        if(flag){
            $modalInstance.close(countFee.toFixed(2)*1);
        }
    };
    //点击取消
    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };

});

app.controller('downloadFileCtrl', function($scope, AdjustService, $stateParams,LoginConfig,AdjustConfig,toaster,$rootScope){
    //获取图片列表
    $scope.getImageFileService = AdjustService.getImageFile;
    //获取图片
    $scope.getImageFileService({
        wordType: '30',
        serialNo:$stateParams.serialNo
    }).success(function (res) {
        if (res.code == AdjustConfig.commonConStant.SUCCESS) {
            $scope.imageList = [];
            if(res.result){
                res.result.forEach(function (v) {
                    var url = LoginConfig.pictureConstant.bigPictureUrl + v.path;
                    $scope.imageList.push(url);
                })
            }
        } else {
          $rootScope.toaster("error", "错误", res.message);
        }
    })
});

//原生js调用angular中的scope参数  （伤残等级鉴定页面调用）
function saveRankAppraisal(count){
    //通过元素id来获取Angular应用
    var appElement = document.getElementById('step5Ctrl');
    //获取$scope变量
    var $scope = angular.element(appElement).scope();
    //调用$scope中的方法与赋值
    $scope.adjust.compensateRate = count;
    $scope.compensateRateChanged($scope.adjust);
    //上一行改变了msg的值，如果想同步到Angular控制器中，则需要调用$apply()方法即可
    $scope.$apply();
}
