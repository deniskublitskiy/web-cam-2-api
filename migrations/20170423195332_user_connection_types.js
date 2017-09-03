exports.up = function (knex, Promise) {
    return knex.schema
        .createTableIfNotExists('user_connection_types', table => {
            table
                .increments('id')
                .primary();
            table
                .string('name');
        })
        .alterTable('users_connections', table => {
            table
                .integer('connection_type_id')
                .unsigned()
                .references('user_connection_types.id')
                .defaultTo(1)
                .alter();
        })
};

exports.down = function (knex, Promise) {
    knex.dropTableIfExists('user_connection_types');
};
