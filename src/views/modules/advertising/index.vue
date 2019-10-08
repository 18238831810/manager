<template>
    <el-card shadow="never" class="aui-card--fill">
        <div class="mod-demo__cfcardbank}">
            <el-form :inline="true" :model="dataForm">
                <el-form-item label="广告名称">
                    <el-input v-model="dataForm.name" placeholder="广告名称" clearable></el-input>
                </el-form-item>
                <el-form-item label="广告版位">
                    <el-select v-model="dataForm.position" placeholder="广告版位" clearable>
                        <el-option v-for="(value,key) in positionList" :value="Number(key)" :label="value" :key="key">{{value}}</el-option>
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
                    <el-button v-if="$hasPermission('card:advertising:page')" :type="'primary'" :icon="'el-icon-search'" @click="getDataList()">查询</el-button>
                    <el-button v-if="$hasPermission('card:advertising:save')"  :type="'primary'" :icon="'el-icon-circle-plus-outline'" @click="bthClick('add')">新增</el-button>
                </el-form-item>
            </el-form>
            <table-page ref="childTable" @btnclick="bthClick" :pageData="pageData"></table-page>
            <add-or-update  ref="addOrUpdate" :positionList="positionList"></add-or-update>
        </div>
    </el-card>
</template>

<script>
    import tablePage from "@/views/table/table.vue"
    import AddOrUpdate from './cfcardadvertising-add-or-update'
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
                if (clickName === "add"){
                    this.$refs.addOrUpdate.isUpdata = false;
                    this.$refs.addOrUpdate.visible = true;
                    this.$refs.addOrUpdate.dataForm ={
                        startTime:new Date().getTime(),
                        endTime:new Date().getTime() + (1000 * 3600 * 24 * 30 * 12 * 10),
                        sort:0
                    };
                }
                else if (clickName === "update") {
                    this.$refs.addOrUpdate.visible = true;
                    this.$refs.addOrUpdate.isUpdata = true;
                    this.$refs.addOrUpdate.dataForm = JSON.parse(JSON.stringify(row));
                }
                else if (clickName === "delete") this.confirm(row.id,this.delete);
            },
            confirm(row,confirmFunction){
                this.$confirm('确认删除吗', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    confirmFunction(row);
                });
            },
            delete(id){
                const readyData = this.$qs.stringify({advertisingId:id});
                this.$http.post("/card/advertising/delete", readyData).then(res => {
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
                positionList:{1:"启动图",2:"首页Banner"},
                pageData: {
                    queryUrl: "/card/advertising/page",//请求路径和参数
                    selection: false,
                    sequence: true,
                    cols: [
                        {title: "广告名称", field: "name"},
                        {title: "广告版位", field: "position",render:(data,full)=>{
                                return this.positionList[data] || "";
                            }},
                        {title: "广告说明", field: "remark"},
                        {title: "点击次数", field: "clickNum"},
                        {title: "排序", field: "sort"},
                        {title: "创建时间", field: "createTime",render(data, full) {
                                return momnet(data).format("YYYY-MM-DD HH:mm:ss")
                                }},
                        {title:"图片",field:"imgUrl",render(data, full){
                                return "<img width='100px' src='"+data+"' img>";
                            }},
                        {title: "操作",btnClick: [{
                                name: "修改",
                                auth: "card:advertising:update",
                                click: "update",
                                type: "primary",
                                icon: "el-icon-edit"
                            }, {
                                name: "删除",
                                auth: "card:advertising:delete",
                                click: "delete",
                                type: "danger",
                                icon: "el-icon-delete"
                            }]
                        },
                    ]
                }
            }
        }
    }
</script>
