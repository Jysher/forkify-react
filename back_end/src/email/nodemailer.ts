import nodemailer from 'nodemailer';
import HttpError from '../utils/HttpError.ts';

type MailOptions = {
  email: string;
  subject: string;
  message: string;
};

const sendEmail = async (options: MailOptions) => {
  if (
    !process.env.EMAIL_HOST ||
    !process.env.EMAIL_PORT ||
    !process.env.EMAIL_USERNAME ||
    !process.env.EMAIL_PASSWORD
  )
    throw new HttpError('Environment variables not sent', 500);

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: 'John Doe',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(mailOptions);
};

export default sendEmail;
