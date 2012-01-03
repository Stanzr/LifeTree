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

var User = fastLegs.Base.extend({
    'tableName':'users',
    'primaryKey':'id'
});

var Answers = fastLegs.Base.extend({
    'tableName':'survey_answers',
    'primaryKey':'id'
});

var Questions = fastLegs.Base.extend({
    'tableName':'survey_questions',
    'primaryKey':'id',
    'many':[
        {'answers':Answers, 'joinOn':'survey_question_id'}
    ]

});

var Survey = fastLegs.Base.extend({
    'tableName':'surveys',
    'primaryKey':'id',
    'many':[
        {'survey_questions':Questions, 'joinOn':'survey_id'}
    ]
});


var models = {
    'User':User,
    'Survey':Survey,
    'Questions':Questions,
    'Answers':Answers
};
module.exports = models;