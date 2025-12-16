const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

let mongoServer;

async function globalSetup() {
  process.env.NODE_ENV = "test";
  process.env.JWT_KEY = process.env.JWT_KEY || "test-secret";

  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, { dbName: "testdb" });

  const uploadsDir = path.join(process.cwd(), "backend", "public", "uploads");
  fs.mkdirSync(uploadsDir, { recursive: true });

  const User = require("../dist/models/usuario.model.js").default;

  const salt = await bcrypt.genSalt(10);
  const hashAluno = await bcrypt.hash("aluno123", salt);
  const hashAdmin = await bcrypt.hash("admin123", salt);
  const hashMonitor = await bcrypt.hash("monitor123", salt);

  const admin = await User.create({
    nome: "Admin",
    email: "admin@test.com",
    password: hashAdmin,
    tipoUsuario: "ADMIN",
    isAtivo: true,
  });
  const aluno = await User.create({
    nome: "Aluno",
    email: "aluno@test.com",
    password: hashAluno,
    tipoUsuario: "ALUNO",
    isAtivo: true,
  });
  const monitor = await User.create({
    nome: "Monitor",
    email: "monitor@test.com",
    password: hashMonitor,
    tipoUsuario: "MONITOR",
    isAtivo: true,
  });

  global.__users = { admin, aluno, monitor };
  global.__tokens = {
    admin: jwt.sign(
      { id: admin._id.toString(), role: "ADMIN" },
      process.env.JWT_KEY
    ),
    aluno: jwt.sign(
      { id: aluno._id.toString(), role: "ALUNO" },
      process.env.JWT_KEY
    ),
    monitor: jwt.sign(
      { id: monitor._id.toString(), role: "MONITOR" },
      process.env.JWT_KEY
    ),
  };
}

async function globalTeardown() {
  await mongoose.disconnect();
  if (mongoServer) await mongoServer.stop();
}

beforeAll(async () => {
  await globalSetup();
});

afterAll(async () => {
  await globalTeardown();
});
