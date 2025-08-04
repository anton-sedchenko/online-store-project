const Router = require('express');
const router = new Router();
const articleController = require('../controllers/articleController');
const authMiddleware = require('../middleware/authMiddleware');
const checkRole = require('../middleware/checkRoleMiddleware');

router.post(
    '/',
    authMiddleware, checkRole('ADMIN'),
    articleController.create
);
router.get('/', articleController.getAll);
router.get('/:slug', articleController.getOne);
router.put(
    '/:id',
    authMiddleware,
    checkRole('ADMIN'),
    articleController.update
);
router.delete(
    '/:id',
    authMiddleware, checkRole('ADMIN'),
    articleController.delete
);

module.exports = router;