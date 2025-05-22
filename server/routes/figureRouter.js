const Router = require('express');
const router = new Router();
const figureController = require('../controllers/figureController');

router.post('/', figureController.create);
router.get('/', figureController.getAll);
router.get('/:id', figureController.getOne);

module.exports = router;
