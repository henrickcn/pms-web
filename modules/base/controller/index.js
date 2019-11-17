/**
 * 首页基础模块
 * @author henrick
 * @create-time 2019-10-17
 * @version v1.0
 */
define(['helper', 'config'],function (helper, config) {
    helper.mainPage.leftMenuCollapse = true;
    var page = {
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
                            id: {required:true, message:'权限Id不能为空'},
                            name: {required:true, message:'权限名称不能为空'},
                            module_name: {required:true, message:'模块名称不能为空'},
                            url: {required:true, message:'权限链接名称不能为空'},
                            web_url: {required:true, message:'前端链接名称不能为空'},
                            is_login: {required:true, message:'请选择是否登录'},
                            is_sys: {required:true, message:'请选择是否系统权限'},
                        },
                        page : config.getPage()
                    };
                },
                methods: {
                    addAuth: function (formName) {
                        this.form = {};
                        console.log(page.formObj);
                        if(page.formObj)
                            page.formObj.clearValidate();
                        this.dialogFormVisible = true;
                    },
                    submitForm(formName) {
                        var that = this;
                        page.formObj = this.$refs[formName].validate(function(valid){
                            if (valid) {
                                helper.request('pms/auth/editor', 'post', that.form, function (data) {
                                    helper.postData(data, function () {
                                        that.dialogFormVisible = false;
                                        page.loadData();
                                    });
                                });
                            } else {
                                return false;
                            }
                        });
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
                        this.form = item;
                    }
                },
            });

            this.loadData();
        },
        
        loadData: function () {
            var that = this;
            that.vue.loading = true;
            helper.request('pms/auth/list','post',{page: this.vue.page}, function (data) {
                that.vue.page = data.data.page;
                that.vue.tableData = data.data.data;
            },function () {
                that.vue.loading = false;
            }, false);
        }
    };
    return page;
});