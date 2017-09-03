exports.up = function (knex, Promise) {
    return Promise.all([
        knex.schema.createTableIfNotExists('chats', table => {
            table.increments('id').primary();
            table.string('name').notNullable();
            table.string('description');
            table.timestamps();
        })
    ])
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTableIfExists('chats');
};
