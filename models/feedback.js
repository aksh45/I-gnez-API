const mongoose = require('mongoose');
const feedback_schema =  mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    feedback:{
        type:String,
        required:true
    }
    

});

module.exports = mongoose.model('feedback',feedback_schema);