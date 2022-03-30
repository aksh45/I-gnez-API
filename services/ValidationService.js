const isValidEmail = (email)=>{
	return email.match(
		/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
	);	
}
const isValidPassword = (password)=>{
	return password.match(
		/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/
	);
}
const isValidName = (name)=>{
	return name.match(
		/^[a-zA-Z]{4,}(?: [a-zA-Z]+)?(?: [a-zA-Z]+)?$/
	)
}
const isValidPhoneNo = (phone_no)=>{
	return phone_no.match(
		/^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/
	)
}

const isValidGender = (gender)=>{
	return gender.match(
		/[mfo]{1}/
	)
}

const isValidCity = (city)=>{
	return city.match(
		/^[a-zA-Z',.\s-]{1,25}$/
	)
}

const isValidCollege = (college)=>{
	return college.match(
		/^[A-Za-z0-9 ]{2,100}/
	)
}

const isValidRollNo = (rollno)=>{
	return rollno.match(
		/^[A-Za-z0-9]{2,100}/
	)
}
const isValidTeamName = (team_name)=>{
	return team_name.match(
		/^[a-z_]{2,100}/
	)
}
const isValidTeamMembers = (team_members)=>{
	if(!Array.isArray(team_members))
		return false;
	for(const team_member_email of team_members){
		if(!isValidEmail(team_member_email))
			return false;
	}
	return true;
}
const signInObjectValidation = (data)=>{
	if(!data.email || !data.password){
		return {message: 'required fields are missing',status: 400}
	}
	if(!isValidEmail(data.email)){
		return {message: 'invalid email id', status: 422}
	}
	if(!isValidPassword(data.password)){
		return {message: 'invalid password', status: 422}
	}
	return {message: 'ok'}
}

const signUpObjectValidation = (data)=>{
	if(!data.email || !data.password || !data.gender || !data.phone_no  || !data.college || !data.college_city || !data.college_roll_no)
		return {message: 'required fields are missing',status: 400}
	if(!isValidEmail(data.email))
		return {message: 'invalid email', status: 422}
	if(!isValidPassword(data.password))
		return {message: 'invalid password', status: 422}
	if(!isValidGender(data.gender))
		return {message: 'invalid value for gender', status: 422}
	if(!isValidPhoneNo(data.phone_no))
		return {message: 'invalid phone number', status: 422}
	if(!isValidCollege(data.college))
		return {message: 'invalid college name', status: 422}
	if(!isValidCity(data.college_city))
		return {message: 'invalid city', status: 422}
	if(!isValidRollNo(data.college_roll_no))
		return {message: 'invalid college roll number', status: 422}
	return {message: 'ok'}
}

const registerObjectValidation = (data)=>{
	data.team_name = data.team_name.trim().toLowerCase();
	if(data.team_name && !isValidTeamName(data.team_name)){
		return {message: 'Invalid team name only alphabets,numbers and _ are allowed in team name',status: 422};
	}
	if(data.team_members && !isValidTeamMembers(data.team_members)){
		return {message: 'One of the team member email is invalid',status: 422};
	}
	return {message: 'ok'}
}

module.exports.signInObjectValidation = signInObjectValidation;
module.exports.signUpObjectValidation = signUpObjectValidation;
module.exports.registerObjectValidation = registerObjectValidation;