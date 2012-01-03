var express = require('express');
var CONFIG = require('config');
var res = require('express-resource');
var auth = require('./authentication.js');
var dbModels = require('./libs/pgModels.js');
var app = express.createServer();
var io = require('socket.io').listen(app);

/**
 * app.use directives
 */
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({secret:CONFIG.Session.secret}));
app.use(auth.middleware());
app.use(express.static(__dirname + '/public'));
app.dynamicHelpers({
    session:function (req, res) {
        return req.session;
    }
});

/**
 * app.set directives
 */
app.set('view engine', 'jade');


/**
 * app.resource directives
 */
var resourceOptions = {
    'dbModels':dbModels,
    'name':'test name'
};
var SurveyManagerResource = require('./resources/API/survey/survey_management.js').configure(resourceOptions);
var UserManagerResource = require('./resources/API/user/user_management.js').configure(resourceOptions);
app.resource('survey', SurveyManagerResource);
app.resource('user', UserManagerResource);
/**
 * Routes
 */
var sessions = false;
app.get('/', function (req, res) {
    res.header('Content-Type', 'text/html');
    if (!sessions) {
        sessions = req.sessionStore;
    }
    if (!req.session.auth) {
        res.render('hello.jade');
    } else {
        res.render('main.jade');
    }
});

app.get('/secure', function (req, res) {
    res.header('Content-Type', 'text/html');
    if (req.session.auth.loggedIn) {
        res.end('very secret place');
    } else {
        res.end('you should log in first <a href="/">back</a>');
    }

});
app.get('/chat', function (req, res) {

    res.render('chat.jade');

});

var parseCookie = function (str) {
    var obj = {}
        , pairs = str.split(/[;,] */);
    for (var i = 0, len = pairs.length; i < len; ++i) {
        var pair = pairs[i]
            , eqlIndex = pair.indexOf('=')
            , key = pair.substr(0, eqlIndex).trim().toLowerCase()
            , val = pair.substr(++eqlIndex, pair.length).trim();

        // quoted values
        if ('"' == val[0]) val = val.slice(1, -1);

        // only assign once
        if (undefined == obj[key]) {
            val = val.replace(/\+/g, ' ');
            try {
                obj[key] = decodeURIComponent(val);
            } catch (err) {
                if (err instanceof URIError) {
                    obj[key] = val;
                } else {
                    throw err;
                }
            }
        }
    }
    return obj;
};
io.configure(function () {
    io.set('authorization', function (handshakeData, callback) {
        var cookie = parseCookie(handshakeData.headers.cookie);
        var auth = sessions.sessions ? sessions.sessions.hasOwnProperty(cookie['connect.sid']) : false;
        if (auth === true) {
            var userSession = JSON.parse(sessions.sessions[cookie['connect.sid']]);
            if (userSession.auth && userSession.auth.loggedIn === true) {
                handshakeData.uInfo = userSession.info;

            } else {
                auth = false;
            }

        }
        callback(null, auth); // error first callback style

    });
});
io.sockets.on('connection', function (socket) {
    var users = {};
    for (var userID in socket.namespace.manager.handshaken) {
        if (socket.id !== userID) {
            var connectedUser = socket.namespace.manager.handshaken[userID];
            users[userID] = {'name':connectedUser.uInfo.user_name, 'profile_pic':connectedUser.uInfo.profile_pic_url};
        }
    }
    socket.broadcast.emit('usersInRoom', users);
    socket.emit('userInfo', {'name':socket.handshake.uInfo.user_name, 'photo':socket.handshake.uInfo.profile_pic_url});
    socket.on('chatMessage', function (data) {
        data.sender = socket.handshake.uInfo.user_name;
        socket.broadcast.emit('chatMessage', data);
    })
});


app.listen(CONFIG.App.port);
