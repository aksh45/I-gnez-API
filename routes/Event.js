const express = require('express');
const router = express.Router();
const Register = require('../models/Register');
const Event = require('../models/Event');
const User = require('../models/User');
const {registeration_validation} = require("../validation");
const nodemailer = require('nodemailer');
const RateLimit = require('express-rate-limit');
const MongoStore = require('rate-limit-mongo');
const isAuthenticated = require('../policies/isAuthenticated');
const { nanoid } = require("nanoid");
const ObjectId = require('mongodb').ObjectId;
const {registerObjectValidation} = require('../services/ValidationService');


require('dotenv/config');
// var limiter = new RateLimit({
//     store: new MongoStore({
// 		uri: process.env.DB_CONNECT,
// 		collectionName:'Registerationlimitrecords',
// 		// should match windowMs
// 		expireTimeMs: 15 * 60 * 1000,
// 		errorHandler: console.error.bind(null, 'rate-limit-mongo')
// 		// see Configuration section for more options and details
//     }),
//     max: 20,
//     // should match expireTimeMs
//     windowMs: 15 * 60 * 1000,
//     message:'Hey Techie ,you have exceeded the maximum limit try again later'
//   });
router.get('/all',async(req,res)=>{
	var {page = 1 , limit = 10} = req.query; 
	page = parseInt(page);
	limit = Math.min(100,parseInt(limit));
	const skip = limit*(page-1);
	const events = await Event.find({}).skip(skip).limit(limit);
	const count = await Event.countDocuments();
	return res.json({events:events,totalPages:Math.ceil(count/limit),currentPage: page,count: count});


});

router.post('/:event_id',isAuthenticated,async(req,res)=>{
	var validate = registerObjectValidation(req.body);
    if(validate.message != 'ok')
		return res.status(validate.status).json({message: validate.message});
	const event_details = await Event.findOne({_id:req.params.event_id});
	if(!(event_details)){
		return res.status(400).json({message:'event does not exist'});
	}
	const registeration = await Register.findOne({user: req.user._id,event: ObjectId(req.params.event_id)});
	if (registeration){
		return res.status(409).json({message:'already registered'});
	}
	if((req.body.team_members).length + 1 > event_details.max_group_size)
		return res.status(400).json({message: `maximum group size for this event is ${event_details.max_group_size}`});
	if((req.body.team_members).length + 1 < event_details.min_group_size)
		return res.status(400).json({message: `minimum group size for this event is ${event_details.min_group_size}`});
	if(event_details.max_group_size != 1 && !req.body.team_name)
		return res.status(400).json({message: 'team name is required for group event'});
	req.body.team_name = req.body.team_name.trim().toLowerCase();
	const check_team_name = await Register.findOne({team_name: req.body.team_name})
	if(check_team_name)
		return res.status(409).json({message: 'this team name is already taken'});
	var user_ids = [];
	req.body.team_members.push(req.user._id);
	for (const user_email of req.body.team_members) {
		var user_details = await User.findOne({email: user_email});
		if(user_details){
			var registered = await Register.findOne({user: user_details._id,event: req.params.event_id});
			if(registered || event_details.organisers.includes(req.user._id.toString())){
				return res.status(409).json({message: `your team member ${user_email} has already registered in this event add another member`});
			}
		}	
	}
	for (const user_email of req.body.team_members) {
		var user_details = await User.findOne({email: user_email});
		if(user_details){
			if(!user_details.type.includes('particpant')){
				var roles = user_details.type;
				roles.push('particpant');
				await User.updateOne({email:user_email},{type: roles});
			}
			user_ids.push(user_details._id);
		}
		else{
			var user = {
                email: user_email,
                password: nanoid(),
                type: ['particpant']
            }
			var user_details = await User.create(user);
            user_ids.push(user_details._id);
		}

	}
	

	const new_entry = new Register({
		user: user_ids,
		event: ObjectId(req.params.event_id),
		team_name:req.body.team_name
	});
	try{
		const saved_user_registeration = await new_entry.save();
		return res.json({'message':'registered successfully'});
 		// try{
		// 	var transporter = nodemailer.createTransport({
		// 		service: 'gmail',
		// 		host: 'smtp.gmail.com',
		// 		port: 465,
		// 		secure: true,
		// 		pool:true,
		// 		auth: {
		// 				user: process.env.mailuser,
		// 				pass: process.env.mailpass
		// 		}
		// 	});
		// 	var smssg =`<p style="color:#FFC100; font-size: 32px;" > Hi  ${saved_user_registeration.name} </p><p 
		// 		style="color:grey; font-size: 16px;" >Thank you for registering in <span style="color:FFC100;" >  ${saved_user_registeration.event_name.toUpperCase()}  </span>. Event will take place on
		// 		<span style="color:FFC100;"> ${check_event.date}</span>. </p> 
		// 		<p><a style="background-color: #FFC100;
		// 		border: none;
		// 		color: white;
		// 		padding: 15px 32px;
		// 		text-align: center;
		// 		text-decoration: none;
		// 		display: inline-block;
		// 		font-size: 16px;
		// 		margin: 4px 2px;
		// 		cursor: pointer;
		// 		-webkit-transition-duration: 0.4s;
		// 		transition-duration: 0.4s;"
		// 		href="https://i-gnez.tech">View Event's Details</a></p><p  style="color:grey; font-size: 10px;" >Any FAQ ? <a style="color:red; font-family:bolder; font-size: 10px;text-decoration: none;"  href="https://i-gnez.tech/contact"> Contact </a></p>`
		// 	var mailOptions = {
		// 		from: {name:'Fest Gndec',address:'festgndec@gmail.com'},
		// 		to: saved_user_registeration.email,
		// 		subject: 'Regards From Team I-GNEz',
		// 		html:smssg 
		// 		//text: " Hi "+ saved_user_registeration.name+"\n\nThank You for registering In our Event " +saved_user_registeration.event_name.toUpperCase()+". We are happy to have you on board,for any query or suggestion please reply to this email or visit to our website"
		// 	};
		// 	transporter.sendMail(mailOptions, function(error, info){
		// 		if (error) {
		// 			return error;
		// 		} 
		// 		else {
					
		// 				return 'Email sent: ' + info.response;
		// 		}
		// 	});
		// }
		// catch(err){
		// 	return err;	
		// }
	
	}
	catch(err){
		
		res.status(400).json({'message':'something went wrong please retry'});
	}
	

});

router.get('/:event_id',async(req,res)=>{
	const event_details = await Event.findOne({_id: req.params.event_id});
	if(event_details)
		return res.json({event:event_details,message: 'success'});
	return res.status(404).json({message:'No such Event'});
});




module.exports = router; 
