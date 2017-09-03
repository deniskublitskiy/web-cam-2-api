'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = function (io, transporter) {
    var _this = this;

    router.get('/', function () {
        var _ref = _asyncToGenerator(_regenerator2.default.mark(function _callee(req, res, next) {
            var chats;
            return _regenerator2.default.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.prev = 0;
                            _context.next = 3;
                            return new Chats().fetch();

                        case 3:
                            chats = _context.sent;

                            res.status(200).json(chats.toJSON());
                            _context.next = 10;
                            break;

                        case 7:
                            _context.prev = 7;
                            _context.t0 = _context['catch'](0);

                            next(_context.t0);

                        case 10:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, _this, [[0, 7]]);
        }));

        return function (_x, _x2, _x3) {
            return _ref.apply(this, arguments);
        };
    }());

    router.get('/:id', function () {
        var _ref2 = _asyncToGenerator(_regenerator2.default.mark(function _callee2(req, res, next) {
            var chat;
            return _regenerator2.default.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            _context2.prev = 0;
                            _context2.next = 3;
                            return new Chat({
                                id: req.params.id
                            }).fetch({
                                withRelated: ['members', 'messages'],
                                require: true
                            });

                        case 3:
                            chat = _context2.sent;


                            res.status(200).json(chat);
                            _context2.next = 10;
                            break;

                        case 7:
                            _context2.prev = 7;
                            _context2.t0 = _context2['catch'](0);

                            next(_context2.t0);

                        case 10:
                        case 'end':
                            return _context2.stop();
                    }
                }
            }, _callee2, _this, [[0, 7]]);
        }));

        return function (_x4, _x5, _x6) {
            return _ref2.apply(this, arguments);
        };
    }());

    router.post('/', function () {
        var _ref3 = _asyncToGenerator(_regenerator2.default.mark(function _callee3(req, res, next) {
            var chat;
            return _regenerator2.default.wrap(function _callee3$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                            _context3.prev = 0;
                            _context3.next = 3;
                            return new Chat(req.body).save();

                        case 3:
                            chat = _context3.sent;

                            res.status(201).json(chat);
                            _context3.next = 10;
                            break;

                        case 7:
                            _context3.prev = 7;
                            _context3.t0 = _context3['catch'](0);

                            next(_context3.t0);

                        case 10:
                        case 'end':
                            return _context3.stop();
                    }
                }
            }, _callee3, _this, [[0, 7]]);
        }));

        return function (_x7, _x8, _x9) {
            return _ref3.apply(this, arguments);
        };
    }());

    router.post('/:id/members', function () {
        var _ref4 = _asyncToGenerator(_regenerator2.default.mark(function _callee4(req, res, next) {
            var members, id, chat, memberSockets;
            return _regenerator2.default.wrap(function _callee4$(_context4) {
                while (1) {
                    switch (_context4.prev = _context4.next) {
                        case 0:
                            members = req.body.members;
                            id = req.params.id;

                            if (!(!members || !members.length)) {
                                _context4.next = 4;
                                break;
                            }

                            return _context4.abrupt('return', next({ status: 400, message: 'Member id must be specified in body' }));

                        case 4:
                            _context4.prev = 4;
                            _context4.next = 7;
                            return new Chat({ id: id }).fetch({ withRelated: ['members'] });

                        case 7:
                            chat = _context4.sent;

                            chat.members().attach(members);

                            memberSockets = members.map(function (id) {
                                return findSocketByUserId(id);
                            });


                            memberSockets.forEach(function (socket) {
                                if (parseInt(socket.handshake.query.userId) !== chat.get('createdById')) {
                                    io.to(socket.id).emit('chat_invite', chat);
                                }
                                socket.join('chat-room-' + chat.get('id'));
                            });

                            res.status(201).send();
                            _context4.next = 17;
                            break;

                        case 14:
                            _context4.prev = 14;
                            _context4.t0 = _context4['catch'](4);

                            next(_context4.t0);

                        case 17:
                        case 'end':
                            return _context4.stop();
                    }
                }
            }, _callee4, _this, [[4, 14]]);
        }));

        return function (_x10, _x11, _x12) {
            return _ref4.apply(this, arguments);
        };
    }());

    router.delete('/:id', function () {
        var _ref5 = _asyncToGenerator(_regenerator2.default.mark(function _callee5(req, res, next) {
            var chat;
            return _regenerator2.default.wrap(function _callee5$(_context5) {
                while (1) {
                    switch (_context5.prev = _context5.next) {
                        case 0:
                            _context5.prev = 0;
                            _context5.next = 3;
                            return new Chat({
                                id: req.params.id
                            }).fetch();

                        case 3:
                            chat = _context5.sent;

                            chat.destroy();
                            res.status(204).send();
                            _context5.next = 11;
                            break;

                        case 8:
                            _context5.prev = 8;
                            _context5.t0 = _context5['catch'](0);

                            next(_context5.t0);

                        case 11:
                        case 'end':
                            return _context5.stop();
                    }
                }
            }, _callee5, _this, [[0, 8]]);
        }));

        return function (_x13, _x14, _x15) {
            return _ref5.apply(this, arguments);
        };
    }());

    router.post('/:id/messages', function () {
        var _ref6 = _asyncToGenerator(_regenerator2.default.mark(function _callee6(req, res, next) {
            var chatId, params, message, socket;
            return _regenerator2.default.wrap(function _callee6$(_context6) {
                while (1) {
                    switch (_context6.prev = _context6.next) {
                        case 0:
                            chatId = req.params.id;
                            params = _extends({
                                chatId: chatId
                            }, req.body);
                            _context6.next = 4;
                            return (0, _delayPromise2.default)(1000);

                        case 4:
                            _context6.prev = 4;
                            _context6.next = 7;
                            return new _index.Message(params).save();

                        case 7:
                            message = _context6.sent;
                            socket = findSocketByUserId(req.body.authorId);

                            socket && socket.to('chat-room-' + chatId).emit('chat_message', message);
                            res.status(201).json(message);
                            _context6.next = 16;
                            break;

                        case 13:
                            _context6.prev = 13;
                            _context6.t0 = _context6['catch'](4);

                            next(_context6.t0);

                        case 16:
                        case 'end':
                            return _context6.stop();
                    }
                }
            }, _callee6, _this, [[4, 13]]);
        }));

        return function (_x16, _x17, _x18) {
            return _ref6.apply(this, arguments);
        };
    }());

    function findSocketByUserId(userId) {
        var connected = io.sockets.connected;
        var socketId = Object.keys(connected).find(function (key) {
            return connected[key].handshake.query.userId == userId;
        });

        return connected[socketId];
    }

    /**
     * TODO: Refactor!!! Optimize!!!
     */
    router.post('/import/xlsx', function () {
        var _ref7 = _asyncToGenerator(_regenerator2.default.mark(function _callee9(req, res) {
            var obj, options, groups, me;
            return _regenerator2.default.wrap(function _callee9$(_context9) {
                while (1) {
                    switch (_context9.prev = _context9.next) {
                        case 0:
                            obj = _xlsx2.default.read(req.body.file, {
                                type: 'base64'
                            });
                            options = {
                                header: 1,
                                raw: true
                            };
                            groups = obj.SheetNames.reduce(function (result, name) {
                                return result.set(name, _xlsx2.default.utils.sheet_to_json(obj.Sheets[name], options));
                            }, new Map());
                            _context9.next = 5;
                            return _index.User.forge({ id: req.body.userId }).fetch();

                        case 5:
                            me = _context9.sent;

                            groups.forEach(function () {
                                var _ref8 = _asyncToGenerator(_regenerator2.default.mark(function _callee8(group, key) {
                                    var members, chat, memberSockets;
                                    return _regenerator2.default.wrap(function _callee8$(_context8) {
                                        while (1) {
                                            switch (_context8.prev = _context8.next) {
                                                case 0:
                                                    members = [];
                                                    _context8.next = 3;
                                                    return Promise.all(group.map(function () {
                                                        var _ref9 = _asyncToGenerator(_regenerator2.default.mark(function _callee7(member) {
                                                            var fullName, user, password, mailOptions;
                                                            return _regenerator2.default.wrap(function _callee7$(_context7) {
                                                                while (1) {
                                                                    switch (_context7.prev = _context7.next) {
                                                                        case 0:
                                                                            if (!(member.length > 0)) {
                                                                                _context7.next = 19;
                                                                                break;
                                                                            }

                                                                            fullName = member[0].split(' ');
                                                                            user = void 0, password = Math.random().toString(36).slice(-8);
                                                                            _context7.prev = 3;
                                                                            _context7.next = 6;
                                                                            return _index.User.forge({
                                                                                firstName: fullName[1],
                                                                                lastName: fullName[0],
                                                                                email: member[1],
                                                                                password: password
                                                                            }).save();

                                                                        case 6:
                                                                            user = _context7.sent;
                                                                            mailOptions = {
                                                                                from: '"web-cam support" <webcamera.sup@gmail.com>',
                                                                                to: member[1],
                                                                                subject: 'Account information',
                                                                                html: '<b>' + me.get('fullName') + '</b> create account for you. <div>password: <b>' + password + '</b></div>'
                                                                            };


                                                                            transporter.sendMail(mailOptions, function (error, info) {
                                                                                if (error) {
                                                                                    return console.log(error);
                                                                                }
                                                                                console.log('Message %s sent: %s', info.messageId, info.response);
                                                                            });
                                                                            _context7.next = 16;
                                                                            break;

                                                                        case 11:
                                                                            _context7.prev = 11;
                                                                            _context7.t0 = _context7['catch'](3);
                                                                            _context7.next = 15;
                                                                            return _index.User.forge({
                                                                                email: member[1]
                                                                            }).fetch();

                                                                        case 15:
                                                                            user = _context7.sent;

                                                                        case 16:
                                                                            _context7.prev = 16;

                                                                            members.push(user);
                                                                            return _context7.finish(16);

                                                                        case 19:
                                                                        case 'end':
                                                                            return _context7.stop();
                                                                    }
                                                                }
                                                            }, _callee7, _this, [[3, 11, 16, 19]]);
                                                        }));

                                                        return function (_x23) {
                                                            return _ref9.apply(this, arguments);
                                                        };
                                                    }()));

                                                case 3:
                                                    _context8.next = 5;
                                                    return new Chat({ name: key }).save();

                                                case 5:
                                                    chat = _context8.sent;
                                                    _context8.next = 8;
                                                    return new Chat({ id: chat.get('id') }).fetch({ withRelated: ['members'] });

                                                case 8:
                                                    chat = _context8.sent;

                                                    members.push(me);
                                                    chat.members().attach(members);

                                                    memberSockets = members.map(function (member) {
                                                        return findSocketByUserId(member.get('id'));
                                                    }).filter(function (socketId) {
                                                        return !!socketId;
                                                    });


                                                    memberSockets.forEach(function (socket) {
                                                        io.to(socket.id).emit('chat_invite', chat);
                                                        socket.join('chat-room-' + chat.get('id'));
                                                    });

                                                    res.status(200).send();

                                                case 14:
                                                case 'end':
                                                    return _context8.stop();
                                            }
                                        }
                                    }, _callee8, _this);
                                }));

                                return function (_x21, _x22) {
                                    return _ref8.apply(this, arguments);
                                };
                            }());

                        case 7:
                        case 'end':
                            return _context9.stop();
                    }
                }
            }, _callee9, _this);
        }));

        return function (_x19, _x20) {
            return _ref7.apply(this, arguments);
        };
    }());

    return router;
};

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _index = require('../models/index');

var _xlsx = require('xlsx');

var _xlsx2 = _interopRequireDefault(_xlsx);

var _delayPromise = require('../utils/delay-promise');

var _delayPromise2 = _interopRequireDefault(_delayPromise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var faker = require('faker');

var _require = require('../models/index'),
    Chats = _require.Chats,
    Chat = _require.Chat;

var router = _express2.default.Router();
//# sourceMappingURL=chat.js.map
