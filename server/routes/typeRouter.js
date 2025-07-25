const Router = require('express');
const router = new Router();
const typeController = require('../controllers/typeController');
const checkRole = require('../middleware/checkRoleMiddleware');
const authMiddleware = require('../middleware/authMiddleware');
const fileUpload = require('express-fileupload');

router.post('/', checkRole('ADMIN'), typeController.create);
router.get('/', typeController.getAll);
router.get('/:id', typeController.getOne);  // для однієї категорії
router.put(
    '/:id',
    authMiddleware, checkRole('ADMIN'),
    typeController.update
);
router.put('/:id/image',
    authMiddleware, checkRole('ADMIN'),
    fileUpload({useTempFiles:true, tempFileDir:'/tmp'}),
    typeController.updateImage
);
router.delete(
    '/:id',
    authMiddleware,
    checkRole('ADMIN'),
    typeController.delete
);

module.exports = router;
