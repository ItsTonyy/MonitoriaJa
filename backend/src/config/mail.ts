const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const path = require("path");

const envPath = path.resolve(__dirname, '../../.env');

const transport = nodemailer.createTransport({
    host: process.env.SMTP_SERVER,
    port: process.env.SMTP_PORT,
    auth:{
        user: process.env.SMTP_EMAIL,
        pass: process.env.MAIL_PASS
    }
});

async function sendEmail(email: string){
  try{
    const info = await transport.sendMail({
      from: `"Time MonitoriaJa" ${process.env.SMTP_EMAIL}`,
      to: `${email}`,
      subject:"Email de verificacao",
      text:`Boa tarde, clique no link para redefinir sua senha <a> http://localhost:3000/MonitoriaJa/redefinir-senha <a>` ,
    })
    console.log("Email enviado ", info.messageId);
  }catch(err){
    console.log("Erro ao enviar email", err );
  }
}


module.exports = {
  sendEmail,

}