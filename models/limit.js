const mongoose = require('mongoose');
const limit_schema =  mongoose.Schema({});

module.exports = mongoose.model('limit',limit_schema);