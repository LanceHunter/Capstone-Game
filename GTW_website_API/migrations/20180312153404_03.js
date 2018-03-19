
exports.up = function(knex, Promise) {
  return knex.schema.createTable('players', (table) => {
    table.increments();
    table.integer('user_id').unsigned();
    table.foreign('user_id').references('users.id').onDelete('cascade');
    table.integer('game_id').unsigned();
    table.foreign('game_id').references('games.id').onDelete('cascade');
    table.boolean('won');
    table.integer('hp');
    table.integer('score');
    table.integer('shots');
    table.float('rnd_multiplier');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('players');
};
