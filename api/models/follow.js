'use strict'

var mongoose = require('mongoose'); //importamos modulo de mongoose
var Schema = mongoose.Schema;

var FollowSchema = Schema({
    user: { type: Schema.ObjectId, ref:'User' },
    followed: { type: Schema.ObjectId, ref:'User' }
});

module.exports = mongoose.model('Follow', FollowSchema);