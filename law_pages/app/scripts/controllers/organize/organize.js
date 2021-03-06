'use strict';
var app = angular.module('sbAdminApp');

app.filter('orgType2Const', function(DictionaryConfig) {
  return function(id) {
    var result = _.find(DictionaryConfig.orgTypeConstant, {
      id: id
    });
    return result && result.text || ""
  }
});

app.filter('roleType2Text', function() {
  return function(id, data) {
    var result = "" + id && _.find(data, {
      id: id
    });
    return result && result.name || " ";
  }
});



app.filter('filterList', function() {
    return function( dataList,selectNode) {
      if(dataList){
          return dataList.filter(function(val){
              //return val.id  && selectNode && selectNode.id && val.id.indexOf(selectNode.id + '.') === 0 && val.id;
              return val.id && selectNode && selectNode.id && val.parent === selectNode.id;
          });
      }
    }
});



app.filter('deptId2Text', function() {
  return function(val, data) {
    var id = "";
    var result = "";
    val && val.split('.').forEach(function(v, i) {
      if (i == 0) id += v
      else {
        id += "." + v
        result += " | "
      }
      var temp = _.find(data, {
        id: id
      });
      if (temp && temp.text)
        result += temp.text;
    })
    return result;
  }
});

app.filter('certType2Text', function() {
  return function(id, data) {
    return id && _.find(data, {
      id: id
    }).value || " ";
  }
});

app.filter('userType2Text', function() {
  return function(id, data) {
    return id && _.find(data, {
      id: id
    }).value || " ";
  }
});

app.filter('getRoleList', function() {
  return function(id, data) {
    if (id) {
      var userId = id.substr(id.lastIndexOf('.') + 1)
      return data.filter(function(v) {
        return v.id.substr(v.id.lastIndexOf('.') + 1) == userId;
      })
    } else {
      return [];
    }
  }
});

app.filter('int2BoolText', function() {
  return function(id) {
    return id && id == "1" && "是" || "否";
  }
});

