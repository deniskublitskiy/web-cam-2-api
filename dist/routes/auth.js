'use strict';

var express = require('express');
var jwt = require('jsonwebtoken');
var authRoutes = express.Router();

var _require = require('../models/index'),
    User = _require.User;

module.exports = function (app) {
    function responseCredentials(user, status, res) {
        var payload = {
            id: user.id,
            fullName: user.fullName
        };
        var token = jwt.sign(payload, app.get('API_SECRET'), {
            expiresIn: app.get('TOKEN_EXPIRATION_TIME')
        });
        res.status(status).json({
            data: user.toJSON(),
            token: token
        });
    }

    authRoutes.use(function (req, res, next) {
        var _req$body = req.body,
            email = _req$body.email,
            password = _req$body.password;

        if (!email) {
            return next({ status: 400 });
        }
        if (!password) {
            return next({ status: 400 });
        }
        next();
    });

    authRoutes.post('/login', function (req, res, next) {
        var _req$body2 = req.body,
            email = _req$body2.email,
            password = _req$body2.password;

        User.login(email, password).then(function (user) {
            return responseCredentials(user, 200, res);
        }).catch(next);
    });

    authRoutes.post('/signup', function (req, res, next) {
        new User(req.body).save().then(function (user) {
            return responseCredentials(user, 203, res);
        }).catch(next);
    });

    return authRoutes;
};
//# sourceMappingURL=auth.js.map
