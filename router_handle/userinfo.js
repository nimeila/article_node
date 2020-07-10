// 连接数据库
const db = require('../db/index');
// 解析旧密码
const bcrypt = require('bcryptjs')


// 获取用户信息的处理函数
exports.getUserInfo = (req, res) => {
    const sql = 'select id,username,nickname,email,user_pic from ev_users where id=?';
    // req.user 是Token解析成功，express-jwt这个中间件挂上去的
    db.query(sql, req.user.id, (err, results) => {
        // 执行SQL语句失败
        if (err) return res.cc(err);
        // 执行SQL语句失败，但是查询到的数据条数不等于1 
        if (results.length !== 1) return res.cc('获取用户信息失败！');
        // 执行语句成功
        res.send({
            status: 0,
            message: '获取用户信息成功',
            data: results[0]
        })
    })
};
//更新用户信息的处理函数
exports.updateUserInfo = (req, res) => {
    // sql语句
    // res.send('ok')
    const sql = 'update ev_users set ? where id=?';
    db.query(sql, [req.body, req.body.id], (err, results) => {
        if (err) return res.cc(err);
        if (results.affectedRows !== 1) return res.cc('修改用户基本信息失败');
        // 修改用户信息成功
        return res.cc('修改用户基本信息成功！', 0)
    })
};
// 重置密码
exports.updatePassword = (req, res) => {
    //定义根据id查询用户数据的SQL语句
    const sql = 'select * from ev_users where id=?'
    db.query(sql, req.user.id, (err, results) => {
        // SQL语句执行失败
        if (err) return res.cc(err);
        if (results.length !== 1) return res.cc('用户不存在');
        // 匹配成功后的操作
        // 判断用户提交的旧密码是否正确
        const compareResult = bcrypt.compareSync(req.body.oldPwd, results[0].password);
        if (!compareResult) return res.cc('原密码错误！');
        // 旧密码与数据库里的密码匹配成功 
        const sql = 'update ev_users set password=? where id=?';
        const newPwd = bcrypt.hashSync(req.body.newPwd, 10);
        db.query(sql, [newPwd, req.user.id], (err, results) => {
            if (err) return res.cc(err)
            if (results.affectedRows !== 1) return res.cc('更新密码失败！')
            res.cc('更新密码成功', 0)
        })
    })

};
// 更换头像
exports.updateAvatar = (req, res) => {
    const sql = 'update ev_users set user_pic = ? where id = ?'
    db.query(sql, [req.body.avatar, req.user.id], (err, results) => {
        if (err) return res.cc(err);
        if (results.affectedRows !== 1) return res.cc('更新头像失败');
        res.cc('更新用户成功！', 0);
    })
}