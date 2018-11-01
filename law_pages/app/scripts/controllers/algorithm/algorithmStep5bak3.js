angular.module('sbAdminApp').controller('AlgorithmStep4Ctrl', function ($timeout,$scope,$modal, $stateParams, $state, $http, $log,AdjustConfig,AdminConstant, AlgorithmConfig, AlgorithmService, DictionaryConfig, toaster, $filter,$rootScope,$location,LoginService,CalculatorService,AdjustService) {
	//  $scope.headInfo.step =4;
	$scope.co = new Object;
    $scope.co.algorithmApplyerInfoId = "undefined";
    $scope.co.claimantinfochange=null;
    $scope.algorithmApplyerInfoarea=null;
    $scope.curentclamuser=[];
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
	    //免赔率
	    $scope.absDeductibleList= angular.copy(DictionaryConfig.absDeductibleList);
	    
	    //后台查询计算器的相关标准
	    $scope.queryCalculateStandardService = AdjustService.queryCalculateStandard;

	    //保存创建的索赔数据，每次新建索赔数据点击确定按钮保存一次索赔数据
	    $scope.savePartClaimData=CalculatorService.savePartClaimData;
	    $scope.algorithmInfo=eval('('+$stateParams.alInfo+')');
	    $scope.fage=$stateParams.fage;
	    //alert("$scope.fage:"+$scope.fage);
	    console.log($scope.algorithmInfo);
	    $scope.instancesthminfo=null;
	    //将DictionaryConfig文件中的费用列表feeTypeList，赋值给本文件中的feelist用来循环展示费用列表
	 /*   $scope.feelist=angular.copy(DictionaryConfig.feeTypeList).filter(function(v){
          return v.type == '1';
      });*/
	    
	    
	    $scope.co.Applicant = function(personType, idType, legalType) {
	        this.personType = personType;
	        this.sex = "0";
	        this.legalType = legalType? legalType : '1';
	        this.enterpriseType = '1';
	        this.certificatesType = "0";
	        this.idType = idType? idType : "0";
	        this.idFacePicture =$scope.co.defaultImg2;
	        this.idBackPicture = $scope.co.defaultImg3;
	        this.businessLicensePicture = $scope.co.defaultImg;
	        this.legalPersonPicture = $scope.co.defaultImg;
	        var hashIndex = $scope.adjust.applicantArray.length + 1;
	        var hashName = $scope.adjust.applicantArray.filter(function(v) {
	                return v.personType == personType;
	            }).length + 1;
	        this.hashIndex = hashIndex;
	        this.hashName = hashName;
	        this.agentArray = [];
	        this.isEmail = '0';
	    };  
	    
	    
	    
	    
	    
	    $scope.adjust = {
	            "reason": "1",
	            "household": "1",
	            "paidTotal": "0",
	            "feeDetail": angular.copy(DictionaryConfig.feeTypeList).filter(function(v){
	                return v.type == '1';
	            }),
	            "compensateTable": [],
	            "compensateStandard": {},
	            "applicantArray": [],
	            "evidenceArray": [],
	            "regionName":"",
	            "standardYear":"",
	            "personName":"",
	            "respondentList":[]
	            	//赔偿地
	            	//赔偿标准
	            	//定残/死亡日期
	            	//伤残赔偿系数
	        };
	    
	    $scope.claminfo={
	    		birthday:"",
	    		compensateRate:"",
	    		deathDate:"",
	    		deathDateOpened:"",
	    		delFlag:"",
	    		feeDetail:"",
	    		household:"",
	    		id:"",
	    		idBackPicture:"",
	    		idFacePicture:"",
	    		idNo:"",
	    		idType:"",
	    		isShowTree:"",
	    		jyAlgorithmApplyerInfoTabList:"",
	    		jyAlgorithmDutyInfoVOList:"",
	    		jyAlgorithmInfoId:"",
	    		personName:"",
	    		regionCode:"",
	    		regionName:"",
	    		serialNo:"",
	    		standardYear:"",
	    		updateDate:"",
	    		compenName:""
	    		
	    }


	    //$scope.adjust.applicantArray.push(new $scope.co.Applicant(0));
	   // $scope.adjust.applicantArray.push(new $scope.co.Applicant(1), new $scope.co.Applicant(1, 1, 2));
	    //创建索赔人 ，该变量用于存储界面中选择的赔偿人
	    $scope.claimantinfo=null;
	    $scope.household=0;
	  var algorappyinfo=$scope.algorithmInfo.jyAlgorithmApplyerInfoVOList;
	  for(var i=0;i<algorappyinfo.length;i++){
		  $scope.co.algorithmApplyerInfoId=algorappyinfo[0].id;
		  break;
	  }
	  $scope.userlist=eval('('+$stateParams.alInfo+')');
	
	  $scope.riskTypeList=eval('('+$stateParams.risktypelist+')');
	  
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
	                $scope.algorithmApplyerInfoarea=algorithmApplyerInfo;
	                
	                $scope.adjust.regionName=algorithmApplyerInfo.regionName;
	                $scope.adjust.regionName = selectedRegion.fullName;
	                $scope.adjust.regionCode = selectedRegion.regionCode;
	                
	                //$scope.adjust.standardYear=algorithmApplyerInfo.deathDate.getFullYear();
	                //选择区域的时候进行触发计算赔偿标准和居民收入支出标准
	                if($scope.instancesthminfo==null){
	                	//$scope.instancesthminfo.splice(0,$scope.instancesthminfo.length);
	               // }else{
	                	$scope.instancesthminfo=algorithmApplyerInfo;
	                }
	                $scope.findIncomeAndCompensate(true);
	            }
	        }
	    };

	    
	      $scope.selectBxShow = function(fee){
	    	//alert("sdfsdf");
	        fee.selectShow = !fee.selectShow;
	        $scope.computeChange(fee,true);

	    }
	      
	      
	      
	      
	      
	      
	      
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
	    
	    //选中索赔人
        $scope.updateClaimantinfo=function(claimantinfo){
        	$scope.co.claimantinfochange = $scope.userlist.jyAlgorithmApplyerInfoVOList.filter(function(v){
        		return (v.id == claimantinfo.id);
        		
        	})[0];
//        	$scope.co.claimantinfochange=claimantinfo;
        	
        	  for(var i=0;i<algorappyinfo.length;i++){
        		  if(claimantinfo.id==algorappyinfo[i].id){
        			  $scope.co.algorithmApplyerInfoId=algorappyinfo[i].id; 
        		  }
        		  
        		  break;
        	  }
        	$scope.co.algorithmApplyerInfoId=claimantinfo.id;
        }
	    //添加赔偿人列表中过滤掉已经被作为索赔人的人员信息
	    $scope.showRespondentFilter = function(algorithmApplyerInfo) {
	        algorithmApplyerInfo.jyAlgorithmApplyerInfoTabList = [];
	        $scope.algorithmInfo.jyAlgorithmApplyerInfoVOList.forEach(function(val){
	            if(val.id != $scope.co.claimantinfochange.id){
	                var obj = _.find(algorithmApplyerInfo.jyAlgorithmDutyInfoVOList,{payId:val.id});
	                if(!obj){
	                	if(val.isOwner){
	                    algorithmApplyerInfo.jyAlgorithmApplyerInfoTabList.push(val);
	                	}
	                }
	            }else{
	            	$scope.generythmDutyInfo(val);
	            }
	        });
	    };

	    //添加（索赔方）
	    $scope.addTab = function(){
	   // jyAlgorithmApplyerInfo=
	    	//alert();
	        //jyAlgorithmApplyerInfo.showFlag = '2';
	    	//$scope.algorithmApplyerInfoarea=$scope.userid;
	    	
	        $scope.co.algorithmApplyerInfoId = $scope.claimantinfo.id;
	        
	    };

	    //切换TAB（索赔方）
	    $scope.changeTab = function(jyAlgorithmApplyerInfo){
	        $scope.co.algorithmApplyerInfoId = jyAlgorithmApplyerInfo.id;
	    };

	    //定义责任人
	    function AlgorithmDutyInfo(){
	        this.responsibleRate = 0;
	        this.isVehicle = "";
	        //this.riskTypeList = angular.copy($scope.riskTypeList);
	        this.riskTypeList =angular.copy($scope.riskTypeList);
	        this.absDeductibleList= $scope.absDeductibleList;
	       
	    }

	    //产生当前索赔者的个人承担费用的记录
	    
	    $scope.generythmDutyInfo = function(val) {
	        var algorithmDutyInfo = new AlgorithmDutyInfo();
	        algorithmDutyInfo.plateNo = val.plateNo;
	        algorithmDutyInfo.isVehicle = val.plateNo ? "1" : "0";
	        //表示为机动车
	        if(algorithmDutyInfo.isVehicle == "1"){
	            algorithmDutyInfo.riskTypeList[0].selected = true;
	        }
	        algorithmDutyInfo.payName = val.personName;
	        algorithmDutyInfo.jyAlgorithmApplyerInfoId = val.id;
	        algorithmDutyInfo.payId = val.id;
	        //默认删除标记为0
	        algorithmDutyInfo.delFlag = "0";
	        //医疗费
	        algorithmDutyInfo.medicalFee = 1000;
	        //死亡伤残
	        algorithmDutyInfo.disabilityFee = 11000;
	        //死亡伤残
	        algorithmDutyInfo.propertyLossFee = 100;
	        //添加集合中
	    	$scope.curentclamuser.push(angular.copy(algorithmDutyInfo));
	    };
	    
	    
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
	        algorithmApplyerInfo.jyAlgorithmDutyInfoVOList.push(angular.copy(algorithmDutyInfo));
	    };

	    //改变绝对免赔率触发的请求
	    //改变绝对免赔率触发的请求
