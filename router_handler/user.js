// 导入数据库操作模块
const db = require('../db/index')
// 导入 bcrypt 模块
const bcrypt = require('bcryptjs');
// 导入生成 token 的包
const jwt = require('jsonwebtoken');
// 导入密钥
const config = require('../config');

// 抽离路由模块 使用 exports 暴露出去
// 注册新用户
exports.regUser = (req, res) => {
    // 拿到用户提交的数据
    const userinfo = req.body;
    // 校验表单数据的合法性 ===> 校验输入数据合法性放在了路由中间件里面
    // if (!userinfo.username || !userinfo.password) {
    //     res.send({ status: 1, message: '用户名或密码为空！' })
    // }

    // 定义 SQL 语句，查询用户名是否被占用
    const sqlStr = 'select * from ev_users where username=?';
    db.query(sqlStr, userinfo.username, (err, results) => {
        if (err) return res.cc(err);
        if (results.length > 0) return res.cc('用户名被占用，请输入其他用户名！');
        // 用户输入密码可用时，对密码进行加密存储 bcrypt.hashSync
        userinfo.password = bcrypt.hashSync(userinfo.password, 10);

        // 定义插入新用户的语句
        const sqlStr = 'insert into ev_users set ?';
        db.query(sqlStr, { username: userinfo.username, password: userinfo.password }, (err, results) => {
            if (err) return res.cc(err);
            if (results.affectedRows !== 1) return res.cc('注册失败！');
            res.cc('注册新用户成功！', 0)
        })
    })
}

// 登录
exports.login = (req, res) => {
    // 拿到用户提交的数据
    const userinfo = req.body;
    // 定义 SQL 语句
    const sqlStr = 'select * from ev_users where username=?'
    // 调用数据库查询
    db.query(sqlStr, userinfo.username, (err, results) => {
        // 执行错误时
        if (err) return res.cc(err);
        // 执行正确，但是查询到的数据条数不等于 1
        if (results.length !== 1) return res.cc('登陆失败！');
        // TODO：判断用户输入和数据库是否一致

        // 登陆成功时，返回信息，并改变 status 的值
        const compareResult = bcrypt.compareSync(userinfo.password, results[0].password);
        if (!compareResult) return res.cc('登陆失败，密码不正确！');

        // 在服务端生成 token 的字符串
        const user = { ...results[0], password: '', user_pic: '' };
        // 对用户信息进行加密，生成token字符串
        const tokenStr = jwt.sign(user, config.jwtSecretKey, { expiresIn: config.expiresIn });

        // 向客户端响应
        res.send({
            status: 0,
            message: '登陆成功！',
            // 添加 Bearer 前缀，方便使用，注意===空格===
            token: 'Bearer ' + tokenStr,
        })
    })
}