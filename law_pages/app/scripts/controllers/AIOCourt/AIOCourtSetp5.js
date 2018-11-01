angular.module('sbAdminApp').controller('AIOCourtSetp5Ctrl', function (PoliceConfig,PoliceService,AdminConstant,$location,$scope, $stateParams, $state, $http, $log, AlgorithmConfig, AlgorithmService, DictionaryConfig, toaster, $filter,IdentityService) {
      /**
   * 计算保险费用
   */
  $scope.step.stepId = 5; 
  $scope.calculateInsuranceFee = function (){
    var result = {
      medicalFee: 0,//医疗费用
      deathFee: 0,//死亡伤残费用
      propertyFee: 0//财产损失
    }

    var medicalCode = ['03', '04', '06'];//医疗费，后续治疗费，住院伙食补助费
    //误工费08、护理费09、残疾赔偿金12、残疾辅助器具费13、被抚养人生活费14、精神抚慰金17、死亡赔偿金15、丧葬费16、处理人员误工费19、交通费10、住宿费11；
    //精神抚慰金：此项费用优先在交强险的死亡伤残中进行赔付，如果此项金额超出交强险死亡伤残限额，
    //剩下的部分商业险不予赔付，由双方按责任比例进行赔付；
    var deathCode = ['08', '09', '12', '13', '14', '17', '15', '16', '19','10', '11'];
    $scope.lawCase.feeDetail.forEach(function(v) {
      if ($scope.lawCase.caseType != '3'){//非财产损失
        //医疗赔偿费用
        if (medicalCode.indexOf(v.id) > -1) {
          result.medicalFee += parseFloat(v.applyAmount || 0)
        }

        //死亡伤残赔偿费用
        if (deathCode.indexOf(v.id) > -1) {
          result.deathFee += parseFloat(v.applyAmount || 0)
        }
      }
      
      //财产损失费用
      if (v.group == '7'){
        result.propertyFee += parseFloat(v.applyAmount || 0)
      }
    })

    var compulsoryInsurance = {};//交强险
    if ($scope.lawCase.responsibility == '4'){//无责
      compulsoryInsurance = {
        medicalFee: 1000,
        deathFee: 11000,
        propertyFee: 100
      }
    } else {//有责任
      compulsoryInsurance = {
        medicalFee: 10000,
        deathFee: 110000,
        propertyFee: 2000
      }
    }

    result.medicalFee = Math.min(result.medicalFee, compulsoryInsurance.medicalFee)
    result.deathFee = Math.min(result.deathFee, compulsoryInsurance.deathFee)
    result.propertyFee = Math.min(result.propertyFee, compulsoryInsurance.propertyFee)

    $scope.lawCase.compulsoryInsuranceFee = result

    $scope.lawCase.compulsoryInsuranceAmount = (parseFloat(result.medicalFee || 0) + parseFloat(result.deathFee || 0) + parseFloat(result.propertyFee || 0)).toFixed(2)
    $scope.lawCase.compulsoryInsuranceOutterAmount = (parseFloat($scope.lawCase.applyTotal) - parseFloat($scope.lawCase.compulsoryInsuranceAmount)).toFixed(2)
    $scope.lawCase.innerInsuracePrecent = parseInt($scope.lawCase.applyTotal)==0?0:(parseFloat($scope.lawCase.compulsoryInsuranceAmount / $scope.lawCase.applyTotal) * 100).toFixed(2)
    $scope.lawCase.outterInsuracePrecent = parseInt($scope.lawCase.applyTotal) == 0 ? 0 :(parseFloat($scope.lawCase.compulsoryInsuranceOutterAmount / $scope.lawCase.applyTotal) * 100).toFixed(2)
  }
  $scope.calculateInsuranceFee()

        //第三个图

    /**
    * 计算对方己方
    */
   $scope.aboutInsuranceFee = function (){
    var rate = $scope.lawCase.applicantArray[0].responsibleRate
    if ($scope.lawCase.accidentType == '0'){//机动车与行人或非机动车
        $scope.personalData = [
        {
          value: $scope.lawCase.compulsoryInsuranceOutterAmount * (100 - rate) / 100,
          name: '伤者(' + (100 - rate) + '%)'
        }, {
          value: $scope.lawCase.compulsoryInsuranceOutterAmount * rate / 100,
          name: '车方(' + rate + '%)'
        }
      ] 
    } else if ($scope.lawCase.accidentType == '1'){//机动车之间
        $scope.personalData = [
        {
          value: $scope.lawCase.compulsoryInsuranceOutterAmount * (100 - rate) / 100,
          name: '己方(' + (100 - rate) + '%)'
        }, {
          value: $scope.lawCase.compulsoryInsuranceOutterAmount * rate / 100,
          name: '对方(' + rate + '%)'
        }
      ] 
    } else {//单方事故
        $scope.personalData = [ {
          value: $scope.lawCase.compulsoryInsuranceOutterAmount * rate / 100,
          name: '己方(100%)'
        }
      ] 
    }
}
$scope.aboutInsuranceFee();
    $scope.innerInsuracePrecent = $scope.lawCase.compulsoryInsuranceAmount+'元（'+($scope.lawCase.applyTotal == 0? 0 : $scope.lawCase.innerInsuracePrecent)+'%）'
	$scope.outterInsuracePrecent = $scope.lawCase.compulsoryInsuranceOutterAmount+'元（'+($scope.lawCase.applyTotal == 0? 0 : $scope.lawCase.outterInsuracePrecent)+'%）'
    console.log( $scope.lawCase);
    console.log( $scope.innerInsuracePrecent);
    console.log( $scope.outterInsuracePrecent);
        //第一个图
	    /**
		 * 图标所需数据
		 */ 
        var oneData = [{
            value: $scope.lawCase.compulsoryInsuranceAmount,
            name: $scope.lawCase.compulsoryInsuranceAmount + '(' + ($scope.lawCase.applyTotal == 0 ? 0 : $scope.lawCase.innerInsuracePrecent) + '%)\n\n交强险限额内损失',
            icon: 'circle',
            }, {
            value: $scope.lawCase.compulsoryInsuranceOutterAmount,
            name: $scope.lawCase.compulsoryInsuranceOutterAmount + '(' + ($scope.lawCase.applyTotal == 0 ? 0 : $scope.lawCase.outterInsuracePrecent) + '%)\n\n交强险限额外损失',
            icon: 'circle',
        }]
		option = {
			color: ['#00ade2','#fcab52'],
			tooltip: {
				show: true
			},
			legend: {
				orient: 'vertical',
				y: 'bottom',
				data: oneData,
				textStyle:{
					fontSize:20
				},
				itemWidth:18,
				itemHeight:18,
				itemGap:50
			},
			textStyle:{
				fontSize:20,
				color:'#666666'
			},
			series: [{
				type: 'pie',
                radius: ['55%', '60%'],
                formatter: ' {c} ({d}%)\n\n{b}',
                center: ['50%', '36%'],
				label: {
					normal: {
						show: false,
						position: 'center'
					},
					fontSize:25,
					emphasis: {
						show: false
					}
				},
				data: oneData
            },{
                name: '事故总损失',
                type: 'pie',
                radius: ['55%', '55%'],
                formatter: '{a} <br/>{b}: {c} ({d}%)',
                center: ['50%', '36%'],
                label: {
                    normal: {
                        position: 'center'
                    }
                },
                data: [{
                    value: $scope.lawCase.applyTotal,
                    name: '事故总损失\n\n'+$scope.lawCase.applyTotal,
                  	color:'#000000',
                  	 fontSize:25
                }],
            }
        ]
		};
		
	var myChart = echarts.init(document.getElementById('accidentTotalLoss'));
	myChart.setOption(option);

//第二个图


	
    var pieData = [{
        value: $scope.lawCase.compulsoryInsuranceFee.medicalFee,
        name: '医疗赔偿费用'
      }, {
        value: $scope.lawCase.compulsoryInsuranceFee.deathFee,
        name: '死亡伤残赔偿费用'
      }, {
        value: $scope.lawCase.compulsoryInsuranceFee.propertyFee,
        name: '财产损失赔偿费用'
      }]
	option1 = {
        color: ["#59c9ee", "#00ade5", "#b2e5f6"],
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        textStyle:{
				fontSize:20,
				color:'#666666'
			},
		series: [
            {
                name:'交强险限额内损失',
                type:'pie',
                radius: ['55%', '62%'],
                center: ['57%', '50%'],
                label: {
                    normal: {
                        formatter: ' {c} ({d}%)\n\n{b}',
                        rich: {
                            a: {
                                color: '#999',
                                lineHeight: 22,
                                align: 'center'
                            },
                            b: {
                                fontSize: 16,
                                lineHeight: 33
                            },
                            per: {
                                color: '#eee',
                                padding: [2, 4],
                                borderRadius: 2
                            }
                        }
                    }
                },
                data:pieData
            },{
                name: '交强险限额内损失',
                type: 'pie',
                radius: ['30%', '30%'],
                formatter: '{a} <br/>{b}: {c} ({d}%)',
                center: ['57%', '50%'],
                label: {
                    normal: {
                        position: 'center'
                    }
                },
                data: [{
                    value: $scope.lawCase.compulsoryInsuranceAmount,
                    name: '交强险限额内损失\n\n'+$scope.lawCase.compulsoryInsuranceAmount,
                  	color:'#000000',
                  	 fontSize:25
                }],
            }
        ]
	  }
	echarts.init(document.getElementById('accidentTotalLoss2')).setOption(option1);
    
   


    

    option2 = {
        color: ["#fdd1a0", "#fcab50"],
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        textStyle:{
			fontSize:20,
			color:'#666666'
		},
        series: [
            {
                name:'交强险限额外损失',
                type:'pie',
                radius: ['55%', '62%'],
                center: ['57%', '50%'],
                label: {
                    normal: {
                        formatter: ' {c} ({d}%)\n\n{b}',
                        rich: {
                            a: {
                                color: '#999',
                                lineHeight: 22,
                                align: 'center'
                            },
                            hr: {
                                borderColor: 'rgba(177, 230,256, 1)',
                                width: '100%',
                                borderWidth: 0.5,
                                height: 0
                            },
                            b: {
                                fontSize: 16,
                                lineHeight: 33
                            },
                            per: {
                                color: '#eee',
                                padding: [2, 4],
                                borderRadius: 2
                            }
                        }
                    }
                },
                data: $scope.personalData
            },{
                name: '交强险限额外损失',
                type: 'pie',
                radius: ['30%', '30%'],
                formatter: '{a} <br/>{b}: {c} ({d}%)',
                center: ['57%', '50%'],
                label: {
                    normal: {
                        position: 'center'
                    }
                },
                data: [{
                    value: $scope.lawCase.compulsoryInsuranceOutterAmount,
                    name: '交强险限额外损失\n\n'+$scope.lawCase.compulsoryInsuranceOutterAmount,
                  	color:'#000000',
                  	 fontSize:25
                }],
            }
        ]
	  }
    echarts.init(document.getElementById('accidentTotalLoss3')).setOption(option2);
    
    //点击显示预约调解弹框
    $scope.wxchart == false
    $scope.wxchartShow = function () {
        $scope.wxchart = !$scope.wxchart
    }

  
});