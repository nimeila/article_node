const joi = require('@hapi/joi')
const username = joi.string().alphanum().min(3).max(10).required();
const password = joi.string().pattern(/^[\S]{6,12}$/).required();
const id = joi.number().integer().min(1).required();
const nickname = joi.string().required();
const email = joi.string().email().required();


// dataUri() 指的是如下格式的字符串数据： 
// data:image/png;base64,VE9PTUFOWVNFQ1JFVFM=
const avatar = joi.string().dataUri.required();

// 注册登录的验证对象
exports.reg_login_schema = {
    body: {
        username,
        password
    }
};
// 更新信息的验证对象
exports.update_userinfo_schema = {
    body: {
        id,
        nickname,
        email,
    },
};
// 验证规则对象——重置密码
exports.update_password_schema = {
    body: {
        // 使用password这个规则，验证req.body.oldPwd的值;
        oldPwd: password,
        // 使用joi.not(joi.ref('oldPwd')).concat(password)规则，验证req.body.newPwd的值
        // joi.(ref('oldPwd')表示newPwd的值必须和oldPwd的值保持一致
        // joi.not(joi.ref('oldPwd'))表示newPwd的值不能等于oldPwd的值
        // .concat()用于合并joi.not(joi.ref('oldPwd'))和password这两条验证规则
        newPwd: joi.not(joi.ref('oldPwd')).concat(password)

    }
}

// 验证头像 
exports.update_avatar_schema = {
    body: {
        avatar,
    }
}