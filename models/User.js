const mongoose = require('mongoose');

const authschema =  mongoose.Schema({
	name:{
        type:String,
    },
    email:{
        type:String,
        required:true,
        distinct: true
    },
    type:{
      type: [String],
      default: ['particpant']  
    },
    phone_no:{
        type:String,
        // required:true
    },
    password:{
        type:String,
        required:true
    },
    gender:{
        type:String,
        // required:true
    },
    college:{
		type:String,
		// required:true
	},
    college_city:{
        type:String,
        // required:true
    },
    college_roll_no:{
		type:String,
		// required:true
	},
    is_verified:{
        type: Boolean,
        default: false
    }


});

module.exports = mongoose.model('users',authschema);