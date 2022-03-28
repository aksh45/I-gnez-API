const nodemailer = require('nodemailer');
require('dotenv').config();


const send_mail = async(data) =>{

      
    try{
        var transporter = nodemailer.createTransport({
			service: 'gmail',
		  host: 'smtp.gmail.com',
		  port: 465,
		  secure: true,
		  pool:true,
			auth: {
				  user: process.env.MAIL_USER,
				  pass: process.env.MAIL_PASS
			}
	  });
        
        var mailOptions = {
              from: {name: process.env.MAIL_USER_NAME,address: process.env.MAIL_USER},
              to: data.reciever,
              subject: data.subject
        };
		if(data.html){
			mailOptions.html = data.html
		}
		else if(data.text){
			mailOptions.text = data.text
		}
        
      
        transporter.sendMail(mailOptions, function(error, info){
              if (error) {
                    console.log(error);
                    return {message:'error'};
              } 
            else {
                  
                
                    return {message:'success'};
              }
        });
        
        }
        catch(err){
            return {message:'error'};	
        }
}

module.exports.send_mail = send_mail;

