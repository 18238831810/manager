<template>
  <el-dialog :visible.sync="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" :label-width="$i18n.locale === 'en-US' ? '120px' : '80px'">
          <el-form-item label="手机号" prop="phone">
          <el-input v-model="dataForm.phone" placeholder="手机号"></el-input>
      </el-form-item>
          <el-form-item label="现金" prop="cash">
          <el-input v-model="dataForm.cash" placeholder="现金"></el-input>
      </el-form-item>
          <el-form-item label="银行卡" prop="bankCard">
          <el-input v-model="dataForm.bankCard" placeholder="银行卡"></el-input>
      </el-form-item>
          <el-form-item label="信用卡" prop="creditCard">
          <el-input v-model="dataForm.creditCard" placeholder="信用卡"></el-input>
      </el-form-item>
          <el-form-item label="微信" prop="wechatPay">
          <el-input v-model="dataForm.wechatPay" placeholder="微信"></el-input>
      </el-form-item>
          <el-form-item label="支付宝" prop="alipay">
          <el-input v-model="dataForm.alipay" placeholder="支付宝"></el-input>
      </el-form-item>
          <el-form-item label="理财" prop="finance">
          <el-input v-model="dataForm.finance" placeholder="理财"></el-input>
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
export default {
  data () {
    return {
      visible: false,
      dataForm: {
        id: '',
        phone: '',
        cash: '',
        bankCard: '',
        creditCard: '',
        wechatPay: '',
        alipay: '',
        finance: ''
      }
    }
  },
  computed: {
    dataRule () {
      return {
        phone: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        cash: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        bankCard: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        creditCard: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        wechatPay: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        alipay: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        finance: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init () {
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          this.getInfo()
        }
      })
    },
    // 获取信息
    getInfo () {
      this.$http.get(`/debt/card/${this.dataForm.id}`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.dataForm = {
          ...this.dataForm,
          ...res.data
        }
      }).catch(() => {})
    },
    // 表单提交
    dataFormSubmitHandle: debounce(function () {
      this.$refs['dataForm'].validate((valid) => {
        if (!valid) {
          return false
        }
        this.$http[!this.dataForm.id ? 'post' : 'put']('/debt/card/', this.dataForm).then(({ data: res }) => {
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
        }).catch(() => {})
      })
    }, 1000, { 'leading': true, 'trailing': false })
  }
}
</script>
