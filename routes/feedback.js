const express = require('express');
const router = express.Router();
const feedback = require('../models/Feedback');
const {feedback_validation} = require("../validation");
const nodemailer = require('nodemailer');
const RateLimit = require('express-rate-limit');
const MongoStore = require('rate-limit-mongo');
const limit = require('../models/Feedback');
require('dotenv/config');
var limiter = new RateLimit({
    store: new MongoStore({
      uri: process.env.DB_CONNECT,
      
      // should match windowMs
      expireTimeMs: 15 * 60 * 1000,
      errorHandler: console.error.bind(null, 'rate-limit-mongo')
      // see Configuration section for more options and details
    }),
    max: 2,
    // should match expireTimeMs
    windowMs: 15 * 60 * 1000,
    message:'Hey Techie ,you have exceeded the maximum limit try again later'
  });
  
router.post('/',limiter,async(req,res)=>{
    const {error} = feedback_validation(req.body);
    if(error)
	  	return res.status(422).json({message:error.details[0].message});
    
    const new_feedback = new feedback({
        email:req.body.email,
        feedback:req.body.feedback
    })
    try{
      const saved_user_feedback = await new_feedback.save();
      return res.json({message:'success'});      
    }
    catch (err){
        res.json({message:'Something went wrong'});
    }

});

module.exports = router; 
