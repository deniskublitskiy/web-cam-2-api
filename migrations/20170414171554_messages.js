exports.up = function (knex, Promise) {
    return Promise.all([
        knex.schema.createTableIfNotExists('messages', table => {
            table
                .increments('id')
                .primary();
            table
                .integer('chat_id')
                .unsigned()
                .notNullable()
                .index()
                .references('id')
                .inTable('chats');
            table
                .integer('author_id')
                .unsigned()
                .notNullable()
                .references('id')
                .inTable('users');

            table.string('text');
            table.timestamps();
        })
    ])
};

exports.down = function (knex, Promise) {
    return Promise.all([
        knex.schema.dropTableIfExists('messages')
    ])
};
