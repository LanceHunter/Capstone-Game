
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('players').del()
    .then(function() {
      return knex('games').del();
    })
    .then(function() {
      return knex('users').del();
    })
};
