exports.up = function (knex, Promise) {
    return knex.schema.raw('ALTER TABLE messages MODIFY COLUMN text TEXT');
};

exports.down = function (knex, Promise) {

};
