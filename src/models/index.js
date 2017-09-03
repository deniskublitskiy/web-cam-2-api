const knex = require('knex')(require('../../knexfile').development);
const bookshelf = require('bookshelf')(knex);

let save = bookshelf.Model.prototype.save;
bookshelf.Model.prototype.save = function (...args) {
    return save.apply(this, args).then(model => {
        let {id} = model;
        return model
            ? model.clear().set('id', id).refresh()
            : model
    });
};

bookshelf.plugin(['visibility', 'virtuals', 'bookshelf-camelcase', 'registry']);

const Message = require('./Message')(bookshelf);
const User = require('./User')(bookshelf);
const Chat = require('./Chat')(bookshelf);
const TestType = require('./TestType')(bookshelf);

const Users = bookshelf.Collection.extend({
    model: User
});

const Messages = bookshelf.Collection.extend({
    model: Messages
});

const Chats = bookshelf.Collection.extend({
    model: Chats
});

const TestTypes = bookshelf.Collection.extend({
    model: TestType
});

module.exports = {
    Message,
    Messages,
    User,
    Users,
    Chat,
    Chats,
    TestType,
    TestTypes
};