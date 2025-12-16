const request = require("supertest");
const app = require("../dist/index.js").default;

describe("Rotas de Disponibilidade", () => {
  let disponibilidadeId;
  let usuarioId;

  beforeAll(() => {
    usuarioId = global.__users.aluno._id.toString();
  });

  test("POST /disponibilidade cria disponibilidade como owner", async () => {
    const res = await request(app)
      .post("/disponibilidade")
      .set("Authorization", `Bearer ${global.__tokens.aluno}`)
      .send({ usuario: usuarioId, day: "SEG", times: ["08:00", "09:00"] })
      .expect(201);
    expect(res.body).toHaveProperty("message");
  });

  test("GET /disponibilidade/:id retorna disponibilidade", async () => {
    const list =
      await require("../dist/models/disponibilidade.model.js").default.find({
        usuario: usuarioId,
      });
    disponibilidadeId = list[0]._id.toString();
    const res = await request(app)
      .get(`/disponibilidade/${disponibilidadeId}`)
      .set("Authorization", `Bearer ${global.__tokens.aluno}`)
      .expect(200);
    expect(res.body).toHaveProperty("_id", disponibilidadeId);
  });

  test("PATCH /disponibilidade/:id atualiza disponibilidade como owner", async () => {
    const res = await request(app)
      .patch(`/disponibilidade/${disponibilidadeId}`)
      .set("Authorization", `Bearer ${global.__tokens.aluno}`)
      .send({ day: "TER", times: ["10:00"] })
      .expect(200);
    expect(res.body).toHaveProperty("day", "TER");
  });
});
