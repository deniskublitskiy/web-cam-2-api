const express = require('express');
const jwt = require('jsonwebtoken');
const authRoutes = express.Router();

const {User} = require('../models/index');

module.exports = function (app) {
    function responseCredentials(user, status, res) {
        let payload = {
            id: user.id,
            fullName: user.fullName
        };
        let token = jwt.sign(payload, app.get('API_SECRET'), {
            expiresIn: app.get('TOKEN_EXPIRATION_TIME')
        });
        res.status(status).json({
            data: user.toJSON(),
            token
        });
    }

    authRoutes.use((req, res, next) => {
        let {email, password} = req.body;
        if (!email) {
            return next({status: 400});
        }
        if (!password) {
            return next({status: 400});
        }
        next();
    });

    authRoutes.post('/login', (req, res, next) => {
        let {email, password} = req.body;
        User.login(email, password)
            .then(user => responseCredentials(user, 200, res))
            .catch(next)

    });

    authRoutes.post('/signup', (req, res, next) => {
        new User(req.body)
            .save()
            .then(user => responseCredentials(user, 203, res))
            .catch(next)

    });

    return authRoutes;
};