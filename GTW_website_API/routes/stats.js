const router = require('koa-router')()
const config = require('../knexfile')['production'];
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

  try {
    const leaders = await knex('users')
    .where('wins', '>', 0).orWhere('losses', '>', 0)
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

    if (leaders.length) {
      ctx.body = {
        status: 'success',
        leaders,
      }
    } else {
      ctx.status = 400;
      ctx.body = {
        status: 'error',
        message: err.message || 'No results found.'
      };
    }
  } catch (err) {
    ctx.status = 400;
    ctx.body = {
      status: 'error',
      message: err.message || 'Sorry, an error has occurred.'
    };
  }

});

router.get('/(.*)', async ctx => {
  const username = ctx.request.path.split('/').pop();

  try {
    const stats = await knex('users')
    .where('username', username)
    .join('players', 'users.id', '=', 'players.user_id')
    .join('games', 'players.game_id', '=', 'games.id')
    .select(
      'won',
      'outcome',
      'players.created_at',
      'score',
      'hit_points',
      'shots',
      'rnd_multiplier',
      knex.raw('(shots * rnd_multiplier) AS damage_caused'),
      // knex.raw('players.created_at AS end_time'),
    )

    if (stats.length) {
      ctx.body = {
        status: 'success',
        stats,
      }
    } else {
      ctx.status = 400;
      ctx.body = {
        status: 'error',
        message: err.message || 'No results found.'
      };
    }
  } catch (err) {
    ctx.status = 400;
    ctx.body = {
      status: 'error',
      message: err.message || 'Sorry, an error has occurred.'
    };
  }
});

module.exports = router
