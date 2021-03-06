/**
 * Created by Administrator on 2017/4/7 0007.
 */
'use strict';
var app = angular.module('sbAdminApp');
app.filter('state2Text', function() {
  return function(id,data) {
    var result = _.find(data, {
      id: id
    });
    return result ? result.text:""
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
app.filter('isNotNull', function() {
  return function(person) {
    return person == 'null' ? '无' : person;
  }
});
angular.module('sbAdminApp').directive('headDetail', function() {
  return {
    templateUrl: 'scripts/directives/head_detail/head_detail.html',
    restrict: 'EA',
    replace: true,
    scope: false,
    controller:function ($scope,DictionaryConfig,$modal,$state,$log,LoginService,AdjustService,AdjustConfig,toaster,LoginConfig,$rootScope,socketConfig) {
      //取得用户的类型
      function init(){
        $scope.userType = LoginService.user.sysUser.userType;
        console.log($scope.userType)
      }
      //获取用户
      if(LoginService.user.userPermissions){
        init();
      }
      $scope.$on('user2Child', function(event){
        init();
      });
      //法律表状态常量
      $scope.LAW_STATE = DictionaryConfig.lawState;
      //调解结果
      $scope.adjustResultList = DictionaryConfig.adjustResultList;
      //头部信息显示
      $scope.detailsHeadShow = true;

      //跳转查询卷宗
      $scope.adjustInfoDetail = function(){

          //其他平台接入
          //$log.info("shenwe: "+ $rootScope.buttSelf);
        var url = $state.href("dossierDetail",{serialNo:$scope.law.serialNo,id:$scope.law.id,lawPersonType:$scope.law.lawPersonType,isSelf:$rootScope.buttSelf});
        window.open(url,'_blank');
      };
      //查询证据
      $scope.queryEvidence = function(){
        var url = $state.href("evidence_detail",{serialNo:$scope.law.serialNo,id:$scope.law.id,lawPersonType:$scope.law.lawPersonType,isSelf:$rootScope.buttSelf});
        window.open(url,'_blank');
      };
      //文书
      $scope.instrumentList = function () {
        var modalInstance = $modal.open({
          templateUrl: 'views/pages/on_file/instrument_list.html',
          controller: 'instrumentCtrl',
          size: 'lg',
          resolve: {
            loadMyFile: function($ocLazyLoad) {
              return $ocLazyLoad.load({
                name: 'sbAdminApp',
                files: ['scripts/controllers/on_file/instrument.js']
              })
            },
            items: function() {
                return {
                    law: $scope.law,
                    userType:$scope.userType
                };
            }
          }
        });
        //返回值
        modalInstance.result.then(function (data) {
          scope.refreshAllData();
        }, function () {
        });
      };
      //司法邮件
      $scope.judicialEmail =function () {
        var modalInstance = $modal.open({
          templateUrl: 'views/pages/on_file/judicial_email.html',
          controller: 'judicialCtrl',
          size: 'lg',
          resolve: {
            loadMyFile: function($ocLazyLoad) {
              return $ocLazyLoad.load({
                name: 'sbAdminApp',
                files: ['scripts/controllers/on_file/judicial.js']
              })
            },
            serialNo:$scope.law.serialNo
          }
        });
        //返回值
        modalInstance.result.then(function (data) {
          scope.refreshAllData();
        }, function () {
        });
      };

      //查询跟踪流程
      $scope.queryTrackInfo = function(){
        var url = $state.href("queryTrackInfo",{serialNo:$scope.law.serialNo,id:$scope.law.id,lawPersonType:$scope.law.lawPersonType,vidOpenPower:$scope.vidOpenPower});
        window.open(url,'_blank');
      };

      //生成二维码
      $scope.createMediateCode = function(law) {
          AdjustService.createMediateCode({
              id:law.id,
              serialNo: law.serialNo,
              operateType:law.operateType
          }).success(function(result) {
              //成功
              if (result.code == AdjustConfig.commonConStant.SUCCESS) {
                  $scope.codeFileName = result.result?LoginConfig.pictureConstant.codeFilePathUrl + result.result:'views/images/1(2).png';
              } else {
                  $rootScope.toaster(level.error, title.error, $scope.CONSTANT.netWorkError);
              }
          });
      }

      $scope.messageFlag = localStorage.getItem('message-flag') || false;
      ///////////留言板//////////////////
      $scope.openMessageBoard = function () {
        $scope.law.messageFlag = '0';
        var modalInstance = $modal.open({
          templateUrl: 'views/pages/messageBoard/messageBoard.html',
          controller: 'openMessageBoardCtrl',
          size: 'lg',
          backdrop: false,
          keyboard:false,
          resolve: {
            loadMyFile: function($ocLazyLoad) {
              return $ocLazyLoad.load({
                name: 'sbAdminApp',
                files: ['scripts/controllers/messageBoard/messageBoard.js']
              })
            },
            items: function() {
              return {
                law: $scope.law,
                userType:$scope.userType,
                serialNo:$scope.law.serialNo,
                //messageList: $scope.messageList
              };
            }
          }
        });
        //返回值
        modalInstance.result.then(function (data) {
          scope.refreshAllData();
        }, function () {
        });
      };
      //留言板 新消息提示
      var domain = window.location.href;
      var socketIP;
      if(domain){
        if(domain.indexOf("https") > -1){
          if(domain.indexOf("jtspt") > -1){
              socketIP = socketConfig.baiduHttpsSocketServer;
          }else if(domain.indexOf("court") > -1){
              socketIP = socketConfig.jttjHttpsSocketServer;
          }
        }else{
          if(domain.indexOf("jtspt") > -1){
              socketIP = socketConfig.baiduHttpSocketServer;
          }else if(domain.indexOf("court") > -1){
              socketIP = socketConfig.jttjHttpSocketServer;
          }
        }
      }
      if(domain && domain.indexOf('demo.jtspt.com') > -1){
          socketIP = socketConfig.demoSocketServer;
      }else if(domain && domain.indexOf('180.76.176.197') > -1){
          socketIP = socketConfig.testSocketServer;
      }else if(domain && domain.indexOf('192.168.130.26') > -1){
          socketIP = socketConfig.thisSocketServer;
      }
      var socket =  io.connect(socketIP);

      socket.on('chat_info', function(data){
        if(!$('body').hasClass('modal-open')){
          //当模态框关闭时，显示new图标
          $scope.law.messageFlag = '1';
          $scope.$apply();
        }
      });
    }
    }
  });

