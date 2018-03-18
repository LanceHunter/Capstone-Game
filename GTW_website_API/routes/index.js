const router = require('koa-router')()

const config = require('../knexfile')['development'];
const knex = require('knex')(config);
const bcrypt = require('bcryptjs');
const passport = require('koa-passport');
const localStrategy = require('passport-local').Strategy;
const session = require('koa-session');
const bodyParser = require('koa-bodyparser');
const options = {};

//bcrypt function

function comparePass(userPassword, databasePassword) {
  return bcrypt.compareSync(userPassword, databasePassword);
}

//Passport Strategy
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  if (id) {
    return knex('users').where({
        id
      }).first()
      .then((user) => {
        done(null, user);
      })
      .catch((err) => {
        done(err, null);
      });
  }
});

passport.use(new localStrategy(options, (username, password, done) => {
  knex('users').where({
      username
    }).first()
    .then((user) => {
      if (!user) return done(null, false);
      if (!comparePass('password', user.hashed_password)) {
        return done(null, false);
      } else {
        return done(null, user);
      }
    })
    .catch((err) => {
      return done(err);
    });
}));


// auth routes

router.prefix('/api')

router.post('/login', async ctx => {
  return passport.authenticate('local', (err, user, info, status) => {
    if (user) {
      ctx.login(user);
      ctx.body = {
        status: "logged in foo"
      };
    } else {
      ctx.status = 400;
      ctx.body = {
        status: err,
        user,
        info,
        status
      };
    }
  })(ctx);
});

router.post('/register', async ctx => {
  const saltRounds = 10;
  try {

    const new_user = await knex('users')
      .insert({
        email: ctx.request.body.email,
        hashed_password: bcrypt.hashSync(ctx.request.body.password, saltRounds),
        profile_photo: ctx.request.body.profile_photo,
        full_name: ctx.request.body.full_name,
        username: ctx.request.body.username,
      })
      .returning('*');

    if (new_user.length) {
      ctx.status = 201;
      ctx.body = {
        status: 'success',
        data: ctx.request.body
      };
    } else {
      ctx.status = 400;
      ctx.body = {
        status: 'error',
        message: request.body || 'Something went wrong.'
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

router.post('/new_game', async ctx => {
  if (ctx.isAuthenticated()) {
  try {
    console.log(ctx.request.body);
    const new_game = await knex('games').insert(ctx.request.body).returning('*');
    console.log(new_game,"bjksfbjkb");
    if (new_game.length) {
      ctx.status = 201;
      ctx.body = {
        status: 'success',
        data: ctx.request.body
      };
    } else {
      ctx.status = 400;
      ctx.body = {
        status: 'error',
        message: ctx.request.body || 'Something went wrong.'
      };
    }
  } catch (err) {
    ctx.status = 400;
    ctx.body = {
      status: 'error',
      message: ctx.request.body || 'Sorry, an error has occurred.'
    };
  }} else {
    ctx.body = {
      success: false
    };
    ctx.throw(401);
  }
});

// router.post('/send_invite/:game_id/:user_id', async ctx => {
//   if (ctx.isAuthenticated()) {
//   try {
//     const invite = await knex('user_games')
//       .insert({
//         user_id: ctx.params.user_id,
//         game_id: ctx.params.game_id
//       })
//       .returning('*');
//
//     if (invite.length) {
//       ctx.status = 201;
//       ctx.body = {
//         status: 'success',
//         data: ctx.request.body
//       };
//     } else {
//       ctx.status = 400;
//       ctx.body = {
//         status: 'error',
//         message: ctx.request.body || 'Something went wrong.'
//       };
//     }
//   } catch (err) {
//     ctx.status = 400;
//     ctx.body = {
//       status: 'error',
//       message: ctx.request.body || 'Sorry, an error has occurred.'
//     };
//   }} else {
//     ctx.body = {
//       success: false
//     };
//     ctx.throw(401);
//   }
// });

router.post('/invite_response/:user_id/:game_id', async ctx => {
  if (ctx.isAuthenticated()) {
  try {
    const invite = await knex('user_games')
      .insert({
        user_id: ctx.params.user_id,
        game_id: ctx.params.game_id
      });
    const create_player = await knex('players').insert({
      user_id: ctx.params.user_id,
    }).returning('id');
    console.log(create_player);
    const player_games = await knex('games_players').insert({
      player_id: create_player[0],
      game_id: ctx.params.game_id
    })
    const invite_response = await knex('user_games').where('game_id', '=', ctx.params.game_id).andWhere('user_id', '=', ctx.params.user_id).update({
      response: ctx.request.body.response
    }).returning('*');
    if (invite_response.length) {
      console.log(invite_response);
      ctx.status = 201;
      ctx.body = {
        status: 'success',
        data: ctx.request.body
      };
    } else {
      ctx.status = 400;
      ctx.body = {
        status: 'error',
        message: ctx.request.body || 'Something went wrong.'
      };
    }
  } catch (err) {
    ctx.status = 400;
    ctx.body = {
      status: 'error',
      message: ctx.request.body || 'Sorry, an error has occurred.'
    };
  }} else {
    ctx.body = {
      success: false
    };
    ctx.throw(401);
  }
})

router.get('/end_game/:game_id', async ctx => {
if (ctx.isAuthenticated()) {
  try {
      const end_party = await knex('games').update({
        complete: true
      }).where('id', ctx.params.party_id);
      const get_players = await knex('games_players').select('player_id').where('game_id', '=', ctx.params.game_id).returning('player_id');
      //then iterate through get_players and match scores and player ids posting corresponding scores to the player tables.

      console.log(get_players[0].player_id);
      if (end_party) {
        ctx.status = 201;
        ctx.body = {
          status: 'success',
          data: ctx.request.body
        };
      } else {
        ctx.status = 400;
        ctx.body = {
          status: 'error',
          message: ctx.request.body || 'Something went wrong.'
        };
      }
  } catch (err) {
    ctx.status = 400;
    ctx.body = {
      status: 'error',
      message: err.message || 'Sorry, an error has occurred.'
    }
  }} else {
    ctx.body = {
      success: false
    };
    ctx.throw(401);
  }
});

module.exports = router
