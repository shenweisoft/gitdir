angular.module('sbAdminApp').controller('AlgorithmStep4Ctrl', function ($timeout,$scope, $stateParams, $state, $http, $log,$modal,AdminConstant, AlgorithmConfig,CalculatorService, AlgorithmService, DictionaryConfig, toaster, $filter,$rootScope,$location,LoginService) {

	
    $scope.headInfo.step = 4;
    //案由类型
    $scope.factTypeList = DictionaryConfig.factTypeList;
    //获取赔偿年度
    $scope.yearList = DictionaryConfig.getYearList();
    //赔偿标准
    $scope.accountTypeList = DictionaryConfig.accountTypeList;
    //责任人信息保存
    $scope.saveJyAlgorithmDutyInfoService = AlgorithmService.saveJyAlgorithmDutyInfo;
    //保险公司
    $scope.insuranceList = DictionaryConfig.insuranceList;
    //删除责任人信息
    $scope.deleteJyAlgorithmDutyInfoService = AlgorithmService.deleteJyAlgorithmDutyInfo;
   
    $scope.removApplyerInfo=CalculatorService.removApplyerInfo;
    
    $scope.calculatorClaim=CalculatorService.calculatorClaim;
 
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

    $scope.blurAdmin = function(algorithmApplyerInfo){

        if(algorithmApplyerInfo.isShowTree){
            $timeout(function(){
                algorithmApplyerInfo.isShowTree = false;
            }, 200);
        }
    };

    //选择赔偿地树节点信息
    $scope.selectAdmin = function(node, selected) {
        var algorithmApplyerInfoIndex = node.currentTarget.attributes.algorithmApplyerInfoIndex.value;
        var algorithmApplyerInfo = _.find($scope.algorithmInfo.jyAlgorithmApplyerInfoVOList,{id:parseInt(algorithmApplyerInfoIndex)});
        algorithmApplyerInfo.isShowTree = false;
        var selectedNodes = selected.selected;
        if (selectedNodes.length > 0 && selected.node.type=='default') {
            var selectedRegion = algorithmApplyerInfo.adminRegion[selectedNodes[0]];
            if (algorithmApplyerInfo.regionName != selectedRegion.fullName) {
                algorithmApplyerInfo.regionName = selectedRegion.fullName;
                algorithmApplyerInfo.regionCode = selectedRegion.regionCode;
                algorithmApplyerInfo.regionNameError = undefined;
                algorithmApplyerInfo.isShowTree = false;
            }
        }
    };

    //日期插件获取当前时间
    $scope.currentTime = new Date();
    //时期插件打开方式
    $scope.openDeathDate = function($event, algorithmApplyerInfo) {
        $event.preventDefault();
        $event.stopPropagation();
        algorithmApplyerInfo.deathDateOpened = true;
    };
    //过滤增加索赔方信息
    $scope.addRespondentFilter = function(e) {
        var responsibleRateFlag = e.responsibleRate ? e.responsibleRate == -1 : e.responsibleRate == 0 ? false : true;
        return responsibleRateFlag;
    };

    //过滤已经添加的人员信息
    $scope.showRespondentFilter = function(algorithmApplyerInfo) {
        algorithmApplyerInfo.jyAlgorithmApplyerInfoTabList = [];
        $scope.algorithmInfo.jyAlgorithmApplyerInfoVOList.forEach(function(val){
            if(val.id != $scope.co.algorithmApplyerInfoId){
                var obj = _.find(algorithmApplyerInfo.jyAlgorithmDutyInfoVOList,{payId:val.id});
                if(!obj){
                    algorithmApplyerInfo.jyAlgorithmApplyerInfoTabList.push(val);
                }
            }
        });
    };

    //添加tab页面（索赔方）
    $scope.addTab = function(jyAlgorithmApplyerInfo){
        jyAlgorithmApplyerInfo.showFlag = '2';
        $scope.co.algorithmApplyerInfoId = jyAlgorithmApplyerInfo.id;
    };

    //切换TAB（索赔方）
    $scope.changeTab = function(jyAlgorithmApplyerInfo){
        $scope.co.algorithmApplyerInfoId = jyAlgorithmApplyerInfo.id;
    };

    //定义责任人
    function AlgorithmDutyInfo(){
        this.responsibleRate = 0;
        this.isVehicle = "";
        this.riskTypeList = angular.copy($scope.riskTypeList);
    }

    //添加（责任承担及保单信息）
    $scope.addRespondent = function(jyAlgorithmApplyerInfoTab,algorithmApplyerInfo) {
        var algorithmDutyInfo = new AlgorithmDutyInfo();
        algorithmDutyInfo.plateNo = jyAlgorithmApplyerInfoTab.plateNo;
        algorithmDutyInfo.isVehicle = jyAlgorithmApplyerInfoTab.plateNo ? "1" : "0";
        //表示为机动车
        if(algorithmDutyInfo.isVehicle == "1"){
            algorithmDutyInfo.riskTypeList[0].selected = true;
        }
        algorithmDutyInfo.payName = jyAlgorithmApplyerInfoTab.personName;
        algorithmDutyInfo.jyAlgorithmApplyerInfoId = algorithmApplyerInfo.id;
        algorithmDutyInfo.payId = jyAlgorithmApplyerInfoTab.id;
        //默认删除标记为0
        algorithmDutyInfo.delFlag = "0";
        //医疗费
        algorithmDutyInfo.medicalFee = 1000;
        //死亡伤残
        algorithmDutyInfo.disabilityFee = 11000;
        //死亡伤残
        algorithmDutyInfo.propertyLossFee = 100;
        //添加集合中
        algorithmApplyerInfo.jyAlgorithmDutyInfoVOList.push(algorithmDutyInfo);
    };

    //责任比例切换
    $scope.responsibleRateChanged = function(respondent){
        if (respondent.responsibleRate > 100) respondent.responsibleRate = 100;
        if (respondent.responsibleRate < 0) respondent.responsibleRate = 0;
        //医疗费
        respondent.medicalFee = respondent.responsibleRate > 0 ? 10000:1000;
        //死亡伤残
        respondent.disabilityFee = respondent.responsibleRate > 0 ? 110000:11000;
        //死亡伤残
        respondent.propertyLossFee = respondent.responsibleRate > 0 ? 2000:100;

    };

    //投保险种切换
    $scope.riskTypeChanged = function(respondent,riskTypeId){

    };

    //删除责任承担人信息
    $scope.deleteRespondent = function(algorithmApplyerInfo,respondent){
        //如果存在主键，删除数据库信息
        if(respondent.id){
            $scope.deleteJyAlgorithmDutyInfoService({
                id: respondent.id
            }).success(function (res) {
                if (res.code === AlgorithmConfig.commonConstant.SUCCESS) {
                    var index = _.findIndex(algorithmApplyerInfo.jyAlgorithmDutyInfoVOList,{id:respondent.id});
                    //从数组中删除该项
                    algorithmApplyerInfo.jyAlgorithmDutyInfoVOList.splice(index, 1);
                } else {
                    $rootScope.toaster("error", "错误", res.message);
                }
            });
        }else{
            //如果不存在
            var index = algorithmApplyerInfo.jyAlgorithmDutyInfoVOList.indexOf(respondent);
            //从数组中删除该项
            algorithmApplyerInfo.jyAlgorithmDutyInfoVOList.splice(index, 1);
        }
    };

    //不计免赔
    $scope.riskTypeChanged = function(respondent, riskType) {
    	//alert(respondent.riskTypes.length);
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
                respondent.thirdPartyFranchise = 30;
                respondent.thirdPartyRate = 70;
            }
        }
    };

    //失去焦点时
    $scope.blurInsurance = function(respondent,type){

        if(type == 1){
            if(respondent.insuranceShow){
                $timeout(function(){
                    respondent.insuranceShow = false;
                }, 200);
            }
        }else{
            if(respondent.businessInsuranceShow){
                $timeout(function(){
                    respondent.businessInsuranceShow = false;
                }, 200);
            }
        }
    };

    //选择保险公司信息
    $scope.selectInsuranceItem = function(respondent, insurance,type){
        if(type == 1){
            respondent.insuranceForceCompany = insurance.text;
        }else{
            respondent.insuranceBusinessCompany = insurance.text;
        }
    };

    $scope.thirdPartyFranchiseChanged = function(respondent) {
        if (respondent.thirdPartyFranchise > 100) respondent.thirdPartyFranchise = 100;
        if (respondent.thirdPartyFranchise < 0) respondent.thirdPartyFranchise = 0;
        if (respondent.thirdPartyFranchise <= 100 && respondent.thirdPartyFranchise >= 0)respondent.thirdPartyRate = 100 - respondent.thirdPartyFranchise;
    }

    $scope.thirdPartyRateChanged = function(respondent) {
        if (respondent.thirdPartyRate > 100) respondent.thirdPartyRate = 100;
        if (respondent.thirdPartyRate < 0) respondent.thirdPartyRate = 0;
        if (respondent.thirdPartyRate <= 100 && respondent.thirdPartyRate >= 0)respondent.thirdPartyFranchise = 100 - respondent.thirdPartyRate;
    };

    //获取登录用户信息
    $scope.$on('user2Child', function () {
        $scope.userDepart = LoginService.user.sysUser.userDepartList[LoginService.user.sysUser.currentOrg];
    })
    if(LoginService.user.userPermissions) {
        $scope.userDepart = LoginService.user.sysUser.userDepartList[LoginService.user.sysUser.currentOrg];
    }

    //鉴定伤残等级
    $scope.showRankAppraisal = function () {
        var id = $scope.user.sysUser.id;
        var serialNo = $scope.algorithmInfo.serialNo;
        //打开等级鉴定页面，并将单子id与流水号通过url传入
        var url = $state.href('rankAppraisal');
        window.open(url+'?id='+id+'&serialNo='+serialNo+'&flag='+$scope.isMediation, '_blank');
    };
    
    $scope.showClaimDemage1 = function () {
        var id = $scope.user.sysUser.id;
        var serialNo = $scope.algorithmInfo.serialNo;
        //打开等级鉴定页面，并将单子id与流水号通过url传入
        var url = $state.href('rankAppraisal');
        window.open(url+'?id='+id+'&serialNo='+serialNo+'&flag='+$scope.isMediation, '_blank');
    };
    //添加索赔方
    $scope.showClaimDemage = function () {
        var id = $scope.user.sysUser.id;
        var serialNo = $scope.algorithmInfo.serialNo;
        if(serialNo==''||serialNo==null){
        	$scope.algorithmInfo=eval('('+$stateParams.alInfo+')');
        	serialNo=$scope.algorithmInfo.serialNo;
        }
        var str=JSON.stringify($scope.algorithmInfo);
       
        var strlist=JSON.stringify($scope.riskTypeList);
       
        $state.go("dashboard.algorithmStep5",{id:id,serialNo:serialNo,alInfo:str,risktypelist:strlist,fage:'0',claimantid:'0'});
    
    
    };
    
    
     // 删除一条索赔申请记录
   $scope.removapplyer=function(applyer){
	   //访问后台服务，根据id删除索赔申请信息
	    $scope.removApplyerInfo({
        	id:applyer.id	
        }).success(function(data){
        	//删除数据的同时过滤掉索赔集合中被删除的数据集
        	  $scope.algorithmInfo.listJyAlgorithmClaimantInfoBySeria=angular.copy( $scope.algorithmInfo.listJyAlgorithmClaimantInfoBySeria.filter(function(v){
        	       	return (v.id!=applyer.id);
        	       }));	 
        	 
        });
        
	   
   } 
   //编辑一条索赔申请
   $scope.editapplyer=function(applyer){
	 //  alert(applyer.id);
	  
       var id = $scope.user.sysUser.id;
       var serialNo = $scope.algorithmInfo.serialNo;
       if(serialNo==''||serialNo==null){
    	   
       	$scope.algorithmInfo=eval('('+$stateParams.alInfo+')');
       	serialNo=$scope.algorithmInfo.serialNo;
       }
       
       var str=JSON.stringify($scope.algorithmInfo);
      
       var strlist=JSON.stringify($scope.riskTypeList);
       $state.go("dashboard.algorithmStep5",{id:id,serialNo:serialNo,alInfo:str,risktypelist:strlist,fage:'1',claimantid:applyer.id});
	   
   } 
  
   //计算出赔偿以及索赔结果
   $scope.calculatorService=function(){
	   
	   $scope.algorithmInfo.listJyAlgorithmClaimantInfoBySeria.forEach(function(val){
  		val.compcontent=angular.fromJson(val.compcontent);
       });
	   $scope.calculatorClaim({
		   claminfos:angular.toJson($scope.algorithmInfo.listJyAlgorithmClaimantInfoBySeria)  
	   }).success(function(data){
		   $scope.calculist= data.result;
		  //alert($scope.calculist.length);
		   debugger;
		   //alert(data);
		   //索赔金额计算完成后返回，计算结果
	   });
   }
    
});

//原生js调用angular中的scope参数  （伤残等级鉴定页面调用）
function saveRankAppraisal(count){
  //通过元素id来获取Angular应用
  var appElement = document.getElementById('algorithmStep3');
  //获取$scope变量
  var $scope = angular.element(appElement).scope();
  //调用$scope中的方法与赋值
  $scope.algorithmApplyerInfo.compensateRate = count;
  $scope.compensateRateChanged($scope.adjust);
  //上一行改变了msg的值，如果想同步到Angular控制器中，则需要调用$apply()方法即可
  $scope.$apply();
}


