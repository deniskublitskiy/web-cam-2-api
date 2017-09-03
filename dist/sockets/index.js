'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

exports.default = function (io) {
    var _this = this;

    io.on('connection', function () {
        var _ref = _asyncToGenerator(_regenerator2.default.mark(function _callee(socket) {
            var params, options, user;
            return _regenerator2.default.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            console.log('Connected');
                            socket.on('disconnect', function () {
                                return console.log('Disconnected');
                            });

                            params = {
                                id: socket.handshake.query.userId
                            };
                            options = {
                                withRelated: ['chats'],
                                require: true
                            };
                            _context.prev = 4;
                            _context.next = 7;
                            return User.forge(params).fetch(options);

                        case 7:
                            user = _context.sent;

                            user.related('chats').forEach(function (chat) {
                                return socket.join('chat-room-' + chat.get('id'));
                            });
                            _context.next = 14;
                            break;

                        case 11:
                            _context.prev = 11;
                            _context.t0 = _context['catch'](4);

                            console.log(_context.t0);

                        case 14:

                            socket.on('start_calling', function (chatId) {
                                socket.to('chat-room-' + chatId).emit('start_calling', chatId);
                            });

                        case 15:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, _this, [[4, 11]]);
        }));

        return function (_x) {
            return _ref.apply(this, arguments);
        };
    }());
};

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var _require = require('../models/index'),
    User = _require.User;
//# sourceMappingURL=index.js.map
