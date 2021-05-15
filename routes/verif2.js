const jwt = require('jsonwebtoken');
module.exports = function (req,res,next){
    if(!(req.headers)){
        
        return res.json({'message':'unauthorized'});
    }
	const token =  req.headers.authtoken2;
	if (!token){
		return res.json({'message':'unauthorized'});
	}
	try{
 		const verified =  jwt.verify(token,process.env.TOKEN_SECRET);
         
		 req.valid__user = verified;
		next();
	}
	catch(err){
	
		res.status(400).json({'message':'unauthorized'});
	}
};