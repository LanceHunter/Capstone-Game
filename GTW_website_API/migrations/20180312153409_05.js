
exports.up = function(knex, Promise) {
  return knex.schema.createTable('games_players', (table) => {
    table.integer('player_id').references('players.id').onDelete('cascade');
    table.integer('game_id').references('games.id').onDelete('cascade');
    table.boolean('response');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('games_players');
};
