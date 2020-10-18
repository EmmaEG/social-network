'use strict'

var mongoose = require('mongoose'); //importamos modulo de mongoose
var Schema = mongoose.Schema;

var MessageSchema = Schema({
    text: String,
    viewed: String, //guardaremos visto o no visto (true or false)
    created_at: String,
    emitter: { type: Schema.ObjectId, ref:'User' }, //guardamos el id usuario que envía el msj
    receiver: { type: Schema.ObjectId, ref:'User' } //guardamos el id del usuario que recibe el msj
});

module.exports = mongoose.model('Message', MessageSchema);