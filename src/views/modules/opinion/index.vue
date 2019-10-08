<template>
    <el-card shadow="never" class="aui-card--fill">
        <div class="mod-demo__cfcardbank}">
            <el-form :inline="true" :model="dataForm">
               <!-- <el-form-item>
                    <el-input v-model="dataForm.name" placeholder="银行名称" clearable></el-input>
                </el-form-item>-->
                <el-form-item>
                    <el-button v-if="$hasPermission('card:opinion:page')" :type="'primary'" :icon="'el-icon-search'" @click="getDataList()">查询</el-button>
                </el-form-item>
            </el-form>
            <table-page ref="childTable" @btnclick="bthClick" :pageData="pageData"></table-page>
            <el-dialog :visible.sync="visible" :close-on-click-modal="false" :close-on-press-escape="false">
                <el-form>
                    <el-form-item label="图片预览" v-if="imgList.length > 0" class="marginTop">
                        <div v-for="img in imgList"><img style="width: 200px" :src="img"></div>
                    </el-form-item>
                </el-form>
            </el-dialog>
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
            bthClick(clickName,row){
                this.visible = true;
                this.imgList = row.imgUrls.split(",");
            }
        },
        data() {
            return {
                visible:false,
                imgList:[],
                dataForm: {},
                pageData: {
                    queryUrl: "/card/opinion/page",//请求路径和参数
                    selection: false,
                    sequence: true,
                    cols: [
                        {title: "手机号码", field: "mobilePhone"},
                        {title: "填写联系电话", field: "phone"},
                        {title: "意见反馈", field: "content"},
                        {title: "意见类型", field: "type"},
                        {title: "反馈时间", field: "createTime",render:(data, full)=>{
                                return momnet(data).format("YYYY-MM-DD HH:mm:ss")}},
                        {title: "操作",btnClick: [{
                                name: "查看截图",
                                auth: "card:bank:update",
                                click: "update",
                                icon: "el-icon-edit"
                            }]
                        },
                    ]
                }
            }
        }
    }
</script>
