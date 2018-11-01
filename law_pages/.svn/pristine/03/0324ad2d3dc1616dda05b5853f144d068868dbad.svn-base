/**
 * Created by Administrator on 2018/8/1 0001.
 */
'use strict';

angular.module('sbAdminApp').controller('EamilBindCtrl', function($scope, $modal, LoginConfig, LoginService, $state,toaster) {

    //查询列表
    $scope.queryEmailUserList = LoginService.queryEmailUserList;
    //删除用户
    $scope.deleteEmailUser = LoginService.deleteEmailUser;
    //更新或者新建用户
    $scope.saveEmailUser = LoginService.saveEmailUser;

    //查询列表
    $scope.queryEmailUserList().success(function (res) {
        if(res.code == LoginConfig.commonConStant.SUCCESS){
            $scope.userList = res.result
        }else{
            toaster.pop('error','错误',res.message)
        }
    })

    //新建用户或者编辑用户
    $scope.editEamil = function (user) {
        var modalInstance = $modal.open({
            templateUrl: 'views/pages/manage/edit_eamil.html',
            controller: 'editEamilCtrl',
            size: 'xs',
            resolve: {
                items:function(){
                    return {
                        user:user
                    }

                }
            }
        });
        //返回值
        modalInstance.result.then(function (result) {

            if(!user){
                $scope.userList.push(result)
            }else{
                if(result){
                    user  = result
                }
            }
        },function () {

        })
    }

    //删除用户
    $scope.deleteUser = function (user) {
        $scope.deleteEmailUser({loginAccount:user.loginAccount}).success(function (res) {
            if(res.code == LoginConfig.commonConStant.SUCCESS){
                var deleteIndex = 0;
                $scope.userList.forEach(function (val,index) {
                    if(user.id == val.id){
                        deleteIndex = index
                    }
                })
                $scope.userList.splice(deleteIndex,1)

            }else{
                toaster.pop('error','错误',res.message)
            }
        })
    }

    //更新密码
    $scope.updatePassword = function (user) {
        $scope.saveEmailUser(user).success(function (res) {
            if(res.code == LoginConfig.commonConStant.SUCCESS){
                toaster.pop('success','成功','更新密码成功！')
            }else{
                toaster.pop('error','错误',res.message)
            }
        })
    }
})

//更新编辑用户
angular.module('sbAdminApp').controller('editEamilCtrl', function($scope, $modalInstance,items,LoginService,LoginConfig,toaster) {
    //更新或者新建用户
    $scope.saveEmailUser = LoginService.saveEmailUser;

    $scope.constant = {
        loginAccountError:"请填写用户名",
        emailError:"请填写邮箱 "

    }
    $scope.isNew = items.user ? false :true;
    $scope.user = items.user || {
            loginAccount:'',
            email:''
        }
    //验证
    function validateForm(){
        $scope.loginAccountError="";
        $scope.emailError="";

        if($scope.isNew){
            //验证区域名称
            if(!$scope.user.loginAccount){
                $("[name='loginAccount']").focus();
                $scope.loginAccountError = $scope.constant.loginAccountError;
                return false;
            }
        }
        if(!$scope.user.email){
            $("[name='email']").focus();
            $scope.emailError = $scope.constant.emailError;
            return false;
        }

        return true;
    };
    //取消
    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
    
    $scope.ok = function (){
        if(validateForm()){
            $scope.saveEmailUser($scope.user).success(function (res) {
                if(res.code == LoginConfig.commonConStant.SUCCESS){
                    $modalInstance.close( $scope.user)
                }else{
                    toaster.pop('error','错误',res.message)
                }
            })

        }
    }


})