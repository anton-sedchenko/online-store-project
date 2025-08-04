const Router = require('express');
const router = new Router();
const articleController = require('../controllers/articleController');
const authMiddleware = require('../middleware/authMiddleware');
const checkRole = require('../middleware/checkRoleMiddleware');
const fileUpload = require('express-fileupload');

router.post(
    '/',

    // шукаєм баг
    (req, res, next) => { console.log('🔥 /api/article POST: увійшли у перше middleware'); next() },
    authMiddleware, checkRole('ADMIN'),

    // шукаєм баг
    (req, res, next) => { console.log('🔑 пройшли auth+role'); next() },

    // шукаєм баг
    (req, res, next) => { console.log('📦 після fileUpload, перед controller'); next() },
    articleController.create
);
router.get('/', articleController.getAll);
router.get('/:slug', articleController.getOne);
router.put(
    '/:id',
    // шукаєм баг
    (req, res, next) => {
        console.log('🔥 [PUT /api/article/:id] запит на редагування:', req.params.id);
        next();
    },
    authMiddleware,
    checkRole('ADMIN'),
    fileUpload({useTempFiles: true, tempFileDir: '/tmp'}),

    // шукаєм баг
    (req, res, next) => {
        console.log('📦 [PUT] після fileUpload, body =', req.body);
        console.log('📦 [PUT] після fileUpload, files =', req.files);
        next();
    },
    articleController.update
);
router.delete(
    '/:id',
    authMiddleware, checkRole('ADMIN'),
    articleController.delete
);

module.exports = router;