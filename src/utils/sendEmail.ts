import nodemailer from 'nodemailer';

const sendEmail = async (email: string, subject: string, text: string): Promise<void> => {
  const transporter = nodemailer.createTransport({
    service: process.env.SERVICE,
    auth: {
      user: process.env.GMAIL,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.GMAIL,
    to: email,
    subject: subject,
    text: text,
    html: `hello this is your OTP ${text}`,
  };

  await transporter.sendMail(mailOptions);
};

export default sendEmail;

