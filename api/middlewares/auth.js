'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'secret_key_for_my_social_network_application';

exports.ensureAuth = function(req, res, next) {
    if (!req.headers.authorization) {
        return res.status(403).send({message: 'La peticin no tiene cabecera'});
    }

    var token = req.headers.authorization.replace(/['"]+/g,''); //*

    //decodificamos payload con el objeto que tiene, le paso el token que me llega por header y la key
    try {
        var payload = jwt.decode(token, secret);

        if (payload.exp <= moment().unix()) {
            return res.status(401).send({message: 'El token ha expirado'});
        }
    } catch(ex) {
        return res.status(404).send({message: 'El token no es válido'});
    }
    
    req.user = payload;

    next();

}




//middleware, es un método que se va a ejecutar la acción del controlador que vayamos a ejecutar
//* limpio el token, reemplazo las comillas doble o simples por nada