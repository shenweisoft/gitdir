/**
 * Created by shenwei on 2017/5/11.
 */
angular.module('sbAdminApp').controller('LitigationGuideCtrl', function($scope ,$stateParams,$log,PrejudgeService,DictionaryConfig,PrejudgeConfig,$rootScope) {
  document.body.scrollTop = document.documentElement.scrollTop = 0;

  $scope.prejudgeService = PrejudgeService;
  
  //每页显示条数
  $scope.itemNum = DictionaryConfig.pageNum;

  $scope.pageData={
    currentPage:'1',
    caseList:[],
    showList:[],
    problemList:[], //常见问题
    statuteList:[],//法律法规
    judicialList:[], //司法解释
    listTitle: ''
  }
  $scope.notice={
    flag:$stateParams.flag,//初始化显示
    type:'0',//常见问题
    pageNo:'',
    pageSize:DictionaryConfig.pageNum
  }
  
  $scope.getDataInfo = function(flag,pageNo,pageSize){
    $scope.notice.flag = flag;
    if(flag == '2'){  //常见问题显示标识
      $scope.notice.type = '0'; //常见问题type
    }else if(flag =='3'){ //法律法规显示标识
      $scope.notice.type = '2';
    }else if(flag =='4'){ //司法解释显示标识
      $scope.notice.type = '3';
    }

    $scope.notice.pageNo = pageNo;

    $scope.prejudgeService.queryNoticeList(
      $scope.notice
    ).success(function(result) {
      var data = result.result;
      console.log(data);
      if (result.code == PrejudgeConfig.commonConstant.SUCCESS) {
        if($scope.notice.type == '0'){ //常见问题
          $scope.pageData.problemList = data;
        }else if($scope.notice.type == '2'){//法律法规
          $scope.pageData.statuteList = data;
        }else if($scope.notice.type == '3'){//司法解释
          $scope.pageData.judicialList = data;
        }
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
  
  $scope.init = function(){
    if( $scope.notice.flag == '0' ||$scope.notice.flag == '1' || $scope.notice.flag == '2' ){
        $scope.getDataInfo(2,1,DictionaryConfig.pageNum); //查询常见问题 flag =2 ,type =0
    }else if($scope.notice.flag == '3'){
        $scope.getDataInfo(3,1,DictionaryConfig.pageNum); //查询法律法规 flag =3 ,type =2
    }else if($scope.notice.flag == '4'){
        $scope.getDataInfo(4,1,DictionaryConfig.pageNum); //查询司法解释 flag =4 ,type =3
    }
  }

  $scope.init();
  $scope.pageChanged = function () {
    $scope.getDataInfo($scope.notice.flag,$scope.pageData.currentPage, DictionaryConfig.pageNum);
  }
  $scope.notice.flag = $stateParams.flag;//控制页面显示
});