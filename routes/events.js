const express = require('express');
const router = express.Router();
const events = require('../models/events');
const register = require('../models/register');
const nodemailer = require('nodemailer');
const type2user = require('../models/type2user');
const verif2 = require('./verif2');
const verif = require('./verif');


router.post('/create',verif,async(req,res) =>{
    const check = await events.findOne({name:req.body.name.toLowerCase()});
    if(check){
        return res.json({message:'Event Already exist'});
    }
    
    const event = new events({
        name:req.body.name.toLowerCase(),
        date:req.body.date,
        time:req.body.time,
        group_members:req.body.group_members
    });
    const user = new type2user({
        email:req.body.name.toLowerCase()+'@festgndec.com',
        password:'Randomforest123',
        event_name:req.body.name.toLowerCase()
    });
    try{
        user.save();
    }
    catch(err){
        console.log(err);
    }
    try{
        
        event.save()
        .then(data =>{
          return res.json({message:"success"});
        });
        }
        catch(err){
            
            return res.json({message:err});
        }

});

router.get('/',verif,async(req,res) =>{
    try {
        const all_events = await events.find({});
        return res.json({message:all_events});
        
      } 
      catch (err) {
        return res.json({message:'something went wrong'});
      }

});
router.get('/particpants',verif,async(req,res) =>{
    try {
        const all_particpants = await register.find({});
        return res.json({message:all_particpants});
        
      } 
      catch (err) {
        return res.json({message:'something went wrong'});
      }
})
router.post('/specific',verif,async(req,res)=>{
    const specific_event = req.body.event_name.toLowerCase();
    try{
        const all_specific_event_registerations = await register.find({event_name:specific_event});
        return res.json({message:all_specific_event_registerations});
    }
    catch(err){
        return res.json({message:'Something Went Wrong'});
    }

});
router.get('/organiserslist',verif2,async(req,res)=>{
    const list_particpants = await register.find({event_name:req.valid__user.event_name});
    return res.json({message:list_particpants});

})

module.exports = router; 

