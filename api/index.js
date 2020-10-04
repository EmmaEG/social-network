'use strict' //use strict es una instruccion para nuevas caracteristica de ES6 example funciones de flecha
//1 conexion a mongoDb y finalización del servidor web

var mongoose = require('mongoose'); //nos permite conectarnos con mongodb y trabajar con la db
var app = require('./app');
var port = 3800;

//para conectarnos a mongodb tenems que utlizar las promesas, vamos a hacer la conexion mediante un metodo
//de promesas
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/social-network', { useNewUrlParser:true, useUnifiedTopology: true })
        .then(() => {
            console.log("La conexión a la db se realizó correctamente");
            //finalizo la creacion del servidor
            app.listen(port, () => {
                console.log("Servidor corriendo");
            });
        })
        .catch(err => console.log(err));



//{ useMongoClient: true} de esta manera se conetca como cliente a mongodb
