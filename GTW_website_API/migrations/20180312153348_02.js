
exports.up = function(knex, Promise) {
  return knex.schema.createTable('games', (table) => {
    table.increments();
    table.string('outcome').notNullable();
    table.timestamps(true, true);
  });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('games');
};
