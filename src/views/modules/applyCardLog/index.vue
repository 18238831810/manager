<template>
    <el-card shadow="never" class="aui-card--fill">
        <div class="mod-demo__cfcardbank}">
            <el-form :inline="true" :model="dataForm">
                <el-form-item label="手机号">
                    <el-input v-model="dataForm.mobilePhone" placeholder="手机号" clearable></el-input>
                </el-form-item>
                <el-form-item label="所属银行">
                    <el-select v-model="dataForm.bankName" placeholder="广告位置" clearable>
                        <el-option
                                v-for="bank in bankList"
                                :key="bank"
                                :label="bank"
                                :value="bank">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="信用卡">
                    <el-input v-model="dataForm.cardName" placeholder="信用卡" clearable></el-input>
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
                    <el-button v-if="$hasPermission('card:log:page')" :type="'primary'" :icon="'el-icon-search'" @click="getDataList()">查询</el-button>
                </el-form-item>
            </el-form>
            <table-page ref="childTable" :pageData="pageData"></table-page>
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
        },
        data() {
            return {
                dataForm: {},
                bankList:[],
                pageData: {
                    queryUrl: "/card/log/page",//请求路径和参数
                    selection: false,
                    sequence: true,
                    cols: [
                        {title: "手机号码", field: "mobilePhone"},
                        {title: "信用卡", field: "cardName"},
                        {title: "银行", field: "bankName"},
                        {title: "创建时间", field: "createTime",render(data, full) {
                                return momnet(data).format("YYYY-MM-DD HH:mm:ss")}}
                    ]
                }
            }
        },
        mounted() {
            const url = "/public/card/selectList";
            this.$http.get(url).then(res => {
                if (res.status == 200 && res.data.code == 200) {
                    this.bankList = res.data.data.bankList;
                }
            });
        }
    }
</script>
