const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../dist/index.js").default;

describe("Rotas de Usuario", () => {
  test("POST /usuario cria usuário", async () => {
    const res = await request(app)
      .post("/usuario")
      .send({
        nome: "Novo Usuário",
        email: "novo@test.com",
        password: "123456",
      })
      .expect(201);
    expect(res.body).toHaveProperty("message");
  });

  test("GET /usuario exige admin e lista usuários", async () => {
    const res = await request(app)
      .get("/usuario")
      .set("Authorization", `Bearer ${global.__tokens.admin}`)
      .expect(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("GET /usuario/:id acessa como owner", async () => {
    const id = global.__users.aluno._id.toString();
    const res = await request(app)
      .get(`/usuario/${id}`)
      .set("Authorization", `Bearer ${global.__tokens.aluno}`)
      .expect(200);
    expect(res.body).toHaveProperty("_id", id);
  });

  test("GET /usuario/:id bloqueia acesso de outro usuário não-admin", async () => {
    const id = global.__users.aluno._id.toString();
    await request(app)
      .get(`/usuario/${id}`)
      .set("Authorization", `Bearer ${global.__tokens.monitor}`)
      .expect(403);
  });
});
