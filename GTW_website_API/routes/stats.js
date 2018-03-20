const router = require('koa-router')()
const config = require('../knexfile')['development'];
const knex = require('knex')(config);
const session = require('koa-session');
const bodyParser = require('koa-bodyparser');

// stats routes

router.prefix('/api/stats')

router.get('/leaders(.*)', async ctx => {
  let order;
  switch (ctx.request.query.order) {
    case 'wins':
      order = 'wins';
      break;
    case 'percentage':
      order = 'win_percentage';
      break;
    case 'average':
      order = 'average_score';
      break;
    case 'high':
      order = 'high_score';
      break;
  }

  const leaders = await knex('users')
  .select(
    'username',
    'wins',
    'losses',
    'average_score',
    'high_score',
    knex.raw('(100.0 * wins / (wins + losses)) AS win_percentage'),
  )
  .orderBy(order, 'desc')
  .limit(100)

  ctx.body = {
    leaders,
  }
});

module.exports = router
