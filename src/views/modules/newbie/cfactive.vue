<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-newbie__cfactive}">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item>
          <el-input v-model="dataForm.activeNo" placeholder="活动编号" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="dataForm.activeName" placeholder="活动名称" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="dataForm.status" placeholder="活动状态" clearable>
            <el-option label="启用" value="1"></el-option>
            <el-option label="禁用" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="queryDataList()">{{ $t('query') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPermission('newbie:cfactive:save')" type="primary" @click="addOrUpdateHandle()">{{ $t('add') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPermission('newbie:cfactive:delete')" type="danger" @click="deleteHandle()">{{ $t('deleteBatch') }}</el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle" style="width: 100%;">
        <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
        <el-table-column prop="id" label="ID" header-align="center" align="center"></el-table-column>
        <el-table-column prop="activeNo" label="活动编号" header-align="center" align="center"></el-table-column>
        <el-table-column prop="activeName" label="活动名称" header-align="center" align="center"></el-table-column>
        <el-table-column prop="activeType" label="活动类型" header-align="center" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.activeType === 0" size="small" type="primary">任务型</el-tag>
            <el-tag v-else-if="scope.row.activeType === 1" size="small" type="primary">其他</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="startTime" label="开始时间" :formatter="timestampToDate" header-align="center" align="center">
        </el-table-column>
        <el-table-column prop="endTime" label="结束时间" :formatter="timestampToDate" header-align="center" align="center">
        </el-table-column>
        <el-table-column prop="status" label="活动状态" header-align="center" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status === 1" size="small" type="primary">启用</el-tag>
            <el-tag v-else-if="scope.row.status === 0" size="small" type="primary">禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdDate" label="创建时间" :formatter="timestampToDate" header-align="center" align="center"></el-table-column>
        <el-table-column prop="updatedDate" label="更新时间" :formatter="timestampToDate" header-align="center" align="center"></el-table-column>
        <el-table-column prop="androidChannel" label="android渠道" header-align="center" align="center"></el-table-column>
        <el-table-column prop="iosChannel" label="ios渠道" header-align="center" align="center"></el-table-column>
        <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <el-button v-if="$hasPermission('newbie:cfactive:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">{{ $t('update') }}</el-button>
            <el-button v-if="$hasPermission('newbie:cfactive:delete')" type="text" size="small" @click="deleteHandle(scope.row.id)">{{ $t('delete') }}</el-button>
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
import AddOrUpdate from './cfactive-add-or-update'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/newbie/cfactive/page',
        getDataListIsPage: true,
        deleteURL: '/newbie/cfactive',
        deleteIsBatch: true
      },
      dataForm: {
        id: ''
      },
      orderField: 'updatedDate',
      order: 'desc'
    }
  },
  components: {
    AddOrUpdate
  }
}
</script>
