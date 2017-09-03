const express = require('express');
const jwt = require('jsonwebtoken');
const apiRoutes = express.Router();
import userRoutes from './user';
import chatRoutes from './chat';
import testRoutes from './test';

module.exports = function (app , io, transporter) {
    apiRoutes.use((req, res, next) => {
        let token = req.body.token || req.headers.authorization;
        if (!token) {
            return res.status(401).send('No token provided.');
        }
        jwt.verify(token, app.get('API_SECRET'), (err, decoded) => {
            if (err) {
                return res.status(401).json({message: err.message || err});
            }
            req.decoded = decoded;
            next();
        });
    });

    apiRoutes.use('/users', userRoutes(io));
    apiRoutes.use('/chats', chatRoutes(io, transporter));
    apiRoutes.use('/tests', testRoutes(io));

    return apiRoutes;
};