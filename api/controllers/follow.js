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

        followUserIds(req.user.sub).then((value) => {    
            return res.status(200).send({
                total: total,
                pages: Math.ceil(total/itemsPerPage), //ceil es para redondear
                follows,
                users_following: value.following,
                users_follow_me: value.followed,
            });
        });
    });
}

async function followUserIds(user_id) {
    //usuarios seguidos
    var following = await Follow.find({"user": user_id}).select({'_id':0, '__v':0, 'user':0}).exec().then((follows) => {
        return follows;
    }).catch((err) => {
        return handleError(err);
    });

    //usuarios que nos siguen
    var followed = await Follow.find({"followed": user_id}).select({'_id':0, '__v':0, 'followed':0}).exec().then((follows) => {
        return follows;
    }).catch((err) => {
        return handleError(err);
    });

        //procesar following ids
        var following_clean = [];

        following.forEach((follow) => {
            following_clean.push(follow.followed); //consigo un array limpio con ids
        });

        //procesar followed ids
        var followed_clean = [];

        followed.forEach((follow) => {
            followed_clean.push(follow.user); //consigo un array limpio con ids
        });

        return {
            following: following_clean,
            followed: followed_clean
        }
}

function getFollowedUsers(req, res) {
    var userId = req.user.sub; //usuario logueado

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

    //buscamos los objetos que esten siguiendo al usuario logueado
    Follow.find({followed: userId}).populate('user').paginate(page, itemsPerPage, (err, follows, total) => {
        if (err) return res.status(500).send({message: 'Error en el servidor'});

        if (!follows) return res.status(404).send({message: 'No te siguen usuarios'});

        followUserIds(req.user.sub).then((value) => {    
            return res.status(200).send({
                total: total,
                pages: Math.ceil(total/itemsPerPage), //ceil es para redondear
                follows,
                users_following: value.following,
                users_follow_me: value.followed,
            });
        });
    });
}

//listado de usuarios no paginados
function getMyFollows(req, res) {
    var userId = req.user.sub;

    var find = Follow.find({user: userId});

    if(req.params.followed) {
        find = Follow.find({followed: userId});
    }

    find.populate('user followed').exec((err, follows) => {
        if (err) return res.status(500).send({message: 'Error en el servidor'});

        if (!follows) return res.status(404).send({message: 'No sigues a ningun usuario'});

        return res.status(200).send({follows});
    });
}


module.exports = {
    saveFollow,
    deleteFollow,
    getFollowingUsers,
    getFollowedUsers,
    getMyFollows
}

// * en la apropiedad user del objeto req adjunté a la hora de hacerr la autenticación un objeto con toodo
// el usuario que está logueado (en el middleware de autenticacion) podemos ver que al final seteamos el
// objeto user en el payload que decodifica el usuario y asíi guardo el usuario identificado

// - tenemos que comprobar si nos llega un parametro por la url el usuario porque en el caso que nos llegue
// un id de usuario ese va a ser prioritario y vamos a utilizar ese ususario para listar a los que sigue
// pero en el caso de que no nos llegue nada vamos a utilizar el userId de nuestro usuario identificado