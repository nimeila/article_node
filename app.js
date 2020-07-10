// 引入express模块
const express = require('express');
const app = express();
// 引入全局错误的中间件模块
const joi = require('@hapi/joi');
// 配置解析Token的中间件
const config = require('./router_handle/config');
// 解析Token的中间件
const expressJWT = require('express-jwt');

// 引入跨域
const cors = require('cors');
app.use(cors());
// 解析表单数据格式,application/x-wwww-form-urlencoded格式的表单数据
app.use(express.urlencoded({ extended: false }));



// 封装一个res.cc函数来优化res.send()代码
app.use((req, res, next) => {
    // stastus=0为成功，status=1为失败，默认将status=1
    res.cc = function(err, status = 1) {
        res.send({
            status,
            message: err instanceof Error ? err.message : err
        })
    }
    next()
})


// 引入路由模块
const userRouter = require('./router/user');
const userinfoRouter = require('./router/userinfo');
const artCateRouter = require('./router/artcate');

// 使用.unless({ path: [/^\/api\//] }) 指定哪些接口不需要进行 Token 的身份认证
app.use(expressJWT({ secret: config.jwtSecretKey }).unless({ path: [/^\/api\//] }))


// 给路由挂载前缀
app.use('/api', userRouter);
app.use('/my', userinfoRouter);
app.use('/my', artCateRouter);


// 全局错误中间件， 捕获验证失败的错误，并且把验证失败的结果响应给客户端
app.use(function(err, req, res, next) {
    // 数据验证错误
    if (err instanceof joi.ValidationError) return res.cc(err);
    // 未知错误
    res.cc(err)
        // 捕获身份认证失败的错误
    if (err.name === 'UnauthorizedError') return res.cc('身份认证失败')
})



// 启动服务器
app.listen(80, () => {
    console.log('app.server is running at http://127.0.0.1')
})