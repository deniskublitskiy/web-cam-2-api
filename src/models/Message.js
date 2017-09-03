module.exports = function (Bookshelf) {
    class Message extends Bookshelf.Model {
        get tableName() {
            return 'messages'
        }

        get hasTimestamps() {
            return true;
        }

        author() {
            return this.belongsTo('User', 'author_id', 'id');
        }
    }

    return Bookshelf.model('Message', Message);
};