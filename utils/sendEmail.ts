import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
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