
export default {
  // 管理后台
  oper: [
    // 短信业务
    {
      label: '短信业务', // 一级
      children: [
        {
          label: '应用管理', // 二级
          children: [{ // 三级
            id: 65,
            label: '应用查看',
            auth: 'APP_VIEW'
          }, { // 三级
            id: 66,
            label: '应用新增',
            auth: 'APP_ADD'
          }, { // 三级
            id: 68,
            label: '应用设置单价',
            auth: 'APP_PRICE'
          }, { // 三级
            id: 80,
            label: '应用启停',
            auth: 'APP_ONOFF'
          }]
        },
        {
          id: 113,
          label: '信息管理', // 二级
          children: [
            // 短信明细
            { // 三级
              id: 94,
              label: '短信详情查看',
              auth: 'MESSAGE_VIEW'
            }
          ]
        }
      ]
    },
    // 客户管理
    {
      label: '客户管理', // 一级
      children: [
        {
          label: '客户信息', // 二级
          children: [{ // 三级
            id: 15,
            label: '客户查看',
            auth: 'CLIENT_VIEW'
          }, { // 三级
            id: 32,
            label: '新增客户',
            auth: 'CLIENT_ADD'
          }, { // 三级
            id: 33,
            label: '修改客户',
            auth: 'CLIENT_MODIFY'
          }, { // 三级
            id: 17,
            label: '充值扣费',
            auth: 'RECHARGE_CHARGE'
          }]
        }, {
          label: '账务明细', // 二级
          children: [{ // 三级
            id: 16,
            label: '账务管理',
            auth: 'CLIENT_CHARGE'
          }]
        }, {
          label: '客户用户管理', // 二级
          children: [{ // 三级
            id: 18,
            label: '客户用户查看',
            auth: 'CLIENTUSER_VIEW'
          }, { // 三级
            id: 19,
            label: '客户用户修改',
            auth: 'CLIENTUSER_MODIFY'
          }, { // 三级
            id: 20,
            label: '客户用户添加',
            auth: 'CLIENTUSER_ADD'
          }, { // 三级
            id: 21,
            label: '客户用户删除',
            auth: 'CLIENTUSER_DELETE'
          }, { // 三级
            id: 22,
            label: '客户用户操作',
            auth: 'CLIENTUSER_OPER'
          }]
        }, {
          label: '客户角色管理', // 二级
          children: [{ // 三级
            id: 23,
            label: '客户角色查看',
            auth: 'CLIENTROLE_VIEW'
          }, { // 三级
            id: 24,
            label: '客户角色修改',
            auth: 'CLIENTROLE_MODIFY'
          }, { // 三级
            id: 25,
            label: '客户角色添加',
            auth: 'CLIENTROLE_ADD'
          }, { // 三级
            id: 26,
            label: '客户角色删除',
            auth: 'CLIENTROLE_DELETE'
          }]
        }]
    },
    // 基础信息管理
    {
      label: '基础信息', // 一级
      children: [
        {
          label: '空号', // 二级
          children: [{ // 三级
            id: 27,
            label: '空号查看',
            auth: 'EMPTY_VIEW'
          }, { // 三级
            id: 34,
            label: '空号新增',
            auth: 'EMPTY_ADD'
          }, { // 三级
            id: 35,
            label: '空号删除',
            auth: 'EMPTY_DELETE'
          }, { // 三级
            id: 45,
            label: '空号导入',
            auth: 'EMPTY_IMPORT'
          }]
        },
        {
          label: '携号转网', // 二级
          children: [{ // 三级
            id: 28,
            label: '携号转网查看',
            auth: 'PORTABLE_VIEW'
          }, { // 三级
            id: 36,
            label: '携号转网新增',
            auth: 'PORTABLE_ADD'
          }, { // 三级
            id: 37,
            label: '携号转网修改',
            auth: 'PORTABLE_MODIFY'
          }, { // 三级
            id: 38,
            label: '携号转网删除',
            auth: 'PORTABLE_DELETE'
          }, { // 三级
            id: 46,
            label: '携号转网导入',
            auth: 'PORTABLE_IMPORT'
          }]
        },
        {
          label: '基础号段', // 二级
          children: [{ // 三级
            id: 29,
            label: '基础号段查看',
            auth: 'BASENUMBER_VIEW'
          }, { // 三级
            id: 42,
            label: '基础号段新增',
            auth: 'BASENUMBER_ADD'
          }, { // 三级
            id: 43,
            label: '基础号段修改',
            auth: 'BASENUMBER_MODIFY'
          }, { // 三级
            id: 44,
            label: '基础号段删除',
            auth: 'BASENUMBER_DELETE'
          }]
        }, {
          label: '详细号段', // 二级
          children: [{ // 三级
            id: 30,
            label: '详细号段查看',
            auth: 'NUMBER_VIEW'
          }, { // 三级
            id: 39,
            label: '详细号段新增',
            auth: 'NUMBER_ADD'
          }, { // 三级
            id: 40,
            label: '详细号段修改',
            auth: 'NUMBER_MODIFY'
          }, { // 三级
            id: 41,
            label: '详细号段删除',
            auth: 'NUMBER_DELETE'
          }, { // 三级
            id: 47,
            label: '详细号段导入',
            auth: 'NUMBER_IMPORT'
          }]
        }]
    },
    // 系统管理
    {
      label: '系统管理', // 一级
      children: [{
        label: '用户管理', // 二级
        children: [{ // 三级
          id: 1,
          label: '用户查看',
          auth: 'USER_VIEW'
        }, {
          id: 2,
          label: '用户修改',
          auth: 'USER_MODIFY'
        }, { // 三级
          id: 3,
          label: '用户添加',
          auth: 'USER_ADD'
        }, {
          id: 4,
          label: '用户删除',
          auth: 'USER_DELETE'
        }, { // 三级
          id: 5,
          label: '用户操作',
          auth: 'USER_OPER'
        }]
      }, {
        label: '部门管理', // 二级
        children: [{ // 三级
          id: 10,
          label: '部门查看',
          auth: 'DEPARTMENT_VIEW'
        }, {
          id: 11,
          label: '部门添加',
          auth: 'DEPARTMENT_ADD'
        }, {
          id: 12,
          label: '部门删除',
          auth: 'DEPARTMENT_DELETE'
        }, {
          id: 13,
          label: '部门修改',
          auth: 'DEPARTMENT_MODIFY'
        }]
      }, {
        label: '角色管理', // 二级
        children: [{ // 三级
          id: 6,
          label: '角色查看',
          auth: 'ROLE_VIEW'
        }, { // 三级
          id: 7,
          label: '角色修改',
          auth: 'ROLE_MODIFY'
        }, { // 三级
          id: 8,
          label: '角色添加',
          auth: 'ROLE_ADD'
        }, { // 三级
          id: 9,
          label: '角色删除',
          auth: 'ROLE_DELETE'
        }]
      }, {
        label: '日志管理', // 二级
        children: [{ // 三级
          id: 14,
          label: '日志查看',
          auth: 'LOG_VIEW'
        }]
      }]
    }],
  // 客户端
  client: [
    {
      label: '短信业务', // 一级
      children: [{
        label: '应用管理', // 二级
        children: [{ // 三级
          id: 101,
          label: '应用查看',
          auth: 'CLIENT_APP_VIEW'
        }
        ]
      }, {
        id: 116,
        label: '信息管理', // 二级
        children: [{ // 三级
          id: 106,
          label: '短信详情查看',
          auth: 'CLIENT_MESSAGE_VIEW'
        }]
      }]
    }, {
      label: '系统管理', // 一级
      children: [{
        label: '用户管理', // 二级
        children: [{ // 三级
          id: 99,
          label: '用户查询',
          auth: 'CLIENT_USER_VIEW'
        }]
      }]
    }, {
      label: '我的公司', // 一级
      children: [{
        label: '我的公司', // 二级
        children: [{ // 三级
          id: 103,
          label: '公司信息查询',
          auth: 'CLIENT_COMMPANY_INFO'
        }]
      }]
    }]
}
