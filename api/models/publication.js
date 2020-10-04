'use strict'

var mongoose = require('mongoose'); //importamos modulo de mongoose
var Schema = mongoose.Schema;

var PublicationSchema = Schema({
    text: String,
    file: String,
    created_at: String,
    user: { type: Schema.ObjectId, ref:'User' } //*
});

module.exports = mongoose.model('Publication', PublicationSchema);

//* va a ser un dato de tipo ObjectId haciendo referencia al modelo user, es decir que vamos a guardar
// un ObjectId de otro documento y que haga referencia a la entidad user de forma que contenga el document
//del usuario que ha creado esta publicación