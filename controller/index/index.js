define(function () {
    new Vue({
        el : '#app',
        data : function () {
            return {
                visible : false,
                isCollapse: true
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