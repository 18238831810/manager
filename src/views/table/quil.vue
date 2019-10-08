<template>
    <div>
        <span v-if="uploading">图片上传中</span>
        <div id="J_quillEditor"></div>
        <!-- 自定义上传图片功能 (使用element upload组件) -->
        <el-upload
                :action="uploadUrl"
                :show-file-list="false"
                :before-upload="uploadBeforeUploadHandle"
                :on-success="uploadSuccessHandle"
                style="display: none;">
            <el-button ref="uploadBtn" type="primary" size="small">{{ $t('upload.button') }}</el-button>
        </el-upload>
    </div>
</template>

<script>
    import 'quill/dist/quill.snow.css'
    import Quill from 'quill'
    export default {
        name: "quil",
        data(){
            return{
                quillEditor: null,
                quillEditorToolbarOptions: [
                    ['bold', 'italic', 'underline', 'strike'],
                    ['blockquote', 'code-block', 'image'],
                    [{ 'header': 1 }, { 'header': 2 }],
                    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                    [{ 'script': 'sub' }, { 'script': 'super' }],
                    [{ 'indent': '-1' }, { 'indent': '+1' }],
                    [{ 'direction': 'rtl' }],
                    [{ 'size': ['small', false, 'large', 'huge'] }],
                    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                    [{ 'color': [] }, { 'background': [] }],
                    [{ 'font': [] }],
                    [{ 'align': [] }],
                    ['clean']
                ],
                uploadUrl: process.env.VUE_APP_API + "/public/card/upload",
                uploading:false
            }

        },
        methods:{
            init(html){
                this.$nextTick(() => {
                    if (this.quillEditor) {
                        this.quillEditor.deleteText(0, this.quillEditor.getLength());
                    } else {
                        this.quillEditorHandle()
                    }
                    if (html != null && html != "") this.quillEditor.root.innerHTML = html;
                })
            },
            text(html){
                if (this.quillEditor){
                    this.$set(this.quillEditor.root,"innerHTML",html);
                }
            },
            // 富文本编辑器
            quillEditorHandle () {
                this.quillEditor = new Quill('#J_quillEditor', {
                    modules: {
                        toolbar: this.quillEditorToolbarOptions
                    },
                    theme: 'snow'
                });
                console.log(this.quillEditor);
                // 自定义上传图片功能 (使用element upload组件)
                this.quillEditor.getModule('toolbar').addHandler('image', () => {
                    this.$refs.uploadBtn.$el.click();
                });
                // 监听内容变化，动态赋值
                this.quillEditor.on('text-change', () => {
                    //this.textchange(this.quillEditor.root.innerHTML);
                })
            },
            getHtml(){
                return this.quillEditor.root.innerHTML;
            },
            // 上传图片之前
            uploadBeforeUploadHandle (file) {
                if (file.type !== 'image/jpg' && file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !== 'image/gif') {
                    this.$message.error('只支持jpg、png、gif格式的图片！');
                    return false
                }
                this.uploading = true;
            },
            // 上传图片成功
            uploadSuccessHandle (res, file, fileList) {
                this.uploading = false;
                if (res.code !== 200) {
                    return this.$message.error(res.msg)
                }
                this.quillEditor.insertEmbed(this.quillEditor.getSelection().index, 'image', res.data);
            },
        }
    }
</script>

<style scoped>

</style>
