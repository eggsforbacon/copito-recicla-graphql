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

const fieldNameMapping: { [key: string]: string } = {
  name: "Nombre",
  nameEntity: "Nombre de la entidad",
  category: "Categoría",
  email: "Correo electrónico",
  city: "Ciudad",
  neighborhood: "Barrio",
  commune: "Comuna",
  position: "Cargo",
  address: "Dirección",
  phone: "Teléfono",
  acopio: "Punto de acopio",
  acopioName: "Nombre del punto de acopio",
  prae: "PRAE",
  praeName: "Nombre del PRAE",
  proceda: "PROCEDA",
  procedaProject: "Proyecto PROCEDA",
  committee: "Comité ambiental",
  attachment: "Adjunto",
};

const getChangedFields = (currentData: any, updateData: any): { field: string; oldValue: any; newValue: any }[] => {
  const changedFields: { field: string; oldValue: any; newValue: any }[] = [];
  for (const [key, newValue] of Object.entries(updateData)) {
    if (key === 'id') continue;
    const oldValue = currentData[key];
    if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
      changedFields.push({
        field: key,
        oldValue: oldValue !== undefined ? oldValue : "No definido",
        newValue,
      });
    }
  }
  return changedFields;
};

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
    subject: "Token de confirmación - Copito Recicla (Eliminación)",
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw new Error("No se pudo enviar el correo de verificación para la eliminación");
  }
};

export const sendAdminUpdateNotificationEmail = async (data: {
  entityName: string;
  currentData: any;
  updateData: string;
  requestId: number;
}) => {
  const { entityName, currentData, updateData, requestId } = data;
  const updateFields = JSON.parse(updateData);
  
  const changedFields = getChangedFields(currentData, updateFields);

  if (changedFields.length === 0) {
    return;
  }

  const changesHtml = changedFields
    .map(({ field, oldValue, newValue }) => {
      const fieldName = fieldNameMapping[field] || field;
      return `<li><strong>${fieldName}</strong>: De "${oldValue}" a "${newValue}"</li>`;
    })
    .join('');

  const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8" />
      <title>Solicitud de actualización</title>
    </head>
    <body style="margin:0; padding:0; background:#f4f4f5;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; overflow:hidden;">
              <tr>
                <td style="padding: 40px;">
                  <h2 style="margin:0 0 20px; color:#333333;">Solicitud de actualización de entidad</h2>
                  <p style="margin:0 0 20px; color:#555555; line-height:1.5;">
                    La entidad <strong>${entityName}</strong> ha solicitado actualizar su información.
                  </p>
                  <p style="margin:0 0 20px; color:#555555; line-height:1.5;">
                    <strong>Cambios propuestos:</strong>
                  </p>
                  <ul style="margin:0 0 30px; padding-left:20px; color:#555555; line-height:1.5;">
                    ${changesHtml}
                  </ul>
                  <p style="margin:0 0 20px; color:#555555; line-height:1.5;">
                    Para aprobar esta solicitud, haz clic en el siguiente enlace:
                  </p>
                  <a href="https://copitorecicla.com/api/approve-entity-update?requestId=${requestId}" 
                     style="display:inline-block; padding:10px 20px; background:#007bff; color:#ffffff; text-decoration:none; border-radius:4px;">
                    Aprobar solicitud
                  </a>
                  <p style="margin:40px 0 0; color:#777777; font-size:14px;">
                    Si no deseas aprobar estos cambios, puedes ignorar este correo.
                  </p>
                  <p style="margin:20px 0 0; color:#333333;">
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
            Copito Recicla – © ${new Date().getFullYear()}
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  const mailOptions = {
    from: NODEMAILER_HOST_EMAIL,
    to: NODEMAILER_HOST_EMAIL,
    subject: `Solicitud de actualización de entidad - ${entityName}`,
    html,
  };

  await transporter.sendMail(mailOptions);
};

