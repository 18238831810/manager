<template>
    <el-card shadow="never" class="aui-card--fill">
        <div class="mod-demo__cfcardbank}">
            <el-form :inline="true" :model="dataForm">
                <el-form-item label="用户id">
                    <el-input v-model="dataForm.id" placeholder="用户id" clearable></el-input>
                </el-form-item>
                <el-form-item label="手机号">
                    <el-input v-model="dataForm.mobilePhone" placeholder="手机号" clearable></el-input>
                </el-form-item>
                <el-form-item label="状态">
                    <el-select v-model="dataForm.status" placeholder="状态" clearable>
                        <el-option  v-for="(value,key) in statusList"
                                :key="key"
                                :label="value"
                                :value="key">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="注册时间">
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
                <el-form-item>
                    <el-button v-if="$hasPermission('card:user:page')" :type="'primary'" :icon="'el-icon-search'" @click="getDataList()">查询</el-button>
                </el-form-item>
            </el-form>
            <table-page ref="childTable" @btnclick="bthClick" :pageData="pageData"></table-page>
        </div>
    </el-card>
</template>

<script>
    import tablePage from "@/views/table/table.vue"
    import momnet from 'moment'

    export default {
        name: "index",
        components: {
            tablePage,
        },
        methods: {
            getDataList() {
                this.$refs.childTable.initData(this.pageData.queryUrl, this.dataForm);
            },
            confirm(row,confirmFunction){
                this.$confirm('确认操作吗', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    confirmFunction(row);
                });
            },
            bthClick(clickName,row){
                if (clickName == "update"){
                    this.confirm(row,this.delete);
                }
            },
            delete(row){
                const readyData = this.$qs.stringify({id:row.id,status:row.status==1?0:1});
                this.$http.post("/card/user/update", readyData).then(res => {
                    if (res.status == 200 && res.data.code == 200) {
                        this.$alert('操作成功', "操作成功" , {
                            confirmButtonText: '确定',
                        });
                        this.getDataList();
                    }else{
                        this.$alert(res.data.code_desc,'操作失败', {
                            confirmButtonText: '确定',
                        });
                    }
                });
            }


        },
        data() {
            return {
                dataForm: {},
                statusList:{1:"正常",0:"冻结"},
                pageData: {
                    queryUrl: "/card/user/page",//请求路径和参数
                    selection: false,
                    sequence: true,
                    cols: [
                        {title: "用户id", field: "id"},
                        {title: "手机号", field: "mobilePhone"},
                        {title: "ip", field: "ip"},
                        {title: "状态", field: "status", render(data, full) {
                                return data == 1 ? "正常" : "冻结"; }
                        },
                        {title: "注册时间", field: "createTime",render(data, full) {
                                return momnet(data).format("YYYY-MM-DD HH:mm:ss")}},
                        {title: "最后登录时间", field: "loginLastTime",render(data, full) {
                                return momnet(data).format("YYYY-MM-DD HH:mm:ss")}},
                        {title: "操作",field:"status",btnClick: [{
                                name: (data,full)=>{
                                    if (data == 1) return "冻结";
                                    else return "解冻";
                                },
                                auth: "card:user:update",
                                click: "update",
                                type: (data,full)=>{
                                    if (data == 1) return "danger";
                                    else return "primary";
                                },
                                icon: (data,full)=>{
                                    if (data == 1) return "el-icon-delete";
                                    else return "el-icon-edit";
                                },
                            }]
                        },
                    ]
                }
            }
        }
    }
</script>
