// 导入校验模块
const joi = require('joi');

// 定义 分类名称 和 分类别名 的校验规则
const name = joi.string().required();
const alias = joi.string().alphanum().required();

// 定义 ID 校验规则
const id = joi.number().integer().min(1).required();

// 暴露 新增文章时的规则
exports.add_cate_schema = {
    body: {
        name,
        alias,
    },
}

// 暴露 根据id删除文章分类的规则
exports.del_cate_schema = {
    params: {
        id,
    }
}

// 暴露 根据 id 更新文章分类规则
exports.update_cate_schema = {
    body: {
        Id: id,
        name,
        alias,
    }
}