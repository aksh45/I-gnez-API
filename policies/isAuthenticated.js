const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = function (req,res,next){
	const token =  req.headers.authorization;
	if (!token){
		return res.json({'error':'unauthorized'});
	}
	try{
 		var user_id =  jwt.verify(token,process.env.JWT_KEY);
		User.findOne({_id:user_id.user},(err,user_details)=>{
			if(user_details){
				req.user = user_details;
				req.valid__user = user_id;
				next();
			}
			else{
				return res.status(401).json({'error':'unauthorized'});
			}
		});

		
	}
	catch(err){
		return res.status(401).json({'error':'unauthorized'});
	}
};