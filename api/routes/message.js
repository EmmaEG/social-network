'use strict'

var express = require('express'); //cargamos el modulo de express
var MessageControler = require('../controllers/message');
var api = express.Router(); //cargamos el router de express para acceder a los meteodos http
var md_auth = require('../middlewares/auth'); //middleware de autenticación

api.get('/probando-md', md_auth.ensureAuth, MessageControler.probando);
api.post('/message', md_auth.ensureAuth, MessageControler.saveMessage);
api.get('/my-messages/:page?', md_auth.ensureAuth, MessageControler.getReceivedMessages);
api.get('/messages/:page?', md_auth.ensureAuth, MessageControler.getEmmitMessages);



module.exports = api;
//ensureAuth controla los tokens
