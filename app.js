const express = require('express');
const app = express();

const dotenv = require('dotenv');
const emailService = require("./routes/mail_service.route");
dotenv.config();

const PORT = process.env.PORT||3000;

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({extended: true,}));

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

app.use('/mail-service',emailService);

app.get('/', (req, res) => {
    res.end(`Welcome to the service ${process.env.EMAIL}`);
    res.status = 200;
});



app.listen(PORT,'0.0.0.0', function(){
    console.log(`listening on port ${PORT} ${HOST}`);
});
console.log(`Node server running on port ${PORT}`);