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


/**
 * Routes
 */
app.get('/', function (req, res) {
    res.header('Content-Type', 'text/html');
    console.log(req.session);
    if (!req.session.auth) {
        res.end('Login please <a href="/auth/facebook">with facebook</a> or <a href="/auth/twitter">with Twitter</a>');
    } else {
        var session = req.session;
        var urlPath = session.authWith == 'facebook' ? session.auth.facebook.user.link : 'http://twitter.com/!#' + session.auth.twitter.user.screen_name;
        var name = session.authWith == 'facebook' ? session.auth.facebook.user.name : session.auth.twitter.user.name;
        res.end('hello <a href="' + urlPath + '">' + name + '</a> <br/> or <a href="/logout">logout</a>');
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


app.listen(CONFIG.App.port);
