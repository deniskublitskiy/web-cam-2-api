const faker = require('faker');

exports.seed = function (knex, Promise) {
    let user, users = [];
    for (let i = 0; i < 1000; i++) {
        user = {
            first_name: faker.name.firstName(),
            last_name: faker.name.lastName(),
            email: faker.internet.email(),
            //avatar: faker.image.avatar()
        };
        users.push(user);
    }

    return knex('users').insert(users);
};
