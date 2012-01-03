var express = require('express');
var CONFIG = require('config');
var res = require('express-resource');
var auth = require('./authentication.js');
var dbModels = require('./libs/pgModels.js');
var app = express.createServer();


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
app.get('/', function (req, res) {
    res.header('Content-Type', 'text/html');
    console.log(req.session);
    if (!req.session.auth) {
        res.render('hello.jade');
    } else {
        var session = req.session;
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
app.get('/pub', function (req, res) {
    console.log(req.session);
});


app.listen(CONFIG.App.port);
