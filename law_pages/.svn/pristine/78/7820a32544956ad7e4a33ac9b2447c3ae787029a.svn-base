
angular.module('sbAdminApp').controller('AIOCourtSetp1Ctrl', function (AdminConstant, $location, $scope, $stateParams, $state, $http, $log, AlgorithmConfig, AlgorithmService, DictionaryConfig, toaster, $filter, IdentityService, PrejudgeService, PrejudgeConfig) {
	$scope.prejudgeService = PrejudgeService;
	//提示文字
	$scope.showId = 0;
	$scope.dynamicPopover = ['指事故侵权一方为机动车，被侵权一方为行人或非机动车驾驶人或乘客。', '指事故双方均为机动车，受害人为一方机动车上任一人员。', '只计算事故总损失的案件。','默认使用最新的人身损害赔偿标准，可手动进行修改。'];
	//点击提示显示关闭
	$scope.isDynamicPopover = false; //事故类型
	$scope.isYear = false; //赔偿年限
	$scope.dynamicPopoverFn = function ($event,index) {
		$scope.stopprevent($event)
		index=='isDynamicPopover'?$scope.isDynamicPopover = !$scope.isDynamicPopover:$scope.isYear = !$scope.isYear
	}
	//点击关闭提示
	$scope.allClose = function ($event) {
		$scope.stopprevent($event)
		$scope.isDynamicPopover = false;
		$scope.isYear = false;
	}
    //定义日期
    $scope.co = {
		opened: false,
		creatOpened: false,
		deathDate: false
	}
	$scope.step.stepId = 1; 
	//出生日期
	$scope.open = function ($event) {
		$scope.stopprevent($event)
		$scope.co.opened = true;
	};
	
	//事故发生日期
	$scope.creatOpened = function ($event) {
		$scope.stopprevent($event)
		$scope.co.creatOpened = true;
	};

	//死亡时间
	$scope.deathDate = function ($event) {
		$scope.stopprevent($event)
		$scope.co.deathDate = true;
	};


	/**
	 * 对象
	 */
	var Applicant = function (personType) {
		this.name = "",
		this.personType = personType
	}

	$scope.region = "江苏省-南京市-建邺区"
  //受害性质
  $scope.responsibilityLabel = $scope.lawCase.accidentType =='0'?'车方责任':($scope.lawCase.accidentType =='1'?'对方车辆责任':'')
  $scope.accidentTypeArray = DictionaryConfig.accidentTypeArray//车方责任
  $scope.caseTypeArray = DictionaryConfig.caseTypeArray//车方责任
	$scope.responsibility = $scope.lawCase.accidentType =='1'?DictionaryConfig.responsibilityOther:DictionaryConfig.responsibility//车方责任
	$scope.standardYearArray = [new Date().getFullYear() - 2, new Date().getFullYear() - 1, new Date().getFullYear()],//赔偿标准

		//填充区域信息
		$scope.adminRegion = AdminConstant.administrationRegions

	//地址树加载
	$scope.isShowTree = false;
	$scope.treeConfig = {
		core: {
			multiple: false,
			animation: true,
			error: function (error) {
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

	$scope.blurAdmin = function () {
		if ($scope.isShowTree) {
			$timeout(function () {
				$scope.isShowTree = false;
			}, 200);
		}
	};

	//选择节点信息
	$scope.selectAdmin = function (node, selected, event) {
		var selectedNodes = selected.selected;
		if (selectedNodes.length > 0 && selected.node.type == 'default') {
			var selectedRegion = $scope.adminRegion[selectedNodes[0]];
			if ($scope.lawCase.regionName != selectedRegion.fullName) {
				$scope.lawCase.regionName = selectedRegion.fullName;
				angular.element("#regNamebox").hide();
				$scope.isShowTree = false;
				//选择区域的时候进行触发计算赔偿标准和居民收入支出标准
				// $scope.findIncomeAndCompensate(true);
				$scope.getStandardFeeByRegion()
			}
		}
	};

	$scope.findIncomeAndCompensate = function () {
		if ($scope.lawCase.regionName && $scope.lawCase.createDate && $scope.lawCase.household) {
			//计算居民收支标准以及赔偿标准
			$scope.getStandardFeeByRegion();
		}
	}


	/**
	  * 通过地区，获取赔偿标准
	  */
	$scope.getStandardFeeByRegion = function () {
		var data = {
			regionName: $scope.lawCase.regionName,
			household: $scope.lawCase.household,
			standardYear: $scope.lawCase.standardYear
		}

		//根据事故发生日期在居民收支表中查询起始年度
		$scope.prejudgeService.queryCalculateStandard(data).success(function (result) {
			if (result.code == PrejudgeConfig.commonConstant.SUCCESS) {
				if (result.result) {
					var calculateResultVO = result.result;
					//误工费
					if (calculateResultVO.lostIncome) {
						$scope.lawCase.compensateStandard.lostIncome = calculateResultVO.lostIncome;
					} else {
						$scope.lawCase.compensateStandard.lostIncome = "";
					}
					//护理费
					if (calculateResultVO.standardNurseFee) {
						$scope.lawCase.compensateStandard.standardNurseFee = calculateResultVO.standardNurseFee;
					} else {
						$scope.lawCase.compensateStandard.standardNurseFee = "";
					}
					//住院伙食补助费
					if (calculateResultVO.hospitalFoodSubsidies) {
						$scope.lawCase.compensateStandard.hospitalFoodSubsidies = calculateResultVO.hospitalFoodSubsidies;
					} else {
						$scope.lawCase.compensateStandard.hospitalFoodSubsidies = "";
					}
					//营养费
					if (calculateResultVO.thesePayments) {
						$scope.lawCase.compensateStandard.thesePayments = calculateResultVO.thesePayments;
					} else {
						$scope.lawCase.compensateStandard.thesePayments = "";
					}
					//交通费
					if (calculateResultVO.transportationFee) {
						$scope.lawCase.compensateStandard.transportationFee = calculateResultVO.transportationFee;
					}
					//住宿费
					if (calculateResultVO.accommodationFee) {
						$scope.lawCase.compensateStandard.accommodationFee = calculateResultVO.accommodationFee;
					} else {
						$scope.lawCase.compensateStandard.accommodationFee = "";
					}
					//丧葬费
					if (calculateResultVO.funeralFeeStandard) {
						$scope.lawCase.compensateStandard.funeralFeeStandard = calculateResultVO.funeralFeeStandard;
					} else {
						$scope.lawCase.compensateStandard.funeralFeeStandard = "";
					}
					//精神损害抚慰金 刘长明，芮玉群  2018-08-02 无标准默认5000
					if (calculateResultVO.spiritualConsolationFee) {
						$scope.lawCase.compensateStandard.spiritualConsolationFee = calculateResultVO.spiritualConsolationFee;
					} else {
						$scope.lawCase.compensateStandard.spiritualConsolationFee = "5000";
					}

					//计算收入和支出标准[农村和城镇]
					if (calculateResultVO.urbanSalary) {
						$scope.lawCase.compensateStandard.wageIncome = calculateResultVO.urbanSalary;
					} else {
						$scope.lawCase.compensateStandard.wageIncome = "";
					}

					//农村净收入
					if (!calculateResultVO.ruralNetIncome) {
						calculateResultVO.ruralNetIncome = "";
					}
					//农村平均支出
					if (!calculateResultVO.ruralAverageOutlay) {
						calculateResultVO.ruralAverageOutlay = "";
					}
					//城镇居民可支配收入
					if (!calculateResultVO.urbanDisposableIncome) {
						calculateResultVO.urbanDisposableIncome = "";
					}
					//城镇居民平均支出
					if (!calculateResultVO.urbanAverageOutlay) {
						calculateResultVO.urbanAverageOutlay = "";
					}
					//农村的
					$scope.lawCase.compensateStandard["1"] = {
						"income": calculateResultVO.ruralNetIncome,
						"expense": calculateResultVO.ruralAverageOutlay
					};
					//城镇赔偿标准
					$scope.lawCase.compensateStandard["2"] = {
						"income": calculateResultVO.urbanDisposableIncome,
						"expense": calculateResultVO.urbanAverageOutlay
					};
				} else {
					$rootScope.toaster("error", "错误：" + result.code, result.message);
				}
			}
		});
	};
  $scope.getStandardFeeByRegion();
	
	angular.element("#regNameInput").click(function (e) {
		angular.element("#regNamebox").show();
		stopBubble(e);
	});
	angular.element("#regNamebox").click(function (e) {
		stopBubble(e);
	});
	angular.element("body").click(function () {
		angular.element("#regNamebox").hide();
	});
	function stopBubble(e) {
		// 如果提供了事件对象，则这是一个非IE浏览器
		if (e && e.stopPropagation) {
			// 因此它支持W3C的stopPropagation()方法
			e.stopPropagation();
		} else {
			// 否则，我们需要使用IE的方式来取消事件冒泡
			window.event.cancelBubble = true;
		}
	}

	/**
	* lawCase数据改变事件
	*/
	// $scope.autoFn = function () {
	// 	$scope.caseTypeChange()
	// 	$scope.accidentTypeChange()
	// }()
	$scope.accidentTypeChange = function () {
		var currentValue = $scope.lawCase.accidentType
		if (currentValue == '0') {
			$scope.showId = 0;
			$scope.responsibilityLabel = '车方责任'
			$scope.responsibility = DictionaryConfig.responsibility
		} else if (currentValue == '1') {
			$scope.showId = 1;
			$scope.responsibilityLabel = '对方车辆责任'
			$scope.responsibility = DictionaryConfig.responsibilityOther
		} else {
			$scope.showId = 2;
			$scope.responsibilityLabel = ''
			$scope.lawCase.applicantArray[0].responsibleRate = 0
		}
		
		//改变车方/对方责任
		$scope.calculateResponsibleRate();
	}

	/**
	 * 误工费
	 */
	var LostIncome = function () {
		this.isFixedIncome = false
		this.incomeEvidence = 2
		this.industryType = ""
		this.applyAmount = ""
	}

	//伤残
	$scope.caseTypeChange = function () {
    var currentValue = $scope.lawCase.caseType
    if(currentValue == '0'){//普通无伤残
      //清空(死亡伤残)费用项
      $scope.lawCase.feeDetail.forEach(function(v){
        if(v.id == 12 || v.id == 14 || v.id == 15 || v.id == 16 || v.id == 19){
          v.applyAmount = 0;
        }
      })
  	} else if (currentValue == '1') {//伤残
			$scope.lawCase.compensateRate = 10
			// $scope.lawCase.disabledLevelArray = [new DisabledLevel()];
			var now = new Date();
			var defalutDate = now.getFullYear()+"-"+(now.getMonth()+1)+"-"+now.getDate()
			$scope.lawCase.deathDate = defalutDate;
			var lostFee = $scope.lawCase.feeDetail.filter(function(v) {//处理事故人员误工费
				return v.id == '19'
			})[0]
			if (lostFee.personArray) {
				lostFee.personArray = []
			}
			
			//清空(死亡)费用项
			$scope.lawCase.feeDetail.forEach(function(v){
				if(v.id == 15 || v.id == 16 || v.id == 19){
					v.applyAmount = 0;
				}
			})
		} else if (currentValue == '2') {//死亡
			$scope.lawCase.disabledLevelArray = [];
			$scope.lawCase.compensateRate = 100
			$scope.lawCase.isDeadAtTheScene = "1"
			 $scope.selectShow = true
			$scope.lawCase.deathDate = $scope.lawCase.createDate
			var lostFee = $scope.lawCase.feeDetail.filter(function(v) {//处理事故人员误工费
				return v.id == '19'
			})[0]
			lostFee.personArray = []
			var lostIncome = new LostIncome()
      lostIncome.id = '19'
			lostFee.personArray.push(lostIncome)
			$scope.lawCase.disabledLevelArray = []
  
      //清空(伤残)费用项
      $scope.lawCase.feeDetail.forEach(function(v){
        if(v.id == 12){
          v.applyAmount = 0;
        }
      })
		} else {//财产损失
      //清空(伤残)费用项
      $scope.lawCase.feeDetail.forEach(function(v){
        if(v.group != 7){
          v.applyAmount = 0;
        }
      })
		}
	}

	//死亡时间
	$scope.selectBxShow = function () {
		$scope.selectShow = !$scope.selectShow
		if($scope.selectShow){
			$scope.lawCase.isDeadAtTheScene = 1
			$scope.lawCase.deathDate = $scope.lawCase.createDate
		}else{
			$scope.lawCase.isDeadAtTheScene = 0
		}
	}

	//切换城市
	$scope.cityChange = function (value) {
		$scope.lawCase.household = $scope.lawCase.applicantArray[0].household = value
		$scope.getStandardFeeByRegion();
	}
	
	//切换年度
	$scope.yearChange = function (value) {
		$scope.getStandardFeeByRegion();
	}

	//根据事故性质，计算责任比例
	$scope.calculateResponsibleRate = function () {
		if ($scope.lawCase.accidentType == '0') {//机动车与行人或非机动车
			if ($scope.lawCase.responsibility == '0')
				$scope.lawCase.applicantArray[0].responsibleRate = 100
			else if ($scope.lawCase.responsibility == '1')
				$scope.lawCase.applicantArray[0].responsibleRate = 80
			else if ($scope.lawCase.responsibility == '2')
				$scope.lawCase.applicantArray[0].responsibleRate = 60
			else if ($scope.lawCase.responsibility == '3')
				$scope.lawCase.applicantArray[0].responsibleRate = 40
			else if ($scope.lawCase.responsibility == '4')
				$scope.lawCase.applicantArray[0].responsibleRate = 10
		} else if ($scope.lawCase.accidentType == '1') {//机动车之间
			if ($scope.lawCase.responsibility == '0')
				$scope.lawCase.applicantArray[0].responsibleRate = 100
			else if ($scope.lawCase.responsibility == '1')
				$scope.lawCase.applicantArray[0].responsibleRate = 70
			else if ($scope.lawCase.responsibility == '2')
				$scope.lawCase.applicantArray[0].responsibleRate = 50
			else if ($scope.lawCase.responsibility == '3')
				$scope.lawCase.applicantArray[0].responsibleRate = 30
			else if ($scope.lawCase.responsibility == '4')
				$scope.lawCase.applicantArray[0].responsibleRate = 0
		} else {
			$scope.lawCase.applicantArray[0].responsibleRate = 0
		}
		//对方车辆责任
		// $scope.accidentTypeChange();
	}

	//下一步
	$scope.nextStrp = function () {
		$state.go("home_page.prejudge_new.AIOCourtSetp2",{stepId: 1})
	}
});