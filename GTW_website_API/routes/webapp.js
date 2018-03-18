const router = require('koa-router')();
const send = require('koa-send');
const fs = require('fs');
const webappDir = './webapp';

// send any static files requested
router.get('/static/(.*)', async (ctx) => {
  await send(ctx, webappDir + ctx.request.path);
})

// render the vue app for any other routes
router.get('/(.*)', async ctx => {
  await send(ctx, webappDir + '/index.html')
})

module.exports = router
