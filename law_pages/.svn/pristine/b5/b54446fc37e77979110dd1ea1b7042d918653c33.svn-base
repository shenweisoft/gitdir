/**
 * Created by Administrator on 2017/8/24 0024.
 */

angular.module('sbAdminApp').directive('courtList', function() {
  return {
    templateUrl: 'scripts/directives/court_list/court_list.html',
    restrict: 'EA',
    replace: true,
    scope: {
      ngModel: '=ngModel',
      code: '=code',
      ngShow: '=ngShow'
    },
    controller: 'uiTreeCtrl',
    link: function (scope, element, attrs) {
      console.log(scope.treeData);

      scope.selectedCourt = function (item,e) {
        scope.ngModel = item.name;
        scope.code = item.code;
        scope.ngShow = false;
        stopBubble(e);
      }

      //
      scope.showOrhide = function (item,e) {
        item.opened = !item.opened;
        stopBubble(e);
      }
      function stopBubble(e) {
        // 如果提供了事件对象，则这是一个非IE浏览器
        if ( e && e.stopPropagation ) {
          // 因此它支持W3C的stopPropagation()方法
          e.stopPropagation();
        } else {
          // 否则，我们需要使用IE的方式来取消事件冒泡
          window.event.cancelBubble = true;
        }
      }
    }

  }
  
});
app.controller('uiTreeCtrl',function ($scope,LoginConfig,$log,LoginService) {
  //请求法院列表
  $scope.queryCourtDictionary = LoginService.queryCourtDictionary;

  $scope.queryCourtDictionary().success(function (res) {
    if(res.code == LoginConfig.commonConStant.SUCCESS){
      console.log(res)
      $scope.showData = res.result;
      $scope.showData.forEach(function (v) {
        v.opened = false;
        v.childList.forEach(function (v) {
          v.opened = false;
        })
      })
    }
  })


})

