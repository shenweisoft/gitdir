

angular.module('sbAdminApp').controller('sueOrgtCtrl', function($log,$scope, $filter, LoginConfig, LoginService,DictionaryConfig, $state,$stateParams, LawService, AdjustService, AdjustConfig,$modal,toaster,$rootScope,$timeout) {
  $scope.queryCourtDictionaryList = LoginService.queryCourtDictionaryList;

    $scope.querySysOrgByCourtCode = LoginService.querySysOrgByCourtCode;
  //管理树
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
        icon: 'iconfont icon-yonghu tree-icon '
      },
      top: {
        icon: 'iconfont icon-jianzhu tree-icon'
      },
      dept: {
        icon: 'iconfont icon-zuzhi tree-icon'
      }
    },
    version: 1,
    plugins: ['types']
  };

  function init() {
    //请求法院
    $scope.queryCourtDictionaryList({}).success(function(result) {
      if (result.code == LoginConfig.commonConStant.SUCCESS) {
        $scope.originalData = result.result.filter(function (val) {
          val.sid = val.id;
          val.id =  val.code;
          val.parent = val.parentCode == -1 ? '#':val.parentCode;
          val.text = val.name;
          val.type = 'default';
          val.state =  {opened: false }
          return val
        })
        $scope.showData  = $scope.originalData;
        $scope.treeConfig.version++;
      }else {
        $rootScope.toaster("error", "错误", result.message);
      }
    })
  }
  init();

  $scope.readyCB = function() {
    if ($scope.selectedNode) {
      $scope.selectedNode = _.find($scope.originalData, {
        id: $scope.selectedNode.id
      });
      $scope.treeInstance.jstree(true).select_node($scope.selectedNode);
    }
  };


  $scope.clickTree = function() {
    var nodeId = $scope.treeInstance.jstree(true).get_selected()[0];
    if (nodeId && ($scope.selectedNode && $scope.selectedNode.id != nodeId || !$scope.selectedNode))
      $scope.selectedNode = _.findWhere($scope.originalData, {
        id: nodeId
      });
  };

  // watch the searchbox
  $scope.$watch('searchInput', function(newVal, oldVal) {
    if ($scope.searchInputTimeout) {
      $timeout.cancel($scope.searchInputTimeout)
      $scope.searchInputTimeout = null
    }
    $scope.searchInputTimeout = $timeout(function() {
      if (newVal) {
        var uniqueSet = {}
        $scope.showData = []
        $scope.originalData.filter(function(v) {
          return v.text.indexOf(newVal) != -1;
        }).forEach(function(v) {
          function recursivePush(val) {
            if (val && !uniqueSet[val.id]) {
              uniqueSet[val.id] = true;
              val.state.opened = true;
              $scope.showData.push(val);
              recursivePush(_.findWhere($scope.originalData, {
                id: val.parent
              }))
            }
          }
          recursivePush(v);
        });
      } else if (newVal == "") {
        $scope.showData = $scope.originalData;
      } else // undefinced
        return;
      $scope.treeConfig.version++;
    }, 1000);
  });

  //提交法院
  $scope.submitLaw = function(){

      if($scope.selectedNode){
          var objIndex = _.findIndex($scope.originalData, {parent: $scope.selectedNode.id});
          if(objIndex > 0){
            $rootScope.toaster("error", "错误", "请您选择地市级法院");
          }else{
              $scope.querySysOrgByCourtCode({
                  courtCode:$scope.selectedNode.code
              }).success(function(result) {
                  if (result.code == LoginConfig.commonConStant.SUCCESS) {
                      if(result.result){
                        $state.go('dashboard.reading_notes', {"name": "reading_notes","lawOrgId":result.result.id,"lawOrgName":result.result.orgFullName,"courtCode":$scope.selectedNode.code});
                      }else{
                          $rootScope.toaster("error", "错误", "系统暂未初始化法院组织，请联系系统管理员！");
                      }

                  }else {
                      $rootScope.toaster("error", "错误", result.message);
                  }
              })
          }
      }else{
          $rootScope.toaster("error", "错误", "请您选择地市级法院");
      }
  }

});