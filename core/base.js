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
            var pageUrl = url.substr(1);
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
                moduleBaseUrl : modulesBaseUrl,
                pageUrl : pageUrl
            });
        },
        basePageInit: function (routerData) { //基础页面初始化
            var sourceHeight = 61;
            helper.mainPage = new Vue({
                el : '#app',
                data : function () {
                    return {
                        boxStatus:{
                            main   : true,
                            header : true,
                            left   : true, //左侧菜单
                            footer : false  //底部菜单
                        },
                        mainContentHeight: sourceHeight,
                        msgDrawer:false, //默认消息框
                        leftMenuCollapse : false, //左侧菜单是否折叠
                        leftMenuTop: document.documentElement.clientHeight - sourceHeight,
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
                        },
                        tabWindow:[ //标签窗口
                            {
                                "name" : "工作台",
                                "url"  : "pms/base/home"
                            },
                            {
                                "name" : "权限管理",
                                "url"  : "pms/base/auth"
                            },
                            {
                                "name" : "菜单分类管理",
                                "url"  : "pms/base/menu"
                            },
                            {
                                "name" : "菜单配置管理",
                                "url"  : "pms/base/menulist"
                            },
                            {
                                "name" : "管理员用户-管理",
                                "url"  : "pms/base/user"
                            }
                        ],
                        tabWindowActive: 'pms/base/workspace'
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
                    },
                    switchPage: function (page) {
                        window.location.href = "#"+this.tabWindowActive;
                    },
                    closePage: function (page) {
                        var prevPage = this.tabWindow[0];
                        for(key in this.tabWindow){
                            if(page == this.tabWindow[key]['url'] && key!=0){
                                this.tabWindow.splice(key, 1);
                                this.tabWindowActive = prevPage.url;
                                this.switchPage(prevPage);
                                return false;
                            }
                            prevPage = this.tabWindow[key];
                        }
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

                },
                filters: {
                    formatUrl: function (data) {
                        return data.replace(/\//g, '_');
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
            helper.mainPage.tabWindowActive = routerData.pageUrl;
            var vueId = routerData.pageUrl.replace(/\//g, '_');
            var that = this;
            if(routerData.moduleJs == 'modules/user/controller/login' || routerData.moduleType == 'other'){
                helper.mainPage.boxStatus.main = false;
                $("#otherApp").html(""); //清空内容
                var loading = helper.loading();
                $.get(routerData.moduleView,{},function (html) {
                    $("#otherApp").html(html);
                    loading.close();
                    that.queryController(routerData.moduleJs, vueId);
                });
                return false;
            }
            if(!$("#"+vueId).html()){
                var loading = helper.loading();
                $.get(routerData.moduleView,{},function (html) {
                    $("#"+vueId).html('<div id="'+vueId+'__Box" v-cloak>'+html+'</div>');
                    that.queryController(routerData.moduleJs, vueId+'__Box');
                    loading.close();
                });
            }
        },
        queryController: function (controller, id) {
            if(!controller){
                return false;
            }
            requirejs([controller+'.js'],function (controller) {
                controller.init(id);
            });
        }
    }
    return base;
});
