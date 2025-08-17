const Router = require('express');
const router = new Router();
const auth = require('../middleware/authMiddleware');
const checkRole = require('../middleware/checkRoleMiddleware');
const reviewController = require('../controllers/reviewController');

// список відгуків
router.get('/:productId', reviewController.listByProduct);
// створити кореневий (оцінка або коментар) — будь-який авторизований
router.post('/', auth, reviewController.createRoot);
// відповісти — тільки адмiн
router.post('/:parentId/reply', checkRole('ADMIN'), reviewController.reply);
// видалити — тільки адмiн
router.delete('/:id', checkRole('ADMIN'), reviewController.remove);

module.exports = router;