<template>
    <el-card shadow="never" class="aui-card--fill">
        <div class="mod-demo__cfcardbank}">
            <el-form :inline="true" :model="dataForm">
                <el-form-item label="应用">
                    <el-select v-model="dataForm.channel" placeholder="应用" clearable>
                        <el-option
                                v-for="channel in channelList"
                                :key="channel"
                                :label="channel"
                                :value="channel">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="升级方式">
                    <el-select v-model="dataForm.isForce" placeholder="升级方式" clearable>
                        <el-option v-for="(value,key) in isForceList" :value="Number(key)" :label="value" :key="key">{{value}}</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="添加时间">
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
                    <el-button v-if="$hasPermission('card:version:page')" :type="'primary'" :icon="'el-icon-search'" @click="getDataList()">查询</el-button>
                    <el-button v-if="$hasPermission('card:version:save')"  :type="'primary'" :icon="'el-icon-circle-plus-outline'" @click="bthClick('add')">新增</el-button>
                </el-form-item>
            </el-form>
            <table-page ref="childTable" @btnclick="bthClick" :pageData="pageData"></table-page>
            <add-or-update  ref="addOrUpdate" :isForceList="isForceList" :channelList="channelList"></add-or-update>
        </div>
    </el-card>
</template>

<script>
    import tablePage from "@/views/table/table.vue"
    import AddOrUpdate from './cfcardversion-add-or-update'
    import momnet from 'moment'
    let isForceList = {1:"普通升级",2:"强制升级"};
    export default {
        name: "index",
        components: {
            tablePage,
            AddOrUpdate
        },
        methods: {
            getDataList() {
                this.$refs.childTable.initData(this.pageData.queryUrl, this.dataForm);
            },
            bthClick(clickName,row){
                if (clickName === "add") {
                    this.$refs.addOrUpdate.isUpdata = false;
                    this.$refs.addOrUpdate.visible = true;
                    this.$refs.addOrUpdate.dataForm ={};
                }
                else if (clickName === "update") {
                    this.$refs.addOrUpdate.visible = true;
                    this.$refs.addOrUpdate.isUpdata = true;
                    this.$refs.addOrUpdate.dataForm = JSON.parse(JSON.stringify(row));
                }
                else if (clickName === "delete") this.confirm(row,this.delete);
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
            delete(row){
                const readyData = this.$qs.stringify({id:row.id,status:row.status==1?0:1});
                this.$http.post("/card/version/delete", readyData).then(res => {
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
                channelList:["信用卡","小熊记账"],
                isForceList:isForceList,
                pageData: {
                    queryUrl: "/card/version/page",//请求路径和参数
                    selection: false,
                    sequence: true,
                    cols: [
                        {title: "应用", field: "channel"},
                        {title: "升级方式", field: "isForce",render(data,full){
                                return isForceList[data] || "";
                            }},
                        {title: "应用版本号", field: "version"},
                        {title: "下载地址", field: "downLoadUrl"},
                        {title: "状态", field: "status", render(data, full) {
                                return data == 1 ? "正常" : "已停用"; }
                        },
                        {title: "创建时间", field: "createTime",render(data, full) {
                                return momnet(data).format("YYYY-MM-DD HH:mm:ss")}},
                        {title: "操作",field:"status",btnClick: [{
                                name: "修改",
                                auth: "card:version:update",
                                click: "update",
                                type: "primary",
                                icon: "el-icon-edit"
                            }, {
                                name: (data,full)=>{
                                    if (data == 1) return "停用";
                                    else return "启用";
                                },
                                auth: "card:version:delete",
                                click: "delete",
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
