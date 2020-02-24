<template>
  <div class="app-container">
    <el-card style="margin-bottom:20px;">
      <div slot="header" class="clearfix">
        <span>我的企业信息</span>
      </div>
      <div class="user-bio">
        <div class="user-education user-bio-section">
          <div class="user-bio-section-header"><svg-icon icon-class="education" /><span>企业名称</span></div>
          <div class="user-bio-section-body">
            <div class="text-muted">
              {{ data.clientName }}
            </div>
          </div>
        </div>
        <div class="user-education user-bio-section">
          <div class="user-bio-section-header"><svg-icon icon-class="search" /><span>企业地址</span></div>
          <div class="user-bio-section-body">
            <div class="text-muted">
              {{ data.address }}
            </div>
          </div>
        </div>
        <div class="user-education user-bio-section">
          <div class="user-bio-section-header"><svg-icon icon-class="people" /><span>联系人</span></div>
          <div class="user-bio-section-body">
            <div class="text-muted">
              {{ data.linkman }}
            </div>
          </div>
        </div>
        <div class="user-education user-bio-section">
          <div class="user-bio-section-header"><i class="el-icon-phone" /><span>联系人电话</span></div>
          <div class="user-bio-section-body">
            <div class="text-muted">
              {{ data.mobile }}
            </div>
          </div>
        </div>
        <div class="user-education user-bio-section">
          <div class="user-bio-section-header"><svg-icon icon-class="money" /><span>企业余额</span></div>
          <div class="user-bio-section-body">
            <div class="text-muted">
              ￥{{ data.balance }}
            </div>
          </div>
        </div>
      </div>
    </el-card>

    <!-- <el-row class="row" style="text-align:center;" :gutter="40">
      我的企业信息
    </el-row>
    <el-row class="row" :gutter="40">
      <el-col :span="12" class="right">企业名称：</el-col>
      <el-col :span="12" class="left">{{ data.clientName }}</el-col>
    </el-row>
    <el-row class="row" :gutter="40">
      <el-col :span="12" class="right">企业地址：</el-col>
      <el-col :span="12" class="left">{{ data.address }}</el-col>
    </el-row>
    <el-row class="row" :gutter="40">
      <el-col :span="12" class="right">联系人：</el-col>
      <el-col :span="12" class="left">{{ data.linkman }}</el-col>
    </el-row>
    <el-row class="row" :gutter="40">
      <el-col :span="12" class="right">联系人电话：</el-col>
      <el-col :span="12" class="left">{{ data.mobile }}</el-col>
    </el-row>
    <el-row class="row" :gutter="40">
      <el-col :span="12" class="right">企业余额：</el-col>
      <el-col :span="12" class="left">￥{{ data.balance }}</el-col>
    </el-row> -->
  </div>
</template>

<script>
import { apiInfo } from '@/api/mycompany/myCompany.js'
export default {
  name: 'MyCompany',
  data() {
    return {
      data: {
        clientName: '',
        address: '',
        linkman: '',
        mobile: '',
        balance: 0
      }
    }
  },
  created() {
    this.getInfo()
  },
  methods: {
    getInfo() {
      apiInfo().then(response => {
        this.data = response.result
      })
    }
  }
}
</script>
<style scoped>
.app-container {
  font-size: 14px;
}
.right {
  text-align: right;
}
.left {
  text-align: left;
}
.row {
  border-bottom: 1px solid #eee;
  margin-bottom: 15px;
  padding-bottom: 15px;
}

.box-center {
  margin: 0 auto;
  display: table;
}
.text-muted {
  color: #777;
}
</style>

<style lang="scss" scoped>
.box-center {
  margin: 0 auto;
  display: table;
}
.text-muted {
  color: #777;
}
.user-profile {
  .user-name {
    font-weight: bold;
  }
  .box-center {
    padding-top: 10px;
  }
  .user-role {
    padding-top: 10px;
    font-weight: 400;
    font-size: 14px;
  }
  .box-social {
    padding-top: 30px;
    .el-table {
      border-top: 1px solid #dfe6ec;
    }
  }
  .user-follow {
    padding-top: 20px;
  }
}
.user-bio {
  margin-top: 20px;
  color: #606266;
  span {
    padding-left: 4px;
  }
  .user-bio-section {
    font-size: 14px;
    padding: 15px 0;
    .user-bio-section-header {
      border-bottom: 1px solid #dfe6ec;
      padding-bottom: 10px;
      margin-bottom: 10px;
      font-weight: bold;
    }
  }
}
</style>
