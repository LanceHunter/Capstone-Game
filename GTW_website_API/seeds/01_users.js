const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);

exports.seed = function(knex, Promise) {
  let users = [
    {
      username: 'test0',
      hashed_password: bcrypt.hashSync('password', salt),
    },
    {
      username: 'test1',
      hashed_password: bcrypt.hashSync('password', salt),
    },
  ]

  // insert users into users table
  return knex('users').insert(users);
};
