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
      // created_at: '2001-03-21T14:34:55.247Z',
    },
    {
      username: 'test1',
      hashed_password: bcrypt.hashSync('password', salt),
      wins: 20,
      losses: 60,
      average_score: 2000,
      high_score: 3000,
      // created_at: '2015-07-20T14:34:55.247Z',
    },
    {
      username: 'test2',
      hashed_password: bcrypt.hashSync('password', salt),
      wins: 30,
      losses: 50,
      average_score: 3000,
      high_score: 4000,
      // created_at: '2003-06-01T14:34:55.247Z',
    },
    {
      username: 'test3',
      hashed_password: bcrypt.hashSync('password', salt),
      wins: 40,
      losses: 40,
      average_score: 4000,
      high_score: 5000,
      // created_at: '2010-11-25T14:34:55.247Z',
    },
    {
      username: 'test4',
      hashed_password: bcrypt.hashSync('password', salt),
      wins: 50,
      losses: 30,
      average_score: 5000,
      high_score: 6000,
      // created_at: '2016-05-14T14:34:55.247Z',
    },
    {
      username: 'test5',
      hashed_password: bcrypt.hashSync('password', salt),
      wins: 60,
      losses: 20,
      average_score: 6000,
      high_score: 7000,
      // created_at: '2007-01-19T14:34:55.247Z',
    },
    {
      username: 'test6',
      hashed_password: bcrypt.hashSync('password', salt),
      wins: 70,
      losses: 15,
      average_score: 7000,
      high_score: 7500,
      // created_at: '2017-02-28T14:34:55.247Z',
    },
    {
      username: 'test7',
      hashed_password: bcrypt.hashSync('password', salt),
      wins: 80,
      losses: 10,
      average_score: 75000,
      high_score: 8000,
      // created_at: '2010-06-13T14:34:55.247Z',
    },
    {
      username: 'test8',
      hashed_password: bcrypt.hashSync('password', salt),
      wins: 85,
      losses: 10,
      average_score: 8000,
      high_score: 9000,
      // created_at: '2018-02-21T14:34:55.247Z',
    },
    {
      username: 'test9',
      hashed_password: bcrypt.hashSync('password', salt),
      wins: 90,
      losses: 5,
      average_score: 9000,
      high_score: 9500,
      // created_at: '2018-03-21T14:34:55.247Z',
    },
  ]

  // insert users into users table
  return knex('users').insert(users);
};
