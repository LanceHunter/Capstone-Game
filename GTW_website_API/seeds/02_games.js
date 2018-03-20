exports.seed = function(knex, Promise) {
  let games = [
    {
      outcome: 'war',
    },
    {
      outcome: 'war',
    },
    {
      outcome: 'peace',
    },
    {
      outcome: 'overwhelming',
    },
    {
      outcome: 'war',
    },
    {
      outcome: 'peace',
    },
    {
      outcome: 'war',
    },
    {
      outcome: 'war',
    },
    {
      outcome: 'war',
    },
    {
      outcome: 'war',
    },
  ]

  // insert users into users table
  return knex('games').insert(games);
};
