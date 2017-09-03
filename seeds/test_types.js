exports.seed = async function (knex, Promise) {
    await knex('test_types').del();
    await knex('test_types').insert([
        {id: 1, name: 'Single'},
        {id: 2, name: 'Multiple'},
        {id: 3, name: 'Yes/No'},
        {id: 4, name: 'Ordering'},
        {id: 5, name: 'Conformity'},
    ]);
};
