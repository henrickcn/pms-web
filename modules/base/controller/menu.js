/**
 * 首页基础模块
 * @author henrick
 * @create-time 2019-10-17
 * @version v1.0
 */
define(['helper', 'config', '/modules/base/validate/menu.js'],function (helper, config, validate) {
    var page = {
        vue: '',
        formObj: '',
        init: function (id) {
            console.log(id);
            this.vue = new Vue({
                el: '#'+id,
                data: function () {
                    return {
                        loading: true, //表格loading
                        collapseValue:['1'], //搜索折叠
                        searchOptions:[], //菜单分类
                        formSearch:{  //搜索区域表单
                            keyword : '',
                            type : ''
                        },
                        tableData:[], //表格数据
                        formAction: 'pms/menu/edit',//表单数据提交地址
                        form: validate.form, //表单数据
                        rules: validate.rules, //验证规则
                        dialogFormVisible: false,
                        multipleSelection:[], //多选Ids
                        refreshStatus: false, //按钮刷新数据
                        page : config.getPage()
                    };
                },
                methods: {
                    add: function (formName) {
                        this.form = {};
                        this.dialogFormVisible = true;
                        if(this.$refs[formName])
                            this.$refs[formName].clearValidate();
                    },
                    submitForm(formName) { //提交数据
                        this.$refs[formName].clearValidate();
                        var that = this;
                        page.formObj = this.$refs[formName].validate(function(valid){
                            if (valid) {
                                helper.request(that.formAction, 'post', that.form, function (data) {
                                    helper.postData(data, function () {
                                        that.dialogFormVisible = false;
                                        page.loadData();
                                        this.form = {};
                                    });
                                });
                            } else {
                                return false;
                            }
                        });
                    },
                    resetForm(formName) { //重置表单
                        this.$refs[formName].clearValidate();
                        this.$refs[formName].resetFields();
                    },
                    handlerSizeChange: function (val) { //分页事件
                        this.page.size = val;
                        page.loadData();
                    },
                    handlerCurrentChange: function (val) { //分页事件
                        this.page.current = val;
                        page.loadData();
                    },
                    handleEdit: function (key, item) { //分页事件
                        this.dialogFormVisible = true;
                        this.form = JSON.parse(JSON.stringify(item));
                    },
                    clearForm: function (formName) { //清除验证
                        this.$refs[formName].clearValidate();
                    },
                    handleSelectionChange: function (val) { //数据选择
                        this.multipleSelection = val;
                    },
                    refresh: function () { //刷新数据
                        this.refreshStatus = true;
                        page.loadData();
                    }
                },
            });

            this.loadData();
        },
        
        loadData: function () {
            var that = this;
            that.vue.loading = false;

            //请求完成
            setTimeout(function () {
                that.vue.refreshStatus = false;
            },1000);

        }
    };
    return page;
});