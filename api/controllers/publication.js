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

    var publication = new Publication();
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
        
        follows_clean.push(req.user.sub);
        //comprobamos si alguno de los usuarios guardados están dentro de la propiedad user de alguno 
        //de los documentos de publicaciones

        //Busacmos dentro del array follows_clean todos los doc cuyo usuario este contenido dentro de
        //la variable follows_clean (esto es con el operador $in), luego con el metodo sort ordenamos
        //las publicaciones de las mas nuevas a las mas viejas y con el populate hacemos que nos dev
        //vuelva los datos completos del usuario que ha creado una publicación, y por ultimo el metodo
        //paginate para hacer la paginacion                                                       //pagina actual
        Publication.find({user : {"$in": follows_clean}}).sort('-created_at').populate('user').paginate(page, itemsPerPage, (err, publications, total) => {
        
            if(err) return res.status(500).send({message: 'Error al devolver las publicaciones'});

            if(!publications) return res.status(404).send({message: 'No hay publicaciones'});

            return res.status(200).send({
                total_items: total,
                pages : Math.ceil(total/itemsPerPage),
                page: page,
                items_Per_Page: itemsPerPage,
                publications
            });
        });
    });

} 

// todas las publicaciones de un único usuario
function getPublicationsUser(req, res) {
    var page = 1;

    if(req.params.page) {
        page = req.params.page;
    }

    var user = req.user.sub;
    if(req.params.user) {
        user = req.params.user;
    }

    var itemsPerPage = 4; //4 elementos por pagina

    Publication.find({user : user}).sort('-created_at').populate('user').paginate(page, itemsPerPage, (err, publications, total) => {
    
        if(err) return res.status(500).send({message: 'Error al devolver las publicaciones'});

        if(!publications) return res.status(404).send({message: 'No hay publicaciones'});

        return res.status(200).send({
            total_items: total,
            pages : Math.ceil(total/itemsPerPage),
            page: page,
            items_Per_Page: itemsPerPage,
            publications
        });
    });
} 


function getPublication(req, res) {
    var publicationId = req.params.id;

    Publication.findById(publicationId, (err, publication) => {
        if(err) return res.status(500).send({message: 'Error al devolver la publicacion'});

        if(!publication) return res.status(404).send({message: 'No existe la publicacion'});

        return res.status(200).send({publication});
    });
}

function deletePublication(req, res) {
    var publicationId = req.params.id;

    //_id es this document id
    Publication.find({'user': req.user.sub, '_id': publicationId}).remove(err => { 
        if(err) return res.status(500).send({message: 'Error al borrar la publicacion'});

        return res.status(200).send({message: 'Publicación eliminada'});
    });
}

function uploadImage(req, res) {
    var publicationId = req.params.id; //recogemos el id por la url del user a modificar
        
    if(req.files) { //si existe un fichero
        var file_path = req.files.image.path; //path del campo image q enviamos por post
        var file_split =  file_path.split('\\');
        var file_name = file_split[2];
        var ext_split = file_name.split('\.'); //cortamos la extension del archivo
        var file_ext = ext_split[1]; //guardamos la extension del fichero

        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gi') {
            
            Publication.findOne({'user': req.user.sub, '_id':publicationId}).exec((err, publication) => {
                if (publication) {
                    //Actualizamos la publicación
                    Publication.findByIdAndUpdate(publicationId, {file: file_name}, {new:true}, (err, publicationUpdated) => {
                        if (err) return res.status(500).send({message: 'Error en la petición'});

                        if (!publicationUpdated) return res.status(404).send({message: 'No se ha podido actualizar el usuario'});

                        return res.status(200).send({publication: publicationUpdated});
                    });
                } else {
                        return removeFilesToUpload(res, file_path, 'No puedes actualizar esta publicación');
                }
            });
            } else {
                return removeFilesToUpload(res, file_path, 'Extension no válida');
            }
            } else {
                return res.status(200).send({message: 'Nose han subido archivos'});
            }
    }

function removeFilesToUpload(res, file_path, message) {
    fs.unlink(file_path, (err) => { //borramos el archivo
        return res.status(200).send({message: message});
    });
}

function getImageFile(req, res) {
    var image_file = req.params.imageFile; //imageFile es el param que recibe por url
    var path_file = './uploads/publications/' + image_file;

    fs.exists(path_file, (exists) => {
        if (exists) {
            res.sendFile(path.resolve(path_file));
        } else {
            res.status(200).send({message: 'No existe la imagen'});
        }
    });
}





module.exports = {
    probando,
    savePublication,
    getPublications,
    getPublication,
    deletePublication,
    uploadImage,
    getImageFile,
    getPublicationsUser
}