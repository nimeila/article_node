// 该模块用于存放路由中的处理函数

// 导入数据库
const db = require('../db/index');
// 导入密码加密模块；
const bcrypt = require('bcryptjs');
// 生成token的模块
const jwt = require('jsonwebtoken');
// 导入Token 密钥配置文件
const config = require('./config');


exports.regUser = (req, res) => {
    // 检测表单数据是否合法
    // 获取客户端提交到服务器的信息
    const userinfo = req.body;
    // if (!userinfo.username || !userinfo.password) {
    //     return res.send({ status: 1, message: '用户名或者密码不能为空！' })
    // }
    // 检测用户名是否被占用
    const sqlStr = 'select * from ev_users where username=?'
    db.query(sqlStr, userinfo.username, (err, results) => {
        if (err) {
            // return res.send({ status: 1, message: err.message })
            // 采用res.cc()函数
            return res.cc(err)
        }
        // 如果用户名被占用
        if (results.length > 0) {
            // return res.send({ status: 1, message: '用户名被占用，请更换其他用户名' });
            return res.cc('用户名被占用，请更换其他用户名')
        }
        // 如果没有被占用，就要对密码进行加密，然后保存到数据库里
        userinfo.password = bcrypt.hashSync(userinfo.password, 10);
        // 插入新用户
        const sql = 'insert into ev_users set ?';
        // 调用 db.query() 执行 SQL 语句
        db.query(sql, { username: userinfo.username, password: userinfo.password }, (err, results) => {
            // 判断 SQL 语句是否执行成功
            // if (err) return res.send({ status: 1, message: err.message })
            if (err) return res.cc(err)
                // 判断影响行数是否为 1
                // if (results.affectedRows !== 1) return res.send({ status: 1, message: '注册用户失败，请稍后再试！' })
            if (results.affectedRows !== 1) return res.cc('注册用户失败，请稍后再试！')
                // 注册用户成功
                // res.send({ status: 0, message: '注册成功！' })
            res.cc('注册成功！', 0)
        })
    })


    // res.send('登陆成功')
}
exports.loginUser = (req, res) => {
    // res.send('登录成功')
    //接收表单数据
    const userinfo = req.body;
    // SQL查询语句
    const sql = 'select * from ev_users where username=?';
    // 执行sql语句
    db.query(sql, userinfo.username, (err, results) => {
        // 执行SQL语句失败
        if (err) return res.cc(err);
        // 执行SQL语句成功，但是查询到的数据条数不等于1
        if (results.length !== 1) return res.cc('登录失败！');
        // 以用户名查询到的数据匹配成功
        // 用户输入的密码与数据库中的密码进行对比
        const compareResult = bcrypt.compareSync(userinfo.password, results[0].password);
        // 如果对比的结果返回false,说明用户输入的密码不正确
        if (!compareResult) return res.cc('登录失败');
        // 如果密码正确
        // 生成JWT的Token的字符串，但是这个Token不能保存密码和头像
        const user = {...results[0], password: '', user_pic: '' };

        const tokenStr = jwt.sign(user, config.jwtSecretKey, { expiresIn: '24h' });
        res.send({
            status: 0,
            message: '登陆成功',
            token: 'Bearer' + tokenStr
        })
    })
}