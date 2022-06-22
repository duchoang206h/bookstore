const nodemailer = require('nodemailer');
require('dotenv').config();
class MailService {
    constructor(){
        this.transporter = nodemailer.createTransport({
            service:'yahoo',
            host: 'smtp.mail.yahoo.com',
            port: 465,
            service:'yahoo',
            secure: false,
            auth: {
                user: process.env.MAIL_SERVER, // generated ethereal user
                pass: process.env.MAIL_PASSWORD, // generated ethereal password
            },
        });
    }
    send = async (to, content, subject, attachments=null) =>{

        return await this.transporter.sendMail({
            from:  process.env.MAIL_SERVER,
            to,
            subject,
            text:"",
            html: content, 
            attachments,
        });
    } 
};
module.exports = new MailService();