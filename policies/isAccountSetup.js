const User = require('../models/User');

module.exports = function (req,res,next){
	User.findOne({type: 'admin'},(err,user_details)=>{
		if(user_details){
			next();
		}
		else{
			return res.json({message: 'Please setup the account before using'});
		}
	});
}