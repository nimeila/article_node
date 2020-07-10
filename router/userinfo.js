const express = require('express');
const router = express.Router();
const userinfo_handle = require('../router_handle/userinfo');

// 导入验证表单数据的中间件
const expressJoi = require('@escook/express-joi');
//导入需要验证规则对象   及  导入新修改密码需要的验证规则
const { update_userinfo_schema, update_password_schema, update_avatar_schema } = require('../schema/user');
//导入新修改密码需要的验证规则
// const { update_password_schema } = require('../schema/user');
//获取用户的基本信息
router.get('/userinfo', userinfo_handle.getUserInfo);
// 更新用户的基本信息
router.post('/userinfo', expressJoi(update_userinfo_schema), userinfo_handle.updateUserInfo);
// 重置密码的路由
router.post('/updatepwd', expressJoi(update_password_schema), userinfo_handle.updatePassword);
// 更新用户头像的路由
router.post('/update/avater', expressJoi(update_avatar_schema), userinfo_handle.updateAvatar)

//向外共享这个router
module.exports = router;
//