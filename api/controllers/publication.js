'use strict'

var path = require('path');
var fs = require('fs');
var moment = require('moment');
var mongoosePaginate = require('../libraries/pagination');

var Publcation = require('../models/publication');
var User = require('../models/user');
var Follow = require('../models/follow');

function probando(req, res) {
    res.status(200).send({message: "Hola desde el controlador de publicaciones"});
}

function savePublication(req, res) {
    var params = req.body; //guardamos los datos que nos llegan por el body

    if(!params.text) return res.status(200).send({message: 'Debes enviar un texto'});

    var publication = new Publcation();
    publication.text = params.text;
    publication.file = 'null';
    publication.user = req.user.sub; //guardo el id del user que crea la pub
    publication.created_at = moment().unix();

    publication.save((err, publicationStored) => {
        if(err) return res.status(500).send({message: 'Error al guardar la publicación'});

        if(!publicationStored) return res.status(404).send({message: 'La publicación no se guardó'});

        return res.status(200).send({publication: publicationStored});//devuelvo el objeto publication es una propiedad publication
    });
}



module.exports = {
    probando,
    savePublication
}