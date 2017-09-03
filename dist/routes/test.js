'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

exports.default = function (io) {
    var _this = this;

    router.get('/types', function () {
        var _ref = _asyncToGenerator(_regenerator2.default.mark(function _callee(req, res, next) {
            var testTypes;
            return _regenerator2.default.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.prev = 0;
                            _context.next = 3;
                            return TestType.fetchAll();

                        case 3:
                            testTypes = _context.sent;

                            res.status(200).json(testTypes.toJSON());
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

    function findSocketByUserId(userId) {
        var connected = io.sockets.connected;
        var socketId = Object.keys(connected).find(function (key) {
            return connected[key].handshake.query.userId == userId;
        });

        return connected[socketId];
    }

    return router;
};

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var _require = require('../models'),
    TestType = _require.TestType,
    TestTypes = _require.TestTypes;

var router = _express2.default.Router();
//# sourceMappingURL=test.js.map
