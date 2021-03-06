angular.module('sbAdminApp').controller('AlgorithmCtrl', function (AdminConstant,$location,$scope, $stateParams, $state, $http, $log, AlgorithmConfig,CalculatorService, AlgorithmService, DictionaryConfig, toaster, $filter,IdentityService,$rootScope) {

    //保存算法模型信息
    $scope.saveJyAlgorithmInfoService = AlgorithmService.saveJyAlgorithmInfo;
    //查询算法模型信息
    $scope.queryJyAlgorithmInfoService = AlgorithmService.queryJyAlgorithmInfo;
    //删除申请人信息
    $scope.deleteJyAlgorithmApplyerInfoService = AlgorithmService.deleteJyAlgorithmApplyerInfo;
    //查询一条序列号下的所有索赔申请信息
    $scope.jyAlgorithmClaimantInfoList=CalculatorService.listJyAlgorithmClaimantInfoBySeria;
    //保险公司
    $scope.insuranceList = DictionaryConfig.insuranceList;
    
    //定义投保险种集合
    $scope.riskTypeList = [{
        id: "0",
        value: "交强险"
    }, {
        id: "1",
        value: "三者险"
    }, {
        id: "2",
        value: "不计免赔"
    }];
     //免赔率选项集合

    //头部信息
    $scope.headInfo = {
        mainFlow: true,
        step:"1",
        defaultImg: "views/images/_r2_c2.png",
        defaultImg2: "views/images/7.png",
        defaultImg3: "views/images/6.png",
        stepArray: [{
            id: "2",
            value: "保单信息"
        }, {
            id: "3",
            value: "事实与理由"
        }, {
            id: "4",
            value: "调解信息"
        }]
    };
    //定义tab页需要切换的人员
    $scope.co = new Object;
    $scope.co.algorithmApplyerInfoId = "undefined";
    //定义算法模型主表信息
    function AlgorithmInfo(){
        //主键
        this.id = "";
        //状态暂存（默认）
        this.state = '1000';
        //删除标志
        this.delFlag = '0';
        //流水号
        this.serialNo = "";
        //组织名称
        this.orgName = "";
        //部门名称
        this.pointName = "";
    }

    //定义申请人信息表
    function JyAlgorithmApplyerInfo(){
        //主键
        this.id = "";
        //主表ID
        this.jyAlgorithmInfoId = "";
        //身份类型默认是公民
        this.personType = '0';
        //人员角色
        //this.personRole="";//0,1,2 0是车主，1是乘客，3行人或非机动车
        this.isOwner="";//0,1,2 0是车主，1是乘客，3行人或非机动车
        //责任比例
        this.responsibleRate="0";
        //证件类型  默认是身份证
        this.idType = '0';
        //性别 默认是男
        this.sex = '0';
        //法定代表人 默认是法定代表人
        this.representativeType = '1';
        //组织类型  默认是保险公司
        this.orgType = '1';
        //删除标记
        this.delFlag = '0';
        //正面照片
        this.idFacePicture = $scope.headInfo.defaultImg2;
        //反面照片
        this.idBackPicture = $scope.headInfo.defaultImg3;
        //填充区域信息
        this.adminRegion = AdminConstant.administrationRegions;
        //费用
        this.feeDetail = angular.copy(DictionaryConfig.feeTypeList).filter(function(v){
            return v.type == '1';
        });
        this.showFlag = '1';
       this.riskkinds=[false,false,false]; //增加险种列表
       this.absDeductibleList=angular.copy(DictionaryConfig.absDeductibleList);//增加绝对免赔率选择项
       this.medicalFee=0;
       this.disabilityFee=0;
       this.propertyLossFee=0 ;
       this.thirdPartyFranchise=0;
       this.thirdPartyRate=0;
       this.absDeductible=0;
       this.isVehicle="0";//是否机动车，在基础信息录入后保存时，判断当前人员基本信息是否存在车牌号，存在则表示机动车不存在则表示费机动车 1,0
    }
    //过滤查询
    function filterQuery(){
        //循环申请人数据
        var isExit = false;
        $scope.algorithmInfo.jyAlgorithmApplyerInfoVOList.forEach(function(val){
            //tab页赋值
            if(val.showFlag == '2' && !isExit){
                $scope.co.algorithmApplyerInfoId = val.id;
                isExit = true;
            }
            if (val.birthday) val.birthday = DictionaryConfig.parseISO8601(val.birthday);
            if (val.deathDate) val.deathDate = DictionaryConfig.parseISO8601(val.deathDate);
            if(!val.adminRegion){
                val.adminRegion = AdminConstant.administrationRegions;
            }
          
            if (val.feeDetail && typeof val.feeDetail == 'string') val.feeDetail = JSON.parse(val.feeDetail);
            //循环责任人集合
            if(val.jyAlgorithmDutyInfoVOList){
                val.jyAlgorithmDutyInfoVOList.forEach(function(v){
                    v.riskTypeList = angular.copy($scope.riskTypeList);
                    if(v.riskTypes){
                        v.riskTypes.split(",").forEach(function(k){
                            var riskType = _.find(v.riskTypeList, {id: k});
                            riskType.selected = true;
                        });
                    }
                });
            }
        });
        
        
        //判断人员是否为车主如果为车主则根据是否拥有责任，为交强险三费添加赔偿限定额
        $scope.algorithmInfo.jyAlgorithmApplyerInfoVOList.forEach(function(val){
                if(val.isOwner==0){
                	if(val.responsibleRate>0){
                		val.medicalFee=10000;
                		val.disabilityFee=110000;
                		val.propertyLossFee=2000;
                	}else{
                		val.medicalFee=1000;
                		val.disabilityFee=11000;
                		val.propertyLossFee=100;
                	}
                }
        });
        
        
        
        
    }

    
    
    //将对象修改为字符串
    function filterConvertoString(algorithmInfo){
        //循环申请人数据
        var isExit = false;
        //将险种json对象转换为字符串
        algorithmInfo.jyAlgorithmApplyerInfoVOList.forEach(function(val){
        	var flage=angular.isString(val.riskkinds);
            if (flage!=true){ 
            	val.riskkinds = angular.toJson(val.riskkinds);
            	}
     
        });
      //将绝对免赔率json对象转换为字符串
        algorithmInfo.jyAlgorithmApplyerInfoVOList.forEach(function(val){
        	var flage=angular.isString(val.absDeductibleList);
            if (flage!=true){ 
            	val.absDeductibleList = angular.toJson(val.absDeductibleList);
            	}
     
        });
        
    }
    //将查询的险种由json字符串转换为json对象
    function filterConvertJSONObj(algorithmInfo){
        //循环申请人数据
        var isExit = false;
        algorithmInfo.jyAlgorithmApplyerInfoVOList.forEach(function(val){
        	var flage=angular.isString(val.riskkinds);
            if (flage==true){ 
            	val.riskkinds = angular.fromJson(val.riskkinds);
            	}
     
        });
        
        algorithmInfo.jyAlgorithmApplyerInfoVOList.forEach(function(val){
        	var flage=angular.isString(val.absDeductibleList);
            if (flage==true){ 
            	val.absDeductibleList = angular.fromJson(val.absDeductibleList);
            	}
     
        });
        
    }
    
    //根据计算器ID查询详细信息
    $scope.initData = function () {
        //判断是否有id（如果有ID，则通过ID通过接口查询基本信息）
        if($stateParams && $stateParams.id){
            //调用接口
            $scope.queryJyAlgorithmInfoService({
                id: $stateParams.id
            }).success(function (res) {
                if (res.code === AlgorithmConfig.commonConstant.SUCCESS) {
                	debugger;
                    $scope.algorithmInfo = res.result;
                    filterConvertJSONObj($scope.algorithmInfo);
                    console.log($scope.algorithmInfo);
                    //获取索赔申请信息
                    $scope.jyAlgorithmClaimantInfoList({
                    	serialNo:$scope.algorithmInfo.serialNo	
                    }).success(function(data){
                    	 $scope.algorithmInfo.listJyAlgorithmClaimantInfoBySeria=data.result;
                    });
                    
              /*      $http({
                        method: "post",
                        url:"/lawProject/calculator/listJyAlgorithmClaimantInfoBySeria",
                        data:$scope.algorithmInfo.serialNo
                    }).success(function(data){
                    	 
                    });*/
                    
                    
                    //过滤信息
                    filterQuery();
                    
                } else {//请求失败
                    $rootScope.toaster("error", "错误", res.message);
                }
            })
        } else {
            //创建主表对象
            $scope.algorithmInfo = new AlgorithmInfo();
            //存储索赔方与赔偿方人员信息
            $scope.algorithmInfo.jyAlgorithmApplyerInfoVOList = [];
            //新建申请人
            $scope.algorithmInfo.jyAlgorithmApplyerInfoVOList.push(new JyAlgorithmApplyerInfo());
        }
    };

    //初始化数据
    $scope.initData();

    //保存过滤功能
    function filterParam(algorithmInfo) {
        //处理日期格式
        algorithmInfo.jyAlgorithmApplyerInfoVOList.forEach(function(val){
            if (val.birthday) val.birthday = $filter('date')(val.birthday, 'yyyy-MM-dd HH:mm:ss');
            if (val.feeDetail && val.feeDetail instanceof Object) val.feeDetail = JSON.stringify(val.feeDetail);
            if (val.deathDate) val.deathDate = $filter('date')(val.deathDate, 'yyyy-MM-dd HH:mm:ss');
            if(val.jyAlgorithmDutyInfoVOList){
                val.jyAlgorithmDutyInfoVOList.forEach(function(algorithmDutyInfo){
                    var riskTypes = "";
                    var riskTypeFlag = true;
                    algorithmDutyInfo.riskTypeList.forEach(function(v){
                        if(v.selected){
                            if(!riskTypeFlag){
                                riskTypes += ",";
                            }
                            riskTypes += v.id;
                            riskTypeFlag = false;
                        }
                    });
                    algorithmDutyInfo.riskTypes = riskTypes;
                });
            }
        });

       
        
      //是否机动车，在基础信息录入后保存时，判断当前人员基本信息是否存在车牌号，存在则表示机动车不存在则表示费机动车 false,true
        algorithmInfo.jyAlgorithmApplyerInfoVOList.forEach(function(val){
                   if(val.plateNo!=undefined){
                	   val.isVehicle=1;
                   }else{
                	   val.isVehicle=0;
                   }
        }); 
        
        
    }

    //保存后对数据进行过滤
    function handleSaveFilter(algorithmInfoResult){
        //存储保存后的案件id
        $scope.algorithmInfo.id = algorithmInfoResult.id;
        $scope.algorithmInfo.serialNo = algorithmInfoResult.serialNo;
        $scope.algorithmInfo.orgName = algorithmInfoResult.orgName;
        $scope.algorithmInfo.pointName = algorithmInfoResult.pointName;
        //循环
        $scope.algorithmInfo.jyAlgorithmApplyerInfoVOList.forEach(function(v,i){
            //循环索赔方
            var algorithmApplyerInfoVO = algorithmInfoResult.jyAlgorithmApplyerInfoVOList[i];
            //赋值
            v.id = algorithmApplyerInfoVO.id
            //承担人信息
            if(v.jyAlgorithmDutyInfoVOList){
                v.jyAlgorithmDutyInfoVOList.forEach(function(val,j){
                    val.id = algorithmApplyerInfoVO.jyAlgorithmDutyInfoVOList[j].id;
                    //if (val.riskTypes) val.riskTypes = JSON.parse(val.riskTypes);
                });
            }
        });
    }

    //保存数据
    $scope.saveAlgorithmInfo = function(goState,saveFlag){
         debugger;
        //表示跳转第二步
        var isGoStep2 = goState ? true: false;
        //跳转下一步状态
        goState = goState || function() {};
        //过滤功能（将json数据转换成js对象）
        var algorithmInfo = angular.copy($scope.algorithmInfo);
        //信息过滤
        filterParam(algorithmInfo);
        filterConvertoString(algorithmInfo);
        //将数据保存到后台
        $scope.saveJyAlgorithmInfoService(algorithmInfo).success(function (result) {
            if (result.code === AlgorithmConfig.commonConstant.SUCCESS) {
                //处理返回的数据
                handleSaveFilter(result.result);
                //如果保存成功
                if(saveFlag){
                    $rootScope.toaster(DictionaryConfig.levelConstant.success, DictionaryConfig.titleConstant.success,$scope.CONSTANT.messageSuccess );
                }
                filterConvertJSONObj(algorithmInfo)
                //地址栏的地址如果有//则表示是新建，防止刷新丢失页面
                if($location.url().indexOf("//") > -1) {
                    if(isGoStep2){
                        $location.url("/dashboard/algorithm/"+$scope.algorithmInfo.id+"/algorithmStep2");
                    }else{
                        $location.url("/dashboard/algorithm/"+$scope.algorithmInfo.id+"/algorithmStep1");
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

    $scope.CONSTANT = {
        personNameError:"请您输入申请人姓名！",
        idNoError:"请您输入证件号码！",
        birthdayError:"请您选择出生日期！",
        companyNameError:"请您输入企业名称！",
        orgNameError:"请您输入组织名称！",
        representativeNameError:"请您输入代表人姓名！",
        jobError:"请您输入公司职务",
        headCompanyNameError:"请选择总公司！",
        idCarNoError:"身份证号码输入错误！",
        accidentLiabilityError:"请您输入事故事实及责任！",
        messageSuccess:"恭喜您，保存成功！",
        messagePictureTypeError:"请上传图片格式文件"
    };

    //验证身份证号码
    $scope.checkIdentity = function(algorithmApplyerInfo) {
        algorithmApplyerInfo.idNoError = false;
        if(algorithmApplyerInfo.idType == '0'){
            if(!IdentityService.identityCodeValid(algorithmApplyerInfo.idNo,algorithmApplyerInfo)){
                algorithmApplyerInfo.idNoError = true;
                $rootScope.toaster(DictionaryConfig.levelConstant.warn, DictionaryConfig.titleConstant.warn, $scope.CONSTANT.idCarNoError);
            }
        }
    };
    //验证申请人信息
    function validateAlgorithmStep1Form(){
        for (var i=0; i < $scope.algorithmInfo.jyAlgorithmApplyerInfoVOList.length;i++) {
            var jyAlgorithmApplyerInfo = $scope.algorithmInfo.jyAlgorithmApplyerInfoVOList[i];
            //公民
            if(jyAlgorithmApplyerInfo.personType == 0){
                //申请人姓名
                jyAlgorithmApplyerInfo.personNameError = false;
                if(!jyAlgorithmApplyerInfo.personName){
                    jyAlgorithmApplyerInfo.personNameError = true;
                    $rootScope.toaster(DictionaryConfig.levelConstant.warn, DictionaryConfig.titleConstant.warn, $scope.CONSTANT.personNameError);
                    return false;
                }
                //证件号码
                jyAlgorithmApplyerInfo.idNoError = false;
                if(!jyAlgorithmApplyerInfo.idNo){
                    jyAlgorithmApplyerInfo.idNoError = true;
                    $rootScope.toaster(DictionaryConfig.levelConstant.warn, DictionaryConfig.titleConstant.warn, $scope.CONSTANT.idNoError);
                    return false;
                }
                //出生日期
                jyAlgorithmApplyerInfo.birthdayError = false;
                if(!jyAlgorithmApplyerInfo.birthday){
                    jyAlgorithmApplyerInfo.birthdayError = true;
                    $rootScope.toaster(DictionaryConfig.levelConstant.warn, DictionaryConfig.titleConstant.warn, $scope.CONSTANT.birthdayError);
                    return false;
                }
            }else if(jyAlgorithmApplyerInfo.personType == 1 || (jyAlgorithmApplyerInfo.personType == 2 && jyAlgorithmApplyerInfo.orgType == '2')){//法人或者其它组织的其它组织
                //企业名称
                jyAlgorithmApplyerInfo.companyNameError = false;
                if(!jyAlgorithmApplyerInfo.companyName){
                    jyAlgorithmApplyerInfo.companyNameError = true;
                    if(jyAlgorithmApplyerInfo.personType == 1){
                        $rootScope.toaster(DictionaryConfig.levelConstant.warn, DictionaryConfig.titleConstant.warn, $scope.CONSTANT.companyNameError);
                    }else{
                        $rootScope.toaster(DictionaryConfig.levelConstant.warn, DictionaryConfig.titleConstant.warn, $scope.CONSTANT.orgNameError);
                    }
                    return false;
                }
                //代表人姓名
                jyAlgorithmApplyerInfo.representativeNameError = false;
                if(!jyAlgorithmApplyerInfo.representativeName){
                    jyAlgorithmApplyerInfo.representativeNameError = true;
                    $rootScope.toaster(DictionaryConfig.levelConstant.warn, DictionaryConfig.titleConstant.warn, $scope.CONSTANT.representativeNameError);
                    return false;
                }
                //公司职务
                jyAlgorithmApplyerInfo.jobError = false;
                if(!jyAlgorithmApplyerInfo.job){
                    jyAlgorithmApplyerInfo.jobError = true;
                    $rootScope.toaster(DictionaryConfig.levelConstant.warn, DictionaryConfig.titleConstant.warn, $scope.CONSTANT.jobError);
                    return false;
                }
            }else{//其它组织
                //企业名称
                jyAlgorithmApplyerInfo.companyNameError = false;
                if(!jyAlgorithmApplyerInfo.companyName){
                    jyAlgorithmApplyerInfo.companyNameError = true;
                    $rootScope.toaster(DictionaryConfig.levelConstant.warn, DictionaryConfig.titleConstant.warn, $scope.CONSTANT.companyNameError);
                    return false;
                }
                //请选择总公司
                jyAlgorithmApplyerInfo.headCompanyNameError = false;
                if(!jyAlgorithmApplyerInfo.headCompanyName){
                    jyAlgorithmApplyerInfo.headCompanyNameError = true;
                    $rootScope.toaster(DictionaryConfig.levelConstant.warn, DictionaryConfig.titleConstant.warn, $scope.CONSTANT.headCompanyNameError);
                    return false;
                }
            }
            
            
            
            //判断人员是否为车主如果为车主则根据是否拥有责任，为交强险三费添加赔偿限定额
    
                    if( jyAlgorithmApplyerInfo.isOwner==0){
                    	if( jyAlgorithmApplyerInfo.responsibleRate>0){
                    		 jyAlgorithmApplyerInfo.medicalFee=10000;
                    		 jyAlgorithmApplyerInfo.disabilityFee=110000;
                    		 jyAlgorithmApplyerInfo.propertyLossFee=2000;
                    	}else{
                    		 jyAlgorithmApplyerInfo.medicalFee=1000;
                    		 jyAlgorithmApplyerInfo.disabilityFee=11000;
                    		 jyAlgorithmApplyerInfo.propertyLossFee=100;
                    	}
                    }
         
            
            
        }
        return true;
    }

    //验证事故事实及责任信息
    function validateAlgorithmStep2Form(){
        //事故事实及责任
        $scope.algorithmInfo.accidentLiabilityError = false;
        if(!$scope.algorithmInfo.accidentLiability){
            $scope.algorithmInfo.accidentLiabilityError = true;
            $rootScope.toaster(DictionaryConfig.levelConstant.warn, DictionaryConfig.titleConstant.warn, $scope.CONSTANT.accidentLiabilityError);
            return false;
        }
        return true;
    }

    //添加申请人操作
    $scope.addAlgorithmApplyerInfo = function(){
        $scope.algorithmInfo.jyAlgorithmApplyerInfoVOList.push(new JyAlgorithmApplyerInfo());

        $log.info($scope.algorithmInfo);
    };

    //页面左侧添加按钮显示隐藏
    $('#addApplicantBtn').on('mouseenter', function () {
        $(this).stop().animate({right: '-5px'}, 300)
    });
    $('#addApplicantBtn').on('mouseleave', function () {
        $(this).stop().animate({right: '-92px'}, 300)
    });



    //点击下一步操作
/*    $scope.nextStep = function () {
    	debugger;
        if ($scope.headInfo.step == 1 && validateAlgorithmStep1Form()) {
            $scope.saveAlgorithmInfo(function () {
                $state.go('dashboard.algorithm.algorithmStep2');
            });
        }else if($scope.headInfo.step == 2 && validateAlgorithmStep2Form()){
            $scope.saveAlgorithmInfo(function () {
                $state.go('dashboard.algorithm.algorithmStep3');
            });
        }
    };
    */
    
    
    //点击下一步操作
    $scope.nextStep = function () {
        if ($scope.headInfo.step == 1 && validateAlgorithmStep1Form()) {
            $scope.saveAlgorithmInfo(function () {
            	//增加第二步骤，用于录入维护车主的投保险种，绝对免赔率
               // $state.go('dashboard.algorithm.algorithmStep201');
            	$state.go('dashboard.algorithm.algorithmStep2');
            });
        }else if($scope.headInfo.step == 2){
        	
            $scope.saveAlgorithmInfo(function () {
                $state.go('dashboard.algorithm.algorithmStep3');//将原先第二部修改为第三步
            });
        }else if($scope.headInfo.step == 3 && validateAlgorithmStep2Form()){
            $scope.saveAlgorithmInfo(function () {
                $state.go('dashboard.algorithm.algorithmStep4');//将原先第三修改为第四步，将原先的第四步骤修改为第五步
            });
        }
    };
    
    //点击上一步
    $scope.preStep = function(){
        if ($scope.headInfo.step == 2) {
            $state.go('dashboard.algorithm.algorithmStep1');
        } else if ($scope.headInfo.step == 3) {
            $state.go('dashboard.algorithm.algorithmStep2');
        } else if ($scope.headInfo.step == 4) {
            $state.go('dashboard.algorithm.algorithmStep3');
        }
    }
});