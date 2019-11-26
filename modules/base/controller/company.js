/**
 * 首页基础模块
 * @author henrick
 * @create-time 2019-10-17
 * @version v1.0
 */
define(['helper', 'config'],function (helper, config) {
    helper.mainPage.leftMenuCollapse = true;
    var page = {
        title: '公司管理',
        vue: '',
        formObj: '',
        init: function (controller) {
            this.vue = new Vue({
                el: '#pageApp',
                data: function () {
                    return {
                        loading: true,
                        tableData: [],
                        dialogFormVisible: false,
                        form:{},
                        rules:{
                            name: {required:true, message:'公司名称不能为空'},
                            simple_name: {required:true, message:'简称名称不能为空'}
                        },
                        page : config.getPage()
                    };
                },
                methods: {
                    submitForm(formName) {
                        var that = this;
                        this.$refs[formName].validate(function(valid){
                            if (valid) {
                                helper.request('pms/company/editor', 'post', that.form, function (data) {
                                    helper.postData(data, function () {
                                        that.dialogFormVisible = false;
                                        page.loadData();
                                        that.$refs[formName].clearValidate();
                                    });
                                });
                            } else {
                                return false;
                            }
                        });
                    },
                    add: function (formName) {
                        this.form = JSON.parse(JSON.stringify({}));
                        this.dialogFormVisible = true;
                        this.resetForm(formName);
                    },
                    resetForm(formName) {
                        this.$refs[formName].clearValidate();
                        this.$refs[formName].resetFields();
                    },
                    handlerSizeChange: function (val) {
                        this.page.size = val;
                        page.loadData();
                    },
                    handlerCurrentChange: function (val) {
                        this.page.current = val;
                        page.loadData();
                    },
                    handleEdit: function (key, item) {
                        this.dialogFormVisible = true;
                        this.form = JSON.parse(JSON.stringify(item));
                    },
                    handleDelete: function (key, item) {
                        var that = this;
                        this.$confirm("你真的要是删除此条数据么？", "确认提醒", {
                            distinguishCancelAndClose: true,
                            confirmButtonText: '确定',
                            cancelButtonText: '取消'
                        }).then(function () {
                            helper.request('pms/company/del','post',{id: item.id}, function (data) {
                                if(data.errcode){
                                    that.$message.error(data.errmsg);
                                    return false;
                                }
                                that.$message.success(data.errmsg);
                                page.loadData();
                            })
                        });
                    }
                },
            });

            this.loadData();
        },
        
        loadData: function () {
            var that = this;
            that.vue.loading = true;
            helper.request('pms/company/list','post',{page: this.vue.page}, function (data) {
                that.vue.page = data.data.page;
                that.vue.tableData = data.data.data;
            },function () {
                that.vue.loading = false;
            }, false);
        }
    };
    return page;
});