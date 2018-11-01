/**
 * Created by Administrator on 2017/4/7 0007.
 */

/**
 * 司法邮件列表 controller
 */
angular.module('sbAdminApp').controller('judicialCtrl', function ($scope, $log, $state, $stateParams, $modal, $modalInstance, LawService, LawConfig, DictionaryConfig) {
  $scope.lawService = LawService;
  //阶段
  $scope.emailLevelArray = DictionaryConfig.emailLevelArray;
  
  var level = DictionaryConfig.toaster.level
  var title = DictionaryConfig.toaster.title
  
  $scope.CONSTANT = {
    "messageBackend":"后太忙，请稍后再试"
  }
  
  //点击关闭
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
  //已读人员
  $scope.haveReadPersonal = [
    {
      id: '001',
      role: '法官',
      name: '张三'
    },
    {
      id: '002',
      role: '法官',
      name: '王五'
    }
  ]
  $scope.personal = function () {
    var str = '';
    if ($scope.haveReadPersonal.length > 0) {
      $scope.haveReadPersonal.forEach(function (v, i, arr) {
        if (i) {
          str = str +"<br>"+ v.role + ':' + v.name + '';

        } else {
          str = v.role + ':' + v.name;
        }
      })
    }

    return str;
  }
  $scope.dynamicTooltip = $scope.personal();
  
  function EmailSender(){
    this.type = "";
    this.emailArray = [];
  }
  
  //初始化文书数据
  $scope.levelArray = [], $scope.num = 0;
  $scope.initEmailSender = function(){
    $scope.lawService.viewEmailSender({
      serialNo : $stateParams.serialNo
    }).success(function(res) {
      if (res.code == LawConfig.commonConstant.SUCCESS) {
        if(res.result.length > 0){
          var emailSender = new EmailSender();
          res.result.forEach(function(v, i){
            if(emailSender.type != v.stage){
              if(i != 0) $scope.levelArray.push(emailSender);
              emailSender = new EmailSender();
              emailSender.type = v.stage.toString();
              emailSender.emailArray.push(v);
            }else{
              emailSender.emailArray.push(v);
            }
          })
          $scope.levelArray.push(emailSender);
          $scope.num = res.result.length;
        }
      } else {
        toaster.pop(level.error, title.error, $scope.CONSTANT.messageBackend);
      }
    }).error(function(res){
      $log.log(res);
    })
  }
  $scope.initEmailSender();
  
  //显示email具体内容
  $scope.showEmailDetail = function(email){
    $scope.lawService.getEmailUrl({
      id:email.id
    }).success(function(res){
      if (res.code == LawConfig.commonConstant.SUCCESS) {
        window.open(res.result,'_blank');
      }else{
        toaster.pop(level.error, title.error, res.message);
      }
    })
  }
})