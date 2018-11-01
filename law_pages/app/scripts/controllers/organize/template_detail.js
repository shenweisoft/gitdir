/**
 * Created by Administrator on 2017/4/12 0012.
 */
var app = angular.module('sbAdminApp');
app.controller('TemplateDetailCtrl', function($scope, LoginService,LoginConfig,$log,toaster,$stateParams,DictionaryConfig,$modal,$state,$rootScope) {

    //定义查询组织模板Service
    $scope.queryJyTemplateInfoService = LoginService.queryJyTemplateInfo;
    //定义保存或者修改模板的Service
    $scope.saveJyTemplateInfoService = LoginService.saveJyTemplateInfo;
    //组织名称
    $scope.orgName = $stateParams.orgName;
    //word模板集合
    $scope.docList = DictionaryConfig.docList;

    $scope.keyConstant = [
        {"key":"currentPersonName","value":"当事人姓名"},
        {"key":"applicantList","value":"申请人集合"},
        {"key":"respondentList","value":"被申请人集合"},
        {"key":"adjustDate","value":"调解日期"},
        {"key":"adjustName","value":"调解中心名称"},
        {"key":"reason","value":"案由"},
        {"key":"courtName","value":"法院名称"},
        {"key":"superiorCourt","value":"上级法院"},
        {"key":"serialNo","value":"流水号"},
        {"key":"validateCode","value":"短信验证码"},
        {"key":"lawNo","value":"案号"},
        {"key":"filingDate","value":"立案日期"},
        {"key":"courtStartDate","value":"开庭日期"},
        {"key":"mailAccount","value":"邮箱账号"},
        {"key":"mailPassword","value":"邮箱密码"},
        {"key":"sendDate","value":"送达日期"},
        {"key":"identifiedPerson","value":"被鉴定人"},
        {"key":"identifiedType","value":"鉴定类型"},
        {"key":"identifiedOrgName","value":"鉴定机构"},
        {"key":"identifiedNo","value":"申请编号"},
        {"key":"identifiedMoney","value":"鉴定费"},
        {"key":"identifiedDate","value":"鉴定日期"},
        {"key":"identifiedAddress","value":"鉴定地址"},
        {"key":"ipAddress","value":"项目地址"}
        ];

    var TemplateDetail = function(){
        //组织ID
        this.orgId = $stateParams.orgId;
        //主键
        this.id = "";
        //调解协议书
        this.adjustmentAgreementDoc = "";
        //调解书
        this.adjustDoc = "";
        //司法确认裁定书
        this.judicialConfirmDoc = "";
        //民事判决书
        this.civilJudgmentDoc = "";
        //起诉状
        this.indictmentDoc = "";
        //传票
        this.summonsDoc = "";
        //受理通知书
        this.acceptanceDoc = "";
        //应诉通知书
        this.respondentDoc = "";
        //风险提示书
        this.riskDoc = "";
        //举证通知书
        this.proofDoc = "";
        //民事诉讼须知
        this.civilProcedureDoc = "";
        //鉴定须知
        this.identificationInformationDoc = "";
        //鉴定报告
        this.appraisalReportDoc = "";
        //司法确认书申请书
        this.judicialApplyDoc = "";
        //达成调解并申请调解书  -- 起诉状
        this.mediateIndictmentDoc = "";
        //民事调解书
        this.civilMediationDoc = "";
        //调解笔录
        this.mediateRecordDoc = "";
        //调解成功短信模板
        this.adjustSuccess = "申请人：<applicantList>，申请人：<respondentList><lawNo>案件已于<adjustDate>达成调解。【<adjustName>】";
        //未达成调解线上起诉
        // this.adjustFailOnLine = "申请人<applicantList>与申请人<respondentList><reason>案件未达成调解，但各方当事人均同意通过法院网上法庭处理，故请申请人在接收本通知后7日内通过<courtName>在线道交审判系统（网址：<ipAddress>）向法院发起在线诉讼。您的调解流水号为<serialNo>【<adjustName>】";
        this.adjustFailOnLine = "申请人<applicantList>与申请人<respondentList><reason>案件未达成调解，申请人在接收本通知后可通过<courtName>道交一体化平台（网址：<ipAddress>）向法院发起在线诉讼或者直接到法院提起线下诉讼。您的调解流水号为<serialNo>【<adjustName>】";
        //未达成调解线下起诉
        this.adjustFailLine = "申请人<applicantList>与申请人<respondentList><reason>案件未达成调解，因各方当事人未就是否通过法院网上交通法庭处理达成一致意见，故申请人在接收本通知后可依法直接向<courtName>递交书面起诉状及其他诉讼材料。【<adjustName>】";
        //发起起诉验证码
        this.prosecution = "您正在发起在线诉讼，验证码：<validateCode>用于提取交通事故调解信息（流水号<serialNo>），请于1分钟内输入，请勿向任何人提供您收到的短信验证码【<courtName>】";
        //发起应诉验证码
        this.respondent = "您正在发起在线应诉，验证码：<validateCode>用于提取交通事故调解信息（流水号<serialNo>/案号<lawNo>），请于1分钟内输入，请勿向任何人提供您收到的短信验证码【<courtName>】";
        //不同意审批通知
        this.approvalNotAgree = "原告：<applicantList>，你诉<respondentList><reason>案件于<filingDate>经法院审核暂无法受理，请补充相关材料。如有不明，请登录<ipAddress>我的诉讼栏目查看【<courtName>】";
        //立案受理通知（原告）
        this.filingAgreeApplicant = "原告：<applicantList>，你诉<respondentList><reason>案件于<filingDate>经法院审核已受理，相关法律文书已发送至您司法邮箱，请查收。案号：<lawNo>，请于7日内缴纳诉讼费，否则按撤诉处理。法院于<courtStartDate>网上开庭，请准时参加【<courtName>】";
        //立案受理通知（被告）
        this.filingAgreeRespondent = "被告：<respondentList>，原告<applicantList>诉你方<reason>案件于<filingDate>经法院审核已受理，相关法律文书已发送至您司法邮箱，请查收。案号：<lawNo>，法院于<courtStartDate>网上开庭，请准时参加【<courtName>】";
        //司法邮箱注册成功
        this.mailSendSuccess = "司法邮箱登录网址http://mail.jtspt.com，邮箱账号：<mailAccount>，密码：<mailPassword>，您可以通过此账号/密码登录！【道交事故网上法庭】";
        //缴纳诉讼费通知
        this.feeMoney = "原告：<applicantList>您的起诉案件，经法院审核已受理，缴费通知书已发送至您司法邮箱，请查收。请于7日内缴纳诉讼费，否则按撤诉处理【<courtName>】";
        //司法确认裁定同意通知
        this.judicialAgree = "申请人<applicantList>，申请人<respondentList>，<lawNo>案件已于<adjustDate>达成调解，已由<courtName>出具司法裁定书，请查收邮件信息【<courtName>】";
        //司法确认裁定驳回通知
        this.judicialNotAgree = "申请人<applicantList>，申请人<respondentList>，<lawNo>案件已于<adjustDate>达成调解，已由<courtName>驳回司法确认申请【<courtName>】";
        //诉讼案件结案通知
        this.litigationFinish = "原告<applicantList>诉被告<respondentList><reason>案件已于<sendDate>人民法院审理结束，裁判文书已发至各方当事人司法邮箱，请及时查收。任何一方如不服判决（裁定），可于收到本院书面裁判文书后在法定期限内上诉至<superiorCourt>【<courtName>】";
        //庭前调解成功结案通知
        this.beforeAdjust = "原告<applicantList>诉被告<respondentList><reason>案件已于<sendDate>庭前调解完成，调解书已发至各方当事人司法邮箱，请及时查收。【<courtName>】";
        //提交鉴定
        this.submitIdentification = "<identifiedPerson>：您已成功提交了<identifiedType>司法鉴定申请，申请编号为：<identifiedNo>。相关文书已发送至您司法邮箱，请查收。【道交事故网上法庭】";
        //鉴定接收完成后
        this.identificationAcceptFinish = "<identifiedPerson>：您的司法鉴定申请（申请编号：<identifiedNo>）已经被<identifiedOrgName>成功受理。请您在5日内完成缴纳鉴定费，金额：<identifiedMoney>元。过期未缴费将自动撤回鉴定申请。【道交事故网上法庭】";
        //鉴定缴费完成
        this.identificationPayFinish = "<identifiedPerson>的司法鉴定申请（申请编号：<identifiedNo>）已缴费，请尽快确认。【道交事故网上法庭】";
        //排期
        this.schedule = "<identifiedPerson>：您的司法鉴定申请（申请编号：<identifiedNo>）将于<identifiedDate>在<identifiedAddress>进行现场鉴定，请您准时参加。【道交事故网上法庭】";
        //处理完成
        this.handleFinish = "<identifiedPerson>：您的司法鉴定申请（申请编号：<identifiedNo>）结果已经完成，司法鉴定意见书已发送至您司法邮箱，请查收。【道交事故网上法庭】";
        //调解协议书
        this.mediateTitle = "<courtName>调解协议书！";
        this.mediateContent = "<currentPersonName>：\n<br><div style='text-indent: 2em'>你好！</div>\n<br><div style='text-indent: 2em'>附件是<courtName>调解协议书，请查收！</div>\n<br><div style='text-align: right'><courtName></div>";
        this.mediateFile = "0";
        //司法确认完成
        this.judicialTitle = "<courtName>司法确认书！";
        this.judicialContent = "<currentPersonName>：\n<br><div style='text-indent: 2em'>你好！</div>\n<br><div style='text-indent: 2em'>附件是<courtName>司法确认书，请查收！</div>\n<br><div style='text-align: right'><courtName></div>";
        this.judicialFile = "1";
        //立案原告
        this.filingApplicantTitle = "<courtName>立案通知！";
        this.filingApplicantContent = "<currentPersonName>：\n<br><div style='text-indent: 2em'>你好！</div>\n<br><div style='text-indent: 2em'>附件是<courtName>立案通知书，请查收，并按相关法律文书及时应诉。</div>\n<br><div style='text-align: right'><courtName></div>";
        this.filingApplicantFile = "5,6,8,9";
        //立案被告
        this.filingRespondentTitle = "<courtName>立案通知！";
        this.filingRespondentContent = "<currentPersonName>：\n<br><div style='text-indent: 2em'>你好！</div>\n<br><div style='text-indent: 2em'>附件是<courtName>立案通知书，请查收，并按相关法律文书及时应诉。</div>\n<br><div style='text-align: right'><courtName></div>";
        this.filingRespondentFile = "4,5,7,8,9";
        //裁决书
        this.arbitralAwardTitle = "<courtName>判决书！";
        this.arbitralAwardContent = "<currentPersonName>：\n<br><div style='text-indent: 2em'>你好！</div>\n<br><div style='text-indent: 2em'>附件是<courtName>判决书，请查收！</div>\n<br><div style='text-align: right'><courtName></div>";
        this.arbitralAwardFile = "2";
        //调解书
        this.mediationLetterTitle = "<courtName>调解书！";
        this.mediationLetterContent = "<currentPersonName>：\n<br><div style='text-indent: 2em'>你好！</div>\n<br><div style='text-indent: 2em'>附件是<courtName>调解书，请查收！</div>\n<br><div style='text-align: right'><courtName></div>";
        this.mediationLetterFile = "18";
        //鉴定发起
        this.appraisalLaunchTitle = "司法鉴定须知！";
        this.appraisalLaunchContent = "<currentPersonName>：\n<br><div style='text-indent: 2em'>你好！</div>\n<br><div style='text-indent: 2em'>附件是司法鉴定须知， 请查收！</div>";
        this.appraisalLaunchFile = "11";
        //鉴定报告
        this.appraisalReportTitle = "司法鉴定意见书！";
        this.appraisalReportContent = "<currentPersonName> 你好：\n<br><div style='text-indent: 2em'>附件是司法鉴定意见书，请查收！</div>";
        this.appraisalReportFile = "12";
        //交警受理后
        this.acceptanceMsg = "<personName>您好，您<and><otherPersonName><to><accidentDate>发生的道路交通事故已于今日受理，很抱歉本次事故的发生我们将在x个工作日内完成事故责任认定，详情可至安庆市XX路XX号交通事故处理中心进行咨询。";
        //扣车扣证
        this.vehicleMsg = "<personName>您好，您<and><otherPersonName><to><accidentDate>发生的交通事故已于今日对您作出扣车/扣证处理，详情可至安庆市XX路XX号交通事故处理中心进行咨询，或通过微信公众号“安庆公安交警微发布”进行案件进度查询。";
        //鉴定
        this.appraiseMsg = "提示您:被鉴定人<userName>的鉴定任务已经发送至<orgName>，请及时接收。(鉴定申请号为：<serialNo>)";
        //过程文书送达
        this.isPassDocument = "0";
        //结案文书送达
        this.isEndDocument = "1";
        //被选择的邮件
        this.isSendEmail = '0';
    };

    //处理邮件附件选中
    $scope.handleMailFile = function(){
        //初始化集合数据
        //调解协议书
        $scope.templateDetail.mediateFileList = angular.copy(DictionaryConfig.docList);
        //司法确认完成
        $scope.templateDetail.judicialFileList = angular.copy(DictionaryConfig.docList);
        //立案原告
        $scope.templateDetail.filingApplicantFileList = angular.copy(DictionaryConfig.docList);
        //立案被告
        $scope.templateDetail.filingRespondentFileList = angular.copy(DictionaryConfig.docList);
        //裁决书
        $scope.templateDetail.arbitralAwardFileList = angular.copy(DictionaryConfig.docList);
        //调解书
        $scope.templateDetail.mediationLetterFileList = angular.copy(DictionaryConfig.docList);
        //鉴定发起
        $scope.templateDetail.appraisalLaunchFileList = angular.copy(DictionaryConfig.docList);
        //鉴定报告
        $scope.templateDetail.appraisalReportFileList = angular.copy(DictionaryConfig.docList);

        //调解协议书
        $scope.templateDetail.mediateFile.split(",").forEach(function(val){
            var mediateFile = _.find($scope.templateDetail.mediateFileList, {id: val}) || {};
            mediateFile.selected = true;
        });
        //司法确认完成
        $scope.templateDetail.judicialFile.split(",").forEach(function(val){
            var judicialFile = _.find($scope.templateDetail.judicialFileList, {id: val}) || {};
            judicialFile.selected = true;
        });
        //立案原告
        $scope.templateDetail.filingApplicantFile.split(",").forEach(function(val){
            var filingApplicantFile = _.find($scope.templateDetail.filingApplicantFileList, {id: val}) || {};
            filingApplicantFile.selected = true;
        });
        //立案被告
        $scope.templateDetail.filingRespondentFile.split(",").forEach(function(val){
            var filingRespondentFile = _.find($scope.templateDetail.filingRespondentFileList, {id: val}) || {};
            filingRespondentFile.selected = true;
        });
        //裁决书
        $scope.templateDetail.arbitralAwardFile.split(",").forEach(function(val){
            var arbitralAwardFile = _.find($scope.templateDetail.arbitralAwardFileList, {id: val}) || {};
            arbitralAwardFile.selected = true;
        });
        //调解书
        $scope.templateDetail.mediationLetterFile.split(",").forEach(function(val){
            var mediationLetterFile = _.find($scope.templateDetail.mediationLetterFileList, {id: val}) || {};
            mediationLetterFile.selected = true;
        });
        //鉴定发起
        $scope.templateDetail.appraisalLaunchFile.split(",").forEach(function(val){
            var appraisalLaunchFile = _.find($scope.templateDetail.appraisalLaunchFileList, {id: val}) || {};
            appraisalLaunchFile.selected = true;
        });
        //鉴定报告
        $scope.templateDetail.appraisalReportFile.split(",").forEach(function(val){
            var appraisalReportFile = _.find($scope.templateDetail.appraisalReportFileList, {id: val}) || {};
            appraisalReportFile.selected = true;
        });
        //邮箱配置
        if($scope.templateDetail.isSendEmail) $scope.chooseEmailArray = getChooseArray($scope.templateDetail.isSendEmail.split(','));
        else $scope.chooseEmailArray = [];
    };

    //查询模板
    $scope.queryJyTemplateInfoService({
        orgId:$stateParams.orgId
    }).success(function(result) {
        if (result.code == LoginConfig.commonConStant.SUCCESS) {
            //如果不存在
            if(!result.result){
                $scope.templateDetail = new TemplateDetail();
            }else{
                $scope.templateDetail = result.result;
            }
            console.log($scope.templateDetail)
            $scope.handleMailFile();
        }else{
          $rootScope.toaster("error", "错误", result.message);
        }
    });

    //处理保存值
    $scope.handleFile = function(){
        //调解协议书
        var mediateFile = "";
        var mediateFileFlag = true;
        $scope.templateDetail.mediateFileList.forEach(function(val){
            if(val.selected){
                if(!mediateFileFlag){
                    mediateFile += ",";
                }
                mediateFile += val.id
                mediateFileFlag = false;
            }
        });
        $scope.templateDetail.mediateFile = mediateFile;
        //司法确认完成
        var judicialFile = "";
        var judicialFileFlag = true;
        $scope.templateDetail.judicialFileList.forEach(function(val){
            if(val.selected){
                if(!judicialFileFlag){
                    judicialFile += ",";
                }
                judicialFile += val.id
                judicialFileFlag = false;
            }
        });
        $scope.templateDetail.judicialFile = judicialFile;
        //立案原告
        var filingApplicantFile = "";
        var filingApplicantFileFlag = true;
        $scope.templateDetail.filingApplicantFileList.forEach(function(val){
            if(val.selected){
                if(!filingApplicantFileFlag){
                    filingApplicantFile += ",";
                }
                filingApplicantFile += val.id
                filingApplicantFileFlag = false;
            }
        });
        $scope.templateDetail.filingApplicantFile = filingApplicantFile;
        //立案被告
        var filingRespondentFile = "";
        var filingRespondentFileFlag = true;
        $scope.templateDetail.filingRespondentFileList.forEach(function(val){
            if(val.selected){
                if(!filingRespondentFileFlag){
                    filingRespondentFile += ",";
                }
                filingRespondentFile += val.id
                filingRespondentFileFlag = false;
            }
        });
        $scope.templateDetail.filingRespondentFile = filingRespondentFile;
        //裁决书
        var arbitralAwardFile = "";
        var arbitralAwardFileFlag = true;
        $scope.templateDetail.arbitralAwardFileList.forEach(function(val){
            if(val.selected){
                if(!arbitralAwardFileFlag){
                    arbitralAwardFile += ",";
                }
                arbitralAwardFile += val.id
                arbitralAwardFileFlag = false;
            }
        });
        $scope.templateDetail.arbitralAwardFile = arbitralAwardFile;
        //调解书
        var mediationLetterFile = "";
        var mediationLetterFileFlag = true;
        $scope.templateDetail.mediationLetterFileList.forEach(function(val){
            if(val.selected){
                if(!mediationLetterFileFlag){
                    mediationLetterFile += ",";
                }
                mediationLetterFile += val.id
                mediationLetterFileFlag = false;
            }
        });
        $scope.templateDetail.mediationLetterFile = mediationLetterFile;

        //鉴定发起
        var appraisalLaunchFile = "";
        var appraisalLaunchFileFlag = true;
        $scope.templateDetail.appraisalLaunchFileList.forEach(function(val){
            if(val.selected){
                if(!appraisalLaunchFileFlag){
                    appraisalLaunchFile += ",";
                }
                appraisalLaunchFile += val.id
                appraisalLaunchFileFlag = false;
            }
        });
        $scope.templateDetail.appraisalLaunchFile = appraisalLaunchFile;

        //鉴定报告
        var appraisalReportFile = "";
        var appraisalReportFileFlag = true;
        $scope.templateDetail.appraisalReportFileList.forEach(function(val){
            if(val.selected){
                if(!appraisalReportFileFlag){
                    appraisalReportFile += ",";
                }
                appraisalReportFile += val.id
                appraisalReportFileFlag = false;
            }
        });
        $scope.templateDetail.appraisalReportFile = appraisalReportFile;

        //邮箱配置
        $scope.templateDetail.isSendEmail = getChooseString().join(',');
    };

    //保存操作
    $scope.save = function(){
        //将邮件附件转换为数字以逗号分隔
        $scope.handleFile();
        //保存操作
        $scope.saveJyTemplateInfoService($scope.templateDetail).success(function(result) {
            if (result.code == LoginConfig.commonConStant.SUCCESS) {
                $log.info(result);
                //赋值ID
                $scope.templateDetail.id = result.result;
                $rootScope.toaster("success", "成功", "恭喜您保存成功！");
            }else{
                $rootScope.toaster("error", "错误", result.message);
            }
        });
    }

    //字段说明
    $scope.queryDescription = function() {
        $modal.open({
            templateUrl: 'views/pages/organize_manage/templateDescription.html',
            controller: 'QueryDescriptionCtrl',
            size: 'lg',
            resolve: {
                items: function() {
                    return {
                        keyConstant: $scope.keyConstant
                    }
                }
            }
        });
    };

    //返回
    $scope.back = function(){
        $state.go("dashboard.templateManagement");
    };

    //选择发送的邮箱类型
    function getChooseString() {
        console.log($scope.chooseEmailArray)
        var arr = [];
        _.each($scope.chooseEmailArray, function (v) {
            if(v == '0' || v) {
                arr.push(v)
            }
        });
        return arr;
    }

    function getChooseArray(arr) {
      for(var i = 0; i < arr.length; i++) {
        if(arr[i] != i && arr[i] != undefined) {
          arr.splice(i, 0, undefined);
          getChooseArray(arr); //递归
          break;
        }
      }
      if(arr.length != 6) arr.length = 6;
      return arr;
    }
});

angular.module('sbAdminApp').controller('QueryDescriptionCtrl', function($scope, items ,$modalInstance,DictionaryConfig) {

    $scope.keyConstantList = items.keyConstant;

    $scope.docList = DictionaryConfig.docList;
    //点击取消
    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };

});