// 导入数据库模块
const db = require('../db/index')

// 获取文章分类
exports.getArtCates = (req, res) => {
    // 定义 sql 语句
    const sqlStr = 'select * from ev_article_cate where is_delete="0" order by Id asc'
    db.query(sqlStr, (err, results) => {
        if (err) return res.cc(err);
        res.send({
            status: 0,
            message: '获取文章分类成功！',
            data: results,
        })
    })
}

// 新增文章分类
exports.addArtCates = (req, res) => {
    // 判断名字重复 ==> 返回响应提示
    const sqlStr = 'select * from ev_article_cate where name=? or alias=?';
    db.query(sqlStr, [req.body.name, req.body.alias], (err, results) => {
        if (err) return res.cc(err);
        if (results.length === 1 && results[0].name === req.body.name) return res.cc('分类名称被占用，请更换后再试！');
        if (results.length === 1 && results[0].alias === req.body.alias) return res.cc('分类别名被占用，请更换后再试！');
        if (results.length === 2 && results[0].alias === req.body.alias && results[0].name === req.body.name) return res.cc('分类名称和分类别名分别被占用，请更换后再试！');
        if (results.length === 2) return res.cc('分类名称和分类别名被占用，请更换后再试！');
        // 新增数据
        const sqlStr = 'insert into ev_article_cate set ?';
        const cate = { name: req.body.name, alias: req.body.alias };
        db.query(sqlStr, cate, (err, results) => {
            if (err) return res.cc(err);
            if (results.affectedRows !== 1) return res.cc('插入数据失败！');
            res.cc('插入数据成功！', 0)
        })
    })
}

// 根据 ID 删除文章分类
exports.delArtCates = (req, res) => {
    // 注意：使用标记删除
    const sqlStr = 'update ev_article_cate set is_delete=1 where Id=?';
    db.query(sqlStr, req.params.id, (err, results) => {
        if (err) return res.cc(err);
        if (results.affectedRows !== 1) return res.cc('删除数据失败！');
        res.cc('删除文章分类成功！', 0);
    })
}

// 根据 Id 获取文章分类数据
exports.getArtCatesById = (req, res) => {
    // 定义查询语句
    const sqlStr = 'select * from ev_article_cate where Id=?';
    db.query(sqlStr, req.params.id, (err, results) => {
        if (err) return res.cc(err);
        if (results.length !== 1 || results[0].is_delete === 1) return res.cc('获取文章分类数据失败！');
        res.send({
            status: 0,
            message: '获取文章分类数据成功！',
            data: results[0],
        })
    })
}

// 根据 Id 更新文章分类
exports.updateArtCateById = (req, res) => {
    // 先进行查重，避免输入数据重复
    const sqlStr = 'select * from ev_article_cate where id<>? and (name=? or alias=?)';
    db.query(sqlStr, [req.body.Id, req.body.name, req.body.alias], (err, results) => {
        if (err) return res.cc(err);
        if (results.length === 2) return res.cc('分类名称与别名被占用，请更换后重试！');
        if (results.length === 1 && results[0].name === req.body.name && results[0].alias === req.body.alias) return res.cc('分类名称与别名被占用，请更换后重试！');
        if (results.length === 1 && results[0].name === req.body.name) return res.cc('分类名称被占用，请更换后重试！');
        if (results.length === 1 && results[0] && results[0].alias === req.body.alias) return res.cc('分类别名被占用，请更换后重试！');

        // 提交数据合格时：
        const sqlStr = 'update ev_article_cate set ? where id=?';
        const update = { name: req.body.name, alias: req.body.alias };
        // 执行
        db.query(sqlStr, [update, req.body.Id], (err, results) => {
            if (err) return res.cc(err);
            if (results.affectedRows !== 1) return res.cc('更新文章分类失败！');
            res.cc('更新文章分类成功！', 0);
        })
    })
    
}