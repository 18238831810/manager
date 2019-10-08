<template>
  <el-dialog :visible.sync="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" :label-width="$i18n.locale === 'en-US' ? '120px' : '80px'">
      <el-form-item label="活动名称" prop="activeName">
          <el-input v-model="dataForm.activeName" placeholder="活动名称"></el-input>
      </el-form-item>
      <el-form-item label="活动时间">
        <el-col :span="11">
          <el-date-picker type="datetime" placeholder="开始时间" v-model="startTime" value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%;"></el-date-picker>
        </el-col>
        <el-col class="line" :span="2">-</el-col>
        <el-col :span="11">
          <el-date-picker type="datetime" placeholder="结束时间" v-model="endTime" value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%;"></el-date-picker>
        </el-col>
      </el-form-item>
      <el-form-item label="活动状态" prop="status">
        <el-select v-model="dataForm.status" placeholder="活动状态" clearable>
          <el-option v-for="item in statusOptions" :key="item.value" :value="item.value" :label="item.label"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="奖励描述" prop="bonusDesc">
          <el-input v-model="dataForm.bonusDesc" placeholder="奖励描述"></el-input>
      </el-form-item>
      <el-form-item label="链接地址" prop="url">
          <el-input v-model="dataForm.url" placeholder="链接地址"></el-input>
      </el-form-item>
      <el-form-item prop="activeDescribe" label="活动描述">
        <div id="J_quillEditor"></div>
      </el-form-item>
      <el-form-item prop="userList" label="黑名单">
        <el-col :span="16">
          <el-input v-model="dataForm.userList" placeholder="黑名单"></el-input>
        </el-col>
        <el-col :span="3">
          <el-upload
            action="/"
            :on-change='onChange'
            :auto-upload='false'
            :show-file-list="false"
            accept=".xls, .xlsx" 
          >
            <el-button size="small" type="primary">上传</el-button>
          </el-upload>
        </el-col>
        <el-col :span="3">
          <el-button @click="download" type="success" plain>下载模板</el-button>
        </el-col>
      </el-form-item>
      <el-form-item label="android渠道">
        <el-checkbox-group v-model="checkedAndroidChannels">
          <el-checkbox v-for="item in androidChannelOptions" :label="item.pkg" :key="item.name">{{item.name}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="ios渠道">
        <el-checkbox-group v-model="checkedIosChannels">
          <el-checkbox v-for="item in iosChannelOptions" :label="item.pkg" :key="item.name" >{{item.name}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="参与用户">
        <el-col :span="11">
          <el-date-picker type="datetime" placeholder="真实开户开始时间" v-model="openAccountStartTime" value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%;"></el-date-picker>
        </el-col>
        <el-col class="line" :span="2">-</el-col>
        <el-col :span="11">
          <el-date-picker type="datetime" placeholder="真实开户结束时间" v-model="openAccountEndTime" value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%;"></el-date-picker>
        </el-col>
      </el-form-item>
      <el-form-item label="参与用户状态">
        <el-checkbox-group v-model="checkJoinCustomerStatus">
          <el-checkbox label="0">未激活</el-checkbox>
          <el-checkbox label="1">已激活（未完善资料）</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="游客是否显示红包">
        <el-radio-group v-model="dataForm.alwaysShow">
        <el-radio :label="1">是</el-radio>
        <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="任务与奖励">
        <el-card v-for="(reward, index) in rewardArr" :key="index" class="box-card">
          <div slot="header" class="clearfix">
            <span>任务{{index + 1}}</span>
            <span style="float: right; padding: 3px 0">
              <el-button type="text" @click="addReward()">新增</el-button>
              <el-button v-if="rewardArr.length > 1" type="text" @click="delReward(index)">删除</el-button>
            </span>
          </div>
          <div>
            <el-form-item label="任务">
              <el-select v-model="reward.task" placeholder="请选择">
                <el-option v-for="taskItem in taskList" :key="taskItem.value" :label="taskItem.name" :value="taskItem.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="任务描述">
              <el-input v-model="reward.describe" placeholder="任务描述"></el-input>
            </el-form-item>
            <el-form-item label="奖励物品">
              <el-select v-model="reward.rewardType" placeholder="请选择">
                <el-option v-for="rewardTypeItem in rewardTypeList" :key="rewardTypeItem.value" :label="rewardTypeItem.name" :value="rewardTypeItem.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="赠金额度">
              <el-input v-model="reward.rewardValue" placeholder="赠金额度"></el-input>
            </el-form-item>
          </div>
        </el-card>
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
import 'quill/dist/quill.snow.css'
import Quill from 'quill'
import qs from 'qs'
import XLSX from 'xlsx'
import {timestampToDate, dateToTimestamp} from '@/utils/common'
export default {
  data () {
    return {
      visible: false,
      statusOptions: [{
        value: 0,
        label: '禁用'
      }, {
        value: 1,
        label: '启用'
      }],
      userList:[],
      iosChannelOptions: [],
      androidChannelOptions: [],
      checkedIosChannels: [],
      checkedAndroidChannels: [],
      checkJoinCustomerStatus: [],
      startTime: '',
      endTime: '',
      openAccountStartTime: '',
      openAccountEndTime: '',
      quillEditor: null,
      quillEditorToolbarOptions: [
        ['bold', 'italic', 'underline', 'strike'],
        ['blockquote', 'code-block'],
        [{'header': 1 }, { 'header': 2 }],
        [{'list': 'ordered' }, { 'list': 'bullet' }],
        [{'script': 'sub' }, { 'script': 'super' }],
        [{'indent': '-1' }, { 'indent': '+1' }],
        [{'direction': 'rtl' }],
        [{'size': ['small', false, 'large', 'huge'] }],
        [{'header': [1, 2, 3, 4, 5, 6, false] }],
        [{'color': [] }, { 'background': [] }],
        [{'font': [] }],
        [{'align': [] }],
        ['clean']
      ],
      dataForm: {
        id: '',
        activeNo: '',
        activeName: '',
        activeType: '',
        startTime: '',
        endTime: '',
        status: '',
        activeDescribe: '',
        url: '',
        listType: '',
        userList: '',
        taskContent: '',
        createdDate: '',
        updatedDate: '',
        updatedUser: '',
        taskId: '',
        channel: '',
        bonusDesc: '',
        platform: '',
        androidChannel: '',
        iosChannel: '',
        joincustomerStatus: '',
        incustomercreatedDate: '',
        alwaysShow: '',
        openAccountStartTime: '',
        openAccountEndTime: ''
      },
      rewardArr:[{
        describe: "",
        rewardCount: "",
        rewardType: "1",
        rewardValue: "0",
        task: "1",
        title: ""
      }],
      taskList: [
        {name:"开通真实账户", value:"1"},
        {name:"体验模拟交易", value:"2"},
        {name:"完善资料", value:"3"},
        {name:"首次入金", value:"4"},
        {name:"累计交易1手外汇", value:"5"},
        {name:"累计交易1手商品", value:"6"},
        {name:"累计交易1手指数", value:"7"},
        {name:"累计交易1手虚拟币", value:"8"},
        {name:"交易下单", value:"9"},
        {name:"累计交易1手股票", value:"10"}
      ],
      rewardTypeList: [
        {name:"赠金", value:"1"},
      ]
    }
  },
  computed: {
    dataRule () {
      return {
        activeName: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        activeType: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        startTime: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        endTime: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        status: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        activeDescribe: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        url: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        taskContent: [
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
        channel: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        bonusDesc: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        platform: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        androidChannel: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        iosChannel: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        joincustomerStatus: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        incustomercreatedDate: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        alwaysShow: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init () {
      this.visible = true
      this.$nextTick(() => {
        
        //获取渠道列表
        if(this.androidChannelOptions.length == 0 && this.iosChannelOptions.length == 0){
          this.getChannels ()
        }
        
        if (this.quillEditor) {
          this.quillEditor.deleteText(0, this.quillEditor.getLength())
        } else {
          this.quillEditorHandle()
        }

        this.resetForm()
        if (this.dataForm.id) {
          this.getInfo()
        }
      })
    },

    //重置表单
    resetForm(){
      this.$refs['dataForm'].resetFields()
      this.checkedIosChannels = []
      this.checkedAndroidChannels = []
      this.checkJoinCustomerStatus = []
      this.startTime = ''
      this.endTime = ''
      this.openAccountStartTime = ''
      this.openAccountEndTime = ''
      this.rewardArr = [{
        describe: "",
        rewardCount: "",
        rewardType: "1",
        rewardValue: "0",
        task: "1",
        title: ""
      }]

    },

    // 富文本编辑器
    quillEditorHandle () {
      this.quillEditor = new Quill('#J_quillEditor', {
        modules: {
          toolbar: this.quillEditorToolbarOptions
        },
        theme: 'snow'
      })
      // 监听内容变化，动态赋值
      this.quillEditor.on('text-change', () => {
        this.dataForm.activeDescribe = this.quillEditor.root.innerHTML
      })
    },
    
    // 获取渠道列表
    getChannels () {
      this.$http.get(`/newbie/cfactivechannel/list`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }

        for(let channel of res.data){
          if(channel.os == "ios"){
            this.iosChannelOptions.push(channel)
          }else{
            this.androidChannelOptions.push(channel)
          }
        }
      }).catch(() => {})
    },
    // 获取信息
    getInfo () {
      this.$http.get(`/newbie/cfactive/${this.dataForm.id}`).then(({ data: res }) => {
        //console.log(res);
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.dataForm = {
          ...res.data
        }
        
        //活动开始时间
        this.startTime = timestampToDate( this.dataForm.startTime);
        //活动结束时间
        this.endTime = timestampToDate(this.dataForm.endTime);
        //真实开户开始时间
        this.openAccountStartTime = timestampToDate(this.dataForm.openAccountStartTime)
        //真实开户结束时间
        this.openAccountEndTime = timestampToDate(this.dataForm.openAccountEndTime);
        //ios渠道
        this.checkedIosChannels = this.dataForm.iosChannel? this.dataForm.iosChannel.split(",") : []
        //android渠道
        this.checkedAndroidChannels = this.dataForm.androidChannel? this.dataForm.androidChannel.split(",") : []
        //活动描述
        this.quillEditor.root.innerHTML = this.dataForm.activeDescribe
        //参与用户状态
        this.checkJoinCustomerStatus = this.dataForm.joincustomerStatus? this.dataForm.joincustomerStatus.split(",") : []
        //任务列表详情
        if(res.data.taskContent){
          this.rewardArr = JSON.parse(res.data.taskContent)
        }
      }).catch(() => {})
    },
    // 表单提交
    dataFormSubmitHandle: debounce(function () {
      this.$refs['dataForm'].validate((valid) => {
        if (!valid) {
          return false
        }

        //活动开始时间
        this.dataForm.startTime = dateToTimestamp(this.startTime)
        //活动结束时间
        this.dataForm.endTime = dateToTimestamp(this.endTime)
        //真实开户开始时间
        this.dataForm.openAccountStartTime = dateToTimestamp(this.openAccountStartTime)
        //真实开户结束时间
        this.dataForm.openAccountEndTime = dateToTimestamp(this.openAccountEndTime)
        //ios渠道
        this.dataForm.iosChannel = this.checkedIosChannels.join()
        //android渠道
        this.dataForm.androidChannel = this.checkedAndroidChannels.join()
        //任务列表详情
        this.dataForm.taskContent = JSON.stringify(this.rewardArr);
        //参与用户状态
        this.dataForm.joincustomerStatus = this.checkJoinCustomerStatus.join()

        this.$http[!this.dataForm.id ? 'post' : 'put']('/newbie/cfactive/', this.dataForm).then(({ data: res }) => {
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
    }, 1000, { 'leading': true, 'trailing': false }),

    //删除任务项
    delReward (index) {
      this.rewardArr.splice(index, 1)
    },
    //新增任务项
    addReward () {
      this.rewardArr.push({
        task: "1",
        describe: "",
        rewardCount: "",
        rewardType: "1",
        rewardValue: "0",
        title: ""
      })
    },
    // 文件选择回调
    onChange(file,fileList){
      this.fileData = file // 保存当前选择文件
      this.readExcel() // 调用读取数据的方法
    },
    // 读取数据
    readExcel(e) {
      let that = this;
      const files = that.fileData;
      if (!files) {
        //如果没有文件
        return false;
      } else if (!/\.(xls|xlsx)$/.test(files.name.toLowerCase())) {
        this.$message.error("上传格式不正确，请上传xls或者xlsx格式");
        return false;
      }
      const fileReader = new FileReader();
      fileReader.onload = ev => {
        try {
          const data = ev.target.result;
          const workbook = XLSX.read(data, {
            type: "binary"
          });
          const wsname = workbook.SheetNames[0]; //取第一张表
          const ws = XLSX.utils.sheet_to_json(workbook.Sheets[wsname]); //生成json表格内容
          that.userList = []; //清空接收数据
          for (var i = 0; i < ws.length; i++) {
            var sheetData = ws[i]['交易账号'];
            that.userList.push(sheetData);
          }
          that.dataForm.userList = that.userList.join()
          //this.$refs.upload.value = "";
        } catch (e) {
          return false;
        }
      };
      // 如果为原生 input 则应是 files[0]
      fileReader.readAsBinaryString(files.raw);
    },
    download () {
      var params = qs.stringify({
        'token': sessionStorage.getItem('token')
      })
      window.location.href = `${window.SITE_CONFIG['apiURL']}/newbie/cfactive/excel/download?${params}`
    }
  }
}
</script>
<style scoped>
.line {
    text-align: center;
}
</style>
