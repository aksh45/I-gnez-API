const joi = require('joi');
const PNF = require('google-libphonenumber').PhoneNumberFormat;
const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();

const registeration_validation = (data) =>{
	const register_schema = joi.object({
		name: joi.string().regex(/^[a-zA-Z ]*$/).max(100).required(),	
		phone_no: joi.string().min(10).max(10).required(),
		email: joi.string().min(6).required().email(),
		gender: joi.string().regex(/^m$|^f$|^o$/).required(),
		college:joi.string().max(100).required(),
		college_city:joi.string().max(100).required(),
		college_roll_no:joi.string().max(100).required(),
		event_name:joi.string().max(100).required(),
		team_name:joi.string().required()
	})
	
	if(phoneUtil.isValidNumberForRegion(phoneUtil.parse(data.phone_no, 'IN'), 'IN') == false){
		return {'error':{'details':[{'message':'Invalid Phone number'}]}};
	}
	
	const error_reg = register_schema.validate(data);
	return error_reg;
	
	
	
}

const feedback_validation = (data) =>{
	const feedback_schema = joi.object({
		email: joi.string().required().email(),
		feedback:joi.string().max(300).required()
	})
	const error_reg = feedback_schema.validate(data);
	return error_reg;
}
const rcheck_validation = (data) =>{
	const rcheck_schema = joi.object({
		email: joi.string().required().email(),
	})
	const error_reg = rcheck_schema.validate(data);
	return error_reg;
}
	
module.exports.registeration_validation = registeration_validation;
module.exports.feedback_validation = feedback_validation;
module.exports.rcheck_validation = rcheck_validation;
