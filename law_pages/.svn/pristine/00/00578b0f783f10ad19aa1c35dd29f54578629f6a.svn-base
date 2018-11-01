/**
 * Created by design on 2017/5/23.
 */
angular.module('sbAdminApp').controller('NoticeManagementCtrl', function($scope, $modal,$log,toaster,$state,DictionaryConfig, PrejudgeService, PrejudgeConfig, $rootScope) {
  $scope.prejudgeService = PrejudgeService;

  //每页显示条数
  $scope.itemNum = DictionaryConfig.pageNum;
  $scope.noticeTypeList = DictionaryConfig.noticeType;
  
  $scope.noticeSelectAll = false;
  
  console.log($scope.noticeTypeList);
  $scope.pageData={
    currentPage:'1',
    caseList:[],
    showList:[],
    listTitle: ''
  }
  $scope.notice={
    // id:'',
    // type:'',//类型
    // title:'',
    // content:'',
    pageSize:DictionaryConfig.pageNum
  }

  $scope.getDataInfo = function(pageNo,pageSize){

      $scope.notice.pageNo = pageNo;
      $scope.prejudgeService.queryNoticeList($scope.notice).success(function(result) {
        var data = result.result;
        console.log(data);
        if (result.code == PrejudgeConfig.commonConstant.SUCCESS) {
          $scope.pageData.showList = data;
        } else {
          $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageBackend);
        }
      })
      //获取总条数
      $scope.prejudgeService.queryCountNotice($scope.notice).success(function(result) {
        var data = result.result;
        console.log(data);
        if (result.code == PrejudgeConfig.commonConstant.SUCCESS) {
          $scope.pageData.totalItems = data;
        } else {
          $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageBackend);
        }
      })
    }

  $scope.getDataInfo(1, DictionaryConfig.pageNum);

  $scope.pageChanged = function () {
    $scope.getDataInfo($scope.pageData.currentPage, DictionaryConfig.pageNum);
  }

  $scope.queryNotice = function(notice){
    var popupModal = $modal.open({//打开弹窗页
      templateUrl:'views/pages/notice_manage/noticePopup.html',
      controller:'NoticePopupCtrl',
      size:'lg',
      resolve:{
        items:function(){
          return {
            notice : notice,
            noticeTypeList : $scope.noticeTypeList
          }
        }
      }
    });
    //弹出框的返回值
    popupModal.result.then(function(data){
      if(notice){ //修改
        console.log(data);
        notice.title = data.notice.title;
        notice.type = data.notice.type;
        notice.content = data.notice.content;
        notice.linkUrl=data.notice.linkUrl;
        console.log(notice);
        /*notice.title = data.title;
        notice.content = data.content;
        notice.type = data.type;*/
      }else{ //新增的话查询一次
        $scope.pageChanged();
      }
    })
  }
  $scope.idList = [];

$scope.noticeChxChange = function(){
  $scope.idList = $scope.pageData.showList.filter(function(v){
    return v.checked;
  }).map(function(x){
    return x.id;
  });
}

  $scope.noticToggleSelectAll = function(){
    $scope.pageData.showList.forEach(function(v) {
      v.checked = $scope.noticeSelectAll;
    });
  }
  //删除
  $scope.delNotice = function(notice) {
    if(confirm("您确认删除吗？")){
      var param = [];
      if(notice){
        param = [notice.id];
      }else{
        param = $scope.pageData.showList.filter(function(v){ return v.checked;}).map(function(x){return x.id;});
        if(param.length < 1){
          $rootScope.toaster("error", "错误", "至少选择一条数据！");
        }
      }

      console.log(param);
      $scope.prejudgeService.deleteNotice({
        "id": param
      }).success(function(result) {
        $log.log(result.data);
        //请求成功
        if (result.code == PrejudgeConfig.commonConstant.SUCCESS) {
          $scope.pageChanged();
        }else{
          //TODO
          alert("请联系系统管理员");
        }
      });
    }
  };

});


angular.module('sbAdminApp').controller('NoticePopupCtrl', function($scope, $modal,$modalInstance,items,$log,toaster,$state,DictionaryConfig, PrejudgeService, PrejudgeConfig) {
  $scope.saveNoticeService = PrejudgeService.saveNotice;

  $scope.noticeTypeList = items.noticeTypeList;
  //定义错误信息常量
  $scope.CONSTANT = {
    "titleErrorMessage": "请您输入标题",
    "contentErrorMessage": "请您输入内容",
    "typeErrorMessage": "请您选择类型"
  };
  $scope.noticeNew = angular.copy(items.notice);

  function validateForm(){
    $scope.titleErrorMessage="";
    $scope.contentErrorMessage="";
    if(!$scope.noticeNew.title){
      $("[name='title']").focus();
      $scope.titleErrorMessage = $scope.CONSTANT.titleErrorMessage;
      return false;
    }
    if(!$scope.noticeNew.type){
      $("[name='type']").focus();
      $scope.typeErrorMessage = $scope.CONSTANT.typeErrorMessage;
      return false;
    }
    if(!$scope.noticeNew.content){
      $("[name='content']").focus();
      $scope.contentErrorMessage = $scope.CONSTANT.contentErrorMessage;
      return false;
    }

    return true;
  }
  $scope.save = function(){
    if(validateForm()){
      $scope.saveNoticeService($scope.noticeNew).success(function(result){
        //请求成功
        if (result.code ==  PrejudgeConfig.commonConstant.SUCCESS) {
          $modalInstance.close({
            notice:$scope.noticeNew
          });
        }else{
          //TODO
          alert("请联系系统管理员");
        }
      });
    }
  }

  //取消
  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };


});