// 文章的路由模块
const express = require('express');
// 注册路由实例
const router = express.Router();
const article_handle = require('../router_handler/article')

// 导入 multer 和 path
const multer = require('multer');
const path = require('path');

// 创建 multer 的实例
const upload = multer({dest: path.join(__dirname, '../uploads')})

// 导入验证数据的中间件
const expressJoi = require('@escook/express-joi');
// 导入需要验证规则的对象
const artitle_schema = require('../schema/article')

// 发布文章的路由
router.post('/add', upload.single('cover_img'), expressJoi(artitle_schema.add_atrticle_schema), article_handle.addArticle);

module.exports = router;