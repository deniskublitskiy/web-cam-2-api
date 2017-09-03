'use strict';

var _fs = require('fs');

var fs = _interopRequireWildcard(_fs);

var _socket = require('socket.io');

var _socket2 = _interopRequireDefault(_socket);

var _sockets = require('./sockets');

var _sockets2 = _interopRequireDefault(_sockets);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var express = require('express');
var path = require('path');
var socket = require('socket.io');
var bodyParser = require('body-parser');
var cors = require('cors');
var morgan = require('morgan');
var nodemailer = require('nodemailer');

var app = express();
// const server = require('https').Server({
//     key: fs.readFileSync('file.pem'),
//     cert: fs.readFileSync('file.crt')
// }, app);

var server = require('http').Server(app);
var port = process.env.PORT || 3333;

var config = require('./config');

Object.keys(config).forEach(function (key) {
    app.set(key, config[key]);
});

var transporter = nodemailer.createTransport({
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

var io = new _socket2.default(server);
(0, _sockets2.default)(io);

var authRoutes = require('./routes/auth')(app);
var apiRoutes = require('./routes/api')(app, io, transporter);

app.use('/auth', authRoutes);
app.use('/api/v1', apiRoutes);

app.use(function (err, req, res, next) {
    console.error(err);
    res.status(err.status || 400).json({
        error: err.e
    });
});

server.listen(port, '192.168.0.104', function () {
    console.log('Listening on port ' + port);
});

module.exports = app;
//# sourceMappingURL=server.js.map
