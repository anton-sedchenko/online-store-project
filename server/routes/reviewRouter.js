const Router = require('express');
const router = new Router();
const auth = require('../middleware/authMiddleware');
const checkRole = require('../middleware/checkRoleMiddleware');
const reviewController = require('../controllers/reviewController');

router.get('/:productId', reviewController.listByProduct); // публічний список
router.post('/', auth, reviewController.createRoot); // створити відгук/оцінку
router.post('/:parentId/reply', auth, reviewController.reply); // відповісти у гілці
router.delete('/:id', auth, checkRole('ADMIN'), reviewController.remove); // видалити (адмін)

module.exports = router;