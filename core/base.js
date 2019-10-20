/**
 * @title HadminUI Web前端框架1.0
 * @url https://hadminui.hejinmin.com
 * @author henrick
 * @create-time 2019-10-17
 */
define(['require', 'config', 'helper'],function (require, config, helper) {
    var base = {
        init : function () { //初始化方法
            var routerRet = this.routerParse();
            if(routerRet.code){
                helper.vue.$message.error(routerRet.msg);
                return false;
            }
            //基础页面初始化
            this.basePageInit();
            return false;
        },
        routerParse: function () {  //路由解析
            var url = window.location.hash;
            if(!url){
                url = "#"+config.homeUrl;
            }
            url = url.substr(1).split("/");
            var moduleName = config.modulesConfig[url[0]]; //模块名字
            if(!url[0] || !moduleName){
                return helper.error(1, '页面加载错误或模块不存在');
            }
            return  helper.error(0,'成功',{
                moduleJs : moduleName + '/' + url[1] + '/controller/' + url[2]
            });
        },
        basePageInit: function () { //基础页面初始化
            helper.mainPage = new Vue({
                el : '#app',
                data : function () {
                    return {
                        msgDrawer:false, //默认消息框
                        leftMenuCollapse : false, //左侧菜单是否折叠
                        leftMenuTop: document.documentElement.clientHeight - 121,
                        shopStore: [
                            /*{
                                value: '深圳',
                                label: '新安洪浪北店',
                                id: 1,
                            }*/
                        ], //门店列表
                        storeId:[], //门店ID
                        topMenu: [], //底部菜单
                        topMenuActive: 'index',//默认选中菜单
                    }
                },
                methods: {
                    handleOpen: function(key, keyPath) {
                        console.log(key, keyPath);
                    },
                    handleClose: function(key, keyPath) {
                        console.log(key, keyPath);
                    },
                    switchLeftMenu: function () {
                        this.leftMenuCollapse = this.leftMenuCollapse ? false:true;
                    }
                }
            });

            //窗口更大小监听事件
            window.onresize = function () {
                if(helper.mainPage.leftMenuTop != document.documentElement.clientHeight - 121){
                    helper.mainPage.leftMenuTop = document.documentElement.clientHeight - 121;
                }
            };
            helper.request('site/index','get',{},function (data) {
                
            });
        }
    }
    base.init();
});
