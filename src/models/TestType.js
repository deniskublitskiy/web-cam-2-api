const {TestType} = require('./');
module.exports = function (bookshelf) {
    class TestType extends bookshelf.Model {
        get tableName() {
            return 'test_types';
        }

        get hasTimestamps() {
            return true;
        }
    }

    return bookshelf.model('TestType', TestType)
};