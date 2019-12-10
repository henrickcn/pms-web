/**
 * 用户模块
 * @author henrick
 * @create-time 2019-11-17
 * @version v1.0
 */
define(['helper', 'config'],function (helper, config) {
    var page = {
        vue: '',
        formObj: '',
        init: function (id) {
            this.vue = new Vue({
                el: '#'+id,
                data: function () {
                    var that = this;
                    var checkPassWord = function (rule, value, callback) {
                        if(!that.form.id && !value){
                            callback(new Error('请输入密码'));
                        }
                        callback();
                    }
                    return {
                        loading: true,
                        tableData: [],
                        dialogFormVisible: false,
                        form:{},
                        tableIndex: 0,
                        formSearch:{  //搜索区域表单
                            keyword : '',
                            orderBy : {prop:'create_time', orderBy:'descending'}
                        },
                        collapseValue:["1"],
                        rules:{
                            real_name: {required:true, message:'真实姓名不能为空'},
                            phone    : {required:true, message:'手机号不能为空'},
                            oa_name  : {required:true, message:'OA账号不能为空'},
                            email  : [
                                {required:true, message:'邮箱不能为空'},
                                {email: true, message: '邮箱格式错误'}
                            ],
                            pass_word: {validator:checkPassWord, message:'密码不能为空'}
                        },
                        page : config.getPage(),
                        refreshStatus: false,
                        delUrl: 'pms/user/del',
                        multipleSelection:[]
                    };
                },
                methods: {
                    addAuth: function (formName) {
                        var that = this;
                        this.form = {};
                        this.dialogFormVisible = true;
                        setTimeout(function () {
                            if(that.$refs[formName])
                                that.$refs[formName].clearValidate();
                        },200);

                    },
                    submitForm(formName) {
                        this.$refs[formName].clearValidate();
                        var that = this;
                        page.formObj = this.$refs[formName].validate(function(valid){
                            if (valid) {
                                helper.request('pms/user/editor', 'post', that.form, function (data) {
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
                    clearForm: function (formName) {
                        this.$refs[formName].clearValidate();
                    },
                    select: function(data){
                        this.formSearch.orderBy = {
                            prop    : data.prop,
                            orderBy : data.order
                        };
                        page.loadData();
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
                                var maxPage = Math.ceil((that.page.total-1)/that.page.size);
                                that.page.current = that.page.current>maxPage? maxPage:that.page.current;
                                console.log(that.page);
                                page.loadData();
                            });
                        });
                    },
                    createTimeFormat: function (row, column, cellValue, index) {
                        return row.create_time.substr(0,16)
                    }
                },
            });

            this.loadData();
        },
        
        loadData: function () {
            var that = this;
            that.vue.loading = true;
            helper.request('pms/user/list','post',{page: this.vue.page, data: this.vue.formSearch}, function (data) {
                that.vue.page = data.data.page;
                that.vue.tableData = data.data.data;
            },function () {
                that.vue.loading = false;
                that.vue.refreshStatus = false;
            }, false);
        }
    };
    return page;
});