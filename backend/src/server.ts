const express = require("express");
require("dotenv").config({quiet: true})
const router = require("./routes/login");
const notificacaoRouter = require("./routes/notificacao"); 
const app = express();

app.use(express.json())
app.use(router)
app.use(notificacaoRouter);

app.listen(process.env.SERVER_PORT,process.env.SERVER_INTERFACE, ()=>{
    console.log(`Servidor subiu! Porta:${process.env.SERVER_PORT}`);
})