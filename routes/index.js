
var path = require('path')
  , ejs = require('ejs')
  , fs = require('fs')
  , DAL = require('../data').DAL
  , version = 1;

exports.manifest = function (req, res) {
    res.header("Content-Type", "text/cache-manifest");
    res.header('Cache-Control', 'no-cache');
    var ins = fs.createReadStream(path.join(__dirname, '../rdvmap.manifest'));
    ins.pipe(res);
};

/*
 * GET home page.
 */

function getHomeUrl() {
    return "/?=" + version;
};

exports.index = function (req, res) {
    res.setHeader('Cache-Control', 'public, max-age=' + 31557600000);
    res.render('index', { title: 'Map'});
};

exports.login = function(req, res) {
    var username = "";
    if (req.session) {
        username = req.session.username;
    }
    res.render('index', { title: 'Footmap', username: username, error: null });
};

exports.loginPost = function (req, res) {
    var options = { title: "Probl&egrave;me de login", "username": req.body.username, "error": null };
    if (!req.body.username) {
        options.error = "User name is required";
        res.render("login", options);
        return;
    }
    req.body.username = req.body.username.toLowerCase().replace(/ /g,'');
    if (req.body.username == req.session.username) {
        if (req.body.username == "admin") {
            res.redirect("/admin");
            return;
        }
        // User has not changed username, accept it as-is
        res.redirect(getHomeUrl());
    } else if (!req.body.username.match(/^[a-zA-Z0-9\-_]{2,}$/)) {
        options.error = "User name must have at least 2 alphanumeric characters";
        res.render("login", options);
    } else {
        if (req.body.username == "admin" && req.body.password == "toto") {
            req.session.username = req.body.username;
            res.redirect("/admin");
            return;
        }
        DAL.Players.get({ id: req.body.username }, function (err, player) {
            if (err) {
                options.error = "" + err;
                res.render("login", options);
            } else {
                if (player.pwd != req.body.password) {
                    options.error = "" + "Mot de passe incorect.";
                    res.render("login", options);
                } else {
                    req.session.username = req.body.username;
                    res.redirect(getHomeUrl());
                    console.info("Joueur connect� " + req.session.username);
                }
            }
        });
    }
};

exports.files = {
    js: {
        route: /js\/start.js/,
        path : __dirname + /../,
        dataType: 'javascript',
        files: [
            //'public/js/libs/require/require.min.js',
            'constantes.js'
        ]
    }
}

exports.admin = function(req, res) {
    var username = "";
    if (req.session) {
        username = req.session.username;
    }
    DAL.RdvList.findAll(function (err, rdv) {
        res.render('admin', { title: 'Administration', rdv: rdv });
    });  
};

(function (exports) {

    "use strict";

    function filterSession(req, res, next) {
        next({
            login: "jgoblet" //req.session.login
        });
    }

    var mongoose = require('mongoose')
      , crudUtils = require('../utils/crudUtils')
      , Rdv = mongoose.model('Rdv');

    exports.init = function (app) {
        crudUtils.initRoutesForModel({
            app: app, 
            model: Rdv,
            prefix: '/admin'
        });
        crudUtils.initRoutesForModel({
            app: app,
            model: Rdv,
            filter: filterSession
        });
    };

}(exports));


exports.addRdv = function (req, res) {
    if (!req.body) return;
    DAL.RdvList.addRdv(req.body, function (id) {
        console.log(id);
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(id);
        return;
    }, function (err) {
        console.log('ereur');
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end(err);
        return;
    });
};
