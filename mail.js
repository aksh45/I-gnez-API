const nodemailer = require('nodemailer');
require('dotenv').config();


const send_mail = async(data) =>{

      
    try{
        
        
        var mailOptions = {
              from: {name:'I-GNEz',address:'ignez@gndec.ac.in'},
              to: data.reciever,
              subject: data.subject,
              text: data.text,
              
        };
        
      
        data.transporter.sendMail(mailOptions, function(error, info){
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

