import nodemailer from 'nodemailer';
import config from '../config/config.js';

export const sendEmail = async (content) => {
  
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: config.SMTP_HOST,
    port: config.SMTP_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: config.SMTP_USER, // generated ethereal user
      pass: config.SMTP_PASSWORD, // generated ethereal password
    },
  });
    //console.log(transporter)
  // send mail with defined transport object
  if(!content){
    content = {
      from: "Mailtrap <info@mailtrap.io>", // sender address
      to: "earthweb21st@gmail.com", // list of receivers with comma separators
      subject: "tested mail trap from site", // Subject line
      text: "test mail to check for forgotten user", // plain text body
      //html: "<b>Hello world?</b>", // html body
    };
  }
  let info = await transporter.sendMail(content);
  return info;
  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  //console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}