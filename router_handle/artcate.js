const db = require('../db/index');


// 获取文章列表
exports.getArticleCates = (req, res) => {

    const sql = 'select * from ev_article_cate where is_delete=0 order by id asc';

    db.query(sql, (err, results) => {
        if (err) return res.cc(err);
        // 2. 执行 SQL 语句成功
        res.send({
            status: 0,
            message: '获取文章分类列表成功！',
            data: results,
        })
    })
};



// 增加文章分类
exports.addArticleCates = (req, res) => {

    const sql = 'select * from ev_article_cate where name=? or alias=?';

    db.query(sql, [req.body.name, req.body.alias], (err, results) => {
        if (err) return res.cc(err);
        if (results.length === 2) return res.cc('分类名称与别名被占用，请更换后再试！');
        if (results.length === 1 && results[0].name === req.body.name) return res.cc('分类名称被占用，请更换后再试！');
        if (results.length === 1 && results[0].alias === req.body.alias) return res.cc('分类别名被占用，请更换后再试！');
        // 匹配上之后
        const sql = 'insert into ev_article_cate set ?';
        db.query(sql, req.body, (resq, res) => {
            if (err) return res.cc(err);
            if (results.affectedRows !== 1) return res.cc('新增文章分类失败！')
            res.cc('新增文章分类成功！', 0)

        })
    })

}


//根据ID删除分类
exports.deleteCateById = (req, res) => {
    const sql = 'update ev_article_cate set is_delete where id = ?'
    db.query(sql, req.params.id, (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows !== 1) return res.cc('删除文章分类失败')
        res.cc('删除文章成功', 0)
    })
}


// 根据ID获取文章分类数据
exports.getArticleById = (req, res) => {
    const sql = 'select * from ev_article_cate where id= ?'
    db.query(sql, req.params.id, (err, results) => {
        if (err) return res.cc(err);
        if (results.length !== 1) return res.cc('获取为文章分类失败！')
        res.send({
            status: 0,
            message: '获取文章分类数据成功！',
            date: result[0],
        })
    })
}

//根据ID更新文章分类数据