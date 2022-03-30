const express = require('express');
const router = express.Router();
const events = require('../models/Event');
const register = require('../models/Register');
const {send_mail} = require('../services/MailService');
const verif = require('../policies/isAuthenticated');
require('dotenv').config();

function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }
   

router.post('/',verif,async(req,res)=>{
    var arr;
    if(req.body.reciever == 'all'){
        register.distinct('email',function (err, items) {
             arr = items;
            if(err){
                return res.json({message:'error'});
            }
        });
        
        res.json({message:'success'});
        
        for(var i =0;i<arr.length;i++){
            var details_all = await register.findOne({email:arr[i]});
            const name_particpant = details_all['name'];
            await sleep(1000);
            await send_mail({reciever:details_all['email'],subject:req.body.subject,text:'Hi '+ name_particpant +'\n'+req.body.text});
        }

        
    }
    else{
        
        const details_specific = await register.find({event_name:req.body.reciever});
        res.json({message:'success'})
        for(var i=0;i<details_specific.length;i++){
            const name_particpant = details_specific[i]['name'];
            await sleep(1000);
            await send_mail({reciever:details_specific[i]['email'],subject:req.body.subject,text:'Hi '+ name_particpant +'\n'+req.body.text});
        }
        
    
        
    }
});

module.exports = router; 