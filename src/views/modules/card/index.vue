<template>
    <el-card shadow="never" class="aui-card--fill">
        <div class="mod-demo__cfcardbank}">
            <el-form :inline="true" :model="dataForm">
                <el-form-item label="信用卡名称">
                    <el-input v-model="dataForm.name" placeholder="信用卡名称" clearable></el-input>
                </el-form-item>
                <el-form-item label="所属银行">
                    <el-select v-model="dataForm.bankName" placeholder="所属银行" clearable>
                        <el-option
                                v-for="bank in selectList.bankList"
                                :key="bank"
                                :label="bank"
                                :value="bank">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="卡片等级">
                    <el-select v-model="dataForm.level" placeholder="卡片等级" clearable>
                        <el-option
                                v-for="level in selectList.levelList"
                                :key="level"
                                :label="level"
                                :value="level">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="卡片币种">
                    <el-select v-model="dataForm.currency" placeholder="卡片币种" clearable>
                        <el-option
                                v-for="currency in selectList.currencyList"
                                :key="currency"
                                :label="currency"
                                :value="currency">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="发卡组织" prop="bankName">
                    <el-select v-model="dataForm.organization" placeholder="发卡组织" clearable>
                        <el-option
                                v-for="organization in selectList.organizationList"
                                :key="organization"
                                :label="organization"
                                :value="organization">
                        </el-option>
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
                    <el-button v-if="$hasPermission('card:card:page')" :type="'primary'" :icon="'el-icon-search'" @click="getDataList()">查询</el-button>
                    <el-button v-if="$hasPermission('card:card:save')"  :type="'primary'" :icon="'el-icon-circle-plus-outline'" @click="bthClick('add')">新增</el-button>
                </el-form-item>
            </el-form>
            <table-page ref="childTable" @btnclick="bthClick" :pageData="pageData"></table-page>
            <add-or-update  ref="addOrUpdate" :selectList="selectList"></add-or-update>
        </div>
    </el-card>
</template>

<script>
    import tablePage from "@/views/table/table.vue"
    import AddOrUpdate from './cfcardcard-add-or-update'
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
                    this.$refs.addOrUpdate.dataForm = {
                        currencyList:[],
                        organizationList:[],
                    };
                    this.$refs.addOrUpdate.init();
                }
                else if (clickName === "update") {
                    this.$refs.addOrUpdate.initUpdate(row);
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
                this.$http.post("/card/card/delete", readyData).then(res => {
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
                selectList:{
                    levelList:[],//卡片等级列表
                    bankList:[],//银行列表
                    organizationList:[],//发卡组织列表
                    //货币列表
                    currencyList:["人民币","美元","港币","台币","澳门元","欧元","日元","英镑","新加坡元","加拿大元","瑞士法郎","新西兰元","澳大利亚元","全币种"],
                },
                pageData: {
                    queryUrl: "/card/card/page",//请求路径和参数
                    selection: false,
                    sequence: true,
                    cols: [
                        {title: "信用卡名称", field: "name"},
                        {title: "银行名称", field: "bankName"},
                        {title: "背景图片", field: "imgUrl",render(data,full){
                                return "<img width='100px' src='"+data+"' img>";
                            }},
                        {title: "卡片等级", field: "level"},
                        {title: "卡片币种", field: "currency"},
                        {title: "发卡组织", field: "organization"},
                        {title: "浏览量", field: "pageNum"},
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
                                icon: "el-icon-edit"
                            }, {
                                name: (data,full)=>{
                                    if (data == 1) return "停用";
                                    else return "启用";
                                },
                                auth: "card:card:delete",
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
        },
        mounted() {
            const url = "/public/card/selectList";
            this.$http.get(url).then(res => {
                if (res.status == 200 && res.data.code == 200) {
                    this.selectList.bankList = res.data.data.bankList;
                    this.selectList.levelList = res.data.data.levelList;
                    this.selectList.organizationList = res.data.data.organizationList;
                }
            });
        }
    }
</script>
