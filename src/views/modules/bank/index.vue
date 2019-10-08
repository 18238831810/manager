<template>
    <el-card shadow="never" class="aui-card--fill">
        <div class="mod-demo__cfcardbank}">
            <el-form :inline="true" :model="dataForm">
                <el-form-item label="银行名称">
                    <el-input v-model="dataForm.name" placeholder="银行名称" clearable></el-input>
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
                    <el-button v-if="$hasPermission('card:bank:page')" :type="'primary'" :icon="'el-icon-search'" @click="getDataList()">查询</el-button>
                    <el-button v-if="$hasPermission('card:bank:save')"  :type="'primary'" :icon="'el-icon-circle-plus-outline'" @click="bthClick('add')">新增</el-button>
                </el-form-item>
            </el-form>
            <table-page ref="childTable" @btnclick="bthClick" :pageData="pageData"></table-page>
            <add-or-update  ref="addOrUpdate"></add-or-update>
        </div>
    </el-card>
</template>

<script>
    import tablePage from "@/views/table/table.vue"
    import AddOrUpdate from './cfcardbank-add-or-update'
    import momnet from 'moment'

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
                this.$http.post("/card/bank/delete", readyData).then(res => {
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
                pageData: {
                    queryUrl: "/card/bank/page",//请求路径和参数
                    selection: false,
                    sequence: true,
                    cols: [
                        {title: "银行名称", field: "name"},
                        {title: "logo", field: "logoUrl",render(data,full){
                                return "<img width='100px' src='"+data+"' img>";
                            }},
                        {title: "背景图片", field: "backGroundUrl",render(data,full){
                                return "<img width='100px' src='"+data+"' img>";
                            }},
                        {title: "银行说明", field: "remark"},
                        {title: "办卡进度地址", field: "progressUrl"},
                        {title: "激活进度地址", field: "activeUrl"},
                        {title: "点击量", field: "clickNum"},
                        {title: "状态", field: "status", render(data, full) {
                                return data == 1 ? "正常" : "已停用"; }
                        },
                        {title: "创建时间", field: "createTime",render(data, full) {
                                return momnet(data).format("YYYY-MM-DD HH:mm:ss")}},
                        {title: "操作",field:"status",btnClick: [{
                                name: "修改",
                                auth: "card:bank:update",
                                click: "update",
                                type: "primary",
                                icon: "el-icon-edit",
                            }, {
                                name: (data,full)=>{
                                    if (data == 1) return "停用";
                                    else return "启用";
                                },
                                auth: "card:bank:delete",
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
