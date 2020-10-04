'use strict'
//4
var bcrypt = require('bcrypt-nodejs');
var User = require('../models/user');

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
    } else {
        res.status(200).send({ message: 'Complete todos los campos del usuario' });
    }
}

//exportamos los metodos como objetos para luego poder acceder al que me interese
module.exports = {
    home,
    pruebas,
    saveUser
}