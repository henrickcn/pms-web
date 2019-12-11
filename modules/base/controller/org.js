/**
 * 首页基础模块
 * @author henrick
 * @create-time 2019-10-17
 * @version v1.0
 */
define(['helper', 'config', '/modules/base/validate/menulist.js'],function (helper, config, validate) {
    var page = {
        vue: '',
        formObj: '',
        init: function (id) {
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
                        authListUrl: 'pms/menu/authlist',
                        delUrl: 'pms/menu/del',
                        typeListUrl: 'pms/menu/gettypelist',
                        form: validate.form, //表单数据
                        rules: validate.rules, //验证规则
                        dialogFormVisible: false,
                        refreshStatus: false, //按钮刷新数据
                        page : {},
                        typeLoading: false,
                        menuTypeName: ''
                    };
                },
                methods: {
                    add: function (formName) {
                        this.form = {
                            type_id : this.formSearch.typeId,
                            weight : 0,
                            is_hide: '是'
                        };
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
                    reloadTypeData: function () {
                        page.loadTypeData();
                    },
                    goUrl: function (url) {
                        window.location.href = "#"+url;
                    },
                    swicthType: function (data) {
                        that.vue.formSearch.typeId = data.id;
                        this.menuTypeName = data.name;
                        data.typeLoading = true;
                        page.loadData(data);
                    },
                    querySearchAsync: function (queryString, fn) {
                        helper.request(that.vue.authListUrl,'post',{keyword: queryString}, function (data) {
                            fn(data.data.list);
                        },function () {}, false);
                    },
                    handleSelect: function (item) {
                        this.form.auth_id = item.id;
                        this.form.auth_name = item.value;
                    },
                    addChildren: function (data, formName) {
                        this.form = {
                            type_id : data.type_id,
                            parent_id : data.id,
                            level: parseInt(data.level)+1,
                            join_string: (data.join_string||'-')+data.id+'-',
                            weight : 0,
                            is_hide: '是'
                        };
                        this.dialogFormVisible = true;
                        if(this.$refs[formName])
                            this.$refs[formName].clearValidate();
                    },
                    editor: function (data, formName) { //修改菜单
                        this.dialogFormVisible = true;
                        var that = this;
                        setTimeout(function () {
                            that.form = JSON.parse(JSON.stringify(data));
                            if(that.form.is_hide){
                                that.form.is_hide = '否';
                            }else{
                                that.form.is_hide = '是';
                            }
                        },300);
                    },
                    del: function (data) {
                        var that = this;
                        $msg = "你真的要删除此记录么？";
                        if(data.children){
                            $msg = "删除菜单：【"+data.name+"】下面存在的子菜单将一并删除哦，确定要执行此操作么？";
                        }
                        if(data.id){
                            helper.confirm($msg, '删除提醒', function () {
                                helper.request(that.delUrl,'post',{id: data.id}, function (data) {
                                    if(data.errcode){
                                        helper.alert(data.errmsg, 'error');
                                        return false;
                                    }
                                    helper.alert(data.errmsg);
                                    page.loadData();
                                });
                            });
                        }
                    },
                    handlerCurrentChange: function () {
                        page.loadData();
                    }
                },
            });

            this.loadTypeData();
        },
        
        loadData: function (loadData) {
            var that = this;
            that.vue.loading = true;
            helper.request(that.vue.listUrl,'post',{where: that.vue.formSearch}, function (data) {
                that.vue.treeData = data.data.list;
            },function () {
                that.vue.refreshStatus = false;
                that.vue.loading = false;
                if(loadData)
                    loadData.typeLoading = false;
                loading = false;
            }, false);

        },
        loadTypeData: function () {
            that = this;
            that.vue.typeLoading = true;
            helper.request(that.vue.typeListUrl,'post',{page: this.vue.page, where: that.vue.formSearch}, function (data) {
                that.vue.typeData = data.data.list.data;
                if(!that.vue.formSearch.typeId && that.vue.typeData.length){
                    that.vue.formSearch.typeId = that.vue.typeData[0]['id'];
                    that.vue.menuTypeName = that.vue.typeData[0]['name'];
                }
                that.loadData();
            },function () {
                that.vue.typeLoading = false;
            }, false);
        }
    };
    return page;
});