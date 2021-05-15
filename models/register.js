const mongoose = require('mongoose');
const registerschema =  mongoose.Schema({
	name:{
		type:String,
		required:true
	},
	email:{
		type:String,
		required:true
	},
	phone_no:{
		type:String,
		required:true
	},
	gender:{
		type:String,
		required:true
	},
	college:{
		type:String,
		required:true
	},
	college_city:{
		type:String,
		required:true
	},
	college_roll_no:{
		type:String,
		required:true
	},
	event_name:{
		type:String,
		required:true
	},
	team_name:{
		type:String,
		required:true
	}
});

module.exports = mongoose.model('register',registerschema);