/*	    $scope.changeAbsDeductible = function(respondent){
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
	    }*/
	    
	    
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
/*	    $scope.riskTypeChanged = function(respondent,riskTypeId){

	    };
*/
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
	        window.open(url+'?id='+id+'&serialNo='+serialNo+'&flag='+$scope.isMediation, '_self');
	    };
	    //添加索赔方
        
	    $scope.saveMultCaculat=function(){
	    	// console.log( $scope.algorithmApplyerInfoarea);//获取区域信息
	    	//获取索赔人基本信息
	    	//console.log($scope.co.claimantinfochange);
	    	//debugger;
	    	//获取赔偿人基本信息
	    	//console.log( $scope.algorithmInfo);
	    	//获取费用基本信息
	    	//console.log(  $scope.adjust);
	    	//获取小计
	    	
	    	//生成索赔人基本信息
	    	   $scope.claimans=angular.copy($scope.algorithmInfo.jyAlgorithmApplyerInfoVOList.filter(function(v){
		              return (v.id==$scope.co.claimantinfochange.id);
			          }));
	      
	    	//生成费用基本信息列表
	    	//生成小计基本信息列表
	    	//生成保外基本信息列表
	    	//生成赔偿人基本信息列表
	    	var datainfo={"claimans":$scope.claimans};
	    	//$scope.claminfo.jyAlgorithmApplyerInfoVOList=angular.copy($scope.userlist.jyAlgorithmApplyerInfoVOList);
	     //$scope.claminfo.claiman=angular.copy($scope.claimans);
	    	 if($scope.fage==1){
	    			$scope.claimantid=$stateParams.claimantid;
	    		/* 
	    		 var temp= $scope.algorithmInfo.listJyAlgorithmClaimantInfoBySeria[0].compcontent;
	         	  var clam=eval('('+temp+')');*/
	    		 $scope.claminfo.claimantid=$scope.claimantid
	         }
	     $scope.claminfo.isOwner=$scope.claimans[0].isOwner;
	     $scope.claminfo.plateNo=$scope.claimans[0].plateNo;
	   	 $scope.claminfo.birthday=$scope.claimans[0].birthday;
    	 $scope.claminfo.compensateRate=$scope.claimans[0].compensateRate;
    	 $scope.claminfo.deathDate=$scope.claimans[0].deathDate;
    	 $scope.claminfo.deathDateOpened=$scope.claimans[0].deathDateOpened;
    	 $scope.claminfo.delFlag=$scope.claimans[0].delFlag;
    	 $scope.claminfo.adjust=angular.copy($scope.adjust);
    	 $scope.claminfo.household=$scope.claimans[0].household;
    	 $scope.claminfo.id=$scope.claimans[0].id;
    	 $scope.claminfo.idBackPicture=$scope.claimans[0].idBackPicture;
    	 $scope.claminfo.idFacePicture=$scope.claimans[0].idFacePicture;
    	 $scope.claminfo.idNo=$scope.claimans[0].idNo;
    	 $scope.claminfo.isShowTree=$scope.claimans[0].isShowTree;
    	 //$scope.claminfo.jyAlgorithmApplyerInfoTabList=$scope.claimans[0].jyAlgorithmApplyerInfoTabList;
    	 $scope.claminfo.jyAlgorithmDutyInfoVOList=$scope.claimans[0].jyAlgorithmDutyInfoVOList;
    	 $scope.claminfo.jyAlgorithmInfoId=$scope.claimans[0].jyAlgorithmInfoId;
    	 $scope.claminfo.personName=$scope.claimans[0].personName;
    	 $scope.claminfo.regionCode=$scope.claimans[0].regionCode;
    	 $scope.claminfo.regionName=$scope.claimans[0].regionName;
    	 $scope.claminfo.serialNo=$scope.algorithmInfo.serialNo;
    	 $scope.claminfo.standardYear=$scope.adjust.standardYear;
    	 $scope.claimans[0].jyAlgorithmDutyInfoVOList.forEach(function(val){
    		 $scope.claminfo.compenName+=","+val.payName;
         });
	    	//存储当前索赔人的索赔信息
	    	$scope.savePartClaimData({
				algorithmapplyerinfoname:angular.toJson($scope.claminfo) 
			}).success(function (result) {
				var alinfod=eval('('+$stateParams.alInfo+')');
		    	 $location.url('/dashboard/algorithm/'+alinfod.id+'/algorithmStep3/');

			});
	    	
	    	
	   	    	
	    }
	    
        //编辑一条索赔申请 ,如果当前为修改一条索赔信息则将该索赔申请信息反向显示到界面中
        if($scope.fage==1){
        	$scope.claimantid=$stateParams.claimantid;
        	recoverall();
        }
  
	    function recoverall(){
	    	//var temp= $scope.algorithmInfo.listJyAlgorithmClaimantInfoBySeria[0].compcontent;
	    	
	    	
	    	var temp= $scope.algorithmInfo.listJyAlgorithmClaimantInfoBySeria.filter(function(v){
	              return (v.id==$scope.claimantid);
		          })[0].compcontent;
	    	
	    	
      	  var clam=eval('('+temp+')');
	    	//var clam=temp;
      	  $scope.adjust=angular.copy(clam.adjust);
      	  //$scope.co.claimantinfochange=angular.copy(clam.claiman[0]);
      	 // $scope.userlist.jyAlgorithmApplyerInfoVOList=angular.copy(clam.jyAlgorithmApplyerInfoVOList);
      	  $scope.co.algorithmApplyerInfoId=clam.id;
      	  $scope.adjust.personName=clam.personName;
      	  $scope.algorithmInfo.jyAlgorithmApplyerInfoVOList.forEach(function(val){
       		if(val.id==clam.id){
       			$scope.co.claimantinfochange=angular.copy(val);
       			val.deathDate=clam.deathDate;
       			val.household=clam.household;
       			val.compensateRate=clam.compensateRate;
       			val.regionName=clam.regionName;
       			val.regionCode=clam.regionCode;
       			val.jyAlgorithmDutyInfoVOList=angular.copy(clam.jyAlgorithmDutyInfoVOList);
       			$scope.claimantinfo=angular.copy(val);
       		}
       		
       		
       		 
            });
      
	    }
	    //抚养费计算
	    $scope.addDependent = function(val) {
	    	$scope.adjust.deathDate=$scope.instancesthminfo.deathDate;
	    	$scope.adjust.serialNo=$scope.algorithmInfo.serialNo;
	    	$scope.adjust.household=$scope.instancesthminfo.household;
	    	//var d=$scope.instancesthminfo.deathDate;
	    	console.log($scope.adjust.serialNo);
	        var dependents = _.find($scope.adjust.feeDetail, {
	            id: "14"
	        }).dependents
	        if (val == 'claim') {
	            if (dependents.claim.length == 0 && dependents.apply.length != 0) {
	                dependents.claim = angular.copy(dependents.apply);
	            }
	        }
	        var modalInstance = $modal.open({
	            templateUrl: 'views/pages/mediation_platform/litigation_mediation/popup1.html',
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
	                        household:$scope.adjust.household,
	                        refData:  $scope.adjust.compensateStandard,
	                        serialNo:$scope.adjust.serialNo
	                        
	                        
	                 /*       dependents: depent[val],
	                        deathDate: $scope.adjust.deathDate,
	                        compensateRate: $scope.adjust.compensateRate,
	                        household: $scope.adjust.household,
	                        refData: $scope.adjust.compensateStandard,
	                        serialNo:$scope.adjust.serialNo*/
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
	    
	    //处理保险外金额
	    $scope.handleExtraAmount = function(fee){
	    	debugger;
	  var popsize=$scope.adjust.applicantArray.length;
	  
      var dutyInfo=angular.copy($scope.algorithmInfo.jyAlgorithmApplyerInfoVOList.filter(function(v){
            if(v.id==$scope.co.claimantinfochange.id){
            	return v;	
            }
         }))[0].jyAlgorithmDutyInfoVOList;
    	
      var presize=dutyInfo.length;
	  if(presize==0){
		  alert("请选择赔偿方。");
		  return;
	  }
	  //debugger;
	    	if((popsize-1)!=presize){
	    		if($scope.adjust.applicantArray.length!=0){
	    		$scope.adjust.applicantArray.splice(0,popsize);
	    		}
	    		  $scope.adjust.applicantArray= angular.copy(dutyInfo.filter(function(v){
		               // return ((v.responsibleRate == undefined && v.idType == '0' && v.personType != '1' ) || (v.responsibleRate && v.responsibleRate>0 && v.idType == '0' && v.personType == '1'));
		            	return v;
		            }));
	    		  $scope.adjust.applicantArray.push($scope.curentclamuser[0]);
	    	}else{
	    		$scope.adjust.applicantArray.splice(0,popsize);
	    		  $scope.adjust.applicantArray= angular.copy(fee.respondentList.filter(function(v){
		               // return ((v.responsibleRate == undefined && v.idType == '0' && v.personType != '1' ) || (v.responsibleRate && v.responsibleRate>0 && v.idType == '0' && v.personType == '1'));
		            	return v;
		            }));
	    	}
	    	  var handleExtraAmountModel = $modal.open({
	            templateUrl: 'views/pages/mediation_platform/litigation_mediation/popup2.html',
	            controller: 'ExtraAmountCtrl',
	            backdrop:'static',
	            size: 'md',
	            resolve: {
	            	  loadMyFile: function($ocLazyLoad) {
			              return $ocLazyLoad.load({
			                name: 'sbAdminApp',
			                files: [
			              	  'scripts/controllers/mediation_platform/litigation/extraAmount2.js',
			                  'scripts/controllers/mediation_platform/litigation/nursingFee2.js',
			                  'scripts/controllers/mediation_platform/litigation/modalLawItems2.js',
			                  'scripts/controllers/mediation_platform/litigation/payMoney2.js']
			              })
			            },
	                items: function() {
	                    return {
	                        fee: fee,
	                        adjust:$scope.adjust
	                    }
	                }
	            }
	        });

	        handleExtraAmountModel.result.then(function(){
	            $scope.refreshTotal($scope.adjust);
	           // debugger;
	            fee.isChecked = true;
	        })
	    };
	    

	    
	    $scope.refreshTotal = function() {
	    	$scope.adjust.applyTotal = 0.00;
	    	$scope.adjust.lawMoney = 0.00;
	        var checkedList = $scope.adjust.feeDetail.filter(function(v) {
	            return v.isChecked;
	        });
	        checkedList.forEach(function(v) {
	            //残疾赔偿金或者死亡赔偿金
	            if(v.id == "12" || v.id == "15"){
	                if(v.applyPerUnit && v.applyUnit  && $scope.adjust.compensateRate){
	                    v.applyAmount = v.applyPerUnit * v.applyUnit * $scope.adjust.compensateRate / 100;
	                }
	                if(v.claimPerUnit && v.claimUnit && $scope.adjust.compensateRate){
	                    v.claimAmount = v.claimPerUnit * v.claimUnit * $scope.adjust.compensateRate / 100;
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

	        $scope.adjust.applyTotal = $scope.adjust.applyTotal.toFixed(2);
	        /*console.log($scope.adjust.extraTotalLawMoney)
	        if($scope.adjust.extraTotalLawMoney){
	            $scope.adjust.lawMoney = parseFloat($scope.adjust.lawMoney) + parseFloat($scope.adjust.extraTotalLawMoney);
	        }*/
	        $scope.adjust.lawMoney = $scope.adjust.lawMoney.toFixed(2);
	        $scope.adjust.willPayTotal = $scope.adjust.lawMoney - $scope.adjust.paidTotal;
	        calculateTimeout = $timeout(function () {
	            $scope.co.calculate();
	        }, 1000);
	        if(calculateTimeout){
	            $timeout.cancel(calculateTimeout);
	        }

	    
	    };   
	    
	    
	//------------------    
	     //显示费用说明
	    //选择依据
	    $scope.openCriteria = function (lg, fee, hide) {
	        var modalInstance = $modal.open({
	          templateUrl: 'views/pages/lawsuit/criteria2.html',
	          controller: 'ModalLawItemsCtrl',
	          size: lg,
	          resolve: {  
	        	  loadMyFile: function($ocLazyLoad) {
	              return $ocLazyLoad.load({
		                name: 'sbAdminApp',
		                files: [
		              	  'scripts/controllers/mediation_platform/litigation/extraAmount2.js',
		                  'scripts/controllers/mediation_platform/litigation/nursingFee2.js',
		                  'scripts/controllers/mediation_platform/litigation/modalLawItems2.js',
		                  'scripts/controllers/mediation_platform/litigation/payMoney2.js']
		              })
		            },
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
     //------------------------------------- 
	    $scope.updateadjust=function(algorithmApplyerInfo){
	    	
	    	$scope.adjust.household=algorithmApplyerInfo.household;
	    }
	    //------------------------------
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
	            if (fee.claimPerUnit && fee.claimUnit &&　!isApply) {
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
	            if (fee.claimUnit && fee.claimAmount &&　!isApply) {
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
	       // debugger;
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
	       // debugger;
	        showOrHideWarning("12", $scope.adjust.compensateStandard[$scope.adjust.household].income);
	        //死亡赔偿金超过标准
	        showOrHideWarning("15", $scope.adjust.compensateStandard[$scope.adjust.household].income);
	        //丧葬费超过标准
	        showOrHideWarning("16", $scope.adjust.compensateStandard.funeralFeeStandard/12);
	        //精神抚慰金超过标准
	        showOrHideWarning("17", $scope.adjust.compensateStandard.spiritualConsolationFee);
	    };

	    
	    
	    
	    
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
	    
	//-------------------------------------    
        //伤残率验证
        $scope.compensateRateChanged = function(algorithmApplyerInfo) {
            if (algorithmApplyerInfo.compensateRate > 100) algorithmApplyerInfo.compensateRate = 100;
            if (algorithmApplyerInfo.compensateRate < 0) {
            	algorithmApplyerInfo.compensateRate = 0;
            }
            $scope.adjust.compensateRate=algorithmApplyerInfo.compensateRate;
            handleDeathAndDisability();
        };

        function handleDeathAndDisability(){
        	//debugger;
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
	 //-----------------------------------------  
        //选择区域的时候进行触发计算赔偿标准和居民收入支出标准
        $scope.findIncomeAndCompensate = function(flag){
            if ($scope.adjust.regionName && $scope.adjust.standardYear) {
                //计算居民收支标准以及赔偿标准
                queryCalculateStandard(flag);
            }
        };
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
     //-------------------------------------------   
        //处理已付金额
        $scope.queryPayMoney = function(){
        	//debugger;
        	 var popsize=$scope.adjust.applicantArray.length;
       	  //找到索赔方下的赔偿方列表
        	  	var dutyInfo=angular.copy($scope.algorithmInfo.jyAlgorithmApplyerInfoVOList.filter(function(v){
                    if(v.id==$scope.co.claimantinfochange.id){
                    	return v;	
                    }
                 }))[0].jyAlgorithmDutyInfoVOList;
        	  	var presize=dutyInfo.length;
       	  if(presize==0){
       		  alert("请选择赔偿方。");
       		  return;
       	  }
       	// debugger;
       	    	if((popsize-1)!=presize){
       	    		if($scope.adjust.respondentList.length!=0){
       	    		$scope.adjust.respondentList.splice(0,$scope.adjust.respondentList.length);
       	    		$scope.adjust.applicantArray.splice(0,popsize);
       	    		}
       	    		
       	    		
       	    		
       	    		
       	    		  $scope.adjust.applicantArray= angular.copy(dutyInfo.filter(function(v){
       		               // return ((v.responsibleRate == undefined && v.idType == '0' && v.personType != '1' ) || (v.responsibleRate && v.responsibleRate>0 && v.idType == '0' && v.personType == '1'));
       		            	return v;
       		            }));
       	    		  $scope.adjust.applicantArray.push($scope.curentclamuser[0]);
       	    	}
            var payMoney = $modal.open({
                templateUrl: 'views/pages/mediation_platform/litigation_mediation/payMoney2.html',
                controller: 'PayMoneyCtrl',
                backdrop:'static',
                size: 'md',
                resolve: {
                	loadMyFile: function($ocLazyLoad) {
      	              return $ocLazyLoad.load({
      		                name: 'sbAdminApp',
      		                files: [
      		              	  'scripts/controllers/mediation_platform/litigation/extraAmount2.js',
      		                  'scripts/controllers/mediation_platform/litigation/nursingFee2.js',
      		                  'scripts/controllers/mediation_platform/litigation/modalLawItems2.js',
      		                  'scripts/controllers/mediation_platform/litigation/payMoney2.js']
      		              })
      		            },
                    items: function() {
                        return {
                            adjust: $scope.adjust
                        }
                    }
                }
            });
        };
        
        
        //------------------------------------------------
        
    	
        //添加护理费、误工费、处理人误工费
        $scope.addNursingFee = function(val,fee){
            var addNursingFeeModel =  $modal.open({
                templateUrl: 'views/pages/mediation_platform/litigation_mediation/nursingFee_popup2.html',
                controller: 'NursingFeePopupCtrl',
                backdrop:'static',
                size: 'lg',
                resolve: {
                	loadMyFile: function($ocLazyLoad) {
        	              return $ocLazyLoad.load({
        		                name: 'sbAdminApp',
        		                files: [
        		                  'scripts/controllers/mediation_platform/litigation/nursingFee2.js']
        		              })
        		            },
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
        
        
        //---------------------------------------------------------
        var calculateTimeout;

        $scope.feeCheckChanged = function(fee, id) {
        	$scope.adjust.deathDate=$scope.instancesthminfo.deathDate;
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
	app.controller('AdjustInformationPopupCtrl', function($scope, DictionaryConfig, $state, $modal, items, $modalInstance, toaster,$rootScope) {
	    $scope.dependents = items.dependents;
	    $scope.deathDate = items.deathDate;
	    $scope.household = items.household;
	    $scope.compensateStandard = items.refData;
	    $scope.compensateRate = items.compensateRate;
	    $scope.adjust=items;
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
        //计算抚养年限
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

	    //点击确认 计算抚养年限内的金额
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
	
	
	
	

