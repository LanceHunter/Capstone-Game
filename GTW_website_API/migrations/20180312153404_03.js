
exports.up = function(knex, Promise) {
  return knex.schema.createTable('players', (table) => {
    table.increments();
    table.integer('user_id').unsigned();
    table.foreign('user_id').references('users.id').onDelete('cascade');
    table.integer('score');
    // table.integer('damage_dealt');
    // table.integer('units_destroyed');
    // table.integer('units_built');
    table.integer('damage_dealt_sub');
    table.integer('damage_dealt_bomber');
    table.integer('damage_dealt_icbm');
    table.integer('damage_taken_sub');
    table.integer('damage_taken_bomber');
    table.integer('damage_taken_icbm');
    table.integer('units_built_sub');
    table.integer('units_built_bomber');
    table.integer('units_built_icbm');
    table.integer('units_destroyed_sub');
    table.integer('units_destroyed_bomber');
    table.integer('units_destroyed_icbm');
    table.float('rnd_multiplier');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('players');
};
