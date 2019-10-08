<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-newbie__cfvnActiveChannel}">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item>
          <el-input v-model="dataForm.name" placeholder="渠道名称" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="dataForm.pkg" placeholder="渠道包名" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="dataForm.os" placeholder="系统类型" clearable>
            <el-option label="IOS" value="ios"></el-option>
            <el-option label="Android" value="android"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-date-picker v-model="createDate" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" range-separator="至" start-placeholder="创建开始时间" end-placeholder="创建结束时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDataList()">{{ $t('query') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPermission('newbie:cfvnActiveChannel:save')" type="primary" @click="addOrUpdateHandle()">{{ $t('add') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPermission('newbie:cfvnActiveChannel:delete')" type="danger" @click="deleteHandle()">{{ $t('deleteBatch') }}</el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle" style="width: 100%;">
        <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
        <el-table-column prop="id" label="ID" header-align="center" align="center"></el-table-column>
        <el-table-column prop="name" label="渠道名称" header-align="center" align="center"></el-table-column>
        <el-table-column prop="pkg" label="渠道包名" header-align="center" align="center"></el-table-column>
        <el-table-column prop="os" label="系统类型" header-align="center" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.os === 'ios'" size="small" type="primary">IOS</el-tag>
            <el-tag v-else-if="scope.row.os === 'android'" size="small" type="primary">Android</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="渠道说明" header-align="center" align="center"></el-table-column>
        <el-table-column prop="createDate" label="创建时间" :formatter="timestampToDate" header-align="center" align="center"></el-table-column>
        <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <el-button v-if="$hasPermission('newbie:cfvnActiveChannel:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">{{ $t('update') }}</el-button>
            <el-button v-if="$hasPermission('newbie:cfvnActiveChannel:delete')" type="text" size="small" @click="deleteHandle(scope.row.id)">{{ $t('delete') }}</el-button>
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
import AddOrUpdate from './cfvn-activechannel-add-or-update'
export default {
  mixins: [mixinViewModule],
  data() {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/newbie/cfvnActiveChannel/page',
        getDataListIsPage: true,
        deleteURL: '/newbie/cfvnActiveChannel',
        deleteIsBatch: true
      },
      createDate: '',
      dataForm: {
        name: '',
        pkg: '',
        os: '',
        createStartDate: '',
        createEndDate: ''
      }
    }
  },
  watch: {
    createDate(val) {
      if (val) {
        this.dataForm.createStartDate = val[0]
        this.dataForm.createEndDate = val[1]
      } else {
        this.dataForm.createStartDate = ''
        this.dataForm.createEndDate = ''
      }
    }
  },
  components: {
    AddOrUpdate
  }
}
</script>
