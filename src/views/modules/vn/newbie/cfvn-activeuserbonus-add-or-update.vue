<template>
  <el-dialog :visible.sync="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" :label-width="$i18n.locale === 'en-US' ? '120px' : '80px'">
          <el-form-item label="交易账号" prop="customerNo">
          <el-input v-model="dataForm.customerNo" placeholder="交易账号"></el-input>
      </el-form-item>
          <el-form-item label="任务名称" prop="taskName">
          <el-input v-model="dataForm.taskName" placeholder="任务名称"></el-input>
      </el-form-item>
          <el-form-item label="任务编号" prop="task">
          <el-input v-model="dataForm.task" placeholder="任务编号"></el-input>
      </el-form-item>
          <el-form-item label="奖励金额" prop="amount">
          <el-input v-model="dataForm.amount" placeholder="奖励金额"></el-input>
      </el-form-item>
          <el-form-item label="创建时间" prop="createdDate">
          <el-input v-model="dataForm.createdDate" placeholder="创建时间"></el-input>
      </el-form-item>
          <el-form-item label="更新时间" prop="updatedDate">
          <el-input v-model="dataForm.updatedDate" placeholder="更新时间"></el-input>
      </el-form-item>
          <el-form-item label="更新人" prop="updatedUser">
          <el-input v-model="dataForm.updatedUser" placeholder="更新人"></el-input>
      </el-form-item>
          <el-form-item label="订单号" prop="orderNo">
          <el-input v-model="dataForm.orderNo" placeholder="订单号"></el-input>
      </el-form-item>
          <el-form-item label="活动名称" prop="activeName">
          <el-input v-model="dataForm.activeName" placeholder="活动名称"></el-input>
      </el-form-item>
          <el-form-item label="活动编号" prop="activeNo">
          <el-input v-model="dataForm.activeNo" placeholder="活动编号"></el-input>
      </el-form-item>
          <el-form-item label="活动开始时间" prop="startTime">
          <el-input v-model="dataForm.startTime" placeholder="活动开始时间"></el-input>
      </el-form-item>
          <el-form-item label="活动结束时间" prop="endTime">
          <el-input v-model="dataForm.endTime" placeholder="活动结束时间"></el-input>
      </el-form-item>
          <el-form-item label="客户姓名" prop="chineseName">
          <el-input v-model="dataForm.chineseName" placeholder="客户姓名"></el-input>
      </el-form-item>
          <el-form-item label="手机" prop="phone">
          <el-input v-model="dataForm.phone" placeholder="手机"></el-input>
      </el-form-item>
          <el-form-item label="奖励金额(人民币)" prop="amountCNY">
          <el-input v-model="dataForm.amountCNY" placeholder="奖励金额(人民币)"></el-input>
      </el-form-item>
          <el-form-item label="用户开户时间" prop="customerCreateTime">
          <el-input v-model="dataForm.customerCreateTime" placeholder="用户开户时间"></el-input>
      </el-form-item>
          <el-form-item label="用户激活时间" prop="customerActivatedTime">
          <el-input v-model="dataForm.customerActivatedTime" placeholder="用户激活时间"></el-input>
      </el-form-item>
          <el-form-item label="用户状态" prop="customerStatus">
          <el-input v-model="dataForm.customerStatus" placeholder="用户状态"></el-input>
      </el-form-item>
          <el-form-item label="平台" prop="platform">
          <el-input v-model="dataForm.platform" placeholder="平台"></el-input>
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
        customerNo: '',
        taskName: '',
        task: '',
        amount: '',
        createdDate: '',
        updatedDate: '',
        updatedUser: '',
        orderNo: '',
        activeName: '',
        activeNo: '',
        startTime: '',
        endTime: '',
        chineseName: '',
        phone: '',
        amountCNY: '',
        customerCreateTime: '',
        customerActivatedTime: '',
        customerStatus: '',
        platform: ''
      }
    }
  },
  computed: {
    dataRule () {
      return {
        customerNo: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        taskName: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        task: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        amount: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        createdDate: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        updatedDate: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        updatedUser: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        orderNo: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        activeName: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        activeNo: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        startTime: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        endTime: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        chineseName: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        phone: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        amountCNY: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        customerCreateTime: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        customerActivatedTime: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        customerStatus: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        platform: [
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
      this.$http.get(`/newbie/cfvnActiveUserBonus/${this.dataForm.id}`).then(({ data: res }) => {
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
        this.$http[!this.dataForm.id ? 'post' : 'put']('/newbie/cfvnActiveUserBonus/', this.dataForm).then(({ data: res }) => {
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
