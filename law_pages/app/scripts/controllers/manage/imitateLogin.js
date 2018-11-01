/**
 * Created by Administrator on 2018/8/1 0001.
 */
'use strict';
var app = angular.module('sbAdminApp');
app.filter('stateText', function() {
    return function(id,data) {
        var result = _.find(data, {
            id: id
        });
        return result? result.value:""
    }
});
angular.module('sbAdminApp').controller('ImitateLoginCtrl', function($scope, $log, LoginConfig, LoginService, $modal,toaster,$rootScope) {

    $scope.user = {
        loginAccount:'',
        serialNo:'',
        password:'',
    }
    //查询角色
    $scope.queryLogUser = LoginService.queryLogUser;

    $scope.constant = {
        serialNoError:'请输入流水号',
        loginAccountError:'请输入用户名',
        passwordError:'请输入密码',
    }

    $scope.queryLog = function() {
        if(validateForm()){
            $scope.queryLogUser($scope.user ).success(function (res) {
                if(res.code == LoginConfig.commonConStant.SUCCESS){
                    if(res.result){
                        $scope.law = res.result;
                        res.result.userList.forEach(function (val) {
                            if(val.userType == 0){
                                val.name = '公民-'+ val.name
                            }
                            if(val.userType == 1){
                                val.name = '法官-'+ val.name
                            }
                            if(val.userType == 2){
                                val.name = '调解员-'+ val.name
                            }
                            if(val.userType == 3){
                                val.name = '鉴定员-'+ val.name
                            }
                            if(val.userType == 4){
                                val.name = '保险公司-'+ val.name
                            }
                        })
                        $scope.roleList = res.result.userList;
                        $scope.queryRole()
                    }else{
                        $rootScope.toaster("warn", "提示", "没有该流水号信息！");
                    }
                }else{
                    toaster.pop('error','错误',res.message)
                }
            })
        }

    }

    // 登录
    $scope.queryRole= function () {
        var modalInstance = $modal.open({
            templateUrl: 'views/pages/manage/role_choose.html',
            controller: 'roleChooseCtrl',
            size: 'xs',
            resolve: {
                items:function(){
                    return {
                        roleList: $scope.roleList,
                        law: $scope.law
                    }

                }
            }
        });
        //返回值
        modalInstance.result.then(function (result) {
        })
    }

    //验证
    function validateForm(){
        $scope.serialNoError="";
        $scope.loginAccountError="";
        $scope.passwordError="";

        //验证区域名称
        if(!$scope.user.serialNo){
            $("[name='serialNo']").focus();
            $scope.serialNoError = $scope.constant.serialNoError;
            return false;
        }
        if(!$scope.user.loginAccount){
            $("[name='loginAccount']").focus();
            $scope.loginAccountError = $scope.constant.loginAccountError;
            return false;
        }
        if(!$scope.user.password){
            $("[name='password']").focus();
            $scope.passwordError = $scope.constant.passwordError;
            return false;
        }
        return true;
    };
})
angular.module('sbAdminApp').controller('roleChooseCtrl', function($scope, $log, LoginConfig, LoginService, items,toaster,$state,$modalInstance,$window,DictionaryConfig) {
    //登录service
    $scope.loginService = LoginService;
    //登录后查询案件
    $scope.anaLog = LoginService.anaLog;

    $scope.lawStateList = DictionaryConfig.lawStateList;

    $scope.roleList = items.roleList;
    $scope.law = items.law;
    //选中切换角色
    $scope.roleChange = function (userId) {
        $scope.roleData =  $scope.roleList.filter(function (val) {
            return val.id ==userId
        })[0]
    }
    
    $scope.ok = function () {
        if(!$scope.roleData){
            toaster.pop('warm','提示','请选择角色');
            return
        }
        $scope.anaLog( $scope.roleData  ).success(function (res) {
            if(res.code == LoginConfig.commonConStant.SUCCESS){
                $scope.loginService.setUser(res.result);
                $scope.sysUser = res.result.sysUser;
                $scope.$emit('user2Root');
                if($scope.sysUser.userType == '0'){
                    $state.go('party_page');
                }else{
                    $state.go('dashboard.home');
                    $window.location.reload();
                }

                $modalInstance.close( )
            }else{
                toaster.pop('error','错误',res.message)
            }
        })
    }
})