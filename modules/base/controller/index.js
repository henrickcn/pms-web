/**
 * 首页基础模块
 * @author henrick
 * @create-time 2019-10-17
 * @version v1.0
 */
define(function () {
    new Vue({
        el : '#app',
        data : function () {
            return {
                leftMenuCollapse : false,
                visible : false,
                isCollapse: true,
                leftMenuTop: document.documentElement.clientHeight - 121,
                cities: [{
                    value: '深圳',
                    label: '新安洪浪北店',
                    id: 1,
                },{
                    value: '深圳',
                    label: '新安宝安公园店',
                    id: 2
                }],
                value:[]
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
    return true;
});