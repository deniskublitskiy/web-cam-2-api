exports.up = function(knex, Promise) {
    return knex.schema.createTableIfNotExists('chat_members', table => {
        table.integer('chat_id')
            .unsigned()
            .references('chats.id');
        table.integer('user_id')
            .unsigned()
            .references('users.id');
        table.unique(['chat_id', 'user_id']);
        table.timestamps();
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists('chat_members');
};
