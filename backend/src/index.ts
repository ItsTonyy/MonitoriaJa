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
import uploadRoutes from "./routes/uploadRoutes";

// Se usar dotenv para variáveis de ambiente:
import dotenv from "dotenv";
dotenv.config();

// configuração do swaggerUI & swaggerJsDoc pra documentação
const swaggerUi = require("swagger-ui-express");

const swaggerJSDoc = require("swagger-jsdoc");
const path = require("path");

const swaggerDefinition = {
  openapi: "3.1.0",
  info: {
    title: "Express API for the MonitoriaJa project.",
    version: "1.0.0",
  },
  servers: [
    {
      url: "http://localhost:3001",
      description: "Servidor de desenvolvimento",
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: [
    path.join(__dirname, "routes", "*.ts"),
    path.join(__dirname, "routes", "*.js"),
  ],
};

const swaggerSpec = swaggerJSDoc(options);


const app: Application = express();

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());

app.use(cors());

app.use(express.static("public"));

// rotas aqui...
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(cors());
app.use("/disciplina", disciplinaRoutes);
app.use("/agendamento", agendamentoRoutes);
app.use("/cartao", cartaoRoutes);
app.use("/usuario", usuarioRoutes);
app.use("/disponibilidade", disponibilidadeRoutes);
app.use("/avaliacao", avaliacaoRoutes);
app.use("/notificacao", notificacaoRoutes);
app.use("/upload", uploadRoutes);
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
