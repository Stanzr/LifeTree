var path = require('path');
var config = require('config');
var fs = require('fs');


namespace('db',function(){
    var db = require('./dev/db.js');

    desc('drop pg database');
    task('drop',function(){
        db.drop();
    });
    desc("create basic schema for db");
    task('schema',function(){
        db.schema();

    });

    desc("create db");
    task("create",function(){
        db.create();
    });

    desc("seeds db with random data(not ready yet)");
    task("seed",function(){
        db.seed();
    });

    desc("drops db,create db, make db schema and seeds it");
    task("renew",function(){
        function interval(){
            var timer = 0;
            return function(){
                return timer+=1000;
            }
        }
        var timeout = interval();

        jake.Task['db:drop'].invoke();
        setTimeout(function(){
            jake.Task['db:create'].invoke();
        },timeout());
        setTimeout(function(){
            jake.Task['db:schema'].invoke();
        },timeout());
        setTimeout(function(){
            jake.Task['db:seed'].invoke();

        },timeout());

    })
});