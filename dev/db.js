var pg = require('pg');
var config = require('config');
var path = require('path');
var fs = require('fs');


/**
 * setting up connections
 */
var defaultDBConnection = [];
defaultDBConnection.push("tcp://");
defaultDBConnection.push(config.App.db.user);
defaultDBConnection.push(":");
defaultDBConnection.push(config.App.db.password);
defaultDBConnection.push("@");
defaultDBConnection.push(config.App.db.host);
defaultDBConnection.push("/");
defaultDBConnection.push("postgres"); //open default db

var workingDBConnection = [];
workingDBConnection.push("tcp://");
workingDBConnection.push(config.App.db.user);
workingDBConnection.push(":");
workingDBConnection.push(config.App.db.password);
workingDBConnection.push("@");
workingDBConnection.push(config.App.db.host);
workingDBConnection.push("/");
workingDBConnection.push(config.App.db.dbName); //open default db

/**
 * checking if we in development mode
 */

var deployment = process.env.NODE_ENV || "development";
if("development" !== deployment){
    console.error("You should launch db:drop ONLY in development enviroment");
    console.error("If you really want to do it - you should set NODE_ENV to \"development\"");
    console.error("or launch this command \"NODE_ENV=development jake db:drop\"");
    process.exit(1);
    

}

/**
 * exports section
 */

exports.drop = function(){
    var client = new pg.Client(defaultDBConnection.join(""));
    client.connect();
    console.log("dropping database \""+config.App.db.dbName+"\"");
    client.query("DROP DATABASE "+config.App.db.dbName,function(err){
        if(err){
            console.log("ouch, I've got an error:");
            console.log("severity:%s code: %s details:%s",err.severity,err.code,err.detail);
        }else{
            console.log('done.');
            
        }
    });
};

exports.schema = function(){
    var dbSchemaPath = __dirname+'/lifetree_db.sql';
    if(path.existsSync(dbSchemaPath)){
        var sql = fs.readFileSync(dbSchemaPath);
        var client = new pg.Client(workingDBConnection.join(""));
        client.connect();
        client.query(sql.toString(),function(err){
            if(!err){
                console.log('schema created successfully');
                
            }else{
                console.log('something go wrong');
                console.log(err);
                process.exit(1);
                
            }

        })
    }else{
        console.log('cant find '+dbSchemaPath);
        process.exit(1);
        
    }
};

exports.create = function(){
    var client = new pg.Client(defaultDBConnection.join(""));
    client.connect();
    client.query("CREATE DATABASE "+config.App.db.dbName,function(err,result){
        if(!err&&result){
            console.log("done.");
            
        }else{
            console.log(err);
            process.exit(1);
        }
    });
};


exports.seed = function(){
    require('./seed.js');
};




