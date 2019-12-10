/**
 * 菜单表单验证模块
 * @author henrick
 * @create-time 2019-11-17
 * @version v1.0
 */
define(function () {
    return {
        form : {
            name : '',
            type_id: '',
            weight: 0,
            is_hide: '是'
        },
        rules: {
            name : [
                { required: true, message: '此项为必填项', trigger: 'blur' }
            ],
            type_id : [
                { required: true, message: '此项为必填项', trigger: 'blur' }
            ]
        }
    }
});