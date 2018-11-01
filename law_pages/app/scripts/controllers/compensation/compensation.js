'use strict';
var app = angular.module('sbAdminApp');
app.filter('id2Text', function () {
    return function (id, data) {
        var result = _.find(data, {
            id: id + ""
        });
        return result ? result.value : ""
    }
});

angular.module('sbAdminApp').controller('CompensationCtrl', function($scope,$state,$modal,LoginService,LoginConfig,DictionaryConfig,toaster,$rootScope) {
  // 赔偿标准数据
  $scope.CompensationArr = LoginService.Compensation;
  //删除
  $scope.deleteCompensation = LoginService.deleteCompensation;
  //获取总条数
  $scope.countCompensateStandard = LoginService.countCompensateStandard;
  //类型标准
  $scope.levelTypeList = DictionaryConfig.levelTypeList;
  //删除
  $scope.deleteCompensateStandard = function (mtCompensateStandard) {
    if(confirm("您确认删除吗？")){
      $scope.deleteCompensation({
        "id": mtCompensateStandard.id
      }).success(function(result) {
        //请求成功
        if (result.code == LoginConfig.commonConStant.SUCCESS) {
          var index =  _.findIndex($scope.deleteIndexList,{id:mtCompensateStandard.id});
          $scope.deleteIndexList.splice(index, 1);
        }else{
          //TODO
          $rootScope.toaster(level.error, title.error, $scope.CONSTANT.errormessag);
        }
      });
    }
  }


  $scope.pageData={
        currentPage:'1',
        itemNum:DictionaryConfig.pageNum,
        listTitle: ''
    }
  $scope.mtDenizenIncomeNorm={
        pageSize:DictionaryConfig.pageNum
  }
  //toaster类型
  var level = {
        "warn": "warn",
        "error": "error",
        "success": "success"
    }
  //toaster 标题
  var title = {
        "error": "错误",
        "success": "成功"
    }
  //toaster 提示
    $scope.CONSTANT={
        "messageBackend":"查询后台数据失败！请联系管理员",
        "errormessag":"请联系系统管理员"
    }
  //获取数据
  $scope.getDataInfo = function(pageNo) {
        $scope.mtDenizenIncomeNorm.pageNo = pageNo;
       
        $scope.CompensationArr($scope.mtDenizenIncomeNorm).success(function (result) {
            if (result.code == LoginConfig.commonConStant.SUCCESS) {
                $scope.deleteIndexList = result.result;
            } else {
                $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageBackend);
            }
        })
        //获取总条数
        $scope.countCompensateStandard($scope.mtDenizenIncomeNorm).success(function(result) {
            var data = result.result;
            if (result.code == LoginConfig.commonConStant.SUCCESS) {
                $scope.pageData.totalItems = data;
            } else {
                $rootScope.toaster(level.error, title.error, $scope.CONSTANT.messageBackend);
            }
        })
  }

  $scope.getDataInfo($scope.pageData.currentPage, DictionaryConfig.pageNum);
    $scope.pageChanged = function () {
        $scope.getDataInfo($scope.pageData.currentPage, DictionaryConfig.pageNum);
  }
  
 // 新增弹出框
    $scope.newlyAdded2 = function(mtCompensateStandard) {
      var popupModal = $modal.open({
        templateUrl: 'views/pages/newlyAdded/newlyAdded2.html',
        controller: 'newlyAdded2Ctrl',
        size: 'lg',
        resolve: {
          items: function(){
            return {
              mtCompensateStandardList:$scope.deleteIndexList,
              mtCompensateStandard:mtCompensateStandard
            }
          }
        }
      });
    };
 
})

