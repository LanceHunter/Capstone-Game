require('dotenv').config();
const Koa = require('koa');
const app = new Koa();
const views = require('koa-views');
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser');
const logger = require('koa-logger');
const config = require('./knexfile')['development'];
const knex = require('knex')(config);
const bcrypt = require('bcryptjs');
const passport = require('koa-passport');
const localStrategy = require('passport-local').Strategy;
const session = require('koa-session');

const index = require('./routes/index');
const stats = require('./routes/stats');
const webapp = require('./routes/webapp');
const board = require('./routes/board');
const preGame = require('./routes/preGame.js');
const peaceTime = require('./routes/peaceTime.js');
const war = require('./routes/war.js');

// error handler
onerror(app);

// middlewares
app.use(bodyparser({
    enableTypes:['json', 'form', 'text']
  }));
app.use(json());
app.use(logger());
app.use(require('koa-static')(__dirname + '/public'));
app.use(views(__dirname + '/views', {
  extension: 'pug'
}));

//Added middlewares

app.use(passport.initialize());
app.use(passport.session());
app.use(session(app));
app.keys = ['super-secret-key'];

// logger
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

// routes
app.use(index.routes()).use(index.allowedMethods());
app.use(stats.routes()).use(stats.allowedMethods());
app.use(preGame.routes()).use(preGame.allowedMethods());
app.use(peaceTime.routes()).use(peaceTime.allowedMethods());
app.use(peaceTime.routes()).use(peaceTime.allowedMethods());
app.use(board.routes()).use(board.allowedMethods());
app.use(webapp.routes()).use(webapp.allowedMethods());

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx);
});

module.exports = app;
