/**
 * 菜单表单验证模块
 * @author henrick
 * @create-time 2019-11-17
 * @version v1.0
 */
define(function () {
    return {
        form : {
            name : ''
        },
        rules: {
            name : [
                { required: true, message: '分类名称不能为空', trigger: 'blur' }
            ]
        }
    }
});