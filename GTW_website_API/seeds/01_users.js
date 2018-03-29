const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);

exports.seed = function(knex, Promise) {
  let users = [
    {
      username: 'test0',
      hashed_password: bcrypt.hashSync('password', salt),
      wins: 10,
      losses: 70,
      average_score: 1000,
      high_score: 2000,
    },
  ]

  // insert users into users table
  return knex('users').insert(users);
};
