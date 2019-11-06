/**
 * @title 登录模块
 * @url https://hadminui.hejinmin.com
 * @author henrick
 * @create-time 2019-10-17
 */
define(['helper'],function (helper) {
    var login = {
        init: function () {
            new Vue({
                el : '#otherApp',
                data : function () {
                    return {
                        isDisabled: false,
                        loading: false,
                        login:{
                            username : '',
                            password : ''
                        },
                        rules: {
                            username : [
                                {required : true, message: '请输入用户名', trigger: 'blur'},
                                {min: 4, max:100, message: '长度在 4 到 100 个字符', trigger: 'blur'}
                            ],
                            password : [
                                {required : true, message: '请输入密码', trigger: 'blur'},
                                {min: 6, max:100, message: '密码长度在 6 到 100 个字符', trigger: 'blur'}
                            ]
                        }
                    };
                },
                methods: {
                    submitForm(formName) {
                        this.$refs[formName].validate((valid) => {
                            if (valid) {
                                this.loading = true;
                                this.isDisabled = true;
                                helper.request('pms/user/login','post',this.login, function (data) {

                                },function () {

                                },false);
                            } else {
                                console.log('error submit!!');
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
    login.init();
    return true;
});