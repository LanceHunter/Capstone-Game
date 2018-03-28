
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', (table) => {
    table.increments();
    table.string('username').unique().notNullable();
    table.specificType('hashed_password', 'char(60)').notNullable();
    table.integer('wins');
    table.integer('losses');
    table.float('average_score');
    table.integer('high_score');
    table.timestamps(true, true);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users');
};
