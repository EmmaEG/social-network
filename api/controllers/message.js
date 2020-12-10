'use strict'

var moment = require('moment');
var mongoosePaginate = require('../libraries/pagination');

var User = require('../models/user');
var Follow = require('../models/follow');
var Message = require('../models/message');
const message = require('../models/message');

function probando(req, res) {
    res.status(200).send({message: 'Hola desde los md'});
}

function saveMessage(req, res) {
    var params = req.body;

    if (!params.text || !params.receiver) {
        return res.status(200).send({message: 'Envia los datos necesarios'});
    }

    var message = new Message();
    message.emitter = req.user.sub;
    message.receiver = params.receiver;
    message.text = params.text;
    message.created_at = moment().unix();
    message.viewed = 'false';

    message.save((err, messageStored) => {
        if (err) return res.status(500).send({message: 'Error en la petición'});
        if (!messageStored) return res.status(404).send({message: 'Error al enviar el mensaje'});

        return res.status(200).send({message: messageStored});
    });
}

//mensajes recibidos
function getReceivedMessages(req, res) {
    var userId = req.user.sub;

    var page = 1;
    if (req.params.page) {
        var page = req.params.page;
    }

    var itemsPerPage = 4;
    // puedo pasar en el populate los campos que quiero recibir
    Message.find({receiver: userId}).sort('-created_at').populate('emitter', 'name surname image nick _id').paginate(page, itemsPerPage, (err, messages, total) => {
        if (err) return res.status(500).send({message: 'Error en la petición'});
        if (!messages) return res.status(404).send({message: 'No hay mensajes'});

        return res.status(200).send({
            total: total,
            pages: Math.ceil(total/itemsPerPage),
            messages
        });
    });
}

//mensajes enviados
function getEmmitMessages(req, res) {
    var userId = req.user.sub;

    var page = 1;
    if (req.params.page) {
        var page = req.params.page;
    }

    var itemsPerPage = 4;
    // puedo pasar en el populate los campos que quiero recibir
    Message.find({emitter: userId}).sort('-created_at').populate('emitter receiver', 'name surname image nick _id').paginate(page, itemsPerPage, (err, messages, total) => {
        if (err) return res.status(500).send({message: 'Error en la petición'});
        if (!messages) return res.status(404).send({message: 'No hay mensajes'});

        return res.status(200).send({
            total: total,
            pages: Math.ceil(total/itemsPerPage),
            messages
        });
    });
}

//mensajes no leidos
function getUnViewedMessages(req, res) {
    var userId = req.user.sub;

    //si reciever is userId and viewed is false, then.....
    Message.count({receiver: userId, viewed: 'false'}).exec((err, count) => {
        if (err) return res.status(500).send({message: 'Error en la petición'});

        return res.status(200).send({'unviewed': count});
    });
}

//marcar como leídos los mensajes
function setViewedMessages(req, res) {
    var userId = req.user.sub; 
    //el parametro viewed: true es la condicion que vamos a cambiar en el obj
    //con el multi=true actualizamos todos los documentos, sino actualiza solo uno
    Message.update({receiver: userId, viewed: 'false'}, {viewed: 'true'}, {"multi":true}, (err, messageUpdated) => {
        if (err) return res.status(500).send({message: 'Error en la petición'});
        
        return res.status(200).send({messages: messageUpdated});
    });
}


module.exports = {
    probando,
    saveMessage,
    getReceivedMessages,
    getEmmitMessages,
    getUnViewedMessages,
    setViewedMessages
}