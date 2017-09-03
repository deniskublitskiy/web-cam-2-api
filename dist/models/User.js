'use strict';

var bcrypt = require('bcrypt');

module.exports = function (bookshelf) {
    var User = bookshelf.Model.extend({
        tableName: 'users',
        hidden: ['password'],
        hasTimestamps: true,
        contacts: function contacts() {
            return this.belongsToMany(User, 'users_connections', 'master_user_id', 'user_id');
        },
        chats: function chats() {
            return this.belongsToMany('Chat', 'chat_members', 'user_id', 'chat_id');
        },

        virtuals: {
            fullName: {
                get: function get() {
                    var firstName = this.get('firstName'),
                        lastName = this.get('lastName');

                    return firstName && lastName ? firstName + ' ' + lastName : '';
                },
                set: function set(value) {
                    value = value.split(' ');
                    if (value.length === 2) {
                        this.set('firstName', value[0]);
                        this.set('lastName', value[1]);
                    }
                }
            }
        },

        initialize: function initialize() {
            this.on('saving', this._beforeSaving, this);
        },
        _beforeSaving: function _beforeSaving() {
            var _this = this;

            if (this.hasChanged('password')) {
                return bcrypt.genSalt(10).then(function (salt) {
                    return bcrypt.hash(_this.get('password'), salt);
                }).then(function (hash) {
                    return _this.set('password', hash);
                });
            }
        },
        toJSON: function toJSON() {
            var attributes = bookshelf.Model.prototype.toJSON.call(this);
            if (attributes.avatar) {
                attributes.avatar = attributes.avatar.toString();
            }
            return attributes;
        }
    }, {
        login: function login(email, password) {
            return new this({
                email: email.toLowerCase().trim()
            }).fetch().then(function (user) {
                if (user) {
                    return bcrypt.compare(password, user.get('password')).then(function (isValid) {
                        return new Promise(function (resolve, reject) {
                            return isValid ? resolve(user) : reject({ status: 401, message: 'Invalid password.' });
                        });
                    });
                }
                return Promise.reject();
            });
        }
    });

    return bookshelf.model('User', User);
};
//# sourceMappingURL=User.js.map
