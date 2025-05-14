import nodemailer from 'nodemailer'

const NODEMAILER_HOST_EMAIL = process.env.NODEMAILER_HOST_EMAIL;
const NODEMAILER_APP_PASS = process.env.NODEMAILER_APP_PASS;
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: NODEMAILER_HOST_EMAIL,
    pass: NODEMAILER_APP_PASS,
  },
});

export const sendTokenEmail = async (to: string, token: string) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: "Token de confirmación - Copito Recicla",
    text: `Tu token de verificación es: ${token}. Este token es válido por 10 minutos y solo puede usarse una vez.`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw new Error("No se pudo enviar el correo de verificación");
  }
};