const express = require('express');
const app = express();

const dotenv = require('dotenv');
const emailService = require("./routes/mail_service.route");
dotenv.config();

const PORT = process.env.PORT|80;

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({extended: true,}));

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

app.use('/mail-service',emailService);

app.get('/', (req, res) => {
    res.end(`Welcome to the service ${process.env.EMAIL}`)
});

app.listen(PORT, function(){

});
console.log('Node server running on port 3000');