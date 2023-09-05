import nodemailer from "nodemailer";

export const verificacionCorreo = async (nuevoUsuario) => {
  const { tokenVerificar, nombre, email } = nuevoUsuario;
  console.log(nuevoUsuario);
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const info = await transport.sendMail({
    from: "'TeamUP - Ad astra sports' <TeamUpOfficial2023@gmail.com>",
    to: email,
    subject: "Verifiacion de correo",
    text: "Verifiacion de correo",
    html: `
        <table cellpadding="0" cellspacing="0" style="font-family: Arial, sans-serif; background-color: #f9f9f9; width: 100%;">
        <tr>
          <td style="padding: 20px; background-color: white; border-radius: 5px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
            <h1 style="font-size: 24px; margin-bottom: 20px;color: #000">Verificacion de contraseña</h1>
            <p style="font-size: 16px; color: #444; line-height: 1.5;">Hola <span style="font-weight: bold;">${nombre}</span>, Estas a pocos pasos de habilitar tu cuenta haciendo click en el boton</p>
            <a href="${process.env.URL_FRONTEND}/verificarEmail/${tokenVerificar}" style="display: inline-block; font-size: 16px; font-weight: bold; color: white; text-decoration: none; background-color: black; padding: 10px 20px; border-radius: 5px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); transition: all 0.3s ease;" class="confirm-button">Verificar correo</a>
          </td>
        </tr>
      </table>
        `,
  });
};
