<template>
  <el-dialog :visible.sync="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" :label-width="$i18n.locale === 'en-US' ? '120px' : '80px'">
          <el-form-item label="手机号" prop="phone">
          <el-input v-model="dataForm.phone" placeholder="手机号"></el-input>
      </el-form-item>
          <el-form-item label="金额" prop="count">
          <el-input v-model="dataForm.count" placeholder="金额"></el-input>
      </el-form-item>
          <el-form-item label="收入/支出" prop="outInType">
          <el-input v-model="dataForm.outInType" placeholder="收入/支出"></el-input>
      </el-form-item>
          <el-form-item label="具体类型" prop="detailType">
          <el-input v-model="dataForm.detailType" placeholder="具体类型"></el-input>
      </el-form-item>
          <el-form-item label="类型图标" prop="picRes">
          <el-input v-model="dataForm.picRes" placeholder="类型图标"></el-input>
      </el-form-item>
          <el-form-item label="时间" prop="time">
          <el-input v-model="dataForm.time" placeholder="时间"></el-input>
      </el-form-item>
          <el-form-item label="支付方式" prop="payType">
          <el-input v-model="dataForm.payType" placeholder="支付方式"></el-input>
      </el-form-item>
          <el-form-item label="余额" prop="accountBalance">
          <el-input v-model="dataForm.accountBalance" placeholder="余额"></el-input>
      </el-form-item>
          <el-form-item label="上次余额" prop="preAccountBalance">
          <el-input v-model="dataForm.preAccountBalance" placeholder="上次余额"></el-input>
      </el-form-item>
          <el-form-item label="备注" prop="note">
          <el-input v-model="dataForm.note" placeholder="备注"></el-input>
      </el-form-item>
          <el-form-item label="标签" prop="remark">
          <el-input v-model="dataForm.remark" placeholder="标签"></el-input>
      </el-form-item>
          <el-form-item label="记账类型" prop="accountType">
          <el-input v-model="dataForm.accountType" placeholder="记账类型"></el-input>
      </el-form-item>
          <el-form-item label="创建人" prop="creator">
          <el-input v-model="dataForm.creator" placeholder="创建人"></el-input>
      </el-form-item>
          <el-form-item label="创建时间" prop="createDate">
          <el-input v-model="dataForm.createDate" placeholder="创建时间"></el-input>
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
        count: '',
        outInType: '',
        detailType: '',
        picRes: '',
        time: '',
        payType: '',
        accountBalance: '',
        preAccountBalance: '',
        note: '',
        remark: '',
        accountType: '',
        creator: '',
        createDate: ''
      }
    }
  },
  computed: {
    dataRule () {
      return {
        phone: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        count: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        outInType: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        detailType: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        picRes: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        time: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        payType: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        accountBalance: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        preAccountBalance: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        note: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        remark: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        accountType: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        creator: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        createDate: [
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
      this.$http.get(`/debt/record/${this.dataForm.id}`).then(({ data: res }) => {
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
        this.$http[!this.dataForm.id ? 'post' : 'put']('/debt/record/', this.dataForm).then(({ data: res }) => {
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
