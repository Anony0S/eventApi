// 导入 express 
const express = require('express');
const joi = require('joi');

// 创建 web 实例
const app = express();

// 导入 cors 并
// 设置跨域全局中间件
const cors = require('cors');
app.use(cors());

// 配置解析表单数据的中间件
// 注意：只能解析 application/x-www-form-urlencoded 格式的表单数据
app.use(express.urlencoded({ extended: false }));

// 托管静态资源
app.use('/uploads',express.static('./uploads'))

// 一定要在路由之前，封装 res.cc 函数
app.use((req, res, next) => {
    // status 默认值为1，表示失败的情况
    // err 可能是字符串，也可能是一个错误对象
    res.cc = function (err, status = 1) {
        res.send({
            status,
            message: err instanceof Error ? err.message : err,
        })
    }

    next();
})
// 一定要在路由之前配置解析 token 的中间件
const config = require('./config');
const expressJWT = require('express-jwt');
// 设置那些接口不需要验证
app.use(expressJWT({ secret: config.jwtSecretKey }).unless({ path: [/^\/api\//] }));

// 导入并注册路由模块
const userRouter = require('./router/user');
app.use('/api', userRouter);

// 导入并注册获取用户信息模块
const userInfoRouter = require('./router/userinfo');
app.use('/my', userInfoRouter);

// 导入并注册文章分类模块
const articleCateRouter = require('./router/artcate');
app.use('/my/article', articleCateRouter);

// 导入并注册文章管理模块
const articleRouter = require('./router/article');
app.use('/my/article', articleRouter);

// 定义错误级别的中间件
app.use(function (err, req, res, next) {
    // 验证失败导致的错误
    if (err instanceof joi.ValidationError) return res.cc(err);
    // 身份认证失败的错误
    if (err.code === 'credentials_required') return res.cc('身份信息认证失败！');
    // 未知的错误
    res.cc(err);
    next();
})

// 启动
app.listen(3007, () => {
    console.log('API server running at http://127.0.0.1:3007');
})