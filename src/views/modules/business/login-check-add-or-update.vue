<template>
  <el-dialog :visible.sync="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" :label-width="$i18n.locale === 'en-US' ? '120px' : '80px'">

      <el-form-item label="会员账户" prop="account">
        <el-input v-model="dataForm.account" placeholder="会员账户"></el-input>
      </el-form-item>

      <el-form-item label="常用登陆地址" prop="usuallyLoginAddress">
        <el-input v-model="dataForm.usuallyLoginAddress" placeholder="常用登陆地址"></el-input>
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
      dataForm: {
        id: '',
        account: '',
        usuallyLoginAddress: '',
        remark: ''
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
        if (this.dataForm.id) {
          this.getInfo()
        }
      })
    },
    // 获取信息
    getInfo() {
      this.$http.get(`/business/loginCheck/${this.dataForm.id}`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        res.data.usuallyLoginAddress = res.data.recentlyLoginAddress
        this.dataForm = {
          ...this.dataForm,
          ...res.data
        }
      }).catch(() => { })
    },
    // 表单提交
    dataFormSubmitHandle: debounce(function () {
      this.$refs['dataForm'].validate((valid) => {
        if (!valid) {
          return false
        }
        this.$http[!this.dataForm.id ? 'post' : 'put']('/business/loginCheck/', this.dataForm).then(({ data: res }) => {
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
