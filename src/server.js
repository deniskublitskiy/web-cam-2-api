import * as fs from 'fs';

const express = require('express');
const path = require('path');
const socket = require('socket.io');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const nodemailer = require('nodemailer');

const app = express();
// const server = require('https').Server({
//     key: fs.readFileSync('file.pem'),
//     cert: fs.readFileSync('file.crt')
// }, app);

const server = require('http').Server(app);
const port = process.env.PORT || 3333;

const config = require('./config');

Object.keys(config).forEach(key => {
    app.set(key, config[key]);
});

let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    service: 'Gmail',
    auth: {
        user: 'webcamera.sup@gmail.com',
        pass: 'qwerty12345qwerty'
    }
});

app.set('PORT', port);

/**
 * TODO
 * limit to config
 */
app.use(bodyParser.json({
    limit: '50mb'
}));
app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('dev'));
app.use(cors());

import SocketIO from 'socket.io';
import SocketEvents from './sockets';

const io = new SocketIO(server);
SocketEvents(io);

const authRoutes = require('./routes/auth')(app);
const apiRoutes = require('./routes/api')(app, io, transporter);

app.use('/auth', authRoutes);
app.use('/api/v1', apiRoutes);

app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 400).json({
        error: err.e
    });
});

server.listen(port, '192.168.0.104', () => {
    console.log('Listening on port ' + port);
});

module.exports = app;
