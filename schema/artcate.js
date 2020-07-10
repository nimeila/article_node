// 导入定义验证规则的模块
const joi = require('@hapi/joi');
const name = joi.string().required();
const alias = joi.string().alphanum().require();
const id = joi.number().integer().min(1).required();


exports.add_cate_schema = {
    body: {
        name,
        alias,
    }
}

exports.delete_cate_schema = {
    body: {
        id,
    }
}

exports.get_cate_schema = {
    body: {
        id,
    }
}