angular.module('sbAdminApp').controller('newlyAdded2Ctrl', function($scope,$state,$modal,items,$modalInstance,LoginService,LoginConfig,DictionaryConfig,$log,toaster,$rootScope) {
  // 赔偿标准数据
  $scope.CompensationArr = LoginService.Compensation;
  //户口性质
  $scope.householdList = DictionaryConfig.householdList;
  //修改赔偿标准集合
  $scope.modifyCompensateStandard = LoginService.modifyCompensateStandard;
  //增加赔偿标准集合
  $scope.addCompensation = LoginService.addCompensation;
  //获取区域名称
  $scope.selectAdminRegionService = LoginService.selectAdminRegion;
  //初始化区域下拉默认为false
  $scope.regionFlag = false;
  //取得赔偿标准的集合
  $scope.mtCompensateStandardList = items.mtCompensateStandardList;
  //取得修改对象
  $scope.mtCompensateStandard = items.mtCompensateStandard;
  //检查区域赔偿标准是否存在
  $scope.checkMtCompensateStandardDataExists = LoginService.checkMtCompensateStandardDataExists;
  //定义新增flag
  $scope.addFlag = false;

  //类型标准
  $scope.levelTypeList = DictionaryConfig.levelTypeList;

  //定义错误信息常量
  $scope.constant = {
    "RegionNameErr": "请您输入区域名称",
    "StandardYearErr": "请您输入标准年度",
    "AccountPropertiesErr": "请您选择户口性质",
    "numberErrorMessageErr": "请您输入数字",
    'levelTypeErr':'请您选择标准类型'
  };
  //定义赔偿标准对象
  function MtCompensateStandard(){

    this.id = "";
    //区域ID
    this.regionId = "";
    //区域名称
    this.regionName = "";
    //标准年度
    this.standardYear = "";
    //误工费
    this.lostIncome = "";
    //护理费
    this.standardNurseFee = "";
    //住院伙食补助费
    this.hospitalFoodSubsidies = "";
    //营养费
    this.thesePayments = "";
    //交通费
    this.transportationFee = "";
    //住宿费
    this.accommodationFee = "";
    //精神损失费
    this.spiritualConsolationFee = "";
    //户口性质
    this.householdNature = "";
    //删除标志
    this.delFlag = "0";
    //修改人ID
    this.updateUserId = "admin";
    //修改人名称
    this.updateUserName = "admin";
    //创建人ID
    this.createUserId = "admin";
    //创建人名称
    this.createUserName = "admin";
    //修改时间
    this.updateDate = getTime();
    //创建时间
    this.createDate = getTime();
  }
  var level = {
        "warn": "warn",
        "error": "error",
        "success": "success"
    }
  var title = {
        "error": "错误",
        "success": "成功"
    }
    $scope.CONSTANT={
        "messageBackend":"查询后台数据失败！请联系管理员",
        "errormessag":"请联系系统管理员"
    }
  //获取时间格式是 yyyy-mm-dd hh:mm:ss
  function getTime(){

    var date = new Date();
    this.year = date.getFullYear();
    this.month = date.getMonth() + 1;
    this.date = date.getDate();
    return this.year +"-"+this.month + "-" + this.date + " 00:00:00";
  }

  //初始化对象 如果对象不存在 undefined  需要new对象
  if(!$scope.mtCompensateStandard){
    $scope.mtCompensateStandard = new MtCompensateStandard();
    $scope.addFlag = true;
  }

  
  //回车事件
  $scope.searchRegionName = function(){

    if (event.keyCode == 13){
      $scope.selectAdminRegionService({
        "regionName":$scope.mtCompensateStandard.regionName
      }).success(function(result) {
        console.log(result);
        //请求成功
        if (result.code == LoginConfig.commonConStant.SUCCESS) {
          $scope.regionList = result.result;
          $scope.regionFlag = true;
        }else{
          //TODO
          $rootScope.toaster(level.error, title.error, $scope.CONSTANT.errormessag);
        }
      });
    }

  }
  //增加赔偿标准
  $scope.addMtCompensateStandard =function () {

     var messge = "您确认修改吗？";
     if($scope.addFlag){
      messge = "您确认新增么吗？";
     }
   if(validateForm()){
     if(confirm(messge)){
      if($scope.addFlag){
          $scope.addCompensation($scope.mtCompensateStandard).success(function(result) {
              //请求成功
              if (result.code == LoginConfig.commonConStant.SUCCESS) {
                  $scope.mtCompensateStandard.id = result.result.id;
                  //向集合中添加一条记录
                  $scope.mtCompensateStandardList.unshift($scope.mtCompensateStandard);
                  //关闭
                  $modalInstance.dismiss('cancel');
              }else{
                  //TODO
                  $rootScope.toaster(level.error, title.error, $scope.CONSTANT.errormessag);
              }
          });
      }else{//表示修改
        console.log($scope.mtCompensateStandard)
        $scope.modifyCompensateStandard($scope.mtCompensateStandard).success(function(result){
          console.log(result);
          if (result.code == LoginConfig.commonConStant.SUCCESS) {
             $modalInstance.dismiss('cancel');
            }else{
          //TODO
             $rootScope.toaster(level.error, title.error, $scope.CONSTANT.errormessag);
            }
        })

      }
    }
   }
  }
  //选择区域名称
  $scope.selectRegionName =function(region){

    $scope.mtCompensateStandard.regionId = region.id;
    $scope.mtCompensateStandard.regionName = region.regionFullName;
    $scope.regionFlag = false;
  }
  //验证
  function validateForm(){
        $scope.RegionNameErr="";
        //验证区域名称
        if(!$scope.mtCompensateStandard.regionName){
            $("[name='RegionName']").focus();
            $scope.RegionNameErr = $scope.constant.RegionNameErr;
            return false;
        }
        //验证标准年度
        $scope.StandardYearErr="";
        if(!$scope.mtCompensateStandard.standardYear){
            $("[name='StandardYear']").focus();
            $scope.StandardYearErr = $scope.constant.StandardYearErr;
            return false;
        }
        //验证户口性质
        $scope.AccountPropertiesErr="";
        if(!$scope.mtCompensateStandard.householdNature){
            $("[name='AccountProperties']").focus();
            $scope.AccountPropertiesErr = $scope.constant.AccountPropertiesErr;
            return false;
        }
        //验证标准类型
      $scope.levelTypeErr="";
      if(!$scope.mtCompensateStandard.levelType){
          $("[name='levelType']").focus();
          $scope.levelTypeErr = $scope.constant.levelTypeErr;
          return false;
      }
        return true;
    };
  //取消
  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };

  $scope.openY = function($event, mtCompensateStandard) {
      $event.preventDefault();
      $event.stopPropagation();
      mtCompensateStandard.calendarYear = true;
  };
  
})