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
  const html = `
  <!DOCTYPE html>
  <html lang="es">
  <head>
    <meta charset="UTF-8" />
    <title>Token de confirmación</title>
  </head>
  <body style="margin:0; padding:0; background:#f4f4f5;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; overflow:hidden;">
            <tr>
              <td style="padding: 40px;">
                <h2 style="margin:0 0 20px; color:#333333;">Hola, ${to}</h2>
                
                <p style="margin:0 0 30px; color:#555555; line-height:1.5;">
                  Ingresa este token para confirmar los cambios que deseas realizar:
                </p>

                <div style="
                    font-size: 24px;
                    letter-spacing:4px;
                    text-align:center;
                    margin:0 auto 30px;
                    padding:20px;
                    background:#f0f4ff;
                    border-radius:6px;
                    display:inline-block;
                    position:relative;
                  ">
                  <strong>${token}</strong>
                </div>

                <p style="margin:0 0 20px; color:#777777; font-size:14px;">
                  Este token es válido por <strong>10 minutos</strong> y solo puede usarse una vez.
                </p>

                <p style="margin:0 0 40px; color:#777777; font-size:14px;">
                  Si no querías realizar ningún cambio, puedes ignorar este correo.
                </p>

                <p style="margin:0; color:#333333;">
                  Gracias,<br/>
                  <strong>Copito Recicla</strong>
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td align="center" style="padding:20px 0; font-size:12px; color:#aaaaaa;">
          Copito Recicla – &copy; ${new Date().getFullYear()}
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;

  const mailOptions = {
    from: NODEMAILER_HOST_EMAIL,
    to,
    subject: "Token de confirmación – Copito Recicla",
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error enviando correo:", error);
    throw new Error("No se pudo enviar el correo de verificación");
  }
};

export const sendDeleteTokenEmail = async (token: string, entityId: number) => {
  const to = process.env.NODEMAILER_HOST_EMAIL;

  const html = `
  <!DOCTYPE html>
  <html lang="es">
  <head>
    <meta charset="UTF-8" />
    <title>Token de confirmación</title>
  </head>
  <body style="margin:0; padding:0; background:#f4f4f5;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; overflow:hidden;">
            <tr>
              <td style="padding: 40px;">
                <h2 style="margin:0 0 20px; color:#333333;">Hola,</h2>
                
                <p style="margin:0 0 30px; color:#555555; line-height:1.5;">
                  Ingresa este token para confirmar la eliminación del registro seleccionado:
                </p>

                <div style="
                    font-size: 24px;
                    letter-spacing:4px;
                    text-align:center;
                    margin:0 auto 30px;
                    padding:20px;
                    background:#f0f4ff;
                    border-radius:6px;
                    display:inline-block;
                    position:relative;
                  ">
                  <strong>${token}</strong>
                </div>

                <p style="margin:0 0 20px; color:#777777; font-size:14px;">
                  Este token es válido por <strong>10 minutos</strong> y solo puede usarse una vez.
                </p>

                <p style="margin:0 0 40px; color:#777777; font-size:14px;">
                  Si no querías realizar ningún cambio, puedes ignorar este correo.
                </p>

                <p style="margin:0; color:#333333;">
                  Gracias,<br/>
                  <strong>Copito Recicla</strong>
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td align="center" style="padding:20px 0; font-size:12px; color:#aaaaaa;">
          Copito Recicla – &copy; ${new Date().getFullYear()}
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;

  const mailOptions = {
    from: process.env.NODEMAILER_HOST_EMAIL,
    to,
    subject: "Token de confirmación (Eliminación) - Copito Recicla",
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw new Error("No se pudo enviar el correo de verificación para la eliminación");
  }
};