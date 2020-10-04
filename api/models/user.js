'use strict'
//3 modelos
//al estar utilizando mongoDb estamos utilizando el ORM mongoose, entonces dedemos crear los modelos
//como se hace en mongoose

var mongoose = require('mongoose'); //importamos modulo de mongoose
var Schema = mongoose.Schema;

var UserSchema = Schema({
    name: String,
    surname: String,
    nick: String,
    email: String,
    password: String,
    role: String,
    image: String
});

module.exports = mongoose.model('User', UserSchema);


