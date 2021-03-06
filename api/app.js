'use strict'
//2 crer el servidor web utilizando express que es el motor de nuestra app a nivel de backend
//xq express y el servidor web nos va a permitir trabajar con el protocolo http, crear rutas, controladores,
//acciones.

var express = require('express');
var bodyParser = require('body-parser');

var app = express(); //hacemos una instancia de express

//cargamos los ficheros de rutas 6
var user_routes = require('./routes/user');
var follow_routes = require('./routes/follow');
var publication_routes = require('./routes/publication');
var message_routes = require('./routes/message');


//middlewares (es un metodo que se ejecuta antes de que entre en accion un controlador)
app.use(bodyParser.urlencoded({extended:false})); //conf necesaria para bodyParser
app.use(bodyParser.json()); //me convierte los datos de una peticion a Obj Json

//cors configuracion de cabecerass http (es un middleware que se genera automaticamente en cada peticion)
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
 
    next();
});



//rutas - sobreescribimos las rutas para que se ejecute el middleware
app.use('/api', user_routes);
app.use('/api', follow_routes);
app.use('/api', publication_routes);
app.use('/api', message_routes);


//exportamos
module.exports = app;