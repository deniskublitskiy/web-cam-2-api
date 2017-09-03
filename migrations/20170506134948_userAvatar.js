exports.up = function(knex, Promise) {
    return knex.schema.alterTable('users', table => {
        table.specificType('avatar', 'mediumblob');
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.table('users', table => {
        table.dropColumn('avatar');
    });
};
