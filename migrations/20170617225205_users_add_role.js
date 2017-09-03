exports.up = function(knex, Promise) {
    return knex.schema.alterTable('users', table => {
        table
            .integer('role')
            .unsigned()
            .defaultTo(1);
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.table('users', table => {
        table.dropColumn('role');
    });
};
