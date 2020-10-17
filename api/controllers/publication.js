'use strict'

var path = require('path');
var fs = require('fs');
var moment = require('moment');
var mongoosePaginate = require('../libraries/pagination');

var Publication = require('../models/publication');
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

//buscamos los ids de los usuarios que sigo y todas sus publicaciones para listarlas
function getPublications(req, res) {
    var page = 1;

    if(req.params.page) {
        page = req.params.page;
    }

    var itemsPerPage = 4; //4 elementos por pagina

    //buscamos los usuarios que seguimos
    //populate para sustituir el id del usuario por el objeto completo que hace referencia en la coleccion
    //de documentos de usuario
    Follow.find({user: req.user.sub}).populate('followed').exec((err, follows) => {
        if(err) return res.status(500).send({message: 'Error al devolver el seguimiento'});

        //Array de los id (limpios) que estamos siguiendo
        var follows_clean = [];

        //metemos los usuarios dentro de un array limpio
        //por cada iteracion creamos un objeto que se llame follow (lo pasamos en el forEach)
        follows.forEach((follow) => {
            follows_clean.push(follow.followed);
        });
        
        //comprobamos si alguno de los usuarios guardados están dentro de la propiedad user de alguno 
        //de los documentos de publicaciones

        //Busacmos dentro del array follows_clean todos los doc cuyo usuario este contenido dentro de
        //la variable follows_clean (esto es con el operador $in), luego con el metodo sort ordenamos
        //las publicaciones de las mas nuevas a las mas viejas y con el populate hacemos que nos dev
        //vuelva los datos completos del usuario que ha creado una publicación, y por ultimo el metodo
        //paginate para hacer la paginacion                                                       //pagina actual
        Publication.find({user : {"$in": follows_clean}}).sort('crated_at').populate('user').paginate(page, itemsPerPage, (err, publications, total) => {
        
            if(err) return res.status(500).send({message: 'Error al devolver las publicaciones'});

            if(!publications) return res.status(404).send({message: 'No hay publicaciones'});

            return res.status(200).send({
                total_items: total,
                pages : Math.ceil(total/itemsPerPage),
                page: page,
                publications                
            });
        });
    });

} 

function getPublication(req, res) {
    var publicationId = req.params.id;

    Publication.findById(publicationId, (err, publication) => {
        if(err) return res.status(500).send({message: 'Error al devolver la publicacion'});

        if(!publication) return res.status(404).send({message: 'No hay publicaciones'});

        return res.status(200).send({publication});
    });
}



module.exports = {
    probando,
    savePublication,
    getPublications,
    getPublication
}