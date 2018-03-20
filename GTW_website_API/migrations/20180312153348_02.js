
exports.up = function(knex, Promise) {
  return knex.schema.createTable('games', (table) => {
    table.increments();
    table.string('party_name').notNullable();
    table.integer('player_count');
    table.integer('winner_id')
    table.boolean('complete');
    table.string('outcome')
  });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('games');
};
