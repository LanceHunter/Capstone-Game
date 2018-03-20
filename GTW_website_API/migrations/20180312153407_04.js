
exports.up = function(knex, Promise) {
  return knex.schema.createTable('user_games', (table) => {
    table.integer('user_id').references('users.id').onDelete('cascade');
    table.integer('game_id').references('games.id').onDelete('cascade');
    table.boolean('response');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('user_games');
};
