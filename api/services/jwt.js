'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'secret_key_for_my_social_network_application';

exports.createToken = function(user){
    var payload = {
        sub: user._id,
        name: user.name,
        surname : user.surname,
        nick: user.nick,
        email: user.email,
        role: user.role,
        image: user.image,
        iat: moment().unix(), //fecha de creacion del token
        exp: moment().add(30, 'days').unix //fecha en que expira el token
    };
    return jwt.encode(payload, secret);
};