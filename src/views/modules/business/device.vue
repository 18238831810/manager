<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-business__device}">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item>
          <el-input v-model="dataForm.deviceId" placeholder="设备ID" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="dataForm.customerNo" placeholder="真实账号" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="dataForm.customerNoDemo" placeholder="模拟账号" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="dataForm.chineseName" placeholder="姓名" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="dataForm.phone" placeholder="手机号码" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="dataForm.accountType" placeholder="账号类型" clearable>
            <el-option label="账号类型" value=""></el-option>
            <el-option label="迷你" value="MIN"></el-option>
            <el-option label="标准" value="STD"></el-option>
            <el-option label="铂金" value="PLA"></el-option>
            <el-option label="巴菲特" value="ZER"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="customerDemoCreateTime"
            type="datetimerange"
            range-separator="至"
            start-placeholder="模拟开户开始时间"
            end-placeholder="模拟开户结束时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="customerCreateTime"
            type="datetimerange"
            range-separator="至"
            start-placeholder="真实开户开始时间"
            end-placeholder="真实开户结束时间">
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
          <el-select v-model="dataForm.deviceWrong" placeholder="设备是否异常" clearable>
            <el-option label="设备是否异常" value=""></el-option>
            <el-option label="是" value="1"></el-option>
            <el-option label="否" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="dataForm.accountWrong" placeholder="账号是否异常" clearable>
            <el-option label="账号是否异常" value=""></el-option>
            <el-option label="是" value="1"></el-option>
            <el-option label="否" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDataList()">{{ $t('query') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPermission('business:device:save')" type="primary" @click="addOrUpdateHandle()">{{ $t('add') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPermission('business:device:delete')" type="danger" @click="deleteHandle()">{{ $t('deleteBatch') }}</el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle" style="width: 100%;">
        <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
        <el-table-column prop="id" label="ID" header-align="center" align="center"></el-table-column>
        <el-table-column prop="deviceId" label="设备ID" header-align="center" align="center"></el-table-column>
        <el-table-column prop="customerNo" label="真实账号" header-align="center" align="center"></el-table-column>
        <el-table-column prop="customerNoDemo" label="模拟账号" header-align="center" align="center"></el-table-column>
        <el-table-column prop="chineseName" label="真实姓名" header-align="center" align="center"></el-table-column>
        <el-table-column prop="phone" label="手机号码" header-align="center" align="center"></el-table-column>
        <el-table-column prop="accountType" label="账号类型" header-align="center" align="center"></el-table-column>
        <el-table-column prop="customerCreateTime" label="真实开户时间" :formatter="timestampToDate" header-align="center" align="center"></el-table-column>
        <el-table-column prop="customerDemoCreateTime" label="模拟开户时间" :formatter="timestampToDate" header-align="center" align="center"></el-table-column>
        <el-table-column prop="customerActivatedTime" label="激活时间" :formatter="timestampToDate" header-align="center" align="center"></el-table-column>
        <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <el-button v-if="$hasPermission('business:device:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">{{ $t('update') }}</el-button>
            <el-button v-if="$hasPermission('business:device:delete')" type="text" size="small" @click="deleteHandle(scope.row.id)">{{ $t('delete') }}</el-button>
          </template>
        </el-table-column>
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
import AddOrUpdate from './device-add-or-update'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/business/device/page',
        getDataListIsPage: true,
        deleteURL: '/business/device',
        deleteIsBatch: true
      },
      customerDemoCreateTime: '',
      customerCreateTime: '',
      customerActivatedTime: '',
      dataForm: {
        deviceId: '',
        customerNo: '',
        customerNoDemo: '',
        chineseName: '',
        phone: '',
        accountType: '',
        deviceWrong: '',
        accountWrong: '',
        customerDemoCreateStartTime: '',
        customerDemoCreateEndTime: '',
        customerCreateStartTime: '',
        customerCreateEndTime: '',
        customerActivatedStartTime: '',
        customerActivatedEndTime: ''
      }
    }
  },
  watch: {
    customerDemoCreateTime (val) {
      if(val){
        this.dataForm.customerDemoCreateStartTime = new Date(val[0]).getTime()
        this.dataForm.customerDemoCreateEndTime = new Date(val[1]).getTime()
      }else{
        this.dataForm.customerDemoCreateStartTime =''
        this.dataForm.customerDemoCreateEndTime =''
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
