module.exports = class MailServiceModel{
    constructor(receiverEmail,emailSubject,emailBody) {
        this.receiverEmail = receiverEmail;
        this.emailSubject = emailSubject;
        this.emailBody = emailBody;
    }
}