app.controller('organizeCtrl', function($scope, $filter, $http, $log, $modal, $timeout, LoginConfig, LoginService, DictionaryConfig, Upload, AdminConstant) {
  $scope.getOrgList = LoginService.getOrgList;
  $scope.getDeptList = LoginService.getDeptList;
  $scope.getUserList = LoginService.getUserList;
  $scope.queryAllRole = LoginService.queryAllRole;
  $scope.queryDataPermission = LoginService.queryDataPermission;
  $scope.removeDataPermission = LoginService.removeUserDataPermission;
  $scope.searchInputVale=''; //搜索内容
  $scope.deleteSysOrg = LoginService.deleteSysOrg;
  //删除部门Service
  $scope.removeDepartment = LoginService.removeDepartment;
  //删除人员Service
  $scope.removePerson = LoginService.removePerson;
  $scope.removeUserDeptRole = LoginService.removeUserDeptRole;
  //定义用户类型
  $scope.userTypeConstant = DictionaryConfig.userTypeConstant;
  //取得法院岗位类型
  $scope.postTypeList = DictionaryConfig.postTypeList;
  //取得鉴定机构岗位类型
  $scope.appraisalPostTypeList = DictionaryConfig.appraisalPostTypeList;
  
  $scope.dataPermissionList = [];

  //填充区域信息
  $scope.adminRegion = AdminConstant.administrationRegions;

  function init(){
    $scope.user  = LoginService.user;
    //如果登录名不是admin用户不显示删除组织按钮
    if($scope.user.sysUser.loginAccount == 'admin'){
      $scope.delOrgFlag = "1";
    }
  }
  //获取用户
  if(LoginService.user.userPermissions){
    init();
  }
  $scope.$on('user2Child', function(event){
    init();
  });

  //管理树
  $scope.treeConfig = {
    core: {
      multiple: false,
      animation: true,
      error: function(error) {
        $log.error('treeCtrl: error from js tree - ' + angular.toJson(error));
      },
      check_callback: true,
      worker: true
    },
    types: {
      "default": {
        icon: 'iconfont icon-yonghu tree-icon '
      },
      top: {
        icon: 'iconfont icon-jianzhu tree-icon'
      },
      dept: {
        icon: 'iconfont icon-zuzhi tree-icon'
      }
    },
    version: 1,
    plugins: ['types']
  };

  var model2Tree = function(val) {
    if(val.id) {

      val.id = val.id.toString();
      var last_index = val.id.lastIndexOf('.');
      if (last_index == -1) {
          last_index = val.id.indexOf('#');
          if(last_index != -1){
              val.parent = '#';
              val.type = 'top';
          }else{
              //表示是法官组织
              if(val.category == '#01'){
                if(val.parentId){

                    var parentIndex = _.indexOf($scope.orgIdList,val.parentId);
                    if(parentIndex == -1){
                        val.parent = val.category;
                        val.type = 'dept';
                    }else{
                        val.parent = val.parentId;
                        val.type = 'dept';
                    }


                }else{
                    val.parent = val.category;
                    val.type = 'dept';
                }
              }else{
                  val.parent = val.category;
                  val.type = 'dept';
              }
          }
      } else {
          val.parent = last_index != -1 ? val.id.substring(0, last_index) : "#";
          if (last_index == -1)
              val.type = 'dept'
          else
              val.type = /^\d+$/.test(val.id.substring(last_index + 1)) ? 'default' : 'dept';
      }

      val.state = {
          opened: false
      };
    }
  };

  // watch the searchbox
  $scope.$watch('searchInput', function(newVal, oldVal) {
    if ($scope.searchInputTimeout) {
      $timeout.cancel($scope.searchInputTimeout)
      $scope.searchInputTimeout = null
    }
    $scope.searchInputTimeout = $timeout(function() {
      if (newVal) {
        var uniqueSet = {}
        $scope.showData = []
        $scope.originalData.filter(function(v) {
          return v.text.indexOf(newVal) != -1;
        }).forEach(function(v) {
          function recursivePush(val) {
            if (val && !uniqueSet[val.id]) {
              uniqueSet[val.id] = true;
              val.state.opened = true;
              $scope.showData.push(val);
              recursivePush(_.findWhere($scope.originalData, {
                id: val.parent+""
              }))
            }
          }
          recursivePush(v);
        });

      } else if (newVal == "") {
        $scope.showData = $scope.originalData;

      } else
        return;
      $scope.treeConfig.version++;
    }, 1000);
  });

  // Load all data from backend.
  $scope.refreshAllData = function() {
    //能查到则从service获取
    if(LoginService.user.userPermissions){
      $scope.user  = LoginService.user;
      $scope.refreshAndHandleAllData();
    }
    //不能查到从消息中获取
    $scope.$on('user2Child', function(event){
      $scope.user  = LoginService.user;
      $scope.refreshAndHandleAllData();
    });

  };


  //根据orgId递归获得所有的子组织
  function queryAllChildNodeList(currentOrg){

      $scope.listArray.push(currentOrg);
      $scope.originalOrgList.filter(function(val){
          return val.parentId == currentOrg.id
      }).forEach(function(val){
          queryAllChildNodeList(val);
      });
  }

  function queryParentNodeList(currentOrg){

      $scope.parentlistArray.push(currentOrg);
      $scope.originalOrgList.filter(function(val){
          return val.id == currentOrg.parentId
      }).forEach(function(val){
          queryParentNodeList(val);
      });

  }

  //获取所有的组织列表
  $scope.refreshAndHandleAllData = function(){

      //查询所有的组织机构
      $scope.getOrgList().success(function(orgData) {
        if (orgData) {
          //得到组织机构的集合
          $scope.originalOrgList = orgData.result;
          //将组织中的拓展字段转化成json对象
          $scope.originalOrgList.forEach(function(v) {
              try {
                  if (v.extPro) v.extPro = JSON.parse(v.extPro);
                  //如果是法官组织的话 ，他的
                  /*if(v.category == '#01'){
                      _.find($scope.originalOrgList,{});
                  }*/

              }catch (e){
                  console.log(v)
              }
          });

            //取得所有的组织ID放入到map中
            var orgIds = $scope.originalOrgList.map(function(v) {
                return v.id;
            });

            $scope.orgIdList = orgIds;



          //表示不是超级管理员用户，取得当前用户所在组织以及其所有自组织节点
          if($scope.delOrgFlag != "1"){
              $scope.listArray = [];
              $scope.parentlistArray = [];
              $scope.user.sysUser.userDepartList.forEach(function(k){
                  //根据当前id查询所有的子组织
                  var currentOrg = _.find($scope.originalOrgList,{id:k.orgId})
                  queryAllChildNodeList(currentOrg);
                  queryParentNodeList(currentOrg);
              });
              $scope.originalOrgList = _.union($scope.listArray,$scope.parentlistArray);
              orgIds = $scope.listArray.map(function(v) {
                  return v.id;
              });

          }

          $scope.getDeptList({
            "orgList": orgIds
          }).success(function(deptData) {
            //请求成功
            if(deptData.code == LoginConfig.commonConStant.SUCCESS){
              $scope.originalDeptList = deptData.result;
              //表示不是超级管理员 暂时不控制
              $scope.originalDeptList.forEach(function(v) {
                try {
                    if (v.extPro) v.extPro = JSON.parse(v.extPro)
                }catch (e){
                  console.log(v)
                }
              });

              $scope.originalData = DictionaryConfig.orgTypeConstant;
              $scope.getUserList({
                "orgList": orgIds
              }).success(function(userData) {
                //请求成功
                if(userData.code == LoginConfig.commonConStant.SUCCESS){
                  $scope.originalUserList = userData.result;
                  if($scope.originalUserList){
                      $scope.originalUserList.forEach(function(v) {
                          if (v.extPro) v.extPro = JSON.parse(v.extPro)
                      });

                      //表示非管理员用户
                      if($scope.delOrgFlag != "1"){
                        $scope.orgTypeConstant = DictionaryConfig.orgTypeConstant.filter(function(val){
                          return val.id == '#01' || val.id == "#02";
                        });
                      }else{
                          //管理员用户
                          $scope.orgTypeConstant = DictionaryConfig.orgTypeConstant
                      }


                      //组装数据
                      $scope.originalData = $scope.orgTypeConstant.concat($scope.originalOrgList).concat($scope.originalDeptList).concat($scope.originalUserList);
                      $scope.originalData.forEach(function(val) {
                          model2Tree(val);
                      });

                      if ($scope.selectedNode) {
                          $scope.originalData.filter(function(v) {
                              var id = $scope.selectedNode.id;
                              if(id.indexOf('.')!=-1){
                                  return v.id == id.substr(0, id.indexOf('.'));
                              }
                              return false;
                          }).forEach(function(v) {
                              if (v.id.split('.').length == 1) {
                                  var parent = _.find($scope.originalData, {
                                      id: v.parent
                                  });

                                  parent.state.opened = true;
                              }
                              v.state.opened = true;
                          });
                      }
                  }
                  $scope.showData = $scope.originalData;
                  $scope.treeConfig.version++;

                  $scope.originalOrgViewList  = $scope.originalOrgList;
                }else{
                  //TODO
                  alert("请联系系统管理员");
                }
              })
            }else{
              //TODO
              alert("请联系系统管理员");
            }
          })

            $scope.originalOrgViewList  = $scope.originalOrgList;


  
          $scope.queryDataPermission({
          }).success(function(res) {
            $scope.dataPermissionList = res.result;
          });
        }
      })
  };

  // Init
  $scope.refreshAllData();
  $scope.queryAllRole().success(function(orgData) {
    $scope.roleTypeData = orgData.result;
  });
  
  $scope.readyCB = function() {
    if ($scope.selectedNode) {
      $scope.selectedNode = _.find($scope.originalData, {
        id: $scope.selectedNode.id
      });
      $scope.treeInstance.jstree(true).select_node($scope.selectedNode);
    }
  };


  $scope.clickTree = function() {

    $scope.deptSelectAll = $scope.orgSelectAll = false;
    var nodeId = $scope.treeInstance.jstree(true).get_selected()[0];
    if (nodeId && ($scope.selectedNode && $scope.selectedNode.id != nodeId || !$scope.selectedNode))
      $scope.selectedNode = _.findWhere($scope.originalData, {
        id: nodeId
      });

      console.info($scope.selectedNode);
      $scope.newOrgList='';
  };

  $scope.orgToggleSelectAll = function() {
    $filter('filter')($scope.originalOrgList, {
      parent: $scope.selectedNode.id
    }).forEach(function(v) {
      v.checked = $scope.orgSelectAll;
    });
  }

  $scope.orgChxChange = function() {
    $scope.orgSelectAll = $filter('filter')($scope.originalOrgList, {
      parent: $scope.selectedNode.id
    }).every(function(v) {
      return v.checked
    });
  };

  $scope.delSysOrgs = function(id) {
    id = id && [id] || $filter('filter')($scope.originalOrgList, {
      parent: $scope.selectedNode.id
    }).filter(function(v) {
      return v.checked;
    }).map(function(x) {
      return x.id
    });
    if (id && id.length) {
      if(confirm("删除组织将自动删除该组织下的所有组织、部门与用户，您确认删除吗？")){
        $scope.deleteSysOrg({
          "orgID": id
        }).success(function(data) {
          //请求成功
          if(data.code == LoginConfig.commonConStant.SUCCESS){
            $scope.refreshAllData();
          }else{
            //TODO
            alert("请联系系统管理员");
          }
        });
      }
    }else{
      //TODO
      alert("请选择需要删除的数据");
    }
  }

  $scope.deptToggleSelectAll = function() {
    $filter('filter')($scope.originalData, {
      id: $scope.selectedNode.id + '.'
    }).forEach(function(v) {
      v.checked = $scope.deptSelectAll;
    });
  }

  $scope.deptChxChange = function() {
    $scope.deptSelectAll = $filter('filter')($scope.originalData, {
      id: $scope.selectedNode.id + '.'
    }).every(function(v) {
      return v.checked
    });
  }

  //删除部门信息
  $scope.delSysDepts = function(id) {
    id = id && [id] || $filter('filter')($scope.originalData, {
      id: $scope.selectedNode.id + '.'
    }).filter(function(v) {
      return v.checked;
    }).map(function(x) {
      return x.id
    });

    if (id && id.length) {
        var isDigits = /^\d+$/;
        var userIds = id.filter(function(v) {
          return isDigits.test(v.substr(v.lastIndexOf('.') + 1));
        });
        var deptIds = id.filter(function(v) {
          return !isDigits.test(v.substr(v.lastIndexOf('.') + 1));
        });
        //删除人员
        if (userIds.length) {
          if(confirm("您确认删除吗？")) {
            $scope.removePerson({
              "id": userIds
            }).success(function (data) {
              //请求成功
              if (data.code == LoginConfig.commonConStant.SUCCESS) {
                if (deptIds.length) {
                  $scope.removeDepartment({
                    "id": deptIds
                  }).success(function (data) {
                    if (data.code == LoginConfig.commonConStant.SUCCESS) {
                      $scope.refreshAllData();
                    } else {
                      //TODO
                      alert("请联系系统管理员");
                    }
                  });
                } else {
                  $scope.refreshAllData();
                }
              } else {
                //TODO
                alert("请联系系统管理员");
              }
            });
          }
        } else {
          //删除部门信息
          if(confirm("删除部门将自动删除该部门下的所有部门与用户，您确认删除吗？")) {
            if (deptIds.length) {
              $scope.removeDepartment({
                "id": deptIds
              }).success(function (data) {
                if (data.code == LoginConfig.commonConStant.SUCCESS) {
                  $scope.refreshAllData();
                } else {
                  //TODO
                  alert("请联系系统管理员");
                }
              });
            } else {
              $scope.refreshAllData();
            }
          }
        }
    }else{
      alert("请您选择需要删除的数据");
    }
  }

  $scope.certTypeConstant = DictionaryConfig.certTypeConstant;
  $scope.createOrUpdateSysOrg = function(sysOrg) {
    var modalInstance = $modal.open({
      templateUrl: 'views/pages/organize_manage/new_organize.html',
      controller: 'CreateOrUpdateSysOrgCtrl',
      size: 'lg',
      resolve: {
        items: function() {
          return {
            originalOrgList: $scope.originalOrgList,
            sysOrg: sysOrg,
            selectedNode: $scope.selectedNode
          }
        }
      }
    });
    //返回值
    modalInstance.result.then(function(data) {
      $scope.refreshAllData();
    }, function() {});
  };

  //打开部门详情页面（新建+编辑）
  $scope.createOrUpdateSysDept = function(dept) {
    var modalInstance = $modal.open({
      templateUrl: 'views/pages/organize_manage/new_department.html',
      controller: 'NewDepartmentCtrl',
      size: 'lg',
      resolve: {
        items: function() {
          return {
            selectedNode: $scope.selectedNode,
            dept: dept
          }
        }
      }
    });
    //接收弹出窗返回的结果
    modalInstance.result.then(function(data) {
      $scope.refreshAllData();
    }, function() {});
  };

  $scope.createOrUpdateSysDeptOrPerson = function(dept) {
    if (dept.type == 'dept')
      $scope.createOrUpdateSysDept(dept);
    else if (dept.type == 'default')
      $scope.createOrUpdateSysUser(dept);
  }
  
  $scope.setDataPermission = function() {
    var modalInstance = $modal.open({
      templateUrl: 'views/pages/organize_manage/dataPermission.html',
      controller: 'DataPermissionCtrl',
      size: 'lg',
      resolve: {
        items: function() {
          return {
            originalData: $scope.originalData,
            selectedNode: $scope.selectedNode
          };
        }
      }
    });
    modalInstance.result.then(function(data) {
      $scope.refreshAllData();
    }, function() {});
  }

  //打开新建人员界面
  $scope.createOrUpdateSysUser = function(person) {

    var modalInstance = $modal.open({
      templateUrl: 'views/pages/organize_manage/new_person.html',
      controller: 'NewPersonCtrl',
      size: 'lg',
      resolve: {
        items: function() {
          return {
            originalData: $scope.originalData,
            originalOrgList: $scope.originalOrgList,
            roleTypeData: $scope.roleTypeData,
            selectedNode: $scope.selectedNode,
            person: person,
            delOrgFlag:$scope.delOrgFlag
          };
        }
      }
    });
    //接收弹出窗返回的结果
    modalInstance.result.then(function(data) {
      $scope.refreshAllData();
    }, function() {});
  }

  $scope.addRole = function() {
    var modalInstance = $modal.open({
      templateUrl: 'views/pages/organize_manage/add_role.html',
      controller: 'AddRoleCtrl',
      size: 'lg',
      resolve: {
        items: function() {
          return {
            originalData: $scope.originalData,
            roleTypeData: $scope.roleTypeData,
            selectedNode: $scope.selectedNode,
            originalDeptList: $scope.originalDeptList
          };
        }
      }
    });
    modalInstance.result.then(function(data) {
      $scope.refreshAllData();
    }, function() {});
  }

  $scope.deleteRole = function(id) {
    var userId = id.id.substr(id.id.lastIndexOf('.') + 1);
    var deptId = id.id.substr(0, id.id.lastIndexOf('.'))
    var roleId = id.roleid
    $scope.removeUserDeptRole({
      "userId": userId,
      "deptId": deptId,
      "roleid":roleId
    }).success(function(data) {
      //请求成功
      if(data.code == LoginConfig.commonConStant.SUCCESS){
        $scope.refreshAllData();
      }else{
        //TODO
        alert("请联系系统管理员");
      }
    });
  }
  
  $scope.deletePermission = function(permission, $event){
    var index = $event.target.dataset.index;
    $scope.removeDataPermission(permission).success(function(res){
      $scope.dataPermissionList.splice(index, 1)
    })
  }

  //搜索
  $scope.seekSysOrgs = function(){
      $scope.newOrgList = $scope.originalOrgList.filter(function(val) {
          return val.text.indexOf($scope.searchInputVale) > -1 ;
      });
  }

    //组织主表
    function SysOrg() {
        this.orgName = "";
        this.category = "";
        this.orgCode = "";
        this.parentId = "";
        this.extPro = {};
        this.delFlag = "0";
        this.createDate = "";
        this.regulationNo = "0";
        this.serialNo = "0";
        this.appraisalNo = "0";
        this.regionCode = "";
        this.regionName = "";
        this.courtCode = "";
        this.orgFullName = "";
        this.secondSerialNo = "0";
    }
    //扩展表信息
    function ExtPro() {
        this.regionName = "";
        this.regionId = "";
        this.regionParentId = "";
        this.regionCode = "";
        this.regionLevel = "";
        //机构简称
        this.orgNameShort = "";
        //许可证
        this.licence = "";
        //法人
        this.legalPerson = "";
        //责任人
        this.personLiable = "";
        //电话
        this.telephone = "";
        //传真
        this.fax = "";
        //邮箱
        this.email = "";
        //业务范围
        this.range = "";
        //地址
        this.address = "";
        //鉴定项目
        this.appraisalItem = "";
        //收款单位
        this.company = "";
        //开户行
        this.bankAccount = "";
        //账户
        this.account = "";
        //账号
        this.accountNumber = "";
        //鉴定机构随机
        this.isRandom = "1";
        //
        this.justiceType = "";
    }
    var imgCourtJcrop;
    $scope.importCourtExcel = function(file){
        $scope.sysOrg = new SysOrg();
        $scope.sysOrg.extPro = new ExtPro();
        var fileName = file.name;
        var arr = fileName.split(".");
        var regionName = arr[0];
        var tempIndex =  _.findIndex( $scope.adminRegion,{fullName:arr[0]});
        var selectedRegion = $scope.adminRegion[tempIndex];
        $scope.sysOrg.regionName = selectedRegion.fullName;
        $scope.sysOrg.regionCode = selectedRegion.regionCode;

        $scope.sysOrg.extPro.regionName = selectedRegion.fullName;
        $scope.sysOrg.extPro.regionId = selectedRegion.id;
        $scope.sysOrg.extPro.regionParentId = selectedRegion.parent;
        $scope.sysOrg.extPro.regionCode = selectedRegion.regionCode;
        $scope.sysOrg.extPro.regionLevel = selectedRegion.level;
        if (!file) return;
        if(imgCourtJcrop){
            imgCourtJcrop.destroy();
            $('#original').show();
        }
        Upload.upload({
            url: LoginConfig.pictureConstant.importCourtExcel,
            data: {
                sysOrg:angular.toJson($scope.sysOrg)
            },
            file: file
        }).success(function(result) {
            if (result.code == LoginConfig.commonConStant.SUCCESS) {
                $scope.encryString = result.result;
                alert($scope.encryString);
            } else {
                $scope.encryString = result.result;
                alert($scope.encryString);
                console.log('1111111111111111====失败');
                // toaster.pop(level, title, $scope.CONSTANT.messageHeadUploadError);
            }
        });
    }


    var imgIdentificationJcrop;
    $scope.importIdentificationExcel = function(file){
        console.log("imgIdentificationJcrop")
        /*$scope.sysOrg = new SysOrg();
        $scope.sysOrg.extPro = new ExtPro();
        console.log('1111111111111111');
        var fileName = file.name;
        var arr = fileName.split(".");
        var regionName = arr[0];
        var tempIndex =  _.findIndex( $scope.adminRegion,{fullName:arr[0]});
        var selectedRegion = $scope.adminRegion[tempIndex];
        $scope.sysOrg.regionName = selectedRegion.fullName;
        $scope.sysOrg.regionCode = selectedRegion.regionCode;

        $scope.sysOrg.extPro.regionName = selectedRegion.fullName;
        $scope.sysOrg.extPro.regionId = selectedRegion.id;
        $scope.sysOrg.extPro.regionParentId = selectedRegion.parent;
        $scope.sysOrg.extPro.regionCode = selectedRegion.regionCode;
        $scope.sysOrg.extPro.regionLevel = selectedRegion.level;*/
        if (!file) return;
        if(imgIdentificationJcrop){
            imgIdentificationJcrop.destroy();
            $('#original').show();
        }
        Upload.upload({
            url: LoginConfig.pictureConstant.importIdentificationExcel,
            data: {
                adminRegion:angular.toJson($scope.adminRegion)
            },
            file: file
        }).success(function(result) {
            if (result.code == LoginConfig.commonConStant.SUCCESS) {
                console.log('1111111111111111====成功');
                $scope.encryString = result.result;
                alert($scope.encryString);
                console.log('1111111111111111====' + $scope.headAddress);
            } else {
                $scope.encryString = result.result;
                alert($scope.encryString);
                console.log('1111111111111111====失败');
                // toaster.pop(level, title, $scope.CONSTANT.messageHeadUploadError);
            }
        });
    }


    $scope.importCourtUserInfoExcel = function(file){
        if (!file) return;
        Upload.upload({
            url: LoginConfig.pictureConstant.importCourtUserInfoExcel,
            file: file
        }).success(function(result) {
            if (result.code == LoginConfig.commonConStant.SUCCESS) {
                console.log('1111111111111111====成功');
                $scope.encryString = result.result;
                alert($scope.encryString);
                console.log('1111111111111111====' + $scope.headAddress);
            } else {
                $scope.encryString = result.result;
                alert($scope.encryString);
                console.log('1111111111111111====失败');
                // toaster.pop(level, title, $scope.CONSTANT.messageHeadUploadError);
            }
        });
    }


    $scope.importMediateUserInfoExcel = function(file){
        if (!file) return;
        Upload.upload({
            url: LoginConfig.pictureConstant.importMediateUserInfoExcel,
            file: file
        }).success(function(result) {
            if (result.code == LoginConfig.commonConStant.SUCCESS) {
                console.log('1111111111111111====成功');
                $scope.encryString = result.result;
                alert($scope.encryString);
                console.log('1111111111111111====' + $scope.headAddress);
            } else {
                $scope.encryString = result.result;
                alert($scope.encryString);
                console.log('1111111111111111====失败');
                // toaster.pop(level, title, $scope.CONSTANT.messageHeadUploadError);
            }
        });
    }

    $scope.importApplyerUserInfoExcel = function(file){
        if (!file) return;
        Upload.upload({
            url: LoginConfig.pictureConstant.importApplyerUserInfoExcel,
            file: file
        }).success(function(result) {
            if (result.code == LoginConfig.commonConStant.SUCCESS) {
                console.log('1111111111111111====成功');
                $scope.encryString = result.result;
                alert($scope.encryString);
                console.log('1111111111111111====' + $scope.headAddress);
            } else {
                $scope.encryString = result.result;
                alert($scope.encryString);
                console.log('1111111111111111====失败');
                // toaster.pop(level, title, $scope.CONSTANT.messageHeadUploadError);
            }
        });
    }
});