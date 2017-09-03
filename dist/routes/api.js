'use strict';

var _user = require('./user');

var _user2 = _interopRequireDefault(_user);

var _chat = require('./chat');

var _chat2 = _interopRequireDefault(_chat);

var _test = require('./test');

var _test2 = _interopRequireDefault(_test);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var express = require('express');
var jwt = require('jsonwebtoken');
var apiRoutes = express.Router();


module.exports = function (app, io, transporter) {
    apiRoutes.use(function (req, res, next) {
        var token = req.body.token || req.headers.authorization;
        if (!token) {
            return res.status(401).send('No token provided.');
        }
        jwt.verify(token, app.get('API_SECRET'), function (err, decoded) {
            if (err) {
                return res.status(401).json({ message: err.message || err });
            }
            req.decoded = decoded;
            next();
        });
    });

    apiRoutes.use('/users', (0, _user2.default)(io));
    apiRoutes.use('/chats', (0, _chat2.default)(io, transporter));
    apiRoutes.use('/tests', (0, _test2.default)(io));

    return apiRoutes;
};
//# sourceMappingURL=api.js.map
