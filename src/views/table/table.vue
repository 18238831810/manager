<template>
    <div>
        <el-table :data="tableData" border style="width: 100%" @selection-change="checkbox">
            <!--多选-->
            <el-table-column label="全选" v-if="pageData.selection" type="selection" width="80px"></el-table-column>
            <!--序号-->
            <el-table-column label="序号" v-if="pageData.sequence" type="index" width="80px"></el-table-column>
            <el-table-column :show-overflow-tooltip="col.overflow||true" :fixed="col.btnClick && col.btnClick.length > 0?'right':col.fixed" :min-width="col.btnClick && col.btnClick.length > 0?col.minWidth||'100':col.minWidth||''"  v-for="(col,index) in pageData.cols" :key="index" :prop="col.field" :label="col.title" :width="col.width">
                <template slot-scope="scope">
                    <div v-if="col.btnClick && col.btnClick.length > 0"  :style="'text-align:center'"><!--表格内按钮，可点击，传入方法类型，用clickType区分按钮点击事件。-->
                        <el-button  v-for="(btn,index) in col.btnClick" v-if="$hasPermission(btn.auth)" size="mini"  :key="index" :type="typeof btn.type == 'function'?btn.type(scope.row[col.field],scope.row):btn.type" :icon="typeof btn.icon == 'function'?btn.icon(scope.row[col.field],scope.row):btn.icon" @click="btnclick(btn.click,scope.row)">{{typeof btn.name == 'function'?btn.name(scope.row[col.field],scope.row):btn.name}}</el-button>
                    </div>
                    <div v-else-if="!col.render">
                        <div v-if="!col.click">{{scope.row[col.field]}}</div>
                        <div v-else-if="col.click"  @click="btnclick(col.click,scope.row)">scope.row[col.field]</div>
                    </div>
                    <div v-else-if="col.render">
                        <div v-if="!col.click" v-html="col.render(scope.row[col.field],scope.row)">
                        </div>
                        <div v-else-if="col.click"  v-html="col.render(scope.row[col.field],scope.row)"  @click="btnclick(col.click,scope.row)">
                        </div>
                    </div>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="1"
                :page-sizes="[10, 20, 30, 40, 50, 60, 100, 500]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
        </el-pagination>
    </div>
</template>

<script>
    export default {
        props: ["pageData"],
        //初始化数据
        created() {
            this.initData(this.pageData.queryUrl);
        },
        computed: {},
        data() {
            return {
                tableData:[],
                total: 10,//初始总数
                pageSize: 10,//初始页面条数
                current:1,//当前页
                size:10//当前页面条数
            };
        },
        methods: {
            //用户查询按钮调用
            initData(queryUrl, option) {
                if (!option) option = {};
                option = Object.assign(option, {start: 0, length: 10});
                this.getData(queryUrl, option);
            },
            //调用后台接口获取数据
            getData(queryUrl, option) {
                this.$http.get(queryUrl, {params: (option || {})}).then(res => {
                        this.total = Number(res.data.total);
                        this.tableData = res.data.records;
                    }
                );
            },
            pageGetData(){
                this.getData(this.pageData.queryUrl, {current: this.current, size: this.size});
            },
            //自定义点击事件(click:事件名)
            btnclick(click,row){
                this.$emit("btnclick",click,row);
            },
            //多选数据处理
            checkbox(val) {
                this.$emit("checkbox", val);
            },
            //监听分页条数变化
            handleSizeChange(val) {
                this.size = val;
                this.pageGetData();
            },
            //监听分页页数变化
            handleCurrentChange(val) {
                this.current = val;
                this.pageGetData();
            }
        },
    }
    /* 插件使用说明
   <Page ref="childTable" @checkbox=checkbox :pageData="pageData" @btnclick="btnclick(actName,row)"></Page>
   pageData:初始化数据，btnclick(actName,row){}:获取操作数据按钮actName:事件名称,row选中的数据，checkBox(val){}:获取多选数据
   data(){
       return{
           pageData: {
               queryUrl: "/mis/ValidateCodeLog/pageList",//请求路径和参数
                   //是否开启多选框
                   selection: false,
                   //是否显示序号
                   sequence:true,
                   //列表(title:表头，file:字段名称，render:数据格式化，click:添加点击事件btnclick(click,row)，btnClick：可点击按钮,fixed:固定（elemnet-ui属性），overflow:内容过长隐藏策略),minWidth:最新宽度
                   cols: [
                   {title: "日期", field: "mobilePhone",fixed:false,overflow:true,render(data,full){
                           return full.mobilePhone;
                       }},
                   {title: "名称", field: "id"},
                   {title: "省份", field: "code"},
                   {title: "城市", field: "status"},
                    //按钮样式定义请参考element,click:事件名称（会自动添加点击事件）
                   {field:"修改",title:"操作",click:1,width:150},
                   //name：按钮名称 click：事件名称 type:按钮类型(参考element-ui) icon：(按钮图标)参考element-ui 默认添加点击事件btnclick(click,row){}  click:事件名称，row：当前行的数据  auth:权限
                   {title:"操作",btnClick:[{name:"删除",auth:"card:bank:update",click:"delete",type:"primary",icon: "el-icon-delete"},{name:"修改",click:"modify",type:"primary",icon: "el-icon-edit"}]},
                   ],
           }
       }
   },
   */
</script>

