angular.module('sbAdminApp').controller('AIOCourtSetp2Ctrl', function (PoliceConfig, PoliceService, AdminConstant, $location, $scope, $stateParams, $state, $http, $log, AlgorithmConfig, AlgorithmService, DictionaryConfig, toaster, $filter, IdentityService,$rootScope) {
    //住院治疗
    $scope.step.stepId = 2; 
    console.log($scope.step,"222");
    var hospital = function () {
		this.hospitalizedDate = DictionaryConfig.getDate()//入院时间
		this.leaveHospitalDate = DictionaryConfig.getDate()//出院时间
        this.restDaysOfHospitalization =  "" //医嘱休息天数(住院治疗)
        this.hospitalizedDateOpen = false
		this.leaveHospitalDateOpen = false
    }

$scope.titleShowFn = function () {
    //提示文字
	$scope.dynamicPopover = ['填写实际门诊就医次数，每就医一次，计算为一日。', '根据医院要求的休息时间填写。','以鉴定机构出具鉴定报告的评定时间为准。'];
	//点击提示显示关闭
	$scope.isDynamicPopover = false; //门诊次数
    $scope.isDays = false; //休息天数
    $scope.isDaysPopover = false;
    $scope.isDisability = false;
    $scope.isIndex = null;
	$scope.dynamicPopoverFn = function ($event,index) {
        $scope.stopprevent($event)
        if(index=='isDynamicPopover'){
            $scope.isDynamicPopover = !$scope.isDynamicPopover
        }else if(index=='isDaysPopover'){
            $scope.isDaysPopover = !$scope.isDaysPopover
        }else if(index=='isDisability'){//残疾评定时间
            $scope.isDisability = !$scope.isDisability
        }else{
            $scope.isIndex = index
        }
	}
	//点击关闭提示
	$scope.allClose = function ($event) {
		$scope.stopprevent($event)
        $scope.isDynamicPopover = false;
        $scope.isIndex = null
        $scope.isDays = false;
        $scope.isDaysPopover = false;
    }
}
    //伤残等级
    $scope.disabledLevelArr = DictionaryConfig.disabledLevelArr
	//组织默认事件
	$scope.eventStop = function ($event) {
		$event.preventDefault();
		$event.stopPropagation();
	}
	//选择入院时间
	$scope.hospitalizedDate = function ($event,hospital) {
        $scope.eventStop($event);
        hospital.hospitalizedDateOpen = !hospital.hospitalizedDateOpen 
	}
	//出院时间
	$scope.leaveHospitalDate = function ($event,hospital) {
        $scope.eventStop($event);
        hospital.leaveHospitalDateOpen = !hospital.leaveHospitalDateOpen 
	}
	// $scope.selectShow = true;
	// $scope.selectBxShow = function () {
	// 	$scope.selectShow = !$scope.selectShow
    // }
    
  //伤残评定时间
  $scope.Disability = function () {
       $scope.titleShowFn();
      if($scope.lawCase.caseType=='1'){
        $scope.lawCase.deathDate = DictionaryConfig.getDate()
      }
  }()
     
    //点击添加等级
    $scope.showWarp = null;
    $scope.addDisabledLevel = function () {
        $scope.showWarp = true;
    }

     /**
   * 通过伤残等级查找赔偿系数(单个)
   */
  $scope.reverseLevel = function(level){
    var rate = ""
    switch (level){
      case '一级': rate = 100; break;
      case '二级': rate = 90; break;
      case '三级': rate = 80; break;
      case '四级': rate = 70; break;
      case '五级': rate = 60; break;
      case '六级': rate = 50; break;
      case '七级': rate = 40; break;
      case '八级': rate = 30; break;
      case '九级': rate = 20; break;
      case '十级': rate = 10; break;
    }

    return rate;
  },


    //等级选择
    $scope.focus = 0
    $scope.leave = "一级"
    $scope.changeLevel = function ($event,focus) {
       console.log($event.target.innerText);
       $scope.focus = focus  
       $scope.leave = $event.target.innerText  //等级
    }
    
    //确定增加伤残等级
    $scope.chengeLevelBtn = function () {
        if(!$scope.hospitalNum){
            $rootScope.toaster("error", "警告", "请输入受伤数量");
            return false;
        }
         //伤残等级
        var  DisabledLevel = function () {
            this.level =  $scope.leave
            this.times = $scope.hospitalNum
            this.rate =  $scope.reverseLevel($scope.leave)
        }
        $scope.showWarp = false;
       
        $scope.lawCase.disabledLevelArray.push(new DisabledLevel())
        console.log( $scope.lawCase.disabledLevelArray);
        $scope.calculateCompensateRate()
    }

    //取消增加伤残等级
    $scope.callOff = function () {
        $scope.showWarp = false;
    }
    //出院时间
	$scope.open = function ($event) {
		$scope.eventStop($event);
		$scope.opened = true;
    };
    //删除等级
    $scope.deleatLevel = function (e,$index) {
        $scope.lawCase.disabledLevelArray.splice($index, 1)
        $scope.calculateCompensateRate()
    }
    
    //门诊住院tab切换控制
	$scope.selectTreatmentType = function (treatmentType) {
        $scope.lawCase.treatmentType = treatmentType
        $scope.titleShowFn()
        switch (treatmentType){
            case '1':  $scope.lawCase.applicantArray[0].hospitalizationArray = [];break;
            case '2': 
                $scope.lawCase.applicantArray[0].outPatientTimes = "";
                $scope.lawCase.applicantArray[0].restDaysOfOutPatient = "";
                $scope.lawCase.applicantArray[0].hospitalizationArray = [new hospital()]; break;
            case '3':  $scope.lawCase.applicantArray[0].hospitalizationArray = [new hospital()]; break;
          }
	}
	
    //添加住院治疗信息
    $scope.addHospitalization = function(){
        $scope.lawCase.applicantArray[0].hospitalizationArray.push(new hospital())
    }
    //删除住院治疗信息
    $scope.removeHospitalized = function(e){
        $scope.lawCase.applicantArray[0].hospitalizationArray.splice(index, 1)
    }

 
    /**
     * 计算伤残赔偿系数
     */
    $scope.calculateCompensateRate = function(){
        if ($scope.lawCase.disabledLevelArray && $scope.lawCase.disabledLevelArray.length > 0){
            $scope.rateArray = $scope.lawCase.disabledLevelArray.map(function(v){
                return v.rate;
            }).sort(function (a, b) {
                return b - a;
            });
            $scope.tensDigit = $scope.rateArray[0]
            $scope.singleDigit = 0
        if ($scope.rateArray.length > 1) {
            $scope.rateArray.forEach(function(v, index) {
                if (index > 0) {
                    $scope.singleDigit += parseInt(v) / 10
                }
            })
            $scope.singleDigit = $scope.singleDigit > 9 ? 9 : $scope.singleDigit
        }
        $scope.lawCase.compensateRate = ($scope.tensDigit + $scope.singleDigit) > 100 ? 100 : $scope.tensDigit + $scope.singleDigit
        }
    }
	//下一步
	$scope.nextStep = function () {
		//页面自定义异常
		var level = DictionaryConfig.toaster.level;
		var title = DictionaryConfig.toaster.title;
		if($scope.lawCase.treatmentType=='1' || $scope.lawCase.treatmentType=='3'){
			if(!$scope.lawCase.applicantArray[0].outPatientTimes){
        $rootScope.toaster(level.error, title.error, "门诊次数不能为空");
        return false;
			}
			if(!$scope.lawCase.applicantArray[0].restDaysOfOutPatient){
                $rootScope.toaster(level.error, title.error, "医嘱休息天数不能为空");
                return false;
			}
		}
		  if($scope.lawCase.treatmentType=='2' || $scope.lawCase.treatmentType=='3'){
        var hospitalization = $scope.lawCase.applicantArray[0].hospitalizationArray
        for (var i = 0; i < hospitalization.length; i++){
            //医嘱休息天数
            if (!hospitalization[i].restDaysOfHospitalization) {
                $rootScope.toaster(level.error, title.error, "医嘱休息天数不能为空");
                return false;
            }
        }
      }
      $state.go("home_page.prejudge_new.AIOCourtSetp3")
      $scope.calculateDaysOfHospital();
      $scope.calculateCompensateRate();
    }
    
    //上一步
    $scope.preveStep = function () {
        $state.go("home_page.prejudge_new.AIOCourtSetp1")
    }
});