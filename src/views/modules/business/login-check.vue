<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-business__device}">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item>
          <el-input v-model="dataForm.account" placeholder="账户" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="dataForm.username" placeholder="姓名" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="dataForm.phone" placeholder="手机号" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-date-picker v-model="customerCreateTime" type="datetimerange" range-separator="至" start-placeholder="真实开户开始时间" end-placeholder="真实开户结束时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-select v-model="dataForm.userStatus" placeholder="用户状态" clearable>
            <el-option label="已激活" value="1"></el-option>
            <el-option label="未激活" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDataList()">{{ $t('query') }}</el-button>
        </el-form-item>
        <!--
        <el-form-item>
          <el-button v-if="$hasPermission('business:loginCheck:save')" type="primary" @click="addOrUpdateHandle()">{{ $t('add') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPermission('business:loginCheck:delete')" type="danger" @click="deleteHandle()">{{ $t('deleteBatch') }}</el-button>
        </el-form-item>
        -->
      </el-form>
      <el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle" style="width: 100%;">
        <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
        <el-table-column prop="id" label="ID" header-align="center" align="center" width="80"></el-table-column>
        <el-table-column prop="account" label="账户" header-align="center" align="center"></el-table-column>
        <el-table-column prop="accountDemo" label="关联账户" header-align="center" align="center"></el-table-column>
        <el-table-column prop="username" label="姓名" header-align="center" align="center"></el-table-column>
        <el-table-column label="账户类型" header-align="center" align="center">真实账户</el-table-column>
        <el-table-column prop="level" label="账户等级" header-align="center" align="center"></el-table-column>
        <el-table-column prop="phone" label="手机号" header-align="center" align="center"></el-table-column>
        <el-table-column prop="userStatus" label="用户状态" header-align="center" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.userStatus === 1" size="small" type="primary">已激活</el-tag>
            <el-tag v-else-if="scope.row.userStatus === 0" size="small" type="primary">未激活</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="openAccountDate" :formatter="timestampToDate" label="开户时间" header-align="center" align="center"></el-table-column>
        <el-table-column prop="p" label="P标签" header-align="center" align="center"></el-table-column>
        <el-table-column prop="usuallyLoginAddress" label="常用登陆地" header-align="center" align="center"></el-table-column>
        <el-table-column prop="ip" label="最近登陆IP地址" header-align="center" align="center"></el-table-column>
        <el-table-column prop="recentlyLoginAddress" label="最近登陆IP所在地" header-align="center" align="center"></el-table-column>
        <el-table-column prop="createDate" :formatter="timestampToDate" label="创建时间" header-align="center" align="center"></el-table-column>
        <el-table-column prop="updateDate" :formatter="timestampToDate" label="修改时间" header-align="center" align="center"></el-table-column>
        <el-table-column prop="remark" label="备注" header-align="center" align="center"></el-table-column>
        <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <el-button v-if="$hasPermission('business:loginCheck:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">{{ $t('update') }}</el-button>
            <el-button v-if="$hasPermission('business:loginCheck:delete')" type="text" size="small" @click="deleteHandle(scope.row.id)">{{ $t('delete') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination :current-page="page" :page-sizes="[10, 20, 50, 100]" :page-size="limit" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChangeHandle" @current-change="pageCurrentChangeHandle">
      </el-pagination>
      <!-- 弹窗, 新增 / 修改 -->
      <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    </div>
  </el-card>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import AddOrUpdate from './login-check-add-or-update'
export default {
  mixins: [mixinViewModule],
  data() {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/business/loginCheck/page',
        getDataListIsPage: true,
        deleteURL: '/business/loginCheck',
        deleteIsBatch: true
      },
      customerCreateTime: '',
      dataForm: {
        id: '',
        status: '',
        count: '',
        restrictType: '',
        remark: '',
        customerCreateStartTime: '',
        customerCreateEndTime: '',
        effectiveDate: ''
      }
    }
  },
  watch: {
    customerCreateTime(val) {
      if (val) {
        this.dataForm.customerCreateStartTime = new Date(val[0])
        this.dataForm.customerCreateEndTime = new Date(val[1])
      } else {
        this.dataForm.customerCreateStartTime = ''
        this.dataForm.customerCreateEndTime = ''
      }
    }
  },
  methods: {
    aaaa(restrictType) {
      let arr = []
      if (restrictType.indexOf("1") >= 0) {
        arr.push("登陆")
      }
      if (restrictType.indexOf("2") >= 0) {
        arr.push("开仓")
      }

      return arr;
    }
  },
  components: {
    AddOrUpdate
  }
}
</script>
