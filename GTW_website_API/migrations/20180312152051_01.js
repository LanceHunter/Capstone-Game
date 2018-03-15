
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', (table) => {
    table.increments();
    table.string('email').unique().notNullable();
    table.string('username').unique().notNullable();
    table.specificType('hashed_password', 'char(60)').notNullable();
    table.timestamps(true, true);
    table.string('full_name');
    table.string('profile_photo');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users');
};
