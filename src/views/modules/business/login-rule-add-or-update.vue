<template>
  <el-dialog :visible.sync="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" :label-width="$i18n.locale === 'en-US' ? '120px' : '80px'">
      <el-form-item label="限制人群">
        异常登陆用户
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="dataForm.status" placeholder="状态" clearable>
          <el-option v-for="item in statusOptions" :key="item.value" :value="item.value" :label="item.label"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="限制规则" prop="count">
        <el-checkbox-group v-model="checkRestrictType">
          <el-checkbox label="1">登陆</el-checkbox>
          <el-checkbox label="2">开仓</el-checkbox>
        </el-checkbox-group>
        <div>
          人脸识别成功<el-input-number v-model="dataForm.count" controls-position="right" :min="0" label="" size="mini"></el-input-number>次后，当日无需再做人脸识别验证
        </div>
      </el-form-item>
      <el-form-item label="生效时间" prop="effectiveDate">
        <el-date-picker v-model="dataForm.effectiveDate" type="datetime" placeholder="生效时间"></el-date-picker>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="dataForm.remark" placeholder="备注"></el-input>
      </el-form-item>
    </el-form>
    <template slot="footer">
      <el-button @click="visible = false">{{ $t('cancel') }}</el-button>
      <el-button type="primary" @click="dataFormSubmitHandle()">{{ $t('confirm') }}</el-button>
    </template>
  </el-dialog>
</template>

<script>
import debounce from 'lodash/debounce'
import { timestampToDate, dateToTimestamp } from '@/utils/common'
export default {
  data() {
    return {
      visible: false,
      statusOptions: [{
        value: 1,
        label: '启用'
      }, {
        value: 0,
        label: '禁用'
      }],
      checkRestrictType: [],
      dataForm: {
        id: '',
        status: '',
        count: 0,
        restrictType: '',
        remark: '',
        effectiveDate: ''
      }
    }
  },
  computed: {
    dataRule() {
      return {
        status: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        count: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        restrictType: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        remark: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        effectiveDate: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init() {
      this.visible = true
      this.$nextTick(() => {
        //重置表单
        this.$refs['dataForm'].resetFields()
        this.checkRestrictType = []
        if (this.dataForm.id) {
          this.getInfo()
        }
      })
    },
    // 获取信息
    getInfo() {
      this.$http.get(`/business/loginRule/${this.dataForm.id}`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.dataForm = {
          ...this.dataForm,
          ...res.data
        }
        //限制规则
        this.checkRestrictType = this.dataForm.restrictType? this.dataForm.restrictType.split(",") : []
      }).catch(() => { })
    },
    // 表单提交
    dataFormSubmitHandle: debounce(function () {
      this.$refs['dataForm'].validate((valid) => {
        if (!valid) {
          return false
        }
        //限制规则
        this.dataForm.restrictType = this.checkRestrictType.join()
        this.$http[!this.dataForm.id ? 'post' : 'put']('/business/loginRule/', this.dataForm).then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg)
          }
          this.$message({
            message: this.$t('prompt.success'),
            type: 'success',
            duration: 500,
            onClose: () => {
              this.visible = false
              this.$emit('refreshDataList')
            }
          })
        }).catch(() => { })
      })
    }, 1000, { 'leading': true, 'trailing': false })
  }
}
</script>
