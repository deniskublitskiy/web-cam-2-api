const { User } = require('./index');

module.exports = function (Bookshelf) {
    class Chat extends Bookshelf.Model {
        get tableName() {
            return 'chats';
        }

        get hasTimestamps() {
            return true;
        }

        members() {
            return this.belongsToMany('User', 'chat_members', 'chat_id', 'user_id');
        }

        messages() {
            return this.hasMany('Message', 'chat_id', 'id');
        }
    }

    return Bookshelf.model('Chat', Chat);
};