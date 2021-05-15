const mongoose = require('mongoose');
const event_schema =  mongoose.Schema({
	name:{
		type:String,
		required:true
	},
    date:{
        type:String,
        required:true
    },
    time:{
        type:String,
        required:true

    },
    group_members:{
        type:Number,
        required:true
    }
});

module.exports = mongoose.model('events',event_schema );