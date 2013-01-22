﻿/// <reference path="~/lib/node-vsdoc.js" />

/**
 * Module dependencies.
 */
var config = {
    db: {
        db: 'psymap-dev',
        host: 'ds043997.mongolab.com',
        port: 43997,  // optional, default: 27017
        username: 'default', // optional
        password: 'default' // optional
    },
    getConnectionString: function(){
        return 'mongodb://' + config.db.username+':'+config.db.password+'@' + config.db.host+':'+config.db.port + '/' + config.db.db;
    },
    secret: '076ee61d63aa10a125ea872411e433b9',
};

var express = require('express')
  , http = require('http')
  , stylus = require('stylus')
  , routes = require('./routes')
  , path = require('path')
  , url = require('url')
  //, FileStore = require('seed-filestore')
  //, redisUrl = url.parse(process.env.REDISTOGO_URL || 'redis://redis:@192.168.1.7:6379')
  //, redisAuth = redisUrl.auth.split(':')
  //, RedisStore = require('connect-redis')(express)
  , MongoStore = require('connect-mongodb')
  , fs = require('fs')
  , assetManager = require('connect-assetmanager')
  , DAL = require('./data').DAL
  , PORT = process.env.PORT || 14800;

const parseCookie = require('connect').utils.parseSignedCookies;

var app = module.exports = express();

DAL.init(config.getConnectionString());

// Configuration

var stylus_compile = function (str, path) {
    return stylus(str)
            .set('filename', path)
            .set('compress', true)
            .include(require('nib').path)
            .include(require('fez').path);
};

app.configure('production', function(){
    app.use(minFile);
});

app.configure(function(){
    app.set('views', __dirname + '/views');
    app.engine('.html', require('ejs').__express);
    app.set('view engine', 'html');  
    app.use(stylus.middleware({
        src: path.join(__dirname, 'styles'),
        dest: path.join(__dirname, 'public'),
        compile: stylus_compile,
        force: true // this forces the css to be regenerated on every pageview
    }));
    app.use(express.static(__dirname + '/public', { maxAge: 0 }));
    app.use(assetManager(routes.files));
    // Allow parsing cookies from request headers
    this.use(express.cookieParser("psy, come on guy !!!"));
    // Session management
    // Internal session data storage engine, this is the default engine embedded with connect.
    // Much more can be found as external modules (Redis, Mongo, Mysql, file...). look at "npm search connect session store"
    //this.sessionStore = new express.session.MemoryStore({ reapInterval: 60000 * 10 });
    this.sessionStore = new MongoStore({url: config.getConnectionString()});

    app.use(express.session({
        secret : "psy, come on guy !!!",
        maxAge : new Date(Date.now() + 3600000), //1 Hour
        store  : this.sessionStore
    }));

    app.use(express.bodyParser({uploadDir: __dirname}));
    app.use(express.methodOverride());
    app.use(app.router);
    /*app.use(function(err, req, res, next){
        console.error(err.stack);
        res.send(500, 'Something broke!');
    });*/
});

app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
    app.use(express.errorHandler());
});

/** Middleware for limited access */
function minFile(req, res, next) {
    if (req.url.indexOf(".js") > -1 && req.url.indexOf("libs") == -1 ) {
        req.url = req.url.replace('.js','.min.js');
    }
    next();
}

/** Middleware for limited access */
function requireLogin(req, res, next) {
    next();
    return;
    if (req.session.username) {
        // User is authenticated, let him in
        next();
    } else {
        // Otherwise, we redirect him to login form
        res.redirect("/login");
    }
}

function cleanLogin(req, res, next) {
    if (req && req.session) {
        req.session.destroy(function(err){
            next(err);
        });
    }
    else{
        next();
    }
}

routes.init(app);

// Routes
app.get("/manifest.manifest", routes.manifest);
/** Home page (requires authentication) */
app.get('/', routes.index);
app.get('/admin', routes.admin);
app.get('/login', [cleanLogin], routes.login);
app.post("/login", routes.loginPost);
app.get('/js/templates.js', routes.templatejs);
//app.post('/admin/rdv', routes.addRdv);

if (!module.parent) {
    app.listen(PORT);
}

process.on('uncaughtException', function (exception) {
    //exception.response.writeHead(exception.code, {'Content-Type': 'text/html'});
    //exception.response.end('Error ' + exception.code + ' - ' + exception.message);
});