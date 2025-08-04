const {Article} = require('../models/models');
const ApiError = require('../error/ApiError');
const slugify = require('slugify');
const {cloudinary, extractPublicId} = require('../utils/cloudinary');

class ArticleController {
    // [POST] /api/article
    async create(req, res, next) {
        try {
            const {title, content} = req.body;
            if (!title || !title.trim()) {
                return next(ApiError.badRequest('Title is required'));
            }
            if (!content || !content.trim()) {
                return next(ApiError.badRequest('Content is required'));
            }

            // optional image upload
            let imageUrl = null;
            if (req.files?.image) {
                const {image} = req.files;
                const result = await cloudinary.uploader.upload(image.tempFilePath, {
                    folder: 'articles',
                });
                imageUrl = result.secure_url;
            }

            const slug = slugify(title, {lower: true, strict: true});
            const article = await Article.create({
                title: title.trim(),
                slug,
                content,
                image: imageUrl,
            });

            return res.json(article);
        } catch (e) {

            // шукаєм баг
            console.error("⚠️ ArticleController.create error:", e);
            if (e.name === 'SequelizeUniqueConstraintError') {
                return next(ApiError.badRequest('Стаття з таким заголовком уже існує'));
            }
            next(ApiError.internal(e.message));
        }
    }

    // [GET] /api/article
    async getAll(req, res, next) {
        try {
            let {page = 1, limit = 8} = req.query;
            page = parseInt(page);
            limit = parseInt(limit);
            const offset = (page - 1) * limit;

            const {rows, count} = await Article.findAndCountAll({
                limit,
                offset,
                order: [['createdAt', 'DESC']],
            });

            return res.json({rows, count});
        } catch (e) {
            next(ApiError.internal(e.message));
        }
    }

    // [GET] /api/article/:slug
    async getOne(req, res, next) {
        try {
            const { slug } = req.params;
            const article = await Article.findOne({where: {slug}});
            if (!article) {
                return next(ApiError.notFound('Article not found'));
            }
            return res.json(article);
        } catch (e) {
            next(ApiError.internal(e.message));
        }
    }

    // [PUT] /api/article/:id
    async update(req, res, next) {
        try {
            const {id} = req.params;
            const article = await Article.findByPk(id);
            if (!article) {
                return next(ApiError.notFound(`Article ${id} not found`));
            }

            const {title, content} = req.body;
            if (title) {
                article.title = title.trim();
                article.slug = slugify(article.title, {lower: true, strict: true});
            }
            if (content !== undefined) {
                article.content = content;
            }

            // optional image replace
            if (req.files?.image) {
                // delete old from Cloudinary
                if (article.image) {
                    const oldPublicId = extractPublicId(article.image);
                    if (oldPublicId) {
                        await cloudinary.uploader.destroy(oldPublicId);
                    }
                }
                const {image} = req.files;
                const result = await cloudinary.uploader.upload(image.tempFilePath, {
                    folder: 'articles',
                });
                article.image = result.secure_url;
            }

            await article.save();
            return res.json(article);
        } catch (e) {
            next(ApiError.internal(e.message));
        }
    }

    // [DELETE] /api/article/:id
    async delete(req, res, next) {
        try {
            const {id} = req.params;
            const article = await Article.findByPk(id);
            if (!article) {
                return next(ApiError.notFound(`Article ${id} not found`));
            }
            // remove image from Cloudinary
            if (article.image) {
                const publicId = extractPublicId(article.image);
                if (publicId) {
                    await cloudinary.uploader.destroy(publicId);
                }
            }
            await Article.destroy({where: {id}});
            return res.json({message: `Article ${id} deleted successfully`});
        } catch (e) {
            next(ApiError.internal(e.message));
        }
    }
}

module.exports = new ArticleController();