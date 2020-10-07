'use strict'
//4
var bcrypt = require('bcrypt-nodejs');
var mongoosePaginate = require('mongoose-pagination');

var User = require('../models/user');
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

        return res.status(200).send({user});
    });
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

        return res.status(200).send({
            users,
            total,
            pages: Math.ceil(total/itemsPerPage)
        });        
    });
}


//exportamos los metodos como objetos para luego poder acceder al que me interese
module.exports = {
    home,
    pruebas,
    saveUser,
    loginUser,
    getUser,
    getUsers
}

//cuando nos llegan datos por la url usamos params, cuando nos llegan datos por Post or Put usamos body