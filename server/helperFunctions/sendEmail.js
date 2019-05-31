import nodemailer from 'nodemailer';

const sendEmail = (email, url, res) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    secure: false,
    TLS: true,
    auth: {
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.PASSWORD,
    },
  });

  const mailOptions = {
    from: 'admin@driveway.com',
    to: email,
    subject: 'Password Reset',
    html: `<div>
    <p> Please click on the link below to reset your password</p>
          <a href=${url}
                style="
                display:inline-block;
                width: 115px;
                height: 25px;
                background: #4E9CAF;
                padding: 10px;
                text-align: center;
                border-radius: 5px;
                color: white;
                font-weight: bold;
                target="_blank"
            >
              Reset Button 
          </a>
    <p> If you did not make this request please ignore the message </p>
    </div>`,
  };

  transporter.sendMail(mailOptions, error => {
    if (error) {
      return res
        .status(500)
        .json({ message: 'An error occured while trying to send your mail' });
    }
    return res
      .status(200)
      .json({ message: 'A recovery link has been sent to your mail' });
  });
};

export default sendEmail;
