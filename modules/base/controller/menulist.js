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
                            typeId: ''
                        },
                        treeData:[], //表格数据
                        typeData:[],
                        formAction: 'pms/menu/editor',//表单数据提交地址
                        listUrl: 'pms/menu/list',
                        delUrl: 'pms/menu/del',
                        typeListUrl: 'pms/menu/gettypelist',
                        form: validate.form, //表单数据
                        rules: validate.rules, //验证规则
                        dialogFormVisible: false,
                        refreshStatus: false, //按钮刷新数据
                        page : {},
                        typeLoading: false
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
                    clearForm: function (formName) { //清除验证
                        this.$refs[formName].clearValidate();
                    },
                    refresh: function () { //刷新数据
                        this.refreshStatus = true;
                        page.loadData();
                    },
                    remove: function (node, data) {
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
                    },
                    append: function () {
                        
                    },
                    renderContent: function () {
                        
                    },
                    reloadTypeData: function () {
                        page.loadTypeData();
                    },
                    goUrl: function (url) {
                        window.location.href = "#"+url;
                    },
                    swicthType: function (data) {
                        that.vue.formSearch.typeId = data.id;
                    }
                },
            });

            this.loadTypeData();
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

        },
        loadTypeData: function () {
            that = this;
            that.vue.typeLoading = true;
            helper.request(that.vue.typeListUrl,'post',{page: this.vue.page, where: that.vue.formSearch}, function (data) {
                that.vue.typeData = data.data.list.data;
                if(!that.vue.formSearch.typeId && that.vue.typeData.length){
                    that.vue.formSearch.typeId = that.vue.typeData[0]['id'];
                }
                that.loadData();
            },function () {
                that.vue.typeLoading = false;
            }, false);
        }
    };
    return page;
});