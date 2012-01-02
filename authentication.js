var everyauth = require('everyauth');
var CONFIG = require('config');
var User = require('./libs/pgModels.js').User;
var crypto = require('crypto');
everyauth.facebook
    .appId(CONFIG.Facebook.appId)
    .appSecret(CONFIG.Facebook.appSecret)
    .handleAuthCallbackError(function (req, res) {
        console.log('callback error');
    })
    .findOrCreateUser(function (session, accessToken, accessTokExtra, fbUserMetadata) {
        var promise = this.Promise();
        User.findOne({oauth_token:accessToken}, function (err, user) {
            if (err) {
                promise.fulfill([err]);
            }
            if (user === undefined) {
                User.create({
                    'oauth_token':accessToken,
                    'user_name':fbUserMetadata.name,
                    'role':CONFIG.App.User.default_role
                }, function (err, newUser) {
                    if (err) {
                        promise.fulfill([err]);
                    } else {
                        promise.fulfill(newUser);
                    }
                })
            } else {
                promise.fulfill(user);
            }
        });
        return promise;

    })
    .redirectPath(CONFIG.Facebook.redirectPath)
    .entryPath(CONFIG.Facebook.entryPath)
    .callbackPath(CONFIG.Facebook.callbackPath)
    .scope(CONFIG.Facebook.scope);

everyauth.twitter
    .consumerKey(CONFIG.Twitter.consumerKey)
    .consumerSecret(CONFIG.Twitter.consumerSecret)
    .findOrCreateUser(function (session, accessToken, accessTokenSecret, twitterUserMetadata) {
        var promise = this.Promise();
        User.findOne({oauth_token:accessToken, oauth_token_secret:accessTokenSecret}, function (err, user) {
            if (err) {
                promise.fulfill([err]);
            }
            if (user === undefined) {
                User.create({
                    'oauth_token':accessToken,
                    'oauth_token_secret':accessTokenSecret,
                    'user_name':twitterUserMetadata.name,
                    'role':CONFIG.App.User.default_role
                }, function (err, newUser) {
                    if (err) {
                        promise.fulfill([err]);
                    } else {
                        promise.fulfill(newUser);
                    }
                })
            } else {
                promise.fulfill(user);
            }
        });
        return promise;
    })
    .redirectPath(CONFIG.Twitter.redirectPath)
    .entryPath(CONFIG.Twitter.entryPath)
    .callbackPath(CONFIG.Twitter.callbackPath);

function encryptPassword(psw, salt) {
    var hash = crypto.createHash('md5');
    hash.update(psw + salt);
    hash.update(salt);
    return hash.digest('hex');
}


everyauth.password
    .loginWith('email')
    .getLoginPath(CONFIG.Views.login_path)
    .postLoginPath(CONFIG.Views.login_path)
    .loginView(CONFIG.Views.login)
    .authenticate(function (login, password, request) {
        var errors = [];
        if (!login) errors.push(CONFIG.Phrases.empty_email);
        if (!password) errors.push(CONFIG.Phrases.empty_password);
        if (errors.length) return errors;


        var promise = this.Promise();
        var secretPsw = encryptPassword(password, CONFIG.Session.salt);
        User.findOne({login:login, password:secretPsw}, function (err, user) {
            if (err) {
                promise.fulfill([err]);
            } else {
                if (user === undefined) {
                    promise.fulfill([CONFIG.Phrases.login_and_psw_pair_not_found]);
                } else {
                    promise.fulfill(user);
                }
            }
        });
        return promise;
    })
    .loginSuccessRedirect(CONFIG.Views.login_success_path)
    .getRegisterPath(CONFIG.Views.register_path)// Uri path to the registration page
    .postRegisterPath(CONFIG.Views.register_path)// The Uri path that your registration form POSTs to
    .registerView(CONFIG.Views.register, {layout:true})
    .validateRegistration(function (newUserAttributes) {
        var errors = [];
        if (!newUserAttributes.email) {
            errors.push(CONFIG.Phrases.empty_email);
        }
        if (!newUserAttributes.password) {
            errors.push(CONFIG.Phrases.empty_password);
        }
        if (errors.length > 0) {
            return errors;
        } else {
            var promise = this.Promise();
            User.findOne({'email':newUserAttributes.email}, function (err, email) {
                if (err) {
                    promise.fulfill([err]);
                } else {
                    if (email !== undefined) {
                        promise.fulfill([CONFIG.Phrases.email_already_taken]);
                    } else {
                        promise.fulfill(newUserAttributes);
                    }
                }
            });
            return promise;
        }

    })
    .registerUser(function (newUserAttributes) {
        var secretPsw = encryptPassword(newUserAttributes.password, CONFIG.Session.salt);
        var promise = this.Promise();
        User.create({'login':newUserAttributes.email, 'email':newUserAttributes.email, 'password':secretPsw}, function (err, User) {
            if (err) {
                promise.fulfill([err]);
            } else {
                var newUser = User.rows[0];
                var usr = {
                    'id':newUser.id,
                    'login':newUser.email
                };
                promise.fulfill(usr);
            }
        });
        return promise;
    })
    .registerSuccessRedirect(CONFIG.Views.login_success_path); // Where to redirect to after a successful registration
module.exports = everyauth;
