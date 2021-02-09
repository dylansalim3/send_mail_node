const nodemailer = require("nodemailer");
const env = process.env;
const { google } = require('googleapis');

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

    if (req.method.toUpperCase() === "OPTIONS") {


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
        return (res.end());
    }

    sendEmail(email, emailSubject, emailBody, res);
}

exports.sendPortfolioEmail = (req, res) => {
    const { receiverEmail, senderName, senderSubject, senderEmail, senderMessage, portfolioTitle } = req.body;

    if (req.method.toUpperCase() === "OPTIONS") {


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
        return (res.end());
    }

    const { emailSubject, emailBody } = buildPortfolioEmailContent(portfolioTitle, senderName, senderSubject, senderEmail, senderMessage);


    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);

    sendEmail(receiverEmail, emailSubject, emailBody, res);
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

    myOAuth2Client.setCredentials({ refresh_token: refreshToken });

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

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            res.statusCode = 500;
            res.json({ success: false, message: `Email failed to sent : ${error.toString()}` });
        } else {
            console.log('Email sent: ' + info.response);
            res.statusCode = 200;
            res.json({ success: true, message: "Email Sent" });
        }
    });
}

const buildPortfolioEmailContent = (portfolioTitle, name, subject, email, message) => {
    const emailSubject = `${portfolioTitle}: ${subject} from ${email}`;
    const emailBody = `<!doctype html>
    <html lang="en-US">
    
    <head>
        <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
        <title>Message from your portfolio</title>
        <meta name="description" content="Reset Password Email Template.">
        <style type="text/css">
            a:hover {text-decoration: underline !important;}
        </style>
    </head>
    
    <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
        <!--100% body table-->
        <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
            style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
            <tr>
                <td>
                    <table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
                        align="center" cellpadding="0" cellspacing="0">
                        <tr>
                            <td style="height:80px;">&nbsp;</td>
                        </tr>
                        <tr>
                            <td style="text-align:center;">
                              <a href="https://dylansalim3.github.io/ZWPortfolio/" title="logo" target="_blank">
                                <img width="200" src="https://i.imgur.com/WSjEQ4t.png" title="logo" alt="logo">
                              </a>
                            </td>
                        </tr>
                        <tr>
                            <td style="height:20px;">&nbsp;</td>
                        </tr>
                        <tr>
                            <td>
                                <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                                    style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                                    <tr>
                                        <td style="height:40px;">&nbsp;</td>
                                    </tr>
                                    <tr>
                                        <td style="padding:0 35px;">
                                            <h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">
                                            You have a message from your portfolio!</h1>
                                            <span
                                                style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
                                            <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
                                                ${message} 
    
                                                -- sent by ${name} via ${email}
                                            </p>
                                            
                                            <a href="mailto:${email}" title="link" target="_blank">
                                                 <input type="submit" 
                                                 style="background:#20e277;text-decoration:none !important; font-weight:500; margin-top:35px; color:#fff;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;"
                                                value="Reply"/>
                                            </a>
                                            
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="height:40px;">&nbsp;</td>
                                    </tr>
                                </table>
                            </td>
                        <tr>
                            <td style="height:20px;">&nbsp;</td>
                        </tr>
                        <tr>
                            <td style="text-align:center;">
                                <p style="font-size:14px; color:rgba(69, 80, 86, 0.7411764705882353); line-height:18px; margin:0 0 0;">&copy; <strong>Elise Studio</strong></p>
                            </td>
                        </tr>
                        <tr>
                            <td style="height:80px;">&nbsp;</td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
        <!--/100% body table-->
    </body>
    
    </html>`;


    return { emailSubject, emailBody };
}
