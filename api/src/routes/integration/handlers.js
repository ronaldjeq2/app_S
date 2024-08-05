"use strict";
const MailGun = require("mailgun-js");
const Boom = require("boom");

let internals = {};

internals.sendMailWithTemplate = async function(request, h) {
  const {
    subject,
    email_address,
    template_id,
    template_data,
    validation_key
  } = request.payload;

  let db = request.app.db;

  let decrypted_validation_key = null;

  try {
    const query = await db.execute(`
    select SENATI.exzgsec.f_decryp_v(
        v_CADENA =>'${validation_key}',
        v_LLAVE =>null
    ) from dual`);
    decrypted_validation_key = query.rows[0][0];
  } catch (error) {
    return Boom.notImplemented(error);
  }

  console.log("====================================");
  console.log(decrypted_validation_key);
  console.log("====================================");

  if (decrypted_validation_key === null) {
    return Boom.unauthorized("Acceso no authorizado");
  }

  // Send email
  const mail_api = new MailGun({
    apiKey: process.env.MAIL_GUN_TOKEN,
    domain: process.env.MAIL_GUN_DOMAIN
  });

  const options = {
    from: "postmaster@senati.edu.pe",
    to: email_address,
    subject: subject || "subject_test",
    template: template_id
  };
  Object.keys(template_data).map(key => {
    options["v:" + key] = template_data[key];
  });

  let send_message;

  try {
    if (process.env.NODE_ENV === "test") {
      send_message = true;
    } else {
      send_message = await new Promise((resolve, reject) => {
        mail_api.messages().send(options, (error, body) => {
          if (error || body === undefined) {
            console.log("======= Error: send_message =======");
            console.log(error);
            console.log("===============================");
            resolve({
              error: {
                message:
                  "No se pudo enviar el correo, por favor intenta mas tarde"
              }
            });
          }
          resolve({ was_sent: true });
        });
      });
    }
    return send_message;
  } catch (error) {
    console.log(error);
    return {
      error: {
        message: "No se pudo enviar el correo, por favor intenta mas tarde"
      }
    };
  }
};

module.exports = internals;
