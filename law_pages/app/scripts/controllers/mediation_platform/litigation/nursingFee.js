/**
 * Created by shenwei on 2017/12/13.
 */
var app = angular.module('sbAdminApp');
app.controller('NursingFeePopupCtrl', function($scope, DictionaryConfig, $state, $modal, items, $modalInstance, toaster,$log,LoginConfig,LoginService,$rootScope) {

    //查询行业标准数据
    $scope.queryIndustryIncomeNormByNameAndDateAndTypeCodeService = LoginService.queryIndustryIncomeNormByNameAndDateAndTypeCode;
    //查询行业集合
    $scope.queryJyIndustryNameInfoService = LoginService.queryJyIndustryNameInfo;
    //fee.id:08 误工费  09：护理费
    $scope.fee = items.fee;
    if($scope.fee.id == '08'){
        $scope.title = "误工费";
    }else if($scope.fee.id == '09'){
        $scope.title = "护理费";
    }else if($scope.fee.id == '80'){
        $scope.title = "处理事故人员误工费";
    }
    $scope.val = items.val;
    $scope.adjust = items.adjust;
    //城市
    //暂时不显示农村城镇标准
    //var householdStr =  $scope.adjust.household == '1'?"农村":"城镇";
    var householdStr = "";
    var cityStr = $scope.title + "：" + $scope.adjust.regionName+$scope.adjust.standardYear+ "年" +householdStr+"标准：";
    //查询行业集合
    $scope.industryList = [];
    $scope.queryJyIndustryNameInfoService({}).success(function(result) {
        //请求成功
        if (result.code == LoginConfig.commonConStant.SUCCESS) {
            $scope.industryList = result.result;
        }else{
          $rootScope.toaster("error", "错误", "请联系系统管理员!");
        }
    });

    //封装查询条件
    function IndustryIncomeNorm(){
        //区域名称
        this.	regionName = $scope.adjust.regionName;
        //赔偿年份
        this.searchStartDate = $scope.adjust.standardYear;
        //行业代码
        this.industryTypeCode = "";
    }

    //计算总数
    $scope.calculateNursingFee = function(nursingFee,flag){
        //表示输入某一单个项目
        if(flag){
            //如果都存在，系统自动计算
            if(nursingFee.perMoney && nursingFee.day && nursingFee.person){
                nursingFee.sumMoney =  (parseFloat(nursingFee.perMoney) * parseFloat(nursingFee.day) * parseFloat(nursingFee.person)).toFixed(2);
            }
        }else{
            //通过总金额进行反算结果
            if(nursingFee.day && nursingFee.person){
                nursingFee.perMoney =  (parseFloat(nursingFee.sumMoney)/(parseFloat(nursingFee.day) * parseFloat(nursingFee.person))).toFixed(2);
            }
        }
        //计算总金额
        var totalMoney = 0;
        $scope.nursingFeeList.forEach(function(m){
            if(m.sumMoney){
                totalMoney += parseFloat(m.sumMoney);
            }
        });
        if($scope.val == 'apply'){
            $scope.fee.applyAmount = totalMoney.toFixed(2);
        }else{
            $scope.fee.claimAmount = totalMoney.toFixed(2);
        }

        if($scope.val == 'claim'){
            //没有固定收入 按标准进行填写
            nursingFee.isClaimWarningFlag = false;
            if(nursingFee.isIncome == '2'){
                //误工费和处理人误工费和护理费
                if(parseFloat(nursingFee.perMoney) > parseFloat(nursingFee.standardMoney)){
                    nursingFee.isClaimWarningFlag = true;
                }
            }else{//有固定收入
                if(nursingFee.proofType == "1" && nursingFee.isIncome && nursingFee.standardMoney && nursingFee.perMoney){
                    if(parseFloat(nursingFee.perMoney) > parseFloat(nursingFee.standardMoney)){
                        nursingFee.isClaimWarningFlag = true;
                    }
                }
            }
        }
    };
    // 标准提示显示隐藏
    $scope.showFlag = function(nursingFee){
        if ( nursingFee.proofType == 2 ) {
            nursingFee.standardMoney='';
        }

    }
    //切换行业触发的事件
    $scope.changeIndustry = function(nursingFee){

        var industryIncomeNorm = new IndustryIncomeNorm();
        industryIncomeNorm.industryTypeCode = nursingFee.industry;
        //根据赔偿地、赔偿年限、行业类型查询标准
        $scope.queryIndustryIncomeNormByNameAndDateAndTypeCodeService(industryIncomeNorm).success(function(result) {
            //请求成功
            if (result.code == LoginConfig.commonConStant.SUCCESS) {
                //如果存在则查询平均月收入以及平均年收入
                $log.info(result.result);
                if(result.result && result.result.yearIncome){
                    nursingFee.perMoney = (parseFloat(result.result.yearIncome)/365).toFixed(2);
                    //赋予行业标准值
                    nursingFee.standardMoney = angular.copy(nursingFee.perMoney);
                    $scope.calculateNursingFee(nursingFee,true);
                    //行业标准
                    nursingFee.warningText = cityStr + nursingFee.standardMoney +"元/天";
                }else{
                    nursingFee.standardMoney = "";
                    nursingFee.warningText = "";
                }
            }else{
              $rootScope.toaster("error", "错误", "请联系系统管理员!");
            }
        });
    }


    //护理费或者误工费对象
    function NursingFee() {
        this.id = 0;
        //是否有固定收入
        this.isIncome = "";
        //证明类型
        this.proofType = "";
        //所属行业
        this.industry = "";
        //每天金额
        this.perMoney = "";
        //天数
        this.day = "";
        //人数
        this.person = 1;
        //总金额
        this.sumMoney = "";
    }

    //误工费
    if($scope.fee.id == '08'){
        //表示申请
        if($scope.val == 'apply'){
            //如果护理费不存在，则新增一条记录
            if(!$scope.fee.tardyFeeList || $scope.fee.tardyFeeList.length == 0){
                $scope.fee.tardyFeeList = [];
                $scope.fee.tardyFeeList.push(new NursingFee());
            }
            $scope.nursingFeeList = $scope.fee.tardyFeeList;
        }else{//表示调解
            //如果护理费不存在，则新增一条记录
            if(!$scope.fee.tardyFeeClaimList || $scope.fee.tardyFeeClaimList.length == 0){
                $scope.fee.tardyFeeClaimList = [];
                $scope.fee.tardyFeeClaimList.push(new NursingFee());
            }
            $scope.nursingFeeList = $scope.fee.tardyFeeClaimList;
        }
    }else if($scope.fee.id == '09'){//护理费
        //表示申请
        if($scope.val == 'apply'){
            //如果护理费不存在，则新增一条记录
            if(!$scope.fee.nursingFeeList || $scope.fee.nursingFeeList.length == 0){
                $scope.fee.nursingFeeList = [];
                $scope.fee.nursingFeeList.push(new NursingFee());
            }
            $scope.nursingFeeList = $scope.fee.nursingFeeList;
        }else{//表示调解
            //如果护理费不存在，则新增一条记录
            if(!$scope.fee.nursingFeeClaimList || $scope.fee.nursingFeeClaimList.length == 0){
                $scope.fee.nursingFeeClaimList = [];
                $scope.fee.nursingFeeClaimList.push(new NursingFee());
            }
            $scope.nursingFeeList = $scope.fee.nursingFeeClaimList;
        }
    }else if($scope.fee.id == '80'){//处理事故人员误工费
        //表示申请
        if($scope.val == 'apply'){
            //如果处理事故人员误工费不存在，则新增一条记录
            if(!$scope.fee.handleTardyFeeList || $scope.fee.handleTardyFeeList.length == 0){
                $scope.fee.handleTardyFeeList = [];
                $scope.fee.handleTardyFeeList.push(new NursingFee());
            }
            $scope.nursingFeeList = $scope.fee.handleTardyFeeList;
        }else{//表示调解
            //如果处理事故人员误工费不存在，则新增一条记录
            if(!$scope.fee.handleTardyFeeClaimList || $scope.fee.handleTardyFeeClaimList.length == 0){
                $scope.fee.handleTardyFeeClaimList = [];
                $scope.fee.handleTardyFeeClaimList.push(new NursingFee());
            }
            $scope.nursingFeeList = $scope.fee.handleTardyFeeClaimList;
        }
    }
    //证明类型集合
    $scope.proofTypeList = [{
        "id":"1",
        "value":"按行业"
    },{
        "id":"2",
        "value":"按收入类型"
    }];

    //添加护理费
    $scope.addNursingFee = function(){

        var nursingFee = new NursingFee();
        var length = $scope.nursingFeeList.length;
        if(length == 0){
            nursingFee.id = 0;
        }else{
            nursingFee.id = parseInt($scope.nursingFeeList[length - 1].id)+ 1;
        }
        $scope.nursingFeeList.push(nursingFee);
    };
    //删除护理费
    $scope.delNursingFee = function(nursingFee){
        var nursingIndex = _.findIndex($scope.nursingFeeList,{id:nursingFee.id});
        $scope.nursingFeeList.splice(nursingIndex, 1);

        //计算总金额
        var totalMoney = 0;
        $scope.nursingFeeList.forEach(function(m){
            if(m.sumMoney){
                totalMoney += parseFloat(m.sumMoney);
            }
        });
        if($scope.val == 'apply'){
            $scope.fee.applyAmount = totalMoney.toFixed(2);
        }else{
            $scope.fee.claimAmount = totalMoney.toFixed(2);
        }
    };
    //取消
    $scope.cancel = function() {
        $modalInstance.close({});
    };

    //fee.id:08 误工费  09：护理费
    //切换是否有固定收入
    $scope.changeIsIncome = function(nursingFee){

        //有固定收入
        if(nursingFee.isIncome == '1'){
            $scope.changeIndustry(nursingFee);
        }else{
            //没有固定收入，自动带入当地标准
            if($scope.fee.id == '09'){//护理费
                if($scope.adjust.compensateStandard.standardNurseFee){
                    nursingFee.perMoney =  $scope.adjust.compensateStandard.standardNurseFee;
                    nursingFee.standardMoney = angular.copy($scope.adjust.compensateStandard.standardNurseFee);
                }
            }else{//误工费he和处理人员误工费
                if($scope.adjust.compensateStandard.lostIncome){
                    nursingFee.perMoney = $scope.adjust.compensateStandard.lostIncome;
                    nursingFee.standardMoney = angular.copy($scope.adjust.compensateStandard.lostIncome);
                }
            }
            //当地标准
            nursingFee.warningText = cityStr + nursingFee.standardMoney +"元/天";

            $scope.calculateNursingFee(nursingFee,true);
        }
    };

    $scope.save = function(){
      $rootScope.toaster("success", "成功", "保存成功!");
    };

});