export const sendEntityUpdateApprovalEmail = async (data: {
  entityEmail: string;
  entityName: string;
  updatedFields: string[];
}) => {
  const { entityEmail, entityName, updatedFields } = data;

  const updatedFieldsHtml = updatedFields
    .map(field => `<li>${fieldNameMapping[field] || field}</li>`)
    .join('');

  const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8" />
      <title>Aprobación de actualización</title>
    </head>
    <body style="margin:0; padding:0; background:#f4f4f5;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; overflow:hidden;">
              <tr>
                <td style="padding: 40px;">
                  <h2 style="margin:0 0 20px; color:#333333;">Aprobación de actualización</h2>
                  <p style="margin:0 0 20px; color:#555555; line-height:1.5;">
                    Hola <strong>${entityName}</strong>,
                  </p>
                  <p style="margin:0 0 20px; color:#555555; line-height:1.5;">
                    Su solicitud para actualizar la información ha sido aprobada.
                  </p>
                  <p style="margin:0 0 20px; color:#555555; line-height:1.5;">
                    <strong>Campos actualizados:</strong>
                  </p>
                  <ul style="margin:0 0 30px; padding-left:20px; color:#555555; line-height:1.5;">
                    ${updatedFieldsHtml}
                  </ul>
                  <p style="margin:0 0 20px; color:#555555; line-height:1.5;">
                    Gracias por mantener su información actualizada.
                  </p>
                  <p style="margin:20px 0 0; color:#333333;">
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
            Copito Recicla – © ${new Date().getFullYear()}
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  const mailOptions = {
    from: NODEMAILER_HOST_EMAIL,
    to: entityEmail,
    subject: "Solicitud de actualización de información aprobada",
    html,
  };

  await transporter.sendMail(mailOptions);
};

export const sendAdminNotificationEmail = async (data: {
  entityName: string;
  requestedWeight: number;
  currentWeight: number;
  requestId: number;
}) => {
  const { entityName, requestedWeight, currentWeight, requestId } = data;
  const newTotal = currentWeight + requestedWeight;

  const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8" />
      <title>Solicitud de actualización de peso</title>
    </head>
    <body style="margin:0; padding:0; background:#f4f4f5;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; overflow:hidden;">
              <tr>
                <td style="padding: 40px;">
                  <h2 style="margin:0 0 20px; color:#333333;">Solicitud de actualización de peso</h2>
                  <p style="margin:0 0 20px; color:#555555; line-height:1.5;">
                    La entidad <strong>${entityName}</strong> ha solicitado actualizar su pesaje de reciclaje.
                  </p>
                  <p style="margin:0 0 10px; color:#555555; line-height:1.5;">
                    <strong>Peso solicitado:</strong> ${requestedWeight} KG
                  </p>
                  <p style="margin:0 0 10px; color:#555555; line-height:1.5;">
                    <strong>Peso actual:</strong> ${currentWeight} KG
                  </p>
                  <p style="margin:0 0 20px; color:#555555; line-height:1.5;">
                    <strong>Nuevo total si se aprueba:</strong> ${newTotal} KG
                  </p>
                  <p style="margin:0 0 20px; color:#555555; line-height:1.5;">
                    Para aprobar esta solicitud, haz clic en el siguiente enlace:
                  </p>
                  <a href="https://copitorecicla.com/api/approve-request?requestId=${requestId}" 
                     style="display:inline-block; padding:10px 20px; background:#007bff; color:#ffffff; text-decoration:none; border-radius:4px;">
                    Aprobar solicitud
                  </a>
                  <p style="margin:40px 0 0; color:#777777; font-size:14px;">
                    Si no deseas aprobar esta solicitud, puedes ignorar este correo.
                  </p>
                  <p style="margin:20px 0 0; color:#333333;">
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
            Copito Recicla – © ${new Date().getFullYear()}
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  const mailOptions = {
    from: NODEMAILER_HOST_EMAIL,
    to: NODEMAILER_HOST_EMAIL,
    subject: `Solicitud de actualización de peso - ${entityName}`,
    html,
  };

  await transporter.sendMail(mailOptions);
};

export const sendApprovalEmail = async (data: {
  entityEmail: string;
  entityName: string;
  approvedWeight: number;
}) => {
  const { entityEmail, entityName, approvedWeight } = data;

  const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8" />
      <title>Aprobación de actualización de peso</title>
    </head>
    <body style="margin:0; padding:0; background:#f4f4f5;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; overflow:hidden;">
              <tr>
                <td style="padding: 40px;">
                  <h2 style="margin:0 0 20px; color:#333333;">Aprobación de actualización de peso</h2>
                  <p style="margin:0 0 20px; color:#555555; line-height:1.5;">
                    Hola <strong>${entityName}</strong>,
                  </p>
                  <p style="margin:0 0 20px; color:#555555; line-height:1.5;">
                    Su solicitud para actualizar el pesaje de reciclaje ha sido aprobada.
                  </p>
                  <p style="margin:0 0 20px; color:#555555; line-height:1.5;">
                    <strong>Peso aprobado:</strong> ${approvedWeight} KG
                  </p>
                  <p style="margin:0 0 20px; color:#555555; line-height:1.5;">
                    Gracias por su contribución al reciclaje.
                  </p>
                  <p style="margin:20px 0 0; color:#333333;">
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
            Copito Recicla – © ${new Date().getFullYear()}
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  const mailOptions = {
    from: NODEMAILER_HOST_EMAIL,
    to: entityEmail,
    subject: "Solicitud de actualización de peso aprobada",
    html,
  };

  await transporter.sendMail(mailOptions);
};