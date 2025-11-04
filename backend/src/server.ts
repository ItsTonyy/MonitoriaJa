const express = require("express");
require("dotenv").config({quiet: true})
const router = require("./routes/login");
const notificacaoRouter = require("./routes/notificacao"); 
const perfilUsuarioRouter = require("./routes/perfilUsuario");
const perfilMonitorRouter = require("./routes/perfilMonitor")
const alterarSenha = require(".routes/alterarSenha")
const cartao = require(".routes/cartao")
const app = express();

app.use(express.json())
app.use(router)
app.use(notificacaoRouter);
app.use(perfilUsuarioRouter);
app.use(perfilMonitorRouter);
app.use(alterarSenha);
app.use(cartao)

app.listen(process.env.SERVER_PORT,process.env.SERVER_INTERFACE, ()=>{
    console.log(`Servidor subiu! Porta:${process.env.SERVER_PORT}`);
})