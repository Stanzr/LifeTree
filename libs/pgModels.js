var fastLegs = require('FastLegS');
var CONFIG = require('config');
var pgDBParams = {
    user:CONFIG.App.db.user,
    password:CONFIG.App.db.password,
    database:CONFIG.App.db.dbName,
    host:CONFIG.App.db.host,
    port:CONFIG.App.db.port
};


fastLegs.connect(pgDBParams);

var models = {
    'User':fastLegs.Base.extend({
        'tableName':'users',
        'primaryKey':'id'
    })
};
module.exports = models;