'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _require = require('./index'),
    User = _require.User;

module.exports = function (Bookshelf) {
    var Chat = function (_Bookshelf$Model) {
        _inherits(Chat, _Bookshelf$Model);

        function Chat() {
            _classCallCheck(this, Chat);

            return _possibleConstructorReturn(this, (Chat.__proto__ || Object.getPrototypeOf(Chat)).apply(this, arguments));
        }

        _createClass(Chat, [{
            key: 'members',
            value: function members() {
                return this.belongsToMany('User', 'chat_members', 'chat_id', 'user_id');
            }
        }, {
            key: 'messages',
            value: function messages() {
                return this.hasMany('Message', 'chat_id', 'id');
            }
        }, {
            key: 'tableName',
            get: function get() {
                return 'chats';
            }
        }, {
            key: 'hasTimestamps',
            get: function get() {
                return true;
            }
        }]);

        return Chat;
    }(Bookshelf.Model);

    return Bookshelf.model('Chat', Chat);
};
//# sourceMappingURL=Chat.js.map
