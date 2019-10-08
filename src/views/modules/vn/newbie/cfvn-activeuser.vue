<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-newbie__cfvnActiveUser}">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item>
          <el-input v-model="dataForm.activeName" placeholder="活动名称" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="dataForm.activeNo" placeholder="活动编号" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="dataForm.customerNo" placeholder="交易账号" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="dataForm.phone" placeholder="手机号" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="dataForm.customerStatus" placeholder="用户状态" clearable>
            <el-option label="用户状态" value=""></el-option>
            <el-option label="已激活" value="A"></el-option>
            <el-option label="冻结" value="S"></el-option>
            <el-option label="销户" value="D"></el-option>
            <el-option label="黑名单" value="BL"></el-option>
            <el-option label="未激活" value="N"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="startTime"
            type="datetime"
            placeholder="活动开始时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="endTime"
            type="datetime"
            placeholder="活动结束时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="customerCreateTime"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开户开始时间"
            end-placeholder="开户结束时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="customerActivatedTime"
            type="datetimerange"
            range-separator="至"
            start-placeholder="激活开始时间"
            end-placeholder="激活结束时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button @click="queryDataList()">{{ $t('query') }}</el-button>
        </el-form-item>
        <!--
        <el-form-item>
          <el-button v-if="$hasPermission('newbie:cfvnActiveUser:save')" type="primary" @click="addOrUpdateHandle()">{{ $t('add') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPermission('newbie:cfvnActiveUser:delete')" type="danger" @click="deleteHandle()">{{ $t('deleteBatch') }}</el-button>
        </el-form-item>
        -->
      </el-form>
      <el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle" style="width: 100%;">
        <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
        <el-table-column prop="id" label="ID" header-align="center" align="center"></el-table-column>
        <el-table-column prop="customerNo" label="交易账号" header-align="center" align="center"></el-table-column>
        <el-table-column prop="customerNoDemo" label="交易账号（模拟）" header-align="center" align="center"></el-table-column>
        <el-table-column prop="activeNo" label="活动编号" header-align="center" align="center"></el-table-column>
        <el-table-column prop="startTime" label="活动开始时间" :formatter="timestampToDate" header-align="center" align="center"></el-table-column>
        <el-table-column prop="endTime" label="活动结束时间" :formatter="timestampToDate" header-align="center" align="center"></el-table-column>
        <el-table-column prop="activeName" label="活动名称" header-align="center" align="center"></el-table-column>
        <el-table-column prop="firstName" label="姓" header-align="center" align="center"></el-table-column>
        <el-table-column prop="lastName" label="名" header-align="center" align="center"></el-table-column>
        <el-table-column prop="phone" label="手机号" header-align="center" align="center"></el-table-column>
        <el-table-column prop="actived" label="是否参与活动" header-align="center" align="center"></el-table-column>
        <el-table-column prop="task1" label="开通真实账户" header-align="center" align="center"></el-table-column>
        <!--
        <el-table-column prop="task2" label="体验模拟交易" header-align="center" align="center"></el-table-column>
        -->
        <el-table-column prop="task3" label="完善资料" header-align="center" align="center"></el-table-column>
        <el-table-column prop="task4" label="首次入金" header-align="center" align="center"></el-table-column>
        <el-table-column prop="task5" label="累计交易1手外汇" header-align="center" align="center"></el-table-column>
        <el-table-column prop="task6" label="累计交易1手商品" header-align="center" align="center"></el-table-column>
        <el-table-column prop="task7" label="累计交易1手指数" header-align="center" align="center"></el-table-column>
        <el-table-column prop="task8" label="累计交易1手数字货币" header-align="center" align="center"></el-table-column>
        <el-table-column prop="task9" label="交易下单" header-align="center" align="center"></el-table-column>
        <el-table-column prop="task10" label="交易股票" header-align="center" align="center"></el-table-column>
        <el-table-column prop="customerCreateTime" label="用户开户时间" :formatter="timestampToDate" header-align="center" align="center"></el-table-column>
        <el-table-column prop="customerActivatedTime" label="用户激活时间" :formatter="timestampToDate" header-align="center" align="center"></el-table-column>
        <el-table-column prop="customerStatus" label="用户状态" header-align="center" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.customerStatus === 'A'" size="small" type="primary">已激活</el-tag>
            <el-tag v-if="scope.row.customerStatus === 'S'" size="small" type="primary">冻结</el-tag>
            <el-tag v-if="scope.row.customerStatus === 'D'" size="small" type="primary">销户</el-tag>
            <el-tag v-if="scope.row.customerStatus === 'BL'" size="small" type="primary">黑名单</el-tag>
            <el-tag v-if="scope.row.customerStatus === 'N'" size="small" type="primary">未激活</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="amount" label="奖励金额" header-align="center" align="center"></el-table-column>
        <el-table-column prop="amountCNY" label="奖励金额(人民币)" header-align="center" align="center"></el-table-column>
        <el-table-column prop="createDate" label="创建时间" :formatter="timestampToDate" header-align="center" align="center"></el-table-column>
        <el-table-column prop="updateDate" label="更新时间" :formatter="timestampToDate" header-align="center" align="center"></el-table-column>
        <!--
        <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <el-button v-if="$hasPermission('newbie:cfvnActiveUser:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">{{ $t('update') }}</el-button>
            <el-button v-if="$hasPermission('newbie:cfvnActiveUser:delete')" type="text" size="small" @click="deleteHandle(scope.row.id)">{{ $t('delete') }}</el-button>
          </template>
        </el-table-column>
        -->
      </el-table>
      <el-pagination
        :current-page="page"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="limit"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="pageSizeChangeHandle"
        @current-change="pageCurrentChangeHandle">
      </el-pagination>
      <!-- 弹窗, 新增 / 修改 -->
      <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    </div>
  </el-card>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import AddOrUpdate from './cfvn-activeuser-add-or-update'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/newbie/cfvnActiveUser/page',
        getDataListIsPage: true,
        deleteURL: '/newbie/cfvnActiveUser',
        deleteIsBatch: true
      },
      startTime: '',
      endTime: '',
      customerCreateTime: '',
      customerActivatedTime: '',
      dataForm: {
        activeName: '',
        activeNo: '',
        customerNo: '',
        phone: '',
        customerStatus: '',
        startTime: '',
        endTime: '',
        customerCreateStartTime: '',
        customerCreateEndTime: '',
        customerActivatedStartTime: '',
        customerActivatedEndTime: ''
      }
    }
  },
  watch: {
    startTime (val) {
      if(val){
        this.dataForm.startTime = new Date(val).getTime()
      }else{
        this.dataForm.startTime = ''
      }
    },
    endTime (val) {
      if(val){
        this.dataForm.endTime = new Date(val).getTime()
      }else{
        this.dataForm.endTime = ''
      }
    },
    customerCreateTime (val) {
      if(val){
        this.dataForm.customerCreateStartTime = new Date(val[0]).getTime()
        this.dataForm.customerCreateEndTime = new Date(val[1]).getTime()
      }else{
        this.dataForm.customerCreateStartTime =''
        this.dataForm.customerCreateEndTime =''
      }
    },
    customerActivatedTime (val) {
      if(val){
        this.dataForm.customerActivatedStartTime = new Date(val[0]).getTime()
        this.dataForm.customerActivatedEndTime = new Date(val[1]).getTime()
      }else{
        this.dataForm.customerActivatedStartTime =''
        this.dataForm.customerActivatedEndTime =''
      }
    }
  },
  components: {
    AddOrUpdate
  }
}
</script>
