exports.up = function (knex, Promise) {
    return knex.schema.createTableIfNotExists('test_types', table => {
        table
            .increments('id')
            .primary();
        table
            .string('name');
    })
};

exports.down = function (knex, Promise) {
    knex.schema.dropTableIfExists('test_types');
};
