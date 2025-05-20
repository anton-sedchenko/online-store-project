const Router = require('express');
const router = new Router();
const figureRouter = require('./figureRouter');
const typeRouter = require('./typeRouter');
const userRouter = require('./userRouter');

router.use('/user', userRouter);
router.use('/type', typeRouter);
router.use('/figure', figureRouter);

module.exports = router;
