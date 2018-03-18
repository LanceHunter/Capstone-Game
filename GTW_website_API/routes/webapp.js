const router = require('koa-router')();
const send = require('koa-send');
const fs = require('fs');
const webappDir = '../webapp/dist';

router.get('/bar', function (ctx, next) {
  ctx.body = 'this is a bar response'
})

router.get('/static/(.*)', async ctx => {
  console.log('test');
})

router.get('/', async ctx => {
  ctx.type = 'html';
  ctx.body = fs.createReadStream('../webapp/dist/index.html');
})

// router.get('/static/(.*)', ctx => serve(dirname + ctx.request.path))
// router.get('/static/(.*)', async ctx => {
//   // console.log('test');
//   // console.log(ctx.request.path);
//   // ctx.body = 'test'
//   console.log('getting:', dirname + ctx.request.path);
//   serve(dirname + ctx.request.path);
// })

module.exports = router
