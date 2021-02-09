const express = require('express');
const { sendEmail, sendPortfolioEmail: sendPortfolioContactFormEmail } = require("../controller/mail_service.controller");
const { sendRestoreSecretPasswordEmail } = require("../controller/mail_service.controller");
const emailService = express.Router();

emailService.post('/reset-secret-password', sendRestoreSecretPasswordEmail);

emailService.post('/send-email', sendEmail);

emailService.post('/send-portfolio-form', sendPortfolioContactFormEmail);

module.exports = emailService;