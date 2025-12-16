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
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

// Swagger imports
const swaggerUi = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");

const path = require("path");

// -------------------- SWAGGER CONFIG --------------------

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Documentação da API MonitoriaJá",
    version: "1.0.0",
  },
  servers: [
    {
      url: "http://localhost:3001",
      description: "Servidor de desenvolvimento",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
    },
  },
};

const swaggerOptions = {
  swaggerDefinition,
  apis: [
    path.join(__dirname, "routes", "*.ts"),
    path.join(__dirname, "routes", "*.js"),
  ],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

// -------------------- APP CONFIG --------------------

const app: Application = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(express.static("public"));

// Rota da documentação
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// -------------------- ROTAS --------------------

app.use("/disciplina", disciplinaRoutes);
app.use("/agendamento", agendamentoRoutes);
app.use("/cartao", cartaoRoutes);
app.use("/usuario", usuarioRoutes);
app.use("/disponibilidade", disponibilidadeRoutes);
app.use("/avaliacao", avaliacaoRoutes);
app.use("/notificacao", notificacaoRoutes);
app.use("/upload", uploadRoutes);
app.use(loginRoutes);

// -------------------- MONGODB & SERVER --------------------

const password = encodeURIComponent("psw10monitorija423#");

mongoose
  .connect(
    process.env.MONGO_URI ||
      `mongodb+srv://monitoriaja:${password}@apimonitoriaja.kuue8ey.mongodb.net/monitoriaja?appName=APImonitoriaja`
  )
  .then(() => {
    console.log("Conectou ao banco!");
    app.listen(3001, () => console.log("Servidor rodando na porta 3001"));
  })
  .catch((err) => console.log(err));
