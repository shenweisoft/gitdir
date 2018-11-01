angular.module('sbAdminApp').controller('distributionAnalysis', function( $scope, $state, $log, $rootScope, $filter, WeChatService, WeChatConfig) {
  var sexDistribution = echarts.init(document.getElementById('sexDistribution'));  //性别分布统计
  var ageDistribution = echarts.init(document.getElementById('ageDistribution'));  //年龄分布分析
  var myChart = echarts.init(document.getElementById('map'));  //性别分布统计
  /**
   * 初始化性别统计
   */
  $scope.buildSexCollection = function(){
    var legendArr = $scope.genderVisit.map(function(v){
      return v.name
    })
    var option_sexDistribution = {
      color:['#76a1ff','#ff9fd2'],
      tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)"
      },
      legend: {
        orient: 'vertical',
        x: 'left',
        data: legendArr
      },
      series: [
        {
          name:'性别',
          type:'pie',
          radius: ['50%', '70%'],
          avoidLabelOverlap: false,
          label: {
            normal: {
              show: false,
              position: 'center'
            },
            emphasis: {
              show: true,
              textStyle: {
                fontSize: '30',
                fontWeight: 'bold'
              }
            }
          },
          labelLine: {
            normal: {
              show: false
            }
          },
          data: $scope.genderVisit
        }
      ]
    };
  
    sexDistribution.setOption(option_sexDistribution);
  }
  
  /**
   * 初始化年龄统计
   */
  $scope.buildAgeCollection = function(){
    var legendArr = $scope.agesVisit.map(function(v){
      return v.name
    })
      var option_ageDistribution ={
        color:['#52dff0','#cc70ff','#7076fe','#64b7fd','#ff7e61','#ffcb51'],
        title : {
          text: '吉林省道交微平台访问年龄',
          subtext: '数据来源于腾讯',
          x:'center'
        },
        tooltip : {
          trigger: 'item',
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          x : 'center',
          y : 'bottom',
          data: legendArr
        },
        calculable : true,
        series : [
          {
            name:'年龄分布',
            type:'pie',
            radius : [20, 110],
            center : ['50%', '50%'],
            roseType : 'area',
            label: {
              normal: {
                show: true
              },
              emphasis: {
                show: true
              }
            },
            lableLine: {
              normal: {
                show: true
              },
              emphasis: {
                show: true
              }
            },
            data: $scope.agesVisit
          },
        ]
      }
      ageDistribution.setOption(option_ageDistribution);
    }
  
  /**
   * 获取吉林省道交一体化微平台的用户画像信息
   */
  $scope.getAnalysisUserPortrait = function(){
    var startDate = $filter('date')(new Date(new Date().getTime() - 30*24*60*60*1000), 'yyyy-MM-dd'); //前一个月
    var endDate = $filter('date')(new Date(new Date().getTime() - 24*60*60*1000), 'yyyy-MM-dd'); //前一天
    var data = {
        appId: "wx5b370b4a7c400b89",
        startDate: startDate,
        endDate: endDate
    }
    WeChatService.getAnalysisUserPortrait(data).success(function(res){
      console.log(res)
      if(res.code == '0' && !res.result.errorcode){
        $scope.visit_uv = res.result
        $scope.genderVisit = res.result.visit_uv.genders
        $scope.totalUserNum = 0
        $scope.genderVisit.forEach(function(v) {
          $scope.totalUserNum += v.value
        })
        $scope.agesVisit = res.result.visit_uv.ages
  
        $scope.buildSexCollection()
        $scope.buildAgeCollection()
      } else {
          console.log(res.result.errormessage)
      }
    })
  }()
     //显示地图
  function showMap(myChart, series, reset) {  //reset true使用新的option  false 合并option
    console.log("11")
    var option = {
      tooltip: {
        trigger: 'item',
        formatter: function (params) {  //汇聚路线提示框
          return;
        }
      },
      legend: {
        y:'bottom',
        x:'left',
        left: 30,
        itemGap: 30,
        itemWidth: 40,
        textStyle: {
          color: [],
          fontSize: 16
        },
      },
      geo: {
        zoom: 1.2, //地图放大
        map: "吉林",
        label: {
          normal: {
            color:'#fff',
          },
          emphasis: {
            show: false
          }
        },
        itemStyle: {
          normal: {
            areaColor:'#053063',
            borderColor: '#46bee9',
            borderWidth: 1
          },
          emphasis: {
            areaColor: '#04254c'
          }
        },
        // regions: pilotProvince,
        layoutSize: '1200px'
      }
      series:[{
               "name":"未上线","type":"effectScatter","coordinateSystem":"geo","symbol":"circle","data":
               [
                {"name":"长春市","value":["125.35","43.88",0]},
                {"name":"四平市","value":["124.37","43.57",0]},
                {"name":"辽源市","value":["125.15","42.97",0]},
                {"name":"吉林市","value":["126.57","43.87",0]},
                {"name":"通化市","value":["125.92","41.49",0]}
               ],
               "itemStyle":{"normal":{"color":"#fe4848","borderColor":"#fff"}},
               "label":{"normal":{"show":true,"position":"right","color":"#fff","fontSize":16}},
               "rippleEffect":{"brushType":"fill","scale":3},"tooltip":{"textStyle":{"fontSize":18}}
              },
              {
                "name":"建设中","type":"effectScatter","coordinateSystem":"geo","symbol":"circle","data":
                [
                 {"name":"白城市","value":["122.82","45.43",0]},
                 {"name":"松原市","value":["124.28","44.93",0]},
                 {"name":"吉林市","value":["126.57","43.87",0]},
                 {"name":"白山市","value":["126.72","41.95",0]},
                 {"name":"延边朝鲜族自治州","value":["128.32","43.25",0]}
                ],
                "itemStyle":{"normal":{"color":"#ffbe23","borderColor":"#fff"}},
                "label":{"normal":{"show":true,"position":"right","color":"#fff","fontSize":16}},
                "rippleEffect":{"brushType":"fill","scale":3},
                "tooltip":{"textStyle":{"fontSize":18}}
              },
              {
                "name":"已上线","type":"effectScatter","coordinateSystem":"geo","symbol":"circle","data":[],"itemStyle":{"normal":{"color":"#2bbe35","borderColor":"#fff"}},
                "label":{"normal":{"show":true,"position":"right","color":"#fff","fontSize":16}},
                "rippleEffect":{"brushType":"fill","scale":3},"tooltip":{"textStyle":{"fontSize":18}}}
            ]
    };
    myChart.setOption(option, reset);
    // window.onresize = myChart.resize;
  }
  showMap(myChart, [], false);
});