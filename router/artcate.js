const express = require('express');
const router = express.Router();
const article_handle = require('../router_handler/artcate');

// 获取文章分类列表路由
router.get('/cates', article_handle.getArtCates);

// 新增文章分类列表路由
const expressJoi = require('@escook/express-joi')
const { add_cate_schema, del_cate_schema, update_cate_schema } = require('../schema/artcate')
router.post('/addcates', expressJoi(add_cate_schema), article_handle.addArtCates);

// 根据 ID 删除文章分类路由
router.get('/deletecate/:id', expressJoi(del_cate_schema), article_handle.delArtCates);

// 根据 Id 获取文章分类数据
router.get('/cates/:id', expressJoi(del_cate_schema), article_handle.getArtCatesById);

// 根据 Id 更新文章分类数据
router.post('/updatecate', expressJoi(update_cate_schema), article_handle.updateArtCateById);

// 暴露
module.exports = router;