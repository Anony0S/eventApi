const express = require('express');
const router = express.Router();
// 导入数据验证的中间件
const expressJoi = require('@escook/express-joi');

// 挂载路由

// 导入路由处理模块
const router_handler = require('../router_handler/userinfo');
const { update_userinfo_schema, update_pwd_schema, update_user_avatar } = require('../schema/user');

// 获取用户基本信息的路由
router.get('/userinfo', router_handler.getUserInfo);

// 更新用户信息的路由
router.post('/userinfo', expressJoi(update_userinfo_schema), router_handler.updateUserInfo);

// 重置密码的路由
router.post('/updatepwd', expressJoi(update_pwd_schema), router_handler.updateUserPwd);

// 更新用户投头像路由
router.post('/update/avatar', expressJoi(update_user_avatar), router_handler.updateAvatar);

module.exports = router;