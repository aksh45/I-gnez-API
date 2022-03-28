const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const event_schema =  mongoose.Schema({
	name:{
		type:String,
		required:true,
        unique:true
	},
    date:{
        type:Date,
        required:true
    },
    min_group_size:{
        type:Number,
        required:true
    },
    max_group_size:{
        type:Number,
        required:true
    },
    event_image:{
        data: Buffer,
        contentType: String
    },
    organisers:{
        type: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        required: true
    }
});

module.exports = mongoose.model('events',event_schema );