'use strict'

var express = require('express'); //cargamos el modulo de express
var FollowController = require('../controllers/follow');
var api = express.Router(); //cargamos el router de express para acceder a los meteodos http
var md_auth = require('../middlewares/auth');

api.post('/follow', md_auth.ensureAuth, FollowController.saveFollow);

module.exports = api;