/**
 * 助手公共方法
 * @author henrick
 * @create-time 2019-10-18
 * @version 1.0
 */
define(['config'], function (config) {
    var helper = {
        pageLoading: '',
        mainPage: '', //主页面对象
        vue: new Vue(),
        error: function (status, msg, data) { //js统一返回格式方法
            return {
                code : status || 0,
                msg  : msg    || '成功',
                data : data   || {}
            }
        },
        request : function (url, type, data, success, complete) { //ajax请求方法
            var loading = this.loading();
            $.ajax({
                url      : config.apiDoMain + '/' + url,
                type     : type||'get',
                data     : data,
                dataType : 'json',
                success  : function (data) {
                    typeof success === "object" ? success(data):'';
                },
                complete : function (req, data) {
                    loading.close();
                    if(req.status == 401 || data.code == 401){
                        window.location.href = "#m/user/login";
                        return false;
                    }
                    typeof complete === "object" ? complete(req, data):'';
                },
                error: function (status, data) {
                    if(data == 'error'){
                        helper.vue.$message.error("系统发生错误，请联系管理员");
                        return false;
                    }
                }
            });
        },
        loading: function (text, bgColor, className) {  //页面加载动画
            return helper.pageLoading = helper.vue.$loading({
                lock: true,
                text: text || '正在初始化中',
                spinner: 'el-icon-loading',
                background: bgColor || 'rgba(0, 0, 0, 0.8)',
                customClass: className || 'page-loading'
            });
        }
    }
    return helper;
});