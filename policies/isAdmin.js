module.exports = function (req,res,next){
	if(req.user.type != 'admin' )
		return res.json({'error':'unauthorized'});
	next();
}