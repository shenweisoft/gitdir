angular.module('sbAdminApp', ['oc.lazyLoad', 'ui.router', 'ui.bootstrap', 'ui.bootstrap.datetimepicker', 'angular-loading-bar', 'ngFileUpload','toaster', 'ngJsTree', 'ngAnimate', 'toggle-switch']).config(['$stateProvider', '$urlRouterProvider', '$ocLazyLoadProvider', '$anchorScrollProvider',
  function($stateProvider, $urlRouterProvider, $ocLazyLoadProvider, $anchorScrollProvider) {
    $anchorScrollProvider.disableAutoScrolling();
    $ocLazyLoadProvider.config({
      debug: false,
      events: true
    });
    $urlRouterProvider.when("/dashboard/mediation/:id/:isSelf", "/dashboard/mediation/:id/:isSelf/step12/1");
    $urlRouterProvider.when("/dashboard/mediation//:isSelf", "/dashboard/mediation//:isSelf/step12/1");

    $urlRouterProvider.when("/dashboard/personMediation/:id", "/dashboard/personMediation/:id/step12/1");
    $urlRouterProvider.when("/dashboard/personMediation/", "/dashboard/personMediation//step12/1");

    $urlRouterProvider.when("/dashboard/compensateCalculate/:id", "/dashboard/compensateCalculate/:id/compensateCalculateStep12/1");
    $urlRouterProvider.when("/dashboard/compensateCalculate/", "/dashboard/compensateCalculate//compensateCalculateStep12/1");

    $urlRouterProvider.when("/dashboard/algorithm/:id", "/dashboard/algorithm/:id/algorithmStep1");

    $urlRouterProvider.when("/dashboard/secondInstanceLitigantion/:id", "/dashboard/secondInstanceLitigantion/:id/secondStep123/1");
    $urlRouterProvider.when("/dashboard/secondInstanceLitigantion/", "/dashboard/secondInstanceLitigantion//secondStep123/1");

    $urlRouterProvider.when("/dashboard/secondInstanceLitigant", "/dashboard/secondInstanceLitigant/secondStep12/1");//二审上诉重定向

    $urlRouterProvider.when("/dashboard/algorithm/", "/dashboard/algorithm/:id/algorithmStep1");

    $urlRouterProvider.when("/dashboard/sue_detail/:serialNo/:courtCode/:id", "/dashboard/sue_detail/:serialNo/:courtCode/:id/step12/1");
    $urlRouterProvider.when("/appraisal/:serialNo/:caseType/:appraisalInfoId/:judge", "/appraisal/:serialNo/:caseType/:appraisalInfoId/:judge/step1");
    $urlRouterProvider.when("/home_page/prejudge", "/home_page/prejudge/step1");
    $urlRouterProvider.when("/dashboard/allCaseList//:overall", "/dashboard/allCaseList/1/:overall");
    $urlRouterProvider.when("/dashboard/case_inquire//:searchOverallSituation", "/dashboard/case_inquire/1/:searchOverallSituation");
    $urlRouterProvider.when("/AIOCourtSetpBox", "/AIOCourtSetpBox/AIOCourtSetp1");
    $urlRouterProvider.when("home_page/prejudge_new", "home_page/prejudge_new/AIOCourtSetp1");
    $urlRouterProvider.otherwise('/home_page/home');
    $stateProvider.state('dashboard', {
      templateUrl: 'views/dashboard/main.html',
      controller: 'mainCtrl',
      url: '/dashboard',
      resolve: {
        loadMyDirectives: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/directives/main/main.js','scripts/directives/header/header.js', 'scripts/directives/header/header-notification/header-right.js', 'scripts/directives/sidebar/sidebar.js','scripts/directives/sidebar/sidebar-search/sidebar-search.js','scripts/directives/head_detail/head_detail.js']
          })
        }
      }
    }).state('shakingNumber', {
      templateUrl: 'views/pages/shakingNumber.html',
      controller: 'shakingNumberCtrl',
      url: '/shakingNumber',
      resolve: {
        loadMyDirectives: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/shakingNumber.js']
          })
        }
      }
    }).state('home_page', {
      templateUrl: 'views/pages/homePage.html',
      controller: 'homePageCtrl',
      url: '/home_page',
      resolve: {
        loadMyDirectives: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/homePage.js']
          })
        }
      }
    }).state('chatSocket', {
        templateUrl: 'views/pages/socket/chatSocket.html',
        controller: 'chatSocketCtrl',
        url: '/chatSocket',
        resolve: {
            loadMyDirectives: function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'sbAdminApp',
                    files: ['scripts/controllers/socket/chatSocket.js']
                });
            }
        }
    }).state('home_page.homeContent', {
      url: '/home',
      controller: 'homePageCtrl',
      templateUrl: 'views/pages/homePage_cont.html',
      resolve: {
        loadMyFiles: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/homePage.js','scripts/controllers/homePage/instrumentTemplate.js','scripts/controllers/indexImgMaintain/TweenMax.min.js']
          })
        }
      }
    }).state('home_page.helpCenter', {
      url: '/helpCenter/{online}',
      controller: 'helpCenterCtrl',
      templateUrl: 'views/pages/helpCenter.html',
      resolve: {
        loadMyFiles: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/homePage.js']
          })
        }
      }
    }).state('home_page.instrument', {
      url: '/instrument',
      controller: 'instrumentTemplateCtrl',
      templateUrl: 'views/pages/homePage/instrument_template.html',
      resolve: {
        loadMyFiles: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/homePage.js','scripts/controllers/homePage/instrumentTemplate.js']
          })
        }
      }
    }).state('online_trial', {
      url: '/onlineTrial',
      controller: 'homePageCtrl',
      templateUrl: 'views/pages/online_trial.html',
      resolve: {
        loadMyFiles: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/homePage.js']
          })
        }
      }
    }).state('party_page', {
      url: '/party_page',
      controller: 'partyPageCtrl',
      templateUrl: 'views/pages/party_page/party_page.html',
      resolve: {
        loadMyDirectives: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/directives/header/header.js', 'scripts/directives/header/header-notification/header-right.js', 'scripts/directives/head_detail/head_detail.js','scripts/controllers/party_page/party_page.js']
          })
        }
      }
    }).state('home_page.litigationGuide', {
      url: '/litigationGuide/:flag',
      controller: 'LitigationGuideCtrl',
      templateUrl: 'views/pages/homePage/litigationGuide.html',
      resolve: {
        loadMyFiles: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/homePage/litigationGuide.js']
          })
        }
      }
    }).state('appraisal', {
      url: '/appraisal/:serialNo/:caseType/:appraisalInfoId/:judge',
      controller: 'AppraisalCtrl',
      templateUrl: 'views/pages/appraisal/appraisal.html',
      resolve: {
        loadMyDirectives: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/appraisal/appraisal.js']
          })
        }
      }
    }).state('dashboard.home', {
      url: '/home',
      controller: 'MainCtrl',
      templateUrl: 'views/dashboard/home_faguan.html',
      resolve: {
        loadMyFiles: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/main.js',
                'scripts/directives/timeline/timeline.js',
                'scripts/directives/notifications/notifications.js',
                'scripts/directives/chat/chat.js',
                'scripts/directives/dashboard/stats/stats.js']
          })
        }
      }
    }).state('to_be_deleted', {
      url: '/to_be_deleted',
      controller: 'ToBeDeletedCtrl',
      templateUrl: 'views/pages/to_be_deleted.html',
      resolve: {
        loadMyFiles: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/to_be_deleted.js']
          })
        }
      }
    }).state('login', {
      params:{"type":null},
      templateUrl: 'views/pages/login/login.html',
      controller: 'LoginCtrl',
      url: '/login/:type',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/login/login.js']
          })
        }
      }
    }).state('tjLogin', {
      params:{"type":null},
      templateUrl: 'views/pages/login/tjLogin.html',
      controller: 'LoginCtrl',
      url: '/tjlogin/:type',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/login/login.js']
          })
        }
      }
    }).state('publicSecurityLogin', {
      params:{"type":null},
      templateUrl: 'views/pages/login/publicSecurityLogin.html',
      controller: 'LoginCtrl',
      url: '/publicSecurityLogin/:type',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/login/login.js']
          })
        }
      }
    }).state('insuranceCompanyLogin', {
      params:{"type":null},
      templateUrl: 'views/pages/login/insuranceCompanyLogin.html',
      controller: 'LoginCtrl',
      url: '/insuranceCompanyLogin/:type',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/login/login.js']
          })
        }
      }
    }).state('litigantLogin', {
      params:{"type":null},
      templateUrl: 'views/pages/login/litigantLogin.html',
      controller: 'LoginCtrl',
      url: '/litigantLogin/:type',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/login/login.js']
          })
        }
      }
    }).state('identificationLogin', {
      params:{"type":null},
      templateUrl: 'views/pages/login/identificationLogin.html',
      controller: 'LoginCtrl',
      url: '/identificationLogin/:type',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/login/login.js']
          })
        }
      }
    }).state('insuranceHospitalLogin', {
      s:{"type":null},
      templateUrl: 'views/pages/login/insuranceHospitalLogin.html',
      controller: 'insuranceHospitalLoginCtrl',
      url: '/insuranceHospitalLogin',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/login/insuranceHospitalLogin.js']
          })
        }
      }
    }).state('policeLogin', {
      templateUrl: 'views/pages/login/policeLogin.html',
      controller: 'policeLoginCtrl',
      url: '/policeLogin/:type',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/login/policeLogin.js']
          })
        }
      }
    }).state('register', {
      templateUrl: 'views/pages/login/register.html',
      controller: 'RegisterCtrl',
      url: '/register',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/login/register.js']
          })
        }
      }

    }).state('register_success', {
      templateUrl: 'views/pages/login/register_success.html',
      url: '/register_success'
    }).state('forget_password', {
      templateUrl: 'views/pages/login/forget_password.html',
      controller: 'ForgetPassword',
      url: '/forget_password',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/login/forget_password.js']
          })
        }
      }
    }).state('modify_success', {
      templateUrl: 'views/pages/login/modify_success.html',
      url: '/modify_success'
    }).state('mailbox_validation_entry', {
      templateUrl: 'views/pages/login/mailbox_validation_entry.html',
      controller: 'MailboxValidationEntry',
      url: '/mailbox_validation_entry/{email}',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/login/mailbox_validation_entry.js']
          })
        }
      }
    }).state('dashboard.manageList', {
      templateUrl: 'views/pages/organize_manage/manageList.html',
      controller: 'organizeCtrl',
      url: '/manageList',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/organize/organize.js', 'scripts/controllers/organize/organize_add_role.js', 'scripts/controllers/organize/organize_new_department.js', 'scripts/controllers/organize/organize_new_organize.js', 'scripts/controllers/organize/organize_new_person.js','scripts/directives/court_list/court_list.js', 'scripts/controllers/organize/dataPermission.js']
          })
        }
      }
    }).state('dashboard.role_management', {
      templateUrl: 'views/pages/role_management/role_management.html',
      controller: 'RoleManagementCtrl',
      url: '/role_management',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/role_management/role_management.js']
          })
        }
      }
    }).state('dashboard.noticeManagement', {
      templateUrl: 'views/pages/notice_manage/noticeManagement.html',
      controller: 'NoticeManagementCtrl',
      url: '/noticeManagement',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/notice/notice_management.js']
          })
        }
      }
    }).state('dashboard.interfaceManagement', {
      templateUrl: 'views/pages/interface_manage/interfaceManagement.html',
      controller: 'InterfaceManagementCtrl',
      url: '/interfaceManagement',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/interface/interface_management.js']
          })
        }
      }
    }).state('dashboard.judgeInterfaceManage', {
        templateUrl: 'views/pages/interface_manage/judgeInterfaceManage.html',
        controller: 'judgeInterfaceManageCtrl',
        url: '/judgeInterfaceManage',
        resolve: {
            loadMyFile: function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'sbAdminApp',
                    files: ['scripts/controllers/interface/judgeInterface_management.js']
                })
            }
        }
    }).state('dashboard.helpManage', {
      templateUrl: 'views/pages/interface_manage/helpManage.html',
      controller: 'helpManageCtrl',
      url: '/helpManage',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/interface/helpManage.js']
          })
        }
      }
    }).state('dashboard.personal', {
      templateUrl: 'views/pages/personal/personal.html',
      controller: 'PersonalCtrl',
      url: '/personal',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/personal/personal.js']
          })
        }
      }
    }).state('dashboard.mediation', {
    	params:{inmagename:null,cameraorder:null,idtype:null},
      templateUrl: 'views/pages/mediation_platform/litigation_mediation/mediation.html',
      controller: 'mediationCtrl',
      url: '/mediation/:id/:isSelf',  //1对方链接 0 本地访问
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/mediation_platform/litigation/mediation.js','scripts/controllers/mediation_platform/litigation/information.js']
          })
        }
      }
    }).state('dashboard.mediation.step12', {
      templateUrl: 'views/pages/mediation_platform/litigation_mediation/step12.html',
      controller: 'step12Ctrl',
      url: '/step12/:step',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/mediation_platform/litigation/step12.js',
              'scripts/scanIdCard/baseISSObject.js',
              'scripts/scanIdCard/baseISSOnline.js',
              'scripts/scanIdCard/common.js']
          })
        }
      }
    }).state('dashboard.mediation.step3', {
      templateUrl: 'views/pages/mediation_platform/litigation_mediation/step3.html',
      controller: 'step3Ctrl',
      url: '/step3',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/mediation_platform/litigation/step3.js']
          })
        }
      }
    }).state('dashboard.mediation.step4', {
      templateUrl: 'views/pages/mediation_platform/litigation_mediation/step4.html',
      controller: 'step4Ctrl',
      url: '/step4',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/mediation_platform/litigation/step4.js']
          })
        }
      }
    }).state('dashboard.mediation.step5', {
      templateUrl: 'views/pages/mediation_platform/litigation_mediation/step5.html',
      controller: 'step5Ctrl',
      url: '/step5',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/mediation_platform/litigation/step5.js',
              'scripts/controllers/mediation_platform/litigation/extraAmount.js',
              'scripts/controllers/mediation_platform/litigation/nursingFee.js',
              'scripts/controllers/mediation_platform/litigation/modalLawItems.js',
              'scripts/controllers/mediation_platform/litigation/payMoney.js']
          })
        }
      }
    }).state('dashboard.mediation.step6', {
      templateUrl: function(params){
        return 'views/pages/mediation_platform/litigation_mediation/'+params.name+'.html'
      },
      controller: 'step6Ctrl',
      url: '/step6/:name',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/mediation_platform/litigation/step6.js']
          })
        }
      }
    }).state('highMeter', {
       templateUrl: function(params){
        return 'views/pages/mediation_platform/litigation_mediation/highMeter.html'
      },
      controller: 'highMeterCtrl',
      url: '/highMeter',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/mediation_platform/litigation/highMeter.js']
          })
        }
      }
    })/*.state('dashboard.mediationback', {
    	params: {testd:null},
        templateUrl: 'views/pages/mediation_platform/litigation_mediation/mediation.html',
        controller: 'mediationCtrl',
        url: '/mediation/:id/:isSelf',  //1对方链接 0 本地访问
        resolve: {
          loadMyFile: function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name: 'sbAdminApp',
              files: ['scripts/controllers/mediation_platform/litigation/mediation.js']
            })
          }
        }
      })*/.state('downloadFile', {
      templateUrl: 'views/pages/case_detail/preview.html',
      controller: 'downloadFileCtrl',
      url: '/download/{serialNo}',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/mediation_platform/litigation/step5.js']
          })
        }
      }
    }).state('dashboard.processing', {
      templateUrl: 'views/pages/mediation_platform/case_inquire/case_inquire.html',
      controller: 'caseInquireCtrl',
      url: '/processing/:pageNo',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/mediation_platform/case_inquire/case_inquire.js','scripts/controllers/mediation_platform/case_inquire/case_transfer.js']
          })
        }
      }
    }).state('dashboard.needTodoList', {
      templateUrl: 'views/pages/mediation_platform/case_inquire/case_inquire.html',
      controller: 'caseInquireCtrl',
      url: '/needTodoList',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/mediation_platform/case_inquire/case_inquire.js']
          })
        }
      }
    }).state('dashboard.todayMediation', {
      templateUrl: 'views/pages/mediation_platform/case_inquire/case_inquire.html',
      controller: 'caseInquireCtrl',
      url: '/todayMediation/:pageNo',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/mediation_platform/case_inquire/case_inquire.js']
          })
        }
      }
    }).state('dashboard.weekMediation', {
      templateUrl: 'views/pages/mediation_platform/case_inquire/case_inquire.html',
      controller: 'caseInquireCtrl',
      url: '/weekMediation/:pageNo',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/mediation_platform/case_inquire/case_inquire.js']
          })
        }
      }
    }).state('dashboard.case_inquire', {
      templateUrl: 'views/pages/mediation_platform/case_inquire/case_inquire.html',
      controller: 'caseInquireCtrl',
      url: '/case_inquire/:pageNo/:searchOverallSituation',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/mediation_platform/case_inquire/case_inquire.js']
          })
        }
      }
    }).state('dashboard.case_details', {
      templateUrl: 'views/pages/mediation_platform/case_inquire/case_details.html',
      controller: 'caseDetailCtrl',
      url: '/case_details/:serialNo/:isReturn/:state/:id/:codeFileName/:isSelf',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/mediation_platform/case_inquire/case_details.js','scripts/controllers/case_detail/track_detail.js']
          })
        }
      }
    }).state('dashboard.adjust_success', {
      templateUrl: 'views/pages/mediation_platform/litigation_mediation/adjust_success.html',
      controller: 'adjustSuccessCtrl',
      url: '/adjust_success/:id',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/mediation_platform/litigation/adjust_success.js']
          })
        }
      }
    }).state('dashboard.sue_input', {
      templateUrl: 'views/pages/lawyer/processing_case/sue_input.html',
      controller: 'sueInputCtrl',
      url: '/sue_input/:type',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/lawyer/processing_case/sue_input.js']
          })
        }
      }
    }).state('dashboard.sue_org', {
      templateUrl: 'views/pages/lawyer/processing_case/sue_org.html',
      controller: 'sueOrgtCtrl',
      url: '/sue_org',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/lawyer/processing_case/sue_org.js']
          })
        }
      }
    }).state('dashboard.approval', {
      templateUrl: 'views/pages/lawyer/filing_list.html',
      controller: 'FilingListCtrl',
      url: '/approval/:loginAccount',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/lawyer/filing_list.js','scripts/controllers/mediation_platform/litigation/information.js']
          })
        }
      }
    }).state('dashboard.filing_detail', {
      templateUrl: 'views/pages/lawyer/filing_detail.html',
      controller: 'FilingDetailCtrl',
      url: '/filing_detail/{serialNo}/:id',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/lawyer/filing_detail.js','scripts/directives/history_record/history_record.js']
          })
        }
      }
    }).state('dashboard.pending_complete', {
      templateUrl: 'views/pages/lawyer/pending_complete.html',
      controller: 'FilingCompleteCtrl',
      url: '/pending_complete/:pageInfo',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/lawyer/filing_complete.js']
          })
        }
      }
    }).state('dashboard.filing', {
      templateUrl: 'views/pages/lawyer/filing_list.html',
      controller: 'FilingListCtrl',
      url: '/filing',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/lawyer/filing_list.js']
          })
        }
      }
    }).state('dashboard.division', {
        templateUrl: 'views/pages/lawyer/filing_list.html',
        controller: 'FilingListCtrl',
        url: '/division',
        resolve: {
            loadMyFile: function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'sbAdminApp',
                    files: ['scripts/controllers/lawyer/filing_list.js']
                })
            }
        }
    }).state('dashboard.schedule', {
        templateUrl: 'views/pages/lawyer/filing_list.html',
        controller: 'FilingListCtrl',
        url: '/schedule',
        resolve: {
            loadMyFile: function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'sbAdminApp',
                    files: ['scripts/controllers/lawyer/filing_list.js']
                })
            }
        }
    }).state('dashboard.reading_notes', {
      templateUrl: function(params){
        return 'views/pages/lawyer/processing_case/notes/'+params.name+'.html';
      },
      controller: 'ReadingNotesCtrl',
      url: '/reading_notes/:name/:serialNo/:lawOrgId/:lawOrgName/:courtCode',
      params:{id:null, step:null},
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/lawyer/processing_case/reading_notes.js']
          })
        }
      }
    }).state('dashboard.sue_detail', {
      templateUrl: 'views/pages/lawyer/processing_case/sue_detail.html',
      controller: 'SueDetailCtrl',
      url: '/sue_detail/:serialNo/:courtCode/:id',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/lawyer/processing_case/sue_detail.js']
          })
        }
      }
    }).state('dashboard.sue_detail.step12', {
      templateUrl: 'views/pages/mediation_platform/litigation_mediation/step12.html',
      controller: 'step12Ctrl',
      url: '/step12/:step',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/mediation_platform/litigation/step12.js']
          })
        }
      }
    }).state('dashboard.sue_detail.step3', {
      templateUrl: 'views/pages/mediation_platform/litigation_mediation/step3.html',
      controller: 'step3Ctrl',
      url: '/step3',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/mediation_platform/litigation/step3.js']
          })
        }
      }
    }).state('dashboard.sue_detail.step4', {
      templateUrl: 'views/pages/lawyer/processing_case/step4.html',
      controller: 'SueStep4Ctrl',
      url: '/step4',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/lawyer/processing_case/step4.js']
          })
        }
      }
    }).state('dashboard.sue_detail.step5', {
      templateUrl: 'views/pages/mediation_platform/litigation_mediation/step5.html',
      controller: 'step5Ctrl',
      url: '/step5',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/mediation_platform/litigation/step5.js',
              'scripts/controllers/mediation_platform/litigation/extraAmount.js',
              'scripts/controllers/mediation_platform/litigation/nursingFee.js',
              'scripts/controllers/mediation_platform/litigation/modalLawItems.js',
              'scripts/controllers/mediation_platform/litigation/payMoney.js']
          })
        }
      }
    }).state('dashboard.sue_detail.step6', {
      templateUrl: function (params) {
        return 'views/pages/lawyer/processing_case/files/'+params.name+'.html';
      },
      controller: 'SueStep6Ctrl',
      url: '/step6/:name',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/lawyer/processing_case/step6.js']
          })
        }
      }
    }).state('evidence_detail', {
      templateUrl: 'views/pages/case_detail/evidence_detail.html',
      controller: 'EvidenceDetailCtrl',
      url: '/evidence_detail/{serialNo}/{courtType}/{menuType}/{evidenceType}/:id/:lawPersonType/:isSelf',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/case_detail/evidence_detail.js','scripts/directives/head_detail/head_detail.js','scripts/directives/sidebar/sidebar.js']
          })
        }
      }
    }).state('dossierDetail', {
      templateUrl: 'views/pages/case_detail/dossier_detail.html',
      controller: 'DossierDetailCtrl',
      url: '/dossierDetail/:serialNo/:id/:lawPersonType/:isSelf',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/case_detail/dossier_detail.js','scripts/directives/head_detail/head_detail.js']
          })
        }
      }
    }).state('signDetail', {
        templateUrl: 'views/pages/case_detail/sign_detail.html',
        controller: 'DossierDetailCtrl',
        url: '/signDetail/:serialNo/:isSelf',
        resolve: {
            loadMyFile: function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'sbAdminApp',
                    files: ['scripts/controllers/case_detail/sign_detail.js','scripts/directives/head_detail/head_detail.js']
                })
            }
        }
    }).state('judiciarySign', {
        templateUrl: 'views/pages/case_detail/judiciary_sign.html',
        controller: 'DossierDetailCtrl',
        url: '/judiciarySign/:serialNo',
        resolve: {
            loadMyFile: function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'sbAdminApp',
                    files: ['scripts/controllers/case_detail/judiciary_sign.js','scripts/directives/head_detail/head_detail.js']
                })
            }
        }
    }).state('queryTrackInfo', {
      templateUrl: 'views/pages/case_detail/queryTrackInfo.html',
      controller: 'QueryTrackInfoCtrl',
      url: '/queryTrackInfo/:serialNo/:id/:lawPersonType/:vidOpenPower',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/case_detail/queryTrackInfo.js','scripts/directives/head_detail/head_detail.js','scripts/controllers/case_detail/track_detail.js']
          })
        }
      }
    }).state('wrong_page', {
      templateUrl: 'views/pages/wrong_page.html',
      controller: 'WrongPageCtrl',
      url: '/wrong_page',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            // files: ['scripts/controllers/wrong_page.js']
          })
        }
      }
    }).state('dashboard.handleLawList', {
      templateUrl: 'views/pages/lawyer/processing_case/handleLawList.html',
      controller: 'HandleLawListCtrl',
      url: '/handleLawList',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/lawyer/processing_case/handleLawList.js']
          })
        }
      }
    }).state('dashboard.completeLawList', {
      templateUrl: 'views/pages/lawyer/processing_case/handleLawList.html',
      controller: 'HandleLawListCtrl',
      url: '/completeLawList',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/lawyer/processing_case/handleLawList.js']
          })
        }
      }
    }).state('dashboard.partyMediate', {
      templateUrl: 'views/pages/lawyer/processing_case/partyMediate.html',
      controller: 'PartyMediateCtrl',
      url: '/partyMediate',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/lawyer/processing_case/partyMediate.js']
          })
        }
      }
    }).state('dashboard.templateManagement', {
      templateUrl: 'views/pages/organize_manage/templateManagement.html',
      controller: 'TemplateManagementCtrl',
      url: '/templateManagement',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/organize/templateManagement.js']
          })
        }
      }
    }).state('dashboard.templateDetail', {
      templateUrl: 'views/pages/organize_manage/template_detail.html',
      controller: 'TemplateDetailCtrl',
      url: '/templateDetail/{orgId}/{orgName}',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/organize/template_detail.js']
          })
        }
      }
    }).state('dashboard.smallCaseTodo', {
      templateUrl: 'views/pages/lawsuit/caseTodoList.html',
      controller: 'CaseTodoCtrl',
      url: '/smallCaseTodo/:loginAccount',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/lawsuit/caseTodoList.js']
          })
        }
      }
    }).state('dashboard.commonCaseTodo', {
      templateUrl: 'views/pages/lawsuit/caseTodoList.html',
      controller: 'CaseTodoCtrl',
      url: '/commonCaseTodo',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/lawsuit/caseTodoList.js','scripts/controllers/mediation_platform/litigation/information.js']
          })
        }
      }
    }).state('dashboard.confirmCaseTodoList', {
      templateUrl: 'views/pages/lawsuit/confirmCaseTodoList.html',
      controller: 'ConfirmCaseTodoCtrl',
      url: '/confirmCaseTodo',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/lawsuit/confirmCaseTodoList.js']
          })
        }
      }
    }).state('dashboard.confirmCaseTodoAdjustList', {
      templateUrl: 'views/pages/lawsuit/confirmCaseTodoList.html',
      controller: 'ConfirmCaseTodoCtrl',
      url: '/confirmCaseTodoAdjustList',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/lawsuit/confirmCaseTodoList.js']
          })
        }
      }
    }).state('dashboard.courtMediation', {
      templateUrl: 'views/pages/lawsuit/courtMediation.html',
      controller: 'SmallLawsuitCtrl',
      url: '/courtMediation/:serialNo',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/lawsuit/courtMediation.js','scripts/directives/history_record/history_record.js']
          })
        }
      }
    }).state('dashboard.courtMediationList', {
      templateUrl: 'views/pages/lawsuit/caseTodoList.html',
      controller: 'CaseTodoCtrl',
      url: '/courtMediationList',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/lawsuit/caseTodoList.js']
          })
        }
      }
    }).state('dashboard.online_sessionList', {
      templateUrl: 'views/pages/lawsuit/caseTodoList.html',
      controller: 'CaseTodoCtrl',
      url: '/online_sessionList',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/lawsuit/caseTodoList.js']
          })
        }
      }
    }).state('mediationPlan', {
      templateUrl: 'views/pages/lawsuit/mediationPlan.html',
      controller: 'MediationPlanCtrl',
      url: '/mediationPlan/:serialNo/:personType',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/lawsuit/mediationPlan.js',
              'scripts/controllers/mediation_platform/litigation/extraAmount.js',
              'scripts/controllers/mediation_platform/litigation/nursingFee.js',
              'scripts/controllers/mediation_platform/litigation/modalLawItems.js',
              'scripts/controllers/mediation_platform/litigation/payMoney.js']
          })
        }
      }
    }).state('dashboard.online_session', {
      templateUrl: 'views/pages/lawsuit/online_session.html',
      controller: 'OnlineSessionCtrl',
      url: '/online_session/:serialNo',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/lawsuit/online_session.js',
              'scripts/directives/history_record/history_record.js',
              'scripts/controllers/mediation_platform/litigation/extraAmount.js',
              'scripts/controllers/mediation_platform/litigation/nursingFee.js',
              'scripts/controllers/mediation_platform/litigation/modalLawItems.js',
              'scripts/controllers/mediation_platform/litigation/payMoney.js']
          })
        }
      }
    }).state('dashboard.confirmCase', {
      templateUrl: 'views/pages/lawsuit/justice_confirm.html',
      controller: 'JusticeConfirmCtrl',
      url: '/confirmCase/:serialNo',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/lawsuit/justice_confirm.js']
          })
        }
      }
    }).state('dashboard.lawyer_case_details', {
      templateUrl: 'views/pages/lawyer/processing_case/lawyer_case_details.html',
      controller: 'lawyerCaseDetailsCtrl',
      url: '/lawyer_case_details',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/lawyer/lawyer_case_details.js']
          })
        }
      }
  }).state('dashboard.payment', {
      templateUrl: 'views/pages/lawyer/processing_case/payment.html',
      controller: 'PaymentCtrl',
      url: '/payment/',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/lawyer/processing_case/payment.js']
          })
        }
      }
    }).state('dashboard.courtList', {
      templateUrl: 'views/pages/organize_manage/courtList.html',
      controller: 'CourtListCtrl',
      url: '/courtList/{orgId}/{orgName}',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/organize/courtList.js']
          })
        }
      }
    }).state('dashboard.allCaseList', {
      templateUrl: 'views/pages/lawyer/allCaseList.html',
      controller: 'AllCaseListCtrl',
      url: '/allCaseList/:pageNo/:overall',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/lawyer/allCaseList.js']
          })
        }
      }
    }).state('dashboard.adjustNeeddTodoList', {
      templateUrl: 'views/pages/lawyer/allCaseList.html',
      controller: 'AllCaseListCtrl',
      url: '/adjustNeeddTodoList',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/lawyer/allCaseList.js']
          })
        }
      }
    }).state('dashboard.sysAllCaseList', {
    templateUrl: 'views/pages/lawyer/allCaseList.html',
      controller: 'AllCaseListCtrl',
      url: '/sysAllCaseList',
      resolve: {
      loadMyFile: function($ocLazyLoad) {
        return $ocLazyLoad.load({
          name: 'sbAdminApp',
          files: ['scripts/controllers/lawyer/allCaseList.js']
        })
      }
    }
  }).state('dashboard.eamilBind', {
        templateUrl: 'views/pages/manage/eamilBind.html',
        controller: 'EamilBindCtrl',
        url: '/eamilBind',
        resolve: {
            loadMyFile: function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'sbAdminApp',
                    files: ['scripts/controllers/manage/eamilBind.js']
                })
            }
        }
    }).state('dashboard.imitateLogin', {
        templateUrl: 'views/pages/manage/imitateLogin.html',
        controller: 'ImitateLoginCtrl',
        url: '/imitateLogin',
        resolve: {
            loadMyFile: function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'sbAdminApp',
                    files: ['scripts/controllers/manage/imitateLogin.js']
                })
            }
        }
    }).state('dashboard.JudicialConfirmationWord', {
      templateUrl: 'views/pages/lawyer/JudicialConfirmationWord.html',
      controller: 'JudicialConfirmationWordCtrl',
      url: '/JudicialConfirmationWord/{serialNo}',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/lawyer/JudicialConfirmationWord.js']
          })
        }
      }
    }).state('dashboard.litigation_payment', {
      templateUrl: 'views/pages/pay/litigation_payment.html',
      controller: 'LitigationPaymentCtrl',
      url: '/litigation_payment/:serialNo/:forward',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['views/pages/pay/litigation_payment.js']
          })
        }
      }
    }).state('appraisal.step1', {
      templateUrl: 'views/pages/appraisal/appraisal_step1.html',
      controller: 'AppraisalStep1Ctrl',
      url: '/step1',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/appraisal/appraisal_step1.js']
          })
        }
      }
    }).state('appraisal.step2', {
      templateUrl: 'views/pages/appraisal/appraisal_step2.html',
      controller: 'AppraisalStep2Ctrl',
      url: '/step2',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/appraisal/appraisal_step2.js']
          })
        }
      }
    }).state('appraisal.step3', {
      templateUrl: 'views/pages/appraisal/appraisal_step3.html',
      controller: 'AppraisalStep3Ctrl',
      url: '/step3',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/appraisal/appraisal_step3.js']
          })
        }
      }
    }).state('appraisal_complete', {
      templateUrl: 'views/pages/appraisal/appraisal_complete.html',
      controller: 'appraisalComplete',
      url: '/complete/:judge',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/appraisal/appraisal_complete.js']
          })
        }
      }
    }).state('appraisal_supComplete', {
      templateUrl: 'views/pages/appraisal/appraisal_supComplete.html',
      controller: 'appraisalSupComplete',
      url: '/supComplete',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/appraisal/appraisal_supComplete.js']
          })
        }
      }
    }).state('appraisal_notice', {
      templateUrl: function(params){
        return 'views/pages/appraisal/'+params.name+'.html'
      },
      controller: 'AppraisalNoticeCtrl',
      url: '/appraisal_notice/:serialNo/:caseType/:orgId/:orgName/:name/:pointId/:pointName/:judge/:loginAccount/:userType',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/appraisal/appraisal_notice.js']
          })
        }
      }
    }).state('dashboard.appraisalList', {
      templateUrl: 'views/pages/organize_manage/appraisalList.html',
      controller: 'AppraisalListCtrl',
      url: '/appraisalList/{orgId}/{orgName}',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/organize/appraisalList.js']
          })
        }
      }
    }).state('dashboard.appraisalTaskList', {
      templateUrl: 'views/pages/appraisal/appraisalTaskList.html',
      controller: 'AppraisalTaskListCtrl',
      url: '/appraisalTaskList',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/appraisal/appraisalTaskList.js']
          })
        }
      }
    }).state('dashboard.appraisalInfoDetail', {
      templateUrl: 'views/pages/appraisal/appraisalInfoDetail.html',
      controller: 'AppraisalInfoDetailCtrl',
      url: '/appraisalInfoDetail/{serialNo}/{appraisalNo}/{appraisalInfoId}',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/appraisal/appraisalInfoDetail.js','scripts/controllers/appraisal/person_detail.js','scripts/controllers/appraisal/cancelAppraisal.js']
          })
        }
      }
    }).state('dashboard.appraisalHandleList', {
      templateUrl: 'views/pages/appraisal/appraisalHandleList.html',
      controller: 'AppraisalHandleListCtrl',
      url: '/appraisalHandleList',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/appraisal/appraisalHandleList.js']
          })
        }
      }
    }).state('dashboard.addEvidenceList', {
      templateUrl: 'views/pages/appraisal/appraisalHandleList.html',
      controller: 'AppraisalHandleListCtrl',
      url: '/addEvidenceList',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/appraisal/appraisalHandleList.js']
          })
        }
      }
    }).state('dashboard.returnEvidenceList', {
      templateUrl: 'views/pages/appraisal/appraisalHandleList.html',
      controller: 'AppraisalHandleListCtrl',
      url: '/returnEvidenceList',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/appraisal/appraisalHandleList.js']
          })
        }
      }
    }).state('dashboard.appraisalSupplement', {
      templateUrl: 'views/pages/appraisal/appraisalHandleList.html',
      controller: 'AppraisalHandleListCtrl',
      url: '/appraisalSupplement',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/appraisal/appraisalHandleList.js']
          })
        }
      }
    }).state('dashboard.appraisalHandleDetail', {
      templateUrl: 'views/pages/appraisal/appraisalHandleDetail.html',
      controller: 'AppraisalHandleDetailCtrl',
      url: '/appraisalHandleDetail/{serialNo}/{appraisalDetailInfoId}/{appraisalNo}/{appraisalInfoId}',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/appraisal/appraisalHandleDetail.js','scripts/controllers/appraisal/person_detail.js','scripts/directives/history_record/history_record.js']
          })
        }
      }
    }).state('view_evidence', {
      templateUrl: 'views/pages/appraisal/view_evidence.html',
      controller: 'viewEvidenceCtrl',
      url: '/view_evidence/{serialNo}/{id}/{supplement}',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/appraisal/view_evidence.js','scripts/directives/head_detail/head_detail.js']
          })
        }
      }
    }).state('dashboard.appraisalQueryList', {
      templateUrl: 'views/pages/appraisal/appraisalTaskList.html',
      controller: 'AppraisalTaskListCtrl',
      url: '/appraisalQueryList',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/appraisal/appraisalTaskList.js']
          })
        }
      }
    }).state('dashboard.appraisalFinish', {
      templateUrl: 'views/pages/appraisal/appraisalTaskList.html',
      controller: 'AppraisalTaskListCtrl',
      url: '/appraisalFinish',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/appraisal/appraisalTaskList.js']
          })
        }
      }
    }).state('dashboard.appraisalQueryDetail', {
      templateUrl: 'views/pages/appraisal/appraisalQueryDetail.html',
      controller: 'AppraisalQueryDetailCtrl',
      url: '/appraisalQueryDetail/{serialNo}/{appraisalNo}/{personType}/{appraisalInfoId}/{url}',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/appraisal/appraisalQueryDetail.js','scripts/controllers/appraisal/person_detail.js','scripts/controllers/appraisal/cancelAppraisal.js']
          })
        }
      }
    }).state('home_page.prejudge', {
      templateUrl: 'views/pages/prejudge/prejudge.html',
      controller: 'PrejudgeCtrl',
      url: '/prejudge',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/prejudge/prejudge.js']
          })
        }
      }
    }).state('home_page.prejudge.step1', {
      templateUrl: 'views/pages/prejudge/prejudge_step1.html',
      controller: 'PrejudgeStep1Ctrl',
      url: '/step1',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/prejudge/prejudge_step1.js','scripts/controllers/mediation_platform/litigation/nursingFee.js']
          })
        }
      }
    }).state('home_page.prejudge.step2', {
      templateUrl: 'views/pages/prejudge/prejudge_step2.html',
      controller: 'PrejudgeStep2Ctrl',
      url: '/step2',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/prejudge/prejudge_step2.js']
          })
        }
      }
    }).state('home_page.prejudge.step3', {
      templateUrl: 'views/pages/prejudge/prejudge_step3.html',
      controller: 'PrejudgeStep3Ctrl',
      url: '/step3',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/prejudge/prejudge_step3.js']
          })
        }
      }
    }).state('home_page.prejudge.history', {
      templateUrl: 'views/pages/prejudge/prejudge_history.html',
      controller: 'PrejudgeHistoryCtrl',
      url: '/history',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/prejudge/prejudge_history.js']
          })
        }
      }
    }).state('dashboard.appraisalReturnList', {
      templateUrl: 'views/pages/appraisal/appraisalReturnList.html',
      controller: 'AppraisalReturnListCtrl',
      url: '/appraisalReturnList',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/appraisal/appraisalReturnList.js']
          })
        }
      }
    }).state('dashboard.appraisalReturnNeedTodo', {
      templateUrl: 'views/pages/appraisal/appraisalReturnList.html',
      controller: 'AppraisalReturnListCtrl',
      url: '/appraisalReturnNeedTodo',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/appraisal/appraisalReturnList.js']
          })
        }
      }
    }).state('dashboard.appraisalReturnDetail', {
      templateUrl: 'views/pages/appraisal/appraisalReturnDetail.html',
      controller: 'AppraisalReturnDetailCtrl',
      url: '/appraisalReturnDetail/{serialNo}/{appraisalDetailInfoId}/{appraisalNo}/{appraisalInfoId}',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/appraisal/appraisalReturnDetail.js','scripts/controllers/appraisal/person_detail.js']
          })
        }
      }
    }).state('dashboard.appraisalProgressList', {
      templateUrl: 'views/pages/appraisal/appraisalTaskList.html',
      controller: 'AppraisalTaskListCtrl',
      url: '/appraisalProgressList',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/appraisal/appraisalTaskList.js']
          })
        }
      }
    }).state('dashboard.appraisalNeedTodo', {
      templateUrl: 'views/pages/appraisal/appraisalTaskList.html',
      controller: 'AppraisalTaskListCtrl',
      url: '/appraisalNeedTodo',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/appraisal/appraisalTaskList.js']
          })
        }
      }
    }).state('dashboard.appraisalToBeSubmit', {
      templateUrl: 'views/pages/appraisal/appraisalTaskList.html',
      controller: 'AppraisalTaskListCtrl',
      url: '/appraisalToBeSubmit',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/appraisal/appraisalTaskList.js']
          })
        }
      }
    }).state('dashboard.appraisalEvaluateList', {
      templateUrl: 'views/pages/appraisal/appraisalTaskList.html',
      controller: 'AppraisalTaskListCtrl',
      url: '/appraisalEvaluateList',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/appraisal/appraisalTaskList.js']
          })
        }
      }
    }).state('dashboard.appraisalEvaluateDetail', {
      templateUrl: 'views/pages/appraisal/appraisalQueryDetail.html',
      controller: 'AppraisalQueryDetailCtrl',
      url: '/appraisalEvaluateDetail/{serialNo}/{appraisalNo}/{personType}/{appraisalInfoId}',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/appraisal/appraisalQueryDetail.js','scripts/controllers/appraisal/person_detail.js','scripts/controllers/appraisal/cancelAppraisal.js']
          })
        }
      }
    }).state('dashboard.helpDocument', {
      templateUrl: 'views/pages/helpCenter/helpDocument.html',
      controller: 'helpDocumentCtrl',
      url: '/helpDocument',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/helpCenter/helpDocument.js']
          })
        }
      }
    }).state('dashboard.vedio', {
      templateUrl: 'views/pages/helpCenter/vedio.html',
      controller: 'vedioCtrl',
      url: '/vedio',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/helpCenter/vedio.js']
          })
        }
      }
    }).state('dashboard.onTheLine', {  //上线情况
      templateUrl: 'views/pages/on_line/onTheLine.html',
      controller: 'onTheLineCtrl',
      url: '/onTheLine',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/on_line/onTheLine.js']
          })
        }
      }
    }).state('dashboard.caseCopy', {  //案件复制
        templateUrl: 'views/pages/caseCopy/caseCopy.html',
        controller: 'CaseCopyCtrl',
        url: '/caseCopy',
        resolve: {
          loadMyFile: function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name: 'sbAdminApp',
              files: ['scripts/controllers/caseCopy/caseCopy.js']
            })
          }
        }
      }).state('dashboard.compensation', {  //赔偿标准
        templateUrl: 'views/pages/compensation/compensation.html',
        controller: 'CompensationCtrl',
        url: '/compensation',
        resolve: {
          loadMyFile: function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name: 'sbAdminApp',
              files: ['scripts/controllers/compensation/compensation.js']
            })
          }
        }
      }).state('dashboard.incomeExpenditure', {  //居民收入支出标准
        templateUrl: 'views/pages/incomeExpenditure/incomeExpenditure.html',
        controller: 'IncomeExpenditureCtrl',
        url: '/incomeExpenditure',
        resolve: {
          loadMyFile: function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name: 'sbAdminApp',
              files: ['scripts/controllers/incomeExpenditure/incomeExpenditure.js']
            })
          }
        }
      }).state('dashboard.onLineConfiguration', {  //上线配置
        templateUrl: 'views/pages/onLineConfiguration/onLineConfiguration.html',
        controller: 'OnLineConfiguration',
        url: '/onLineConfiguration',
        resolve: {
          loadMyFile: function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name: 'sbAdminApp',
              files: ['scripts/controllers/onLineConfiguration/onLineConfiguration.js']
            })
          }
        }
      }).state('dashboard.tradeIncomeForm', {  //行业收入表
        templateUrl: 'views/pages/tradeIncomeForm/tradeIncomeForm.html',
        controller: 'TradeIncomeForm',
        url: '/tradeIncomeForm',
        resolve: {
            loadMyFile: function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'sbAdminApp',
                    files: ['scripts/controllers/tradeIncomeForm/tradeIncomeForm.js', 'scripts/controllers/tradeIncomeForm/tradeIncomePopup.js']
                })
            }
        }
    }).state('dashboard.harmGradeForm', {  //伤残等级表
        templateUrl: 'views/pages/harmGradeForm/harmGradeForm.html',
        controller: 'HarmGradeForm',
        url: '/harmGradeForm',
        resolve: {
            loadMyFile: function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'sbAdminApp',
                    files: ['scripts/controllers/harmGradeForm/harmGradeForm.js', 'scripts/controllers/harmGradeForm/harmGradePopup.js']
                })
            }
        }
    }).state('dashboard.regionalNameRemarkForm', {  //区域名称备注维护
        templateUrl: 'views/pages/regionalNameRemarkForm/regionalNameRemarkForm.html',
        controller: 'regionalNameRemarkForm',
        url: '/regionalNameRemarkForm',
        resolve: {
            loadMyFile: function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'sbAdminApp',
                    files: ['scripts/controllers/regionalNameRemarkForm/regionalNameRemarkForm.js', 'scripts/controllers/regionalNameRemarkForm/regionalNameRemarkFormPopup.js']
                })
            }
        }
    }).state('dashboard.indexImgMaintain', {  //首页图片维护
        templateUrl: 'views/pages/indexImgMaintain/indexImgMaintain.html',
        controller: 'indexImgMaintainCtrl',
        url: '/indexImgMaintain',
        resolve: {
            loadMyFile: function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'sbAdminApp',
                    files: ['scripts/controllers/indexImgMaintain/indexImgMaintain.js','scripts/controllers/indexImgMaintain/TweenMax.min.js']
                })
            }
        }
    }).state('publicSecurity', {//公安事故信息
      templateUrl: 'views/pages/mediation_platform/public_security/publicSecurityInfo.html',
      controller: 'publicSecrityInfoCtrl',
      url: '/publicSecrityInfo/{police}/{adjust}',
      resolve: {
        loadMyDirectives: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/mediation_platform/public_security/publicSecurityInfo.js']
          })
        }
      }
    }).state('downloadSign', {
      templateUrl: 'views/pages/case_detail/preview.html',
      controller: 'downloadSignCtrl',
      url: '/downloadSign/{appraisalNo}',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/appraisal/appraisalEvaluateDetail.js']
          })
        }
      }
    }).state('mailboxlanding', {
      templateUrl: 'views/pages/mailboxlanding.html',
      controller: 'mailboxlandingCtrl',
      url: '/mailboxlanding',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/mailboxlanding.js']
          })
        }
      }
    }).state('weChat.litigant', {//微信公众号-当事人
      templateUrl: 'mobile/views/litigant/m_litigant.html',
      controller: 'M_LitigantCtrl',
      url: '/litigant',
      resolve: {
        loadMyDirectives: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['mobile/scripts/controllers/litigant/m_litigant.js']
          })
        }
      }
    }).state('dashboard.settleCaseList', {//保险公司查看调解列表
      templateUrl: 'views/pages/insurance/settleCaseList.html',
      controller: 'SettleCaseCtrl',
      url: '/settleCaseList',
      resolve: {
        loadMyDirectives: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/insurance/settleCaseList.js']
          })
        }
      }
    }).state('dashboard.secondInstanceLitigantion', {//二审
      templateUrl: 'views/pages/second_instance/litigantion/litigantion.html',
      controller: 'secondInstanceLitigantionCtrl',
      url: '/secondInstanceLitigantion/:id',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/second_instance/litigantion/litigantion.js']
          })
        }
      }
    }).state('dashboard.secondInstanceLitigantionList', {//案件列表（立案登记、立案审批、分案、排期、在线开庭、二审案件查询）
      templateUrl: 'views/pages/second_instance/litigantion/litigantionList.html',
      controller: 'secondInstanceLitigantionListCtrl',
      url: '/secondInstanceLitigantionList?&flag',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/second_instance/litigantion/litigantionList.js']
          })
        }
      }
    }).state('dashboard.secondInstanceOnlineCourt', {//在线开庭
      templateUrl: 'views/pages/second_instance/litigantion/secondInstanceOnlineCourt.html',
      controller: 'secondInstanceOnlineCourtCtrl',
      url: '/secondInstanceOnlineCourt/:id',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/second_instance/litigantion/secondInstanceOnlineCourt.js',
              'scripts/controllers/second_instance/directives/head_detail.js',
              'scripts/controllers/mediation_platform/litigation/extraAmount.js',
              'scripts/controllers/mediation_platform/litigation/nursingFee.js',
              'scripts/controllers/mediation_platform/litigation/modalLawItems.js',
              'scripts/controllers/mediation_platform/litigation/payMoney.js']
          })
        }
      }
    }).state('dashboard.secondPendingComplete', {//10秒后跳转的页面
      templateUrl: 'views/pages/second_instance/litigantion/pending_complete.html',
      controller: 'secondInstanceCompleteCtrl',
      url: '/secondInstanceComplete/:state/:isAgree',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/second_instance/litigantion/pending_complete.js']
          })
        }
      }
    }).state('dashboard.secondInstanceLitigantion.secondStep123', {
      templateUrl: 'views/pages/second_instance/litigantion/litigantion_step123.html',
      controller: 'secondStep123Ctrl',
      url: '/secondStep123/:step',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/second_instance/litigantion/litigantion_step123.js']
          })
        }
      }
    }).state('dashboard.secondInstanceLitigantion.step4', {
      templateUrl: 'views/pages/second_instance/litigantion/litigantion_step4.html',
      controller: 'secondStep4Ctrl',
      url: '/secondStep4/:step',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/second_instance/litigantion/litigantion_step4.js']
          })
        }
      }
    }).state('dashboard.secondInstanceLitigantion.step5', {
      templateUrl: 'views/pages/second_instance/litigantion/litigantion_step5.html',
      controller: 'secondStep5Ctrl',
      url: '/secondStep5/:step',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/second_instance/litigantion/litigantion_step5.js']
          })
        }
      }
    }).state('dashboard.secondInstanceProcess', {  //许昌二审 立案审批
      templateUrl: 'views/pages/second_instance/secondInstanceProcess.html',
      controller: 'secondInstanceProcessCtrl',
      url: '/secondInstanceProcess/:id/:serialNo',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/second_instance/secondInstanceProcess.js','scripts/controllers/second_instance/directives/head_detail.js','scripts/controllers/second_instance/directives/history_record.js']
          })
        }
      }
    }).state('secondInstanceFile', {  //二审查看卷宗
      templateUrl: 'views/pages/second_instance/secondInstanceFile.html',
      controller: 'secondInstanceFileCtrl',
      url: '/secondInstanceFile/:id/:evideceShow',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/second_instance/secondInstanceFile.js','scripts/controllers/second_instance/directives/head_detail.js']
          })
        }
      }
    }).state('secondInstanceEvidence', { //二审查看证据
      templateUrl: 'views/pages/second_instance/secondInstanceEvidence.html',
      controller: 'secondInstanceEvidenceCtrl',
      url: '/secondInstanceEvidence/:serialNo/:id',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/second_instance/secondInstanceEvidence.js','scripts/controllers/second_instance/directives/head_detail.js']
          })
        }
      }
    }).state('dashboard.appraisalLaunchList', {
      templateUrl: 'views/pages/appraisal/appraisalLaunchList.html',
      controller: 'AppraisalLaunchListCtrl',
      url: '/appraisalLaunchList',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/appraisal/appraisalLaunchList.js']
          })
        }
      }
    }).state('dashboard.compensateCalculate', {    //赔偿计算
      templateUrl: 'views/pages/compensateCalculate/compensateCalculate.html',
      controller: 'CompensateCalculateCtrl',
      url: '/compensateCalculate/:id',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/compensateCalculate/compensateCalculate.js']
          })
        }
      }
    }).state('dashboard.compensateCalculateList', {   //赔偿查看
      templateUrl: 'views/pages/compensateCalculate/compensateCalculateList.html',
      controller: 'CompensateCalculateListCtrl',
      url: '/compensateCalculateList',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/compensateCalculate/compensateCalculateList.js']
          })
        }
      }
    }).state('dashboard.compensateCalculate.compensateCalculateDetail', {   //赔偿查看详情
      templateUrl: 'views/pages/compensateCalculate/compensateCalculateDetail.html',
      controller: 'compensateCalculateDetailCtrl',
      url: '/compensateCalculateDetail',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/compensateCalculate/compensateCalculateDetail.js']
          })
        }
      }
    }).state('dashboard.compensateCalculate.compensateCalculateStep12', {   //赔偿计算中间内容
      templateUrl: 'views/pages/compensateCalculate/compensateCalculateStep12.html',
      controller: 'compensateCalculateStep12Ctrl',
      url: '/compensateCalculateStep12/:step',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/compensateCalculate/compensateCalculateStep12.js']
          })
        }
      }
    }).state('dashboard.compensateCalculate.compensateCalculateStep3', {   //赔偿信息步骤3
      templateUrl: 'views/pages/compensateCalculate/compensateCalculateStep3.html',
      controller: 'compensateCalculateStep3Ctrl',
      url: '/compensateCalculateStep3/:step',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/compensateCalculate/compensateCalculateStep3.js',
              'scripts/controllers/mediation_platform/litigation/extraAmount.js',
              'scripts/controllers/mediation_platform/litigation/nursingFee.js',
              'scripts/controllers/mediation_platform/litigation/modalLawItems.js',
              'scripts/controllers/mediation_platform/litigation/payMoney.js']
          })
        }
      }
    }).state('dashboard.compensateCalculate.pendingComplete', {    //结束跳转页面
      templateUrl: 'views/pages/compensateCalculate/pendingComplete.html',
      controller: 'pendingCompleteCtrl',
      url: '/pendingComplete',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/compensateCalculate/pendingComplete.js']
          })
        }
      }
    }).state('rankAppraisal', {    //计算器等级鉴定页面
        templateUrl: 'views/pages/mediation_platform/litigation_mediation/rankAppraisal.html',
        controller: 'rankAppraisalCtrl',
        url: '/rankAppraisal',
        resolve: {
            loadMyFile: function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'sbAdminApp',
                    files: ['scripts/controllers/mediation_platform/litigation/rankAppraisal.js']
                })
            }
        }
    }).state('dashboard.algorithm', {    //算法模型计算
      templateUrl: 'views/pages/algorithm/algorithm.html',
      controller: 'AlgorithmCtrl',
      url: '/algorithm/:id',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/algorithm/algorithm.js']
          })
        }
      }
    }).state('dashboard.algorithm.algorithmStep1', {
      templateUrl: 'views/pages/algorithm/algorithmStep1.html',
      controller: 'AlgorithmStep1Ctrl',
      url: '/algorithmStep1',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/algorithm/algorithmStep1.js']
          })
        }
      }
    }).state('dashboard.algorithm.algorithmStep2', {
        templateUrl: 'views/pages/algorithm/algorithmStep2.html',
        controller: 'AlgorithmStep2Ctrl',
        url: '/algorithmStep2',
        resolve: {
          loadMyFile: function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name: 'sbAdminApp',
              files: ['scripts/controllers/algorithm/algorithmStep2.js']
            })
          }
        }
      }).state('dashboard.algorithm.algorithmStep3', {
      templateUrl: 'views/pages/algorithm/algorithmStep3.html',
      controller: 'AlgorithmStep3Ctrl',
      url: '/algorithmStep3',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/algorithm/algorithmStep3.js']
          })
        }
      }
    }).state('dashboard.algorithm.algorithmStep4', {
      templateUrl: 'views/pages/algorithm/algorithmStep4.html',
      controller: 'AlgorithmStep4Ctrl',
      url: '/algorithmStep4/:alInfo',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/algorithm/algorithmStep4.js']
          })
        }
      }
    }).state('dashboard.algorithmStep5', {
        templateUrl: 'views/pages/algorithm/algorithmStep5.html',
        controller: 'AlgorithmStep5Ctrl',
        url: '/algorithmStep5/:id/:serialNo/:alInfo/:risktypelist/:fage/:claimantid',
        resolve: {
          loadMyFile: function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name: 'sbAdminApp',
              files: ['scripts/controllers/algorithm/algorithmStep5.js']
            })
          }
        }
      }).state('dashboard.algorithmList', {    //算法模型查询
      templateUrl: 'views/pages/algorithm/algorithmList.html',
      controller: 'AlgorithmListCtrl',
      url: '/algorithmList',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/algorithm/algorithmList.js']
          })
        }
      }
    }).state('dashboard.policeList', {
      templateUrl: 'views/pages/police/policeList.html',
      controller: 'PoliceListCtrl',
      url: '/policeList',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/police/policeList.js', 'scripts/controllers/police/lawCaseDetail.js']
          })
        }
      }
    }).state('policeLawCaseDetail', {//公安事故信息
      templateUrl: 'views/pages/police/lawCaseDetail.html',
      controller: 'placeLawCaseDetail',
      url: '/policeLawCaseDetail/{police}/:isShowBtn',
      resolve: {
        loadMyDirectives: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/police/lawCaseDetail.js']
          })
        }
      }
    }).state('dashboard.supplementPoliceLawCase', {//补充公安事故信息
      templateUrl: 'views/pages/police/supplementPoliceLawCase.html',
      controller: 'supplementPoliceLawCaseCtrl',
      url: '/supplementPoliceLawCase/:policeId',
      resolve: {
        loadMyDirectives: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/police/supplementPoliceLawCase.js']
          })
        }
      }
    }).state('dashboard.policeHistoryList', {
      templateUrl: 'views/pages/police/policeHistoryList.html',
      controller: 'PoliceHistoryListCtrl',
      url: '/policeHistoryList',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/police/policeHistoryList.js']
          })
        }
      }
    }).state('dashboard.checkPolice', {
      templateUrl: 'views/pages/police/checkPolice.html',
      controller: 'checkPoliceCtrl',
      url: '/checkPolice/:policeId',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/police/checkPolice.js']
          })
        }
      }
    }).state('AIOHomePage', {
      templateUrl: 'views/pages/AIO/AIOHomePage.html',
      controller: 'AIOHomePageCtrl',
      url: '/AIOHomePage',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/AIO/AIOHomePage.js', 'scripts/controllers/AIO/AIOHeader.js']
          })
        }
      }
    }).state('AIOInputIdNo', {
      templateUrl: 'views/pages/AIO/AIOInputIdNo.html',
      controller: 'AIOInputIdNoCtrl',
      url: '/AIOInputIdNo',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/AIO/AIOInputIdNo.js', 'scripts/controllers/AIO/AIOHeader.js']
          })
        }
      }
    }).state('AIOScanIdNo', {
      templateUrl: 'views/pages/AIO/AIOScanIdNo.html',
      controller: 'AIOScanIdNoCtrl',
      url: '/AIOScanIdNo/:flag',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/AIO/AIOScanIdNo.js', 'scripts/controllers/AIO/AIOHeader.js']
          })
        }
      }
    }).state('AIOCaseList', {
      templateUrl: 'views/pages/AIO/AIOCaseList.html',
      controller: 'AIOCaseListCtrl',
      url: '/AIOCaseList/:idNo/:flag',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/AIO/AIOCaseList.js', 'scripts/controllers/AIO/AIOHeader.js']
          })
        }
      }
    }).state('AIOCaseDetail', {
      templateUrl: 'views/pages/AIO/AIOCaseDetail.html',
      controller: 'AIOCaseDetailCtrl',
      url: '/AIOCaseDetail/:id/:personCard/:oneCase/:flag',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/AIO/AIOCaseDetail.js', 'scripts/controllers/AIO/AIOHeader.js']
          })
        }
      }
    }).state('AIOPic', {
      templateUrl: 'views/pages/AIO/AIOPic.html',
      controller: 'AIOPicCtrl',
      url: '/AIOPic/:appraisalId',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/AIO/AIOPic.js', 'scripts/controllers/AIO/AIOHeader.js']
          })
        }
      }
    }).state('AIOCourtIndex', {   //一体机法院版
      templateUrl: 'views/pages/AIOCourt/AIOCourtIndex.html',
      controller: 'AIOCourtIndexCtrl',
      url: '/AIOCourtIndex',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/AIOCourt/AIOCourtIndex.js']
          })
        }
      }
    }).state('home_page.prejudge_new', {   //一体机法院版赔付试算
      templateUrl: 'views/pages/AIOCourt/prejudge_new.html',
      controller: 'prejudgeNewCtrl',
      url: '/prejudge_new',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/AIOCourt/prejudge_new.js','scripts/controllers/AIOCourt/AIOCourtSetpLeft.js']
          })
        }
      }
    }).state('home_page.prejudge_new.AIOCourtSetp1', {   //pc赔付试算 setp1
      templateUrl: 'views/pages/AIOCourt/AIOCourtSetp1.html',
      controller: 'AIOCourtSetp1Ctrl',
      url: '/AIOCourtSetp1',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/AIOCourt/AIOCourtSetp1.js','scripts/controllers/AIOCourt/AIOCourtSetpLeft.js']
          })
        }
      }
    }).state('home_page.prejudge_new.AIOCourtSetp2', {   //pc赔付试算 setp2
      templateUrl: 'views/pages/AIOCourt/AIOCourtSetp2.html',
      controller: 'AIOCourtSetp2Ctrl',
      url: '/AIOCourtSetp2',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/AIOCourt/AIOCourtSetp2.js']
          })
        }
      }
    }).state('home_page.prejudge_new.AIOCourtSetp3', {   //pc赔付试算 setp3
      templateUrl: 'views/pages/AIOCourt/AIOCourtSetp3.html',
      controller: 'AIOCourtSetp3Ctrl',
      url: '/AIOCourtSetp3',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/AIOCourt/AIOCourtSetp3.js']
          })
        }
      }
    }).state('home_page.prejudge_new.AIOCourtSetp4', {   //pc赔付试算 setp4
      templateUrl: 'views/pages/AIOCourt/AIOCourtSetp4.html',
      controller: 'AIOCourtSetp4Ctrl',
      url: '/AIOCourtSetp4',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/AIOCourt/AIOCourtSetp4.js']
          })
        }
      }
    }).state('home_page.prejudge_new.AIOCourtSetp5', {   //pc赔付试算 setp5
      templateUrl: 'views/pages/AIOCourt/AIOCourtSetp5.html',
      controller: 'AIOCourtSetp5Ctrl',
      url: '/AIOCourtSetp5',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/AIOCourt/AIOCourtSetp5.js']
          })
        }
      }
    }).state('AIOCourtSetpBox', {   //一体机法院版赔付试算
      templateUrl: 'views/pages/AIOCourt/AIOCourtSetpBox.html',
      controller: 'AIOCourtSetpBoxCtrl',
      url: '/AIOCourtSetpBox',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/AIOCourt/AIOCourtSetpBox.js','scripts/controllers/AIOCourt/AIOCourtSetpLeft.js']
          })
        }
      }
    }).state('AIOCourtSetpBox.AIOCourtSetp1', {   //一体机法院版赔付试算 setp1
      templateUrl: 'views/pages/AIOCourt/AIOCourtSetp1.html',
      controller: 'AIOCourtSetp1Ctrl',
      url: '/AIOCourtSetp1',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/AIOCourt/AIOCourtSetp1.js']
          })
        }
      }
    }).state('AIOCourtSetpBox.AIOCourtSetp2', {   //一体机法院版赔付试算 setp2
      templateUrl: 'views/pages/AIOCourt/AIOCourtSetp2.html',
      controller: 'AIOCourtSetp2Ctrl',
      url: '/AIOCourtSetp2',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/AIOCourt/AIOCourtSetp2.js']
          })
        }
      }
    }).state('AIOCourtSetpBox.AIOCourtSetp3', {   //一体机法院版赔付试算 setp3
      templateUrl: 'views/pages/AIOCourt/AIOCourtSetp3.html',
      controller: 'AIOCourtSetp3Ctrl',
      url: '/AIOCourtSetp3',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/AIOCourt/AIOCourtSetp3.js']
          })
        }
      }
    }).state('AIOCourtSetpBox.AIOCourtSetp4', {   //一体机法院版赔付试算 setp4
      templateUrl: 'views/pages/AIOCourt/AIOCourtSetp4.html',
      controller: 'AIOCourtSetp4Ctrl',
      url: '/AIOCourtSetp4',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/AIOCourt/AIOCourtSetp4.js']
          })
        }
      }
    }).state('AIOCourtSetpBox.AIOCourtSetp5', {   //一体机法院版赔付试算 setp5
      templateUrl: 'views/pages/AIOCourt/AIOCourtSetp5.html',
      controller: 'AIOCourtSetp5Ctrl',
      url: '/AIOCourtSetp5',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/AIOCourt/AIOCourtSetp5.js']
          })
        }
      }
    }).state('dashboard.policeDistinguish', {
        templateUrl: 'views/pages/police/policeDistinguish.html',
        controller: 'policeDistinguishCtrl',
        url: '/policeDistinguish/:policeId',
        resolve: {
            loadMyFile: function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'sbAdminApp',
                    files: ['scripts/controllers/police/policeDistinguish.js']
                })
            }
        }
    }).state('dashboard.interfaceReturnRecord', {  //案件复制
        templateUrl: 'views/pages/caseCopy/interfaceReturnRecord.html',
        controller: 'InterfaceReturnRecordCtrl',
        url: '/interfaceReturnRecord',
        resolve: {
            loadMyFile: function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'sbAdminApp',
                    files: ['scripts/controllers/caseCopy/interfaceReturnRecord.js', 'scripts/controllers/caseCopy/interfaceMessage.js']
                })
            }
        }
    }).state('dashboard.domainMaintain', {  //域名维护
      templateUrl: 'views/pages/domainMaintain/domainMaintain.html',
      controller: 'domainMaintainCtrl',
      url: '/domainMaintain',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/domainMaintain/domainMaintain.js']
          })
        }
      }
    }).state('dashboard.policeInfoList', {  //交警案件列表（5.22修改）
      templateUrl: 'views/pages/policeInfo/policeInfoList.html',
      controller: 'policeInfoListCtrl',
      url: '/policeInfoList/:flag',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/policeInfo/policeInfoList.js']
          })
        }
      }
    }).state('dashboard.policeInfo', {  //交警案件详细父页面（五个菜单共同父级）
      templateUrl: 'views/pages/policeInfo/policeInfo.html',
      controller: 'policeInfoCtrl',
      url: '/policeInfo/:flag/:id',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/policeInfo/policeInfo.js']
          })
        }
      }
    }).state('dashboard.policeInfo.caseInfoRegister', {  //交警案件详细页面 - 含四部分
      templateUrl: 'views/pages/policeInfo/caseInfoRegister.html',
      controller: 'caseInfoRegisterCtrl',
      url: '/policeInfo/caseInfoRegister',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/policeInfo/caseInfoRegister.js']
          })
        }
      }
    }).state('dashboard.policeInfo.inspectReported', {  //检验鉴定填报页面
      templateUrl: 'views/pages/policeInfo/inspectReported.html',
      controller: 'inspectReportedCtrl',
      url: '/policeInfo/inspectReported',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/policeInfo/inspectReported.js']
          })
        }
      }
    }).state('dashboard.policeInfo.insuranceReported', {  //保险信息填报页面
      templateUrl: 'views/pages/policeInfo/insuranceReported.html',
      controller: 'insuranceReportedCtrl',
      url: '/policeInfo/insuranceReported',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/policeInfo/insuranceReported.js']
          })
        }
      }
    }).state('dashboard.policeInfo.healthInfoFill', {  //卫生部信息填报&&卫生部信息补录
      templateUrl: 'views/pages/policeInfo/healthInfoFill.html',
      controller: 'healthInfoFillCtrl',
      url: '/policeInfo/healthInfoFill',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/policeInfo/healthInfoFill.js']
          })
        }
      }
    }).state('dashboard.policeInfo.injuryInfoFill', {  //工伤医保信息填报&&工伤医保信息补录
      templateUrl: 'views/pages/policeInfo/injuryInfoFill.html',
      controller: 'injuryInfoFillCtrl',
      url: '/policeInfo/injuryInfoFill',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/policeInfo/injuryInfoFill.js']
          })
        }
      }
    }).state('healthInfoFill', {  //卫生部信息填报&&卫生部信息补录 - 关联查看
      templateUrl: 'views/pages/policeInfo/healthInfoFill.html',
      controller: 'healthInfoFillCtrl',
      url: '/policeInfo/healthInfoFill/:userId/:tableName',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/policeInfo/healthInfoFill.js']
          })
        }
      }
    }).state('injuryInfoFill', {  //工伤医保信息填报&&工伤医保信息补录 - 关联查看
      templateUrl: 'views/pages/policeInfo/injuryInfoFill.html',
      controller: 'injuryInfoFillCtrl',
      url: '/policeInfo/injuryInfoFill/:userId/:tableName',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/policeInfo/injuryInfoFill.js']
          })
        }
      }
    }).state('dashboard.policeSysOrgMaintain', {  //公安交警组织维护
      templateUrl: 'views/pages/organize_manage/policeSysOrgList.html',
      controller: 'PoliceSysOrgListCtrl',
      url: '/policeSysOrgMaintain',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/organize/policeSysOrgList.js']
          })
        }
      }
    }).state('dashboard.policeSysOrgRelation', {
      templateUrl: 'views/pages/organize_manage/policeSysOrgRelation.html',
      controller: 'policeSysOrgRelationCtrl',
      url: '/policeSysOrgRelation/{orgId}/{orgName}/{type}',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/organize/policeSysOrgRelation.js']
          })
        }
      }
    }).state('dashboard.personMediation', {
        templateUrl: 'views/pages/person/mediation.html',
        controller: 'personMediationCtrl',
        url: '/personMediation/:id',
        resolve: {
            loadMyFile: function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'sbAdminApp',
                    files: ['scripts/controllers/person/mediation.js']
                })
            }
        }
    }).state('dashboard.personMediation.step12', {
        templateUrl: 'views/pages/person/step12.html',
        controller: 'step12Ctrl',
        url: '/step12/:step',
        resolve: {
            loadMyFile: function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'sbAdminApp',
                    files: ['scripts/controllers/person/step12.js']
                })
            }
        }
    }).state('dashboard.personMediation.step3', {
        templateUrl: 'views/pages/person/step3.html',
        controller: 'step3Ctrl',
        url: '/step3',
        resolve: {
            loadMyFile: function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'sbAdminApp',
                    files: ['scripts/controllers/person/step3.js']
                })
            }
        }
    }).state('dashboard.personMediation.step4', {
        templateUrl: 'views/pages/person/step4.html',
        controller: 'step4Ctrl',
        url: '/step4',
        resolve: {
            loadMyFile: function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'sbAdminApp',
                    files: ['scripts/controllers/person/step4.js']
                })
            }
        }
    }).state('dashboard.personMediation.step5', {
        templateUrl: 'views/pages/person/step5.html',
        controller: 'step5Ctrl',
        url: '/step5',
        resolve: {
            loadMyFile: function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'sbAdminApp',
                    files: ['scripts/controllers/person/step5.js',
                        'scripts/controllers/mediation_platform/litigation/nursingFee.js',
                        'scripts/controllers/mediation_platform/litigation/modalLawItems.js']
                })
            }
        }
    }).state('dashboard.adjustExamineList', {
        templateUrl: 'views/pages/person/adjustExamineList.html',
        controller: 'adjustExamineListCtrl',
        url: '/adjustExamineList',
        resolve: {
            loadMyFile: function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'sbAdminApp',
                    files: ['scripts/controllers/person/adjustExamineList.js']
                })
            }
        }
    }).state('dashboard.adjustExamineDetail', {
        templateUrl: 'views/pages/person/adjustExamineDetail.html',
        controller: 'adjustExamineDetailCtrl',
        url: '/adjustExamineDetail/:adjustId/:name',
        resolve: {
            loadMyFile: function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'sbAdminApp',
                    files: ['scripts/controllers/person/adjustExamineDetail.js']
                })
            }
        }
    }).state('dashboard.readNotice', {
        templateUrl: 'views/pages/person/readNotice.html',
        controller: 'readNoticeCtrl',
        url: '/readNotice',
        resolve: {
            loadMyFile: function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'sbAdminApp',
                    files: ['scripts/controllers/person/readNotice.js']
                })
            }
        }
    }).state('dashboard.noAdjustList', {
        templateUrl: 'views/pages/lawyer/noAdjustList.html',
        controller: 'noAdjustListCtrl',
        url: '/noAdjustList',
        resolve: {
            loadMyFile: function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'sbAdminApp',
                    files: ['scripts/controllers/lawyer/noAdjustList.js']
                })
            }
        }
    }).state('dashboard.caseStatisticsList', {
        templateUrl: 'views/pages/lawyer/caseStatisticsList.html',
        controller: 'CaseStatisticsListCtrl',
        url: '/caseStatisticsList',
        resolve: {
            loadMyFile: function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'sbAdminApp',
                    files: ['scripts/controllers/lawyer/caseStatisticsList.js']
                })
            }
        }
    }).state('dashboard.loginStatisticsList', { //登录情况统计
      templateUrl: 'views/pages/lawyer/loginStatisticsList.html',
      controller: 'loginStatisticsListCtrl',
      url: '/loginStatisticsList',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/lawyer/loginStatisticsList.js']
          })
        }
      }
    }).state('dashboard.loginStatisticsDetail', {
      templateUrl: 'views/pages/lawyer/loginStatisticsDetail.html',
      controller: 'loginStatisticsDetailCtrl',
      url: '/loginStatisticsDetail/:userId/:userName/:loginStatisticsVO',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/lawyer/loginStatisticsDetail.js']
          })
        }
      }
    }).state('dashboard.deleteCaseApplyForList', {
      templateUrl: 'views/pages/lawyer/deleteCaseApplyForList.html',
      controller: 'deleteCaseApplyForListCtrl',
      url: '/deleteCaseApplyFor',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/lawyer/deleteCaseApplyForList.js']
          })
        }
      }
    }).state('dashboard.insuranceCompanyMaintain', {  //保险公司维护
      templateUrl: 'views/pages/organize_manage/insuranceCompanyMaintain.html',
      controller: 'insuranceCompanyMaintainCtrl',
      url: '/insuranceCompanyMaintain',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/organize/insuranceCompanyMaintain.js']
          })
        }
      }
    }).state('dashboard.deleteCaseAffirm', {  //案件删除
      templateUrl: 'views/pages/organize_manage/deleteCaseAffirm.html',
      controller: 'deleteCaseAffirmCtrl',
      url: '/deleteCaseAffirm',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/organize/deleteCaseAffirm.js']
          })
        }
      }
    }).state('dashboard.lawItems', {  //法律法规维护
      templateUrl: 'views/pages/lawItems/lawItems.html',
      controller: 'LawItemsCtrl',
      url: '/lawItems',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/lawItems/lawItems.js']
          })
        }
      }
    }).state('queryInsuranceList', {
      templateUrl: 'views/pages/mediation_platform/litigation_mediation/queryInsuranceList.html',
      controller: 'queryInsuranceListCtrl',
      url: '/queryInsuranceList/:companyName/:parentId/:region',
      resolve: {
        loadMyFile: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/mediation_platform/litigation/queryInsuranceList.js']
          })
        }
      }
    }).state('bjLogin', {
        templateUrl: 'views/pages/bj/bjLogin.html',
        controller: 'bjLoginCtrl',
        url: '/bjLogin/:serialNo',
        resolve: {
            loadMyDirectives: function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'sbAdminApp',
                    files: ['scripts/controllers/bj/bjLogin.js']
                })
            }
        }
    }).state('functionStatistics', {
        templateUrl: 'views/pages/statisticsJilin/functionStatistics.html',
        controller: 'functionStatistics',
        url: '/functionStatistics',
        resolve: {
            loadMyDirectives: function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'sbAdminApp',
                    files: ['scripts/controllers/statisticsJilin/functionStatistics.js']
                })
            }
        }
    }).state('distributionAnalysis', {
        templateUrl: 'views/pages/statisticsJilin/distributionAnalysis.html',
        controller: 'distributionAnalysis',
        url: '/distributionAnalysis',
        resolve: {
            loadMyDirectives: function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'sbAdminApp',
                    files: ['scripts/controllers/statisticsJilin/distributionAnalysis.js']
                })
            }
        }
    }).state('convenienceService', {
      templateUrl: 'views/pages/convenienceServiceJilin/convenienceServiceJilin.html',
      controller: 'ConvenienceServiceJilin',
      url: '/convenienceServiceJilin',
      resolve: {
        loadMyDirectives: function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'sbAdminApp',
            files: ['scripts/controllers/convenienceServiceJilin/convenienceServiceJilin.js']
          })
        }
      }
    })
  }
]);







