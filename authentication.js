var everyauth = require('everyauth');
var CONFIG = require('config');

everyauth.facebook
    .appId(CONFIG.Facebook.appId)
    .appSecret(CONFIG.Facebook.appSecret)
    .handleAuthCallbackError(function (req, res) {
        console.log('callback error');
    })
    .findOrCreateUser(function (session, accessToken, accessTokExtra, fbUserMetadata) {
        session.authWith = 'facebook';
        return fbUserMetadata;

    })
    .redirectPath(CONFIG.Facebook.redirectPath)
    .entryPath(CONFIG.Facebook.entryPath)
    .callbackPath(CONFIG.Facebook.callbackPath)
    .scope(CONFIG.Facebook.scope);

everyauth.twitter
    .consumerKey(CONFIG.Twitter.consumerKey)
    .consumerSecret(CONFIG.Twitter.consumerSecret)
    .findOrCreateUser(function (session, accessToken, accessTokenSecret, twitterUserMetadata) {
        session.authWith = 'twitter';
        return twitterUserMetadata;
    })
    .redirectPath(CONFIG.Twitter.redirectPath)
    .entryPath(CONFIG.Twitter.entryPath)
    .callbackPath(CONFIG.Twitter.callbackPath);

module.exports = everyauth;