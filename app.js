const express = require('express');
const app = express();

if(process.env.NODE_ENV !== 'production'){
    const dotenv = require('dotenv');
    dotenv.config();
}

const emailService = require("./routes/mail_service.route");


const PORT = process.env.PORT||3000;

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({extended: true,}));

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

app.use('/mail-service',emailService);

app.get('/', (req, res) => {
    res.end(`Welcome to the service ${process.env.EMAIL}`);
    // res.json(req.body);
    res.status = 200;
});



app.listen(PORT, function(){
    console.log(`listening on port ${PORT}`);
});
console.log(`Node server running on port ${PORT}`);