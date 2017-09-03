'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.default = function (io) {
    var _this = this;

    userRoutes.get('/', function () {
        var _ref = _asyncToGenerator(_regenerator2.default.mark(function _callee(req, res, next) {
            var _req$query, _req$query$offset, offset, _req$query$limit, limit, countQuery, searchQuery, _ref2, _ref3, users, count;

            return _regenerator2.default.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            Object.keys(req.query).forEach(function (key) {
                                return req.query[key] = decodeURIComponentX(req.query[key]);
                            });
                            _req$query = req.query, _req$query$offset = _req$query.offset, offset = _req$query$offset === undefined ? 0 : _req$query$offset, _req$query$limit = _req$query.limit, limit = _req$query$limit === undefined ? 10 : _req$query$limit;
                            countQuery = Users.query(function (q) {
                                return createSearchQuery(q, req.query);
                            });
                            searchQuery = Users.query(function (q) {
                                return createSearchQuery(q, req.query).limit(limit).offset(offset);
                            });
                            _context.prev = 4;
                            _context.next = 7;
                            return Promise.all([searchQuery.fetch(), countQuery.count()]);

                        case 7:
                            _ref2 = _context.sent;
                            _ref3 = _slicedToArray(_ref2, 2);
                            users = _ref3[0];
                            count = _ref3[1];


                            res.status(200).json({
                                count: count,
                                contacts: users.toJSON()
                            });

                            _context.next = 17;
                            break;

                        case 14:
                            _context.prev = 14;
                            _context.t0 = _context['catch'](4);

                            next(_context.t0);

                        case 17:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, _this, [[4, 14]]);
        }));

        return function (_x, _x2, _x3) {
            return _ref.apply(this, arguments);
        };
    }());

    userRoutes.get('/:id', function () {
        var _ref4 = _asyncToGenerator(_regenerator2.default.mark(function _callee2(req, res, next) {
            var options, fields, user;
            return _regenerator2.default.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            options = {
                                require: true
                            };
                            fields = req.query.fields;

                            if (fields) {
                                options.columns = fields.split(',');
                            }

                            _context2.prev = 3;
                            _context2.next = 6;
                            return new User({
                                id: req.params.id
                            }).fetch(options);

                        case 6:
                            user = _context2.sent;


                            res.status(200).json(user.toJSON());
                            _context2.next = 13;
                            break;

                        case 10:
                            _context2.prev = 10;
                            _context2.t0 = _context2['catch'](3);

                            next(_context2.t0);

                        case 13:
                        case 'end':
                            return _context2.stop();
                    }
                }
            }, _callee2, _this, [[3, 10]]);
        }));

        return function (_x4, _x5, _x6) {
            return _ref4.apply(this, arguments);
        };
    }());

    userRoutes.put('/:id', function () {
        var _ref5 = _asyncToGenerator(_regenerator2.default.mark(function _callee3(req, res, next) {
            var user;
            return _regenerator2.default.wrap(function _callee3$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                            user = new User({
                                id: req.params.id
                            });
                            _context3.prev = 1;
                            _context3.next = 4;
                            return user.fetch();

                        case 4:
                            user = _context3.sent;

                            Object.keys(req.body).forEach(function (key) {
                                return user.set(key, req.body[key]);
                            });
                            _context3.next = 8;
                            return user.save();

                        case 8:
                            user = _context3.sent;


                            res.status(200).json(user.toJSON());
                            _context3.next = 15;
                            break;

                        case 12:
                            _context3.prev = 12;
                            _context3.t0 = _context3['catch'](1);

                            next({ status: 500, e: _context3.t0 });

                        case 15:
                        case 'end':
                            return _context3.stop();
                    }
                }
            }, _callee3, _this, [[1, 12]]);
        }));

        return function (_x7, _x8, _x9) {
            return _ref5.apply(this, arguments);
        };
    }());

    userRoutes.delete('/:id', function (req, res, next) {
        new User({
            id: req.params.id
        }).fetch().then(function (user) {
            if (user) {
                user.destroy();
                return res.status(200);
            }
            next({ status: 404 });
        });
    });

    userRoutes.get('/:id/contacts', function (req, res, next) {
        new User({
            id: req.params.id
        }).fetch({
            withRelated: ['contacts']
        }).then(function (user) {
            res.status(200).json(user.related('contacts'));
        }).catch(next);
    });

    userRoutes.get('/:id/chats', function () {
        var _ref6 = _asyncToGenerator(_regenerator2.default.mark(function _callee4(req, res, next) {
            var user;
            return _regenerator2.default.wrap(function _callee4$(_context4) {
                while (1) {
                    switch (_context4.prev = _context4.next) {
                        case 0:
                            _context4.prev = 0;
                            _context4.next = 3;
                            return new User({
                                id: req.params.id
                            }).fetch({
                                withRelated: ['chats']
                            });

                        case 3:
                            user = _context4.sent;

                            res.status(200).json(user.related('chats'));
                            _context4.next = 10;
                            break;

                        case 7:
                            _context4.prev = 7;
                            _context4.t0 = _context4['catch'](0);

                            next(_context4.t0);

                        case 10:
                        case 'end':
                            return _context4.stop();
                    }
                }
            }, _callee4, _this, [[0, 7]]);
        }));

        return function (_x10, _x11, _x12) {
            return _ref6.apply(this, arguments);
        };
    }());

    userRoutes.post('/:id/contacts', function () {
        var _ref7 = _asyncToGenerator(_regenerator2.default.mark(function _callee5(req, res, next) {
            var contactId, id, user, contact;
            return _regenerator2.default.wrap(function _callee5$(_context5) {
                while (1) {
                    switch (_context5.prev = _context5.next) {
                        case 0:
                            contactId = req.body.id;
                            id = req.params.id;

                            if (id) {
                                _context5.next = 4;
                                break;
                            }

                            return _context5.abrupt('return', next({ status: 400, message: 'Contact user must be specified' }));

                        case 4:
                            if (!(id == contactId)) {
                                _context5.next = 6;
                                break;
                            }

                            return _context5.abrupt('return', next({ status: 400, message: 'Impossible add yourself to contacts' }));

                        case 6:
                            _context5.prev = 6;
                            user = new User({ id: id });
                            _context5.next = 10;
                            return user.fetch();

                        case 10:
                            user = _context5.sent;
                            _context5.next = 13;
                            return user.contacts().attach(contactId);

                        case 13:
                            contact = new User({ id: contactId });
                            _context5.next = 16;
                            return contact.fetch();

                        case 16:
                            contact = _context5.sent;
                            _context5.next = 19;
                            return contact.contacts().attach(id);

                        case 19:

                            io.to(findUserSocketId(contactId)).emit('connection_request', user.toJSON());

                            res.status(203).json(contact.toJSON());
                            _context5.next = 26;
                            break;

                        case 23:
                            _context5.prev = 23;
                            _context5.t0 = _context5['catch'](6);

                            next(_context5.t0);

                        case 26:
                        case 'end':
                            return _context5.stop();
                    }
                }
            }, _callee5, _this, [[6, 23]]);
        }));

        return function (_x13, _x14, _x15) {
            return _ref7.apply(this, arguments);
        };
    }());

    function findUserSocketId(userId) {
        var sockets = io.sockets.connected;
        return Object.keys(sockets).find(function (key) {
            return sockets[key].handshake.query.userId == userId;
        });
    }

    /**
     * TODO Refactor it
     * @param query
     * @param params
     * @returns {*}
     */
    function createSearchQuery(query, params) {
        var reserved = ['sort', 'limit', 'offset'];
        _.difference(_.keys(params), reserved).forEach(function (paramName, i) {
            var paramValue = params[paramName].split(',');
            paramName = _.snakeCase(paramName);
            if (paramValue.length === 1) {
                if (i === 0) {
                    query.where(paramName, 'LIKE', paramValue);
                } else {
                    query.andWhere(paramName, 'LIKE', paramValue);
                }
            } else {
                if (i === 0) {
                    query.whereIn(paramName, paramValue);
                } else {
                    query.andWhereIn(paramName, paramValue);
                }
            }
        });

        if (params.sort) {
            var sorts = params.sort.split(',');
            sorts.forEach(function (sort) {
                var direction = sort.charAt(0) === '-' ? 'desc' : 'asc';
                if (direction === 'desc') {
                    sort = sort.slice(1);
                }
                query.orderBy(sort, direction);
            });
        }

        return query;
    }

    return userRoutes;
};

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var express = require('express');
var decode = require('urldecode');
var userRoutes = express.Router();

var _require = require('../models/index'),
    User = _require.User,
    Users = _require.Users;

var _ = require('lodash');

function decodeURIComponentX(str) {
    var out = '',
        arr,
        i = 0,
        l,
        x;
    arr = str.split(/(%(?:D0|D1)%.{2})/);
    for (l = arr.length; i < l; i++) {
        try {
            x = decodeURIComponent(arr[i]);
        } catch (e) {
            x = arr[i];
        }
        out += x;
    }
    return out;
}
//# sourceMappingURL=user.js.map
