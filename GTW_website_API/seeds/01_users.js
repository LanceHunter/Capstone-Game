const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);

exports.seed = function(knex, Promise) {
  let users = [
    {
      email: 'test0@test.com',
      username: 'test0',
      hashed_password: bcrypt.hashSync('password', salt),
    },
    {
      email: 'test1@test.com',
      username: 'test1',
      hashed_password: bcrypt.hashSync('password', salt),
    },
  ]

  // insert users into users table
  return knex('users').insert(users);
};
