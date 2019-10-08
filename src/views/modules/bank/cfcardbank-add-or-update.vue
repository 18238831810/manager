<template>
    <el-dialog :visible.sync="visible" :close-on-click-modal="false" :close-on-press-escape="false">
        <el-form :model="dataForm">
            <el-form-item label="银行名称" prop="name">
                <el-input v-model="dataForm.name" placeholder="银行名称"></el-input>
            </el-form-item>

            <el-form-item label="图片预览" v-if="dataForm.logoUrl && dataForm.logoUrl != ''" class="marginTop">
                <div><img style="width: 150px" :src="dataForm.logoUrl"></div>
            </el-form-item>
            <el-form-item label="银行logo的url地址" prop="logoUrl">
                <el-upload
                        class="upload-demo"
                        :on-success="logoUploadSuc"
                        :action="uploadUrl"
                        :show-file-list="false"
                        :auto-upload="true"
                        :on-progress="logoUploading">
                    <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                    <span v-if="logoUploadLoad">正在上传...</span>
                </el-upload>
                <el-input v-model="dataForm.logoUrl" placeholder="银行logo的url地址"></el-input>
            </el-form-item>

            <el-form-item label="图片预览" v-if="dataForm.backGroundUrl && dataForm.backGroundUrl != ''" class="marginTop">
                <div><img style="width: 150px" :src="dataForm.backGroundUrl"></div>
            </el-form-item>
            <el-form-item label="背景图片" prop="backGroundUrl">
                <el-upload
                        class="upload-demo"
                        :on-success="imgUploadSuc"
                        :action="uploadUrl"
                        :show-file-list="false"
                        :auto-upload="true"
                        :on-progress="imgUploading">
                    <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                    <span v-if="imgUploadLoad">正在上传...</span>
                </el-upload>
                <el-input v-model="dataForm.backGroundUrl" placeholder="背景图片"></el-input>
            </el-form-item>
            <el-form-item label="银行说明" prop="remark">
                <el-input v-model="dataForm.remark" type="textarea" placeholder="银行说明"></el-input>
            </el-form-item>
            <el-form-item label="办卡进度url地址" prop="progressUrl">
                <el-input v-model="dataForm.progressUrl" placeholder="办卡进度url地址"></el-input>
            </el-form-item>
            <el-form-item label="激活url地址" prop="activeUrl">
                <el-input v-model="dataForm.activeUrl" placeholder="激活url地址"></el-input>
            </el-form-item>
        </el-form>
        <template slot="footer">
            <el-button @click="visible = false">{{ $t('cancel') }}</el-button>
            <el-button type="primary" @click="submit">{{ $t('confirm') }}</el-button>
        </template>
    </el-dialog>
</template>

<script>
    export default {
        data() {
            return {
                visible: false,
                isUpdata:false,
                dataForm: {},
                //logo上传状态
                logoUploadLoad:false,
                //背景图片上传状态
                imgUploadLoad:false,
                uploadUrl: process.env.VUE_APP_API+"/public/card/upload",
            }
        },
        computed: {},
        methods: {
            //上传logo成功
            logoUploadSuc(response, file, fileList) {
                this.logoUploadLoad = false;
                if (response.code == 200) this.dataForm.logoUrl = response.data;
            },
            //上传背景图片成功
            imgUploadSuc(response, file, fileList) {
                this.imgUploadLoad = false;
                if (response.code == 200) this.dataForm.backGroundUrl = response.data;
            },
            logoUploading(){
                this.logoUploadLoad = true;
            },
            imgUploading(){
                this.imgUploadLoad = true;
            },
            isExist(val){
                if (val == null || val === "") return false;
                return true;
            },
            submitVa(){
                if (!this.isExist(this.dataForm.name)) return "银行名称为空";
                if (!this.isExist(this.dataForm.logoUrl)) return "银行logo为空";
                if (!this.isExist(this.dataForm.backGroundUrl)) return "背景图片为空";
                if (!this.isExist(this.dataForm.remark)) return "银行说明为空";
                if (!this.isExist(this.dataForm.progressUrl)) return "办卡进度url为空";
                if (!this.isExist(this.dataForm.activeUrl)) return "激活url为空";
                return null;
            },
            submit(){
                const vaResult = this.submitVa();
                if (vaResult) {//验证不通过，展示报错内容
                    this.$alert(vaResult, "操作失败" , {
                        confirmButtonText: '确定',
                    });
                    return;
                }
                const readyData = this.$qs.stringify(this.dataForm);
                const url = this.isUpdata?"/card/bank/update":"/card/bank/save";
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
