var app = angular.module('sbAdminApp');
app.filter('id2Text', function() {
  return function(id,data) {
    var result = _.find(data, {
      id: id+""
    });
    return result? result.value:""
  }
});

app.filter('stringDate', function() {
  return function(dt) {
    if(typeof (dt) == "string")
    {
      dt = dt.replace(/\-/gi,"\/");
      dt = Date.parse(dt);
    }
    return dt && dt;
  }
});

angular.module('sbAdminApp').directive('secondInstanceHeadDetail', function() {
  return {
    templateUrl: 'views/pages/second_instance/directives/head_detail.html',
    restrict: 'EA',
    replace: true,
    scope: false,
    controller:function ($scope,DictionaryConfig,$modal,$state,$log,LoginService,AdjustService,AdjustConfig,toaster,LoginConfig,SecondLitigantionConfig,$stateParams) {
      //头部详细菜单显示隐藏控制
      $scope.detailsHeadShow = true;
      //是否是查看卷宗标识
      $scope.isDossier = false;
      //案由
      $scope.factTypeList = SecondLitigantionConfig.factTypeList;

      $scope.headDetail = true;

      $scope.$on("init", function () {
        console.log($scope.secondIntanceInfo)
        console.log($scope.secondApplicantArray)
      })

      //当是查看卷宗页面时，隐藏查看卷宗按钮
      if(window.location.href.indexOf('secondInstanceFile') != -1 || window.location.href.indexOf('secondInstanceEvidence') != -1) {
        $scope.isDossier = true;
        $scope.isEvidence = true;
      }
      if($scope.evideceShow) {
        $scope.isEvidence = false;
      }

      //查看卷宗
      $scope.queryDossier = function () {
        window.open($state.href("secondInstanceFile", {id: $scope.secondIntanceInfo.id}));
      };

      //查看证据
      $scope.queryEvidence = function () {
        var url = $state.href("secondInstanceEvidence",{serialNo: $scope.secondIntanceInfo.serialNo, id: $scope.secondIntanceInfo.id});
        window.open(url,'_blank');
      };

    }
  }
});


