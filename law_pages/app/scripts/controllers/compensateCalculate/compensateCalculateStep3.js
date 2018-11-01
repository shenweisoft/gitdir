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
                            strinput = parseFloat(strinput).toFixed(floatLength);
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

angular.module('sbAdminApp').controller('compensateCalculateStep3Ctrl', function(LoginService,$scope, $stateParams, $interpolate, toaster, $state, $location, $timeout, $http, $log, $filter, $modal, AdjustService, AdjustConfig, LawService, DictionaryConfig, Upload, AdminConstant,$rootScope) {

    //步骤增加
    $scope.options.step = 3;
    //取得户口类型字典
    $scope.accountTypeList = DictionaryConfig.accountTypeList;
    //填充区域信息
    $scope.adminRegion = AdminConstant.administrationRegions;
    //后台查询计算器的相关标准
    $scope.queryCalculateStandardService = AdjustService.queryCalculateStandard;
    //案由类型
    $scope.factTypeList = DictionaryConfig.factTypeList;
    //保险公司
    $scope.insuranceList = DictionaryConfig.insuranceList;

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
        if($scope.compensateInfo && !$scope.compensateInfo.regionName){
            $scope.compensateInfo.regionName = $scope.sysUser.regionName;
            if($scope.compensateInfo.regionName){
                var regionObj = _.find(AdminConstant.administrationRegions, {fullName:$scope.compensateInfo.regionName});
                if(regionObj){
                    $scope.compensateInfo.regionCode = regionObj.regionCode;
                }
            }
        }
    }

    //选择区域的时候进行触发计算赔偿标准和居民收入支出标准
    $scope.findIncomeAndCompensate = function(flag){
        if ($scope.compensateInfo && $scope.compensateInfo.regionName && $scope.compensateInfo.standardYear) {
            //计算居民收支标准以及赔偿标准
            queryCalculateStandard(flag);
        }
    };

    //默认系统初始化居民收支标准以及赔偿标准(延时一秒钟处理)
    setTimeout(function () {
        $scope.findIncomeAndCompensate();
    },1000);

    $scope.changeYear = function(){

        $scope.findIncomeAndCompensate(true);
        //查询备注
        queryMtRegionalNameRemark();
    };

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
    $scope.compensateInfoDateOpened = false;
    $scope.opencompensateInfoDate = function($event, index) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.compensateInfoDateOpened = true;
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
            if ($scope.compensateInfo.regionName != selectedRegion.fullName) {
                $scope.compensateInfo.regionName = selectedRegion.fullName;
                $scope.compensateInfo.regionCode = selectedRegion.regionCode;
                $scope.compensateInfo.regionNameError = undefined;
                angular.element("#regNamebox").hide();
                $scope.isShowTree = false;
                //选择区域的时候进行触发计算赔偿标准和居民收入支出标准
                $scope.findIncomeAndCompensate(true);
                //查询备注
                queryMtRegionalNameRemark();
            }
        }
    };

    $scope.changeYear = function(){
        $scope.findIncomeAndCompensate(true);
        //查询备注
        queryMtRegionalNameRemark();
    };

    //计算器传输对象
    function CalculateVO(){
        this.regionName = $scope.compensateInfo.regionName;
        this.standardYear = $scope.compensateInfo.standardYear;
        this.household = $scope.compensateInfo.household;
    };


    //根据参数查询后端标准
    function queryCalculateStandard(flag){
        $scope.calculateVO = new CalculateVO();
        $scope.queryCalculateStandardService($scope.calculateVO).success(function(result) {
            //请求成功
            if (result.code == AdjustConfig.commonConStant.SUCCESS) {
                var calculateResultVO = result.result;
                $scope.compensateInfo.compensateStandard = {};
                //计算费用标准
                //误工费
                if(calculateResultVO.lostIncome){
                    $scope.compensateInfo.compensateStandard.lostIncome = calculateResultVO.lostIncome;
                }else{
                    $scope.compensateInfo.compensateStandard.lostIncome = "";
                }
                //护理费
                if(calculateResultVO.standardNurseFee){
                    $scope.compensateInfo.compensateStandard.standardNurseFee = calculateResultVO.standardNurseFee;
                }else{
                    $scope.compensateInfo.compensateStandard.standardNurseFee = "";
                }
                //住院伙食补助费
                if(calculateResultVO.hospitalFoodSubsidies){
                    $scope.compensateInfo.compensateStandard.hospitalFoodSubsidies = calculateResultVO.hospitalFoodSubsidies;
                }else{
                    $scope.compensateInfo.compensateStandard.hospitalFoodSubsidies = "";
                }
                //营养费
                if(calculateResultVO.thesePayments){
                    $scope.compensateInfo.compensateStandard.thesePayments = calculateResultVO.thesePayments;
                }else{
                    $scope.compensateInfo.compensateStandard.thesePayments = "";
                }
                //交通费
                if(calculateResultVO.transportationFee){
                    $scope.compensateInfo.compensateStandard.transportationFee = calculateResultVO.transportationFee;
                }
                //住宿费
                if(calculateResultVO.accommodationFee){
                    $scope.compensateInfo.compensateStandard.accommodationFee = calculateResultVO.accommodationFee;
                }else{
                    $scope.compensateInfo.compensateStandard.accommodationFee = "";
                }
                //丧葬费
                if(calculateResultVO.funeralFeeStandard){
                    $scope.compensateInfo.compensateStandard.funeralFeeStandard = calculateResultVO.funeralFeeStandard;
                }else{
                    $scope.compensateInfo.compensateStandard.funeralFeeStandard = "";
                }
                //精神抚慰金标准
                if(calculateResultVO.spiritualConsolationFee){
                    $scope.compensateInfo.compensateStandard.spiritualConsolationFee = calculateResultVO.spiritualConsolationFee;
                }else{
                    $scope.compensateInfo.compensateStandard.spiritualConsolationFee = "";
                }

                //计算居民收入支出标准
                //农村赔偿标准
                //城镇在岗职工收入标准
                if(calculateResultVO.urbanSalary){
                    $scope.compensateInfo.compensateStandard.wageIncome = calculateResultVO.urbanSalary;
                }else{
                    $scope.compensateInfo.compensateStandard.wageIncome = "";
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
                $scope.compensateInfo.compensateStandard["1"] = {
                    "income": calculateResultVO.ruralNetIncome,
                    "expense": calculateResultVO.ruralAverageOutlay
                };
                //城镇赔偿标准
                $scope.compensateInfo.compensateStandard["2"] = {
                    "income": calculateResultVO.urbanDisposableIncome,
                    "expense": calculateResultVO.urbanAverageOutlay
                };
                //循环计算器详细表
                var householdStr =  $scope.compensateInfo.household == '1'?"农村":"城镇";
                console.log($scope.compensateInfo.feeDetail)
                $scope.compensateInfo.feeDetail.forEach(function(v) {
                    var cityStr = v.value + "：" + $scope.compensateInfo.regionName+$scope.compensateInfo.standardYear+ "年" +householdStr+"标准：";
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
                        if($scope.compensateInfo.household == '1'){
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
                        var ruleMoney = $scope.compensateInfo.compensateStandard[$scope.compensateInfo.household];
                        if( ruleMoney && parseFloat(ruleMoney.income) > 0){
                            //显示标准
                            v.isClaimWarning = true;
                            v.warningText = cityStr+ruleMoney.income+"元/年";
                            //申请金额
                            if((!flag && (!v.applyPerUnit || parseFloat(v.applyPerUnit) <= 0)) || flag){
                                v.applyPerUnit = ruleMoney.income;
                                v.applyAmount = v.applyPerUnit * v.applyUnit * $scope.compensateInfo.compensateRate / 100;
                            }
                            //调解金额
                            if((!flag && (!v.claimPerUnit || parseFloat(v.claimPerUnit) <= 0)) ||  flag){
                                v.claimPerUnit = ruleMoney.income;
                                v.claimAmount = v.claimPerUnit * v.claimUnit * $scope.compensateInfo.compensateRate / 100;
                            }
                        }else{
                            v.isClaimWarning = undefined;
                            v.warningText = undefined;
                        }
                    }else if(v.id == '16'){//丧葬费
                        if(calculateResultVO.funeralFeeStandard){
                            v.isClaimWarning = true;
                            v.warningText = cityStr+parseFloat(calculateResultVO.funeralFeeStandard/12).toFixed(2)+"元/月";
                        }else{
                            v.isClaimWarning = undefined;
                            v.warningText = undefined;
                        }
                    }else if (v.id == '17'){//精神抚慰金
                        if(calculateResultVO.spiritualConsolationFee){
                            v.isClaimWarning = true;
                            v.warningText = cityStr+parseFloat(calculateResultVO.spiritualConsolationFee).toFixed(2)+"元";
                        }else{
                            v.isClaimWarning = undefined;
                            v.warningText = undefined;
                        }
                    }
                });
            }else{
                //请求失败
                $rootScope.toaster("error", "错误", result.message);
            }
        });
    }

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
                    //医疗费
                    var medicalFee = _.find($scope.compensateInfo.feeDetail,{id:'03'});
                    medicalFee.remark = mtRegionalNameRemark.medicalFee;
                    //后续治疗费
                    var followUpFee = _.find($scope.compensateInfo.feeDetail,{id:'04'});
                    followUpFee.remark = mtRegionalNameRemark.followUpFee;
                    //住院伙食补助费
                    var foodSubsidy = _.find($scope.compensateInfo.feeDetail,{id:'06'});
                    foodSubsidy.remark = mtRegionalNameRemark.foodSubsidy;
                    //营养费
                    var nutritionFee = _.find($scope.compensateInfo.feeDetail,{id:'07'});
                    nutritionFee.remark = mtRegionalNameRemark.nutritionFee;
                    //误工费
                    var lossOfWorking = _.find($scope.compensateInfo.feeDetail,{id:'08'});
                    lossOfWorking.remark = mtRegionalNameRemark.lossOfWorking;
                    //护理费
                    var nursingFee = _.find($scope.compensateInfo.feeDetail,{id:'09'});
                    nursingFee.remark = mtRegionalNameRemark.nursingFee;
                    //残疾赔偿金
                    var disabilityFee = _.find($scope.compensateInfo.feeDetail,{id:'12'});
                    disabilityFee.remark = mtRegionalNameRemark.disabilityFee;
                    //残疾辅助器具费
                    var disabilityAids = _.find($scope.compensateInfo.feeDetail,{id:'13'});
                    disabilityAids.remark = mtRegionalNameRemark.disabilityAids;
                    //被抚养人生活费
                    var dependentsFee = _.find($scope.compensateInfo.feeDetail,{id:'14'});
                    dependentsFee.remark = mtRegionalNameRemark.dependentsFee;
                    //精神损害抚慰金
                    var mentalDamage = _.find($scope.compensateInfo.feeDetail,{id:'17'});
                    mentalDamage.remark = mtRegionalNameRemark.mentalDamage;
                    //死亡赔偿金
                    var deathFee = _.find($scope.compensateInfo.feeDetail,{id:'15'});
                    deathFee.remark = mtRegionalNameRemark.deathFee;
                    //丧葬费
                    var funeralExpenses = _.find($scope.compensateInfo.feeDetail,{id:'16'});
                    funeralExpenses.remark = mtRegionalNameRemark.funeralExpenses;
                    //处理事故人员误工费
                    var accidentPersonnel = _.find($scope.compensateInfo.feeDetail,{id:'80'});
                    accidentPersonnel.remark = mtRegionalNameRemark.accidentPersonnel;
                    //交通费
                    var trafficExpense = _.find($scope.compensateInfo.feeDetail,{id:'10'});
                    trafficExpense.remark = mtRegionalNameRemark.trafficExpense;
                    //住宿费
                    var hotelExpense = _.find($scope.compensateInfo.feeDetail,{id:'11'});
                    hotelExpense.remark = mtRegionalNameRemark.hotelExpense;
                    //财产损失
                    var propertyLoss = _.find($scope.compensateInfo.feeDetail,{id:'30'});
                    propertyLoss.remark = mtRegionalNameRemark.propertyLoss;
                    //车辆损失
                    var vehicleLoss = _.find($scope.compensateInfo.feeDetail,{id:'40'});
                    vehicleLoss.remark = mtRegionalNameRemark.vehicleLoss;
                    //拖车费
                    var trailerFee = _.find($scope.compensateInfo.feeDetail,{id:'50'});
                    trailerFee.remark = mtRegionalNameRemark.trailerFee;
                    //施救费
                    var rescueFee = _.find($scope.compensateInfo.feeDetail,{id:'70'});
                    rescueFee.remark = mtRegionalNameRemark.rescueFee;
                    //停车费
                    var parkingRate = _.find($scope.compensateInfo.feeDetail,{id:'60'});
                    parkingRate.remark = mtRegionalNameRemark.parkingRate;
                    //鉴定费
                    var appraisalFee = _.find($scope.compensateInfo.feeDetail,{id:'18'});
                    appraisalFee.remark = mtRegionalNameRemark.appraisalFee;
                    //其它费用
                    var otherExpenses = _.find($scope.compensateInfo.feeDetail,{id:'71'});
                    otherExpenses.remark = mtRegionalNameRemark.otherExpenses;
                }else{
                    if($scope.compensateInfo.feeDetail){
                        $scope.compensateInfo.feeDetail.forEach(function(val){
                            val.remark = "";
                        });
                    }

                }
            }
        });
    }

    //计算预填残疾赔偿金与死亡赔偿金的年限 [定残死亡日期与出生日期的关系]
    $scope.computePayYear = function(){
        //取第一个申请人的出生日期
        var applicant = $scope.compensateInfo.compensationApplyerInfoList.filter(function(v){
            return v.personType==0
        });
        if($scope.compensateInfo.deathDate && applicant[0].birthDay){
            //死亡赔偿金和伤残赔偿金赔偿年限
            var payYear = getDateYearSub($scope.compensateInfo.deathDate, applicant[0].birthDay);
            //循环计算器详细表
            $scope.compensateInfo.feeDetail.forEach(function(v) {
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

    $scope.options.calculate = function(isHandle) {
        //判断责任比
        //重置责任比例对象
        $scope.dutyRatio = {};
        //将每个责任人比率存入对象
        _.each($scope.compensateInfo.compensationApplyerInfoList, function(obj, i) {
            if($scope.showRespondentFilter(obj) && obj.responsibleRate) {
                $scope.dutyRatio[obj.personName+i] = obj.responsibleRate
            }
        });
        var total = 0;
        _.each($scope.dutyRatio, function (v,k) {
            total = total + parseInt(v);
        });
        if(total > 100) {
            $rootScope.toaster("error", "错误", "责任比例之和不可大于100%");
            return;
        }

        //当是手动点击计算按钮时，遍历费用项，检索数据是否修改
        if(isHandle) {
            $scope.compensateInfo.feeDetail.forEach(function (v) {
                if(v.isChecked) {
                    if(v.extraAmount) {
                        v.extraAmount = 0;
                    }
                    _.each(v.respondentList, function (k) {
                        if(_.find($scope.compensateInfo.compensationApplyerInfoList, {personName: k.personName})) {
                            v.extraAmount += parseInt(k.extraMoney);
                        }
                    })
                }
            });
            $scope.refreshTotal();
        }

        if (!$scope.compensateInfo.compensateTable) $scope.compensateInfo.compensateTable = [];
        if ($scope.compensateInfo.compensateTable.length)
            $scope.compensateInfo.compensateTable.splice(0, $scope.compensateInfo.compensateTable.length);
        var medicalLimits = 0;
        var deathLimits = 0;
        var propertyLimits = 0;
        // 一、计算侵权方交强险总保额
        var respondents = $scope.compensateInfo.compensationApplyerInfoList.filter(function(e) {
            return e.personType == 1 && e.riskTypes;
        });
        if (!respondents.length) {
            $rootScope.toaster("error", "错误", "请选择责任人!");
            return;
        }
        if(!$scope.compensateInfo.feeDetail){
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
                if(!v.insuranceForceCompany){
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

        //计算计算器中各项费用的总计
        $scope.compensateInfo.feeDetail.forEach(function(v) {
            if (v.isChecked) {
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
            }
        });

        //保险外金额计算(按申请人计算总和)
        var extraMoneyList = [];
        //调解时计算，诉讼时不计算
        $scope.compensateInfo.feeDetail.forEach(function (val){
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
                                extraMoney: parseFloat(k.extraMoney).toFixed(2),
                                personName: k.idType=='0'?k.personName:k.orgName,
                                personType: k.personType
                            });
                        }
                    }
                });
            }
        });

        //计算器计算规则
        //一、计算交强险
        //交强险赔付总金额
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
                $scope.compensateInfo.compensateTable.push({
                    payType: "1",
                    calcFormula: "",
                    calcIndemnitySum: (v.personPayDeathSum + v.personPayMedicalSum + v.personPayPropertySum + v.personPaySpiritSum) .toFixed(2),
                    companyName: v.insuranceForceCompany,
                    plateNo: v.plateNo,
                    idType: v.idType
                });
                //累加被告支付交强险计算总金额
                compulsoryInsuranceSum +=  v.personPayDeathSum + v.personPayMedicalSum +v.personPayPropertySum;
            }else{
                leftSpiritAmount = spiritAmount;
            }
        });

        //二、计算商业险
        //医疗费+死亡伤残+财产损失 - 总共支付交强险的费用= 剩余的资金由商业险按责任比例承担
        var leftPartSum = parseFloat(medicalAmount) + parseFloat(propertyAmount) + parseFloat(deathAmount) - parseFloat(compulsoryInsuranceSum);
        //保险公司支付商业险和被告支付的总金额
        var commercialInsuranceAndDefendantSum = 0.00;
        //剩余的交强险金额 +  剩余的精神抚慰金 + 保险公司全部承担的费用(停车费、鉴定费、其它费用)
        var noPaySum = leftPartSum  + leftSpiritAmount + bxSumAmount + noBxSumAmount;
        if(noPaySum > 0){
            //循环侵权人，计算每个侵权人商业险应该赔付的费用
            respondents.forEach(function(v) {
                //个人商业险赔付金额
                v.personBusinessIndemnitySum = 0.00;
                //剩余的保险公司赔付不了的金额 默认时所有
                v.leftCarAndAppraiseAndOtherSum = bxSumAmount;
                //表示为机动车并且有商业险
                if ("1" == v.isVehicle && v.riskTypes['1']) {
                    //如果交强险赔付完仍需要交强险进行赔付 或者保险公司有赔付（停车、鉴定、其它费用）
                    if(leftPartSum > 0 || bxSumAmount > 0){
                        if(leftPartSum > 0){
                            //如果被告的三者险金额 > 除交强险以外剩余应该赔付的金额 *  责任比例 *  三者险赔偿比例，则取后面的值
                            if (v.thirdParty > leftPartSum * v.responsibleRate / 100 * v.thirdPartyRate / 100) {
                                v.personBusinessIndemnitySum = leftPartSum * v.responsibleRate / 100 * v.thirdPartyRate / 100;
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
                        $scope.compensateInfo.compensateTable.push({
                            payType: "2",
                            calcFormula: "",
                            calcIndemnitySum: (v.personBusinessIndemnitySum + parseFloat(v.carAndAppraiseAndOtherSum)).toFixed(2),
                            companyName: v.insuranceBusinessCompany,
                            plateNo: v.plateNo,
                            idType: v.idType
                        });
                        //保险公司支付商业险总金额
                        commercialInsuranceAndDefendantSum += v.personBusinessIndemnitySum + v.carAndAppraiseAndOtherSum;
                    }
                }
                //责任比例内保险未赔完，由被告自行承担(个人按责任比例赔付、剩余的精神费用，剩余的保险公司赔付的金额)
                v.personPayAmount = (leftPartSum  + noBxSumAmount + leftSpiritAmount + v.leftCarAndAppraiseAndOtherSum)  * v.responsibleRate / 100 - v.personBusinessIndemnitySum;
                //保存被告自负担金额
                //被申请人自负保险范围外金额
                var claimantExtraMoneyObject = _.find(extraMoneyList,{personName: v.personName});
                var claimantExtraMoney = 0;
                if(claimantExtraMoneyObject){
                    claimantExtraMoney = parseFloat(claimantExtraMoneyObject.extraMoney);
                }
                if ((v.personPayAmount + claimantExtraMoney) > 0) {
                    $scope.compensateInfo.compensateTable.push({
                        payType: "3",
                        calcFormula: "",
                        calcIndemnitySum: (v.personPayAmount + claimantExtraMoney).toFixed(2),
                        personName: v.personName,
                        personType: v.personType,
                        idType: v.idType
                    });
                    //被告支付的总金额
                    commercialInsuranceAndDefendantSum += v.personPayAmount;
                }
            });
        }else{//保险外金额被告赔付
            respondents.forEach(function(v) {
                //被申请人自负保险范围外金额
                var claimantExtraMoneyObject = _.find(extraMoneyList,{personName: v.personName});
                var claimantExtraMoney = 0;
                if(claimantExtraMoneyObject){
                    claimantExtraMoney = claimantExtraMoneyObject.extraMoney;
                }
                if (claimantExtraMoney > 0) {
                    $scope.compensateInfo.compensateTable.push({
                        payType: "3",
                        calcFormula: "",
                        calcIndemnitySum: parseFloat(claimantExtraMoney).toFixed(2),
                        personName: v.idType=='0'?v.personName:v.orgName,
                        personType: v.personType,
                        idType: v.idType
                    });
                }
            });
        }

        //循环保险外支付的金额
        var applicantExtraSumMoney = 0;//取得申请人金额总和
        if(extraMoneyList != null){
            extraMoneyList.forEach(function(val){
                if(val.personType == '0'){
                    applicantExtraSumMoney += parseFloat(val.extraMoney);
                }
            });
        }

        //原告自行承担金额
        var plaintiffPayMoney = leftPartSum  + leftSpiritAmount + noBxSumAmount + bxSumAmount - commercialInsuranceAndDefendantSum + applicantExtraSumMoney;
        if (plaintiffPayMoney > 0) {
            var applicants = $scope.selectApplicantInArray();
            //被侵权方信息
            $scope.compensateInfo.compensateTable.push({
                payType: "3",
                calcFormula: "自已承担：" + plaintiffPayMoney,
                calcIndemnitySum: plaintiffPayMoney.toFixed(2),
                personName: applicants,
                personType: 0
            });
        }
    };

    $scope.selectApplicantInArray = function(){
        var applicants="";
        $scope.compensateInfo.compensationApplyerInfoList.filter(function(v){
            return v.personType=='0'
        }).forEach(function(v){
            if(!applicants){
                applicants += v.personName
            }else{
                applicants += ","+v.personName
            }
        })
        return applicants;
    };

    var calculateTimeout;
    //计算总和
    $scope.refreshTotal = function() {
        $scope.compensateInfo.applyTotal = 0.00;
        $scope.compensateInfo.lawMoney = 0.00;
        var checkedList = $scope.compensateInfo.feeDetail.filter(function(v) {
            return v.isChecked;
        });
        checkedList.forEach(function(v) {
            //残疾赔偿金或者死亡赔偿金
            if(v.id == "12" || v.id == "15"){
                if(v.applyPerUnit && v.applyUnit  && $scope.compensateInfo.compensateRate){
                    v.applyAmount = v.applyPerUnit * v.applyUnit * $scope.compensateInfo.compensateRate / 100;
                }
                if(v.claimPerUnit && v.claimUnit && $scope.compensateInfo.compensateRate){
                    v.claimAmount = v.claimPerUnit * v.claimUnit * $scope.compensateInfo.compensateRate / 100;
                }
            }
            if (v.applyAmount && parseFloat(v.applyAmount))
                $scope.compensateInfo.applyTotal += parseFloat(v.applyAmount);
            if (v.claimAmount  && parseFloat(v.claimAmount))
                $scope.compensateInfo.lawMoney += parseFloat(v.claimAmount);
            if(v.extraAmount && parseFloat(v.extraAmount)) {//计算保险外金额
                $scope.compensateInfo.lawMoney += parseFloat(v.extraAmount);
            }
        });

        $scope.compensateInfo.applyTotal = $scope.compensateInfo.applyTotal.toFixed(2);
        /*if($scope.compensateInfo.extraTotalLawMoney){
            $scope.compensateInfo.lawMoney = parseFloat($scope.compensateInfo.lawMoney) + parseFloat($scope.compensateInfo.extraTotalLawMoney);
        }*/
        $scope.compensateInfo.lawMoney = $scope.compensateInfo.lawMoney.toFixed(2);
        $scope.compensateInfo.residueTotal = $scope.compensateInfo.lawMoney - $scope.compensateInfo.paidTotal;

        if(calculateTimeout){
            $timeout.cancel(calculateTimeout);
        }

        calculateTimeout = $timeout(function () {
            $scope.options.calculate();
        }, 1000);
    };
    //点击checkbox触发的事件
    $scope.feeCheckChanged = function(fee, id) {
        if (fee.isChecked) {
            if (!$scope.compensateInfo.regionName) {
                $rootScope.toaster("error", "错误", "请选择赔偿地!");
                fee.isChecked = false;
                return;
            }
            if (!$scope.compensateInfo.standardYear) {
                $rootScope.toaster("error", "错误", "请选择赔偿年度!");
                fee.isChecked = false;
                return;
            }
        }
        if (["12", "13", "14", "15", "16"].indexOf(id) != -1 && fee.isChecked) {
            if (!$scope.compensateInfo.deathDate) {
                $rootScope.toaster("error", "错误", "请输入定残/死亡日期!");
                fee.isChecked = false;
                return;
            }
            if (!$scope.compensateInfo.compensateRate || $scope.compensateInfo.compensateRate ==0) {
                $rootScope.toaster("error", "错误", "请输入伤残赔偿系数!");
                fee.isChecked = false;
                return;
            }
            if (id == "12" || id == "13")
                $scope.compensateInfo.feeDetail.forEach(function(v) {
                    if (v.id == "15" || v.id == "16") v.isChecked = false;

                });
            else if (id == "15" || id == "16") {
                $scope.compensateInfo.feeDetail.forEach(function(v) {
                    if (v.id == "12" || v.id == "13") v.isChecked = false;
                });
            }
        }
        $scope.refreshTotal();
    };


    $scope.computeChange = function(fee, isForward) {

        //isForward true 乘法 false：除法
        if (isForward) {
            if(fee.template=='3' && (!$scope.compensateInfo.compensateRate || $scope.compensateInfo.compensateRate == 0)){
                $rootScope.toaster("error", "错误", "请认真填写伤残系数!");
                return false;
            }
            //申请金额
            if (fee.applyPerUnit && fee.applyUnit) {
                fee.applyAmount = fee.applyUnit * fee.applyPerUnit;
                //例如 残疾赔偿金得乘以系数
                if (fee.template == "3"){
                    fee.applyAmount *= ($scope.compensateInfo.compensateRate / 100);
                }
                fee.applyAmount = parseFloat(fee.applyAmount).toFixed(2);
            }
            //调解金额
            if (fee.claimPerUnit && fee.claimUnit) {
                fee.claimAmount = fee.claimUnit * fee.claimPerUnit;
                if (fee.template == "3"){
                    fee.claimAmount *= ($scope.compensateInfo.compensateRate / 100);
                }
                fee.claimAmount = parseFloat(fee.claimAmount).toFixed(2);
            }
        }else{
            //计算器除法（申请金额）
            if (fee.applyUnit && fee.applyAmount) {
                if(fee.applyUnit != 0){
                    fee.applyPerUnit = (fee.applyAmount / fee.applyUnit).toFixed(2);
                }else{
                    fee.applyPerUnit = 0;
                }
            }else{
                if(!fee.applyPerUnit)fee.applyPerUnit = 0;
                if(!fee.applyUnit)fee.applyUnit = 0;
            }
            //计算器除法（调解金额）
            if (fee.claimUnit && fee.claimAmount) {
                if(fee.claimUnit != 0){
                    fee.claimPerUnit = (fee.claimAmount / fee.claimUnit).toFixed(2);
                }else{
                    fee.claimPerUnit = "";
                }
            }else{
                if(!fee.claimUnit)fee.claimUnit = 0;
                if(!fee.claimPerUnit)fee.claimPerUnit = 0;
            }
        }
        //刷新计算
        $scope.refreshTotal();
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
        showOrHideWarning("06", $scope.compensateInfo.compensateStandard.hospitalFoodSubsidies);
        //营养费超过标准
        showOrHideWarning("07", $scope.compensateInfo.compensateStandard.thesePayments);
        //住宿费超过标准
        showOrHideWarning("11", $scope.compensateInfo.compensateStandard.accommodationFee);
        //残疾赔偿金超过标准
        showOrHideWarning("12", $scope.compensateInfo.compensateStandard[$scope.compensateInfo.household].income);
        //死亡赔偿金超过标准
        showOrHideWarning("15", $scope.compensateInfo.compensateStandard[$scope.compensateInfo.household].income);
        //丧葬费超过标准
        showOrHideWarning("16", $scope.compensateInfo.compensateStandard.funeralFeeStandard/12);
        //精神抚慰金超过标准
        showOrHideWarning("17", $scope.compensateInfo.compensateStandard.spiritualConsolationFee);
    };

    //切换停车费、鉴定费、其它费用
    $scope.selectBxShow = function(fee){
        fee.selectShow = !fee.selectShow;
        $scope.computeChange(fee,true);
    }

    $scope.addRespondentFilter = function(e) {
        var temp = e.responsibleRate ? e.responsibleRate == -1 : e.responsibleRate == 0 ? false : true;
        return e.personType == 1 && temp;
    };

    $scope.deleteRespondent = function(respondent) {
        respondent.responsibleRate = -1;
        respondent.riskTypes = undefined;
    };

    $scope.showRespondentFilter = function(e) {  //在申请人与被申请人中找出被申请人
        var temp = e.responsibleRate ? e.responsibleRate != -1 : e.responsibleRate == 0 ? true : false;
        return e.personType == 1 && temp;
    };

    //显示赔偿方列表
    $scope.addPerson = function(){
        var array = $scope.compensateInfo.compensationApplyerInfoList.filter(function(e){
            var temp = e.responsibleRate ? e.responsibleRate == -1 : e.responsibleRate == 0 ? false : true;
            return e.personType == 1 && temp;
        });
        if(!array || array.length == 0){
            $rootScope.toaster("warn", "警告", "责任承担被申请人已全部被选择!");
        }
    };

    $scope.responsibleRateChanged = function(respondent) {
        if (respondent.responsibleRate > 100) respondent.responsibleRate = 100;
        if (respondent.responsibleRate < 0) respondent.responsibleRate = 0;

        //将责任人填入对象，在保存时验证责任比率
        $scope.dutyRatio[respondent.personName] = respondent.responsibleRate;
        var firstPerson = _.find($scope.compensateInfo.compensationApplyerInfoList, function(obj) {
            return obj.responsibleRate
        });
        if(firstPerson){
            $scope.dutyRatio[firstPerson.personName] = firstPerson.responsibleRate;
        }
    };

    $scope.thirdPartyChanged = function(respondent){
        if (parseFloat(respondent.thirdParty) < 0) respondent.thirdParty = 0;
    }

    $scope.thirdPartyFranchiseChanged = function(respondent) {
        if (respondent.thirdPartyFranchise > 100) respondent.thirdPartyFranchise = 100;
        if (respondent.thirdPartyFranchise < 0) respondent.thirdPartyFranchise = 0;
        if (respondent.thirdPartyFranchise <= 100 && respondent.thirdPartyFranchise >= 0)
            respondent.thirdPartyRate = 100 - respondent.thirdPartyFranchise;
        $scope.options.calculate();
    }

    $scope.thirdPartyRateChanged = function(respondent) {
        if (respondent.thirdPartyRate > 100) respondent.thirdPartyRate = 100;
        if (respondent.thirdPartyRate < 0) respondent.thirdPartyRate = 0;
        if (respondent.thirdPartyRate <= 100 && respondent.thirdPartyRate >= 0)
            respondent.thirdPartyFranchise = 100 - respondent.thirdPartyRate;
    }

    //加入赔偿方
    $scope.addRespondent = function(compensationApplyerInfo) {
        compensationApplyerInfo.responsibleRate = 0;
        compensationApplyerInfo.isVehicle = compensationApplyerInfo.plateNo ? "1" : "0";
        compensationApplyerInfo.riskTypes = {
            "0": compensationApplyerInfo.plateNo?true:false,
            "1": false,
            "2": false
        };
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

    $scope.riskTypeChanged = function(respondent, riskType) {
        if (riskType == "0") {
            if (!respondent.riskTypes['0'])
                respondent.riskTypes['1'] = false;
        } else if (riskType == "1") {
            if (!respondent.riskTypes['1'])
                respondent.riskTypes['2'] = false;
            else
                respondent.riskTypes['0'] = true;
        } else {
            if (respondent.riskTypes['2']) {
                respondent.riskTypes['0'] = respondent.riskTypes['1'] = true;
                respondent.thirdPartyFranchise = 0;
                respondent.thirdPartyRate = 100;
            }else{
                respondent.thirdPartyFranchise = "";
                respondent.thirdPartyRate = 0;
            }
        }
    };

    //调解结果生成
    $scope.adjustResultChanged = function(x) {
        //申请人拼接
        /*var applicants = $scope.compensateInfo.compensationApplyerInfoList.filter(function(v) {
            return v.personType == 0;
        }).map(function(v) {
            v.personName;
        }).join('、');*/

        var applicants = _.map($scope.compensateInfo.compensationApplyerInfoList.filter(function(v) {
          return v.personType == 0;
        }), function(v) {
          return v.personName;
        }).join('、');

        var arr = $scope.compensateInfo.compensationApplyerInfoList.filter(function(v) {
          return v.personType == 0;
        })

        //被申请人拼接
        /*var responses = $scope.compensateInfo.compensationApplyerInfoList.filter(function(v) {
            return v.personType == 1;
        }).map(function(v) {
            return v.personName;
        }).join('、');*/

      var responses = _.map($scope.compensateInfo.compensationApplyerInfoList.filter(function(v) {
        return v.personType == 1;
      }), function (v) {
        return v.personName;
      }).join('、');

      var feeDetailList = [];
        if($scope.compensateInfo.feeDetail){
            $scope.compensateInfo.feeDetail.forEach(function(val){
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

        var payDate = "当场付清。"
        var applicantCurrent = $scope.compensateInfo.compensationApplyerInfoList.filter(function(val){
            return val.personType == '1';
        });

        //第一套模板
        var template = "由赔偿方{{name}}";
        if(applicantCurrent[0].isVehicle == '1'){
            template += "在保险责任范围内";
        }
        template += "按责赔偿索赔方" + applicants + "本次交通事故造成的损失" + feeDetail + "合计{{amount}}元，{{payMoneyStr}}" + payDate;
        //第二套模板
        var templateNew = "由赔偿方{{name}}赔偿索赔方" + applicants + "本次交通事故造成的损失合计{{amount}}元，{{payMoneyStr}}" + payDate;
        //第三套模板
        var str = "索赔方" + applicants + "自愿放弃其他诉讼请求，就本次交通事故赔偿事宜一次性处理结案，今后双方互不追究任何责任。";
        //南京模式模板
        var templateNj = "由赔偿方"+responses+"按责赔偿索赔方" + applicants + "本次交通事故造成的损失" + feeDetail + "合计{{amount}}元，{{payMoneyStr}}" + payDate;
        //南京新增模板
        var templateNjNew = "上述赔偿款由赔偿方"+responses+"支付完毕后自行向{{name}}理赔。";

        var companies = _.groupBy($scope.compensateInfo.compensateTable, 'companyName');
        var arr = [];
        var jqCompany = "";
        var companyIndex = 0;
        for (var i in companies) {
            if (i != "undefined") {
                var company = companies[i];
                var amount = company.reduce(function(sum, item) {return sum + parseFloat(item.calcIndemnitySum)}, 0);

                if(companyIndex == 0){
                    jqCompany = company[0].companyName
                }
                companyIndex ++;
                arr.push({
                    name: i,
                    amount: amount? amount.toFixed(2):0,
                    payFlag:true
                });
            } else delete companies[i];
        }

        //南京模式 如果只有保险公司承担时采取新的模式 判断依据为payType== 3 的个数大于2时走特殊情况
        var newModelFlag = 0;
        $scope.compensateInfo.compensateTable.forEach(function(v) {
            if(v.payType== 3){
                newModelFlag ++;
            }
            //personType :1  被申请人
            if (v.personType == 1) {
                var payMoney = _.find($scope.compensateInfo.compensationApplyerInfoList,{personName: v.personName})? _.find($scope.compensateInfo.compensationApplyerInfoList,{personName: v.personName}).payMoney : _.find($scope.compensateInfo.compensationApplyerInfoList,{personName: v.personName});
                var payMoneyStr = "";
                if(payMoney){
                    if(parseFloat(payMoney) < parseFloat(v.calcIndemnitySum)){
                        payMoneyStr = "扣除赔偿方"+v.personName+"已垫付的"+payMoney+"元，尚余"+(v.calcIndemnitySum-payMoney)+"元，";
                    }else if(parseFloat(payMoney) > parseFloat(v.calcIndemnitySum)){
                        payMoneyStr = "扣除赔偿方"+v.personName+"已垫付的"+payMoney+"元，索赔方"+jqCompany+"在保险责任范围内按责返还赔偿方"+ v.personName+(payMoney-v.calcIndemnitySum)+"元，";
                    }
                }
                arr.push({
                    "name": v.personName,
                    "amount": v.calcIndemnitySum,
                    "payMoneyStr":payMoneyStr
                });
            }
        });

        //如果保险公司在保险中已经赔付，当事人仍然垫付的 或者保险公司也赔付不够，不存在此人赔付仍然赔付的
        $scope.compensateInfo.compensationApplyerInfoList.forEach(function(v) {
            if (v.personType == 1) {
                var obj = _.find($scope.compensateInfo.compensateTable,{personName: v.personName});
                var payMoneyStr = "";
                if(v.payMoney && !obj){
                    payMoneyStr = "由索赔方"+jqCompany+"在保险责任范围内按责返还赔偿方"+v.personName+"垫付的费用合计"+ v.payMoney+"元，"+payDate;
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
        $scope.compensateInfo.compensateResultRemark = "";
        var numberMap = {
            "index_1": "一",
            "index_2": "二",
            "index_3": "三",
            "index_4": "四",
            "index_5": "五",
            "index_6": "六",
            "index_7": "七",
            "index_8": "八",
            "index_9": "九",
            "index_0": "十"
        };
        //根据数组返回当前序号
        var getIndexFun = function (index) {
            index++;
            var indexArr = index.toString().split('');
            var text = "";
            var len = indexArr.length;
            if(len>1) {//多余个位数时
                if(index == 10) {
                    indexArr = ["0"];
                } else if(index > 10 && index < 20) {
                    indexArr.splice(0, 1, '0');
                } else if(indexArr[indexArr.length-1] == 0) {
                    indexArr = indexArr;
                } else {
                    indexArr.splice(1, 0, '0');
                }
            }
            _.each(indexArr, function (v) {
                text+= numberMap['index_'+v]; //个位
            });
            return text;
        };
        if((newModelFlag >=2 || newModelFlag == 1) ){
            var lastIndex;
            arr.forEach(function(v,index) {
                lastIndex = index;
                //表明是保险公司企业 v.payFlag = true
                if(v.payFlag){
                    $scope.compensateInfo.compensateResultRemark += getIndexFun(index) +"、"+$interpolate(template)(v) + "\r\n";
                }else{
                    //表示是个人person //如果保险公司在保险中已经赔付，当事人仍然垫付的 或者保险公司也赔付不够，不存在此人赔付仍然赔付的
                    if(v.flag){
                        $scope.compensateInfo.compensateResultRemark += getIndexFun(index) +"、"+ v.payMoneyStr + "\r\n";
                    }else{
                        $scope.compensateInfo.compensateResultRemark += getIndexFun(index) +"、"+$interpolate(templateNew)(v) + "\r\n";
                    }
                }
            });
            $scope.compensateInfo.compensateResultRemark += getIndexFun(lastIndex+1)+"、"+str;
        }else{
            arr.forEach(function(v,index) {
                //表明是保险公司企业 v.payFlag = true
                if(v.payFlag){
                    $scope.compensateInfo.compensateResultRemark += "一、"+$interpolate(templateNj)(v) + "\r\n";
                    $scope.compensateInfo.compensateResultRemark += "二、"+$interpolate(templateNjNew)(v) + "\r\n";
                    $scope.compensateInfo.compensateResultRemark += "三、"+str;
                }
            });
        }
    };


    //处理已付金额
    $scope.queryPayMoney = function(){
        var payMoney = $modal.open({
            templateUrl: 'views/pages/mediation_platform/litigation_mediation/payMoney.html',
            controller: 'PayMoneyCtrl',
            size: 'md',
            resolve: {
                items: function() {
                    return {
                        adjust: $scope.compensateInfo,
                        claimFlag:true//赔付计算起
                    }
                }
            }
        });
        payMoney.result.then(function(){
            $scope.refreshTotal();
        });
    };

    //处理保险外金额
    $scope.handleExtraAmount = function(fee){
        fee.isChecked = true;  //让当前项被选中
        var handleExtraAmountModel = $modal.open({
            templateUrl: 'views/pages/mediation_platform/litigation_mediation/extraAmount.html',
            controller: 'ExtraAmountCtrl',
            backdrop:'static',
            size: 'md',
            resolve: {
                items: function() {
                    return {
                        fee: fee,
                        adjust: $scope.compensateInfo,
                        claimFlag:true//赔付计算器
                    }
                }
            }
        });

        handleExtraAmountModel.result.then(function(){
            $scope.refreshTotal();
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
                        adjust: $scope.compensateInfo
                    }
                }
            }
        });

        addNursingFeeModel.result.then(function(){
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

    //伤残等级鉴定
    $scope.showRankAppraisal = function () {
        var id = $scope.compensateInfo.id;
        var url = $state.href('rankAppraisal');
        window.open(url+'?id='+id+'&serialNo='+$scope.compensateInfo.serialNo+'&flag=2', '_blank');
    };
});

//原生js调用angular中的scope参数  （伤残等级鉴定页面调用）
function saveRankAppraisal(count, descrId){
  //通过元素id来获取Angular应用
  var appElement = document.getElementById('CompensateCalculateStep3');
  //获取$scope变量
  var $scope = angular.element(appElement).scope();
  //调用$scope中的方法与赋值
  $scope.compensateInfo.compensateRate = count;
  //将descrId数组赋值给主键
  $scope.compensateInfo.disabilityGradeId  = descrId.join(',');
  //上一行改变了msg的值，如果想同步到Angular控制器中，则需要调用$apply()方法即可
  $scope.$apply();
}