const Router = require('express');
const router = new Router();
const productController = require('../controllers/productController');
const checkRole = require("../middleware/checkRoleMiddleware");
const authMiddleware = require('../middleware/authMiddleware');

router.get('/slug/:slug', productController.getBySlug);
router.post('/', checkRole('ADMIN'), productController.create);
router.get('/', productController.getAll);
router.get('/:id', productController.getOne);
router.put(
    '/:id',
    authMiddleware,
    checkRole('ADMIN'),
    productController.update
);
router.delete(
    '/:id',
    authMiddleware,
    checkRole('ADMIN'),
    productController.deleteProduct
);

module.exports = router;
