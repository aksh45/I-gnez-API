const jwt = require('jsonwebtoken');
module.exports = function (req,res,next){
    if(!(req.headers)){
        
        return res.json({'error':'unauthorized'});
    }
	const token =  req.headers.authtoken;
	if (!token){
		return res.json({'error':'unauthorized'});
	}
	try{
 		const verified =  jwt.verify(token,process.env.TOKEN_SECRET);
         
		 req.valid__user = verified;
		next();
	}
	catch(err){
	
		res.status(400).json({'error':'unauthorized'});
	}
};