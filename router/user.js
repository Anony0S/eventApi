const express = require('express');
// 创建路由实例
const router = express.Router();

// 挂载路由方法
const router_handle = require('../router_handler/user');

// 导入验证数据的中间件
const expressJoi = require('@escook/express-joi');
// 导入需要的验证规则对象 ==> 使用结构赋值的方法 
const { reg_login_schema } = require('../schema/user');

// 注册新用户 ===> 使用 expressJoi 中间件处理验证规则
router.post('/reguser', expressJoi(reg_login_schema), router_handle.regUser);

// 登录
router.post('/login', expressJoi(reg_login_schema), router_handle.login);

// 将路由对象共享出去
module.exports = router;