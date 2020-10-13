'use strict'

var mongoosePaginate = require('../libraries/pagination');

var User = require('../models/user');
var Follow = require('../models/follow');

function saveFollow(req, res) {
    var params = req.body; //recogemos los parametros de la peticion

    var follow = new Follow(); //creamos el objeto para setear las propiedades
    follow.user = req.user.sub; //* guardamos el usuario identificado
    follow.followed = params.followed; //guardamos el usuario que seguimos

    follow.save((err, followStored) => {
        if (err) return res.status(500).send({message: 'Error al guardar el seguimiento'});
        
        if (!followStored) return res.status(404).send({message: 'El seguimiento no se guardó'});
        
        return res.status(200).send({follow:followStored});
    });

}

function deleteFollow(req, res) {
    var userId = req.user.sub;
    var followId = req.params.id; //el usuario que estamos siguiendo

    Follow.find({'user': userId, 'followed':followId}).remove(err => {
        if (err) return res.status(500).send({message: 'Error al dejar de seguir'});

        return res.status(200).send({message: 'El follow se ha eliminado'});
    });
}

function getFollowingUsers(req, res) {
    var userId = req.user.sub; //usuario logueado
    // -
    if (req.params.id) {
        userId = req.params.id;
    }

    var page = 1; //por defecto la pagina sea 1 

    //si nos llega una pagina por la url
    if (req.params.page) {
        page = req.params.page;
    } else {
        page = req.params.id;
    }

    var itemsPerPage = 4; 

    //buscamos los objetos que este siguiendo el usuario logueado
    Follow.find({user: userId}).populate({path: 'followed'}).paginate(page, itemsPerPage, (err, follows, total) => {
        if (err) return res.status(500).send({message: 'Error en el servidor'});

        if (!follows) return res.status(404).send({message: 'No sigues a usuarios'});

        return res.status(200).send({
            total: total,
            pages: Math.ceil(total/itemsPerPage), //ceil es para redondear
            follows
        });
    });
}



module.exports = {
    saveFollow,
    deleteFollow,
    getFollowingUsers
}

// * en la apropiedad user del objeto req adjunté a la hora de hacerr la autenticación un objeto con toodo
// el usuario que está logueado (en el middleware de autenticacion) podemos ver que al final seteamos el
// objeto user en el payload que decodifica el usuario y asíi guardo el usuario identificado

// - tenemos que comprobar si nos llega un parametro por la url el usuario porque en el caso que nos llegue
// un id de usuario ese va a ser prioritario y vamos a utilizar ese ususario para listar a los que sigue
// pero en el caso de que no nos llegue nada vamos a utilizar el userId de nuestro usuario identificado