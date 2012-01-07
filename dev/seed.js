var async = require('async');
var models = require('../libs/pgModels.js');
var Faker = require('Faker');
var _ = require('underscore')._;


var Seeder = function(){
    this._flow = {};
    this._last = '';
};
Seeder.prototype.create = function(){
    this._flow.start=function(callback,data){
        callback(null,null);
    };
    this._last = 'start';
    return this;
};
Seeder.prototype.next = function(count,func){
    this._flow[this._last+'1']=[this._last,function(callback,data){
        var cnt = count;

        for(var i=0;i<cnt;i++){
            func(function(){
                if(!--count){
                    callback(null,null);
                }
            });

        }
    }];
    this._last+='1';
    return this;
};
Seeder.prototype.run=function(cb){
    cb = cb || function(){};
    async.auto(this._flow,cb);
};

var data = {
    'user':[],
    'survey':[],
    'question':[]
};

function User(callback){
    models.User.create({
        "oauth_token":Faker.Lorem.words(6).join(""),
        "login":Faker.Lorem.words(1)[0],
        "password":Faker.Lorem.words(4).join(""),
        "email":Faker.Internet.email(),
        "user_name":Faker.Internet.userName(),
        "oauth_token_secret":Faker.Lorem.words(4).join(""),
        "role":Faker.Helpers.randomize(['user','manager','admin']),
        "blocked":Faker.Helpers.randomize([true,false]),
        "accept_terms":Faker.Helpers.randomize([true,false])
    },function(err,result){
        if(!err&&result){
            data.user.push(result.rows[0]);
        }
        callback();
    });
}

function Survey(callback){
    var survey= Faker.Lorem.words(5);
    var surveyName = survey.join(' ');
    var slug = survey.join('_');
    var creator = Faker.Helpers.randomize(_.filter(data.user,function(usr){ return usr.role === 'manager'})).id;
    models.Survey.create({
        'creator_id':creator,
        'survey_name':surveyName,
        'slug':slug
    },function(err,result){
        if(!err&&result){
            data.survey.push(result.rows[0]);
        }
        callback();
    });
}
function Survey_questions(callback){
    var templates = ['list','table'];
   models.Questions.create({
      'survey_id':Faker.Helpers.randomize(data.survey).id,
       'question':Faker.Lorem.sentence(5)+'?',
       'template': Faker.Helpers.randomize(templates)
   },function(err,result){
       if(!err&&result){
           data.question.push(result.rows[0]);
       }
       callback();
   });
}

var user_defined_count = 0;
function Survey_answers(callback){
    models.Answers.create({
        'survey_question_id':Faker.Helpers.randomize(data.question).id,
        'answer':Faker.Lorem.words(4).join(' '),
        'score':Faker.Helpers.randomNumber(100),
        'user_defined_answer': user_defined_count % 10 ===0?true:!user_defined_count++
    },function(err,result){
        callback();
    })
}

var seed = new Seeder();
console.log('seeding database');
seed.create().next(20,User).next(5,Survey).next(5*10,Survey_questions).next(5*10*10,Survey_answers).run(function(){
    console.log('done');
    process.exit(0);
});
