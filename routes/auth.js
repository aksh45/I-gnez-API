const router = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const isAccountSetup = require("../policies/isAccountSetup");
const {send_mail} = require("../services/MailService");
const {signInObjectValidation} = require('../services/ValidationService');
const {signUpObjectValidation} = require('../services/ValidationService');




router.post('/signin',isAccountSetup,async(req,res)=>{
    var validate = signInObjectValidation(req.body);
    if(validate.message != 'ok')
		return res.status(validate.status).json({message: validate.message});
    var user = await User.findOne({email:req.body.email});
    if(!user){
        return res.status(404).json({message: 'user does not exist '});
    }
    else if (user.is_verified == false)
        return res.status(309).json({message: 'account not verified'});
    var pass_match = await bcrypt.compare(req.body.password, user.password);
    if(pass_match){
        var token = jwt.sign({ user: user._id }, process.env.JWT_KEY,{ expiresIn: '24h' });
        return res.json({message:'success',token:token});
    }
    else{
        return res.json({message: 'Invalid credentials'});
    }
})
router.post('/signup',isAccountSetup,async(req,res)=>{
    var validate = signUpObjectValidation(req.body);
    if(validate.message != 'ok')
		return res.status(validate.status).json({message: validate.message});
    var find_user = await User.findOne({email:req.body.email});
    if(find_user && find_user.is_verified == true){
        return res.status(409).json({message: 'User with this mail already exist'})
    }
    else if(find_user && find_user.is_verified == false ){
        await User.deleteOne({email: req.body.email});
    }
    var password = await bcrypt.hash(req.body.password, 10);
    var user = {
        name: req.body.name,
        email: req.body.email,
        phone_no: req.body.phone_no,
        password: password,
        gender: req.body.gender,
        college: req.body.college,
        college_city: req.body.college_city,
        college_roll_no: req.body.college_roll_no,
    }
    try{
        var create_user_res = await User.create(user);
        var verification_token = jwt.sign({ _id: create_user_res._id }, process.env.JWT_KEY,{ expiresIn: '0.5h' });
        var mssg = `<!DOCTYPE html> <html><head><meta name="viewport" content="width=device-width, initial-scale=1"></head><body><p>Hurray you are only one step away to activate your account, click on the <a href= "${process.env.DOMAIN_NAME}/auth/verifyemail/${verification_token}">link</a> to verify your profile</p><p>Regards<br>Team I-GNEZ</p></body></html>`
        var data = {
            reciever: user.email,
            subject: 'Account Verification Token',
            html: mssg
        }
        var mail_res = await send_mail(data);
        return res.json({message: 'User Created'});
    }
    catch(err){
        return res.json({message: err});
    }
   

})


router.post('/accountsetup',async(req,res)=>{
    var admin_account = await User.findOne({type: 'admin'});
    
    if(! admin_account){
        var validate = signUpObjectValidation(req.body);
        if(validate.message != 'ok')
		    return res.status(validate.status).json({message: validate.message});
        var password = await bcrypt.hash(req.body.password, 10);
        var user = {
            name: req.body.name,
            email: req.body.email,
            phone_no: req.body.phone_no,
            password: password,
            gender: req.body.gender,
            college: req.body.college,
            college_city: req.body.college_city,
            college_roll_no: req.body.college_roll_no,
            type: ['admin']
        }
        try{
            var create_user_res = await User.create(user);
            var verification_token = jwt.sign({ _id: create_user_res._id }, process.env.JWT_KEY,{ expiresIn: '0.5h' });
            var mssg = `<!DOCTYPE html> <html><head><meta name="viewport" content="width=device-width, initial-scale=1"></head><body><p>Hurray you are only one step away to activate your account, click on the <a href= "${process.env.DOMAIN_NAME}/auth/verifyemail/${verification_token}">link</a> to verify your profile</p><p>Regards<br>Team I-GNEZ</p></body></html>`
            var data = {
                reciever: user.email,
                subject: 'Account Verification Token',
                html: mssg
            }
            var mail_res = await send_mail(data);
            return res.json({message: 'Admin Created'});
        }
        catch(err){
            return res.json({message: 'Something went wrong'});
        }

    }
    return res.json({message: 'OOPS!!! you are at wrong url'});
    
});

router.get('/verifyemail/:verify_token',async(req,res)=>{
    const token = req.params.verify_token;
    try
    {
        const user = jwt.verify(token,process.env.JWT_KEY);
        if(!user)
            return res.json({message: 'Invalid'});
        const update_user = await User.findOneAndUpdate({_id: user._id},{is_verified:true});
        if(!update_user)
            return res.json({message: 'Invalid'});
        return res.json({message: 'success'});
    }
    catch(err){
        return res.json({message: 'Invalid'});
    }
    

})


module.exports = router; 
