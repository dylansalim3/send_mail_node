const nodemailer = require("nodemailer");
const env = process.env;
const {google} = require('googleapis');

exports.sendRestoreSecretPasswordEmail = (req, res) => {
    const email = req.body.email;
    const secretPassword = req.body.secretPassword;
    const emailSubject = "Reset Note It Password";

    const emailBody = `Your Note It app secret password is : ${secretPassword}`;

    sendEmail(email, emailSubject, emailBody, res);
}

exports.sendEmail = (req, res) => {
    const email = req.body.email;
    const emailSubject = req.body.emailSubject;
    const emailBody = req.body.emailBody;

    console.log(`${email} ${emailSubject} ${emailBody}`);
    console.log(req.method);
    if (req.method.toUpperCase() === "OPTIONS"){


        // Echo back the Origin (calling domain) so that the
        // client is granted access to make subsequent requests
        // to the API.
        res.writeHead(
            "204",
            "No Content",
            {
                "access-control-allow-origin": '*',
                "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
                "access-control-allow-headers": "content-type, accept",
                "access-control-max-age": 10, // Seconds.
                "content-length": 0
            }
        );

        // End the response - we're not sending back any content.
        return( res.end() );
    }

    sendEmail(email, emailSubject, emailBody, res);
}

function sendEmail(receiverEmail, emailSubject, emailBody, res) {
    const emailService = env.email_service;
    const senderEmail = env.sender_email;
    const clientId = env.client_id;
    const clientSecret = env.client_secret;
    const refreshToken = env.refresh_token;
    const OAuth2 = google.auth.OAuth2;

    //client_id and client_secret
    const myOAuth2Client = new OAuth2(
        clientId,
        clientSecret
    );

    myOAuth2Client.setCredentials({refresh_token: refreshToken});

    const myAccessToken = myOAuth2Client.getAccessToken()


    const transporter = nodemailer.createTransport({
        service: emailService,
        auth: {
            type: "OAuth2",
            user: senderEmail, //your gmail account you used to set the project up in google cloud console"
            clientId: clientId,
            clientSecret: clientSecret,
            refreshToken: refreshToken,
            accessToken: myAccessToken //access token variable we defined earlier
        }
    });

    const mailOptions = {
        from: senderEmail,
        to: receiverEmail,
        subject: emailSubject,
        html: emailBody,
    };

//     header('Access-Control-Allow-Origin: *');
// header('Access-Control-Allow-Methods: POST');
// header('Access-Control-Max-Age: 1000');



    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            res.statusCode = 500;
            res.json({success: false, message: `Email failed to sent : ${error.toString()}`});
        } else {
            console.log('Email sent: ' + info.response);
            res.statusCode = 200;
            res.json({success: true, message: "Email Sent"});
        }
    });
}
