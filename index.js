var express = require('express');
var CONFIG = require('config');
var auth = require('./authentication.js');
var app = express.createServer();


/**
 * app.use directives
 */
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({secret:CONFIG.Session.secret}));
app.use(auth.middleware());
app.use(express.static(__dirname + '/public'));

/**
 * app.set directives
 */
app.set('view engine', 'jade');

/**
 * Routes
 */
app.get('/', function (req, res) {
    res.header('Content-Type', 'text/html');
    if (!req.session.auth) {
        res.render('hello.jade');
    } else {
        var session = req.session;
        res.render('main.jade');
    }
});

app.get('/secure', function (req, res) {
    res.header('Content-Type', 'text/html');
    console.log('attemting to visit secure place')
    if (req.session.auth.loggedIn) {
        res.end('very secret place');
    } else {
        res.end('you should log in first <a href="/">back</a>');
    }

});
app.get('/pub', function (req, res) {
    res.render('login.jade');
});


app.listen(CONFIG.App.port);
