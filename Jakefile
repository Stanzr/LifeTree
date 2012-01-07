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
});