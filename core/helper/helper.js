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
        request : function (url, type, data, success, complete, isShowHide) { //ajax请求方法
            isShowHide = isShowHide===undefined ? true:isShowHide;
            data = data||{};
            data.__session_key = this.cookie.get("sessionId");
            if(isShowHide)
                var loading = this.loading();
            $.ajax({
                url      : config.apiDoMain + '/' + url,
                type     : type||'get',
                data     : data,
                dataType : 'json',
                //headers : {Authorization: data.session_key},
                success  : function (data) {
                    typeof success === "function" ? success(data):'';
                },
                complete : function (req, data) {
                    if(isShowHide)
                        loading.close();
                    if(req.status == 401 || (req.responseJSON && req.responseJSON.errcode == 100)){
                        helper.cookie.set("sessionId", "", 0);
                        window.location.href = "#pms/user/login";
                        return false;
                    }
                    typeof complete === "function" ? complete(req, data):'';
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
        },
        log: function () {
            if(config.env === 'product'){
                return true;
            }
            if(arguments.length){
                for(key in arguments){
                    console.log(arguments[key]);
                }
            }else{
                console.log('结果为空');
            }

        },
        cookie: {
            set : function (name, value, day) {
                var d = new Date();
                d.setTime(d.getTime() + (day*24*60*60*1000));
                var expires = "expires="+ d.toUTCString();
                document.cookie = name + "=" + value + ";" + expires + ";path=/";
            },
            get: function (name) {
                var name = name + "=";
                var decodedCookie = decodeURIComponent(document.cookie);
                var ca = decodedCookie.split(';');
                for(var i = 0; i <ca.length; i++) {
                    var c = ca[i];
                    while (c.charAt(0) == ' ') {
                        c = c.substring(1);
                    }
                    if (c.indexOf(name) == 0) {
                        return c.substring(name.length, c.length);
                    }
                }
                return "";
            }
        },
        postData: function (data, fn) {
            if(data.errcode){
                helper.vue.$message.error(data.errmsg);
                return false;
            }
            helper.vue.$message.success(data.errmsg);
            fn();
        }
    }
    return helper;
});