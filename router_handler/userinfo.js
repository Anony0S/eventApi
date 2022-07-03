// 导入数据库模块
const db = require('../db/index');
// 导入验证密码的模块
const bcrypt = require('bcryptjs');

// 定义获取用户信息的函数
exports.getUserInfo = (req, res) => {
    // 定义数据库查询语句
    const sqlStr = 'select id, username, nickname, email, user_pic from ev_users where id=?';

    // token 验证成功之后会将 user 挂载到 req 下面，从而能找到请求的id
    db.query(sqlStr, req.user.id, (err, results) => {
        if (err) return res.cc(err);
        if (results.length !== 1) return res.cc('获取用户信息失败！');
        res.send({
            status: 0,
            message: '获取用户信息成功！',
            data: results[0],
        })
    })
}

// 定义更新用户信息的函数
exports.updateUserInfo = (req, res) => {
    // 定义 sql 语句
    const sqlStr = 'update ev_users set ? where id=?'
    db.query(sqlStr, [req.body, req.user.id], (err, results) => {
        if (err) return res.cc(err);
        if (results.affectedRows !== 1) return res.cc('修改用户信息失败！');
        res.cc('修改用户信息成功！', 0);
    })
}

// 定义重置密码的函数
exports.updateUserPwd = (req, res) => {
    // 定义 SQL 语句
    const sqlStr = 'select * from ev_users where id=?';
    // 执行语句
    db.query(sqlStr, req.user.id, (err, results) => {
        if (err) return res.cc(err);
        if (results.length != 1) return res.cc('用户不存在！');
        
        // TODO：判断旧密码是否成功
        const bcruptResult = bcrypt.compareSync(req.body.oldPwd, results[0].password)
        if(!bcruptResult) return res.cc('原密码错误！');

        // TODO：修改数据库密码
        // 定义 SQL 语句
        const sqlStr = 'update ev_users set password=? where id=?';
        const newPwd = bcrypt.hashSync(req.body.newPwd, 10)
        // 执行
        db.query(sqlStr, [newPwd, req.user.id], (err, results) => {
            if(err) return res.cc(err);
            // 影响的行数不等于 1
            if(results.affectedRows !== 1) return res.cc('重置密码失败！');
            res.cc('更新密码成功！', 0);
        })
    })
}

// 定义更新头像的方法
exports.updateAvatar =  (req, res) => {
    // 定义 sql 语句
    const sqlStr = 'update ev_users set user_pic=? where id=?';
    // 执行
    db.query(sqlStr, [req.body.avatar, req.user.id], (err, results) => {
        if(err) return res.cc(err);
        if(results.affectedRows !== 1) return res.cc('上传头像失败！')
        res.cc('上传头像成功！', 0);
    })
}