angular.module('sbAdminApp').controller('AIOInputIdNoCtrl', function (AdminConstant,$location,$scope, $stateParams, $state, $timeout, $http, $log, AlgorithmConfig, AlgorithmService, DictionaryConfig, toaster, $filter,IdentityService) {
  $scope.showHeaderBackBtn = true; //返回按钮显示

  $scope.CONSTANT = {
    "messageIdentityNullError": "请输入身份证号",
    "messageIdentityFormatError": "身份证号格式不正确"
  };
  $scope.applicant = {
    idNo : []
  };
  $('.numberBtn').bind("selectstart", function () { return false; });//阻止元素双击变色

  $scope.handleNumber = function (number) {
    $timeout(function () {
      if(number != 'delete') {
        if($scope.applicant.idNo.length < 18) {
          //console.log($scope.applicant.idNo)
          $scope.applicant.idNo.push(number)
        }
      } else {
        if($scope.applicant.idNo.length > 0) {
          $scope.applicant.idNo.length = $scope.applicant.idNo.length - 1;
        }
      }
    }, 101)
  };

  //软键盘提交按钮
  $scope.handleSubmit = function () {
    $timeout(function () {
      //验证身份证号
      var applicant = angular.copy($scope.applicant);
      applicant.idNo = applicant.idNo.join('');
      if(applicant.idNo.length == '0') {
        $scope.infoBoxShow = true;
        $scope.infoBoxShowTxt = $scope.CONSTANT.messageIdentityNullError;
        return false;
      }
      if(checkIdentity(applicant)) {
        //跳转到案件信息列表页面
        $state.go("AIOCaseList", {idNo: applicant.idNo});
      }
    }, 101)
  };

  ///////////////////身份证验证/////////////////////
  var checkIdentity = function(applicant, isAgent) {
    var wi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1]; // 加权因子
    var valideCode = [1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2]; // 身份证验证位值.10代表X
    function isTrueValidateCodeBy18IdCard(idCard) {
      var idCardArray = [];
      for (var i = 0; i <= 17; i++) {
        var char = idCard.charAt(i);
        if(idCard.charAt(i).toUpperCase() == 'X'){
          char = 10;// 将最后位为x的验证码替换为10方便后续操作
        }
        idCardArray.push(parseInt(char));
      }
      var sum = 0; // 声明加权求和变量
      for (var i = 0; i < 17; i++) {
        sum += wi[i] * idCardArray[i]; // 加权求和
      }
      var valCodePosition = sum % 11; // 得到验证码所位置
      return idCardArray[17] == valideCode[valCodePosition];
    }

    if (applicant.idNo) {
      if(typeof applicant.idNo !== 'string') applicant.idNo = applicant.idNo.toString();
      applicant.idNo = applicant.idNo.replace(/ /g, "");
      if (applicant.idNo.length == 15) {
        var year = applicant.idNo.substring(6, 8);
        var month = applicant.idNo.substring(8, 10);
        var day = applicant.idNo.substring(10, 12);
        var tempDate = new Date(year, parseFloat(month) - 1, parseFloat(day));
        if (tempDate.getYear() == parseFloat(year) && tempDate.getMonth() == parseFloat(month) - 1 && tempDate.getDate() == parseFloat(day)) {
          applicant.idNoError = false;
        } else {
          applicant.idNoError = true;
          $scope.infoBoxShow = true;
          $scope.infoBoxShowTxt = $scope.CONSTANT.messageIdentityFormatError;
          return false;
        }
      } else if (applicant.idNo.length == 18 && isTrueValidateCodeBy18IdCard(applicant.idNo)) {
        var year = applicant.idNo.substring(6, 10);
        var month = applicant.idNo.substring(10, 12);
        var day = applicant.idNo.substring(12, 14);
        var tempDate = new Date(year, parseFloat(month) - 1, parseFloat(day));
        if (tempDate.getFullYear() == parseFloat(year) && tempDate.getMonth() == parseFloat(month) - 1 && tempDate.getDate() == parseFloat(day)) {
          applicant.idNoError = false;
        } else {
          applicant.idNoError = true;
          $scope.infoBoxShow = true;
          $scope.infoBoxShowTxt = $scope.CONSTANT.messageIdentityFormatError;
          return false;
        }
      } else {
        //校验香港身份证规则
        var taiwanreg = /^[A-Z][0-9]{9}$/;
        //校验台湾身份证规则
        var xianggangreg = /^[A-Z][0-9]{6}\([0-9A-Z]\)$/;
        var xianggangreg1 = /^[A-Z][0-9]{6}\（[0-9A-Z]\）$/;
        //校验澳门身份证规则
        var aomenreg = /^[157][0-9]{6}\([0-9]\)$/;
        var aomenreg1 = /^[157][0-9]{6}\（[0-9]\）$/;
        if (!(taiwanreg.test(applicant.idNo) || xianggangreg.test(applicant.idNo) || xianggangreg1.test(applicant.idNo) || aomenreg.test(applicant.idNo) || aomenreg1.test(applicant.idNo))) {
          applicant.idNoError = true;
          $scope.infoBoxShow = true;
          $scope.infoBoxShowTxt = $scope.CONSTANT.messageIdentityFormatError;
          return false;
        } else applicant.idNoError = false;
      }
    }
    return true;
  };
});
