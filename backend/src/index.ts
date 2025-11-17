import cors from 'cors';
import express, { Application } from "express";
import mongoose from "mongoose";
import disciplinaRoutes from "./routes/disciplinaRoutes";
import agendamentoRoutes from "./routes/agendamentoRoutes";
import cartaoRoutes from "./routes/cartaoRoutes";
import usuarioRoutes from "./routes/usuarioRoutes";
import disponibilidadeRoutes from "./routes/disponibilidadeRoutes";
import avaliacaoRoutes from "./routes/avaliacaoRoutes";
import notificacaoRoutes from "./routes/notificacaoRoutes";
import loginRoutes from "./routes/login";


// Se usar dotenv para variáveis de ambiente:
import dotenv from "dotenv";
dotenv.config();

const app: Application = express();

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());

// rotas aqui...

app.use(cors())
app.use("/disciplina", disciplinaRoutes);
app.use("/agendamento", agendamentoRoutes);
app.use("/cartao", cartaoRoutes);
app.use("/usuario", usuarioRoutes);
app.use("/disponibilidade", disponibilidadeRoutes);
app.use("/avaliacao", avaliacaoRoutes);
app.use("/notificacao", notificacaoRoutes);
app.use(loginRoutes)
// Conexão com o banco de dados e inicialização do servidor

const password= encodeURIComponent('psw10monitorija423#');

mongoose
  .connect(
    process.env.MONGO_URI ||
     `mongodb+srv://monitoriaja:${password}@apimonitoriaja.kuue8ey.mongodb.net/monitoriaja?appName=APImonitoriaja`
  )
  .then(() => {
    console.log("Conectou ao banco!");
    app.listen(3001, () => console.log("Servidor rodando na porta 3001"),);
  })
  .catch((err) => console.log(err));
