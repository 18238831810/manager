<template>
    <el-dialog :visible.sync="visible" :close-on-click-modal="false" :close-on-press-escape="false">
        <el-form :model="dataForm" ref="dataForm">
            <el-form-item label="信用卡名称" prop="name">
                <el-input v-model="dataForm.name" placeholder="信用卡名称"></el-input>
            </el-form-item>
            <el-form-item label="简介" prop="remark">
                <el-input v-model="dataForm.remark" placeholder="简介"></el-input>
            </el-form-item>
            <el-form-item label="所属银行" prop="bankName">
                <el-select v-model="dataForm.bankName" placeholder="所属银行">
                    <el-option
                            v-for="bank in selectList.bankList"
                            :key="bank"
                            :label="bank"
                            :value="bank">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="图片预览" v-if="dataForm.imgUrl && dataForm.imgUrl != ''" class="marginTop">
                <div><img style="width: 150px" :src="dataForm.imgUrl"></div>
            </el-form-item>
            <el-form-item label="信用卡图片" prop="logoUrl">
                <el-upload
                        class="upload-demo"
                        :on-success="uploadSuc"
                        :action="uploadUrl"
                        :show-file-list="false"
                        :auto-upload="true"
                        :on-progress="uploading">
                    <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                    <span v-if="uploadLoad">正在上传...</span>
                </el-upload>
                <el-input v-model="dataForm.imgUrl" placeholder="银行logo的url地址"></el-input>
            </el-form-item>
            <el-form-item label="卡片等级" prop="level">
                <el-radio-group v-model="dataForm.level">
                    <el-radio v-for="level in selectList.levelList" :label="level" :key="level"></el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="卡片币种" prop="currency">
                <el-checkbox-group v-model="dataForm.currencyList">
                    <el-checkbox v-for="currency in selectList.currencyList" :label="currency" :key="currency">
                    </el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item label="发卡组织" prop="organization">
                <el-checkbox-group v-model="dataForm.organizationList">
                    <el-checkbox v-for="organization in selectList.organizationList" :label="organization" :key="organization">
                    </el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item label="办卡url" prop="cardUrl">
                <el-input v-model="dataForm.cardUrl" placeholder="办卡url"></el-input>
            </el-form-item>
            <el-form-item label="免息期限" prop="gracePeriod">
                <el-input v-model="dataForm.gracePeriodStart"></el-input>
                <el-input v-model="dataForm.gracePeriodEnd"></el-input>
            </el-form-item>
            <el-form-item label="卡片描述" prop="cardUrl">
                <quil ref="quil"></quil>
            </el-form-item>

        </el-form>
        <template slot="footer">
            <el-button @click="visible = false">{{ $t('cancel') }}</el-button>
            <el-button type="primary" @click="submit">{{ $t('confirm') }}</el-button>
        </template>
    </el-dialog>
</template>

<script>
    import quil from "@/views/table/quil.vue"
    export default {
        props:["selectList"],
        components:{
            quil
        },
        data() {
            return {
                visible: false,
                isUpdata: false,
                dataForm: {
                    currencyList:[],
                    organizationList:[],
                },
                //背景图片上传状态
                uploadLoad: false,
                uploadUrl: process.env.VUE_APP_API + "/public/card/upload",

            }
        },
        computed: {},
        methods: {
            init(){
                this.$nextTick(() => {
                    this.$refs.quil.init(this.dataForm.content);
                });
            },
            initUpdate(row){
                this.visible = true;
                this.isUpdata = true;
                this.dataForm = JSON.parse(JSON.stringify(row));
                this.$set(this.dataForm,"organizationList",this.dataForm.organization.split(",") || []);
                this.$set(this.dataForm,"currencyList",this.dataForm.currency.split(",")||[]);
                if (this.dataForm != "") {
                    const gracePeriodList = String(this.dataForm.gracePeriod).split("~");
                    this.dataForm.gracePeriodStart = gracePeriodList[0];
                    if (gracePeriodList.length > 1)  this.dataForm.gracePeriodEnd = gracePeriodList[1];
                }
                this.init();
            },
            //上传logo成功
            uploadSuc(response, file, fileList) {
                this.uploadLoad = false;
                if (response.code == 200) this.dataForm.imgUrl = response.data;
            },
            uploading(){
                this.uploadLoad = true;
            },
            isExist(val) {
                if (val == null || val === "") return false;
                return true;
            },
            submitVa(){
                this.dataForm.content = this.$refs.quil.getHtml();
                if(!this.isExist(this.dataForm.name)) return "名称不能为空";
                if(!this.isExist(this.dataForm.bankName)) return "所属银行不能为空";
                if(!this.isExist(this.dataForm.imgUrl)) return "信用卡图片不能为空";
                if(!this.isExist(this.dataForm.level)) return "请选择卡片等级";
                if(this.dataForm.currencyList.length <= 0) return "请选择卡片币种";
                if(this.dataForm.organizationList.length <= 0) return "请选择发卡组织";
                if(!this.isExist(this.dataForm.cardUrl)) return "信用卡url不能为空";
                if(!this.isExist(this.dataForm.content)) return "信用卡描述不能为空";
                return null;
            },
            //提交前的数据格式化
            dataFormat(){
                this.dataForm.currency = this.dataForm.currencyList.join(",");
                this.dataForm.organization = this.dataForm.organizationList.join(",");
                this.dataForm.gracePeriod = this.dataForm.gracePeriodStart === ""?0:this.dataForm.gracePeriodStart +"~"+(this.dataForm.gracePeriodEnd === ""?0:this.dataForm.gracePeriodEnd);
            },
            submit(){
                const vaResult = this.submitVa();
                if (vaResult) {//验证不通过，展示报错内容
                    this.$alert(vaResult, "操作失败" , {
                        confirmButtonText: '确定',
                    });
                    return;
                }
                this.dataFormat();
                const readyData = this.$qs.stringify(this.dataForm);
                const url = this.isUpdata?"/card/card/update":"/card/card/save";
                console.log(this.dataForm);
                this.$http.post(url, readyData).then(res => {
                    if (res.status == 200 && res.data.code == 200) {
                        this.$alert('操作成功', "操作成功" , {
                            confirmButtonText: '确定',
                        });
                        this.visible = false;
                        this.$parent.$parent.getDataList();
                    }else{
                        this.$alert(res.data.code_desc,'操作失败', {
                            confirmButtonText: '确定',
                        });
                    }
                });
            }
        },
        mounted() {

        }

    }
</script>