angular.module('sbAdminApp').run(function($rootScope, $timeout, $http, $state, toaster, AdjustConfig) {




    $rootScope.$on('user2Root', function(event) {
    $rootScope.$broadcast('user2Child');
    watchSession();
  });

  //根据域名获取网页头部信息
  function queryDomainName() {
    $rootScope.domainName = window.location.href.split('/')[2].split('.')[0];
    //域名对应名称映射
    var hrefName = '道交一体化平台';
    var hrefMap = {
      'jilin': '吉林省'+hrefName,
      'gdfy': '广东省'+hrefName,
      'hainan': '海南省'+hrefName,
      'chongqing': '重庆市'+hrefName,
      'jttj': '全国法院道路交通事故损害赔偿纠纷诉前调解平台'
    };
    $rootScope.domainName = hrefMap[$rootScope.domainName] || hrefName;

    /*$http({
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      url: '/lawProject/system/findContentByDomain',
      data: {domainName: domainName}
    }).success(function(data) {
      console.log(data)
      //if(data) $rootScope.domainName = data.result.content;
      console.log($rootScope.domainName)
    })*/

  }
  queryDomainName();

  //创建toaster函数
  $rootScope.toaster = function(type, title, body) {
    toaster.clear(toastInstance);
    var toastInstance = toaster.pop({type: type, title: title, body: body});
  };

  var to;
  var sessionInterval = 1801000; // default 30min session invalid.
  function isSessionAlive() {
    $http({
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      url: '/lawProject/login/isSessionAlive'
    }).success(function(data) {
      // console.log(data);
      if (data.result) to = $timeout(isSessionAlive, sessionInterval);
      //else $state.go('login');
      else $state.go("home_page.homeContent");
    })
  };

  function watchSession() {
    if (to) $timeout.cancel(to);
    to = $timeout(isSessionAlive, sessionInterval);
  }

  $rootScope.$on("$destroy", function() {
    if (to) {
      $timeout.cancel(to);
    }
  });

  $rootScope.bigPictureUrl = AdjustConfig.pictureConstant.bigPictureUrl;

  $rootScope.zoomImageSrc = null;
  $rootScope.globalImgList = [];
  //查看大图并且放大缩小
  $rootScope.zoomImage = function (src,event) {
    $rootScope.zoomImageSrc = src;
    // $rootScope.$apply();
    var image = document.getElementById("imageView");

    //图片列表
    if(event){
      $rootScope.globalImgList = event.currentTarget.attributes.arr && JSON.parse(event.currentTarget.attributes.arr.value).filter(function (val) {
            val.picture = $rootScope.bigPictureUrl + val.picture;
            return true
          });
    }
    setTimeout(function () {
      if($rootScope.isIe9){
        computeTop(src)
      }else{
        $rootScope.globalImgList.length && $rootScope.globalImgList.forEach(function (val,index) {
          if(val.picture.indexOf(src) != -1){
            image = document.getElementById("imageView"+ index);
          }
        })
        $.openPhotoGallery(image,src);
      }
    },500);
  }
  //放大
  $rootScope.zoomImageHide = function (e) {
    $rootScope.zoomImageSrc = '';
    var mask = document.getElementsByClassName('zoomImageMask')[0];
    mask.style.display = 'none';
    $rootScope.globalImgList = [];
    pop(e);
  }
  //判断是否是ie9以下的浏览器
  function isIe9Veison() {
    if(IEVersion()<9 && IEVersion() != -1){
      $rootScope.isIe9 =  true
    }else{
      $rootScope.isIe9 = false
    }

  }
  isIe9Veison();
});



