<template>
  <el-dialog :visible.sync="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" :label-width="$i18n.locale === 'en-US' ? '120px' : '80px'">
          <el-form-item label="手机号" prop="phone">
          <el-input v-model="dataForm.phone" placeholder="手机号"></el-input>
      </el-form-item>
          <el-form-item label="注册时间" prop="registerDate">
          <el-input v-model="dataForm.registerDate" placeholder="注册时间"></el-input>
      </el-form-item>
          <el-form-item label="来源" prop="source">
          <el-input v-model="dataForm.source" placeholder="来源"></el-input>
      </el-form-item>
          <el-form-item label="媒介" prop="media">
          <el-input v-model="dataForm.media" placeholder="媒介"></el-input>
      </el-form-item>
          <el-form-item label="广告系列" prop="advertisement">
          <el-input v-model="dataForm.advertisement" placeholder="广告系列"></el-input>
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
        registerDate: '',
        source: '',
        media: '',
        advertisement: '',
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
        registerDate: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        source: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        media: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        advertisement: [
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
      this.$http.get(`/debt/user/${this.dataForm.id}`).then(({ data: res }) => {
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
        this.$http[!this.dataForm.id ? 'post' : 'put']('/debt/user/', this.dataForm).then(({ data: res }) => {
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
