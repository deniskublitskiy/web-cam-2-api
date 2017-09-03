'use strict';

var knex = require('knex')(require('../../knexfile').development);
var bookshelf = require('bookshelf')(knex);

var save = bookshelf.Model.prototype.save;
bookshelf.Model.prototype.save = function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
    }

    return save.apply(this, args).then(function (model) {
        var id = model.id;

        return model ? model.clear().set('id', id).refresh() : model;
    });
};

bookshelf.plugin(['visibility', 'virtuals', 'bookshelf-camelcase', 'registry']);

var Message = require('./Message')(bookshelf);
var User = require('./User')(bookshelf);
var Chat = require('./Chat')(bookshelf);
var TestType = require('./TestType')(bookshelf);

var Users = bookshelf.Collection.extend({
    model: User
});

var Messages = bookshelf.Collection.extend({
    model: Messages
});

var Chats = bookshelf.Collection.extend({
    model: Chats
});

var TestTypes = bookshelf.Collection.extend({
    model: TestType
});

module.exports = {
    Message: Message,
    Messages: Messages,
    User: User,
    Users: Users,
    Chat: Chat,
    Chats: Chats,
    TestType: TestType,
    TestTypes: TestTypes
};
//# sourceMappingURL=index.js.map
