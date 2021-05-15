const express = require('express');
const router = express.Router();
const register = require('../models/register');
const events = require('../models/events');
const {registeration_validation} = require("../validation");
const nodemailer = require('nodemailer');
const RateLimit = require('express-rate-limit');
const MongoStore = require('rate-limit-mongo');
require('dotenv/config');
var limiter = new RateLimit({
    store: new MongoStore({
      uri: process.env.DB_CONNECT,
      collectionName:'Registerationlimitrecords',
      // should match windowMs
      expireTimeMs: 15 * 60 * 1000,
      errorHandler: console.error.bind(null, 'rate-limit-mongo')
      // see Configuration section for more options and details
    }),
    max: 20,
    // should match expireTimeMs
    windowMs: 15 * 60 * 1000,
    message:'Hey Techie ,you have exceeded the maximum limit try again later'
  });

router.post('/',limiter,async(req,res)=>{
	const {error} = registeration_validation(req.body);
	
	if(error){
		return res.status(422).json({message:error.details[0].message});
	}
	const check_register = await register.findOne({email:req.body.email,event_name:req.body.event_name});
	if (check_register){
		return res.status(409).json({message:'already registered'});
	}
	const check_event = await events.findOne({'name':req.body.event_name.toLowerCase()});
	if(!(check_event)){
		return res.status(400).json({message:'event does not exist'});
	}
	const new_entry = new register({
		name:req.body.name,
		email:req.body.email,
		phone_no:req.body.phone_no,
		gender:req.body.gender,
		college:req.body.college,
		college_city:req.body.college_city,
		college_roll_no:req.body.college_roll_no,
		event_name:req.body.event_name.toLowerCase(),
		team_name:req.body.team_name
	});
	try{
	 const saved_user_registeration = await new_entry.save();
		const send_data = "Created User Successfully";
		res.json({'message':'registered successfully'});
 		try{
		var transporter = nodemailer.createTransport({
 			 service: 'gmail',
			host: 'smtp.gmail.com',
			port: 465,
			secure: true,
			pool:true,
  			auth: {
    				user: process.env.mailuser,
    				pass: process.env.mailpass
  			}
		});
		var smssg =`<p style="color:#FFC100; font-size: 32px;" > Hi  ${saved_user_registeration.name} </p><p 
		style="color:grey; font-size: 16px;" >Thank you for registering in <span style="color:FFC100;" >  ${saved_user_registeration.event_name.toUpperCase()}  </span>. Event will take place on
		<span style="color:FFC100;"> ${check_event.date}</span>. </p> 
		   <p><a style="background-color: #FFC100;
		   border: none;
		   color: white;
		   padding: 15px 32px;
		   text-align: center;
		   text-decoration: none;
		   display: inline-block;
		   font-size: 16px;
		   margin: 4px 2px;
		   cursor: pointer;
		   -webkit-transition-duration: 0.4s;
		   transition-duration: 0.4s;"
		   href="https://i-gnez.tech">View Event's Details</a></p><p  style="color:grey; font-size: 10px;" >Any FAQ ? <a style="color:red; font-family:bolder; font-size: 10px;text-decoration: none;"  href="https://i-gnez.tech/contact"> Contact </a></p>`
		var mailOptions = {
  			from: {name:'Fest Gndec',address:'festgndec@gmail.com'},
  			to: saved_user_registeration.email,
  			subject: 'Regards From Team I-GNEz',
			html:smssg 
  			//text: " Hi "+ saved_user_registeration.name+"\n\nThank You for registering In our Event " +saved_user_registeration.event_name.toUpperCase()+". We are happy to have you on board,for any query or suggestion please reply to this email or visit to our website"
		};
		transporter.sendMail(mailOptions, function(error, info){
  			if (error) {
   				 return error;
  			} 
			else {
				
    				return 'Email sent: ' + info.response;
  			}
		});
		}
		catch(err){
			return err;	
		}
	
	}
	catch(err){
		
		res.status(400).json({'message':'something went wrong please retry'});
	}
	

});


module.exports = router; 
