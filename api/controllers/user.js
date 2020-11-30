'use strict'
//4
var bcrypt = require('bcrypt-nodejs');
var mongoosePaginate = require('../libraries/pagination');
var fs = require('fs'); //file system de node para trabajar con archivos
var path = require('path'); //nos permite trabajar con ruta de ficheros


var User = require('../models/user');
var Follow = require('../models/follow');
var Publication = require('../models/publication');
var jwt = require('../services/jwt');

function home(req, res) {
    res.status(200).send({ message: 'Hola mundo desde el servidor de Node Js' });
}

function pruebas(req, res) {
    console.log(req.body);
    res.status(200).send({ message: 'Acción de prueba desde el servidor de Node Js' });
}

function saveUser(req, res) {
    var params = req.body;
    var user = new User();

    if (params.name && params.surname && params.nick && params.email && params.password) {
        user.name = params.name;
        user.surname = params.surname;
        user.nick = params.nick;
        user.email = params.email;
        user.role = 'ROLE_USER';
        user.image = null;

        //usuario duplicado, tenemos que usar el operador logico or que incluye mongodb, para ello
        //genero un array, dentro de este estan las condiciones a evaluar
        User.find({
            $or: [
                { email: user.email.toLowerCase() },
                { nick: user.nick.toLowerCase() }
            ]
        }).exec((err, users) => {
            if (err) return res.status(500).send({ message: 'Error en la petición se usuarios' });

            if (users && users.length >= 1) {
                return res.status(200).send({ message: 'El usuario ya existe' });
            } else {
                //el null es para evitar que siga cifrando ya que x defecto es suficient
                bcrypt.hash(params.password, null, null, (err, hash) => {
                    user.password = hash;

                    user.save((err, userStored) => { //guardamos el user, con el metodo de mongoose. Al param userStored le ponemos poner cualquier nombre
                        if (err) return res.status(500).send({ message: 'Error al guardar el usuario' });
                        if (userStored) {
                            res.status(200).send({ user: userStored });
                        } else {
                            res.status(404).send({ message: 'No se ha registrado el usuario' });
                        }
                    });
                });
            }
        });
    } else {
        res.status(200).send({ message: 'Complete todos los campos del usuario' });
    }
}

function loginUser(req, res) {
    var params = req.body;
    var email = params.email;
    var password = params.password;

    User.findOne({ email: email }, (err, user) => {
        if (err) return res.status(500).send({ message: 'Error en la petición' });

        if (user) {
            bcrypt.compare(password, user.password, (err, check) => {
                if (check) {
                    //devolvemos los datos del usuario
                    if (params.gettoken) {
                        //generamos y devolvemos el token
                        return res.status(200).send({ token: jwt.createToken(user) });
                    } else {
                        //devolvemos datos del usuario
                        user.password = undefined;
                        return res.status(200).send({ user });
                    }
                    } else {
                    return res.status(404).send({ message: 'No se ha podido identificar' });
                }
            });
        } else {
            return res.status(404).send({ message: 'No se ha podido identificar' });
        }
    });
}

function getUser(req, res) {
    var userId = req.params.id;

    User.findById(userId, (err, user) => {
        if (err) return res.status(500).send({message: 'Error en la petición'});

        if (!user) return res.status(404).send({message: 'El usuario no existe'});

        followThisUser(req.user.sub, userId).then((value) => {
            user.password = undefined;
            return res.status(200).send({
                user,
                following: value.following,
                followed: value.followed
            });
        });        
    });
}

//funcion asincrona, con llamadas sincronas dentro.Cuando se ejecute algo se espere a que se consiga el 
//resultado y despues pase a lo siguiente
//await es para que espere a que el find nos devuelva el resultado y lo guarda en cada variable ahí si
//como si fuera sincrono
async function followThisUser(identity_user_id, user_id) {
    var following = await Follow.findOne({ "user": identity_user_id, "followed": user_id }).exec().then((follow) => {
        return follow;
    }).catch((err) => {
        return handleError(err);
    });
 
    var followed = await Follow.findOne({ "user": user_id, "followed": identity_user_id }).exec().then((follow) => {
        return follow;
    }).catch((err) => {
        return handleError(err);
    });
 
    return {
        following: following,
        followed: followed
    }
}


