import nodemailer from 'nodemailer';

const getMailTransport = () => {
  const user = process.env.EMAIL_USER;
  const appPassword = process.env.EMAIL_APP_PASSWORD;

  if (!user || !appPassword) {
    return null;
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user,
      pass: appPassword,
    },
  });
};

export default getMailTransport;
