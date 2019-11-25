/**
 * 开发环境配置文件
 * @author henrick
 * @datetime 2019-10-17
 * @version 1.0
 */
define(function () {
    return {
        v: '1.0', //当前版本
        env: 'develop', //当前环境
        apiDoMain : 'http://api.pms.com',
        homeUrl: 'm/base/index',
        modulesConfig: {
            m : 'modules' //模块
        },
        page: {
            current : 1,
            total: 0,
            sizes: [10,20,30,40,50,100],
            size: 10,
            layout: 'total, sizes, prev, pager, next, jumper'
        },
        getPage: function () { //用于后续记住那一页
            return this.page;
        }
    }
});