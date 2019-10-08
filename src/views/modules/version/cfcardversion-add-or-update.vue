<template>
    <el-dialog :visible.sync="visible" :close-on-click-modal="false" :close-on-press-escape="false">
        <el-form :model="dataForm">
            <el-form-item label="应用" prop="channel">
                <el-select v-model="dataForm.channel" placeholder="应用">
                    <el-option
                            v-for="channel in channelList"
                            :key="channel"
                            :label="channel"
                            :value="channel">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="升级方式" prop="isForce">
                <el-radio-group v-model="dataForm.isForce">
                    <el-radio v-for="(value,key) in isForceList" :label="Number(key)" :key="key">{{value}}</el-radio>
                </el-radio-group>
            </el-form-item>

            <el-form-item label="应版本号" prop="version">
                <el-input v-model="dataForm.version" placeholder="银行名称"></el-input>
            </el-form-item>
            <el-form-item label="下载地址" prop="downLoadUrl">
                <el-input v-model="dataForm.downLoadUrl" placeholder="下载地址"></el-input>
            </el-form-item>
            <el-form-item label="版本说明" prop="comment">
                <el-input type="textarea" v-model="dataForm.comment" placeholder="版本说明"></el-input>
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
        props:["channelList","isForceList"],
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
            isExist(val){
                if (!val || val === "") return false;
                return true;
            },
            submitVa(){
                if (!this.isExist(this.dataForm.channel)) return "请选择应用";
                if (!this.isExist(this.dataForm.isForce)) return "请选择升级方式";
                if (!this.isExist(this.dataForm.version)) return "版本号不能为空";
                if (!this.isExist(this.dataForm.downLoadUrl)) return "下载地址不能为空";
                if (!this.isExist(this.dataForm.comment)) return "版本说明不能为空";
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
                const url = this.isUpdata?"/card/version/update":"/card/version/save";
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
            console.log(this.isForceList);
        }
    }
</script>
