const Router = require('express');
const router = new Router();
const productController = require('../controllers/productController');
const checkRole = require("../middleware/checkRoleMiddleware");
const authMiddleware = require('../middleware/authMiddleware');

router.get('/slug/:slug', productController.getBySlug);
router.post('/',
    authMiddleware,
    checkRole('ADMIN'),
    productController.create
);
router.get('/', productController.getAll);
router.get('/:id', productController.getOne);
router.put(
    '/:id',
    authMiddleware,
    checkRole('ADMIN'),
    productController.update
);
router.post('/images',
    authMiddleware,
    checkRole('ADMIN'),
    productController.addImages
);
router.delete(
    '/:id',
    authMiddleware,
    checkRole('ADMIN'),
    productController.deleteProduct
);
router.delete(
    '/image/:id',
    authMiddleware,
    checkRole('ADMIN'),
    productController.deleteImage
);

module.exports = router;
