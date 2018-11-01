'use strict';

angular.module('sbAdminApp').directive('aioHeader', function() {
  return {
    templateUrl: 'views/pages/AIO/AIOHeader.html',
    restrict: 'E',
    replace: true,

    controller: function($scope, $state, $timeout, $stateParams) {
      //提示框显示隐藏标识
      $scope.boxShow = false;
      $scope.infoBoxShow = false;

      //返回按钮
      $scope.handlePrev = function () {
        $timeout(function () {
          if($scope.readTimeout) {
            $timeout.cancel($scope.readTimeout);
          }
          if($stateParams.oneCase) window.history.go(-2);
          else window.history.back();
        }, 101)

      };

      //退出按钮
      $scope.handleExit = function () {
        $timeout(function () {
          //$scope.boxShow = true;
          if($scope.readTimeout) {
            $timeout.cancel($scope.readTimeout);
          }
          else $state.go('AIOHomePage');
        }, 101)
      };

      //信息提示框确定按钮
      $scope.handleInfoBtn = function () {
        $timeout(function () {
          $scope.infoBoxShow = false;
        }, 101)
      };

      //弹出框点击事件
      $scope.handleAlertBox1 = function () {
        $timeout(function () {
          $scope.boxShow = false;
        }, 101)
      };
      $scope.handleAlertBox2 = function () {
        $timeout(function () {
          $state.go('AIOHomePage');
        }, 101)
      };

      //按钮按下样式
      var btns = document.getElementsByClassName('btnPress');
      for(var i = 0; i < btns.length; i++) {
        (function () {
          var this_i = i;
          new Hammer(btns[this_i]).on('tap', function () {
            $(btns[this_i]).addClass('press');
            setTimeout(function () {
              $(btns[this_i]).removeClass('press');
            }, 100)
          })
        })(i)
      }
    }
  }
});