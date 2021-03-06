/**
 * Created by Administrator on 2017/8/31 0031.
 */
angular.module('sbAdminApp').controller('onTheLineCtrl', function($scope,toaster, LoginService,LoginConfig,$rootScope) {
    //定义查询组织Service
    $scope.queryJyOnlineStateService = LoginService.queryJyOnlineState;
    $scope.saveJyOnlineStateService = LoginService.saveJyOnlineStateService;
    
    $scope.onlineStateArray = [
      {
        id:'0',
        value:'未上线'
      },{
        id:'1',
        value:'建设中'
      },{
        id:'2',
        value:'已上线'
      }
    ]

    //查询组织数据
    $scope.queryOnlineState = function(regionLevel, parentCode){
      $scope.regionLevel =regionLevel;
      $scope.queryJyOnlineStateService({
        regionLevel: regionLevel,
        parentCode: parentCode,
        provinceName: $scope.provinceName
      }).success(function(result) {
        if (result.code == LoginConfig.commonConStant.SUCCESS) {
          $scope.onlineStateList = result.result;
        }else{
          $rootScope.toaster("error", "错误", result.message);
        }
      });
    }
    
    $scope.queryOnlineState('1', '')
  
    $scope.saveOnlineState = function(list){
      list.accomplishCourtSum = list.accomplishCourtSum?parseInt(list.accomplishCourtSum):0
      list.construction = list.construction?parseInt(list.construction):0
      list.notOnline = list.notOnline?parseInt(list.notOnline):0
      list.courtSum = parseInt(list.accomplishCourtSum) + parseInt(list.construction) + parseInt(list.notOnline)

      var Accounted = parseInt(list.accomplishCourtSum / list.courtSum * 100);
      if(Accounted == 0){
        list.onlineState = 1;
      }else{
        list.onlineState = Accounted === 0 ? 0 : Accounted === 100 ? 2: Accounted >= 90 ? 2 : 1;
      }

      $scope.saveJyOnlineStateService(list).success(function(result){
        if (result.code == LoginConfig.commonConStant.SUCCESS) {
          console.log(result);
        }else{
          $rootScope.toaster("error", "保存失败", result.message);
        }
      })
    }
    
    $scope.clearProvinceName = function(){
      $scope.provinceName = ''
    }
    
    $scope.fixState = function(list){
      if((list.notOnline && list.notOnline != 0) && (!list.construction || list.construction==0) && (!list.accomplishCourtSum || list.accomplishCourtSum == 0) ){
        list.onlineState = '0'
      }else if((list.accomplishCourtSum && list.accomplishCourtSum != 0) && (!list.construction || list.construction==0) && (!list.notOnline || list.notOnline == 0)){
        list.onlineState = '2'
      } else if((!list.construction || list.construction == 0)  && (!list.accomplishCourtSum || list.accomplishCourtSum == 0) && (!list.notOnline || list.notOnline==0)){
        list.onlineState = ''
      }else {
        list.onlineState = '1'
      }
    }
})