var express = require('express');
var everyauth = require('everyauth');

var app = express.createServer();


everyauth.facebook
    .appId('282172928498649')
    .appSecret('37b2f0d758442c9c2327baeaa196d7d2')
    .handleAuthCallbackError(function (req, res) {
        console.log('callback error');
    })
    .findOrCreateUser(function (session, accessToken, accessTokExtra, fbUserMetadata) {
        session.authWith = 'facebook';
        return fbUserMetadata;

    })
    .redirectPath('/')
    .entryPath('/auth/facebook')
    .callbackPath('/auth/facebook/callback')
    .scope('email');

everyauth.twitter
    .consumerKey('l2AbWf22A136POS9XWxQ')
    .consumerSecret('glDqSvEHPBt9PpIE7E6Oz5z58x01ENv2t5hcAHCrw')
    .findOrCreateUser(function (session, accessToken, accessTokenSecret, twitterUserMetadata) {
        session.authWith = 'twitter';
        return twitterUserMetadata;
    })
    .redirectPath('/')
    .entryPath('/auth/twitter')
    .callbackPath('/auth/twitter/callback');


app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({secret:'$23flkDKS$J23fm455JOJLU&&^O'}));
app.use(everyauth.middleware());

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
    if (req.session.loggedIn) {
        res.end('very secret place');
    } else {
        res.end('you should log in first <a href="/">back</a>');
    }

});


app.listen(8000);
