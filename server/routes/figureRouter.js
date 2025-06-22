const Router = require('express');
const router = new Router();
const figureController = require('../controllers/figureController');
const checkRole = require("../middleware/checkRoleMiddleware");
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', checkRole('ADMIN'), figureController.create);
router.get('/', figureController.getAll);
router.get('/:id', figureController.getOne);
router.put(
    '/:id',
    authMiddleware,
    checkRole('ADMIN'),
    figureController.update
);
router.delete(
    '/:id',
    authMiddleware,
    checkRole('ADMIN'),
    figureController.deleteFigure
);

module.exports = router;
