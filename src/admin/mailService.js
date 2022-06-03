const nodemailer = require('nodemailer');
require('dotenv').config();
class MailService {
    constructor(){
        console.log(process.env.MAIL_SERVER,  process.env.MAIL_PASSWORD)
        this.transporter = nodemailer.createTransport({
            service:'yahoo',
            host: 'smtp.mail.yahoo.com',
            port: 465,
            service:'yahoo',
            secure: false,
            logger: true,
           /*  host: "smtp.gmail.com",
            port: 465,
            secure: true, // true for 465, false for other ports */
            auth: {
                user: process.env.MAIL_SERVER, // generated ethereal user
                pass: process.env.MAIL_PASSWORD, // generated ethereal password
            },
            /* tls: {        
                rejectUnauthorized: false 
            }  */
        });
    }
    send = async (to, content, subject, attachments=null) =>{
        /* const mainOptions = { 
            from: 'NQH-Test nodemailer',
            to: 'duchoang206h@gmail.com',
            subject: 'Test Nodemailer',
            text: 'Your text is here',
            html: "https://www.facebook.com/"
        } */
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