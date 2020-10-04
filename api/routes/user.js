'use strict'
//5 configuracion de rutas del controlador usuarios

var express = require('express'); //cargamos el modulo de express
var UserController = require('../controllers/user');

var api = express.Router(); //cargamos el router de express para acceder a los meteodos http

api.get('/home', UserController.home);
api.get('/pruebas', UserController.pruebas);
api.post('/register', UserController.saveUser);

module.exports = api;

