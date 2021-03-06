
app.filter('stringDate', function () {
    return function (dt) {
        if (typeof (dt) == "string") {
            dt = dt.replace(/\-/gi, "\/");
            dt = Date.parse(dt);
        }
        return dt && dt;
    }
});
angular.module('sbAdminApp').controller('AlgorithmStep2Ctrl', function (AdminConstant,$scope, $stateParams, $state, $http,$timeout , $log, AlgorithmConfig, AlgorithmService, DictionaryConfig, toaster, $filter) {
  // $scope.inf=$scope.algorithmInfo;
    /* $scope.algorithmInfo.jyAlgorithmApplyerInfoVOList.forEach(function(val){
     	var flage=angular.isString(val.riskkinds);
         if (flage==true){ 
         	val.riskkinds = angular.fromJson(val.riskkinds);
         	}
  
     });*/
	debugger;
    //填充区域信息
    $scope.adminRegion = AdminConstant.administrationRegions;
    //初始化步骤
    $scope.headInfo.step = 2;
    //事故地点树的定义
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
            if ($scope.algorithmInfo.accidentPlace != selectedRegion.fullName) {
                $scope.algorithmInfo.accidentPlace = selectedRegion.fullName;
                $scope.algorithmInfo.regionCode = selectedRegion.regionCode;
                $scope.algorithmInfo.regionNameError = undefined;
                angular.element("#regNamebox").hide();
                $scope.isShowTree = false;
            }
        }
    };

    //选择当事人身份证信息
    $scope.selectAlgorithmApplyerInfo = function(algorithmApplyerInfo){
         $scope.algorithmInfo.identityId = algorithmApplyerInfo.id;
    };


    //交警接口查询
    $scope.policeSubmit = function(){

    }
    
    //不计免赔
    $scope.riskTypeChanged = function(algorithmApplyerInfo, riskType) {
  
        if (riskType == "0") {
            if (!algorithmApplyerInfo.riskkinds['0']){
            	algorithmApplyerInfo.riskkinds['0'] = false;
            }

        } else if (riskType == "1") {
            if (!algorithmApplyerInfo.riskkinds['1']){
            	algorithmApplyerInfo.riskkinds['2'] = false;
            	algorithmApplyerInfo.absDeductible = 0; 
            }
            else{
                $scope.changeAbsDeductible(algorithmApplyerInfo);

            }
            
            algorithmApplyerInfo.thirdPartyFranchise = 30;
            algorithmApplyerInfo.thirdPartyRate = 70;
        }else {
            if (algorithmApplyerInfo.riskkinds['2']) {
                //respondent.riskTypes['0'] = respondent.riskTypes['1'] = true;
            	algorithmApplyerInfo.riskkinds['1'] = true;
            	algorithmApplyerInfo.thirdPartyFranchise = 0;
            	algorithmApplyerInfo.thirdPartyRate = 100;
            }else{
            	algorithmApplyerInfo.thirdPartyFranchise = 30;
            	algorithmApplyerInfo.thirdPartyRate = 70;
            }
        }
    };
    
    
    //改变绝对免赔率触发的请求
    $scope.changeAbsDeductible = function(algorithmApplyerInfo){

        var flag = false;
        if(algorithmApplyerInfo.absDeductibleList){
        	algorithmApplyerInfo.absDeductibleList.forEach(function(val){
               if(val.selected){
                   flag = true;
               }
            });
        }
        if(flag){
        	algorithmApplyerInfo.absDeductible = 10;
        }else{
        	algorithmApplyerInfo.absDeductible = 0;
        }
    }
    
    //选择保险公司信息
    $scope.selectInsuranceItem = function(algorithmApplyerInfo, insurance,type){
        if(type == 1){
        	algorithmApplyerInfo.insuranceForceCompany = insurance.text;
        	algorithmApplyerInfo.forceCode=insurance.code;
        }else{
        	algorithmApplyerInfo.insuranceBusinessCompany = insurance.text;
        	algorithmApplyerInfo.businessCode=insurance.code;
        }
    };

    //失去焦点时
    $scope.blurInsurance = function(algorithmApplyerInfo,type){

        if(type == 1){
            if(algorithmApplyerInfo.insuranceShow){
                $timeout(function(){
                	algorithmApplyerInfo.insuranceShow = false;
                }, 200);
            }
        }else{
            if(algorithmApplyerInfo.businessInsuranceShow){
                $timeout(function(){
                	algorithmApplyerInfo.businessInsuranceShow = false;
                }, 200);
            }
        }
    };
    $scope.thirdPartyFranchiseChanged = function(algorithmApplyerInfo) {
        if (algorithmApplyerInfo.thirdPartyFranchise > 100) algorithmApplyerInfo.thirdPartyFranchise = 100;
        if (algorithmApplyerInfo.thirdPartyFranchise < 0) algorithmApplyerInfo.thirdPartyFranchise = 0;
        if (algorithmApplyerInfo.thirdPartyFranchise <= 100 && algorithmApplyerInfo.thirdPartyFranchise >= 0)algorithmApplyerInfo.thirdPartyRate = 100 - algorithmApplyerInfo.thirdPartyFranchise;
    }

    $scope.thirdPartyRateChanged = function(algorithmApplyerInfo) {
        if (algorithmApplyerInfo.thirdPartyRate > 100) algorithmApplyerInfo.thirdPartyRate = 100;
        if (algorithmApplyerInfo.thirdPartyRate < 0) algorithmApplyerInfo.thirdPartyRate = 0;
        if (algorithmApplyerInfo.thirdPartyRate <= 100 && algorithmApplyerInfo.thirdPartyRate >= 0)algorithmApplyerInfo.thirdPartyFranchise = 100 - algorithmApplyerInfo.thirdPartyRate;
    };
});