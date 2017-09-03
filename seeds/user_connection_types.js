exports.seed = async function (knex, Promise) {
    await knex('users_connections').del();
    await knex('user_connection_types').del();
    await knex('user_connection_types').insert([
        {id: 1, name: 'Request'}
    ]);
};