const router = require('koa-router')();
const send = require('koa-send');
const boardDir = '/public';

router.get('/board/(.*)', async (ctx) => {
  await send(ctx, boardDir + ctx.request.path);
});

module.exports = router;
