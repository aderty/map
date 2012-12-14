var mongoose = require('mongoose')
  , user = require('./models/user.js');


module.exports = Users;


function Users(connection) {
}

Users.prototype = {
    findRdvByLogin: function (login, success, error) {
        rdv.find({ login: login }, function foundRdv(err, items) {
            if (success) success(items);
        });
    },
    addUser: function (item, success, error) {
        instance = new rdv();
        instance.login = item.login;
        instance.nom = item.nom;
        instance.prenom = item.prenom;
        instance.save(function savedTask(err) {
            if (err) {
                throw err;
            }
            if (success) success(instance._id);
        });
    },
    update: function (id, item, success, error) {
        var conditions = { _id: id };
        var updates = {
            nom: item.nom,
            prenom: item.prenom,
            email: item.email
        };
        user.update(conditions, updates, function updatedTask(err) {
            if (err) {
                throw err;
            }
            if (success) success(items);
        });
    },
    remove: function (id, success, error) {
        var conditions = { _id: id };
        user.remove(conditions, function updatedTask(err) {
            if (err) {
                throw err;
            }
            if (success) success(items);
        });
    }
}