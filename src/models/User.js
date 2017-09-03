const bcrypt = require('bcrypt');

module.exports = function (bookshelf) {
    let User = bookshelf.Model.extend(
        {
            tableName: 'users',
            hidden: ['password'],
            hasTimestamps: true,
            contacts() {
                return this.belongsToMany(User, 'users_connections', 'master_user_id', 'user_id');
            },
            chats() {
                return this.belongsToMany('Chat', 'chat_members', 'user_id', 'chat_id');
            },
            virtuals: {
                fullName: {
                    get() {
                        let firstName = this.get('firstName'),
                            lastName = this.get('lastName');

                        return firstName && lastName
                            ? `${firstName} ${lastName}`
                            : '';
                    },

                    set(value) {
                        value = value.split(' ');
                        if (value.length === 2) {
                            this.set('firstName', value[0]);
                            this.set('lastName', value[1]);
                        }
                    }
                }
            },

            initialize() {
                this.on('saving', this._beforeSaving, this);
            },

            _beforeSaving() {
                if (this.hasChanged('password')) {
                    return bcrypt.genSalt(10)
                        .then(salt =>
                            bcrypt.hash(this.get('password'), salt)
                        )
                        .then(hash =>
                            this.set('password', hash)
                        );
                }
            },

            toJSON() {
                let attributes = bookshelf.Model.prototype.toJSON.call(this);
                if (attributes.avatar) {
                    attributes.avatar = attributes.avatar.toString();
                }
                return attributes;
            }
        },
        {
            login(email, password) {
                return new this({
                    email: email.toLowerCase().trim()
                })
                    .fetch()
                    .then(user => {
                        if (user) {
                            return bcrypt.compare(password, user.get('password'))
                                .then(isValid => new Promise((resolve, reject) =>
                                    isValid
                                        ? resolve(user)
                                        : reject({status: 401, message: 'Invalid password.'})))
                        }
                        return Promise.reject()
                    })

            }
        }
    );

    return bookshelf.model('User', User);
};