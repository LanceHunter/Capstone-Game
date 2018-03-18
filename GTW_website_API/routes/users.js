const router = require('koa-router')()
const fs = require('fs');

router.prefix('/users')

// router.get('/logout', async (ctx) => {
//   if (ctx.isAuthenticated()) {
//     ctx.logout();
//     ctx.body = {
//       status: 'I Logged out fool'
//     };
//   } else {
//     ctx.body = {
//       success: false
//     };
//     ctx.throw(401);
//   }
// });

router.get('/bar', function (ctx, next) {
  ctx.body = 'this is a users/bar response'
})

router.get('/test', async ctx => {
  ctx.type = 'html';
  ctx.body = fs.createReadStream('../webapp/dist/index.html');
})

module.exports = router
