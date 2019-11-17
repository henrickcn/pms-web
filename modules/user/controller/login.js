/**
 * @title 登录模块
 * @url https://hadminui.hejinmin.com
 * @author henrick
 * @create-time 2019-10-17
 */
define(['helper'],function (helper) {
    var login = {
        init: function () {
            if(helper.cookie.get('sessionId')){
                window.location.href = window.location.origin;
                return false;
            }
            new Vue({
                el : '#otherApp',
                data : function () {
                    return {
                        isDisabled: false,
                        loading: false,
                        login:{
                            username : '',
                            pass_word : ''
                        },
                        rules: {
                            username : [
                                {required : true, message: '请输入用户名', trigger: 'blur'},
                                {min: 4, max:100, message: '长度在 4 到 100 个字符', trigger: 'blur'}
                            ],
                            pass_word : [
                                {required : true, message: '请输入密码', trigger: 'blur'},
                                {min: 6, max:100, message: '密码长度在 6 到 100 个字符', trigger: 'blur'}
                            ]
                        }
                    };
                },
                methods: {
                    submitForm(formName) {
                        var that = this;
                        this.$refs[formName].validate((valid) => {
                            if (valid) {
                                this.loading = true;
                                this.isDisabled = true;
                                helper.request('pms/user/login','post',this.login, function (data) {
                                    if(data && data.errcode){
                                        helper.vue.$message.error(data.errmsg);
                                        return false;
                                    }
                                    helper.vue.$message.success(data.errmsg);
                                    helper.cookie.set('sessionId', data.data.session_key, 2);
                                    window.location.href = "/";
                                },function () {
                                    that.loading = false;
                                    that.isDisabled = false;
                                },false);
                            } else {
                                return false;
                            }
                        });
                    },
                    resetForm(formName) {
                        this.$refs[formName].resetFields();
                    }
                }
            });
        }
    };
    return login;
});