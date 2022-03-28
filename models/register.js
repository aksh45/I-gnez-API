const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const registerschema =  mongoose.Schema({
	user:{
		type: [{ type: Schema.Types.ObjectId, ref: 'User' }],
	},
	event:{
		type: [{ type: Schema.Types.ObjectId, ref: 'Event' }],
	},
	team_name:{
		type:String,
		required:true,
		unique:true
	}
});

module.exports = mongoose.model('register',registerschema);
