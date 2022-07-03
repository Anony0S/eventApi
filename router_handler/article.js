// 文章处理函数模块
const path = require('path');
const db = require('../db');

// 发布文章函数
exports.addArticle = (req, res) => {
    // 手动校验 req.file
    if (!req.file || req.file.fieldname !== 'cover_img') return res.cc('文章封面是必选参数！')

    // 处理文章信息
    const articleInfo = {
        // 将提交的数据进行解构 包含 标题、内容、发布状态、所属分类的 Id
        ...req.body,
        // 文章封面的存放路径
        cover_img: path.join('/uploads', req.file.fieldname),
        // 文章发布时间
        pub_date: new Date(),
        // 文章作者 Id：通过请求Token解析出来挂载到user上的
        author_id: req.user.id,
    }

    // 定义 SQL 语句
    const sqlStr = 'insert into ev_articles set ?';
    // 执行
    db.query(sqlStr, articleInfo, (err, results) => {
        if(err) return res.cc(err);
        if(results.affectedRows !== 1) return res.cc('发表文章失败！');
        res.cc('发表文章成功！', 0);
    })
}