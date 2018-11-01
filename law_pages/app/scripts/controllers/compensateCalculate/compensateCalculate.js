angular.module('sbAdminApp').controller('CompensateCalculateCtrl', function($scope, $modal,$log,toaster,$state,$stateParams,CompensateService,AdjustConfig,$location,DictionaryConfig,$filter,$rootScope) {
    //判断是否是详细列表（隐藏底部按钮）
    $scope.isDetail = true;
    if(window.location.href.indexOf('compensateCalculateDetail') !== -1) {
        $scope.isDetail = false;
    }

    //定义页面对象
    $scope.options = {
        step: $stateParams.step || 1,
        mainFlow: true,
        lblRespondent: "被申请人"
    };
    //存储责任比率对象
    $scope.dutyRatio = {};
    //赔偿主表信息
    function CompensateInfo(){
        //主键
        this.id = "";
        //赔偿状态 1.赔偿中  2.赔偿结束
        this.state = '1';
        //索赔方
        this.applicant = "";
        //赔偿方
        this.respondent = "";
        //赔偿标准默认 农村
        this.household = "1";
        //费用详情
        this.feeDetail = angular.copy(DictionaryConfig.feeTypeList).filter(function(v){
            return v.type == '1';
        });
        //费用列表TABLE
        this.compensateTable = [];
        //赔付标准
        this.compensateStandard = [];
        //总数
        this.paidTotal = 0;
    }
    //赔偿人信息（包括索赔方与赔偿方）
    function CompensationApplyer(personType){
        //主键
        this.id = "";
        //赔偿人 0：索赔 1：赔偿
        this.personType = personType;
        //用户类型
        this.idType = "0";
        //案件状态 1：赔付中 2：赔付完成
        this.state = "1";
    }
    //请求后台，获取之前保存的数据
    $scope.initData = function () {
        //判断是否有id（是否是赔偿查询跳转来的）
        if($stateParams && $stateParams.id){
            //调用接口
            CompensateService.queryCompensateInfo({id: $stateParams.id}).success(function (res) {
                if (res.code === AdjustConfig.commonConStant.SUCCESS) {
                    $scope.compensateInfo = res.result;
                    //过滤信息
                    filterQuery();
                } else {
                    //请求失败
                    $rootScope.toaster("error", "错误", res.message);
                }
            })
        } else {
            //创建主表对象
            $scope.compensateInfo = new CompensateInfo();
            //存储索赔方与赔偿方人员信息
            $scope.compensateInfo.compensationApplyerInfoList = [];
            //新建索赔方对象
            $scope.compensateInfo.compensationApplyerInfoList.push(new CompensationApplyer("0"));
            //新建赔偿方对象
            $scope.compensateInfo.compensationApplyerInfoList.push(new CompensationApplyer("1"));

        }
    };
    //处理日期
    function parseISO8601(dateStringInRange) {
        var isoExp = /^\s*(\d{4})-(\d\d)-(\d\d) (\d{2}):(\d{2}):(\d{2})\s*$/,
            date = new Date(NaN), month,
            parts = isoExp.exec(dateStringInRange);

        if(parts) {
            month = +parts[2];
            date.setFullYear(parts[1], month - 1, parts[3]);
            if(month != date.getMonth() + 1) {
                date.setTime(NaN);
            }
        }
        return date;
    }
    //过滤查询
    function filterQuery(){
        if ($scope.compensateInfo.compensateStandard && typeof $scope.compensateInfo.compensateStandard == 'string') $scope.compensateInfo.compensateStandard = JSON.parse($scope.compensateInfo.compensateStandard);
        if ($scope.compensateInfo.compensateTable && typeof $scope.compensateInfo.compensateTable == 'string') $scope.compensateInfo.compensateTable = JSON.parse($scope.compensateInfo.compensateTable);
        if ($scope.compensateInfo.feeDetail && typeof $scope.compensateInfo.feeDetail == 'string') $scope.compensateInfo.feeDetail = JSON.parse($scope.compensateInfo.feeDetail);
        if ($scope.compensateInfo.deathDate) $scope.compensateInfo.deathDate = parseISO8601($scope.compensateInfo.deathDate);
        //处理投保险种
        $scope.compensateInfo.compensationApplyerInfoList.forEach(function(v) {
            if (v.riskTypes && (typeof v.riskTypes == 'object')) v.riskTypes = JSON.parse(v.riskTypes);
            console.log(v.riskTypes)
        });
    }
    $scope.initData();

    //添加索赔方与赔偿方
    $scope.addCompensationApplyer = function (personType) {
        $scope.compensateInfo.compensationApplyerInfoList.push(new CompensationApplyer(personType))
    };

    //处理索赔方和赔偿方人员以逗号隔开
    function handleApplicantAndRespondent(personType){
        var returnStr =  $scope.compensateInfo.compensationApplyerInfoList.filter(function(val){
            return  val.personType == personType;
        }).map(function(v) {
            return v.personName;
        }).join('、');

        return returnStr;
    }

    //内部常量
    $scope.CONSTANT = {
        "messageApplicantNameNull": "索赔方名称不能为空",
        "messageRespondentNameNull": "赔偿方名称不能为空",
        "messageSuccess":"恭喜您，保存成功！",
        "messageRespondentPlateNoError": "车牌号格式有误"
    };

    //验证索赔方与赔偿方的信息
    function validateFormStep12(){
        var compensationApplyerInfoList = $scope.compensateInfo.compensationApplyerInfoList.filter(function(v) {
            return $scope.options.step - 1 == v.personType;
        });
        //循环验证
        var plateTest = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[警京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼]{0,1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/;
        for (var i=0; i < compensationApplyerInfoList.length;i++) {
            var compensationApplyerInfo = compensationApplyerInfoList[i];
            compensationApplyerInfo.personNameError = false;
            if (!compensationApplyerInfo.personName) {
                compensationApplyerInfo.personNameError = true;
                if($scope.options.step == 1){//索赔方
                    $rootScope.toaster(DictionaryConfig.levelConstant.warn, DictionaryConfig.titleConstant.warn, $scope.CONSTANT.messageApplicantNameNull);
                }else{//赔偿方
                    $rootScope.toaster(DictionaryConfig.levelConstant.warn, DictionaryConfig.titleConstant.warn, $scope.CONSTANT.messageRespondentNameNull);
                }
                return false;
            }
            //当输入车牌号时，验证车牌号
            compensationApplyerInfo.plateNoError = false;
            if(compensationApplyerInfo.plateNo && !(plateTest.test(compensationApplyerInfo.plateNo))) {
                compensationApplyerInfo.plateNoError = true;
                $rootScope.toaster(DictionaryConfig.levelConstant.warn, DictionaryConfig.titleConstant.warn, $scope.CONSTANT.messageRespondentPlateNoError);
                return false;
            }
        }
        return true;
    }
    //保存过滤功能
    function filterParam(compensateInfo) {
        compensateInfo.compensationApplyerInfoList.forEach(function(v) {
            if (v.riskTypes && (typeof v.riskTypes == 'object')) v.riskTypes = JSON.stringify(v.riskTypes);
            console.log(v.riskTypes)
        });
        if (compensateInfo.compensateStandard && compensateInfo.compensateStandard instanceof Object) compensateInfo.compensateStandard = JSON.stringify(compensateInfo.compensateStandard);
        if (compensateInfo.compensateTable && compensateInfo.compensateTable instanceof Object) compensateInfo.compensateTable = JSON.stringify(compensateInfo.compensateTable);
        if (compensateInfo.feeDetail && compensateInfo.feeDetail instanceof Object) compensateInfo.feeDetail = JSON.stringify(compensateInfo.feeDetail);
        if (compensateInfo.deathDate) compensateInfo.deathDate = $filter('date')(compensateInfo.deathDate, 'yyyy-MM-dd HH:mm:ss');
    }
    //验证责任比例
    $scope.verificationDutyProportion = function () {
        $scope.showRespondentFilter = function(e) {
            var temp = e.responsibleRate ? e.responsibleRate != -1 : e.responsibleRate == 0 ? true : false;
            return e.personType == 1 && (e.idType == '0' || e.idType == '2' || (e.idType == '1' && e.enterpriseType != '1')) && temp;
        };
        //重置责任比例对象
        $scope.dutyRatio = {};
        //将每个责任人比率存入对象
        console.log($scope.compensateInfo.compensationApplyerInfoList);
        _.each($scope.compensateInfo.compensationApplyerInfoList, function(obj,i) {
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
            return false;
        }
        return true;
    };
    //保存数据
    $scope.saveCompensateInfo = function (goState,saveFlag) {
        console.log($scope.compensateInfo)
        //当是第三步时，验证责任比例
        if($scope.options.step == 3 && !$scope.verificationDutyProportion()) {
            return;
        }
        //表示跳转第二步
        var isGoStep2 = goState ? true: false;
        //跳转下一步状态
        goState = goState || function() {};
        //处理索赔方以逗号分隔
        $scope.compensateInfo.applicant =  handleApplicantAndRespondent('0');
        //处理赔偿方以逗号分隔
        $scope.compensateInfo.respondent =  handleApplicantAndRespondent('1');
        //过滤功能（将json数据转换成js对象）
        var compensateInfo = angular.copy($scope.compensateInfo);
        filterParam(compensateInfo);
        //当是结束按钮时，更改结束状态为2
        if(saveFlag === 'over') {
            compensateInfo.state = '2';
        }
        //将数据保存到后台
        CompensateService.saveCompensateInfo(compensateInfo).success(function (result) {
            if (result.code === AdjustConfig.commonConStant.SUCCESS) {
                //存储保存后的案件id
                console.log(result.result);
                $scope.compensateInfo.id = result.result.id;
                //保存每个索赔、赔偿方信息
                $scope.compensateInfo.compensationApplyerInfoList = result.result.compensationApplyerInfoList;
                //如果保存成功
                if(saveFlag && saveFlag !== 'over'){
                    $rootScope.toaster(DictionaryConfig.levelConstant.success, DictionaryConfig.titleConstant.success,$scope.CONSTANT.messageSuccess );
                }
                //地址栏的地址如果有//则表示是新建，防止刷新丢失页面
                if($location.url().indexOf("//") > -1) {
                    //如果跳转第二步
                    if(isGoStep2){
                        $location.url("/dashboard/compensateCalculate/"+$scope.compensateInfo.id+"/compensateCalculateStep12/2");
                    }else{
                        $location.url("/dashboard/compensateCalculate/"+$scope.compensateInfo.id+"/compensateCalculateStep12/1");
                    }
                    return;
                }
                //保存成功跳转下一步状态
                goState();
            } else {
                $rootScope.toaster("error", "错误", result.message);
            }
        });
    };
    //下一步
    $scope.nextStep = function() {
        //索赔方和赔偿方验证
        if (($scope.options.step == 1 || $scope.options.step == 2) && validateFormStep12()) {
            $scope.saveCompensateInfo(function() {
                if ($scope.options.step == 1){
                    $state.go('dashboard.compensateCalculate.compensateCalculateStep12', {step: 2});
                }else{
                    $state.go('dashboard.compensateCalculate.compensateCalculateStep3');
                }
            });
        }
    };

    //上一步
    $scope.preStep = function () {
        if ($scope.options.step == 2) {
            $state.go('dashboard.compensateCalculate.compensateCalculateStep12',{step: 1});
        } else if ($scope.options.step == 3) {
            $state.go('dashboard.compensateCalculate.compensateCalculateStep12',{step: 2});
        }
    };

    //结束
    $scope.compensateInfoOver = function () {
        $scope.saveCompensateInfo(function () {
            if(confirm('确认要结束计算吗？')) {
              $state.go('dashboard.compensateCalculate.pendingComplete');
            }
        }, 'over')
    };

    //页面左侧添加按钮显示隐藏
    $('#addApplicantBtn').on('mouseenter', function () {
        $(this).stop().animate({right: '-5px'}, 300)
    });
    $('#addApplicantBtn').on('mouseleave', function () {
        $(this).stop().animate({right: '-92px'}, 300)
    });

    //定义页面顶部样式对象
    $scope.step = {
        step1Ok: function() {
            return Boolean($scope.options.step > 1);
        },
        step1ing: function() {
            return Boolean($scope.options.step === 1);
        },
        step2Ok: function () {
            return Boolean($scope.options.step > 2);
        },
        step2ing: function () {
            return Boolean($scope.options.step === 2);
        },
        step2: function () {
            return Boolean($scope.options.step < 2);
        },
        step3ing: function () {
            return Boolean($scope.options.step === 3);
        },
        step3: function () {
            return Boolean($scope.options.step < 3);
        }
    };

});

   