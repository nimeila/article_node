// 该模块用于存放所有的路由模块
const express = require('express');
const router = express.Router();
const userHandle = require('../router_handle/user');

// 导入验证表单数据的中间件
const expressJoi = require('@escook/express-joi');
//导入需要验证规则对象
const { reg_login_schema } = require('../schema/user')



// 绑定路由
router.post('/login', expressJoi(reg_login_schema), userHandle.loginUser);
router.post('/register', expressJoi(reg_login_schema), userHandle.regUser)


// 向外共享router路由
module.exports = router;