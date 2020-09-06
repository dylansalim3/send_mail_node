const http = require('http');
const express = require('express');
const app = express();

var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  }
});




// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

app.post('/note-it-recover-password',(req,res)=>{
    let noteItMailModel = new NoteItMailModel(req.body.email,req.body.secretPassword);


    var mailOptions = {
        from: process.env.EMAIL,
        to: noteItMailModel.email,
        subject: 'Your secret password for Note It',
        text: noteItMailModel.secretPassword,
      };

    transporter.sendMail(mailOptions,(error,info)=>{
        if (error) {
            console.log(error);
            res.statusCode = 500;
            res.end("Email cannot sent");
          } else {
            console.log('Email sent: ' + info.response);
            res.statusCode = 200;
            res.end("Email Sent");
          }
    });
});


app.get('/',(req,res)=>{
    res.end("Welcome to the service")
})

app.listen(3000, '127.0.0.1');
console.log('Node server running on port 3000');