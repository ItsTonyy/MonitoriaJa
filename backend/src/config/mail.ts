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

async function sendEmail(email: string, token:string){
  try{
    const info = await transport.sendMail({
      from: `"Time MonitoriaJa" ${process.env.SMTP_EMAIL}`,
      to: `${email}`,
      subject:"Email de verificacao",
      html:`<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>Redefinição de senha</title>
<style>
  body { margin:0; padding:0; background:#f4f6f8; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial; color:#333; }
  .container { width:100%; max-width:680px; margin:24px auto; background:#ffffff; border-radius:12px; box-shadow:0 6px 24px rgba(18,30,50,0.06); overflow:hidden; }
  .pad { padding:28px; }
  .header { background: linear-gradient(90deg,#6f7cff,#5bd0ff); color:#fff; padding:20px 28px; }
  .logo { font-weight:700; letter-spacing:0.2px; font-size:20px; }
  h1 { margin:0 0 12px 0; font-size:20px; color:#12213a; }
  p { margin:0 0 16px 0; line-height:1.5; color:#495066; }
  .btn-wrap { text-align:center; margin:18px 0; }
  .btn {
    display:inline-block;
    text-decoration:none;
    font-weight:600;
    padding:12px 22px;
    border-radius:10px;
    background:#2835ff; color:#fff;
    box-shadow:0 6px 18px rgba(40,53,255,0.18);
  }
  .muted { color:#9aa0b4; font-size:13px; }
  .footer { background:#fbfdff; padding:20px 28px; font-size:13px; color:#637089; }
  .small { font-size:12px; color:#98a0b5; }
  .code { display:inline-block; background:#f3f6ff; padding:8px 10px; border-radius:6px; font-family:monospace; color:#1f2a6b; }
  @media (max-width:480px){ .pad{padding:18px} .header{padding:16px} .btn{width:100%; display:block} }
</style>
</head>
<body>
  <div style="padding:18px; background:#eef3fb;">
    <div class="container" role="article" aria-label="Redefinição de senha">
      <div class="header">
        <div class="pad">
          <div class="logo">MonitoriaJá</div>
          <div style="margin-top:8px; font-size:13px; opacity:0.95;">Recupere sua senha com segurança</div>
        </div>
      </div>

      <div class="pad">
        <h1>Olá👋</h1>
        <p>
          Recebemos uma solicitação para redefinir a senha da sua conta <strong>MonitoriaJá</strong>.
          Clique no botão abaixo para criar uma nova senha. O link é válido por <strong>24 horas</strong>.
        </p>

        <div class="btn-wrap">
          <!-- Substitua {{resetLink}} pelo link completo: ... -->
          <a href=http://localhost:3000/MonitoriaJa/redefinir-senha?token=${token} class="btn" target="_blank" rel="noopener noreferrer">Redefinir minha senha</a>
        </div>

        <p class="muted">Se o botão acima não funcionar, copie e cole este link no seu navegador:</p>
        <p class="code" style="word-break:break-all;">http://localhost:3000/MonitoriaJa/redefinir-senha?token=${token}</p>

        <hr style="border:none;border-top:1px solid #eef2f7;margin:20px 0;">

        <p class="small">
          Se você não solicitou a redefinição de senha, ignore este e-mail — sua conta permanecerá segura.
          Caso tenha alguma dúvida, responda a este e-mail ou contate nosso suporte.
        </p>

        <div style="margin-top:18px;">
          <p style="margin:0;"><strong>Equipe MonitoriaJá</strong></p>
          <p class="small" style="margin:6px 0 0 0">Suporte: <a href="mailto:suporte@monitoriaja.example">suporte@monitoriaja.example</a></p>
        </div>
      </div>

      <div class="footer">
        <div class="pad" style="padding-top:10px;padding-bottom:10px;">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;">
            <div class="small">MonitoriaJá • Segurança e agilidade nos estudos</div>
            <div class="small">© <span id="year">2025</span></div>
          </div>
        </div>
      </div>

    </div>
    <div style="max-width:680px;margin:12px auto;color:#8b95aa;font-size:12px;text-align:center;">
      <div style="margin-top:8px;">
        <span class="small">Este link expira em 24 horas. Não compartilhe este e-mail com ninguém.</span>
      </div>
    </div>
  </div>
</body>
</html>
 ` ,
    })
    console.log("Email enviado ", info.messageId);
  }catch(err){
    console.log("Erro ao enviar email", err );
  }
}


export default sendEmail;