const router = require('express').Router();
const users = require('../models/users');
const type2user = require('../models/type2user');
const jwt = require('jsonwebtoken');
router.post('/login',async(req,res)=>{
    if(req.body.email == 'admin@festgndec.com' && req.body.password == 'RandomlyGenerated__0987#' && !(await users.findOne({email:req.body.email,password:req.body.password}))){
            const new_user = new users({
                name:'Admin',
                email:'admin@festgndec.com',
                password:'RandomlyGenerated__0987#'
            });
            try{
                const saved_user = await new_user.save();

               
               }
               catch(err){
                   console.log(err);
                   return res.json({message:'failed'});
               }
               const token = jwt.sign({_id:new_user._id,name:new_user.name,email:new_user.email},process.env.TOKEN_SECRET);
                res.setHeader('authtoken', token);
                return res.json({message:'success'});


    }
    if(await users.findOne({email:req.body.email,password:req.body.password})){
           const new_user = users.findOne({email:req.body.email,password:req.body.password});
           const token = jwt.sign({_id:new_user._id,name:new_user.name,email:new_user.email},process.env.TOKEN_SECRET);
        res.setHeader('authtoken',token)
        return res.json({message:'success'});

    }
    else{
        return res.json({message:'failed'})
    }
});

router.post('/organiserlogin',async(req,res)=>{
    
    const check = await type2user.findOne({'email':req.body.email,'password':req.body.password});
    if(!(check)){
        return res.json({message:'failed'});
    }
    const token = jwt.sign({_id:check._id,email:check.email,event_name:check.event_name},process.env.TOKEN_SECRET);
    res.setHeader('authtoken2',token)
    return res.json({message:'success'});
})

module.exports = router; 
