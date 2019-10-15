define(function () {
    new Vue({
        el : '#app',
        data : function () {
            return {
                visible : false,
                isCollapse: true,
                leftMenuTop: document.documentElement.clientHeight - 60
            }
        },
        methods: {
            handleOpen(key, keyPath) {
                console.log(key, keyPath);
            },
            handleClose(key, keyPath) {
                console.log(key, keyPath);
            }
        }
    });
    return true;
});