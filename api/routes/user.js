'use strict'
//5 configuracion de rutas del controlador usuarios

var express = require('express'); //cargamos el modulo de express
var UserController = require('../controllers/user');

var api = express.Router(); //cargamos el router de express para acceder a los meteodos http
var md_auth = require('../middlewares/auth');

//middlewar para subida de archivos
var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './uploads/users'});

api.get('/home', UserController.home);
api.get('/pruebas', md_auth.ensureAuth ,UserController.pruebas);
api.post('/register', UserController.saveUser);
api.post('/login', UserController.loginUser);
api.get('/user/:id', md_auth.ensureAuth, UserController.getUser);
api.get('/users/:page?', md_auth.ensureAuth, UserController.getUsers);
api.get('/counters/:id?', md_auth.ensureAuth, UserController.getCounters);
api.put('/update-user/:id', md_auth.ensureAuth, UserController.updateUser);
api.post('/upload-image-user/:id', [md_auth.ensureAuth, md_upload], UserController.uploadImage);//cuando queremos usar varios middlwares tenemos que pasar un array
api.get('/get-image-user/:imageFile', UserController.getImageFile);


module.exports = api;

