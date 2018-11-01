angular.module('sbAdminApp').controller('functionStatistics', function( $scope, $state, $log, $filter, $rootScope,WeChatService, WeChatConfig) {
  $scope.startDate = $filter('date')(new Date(new Date().getTime() - 30*24*60*60*1000), 'yyyy-MM-dd'); //前一个月
  $scope.endDate = $filter('date')(new Date(new Date().getTime() - 24*60*60*1000), 'yyyy-MM-dd'); //前一天
  $scope.totalNum = 0;
  $scope.totalUser = 0;
  $scope.stayTime = 0;

  /**
   * 初始化模块的访问次数
   */
  $scope.initNumberOfVisit = function(){
    var numberOfVisits = echarts.init(document.getElementById('numberOfVisits'));
    
    // 指定图表的配置项和数据
    var option_numberOfVisits = {
        color:['#4ec7b6'],
        title: {
          text: '功能模块访问占比',
          subtext: '数据来自腾讯'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'value',
          boundaryGap: [0, 0.01]
        },
        yAxis: {
          type: 'category',
          data: $scope.pageVisitArray.sort(function(a, b){ return a.pageVisitPv - b.pageVisitPv}).map(function(v){return v.pagePath})
        },
        series: [
          {
            name: '2011年',
            type: 'bar',
            data: $scope.pageVisitArray.sort(function(a, b){ return a.pageVisitPv - b.pageVisitPv}).map(function(v){return v.pageVisitPv})
          }
        ]
    };
      // 使用刚指定的配置项和数据显示图表。
      numberOfVisits.setOption(option_numberOfVisits);
    }
  
  /**
   * 初始化模块访问人数
   */
  $scope.initNumberOfPeople = function(){
      var numberOfPeople = echarts.init(document.getElementById('numberOfPeople'));
      var option_numberOfPeople = {
        color:['#ff7572'],
        title: {
          text: '访问人数',
          subtext: '数据来自腾讯'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'value',
          boundaryGap: [0, 0.01]
        },
        yAxis: {
          type: 'category',
          data: $scope.pageVisitArray.sort(function(a, b){ return a.pageVisitUv - b.pageVisitUv}).map(function(v){return v.pagePath})
        },
        series: [
          {
            name: '功能访问人数',
            type: 'bar',
            data: $scope.pageVisitArray.sort(function(a, b){ return a.pageVisitUv - b.pageVisitUv}).map(function(v){return v.pageVisitUv})
          }
        ]
      };
  
      numberOfPeople.setOption(option_numberOfPeople);
    }
  
  /**
   * 初始化页面停留时间
   */
  $scope.initStayTime = function(){
      var numberOfTime = echarts.init(document.getElementById('numberOfTime'));
      var option_numberOfTime = {
        color:['#3ac5fc'],
        title: {
          text: '页面停留时长',
          subtext: '数据来自腾讯'
        },
        xAxis: {
          type: 'category',
          data: $scope.pageVisitArray.sort(function(a, b){ return a.pageStaytimePv - b.pageStaytimePv}).map(function(v){return v.pagePath})
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: $scope.pageVisitArray.sort(function(a, b){ return a.pageStaytimePv - b.pageStaytimePv}).map(function(v){return v.pageStaytimePv}),
          type: 'line'
        }]
      };
  
      numberOfTime.setOption(option_numberOfTime);
    }

    $scope.getAnalysisVisitPage = function(){
      var startDate = $filter('date')($scope.startDate, 'yyyy-MM-dd'); //前一个月
      var endDate = $filter('date')($scope.endDate, 'yyyy-MM-dd'); //前一天
      
      var data = {
        appId: "wx5b370b4a7c400b89",
        startDate: startDate,
        endDate: endDate
      }
      WeChatService.getAnalysisVisitPage(data).success(function(res){
        console.log(res.result)
        if(res.code == WeChatConfig.commonConStant.SUCCESS){
          $scope.pageVisitArray = res.result
          if(res.result){
            var stayTime = 0, stayCount = res.result.length
            res.result.forEach(function(v){
              $scope.totalNum += v.pageVisitPv
              stayTime += v.pageStaytimePv
            })
            
            $scope.stayTime = parseFloat(stayTime/stayCount).toFixed(2)
  
            //初始化访问次数
            $scope.initNumberOfVisit()
            //初始化模块访问人数
            $scope.initNumberOfPeople()
            //初始化页面停留时间
            $scope.initStayTime()
          }
        }
      })
      
      //获取用户访问小程序的次数
      var preDay = $filter('date')(new Date(new Date().getTime() - 24*60*60*1000), 'yyyy-MM-dd')
      var data2 = {
        appId: "wx5b370b4a7c400b89",
        startDate: preDay,
        endDate: preDay
      }
      WeChatService.getUserVisitDailysummary(data2).success(function(res){
        if(res.code == WeChatConfig.commonConStant.SUCCESS){
          $scope.totalUser = res.result.list[0].visit_total
        }
      })
    }()
  
  $scope.openDate = function($event, type){
    $event.preventDefault();
    $event.stopPropagation();
    
    if(type == 1){
        $scope.startDateOpen = true
    } else {
      $scope.endDateOpen = true
    }
  }
});