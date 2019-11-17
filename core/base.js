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
            if(routerRet === false){
                return false;
            }
            //基础页面初始化
            this.basePageInit(routerRet.data);
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
                helper.vue.$message.error('页面加载错误或模块不存在');
                return false;
            }
            var modulesBaseUrl = moduleName + '/' + url[1];
            return  helper.error(0,'成功',{
                moduleJs   : modulesBaseUrl + '/controller/' + url[2],
                moduleView : modulesBaseUrl + '/view/' + url[2] + '.html',
                moduleBaseUrl : modulesBaseUrl
            });
        },
        basePageInit: function (routerData) { //基础页面初始化
            helper.mainPage = new Vue({
                el : '#app',
                data : function () {
                    return {
                        boxStatus:{
                            main   : true,
                            header : true,
                            left   : true, //左侧菜单
                            footer : true  //底部菜单
                        },
                        mainContentHeight: 121,
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
                        userInfo:{
                            avatar : ''
                        }
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
                },
                computed: {
                    footer: function(){
                        return this.boxStatus.footer;
                    },
                    leftMenuTop: function(){
                        return that.reloadAreaSize(this.mainContentHeight);
                    }
                },
                watch: {
                    footer : function (val) {
                        that.reloadAreaSize(val?121:61);
                    }
                }
            });

            var that = this;
            //窗口更大小监听事件
            window.onresize = function () {
                that.reloadAreaSize(helper.mainPage.mainContentHeight);
            };
            //路由监听事件
            window.onhashchange = function(){
                var routerRet = that.routerParse();
                if(routerRet === false){
                    return false;
                }
                that.loadController(routerRet.data);
            }
            //初始化基础数据
            this.loadBaseData(routerData);
        },
        reloadAreaSize: function(height){
            helper.mainPage.mainContentHeight = height;
            if(helper.mainPage.leftMenuTop != document.documentElement.clientHeight - helper.mainPage.mainContentHeight){
                helper.mainPage.leftMenuTop = document.documentElement.clientHeight - helper.mainPage.mainContentHeight;
            }
        },
        loadBaseData: function(routerData, isShowloading){ //加载基础数据
            var that = this;
            that.loadController(routerData);
            //初始化基础数据
            helper.request('pms/index/index','post',{},function (data) {
                //helper.mainPage.userInfo = data.data.userInfo;
            },function (data) {

            }, isShowloading);
        },
        loadController: function (routerData) { //加载控制器
            var loading = helper.loading();
            var that = this;
            if(routerData.moduleJs == 'modules/user/controller/login' || routerData.moduleType == 'other'){
                helper.mainPage.boxStatus.main = false;
                $("#otherApp").html(""); //清空内容

                $.get(routerData.moduleView,{},function (html) {
                    $("#otherApp").html(html);
                    loading.close();
                    that.queryController(routerData.moduleJs);
                });
                return false;
            }

            $.get(routerData.moduleView,{},function (html) {
                $("#MainApp").html(html);
                that.queryController(routerData.moduleJs);
                loading.close();
            });
        },
        queryController: function (controller) {
            if(!controller){
                return false;
            }
            requirejs([controller+'.js'],function (controller) {
                controller.init();
            });
        }
    }
    return base;
});
