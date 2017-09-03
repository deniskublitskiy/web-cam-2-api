exports.up = function(knex, Promise) {
    return knex.schema.alterTable('chats', table => {
        table
            .integer('created_by_id')
            .unsigned()
            .references('users.id')
    })
};

exports.down = function(knex, Promise) {
  
};
