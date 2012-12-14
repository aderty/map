var mongoose = require('mongoose')
  , rdv = require('./models/rdv.js');


module.exports = RdvList;


function RdvList(connection) {
}

RdvList.prototype = {
    findRdvByLogin: function (login, cb) {
        rdv.find({ login: login }, function foundRdv(err, items) {
            cb(err, items);
        });
    },
    findAll: function (cb) {
        rdv.find({}, function foundRdv(err, items) {
            cb(err, items);
        });
    },
    addRdv: function (item, success, error) {
        instance = new rdv();
        instance.login = item.login;
        instance.etat = 0;
        instance.date = item.date;
        instance.save(function savedTask(err) {
            if (err) {
                throw err;
            }
            if (success) success(instance._id);
        });
    },
    updateEtat: function (idRdv, etat, success, error) {
            var conditions = { _id: idRdv };
            var updates = { etat: etat };
            rdv.update(conditions, updates, function updatedTask(err) {
                if (err) {
                    throw err;
                }
                if (success) success(err);
            });
    },
    updateDate: function (idRdv, success, error) {
        var conditions = { _id: idRdv };
        var updates = { date: date };
        rdv.update(conditions, updates, function updatedTask(err) {
            if (err) {
                throw err;
            }
            if (success) success(err);
        });
    },
    remove: function (idRdv, success, error) {
        var conditions = { _id: idRdv };
        rdv.remove(conditions, function updatedTask(err) {
            if (err) {
                throw err;
            }
            if (success) success(err);
        });
    }
}