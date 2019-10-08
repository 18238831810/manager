<template>
    <el-dialog :visible.sync="visible" :close-on-click-modal="false" :close-on-press-escape="false">
        <el-form :model="dataForm">
            <el-form-item label="有效时间">
                <el-date-picker
                        v-model="dataForm.startTime"
                        type="datetime"
                        value-format="timestamp"
                        placeholder="开始时间">
                </el-date-picker>&nbsp;至&nbsp;
                <el-date-picker
                        v-model="dataForm.endTime"
                        type="datetime"
                        value-format="timestamp"
                        placeholder="结束时间">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="广告版位" prop="position">
                <el-select v-model="dataForm.position" placeholder="广告版位">
                    <el-option v-for="(value,key) in positionList" :key="Number(key)" :label="value" :value="Number(key)">{{value}}</el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="广告名称" prop="name">
                <el-input v-model="dataForm.name" placeholder="广告名称"></el-input>
            </el-form-item>
            <el-form-item label="广告说明" prop="remark">
                <el-input v-model="dataForm.remark" placeholder="广告说明"></el-input>
            </el-form-item>
            <el-form-item label="图片预览" v-if="dataForm.imgUrl && dataForm.imgUrl != ''" class="marginTop">
                <div><img style="width: 150px" :src="dataForm.imgUrl"></div>
            </el-form-item>
            <el-form-item label="广告图片" prop="imgurl">
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
                <el-input v-model="dataForm.imgUrl" placeholder="广告图片"></el-input>
            </el-form-item>
            <el-form-item label="广告跳转地址" prop="linkurl">
                <el-input v-model="dataForm.linkUrl" placeholder="广告跳转地址"></el-input>
            </el-form-item>
            <el-form-item label="排序" prop="sort">
                <el-input v-model="dataForm.sort" placeholder="排序"></el-input>
            </el-form-item>
        </el-form>
        <template slot="footer">
            <el-button @click="visible = false">{{ $t('cancel') }}</el-button>
            <el-button type="primary" @click="submit()">{{ $t('confirm') }}</el-button>
        </template>
    </el-dialog>
</template>

<script>
    export default {
        props:["positionList"],
        data() {
            return {
                visible: false,
                isUpdata: false,
                dataForm: {},
                uploadLoad: false,
                uploadUrl: process.env.VUE_APP_API + "/public/card/upload",
            }
        },
        computed: {

        },
        methods: {
            //上传logo成功
            uploadSuc(response, file, fileList) {
                this.uploadLoad = false;
                if (response.code == 200) this.dataForm.imgUrl = response.data;
            },
            uploading(){
                this.uploadLoad = true;
            },
            isExist(val){
                if (val == null || val === "") return false;
                return true;
            },
            submitVa(){
                if (!this.isExist(this.dataForm.name)) return "广告名称为空";
                if (!this.isExist(this.dataForm.remark)) return "广告说明为空";
                if (!this.isExist(this.dataForm.imgUrl)) return "广告图片为空";
                if (!this.isExist(this.dataForm.linkUrl)) return "广告跳转地址为空";
                if (!this.isExist(this.dataForm.sort)) return "广告排序为空";
                return null;
            },
            submit(){
                console.log("-------------------------1111-------"+this.isUpdata);
                const vaResult = this.submitVa();
                if (vaResult) {//验证不通过，展示报错内容
                    this.$alert(vaResult, "操作失败" , {
                        confirmButtonText: '确定',
                    });
                    return;
                }
                const readyData = this.$qs.stringify(this.dataForm);
                const url = this.isUpdata?"/card/advertising/update":"/card/advertising/save";
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

        }

    }
</script>
