<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-business__device}">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item>
          <el-select v-model="dataForm.status" placeholder="状态" clearable>
            <el-option label="启用" value="1"></el-option>
            <el-option label="禁用" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDataList()">{{ $t('query') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPermission('business:loginRule:save')" type="primary" @click="addOrUpdateHandle()">{{ $t('add') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPermission('business:loginRule:delete')" type="danger" @click="deleteHandle()">{{ $t('deleteBatch') }}</el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle" style="width: 100%;">
        <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
        <el-table-column prop="id" label="ID" header-align="center" align="center"  width="80"></el-table-column>
        <el-table-column label="限制人群" header-align="center" align="center">异常登陆用户</el-table-column>
        <el-table-column prop="status" label="状态" header-align="center" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status === 1" size="small" type="primary">启用</el-tag>
            <el-tag v-else-if="scope.row.status === 0" size="small" type="primary">禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="effectiveDate" :formatter="timestampToDate" label="生效时间" header-align="center" align="center"></el-table-column>
        <el-table-column prop="restrictType" :formatter="timestampToDate" label="限制规则" header-align="center" align="center">
          <template slot-scope="scope">
            <el-tag size="small" v-for="(n, index) in aaaa(scope.row.restrictType)" :key="index">{{ n }}</el-tag>
            人脸识别成功{{scope.row.count}}次后，当日无需再做人脸识别验证
          </template>
        </el-table-column>
        <el-table-column prop="createDate" :formatter="timestampToDate" label="创建时间" header-align="center" align="center"></el-table-column>
        <el-table-column prop="updateDate" :formatter="timestampToDate" label="修改时间" header-align="center" align="center"></el-table-column>
        <el-table-column prop="remark" label="备注" header-align="center" align="center"></el-table-column>
        <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <el-button v-if="$hasPermission('business:loginRule:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">{{ $t('update') }}</el-button>
            <el-button v-if="$hasPermission('business:loginRule:delete')" type="text" size="small" @click="deleteHandle(scope.row.id)">{{ $t('delete') }}</el-button>
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
import AddOrUpdate from './login-rule-add-or-update'
export default {
  mixins: [mixinViewModule],
  data() {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/business/loginRule/page',
        getDataListIsPage: true,
        deleteURL: '/business/loginRule',
        deleteIsBatch: true
      },
      dataForm: {
        id: '',
        status: '',
        count: '',
        restrictType: '',
        remark: '',
        effectiveDate: ''
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
