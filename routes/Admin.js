const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const register = require('../models/Register');
const isAuthenticated = require('../policies/isAuthenticated');
const isAdmin = require('../policies/isAdmin');
const User = require('../models/User');
const { nanoid } = require("nanoid");
const isAccountSetup = require("../policies/isAccountSetup");


router.post('/event/create',isAccountSetup,isAuthenticated,isAdmin,async(req,res) =>{
    const check = await Event.findOne({name:req.body.name.toLowerCase()});
    if(check){
        return res.json({message:'Event Already exist'});
    }
    
    var event = new Event({
        name:req.body.name.toLowerCase(),
        date:new Date(req.body.date),
        min_group_size: req.body.min_group_size,
        max_group_size: req.body.max_group_size,
    });
    var organisers = [];
    for (const organiser of req.body.organisers) {
        var user_details = await User.findOne({email: organiser});
        if(user_details && ((user_details.type).includes('organiser') )){
            organisers.push(user_details._id);
        }
        else if(user_details && (user_details.type == 'particpant' || (user_details.type).includes('admin') )){
            var id = user_details._id; 
            user_details.type.push('organiser')
            await User.updateOne({email:organiser},{type: user_details.type});
            organisers.push(id);
        }
        else{
            var user = {
                email: organiser,
                password: nanoid(),
                type: ['organiser']
            }
            const user_details = await User.create(user);
            organisers.push(user_details._id);
        }
    }
    event['organisers'] = organisers
    
    try{
        
        var event_details = await Event.create(event);
        return res.json({message: 'Successfully created an event'});
    }
    catch(err){
            
        return res.json({message:'Something went wrong'});
    }

});

router.get('/events',isAccountSetup,isAuthenticated,isAdmin,async(req,res) =>{
    try {
        var {page = 1 , limit = 10} = req.query; 
        page = parseInt(page);
        limit = Math.min(100,parseInt(limit));
        const skip = limit*(page-1);
        const all_events = await Event.find({}).limit(limit).skip(skip);
        const count = await Event.countDocuments();
        return res.json({events:all_events,totalPages:Math.ceil(count/limit),currentPage: page,count: count});
        
    } 
    catch (err) {
        return res.json({message:'something went wrong'});
    }

});
router.get('/events/particpants',isAccountSetup,isAuthenticated,isAdmin,async(req,res) =>{
    try {
        var {page = 1, limit = 10} = req.query;
        page = parseInt(page);
        limit = Math.min(100,parseInt(limit));
        const skip = limit*(page-1);
        const all_particpants = await register.find({}).skip(skip).limit(limit);
        const count = await register.countDocuments();
        return res.json({message:all_particpants,totalPages:Math.ceil(count/limit),currentPage: page,count: count});
        
      } 
      catch (err) {
        return res.json({message:'something went wrong'});
      }
})
router.get('/event/:event_id/particpants',isAccountSetup,isAuthenticated,isAdmin,async(req,res)=>{
    const specific_event = req.params.event_id;
    try{
        var event_details = await Event.findOne({_id: specific_event});
        if(!event_details){
            return res.status(404).json({message: 'No such event'});
        }
        var {page = 1, limit = 10} = req.query;
        page = parseInt(page);
        limit = Math.min(100,parseInt(limit));
        const skip = limit*(page-1);
        const all_specific_event_registerations = await register.find({event:event_details._id}).skip(skip).limit(limit);
        const count = await register.countDocuments({event:event_details._id});
        return res.json({message:all_specific_event_registerations,totalPages:Math.ceil(count/limit),currentPage: page,count: count});
    }
    catch(err){
        return res.json({message:'Something Went Wrong'});
    }

});
router.get('/organisers',isAccountSetup,isAuthenticated,isAdmin,async(req,res)=>{
    var {page = 1 , limit = 10} = req.query; 
    page = parseInt(page);
    limit = Math.min(100,parseInt(limit));
    const skip = limit*(page-1);
    const list_organisers = await User.find({type: 'organiser'}).limit(limit).skip(skip);
    const count = await User.countDocuments({type: 'organiser'});
    return res.json({organisers:list_organisers,totalPages: Math.ceil(count/limit),currentPage: page,count: count});

})

module.exports = router; 

