const express =  require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const event = require('./routes/Event');
const admin = require('./routes/Admin');
const feedback = require('./routes/feedback');
const authroute = require('./routes/Auth');
const rcount = require('./routes/rcount');
const sendmail = require('./routes/sendmail');
require('dotenv/config');

const bodyparser = require('body-parser');
app.use(cors());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use('/event',event);
app.use('/sendmail',sendmail);
app.use('/rcount',rcount);
app.use('/admin',admin);
app.use('/feedback',feedback);
app.use('/auth',authroute);
app.get('*',function(req, res){
  res.status(400).send('Sorry this Page does not excist');
});

mongoose.connect(process.env.DB_CONNECT,{ useNewUrlParser: true,useUnifiedTopology: true },() =>{
});

app.listen(process.env.PORT || 3000);

