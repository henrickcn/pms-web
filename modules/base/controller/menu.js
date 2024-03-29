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
                            orderBy : {prop:'create_time', orderBy:'descending'}
                        },
                        tableData:[], //表格数据
                        formAction: 'pms/menu/editortype',//表单数据提交地址
                        listUrl: 'pms/menu/listtype',
                        delUrl: 'pms/menu/deltype',
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
                        this.$refs[formName].resetFields();
                        this.$refs[formName].clearValidate();
                    },
                    select: function(data){
                        this.formSearch.orderBy = {
                            prop    : data.prop,
                            orderBy : data.order
                        };
                        page.loadData();
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
                    },
                    del: function () {
                        var that = this;
                        if(!this.multipleSelection.length){
                            helper.alert("请至少选择一条数据", "error");
                            return false;
                        }
                        helper.confirm("你真是要删除选择的数据么？", "温馨提醒", function () {
                            helper.request(that.delUrl,'post',{id: that.multipleSelection}, function (data) {
                                if(data.errcode){
                                    helper.alert(data.errmsg);
                                    return false;
                                }
                                helper.alert(data.errmsg);
                                page.loadData();
                            });
                        });
                    }
                },
            });

            this.loadData();
        },
        
        loadData: function () {
            var that = this;
            that.vue.loading = true;
            helper.request(that.vue.listUrl,'post',{page: this.vue.page, where: that.vue.formSearch}, function (data) {
                that.vue.page = data.data.page;
                that.vue.tableData = data.data.data;
            },function () {
                that.vue.refreshStatus = false;
                that.vue.loading = false;
            }, false);

        }
    };
    return page;
});