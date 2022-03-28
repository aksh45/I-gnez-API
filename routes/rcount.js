const express = require('express');
const router = express.Router();
const register = require('../models/Register');
const events = require('../models/Event');
const nodemailer = require('nodemailer');
const {rcheck_validation} = require('../validation');
const RateLimit = require('express-rate-limit');
const MongoStore = require('rate-limit-mongo');
require('dotenv/config');
var limiter = new RateLimit({
    store: new MongoStore({
      uri: process.env.DB_CONNECT,
      collectionName:'rcountlimitrecords',
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
    const {error} = rcheck_validation(req.body);
    if(error){
        return res.status(422).json({message:error.details[0].message});
    }
    const check_register_events =  await register.find({email:req.body.email});
    var mssg = ''
   
    if(!(check_register_events.length)){
		return res.json({message:'No event registered'});
        mssg = '<!DOCTYPE html> \
		<html>\
		<head>\
		<meta name="viewport" content="width=device-width, initial-scale=1">\
		</head><body><p>Oopss!! you are not registered in any event visit our website to register in an event and be the part of mega fest</p></body></html>';
        
    }
    if(check_register_events.length>0){
        
		mssg += '<!DOCTYPE html> \
		<html>\
		<head>\
		<meta name="viewport" content="width=device-width, initial-scale=1">\
		<style>\
		table {\
		  border-collapse: collapse;\
		  border-spacing: 0;\
		  width: 100%;\
		  border: 1px solid #ddd;\
		}\
		\
		th, td { \
		  text-align: left;\
		  padding: 8px;\
		}\
		\
		tr:nth-child(even){background-color: #f2f2f2}\
		</style>\
		</head>\
		<body>\
		<h3>Hi</h3>\
		<p> Following is the list of events in which you are registered</p>\
		\
		\
		\
		<div style="overflow-x:auto;">\
		  <table>\
			<tr>\
			  <th>Event Name</th>\
			  <th>Event Date</th>\
			  <th>Event Time</th>\
			  \
			</tr>'
        for (var z =0;z<check_register_events.length;z++){
			mssg += '<tr>'
            mssg += ('<td>' +check_register_events[z].event_name.toUpperCase()+'</td>');
            
            var tmpo = (await events.findOne({name:check_register_events[z].event_name}));
            mssg += ('<td>'+tmpo.date+'</td>');
			mssg += ('<td>'+tmpo.time+'</td>');
            mssg += '</tr>';
        }
        mssg += '</table>';
		mssg += '</div>';
		mssg += '</body>';
		mssg += '</html>';
       
    }
    res.json({message:'success'});
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

		var mailOptions = {
  			from: {name:'Fest Gndec',address:'festgndec@gmail.com'},
  			to: req.body.email,
  			subject: 'Registered Event List',
  			html: mssg
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
});

module.exports = router; 