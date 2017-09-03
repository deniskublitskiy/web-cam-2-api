exports.up = function(knex, Promise) {
    return knex.schema.createTableIfNotExists('users_connections', table => {
        table.integer('master_user_id')
            .unsigned()
            .references('users.id');
        table.integer('user_id')
            .unsigned()
            .references('users.id');
        table
            .integer('connection_type_id')
            .unsigned()
            .defaultTo(1);
        table.unique(['master_user_id', 'user_id']);
        table.timestamps();
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists('users_connections');
};
