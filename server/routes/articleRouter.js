const Router = require('express');
const router = new Router();
const articleController = require('../controllers/articleController');
const authMiddleware = require('../middleware/authMiddleware');
const checkRole = require('../middleware/checkRoleMiddleware');
const fileUpload = require('express-fileupload');

router.post(
    '/',
    authMiddleware, checkRole('ADMIN'),
    fileUpload({ useTempFiles: true, tempFileDir: '/tmp' }),
    articleController.create
);
router.get('/', articleController.getAll);
router.get('/:slug', articleController.getOne);
router.put(
    '/:id',
    authMiddleware, checkRole('ADMIN'),
    fileUpload({ useTempFiles: true, tempFileDir: '/tmp' }),
    articleController.update
);
router.delete(
    '/:id',
    authMiddleware, checkRole('ADMIN'),
    articleController.delete
);

module.exports = router;