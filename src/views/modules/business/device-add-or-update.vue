<template>
  <el-dialog :visible.sync="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" :label-width="$i18n.locale === 'en-US' ? '120px' : '80px'">
          <el-form-item label="设备ID" prop="deviceId">
          <el-input v-model="dataForm.deviceId" placeholder="设备ID"></el-input>
      </el-form-item>
          <el-form-item label="真实账号" prop="customerNo">
          <el-input v-model="dataForm.customerNo" placeholder="真实账号"></el-input>
      </el-form-item>
          <el-form-item label="模拟账号" prop="customerNoDemo">
          <el-input v-model="dataForm.customerNoDemo" placeholder="模拟账号"></el-input>
      </el-form-item>
          <el-form-item label="真实姓名" prop="chineseName">
          <el-input v-model="dataForm.chineseName" placeholder="真实姓名"></el-input>
      </el-form-item>
          <el-form-item label="手机号码" prop="phone">
          <el-input v-model="dataForm.phone" placeholder="手机号码"></el-input>
      </el-form-item>
          <el-form-item label="账号类型" prop="accountType">
          <el-input v-model="dataForm.accountType" placeholder="账号类型"></el-input>
      </el-form-item>
          <el-form-item label="模拟开户时间" prop="customerCreateTime">
          <el-date-picker
            v-model="customerCreateTime"
            type="datetime"
            placeholder="模拟开户时间">
          </el-date-picker>
      </el-form-item>
          <el-form-item label="真实开户时间" prop="customerDemoCreateTime">
          <el-date-picker
            v-model="customerDemoCreateTime"
            type="datetime"
            placeholder="真实开户时间">
          </el-date-picker>
      </el-form-item>
          <el-form-item label="激活时间" prop="customerActivatedTime">
          <el-date-picker
            v-model="customerActivatedTime"
            type="datetime"
            placeholder="激活时间">
          </el-date-picker>
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
import {timestampToDate, dateToTimestamp} from '@/utils/common'
export default {
  data () {
    return {
      visible: false,
      customerCreateTime: '',
      customerDemoCreateTime: '',
      customerActivatedTime: '',
      dataForm: {
        id: '',
        deviceId: '',
        customerNo: '',
        customerNoDemo: '',
        chineseName: '',
        phone: '',
        accountType: '',
        customerCreateTime: '',
        customerDemoCreateTime: '',
        customerActivatedTime: ''
      }
    }
  },
  computed: {
    dataRule () {
      return {
        deviceId: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        customerNo: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        customerNoDemo: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        chineseName: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        phone: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        accountType: [
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
      this.$http.get(`/business/device/${this.dataForm.id}`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.dataForm = {
          ...this.dataForm,
          ...res.data
        }

        this.customerCreateTime = timestampToDate( this.dataForm.customerCreateTime);
        this.customerDemoCreateTime = timestampToDate( this.dataForm.customerDemoCreateTime);
        this.customerActivatedTime = timestampToDate( this.dataForm.customerActivatedTime);
      }).catch(() => {})
    },
    // 表单提交
    dataFormSubmitHandle: debounce(function () {
      this.$refs['dataForm'].validate((valid) => {
        if (!valid) {
          return false
        }

        this.dataForm.customerCreateTime = dateToTimestamp(this.customerCreateTime)
        this.dataForm.customerDemoCreateTime = dateToTimestamp(this.customerDemoCreateTime)
        this.dataForm.customerActivatedTime = dateToTimestamp(this.customerActivatedTime)

        this.$http[!this.dataForm.id ? 'post' : 'put']('/business/device/', this.dataForm).then(({ data: res }) => {
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
