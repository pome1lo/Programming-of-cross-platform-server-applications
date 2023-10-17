const nodemailer = require('nodemailer');

function send(user, pass, toMail, message) {
  let transporter = nodemailer.createTransport({
    host: 'smtp.mail.ru',
    port: 587,
    secure: false,
    auth: {
      user: user, 
      pass: pass
    }
  });

  let mailOptions = {
    from: user,
    to: toMail, 
    subject: 'Сообщение от модуля m06_PAA',
    text: message
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        reject(error);
      } else {
        resolve(info.response);
      }
    });
  });
}

module.exports = { send };