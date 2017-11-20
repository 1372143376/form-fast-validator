
var f = document.forms[0]

f.oninput = function (e) {
   validator.result(e.target.name)
}

f.onsubmit = function (e) {
    e.preventDefault()

    if (validator.result()) {
        console.log(validator.getData('repeatPassword'))
    }
}


var validator = new Validator(f, {
    className: 'red'
})

validator
        .pattern('username', /^[0-9a-zA-Z_]+$/)
        .pattern('password', '^[0-9a-zA-Z_]+$')
        .add('username', [
                ['notEmpty', '用户名不能为空'],
                ['min:3', '至少3个字符'],
                ['max:10', '最多10个字符'],
                ['test:username', '只能包含数字和字母']
            ])

        .add('password', [
                ['notEmpty', '密码不能为空'],
                ['min:6', '至少6个字符'],
                ['max:16', '最多16个字符'],
                ['test:password', '只能包含数字和字母']
            ])

        .add('repeatPassword', [
                 ['notEmpty', '重复密码不能为空'],
                 ['equal:password', '两次输入的密码不相等']
        ])

        .add('email', [
                ['notEmpty', '邮箱不能为空'],
                ['test:email', '格式不正确']
            ])

        .add('phone', [
                ['notEmpty', '手机号不能为空'],
                ['test:phone', '格式不正确']
            ])