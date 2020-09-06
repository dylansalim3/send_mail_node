const express = require('express');
const app = express();

const dotenv = require('dotenv');
const emailService = require("./routes/mail_service.route");
dotenv.config();

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({extended: true,}));

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

app.use('/mail-service',emailService);

app.get('/', (req, res) => {
    res.end(`Welcome to the service ${process.env.EMAIL}`)
});

app.listen(3000, '127.0.0.1');
console.log('Node server running on port 3000');