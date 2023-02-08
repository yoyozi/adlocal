const nodemailer = require('nodemailer');

const sendEmail = async options => {

  // 1 Create tranporter (service that will send the mail)
  const transporter = nodemailer.createTransport({

    // host: "sandbox.smtp.mailtrap.io",
    // port: 2525,
    // auth: {
    //   user: "b2485b1f6f1489",
    //   pass: "620a56979fa326"
    // }


    host: 'smtp-relay.sendinblue.com',
    port: 587,
    auth: {
        user: process.env.SEND_IN_BLUE_ACCOUNT,
        pass: process.env.SEND_IN_BLUE_PW
    }
  });

  // 2 Define options
  const mailOptions = {
    from: 'system <system@adlocal.co.za>',
    to: options.email,
    subject: options.subject,
    text: options.message
  }

  //message send : sendMail - returns a promis so we can use async and await
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;