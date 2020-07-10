// 导入express
const express = require('express');
const router = express.Router();
// 导入文章分类的路由处理函数模块
const artcate_handler = require('../router_handle/artcate')

// 导入验证数据的中间件
const expressJoi = require('@escook/express-joi');
// 导入验证文章的规则模块
const { add_cate_schema, delete_cate_schema, get_cate_schema } = require('../schema/artcate');


// 获取文章分类的列表数据
router.get('/cates', artcate_handler.getArticleCates);
// 添加文章分类的路由
router.post('/addcates', expressJoi(add_cate_schema), artcate_handler.addArticleCates);
// 根据ID删除文章分类
router.get('/deletecate/:id', expressJoi(delete_cate_schema), artcate_handler.deleteCateById);
// 根据ID获取文章分类数据
router.get('/cates/:id', expressJoi(get_cate_schema), artcate_handler.getArticleById);





// 向外共享路由对象
module.exports = router