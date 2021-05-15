const mongoose = require('mongoose');
const type2user_schema =  mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    event_name:{
        type:String,
        required:true
    }
});

module.exports = mongoose.model('type2user', type2user_schema);