function getUsers(req, res) {
    var identity_user_id = req.user.sub;

    var page = 1;
    if (req.params.page) {
        page = req.params.page;
    }

    var itemsPerPage = 5;

    User.find().sort('_id').paginate(page, itemsPerPage, (err, users, total) => {
        if (err) return res.status(500).send({message: 'Error en la petición'});
        
        if (!users) return res.status(404).send({message: 'No hay usuarios disponibles'});

        followUserIds(identity_user_id).then((value) => {
                        
            return res.status(200).send({
                users,
                users_following: value.following,
                users_follow_me: value.followed,
                total,
                pages: Math.ceil(total/itemsPerPage)
            });   
        });             
    });
}

// el await es para esperar el return_ el resultado que nos devuelve y lo guarde en la varieble
//con select puedo seleccionar que mostrar (con el 0 lo excluyo)
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

function getCounters(req, res) {
    var userId = req.user.sub;

    if(req.params.id) {
        userId = req.params.id;
    }

    getCountFollow(userId).then((value) => {
        return res.status(200).send(value);
    });
}

async function getCountFollow(user_id) {
    var following = await Follow.count({"user": user_id}).exec().then((count) => {
        return count;
        }).catch((err) => {
            return handleError(err);
        });
    
    var followed = await Follow.count({"followed": user_id}).exec().then((count) => {
        return count;
        }).catch((err) => {
            return handleError(err);
        });

    var publications = await Publication.count({"user": user_id}).exec().then((count) => {
        return count;
        }).catch((err) => {
            return handleError(err);
        });

        return {
            following: following,
            followed: followed,
            publications: publications
        }
}

function updateUser(req, res) {
    var userId = req.params.id; //recogemos el id por la url del user a modificar
    var update = req.body; //conseguimos el objeto que recibimos por la req con los atributos a modificar
    
    delete update.password; //borramos la propiedad password para tenerla en un metodo separado

    //verificamos que el propio usuario de su cuenta quiera modificar sus datos
    if (userId != req.user.sub) {
        return res.status(500).send({message: 'No tiene permiso para modificar'});
    }

    User.findOne({
        $or: [
            { email: update.email.toLowerCase() },
            { nick: update.nick.toLowerCase() }
        ]}).exec((err, user) => {
            if(user._id != userId) {
                return res.status(500).send({message: 'Alguno de los datos ya está en uso'}); }
            
            User.findByIdAndUpdate(userId, update, {new:true}, (err, userUpdated) => { //*
                if (err) return res.status(500).send({message: 'Error en la petición'});
        
                if (!userUpdated) return res.status(404).send({message: 'No se ha podido actualizar el usuario'});
        
                return res.status(200).send({user: userUpdated});
            });
        });    
}

function uploadImage(req, res) {
    var userId = req.params.id; //recogemos el id por la url del user a modificar
        
    if(req.files) { //si existe un fichero
        var file_path = req.files.image.path; //path del campo image q enviamos por post
        console.log(file_path);

        var file_split =  file_path.split('\\');
        console.log(file_split);

        var file_name = file_split[2];
        console.log(file_name);

        var ext_split = file_name.split('\.'); //cortamos la extension del archivo
        console.log(ext_split);

        var file_ext = ext_split[1]; //guardamos la extension del fichero
        console.log(file_ext);

        //verificamos que el propio usuario de su cuenta quiera modificar sus datos
        if (userId != req.user.sub) {
            return removeFilesToUpload(res, file_path, 'No tiene permiso para modificar');
        }

        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gi') {
            //Actualizamos el archivo de usuario
            User.findByIdAndUpdate(userId, {image: file_name}, {new:true}, (err, userUpdated) => {
                if (err) return res.status(500).send({message: 'Error en la petición'});

                if (!userUpdated) return res.status(404).send({message: 'No se ha podido actualizar el usuario'});

                return res.status(200).send({user: userUpdated});
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
    var path_file = './uploads/users/' + image_file;

    fs.exists(path_file, (exists) => {
        if (exists) {
            res.sendFile(path.resolve(path_file));
        } else {
            res.status(200).send({message: 'No existe la imagen'});
        }
    });
}


//exportamos los metodos como objetos para luego poder acceder al que me interese
module.exports = {
    home,
    pruebas,
    saveUser,
    loginUser,
    getUser,
    getUsers,
    getCounters,
    updateUser,
    uploadImage,
    getImageFile
}

//cuando nos llegan datos por la url usamos params, cuando nos llegan datos por Post or Put usamos body
//en las req nos llegan params y en las res enviamos la respuesta
//* el new:true es para que mongoose me devuelva el objeto actualizado, sino me devuelve el obj anterior