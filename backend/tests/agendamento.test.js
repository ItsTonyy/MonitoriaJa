const request = require("supertest");
const app = require("../dist/index.js").default;

describe("Rotas de Agendamento", () => {
  let agendamentoId;

  test("POST /agendamento cria agendamento", async () => {
    const res = await request(app)
      .post("/agendamento")
      .set("Authorization", `Bearer ${global.__tokens.aluno}`)
      .send({
        monitor: global.__users.monitor._id.toString(),
        aluno: global.__users.aluno._id.toString(),
        servico: "Aula",
        data: "2025-12-20",
        hora: "10:00",
        duracao: 60,
        topicos: "Derivadas",
        statusPagamento: "PENDENTE",
        formaPagamento: "CARTAO",
      })
      .expect(201);
    expect(res.body).toHaveProperty("message");
  });

  test("GET /agendamento lista todos (admin)", async () => {
    const res = await request(app)
      .get("/agendamento")
      .set("Authorization", `Bearer ${global.__tokens.admin}`)
      .expect(200);
    expect(Array.isArray(res.body)).toBe(true);
    agendamentoId = res.body[0]?._id || res.body[0]?.id;
  });

  test("GET /agendamento/:id retorna um agendamento", async () => {
    if (!agendamentoId) {
      const list = await request(app)
        .get("/agendamento")
        .set("Authorization", `Bearer ${global.__tokens.admin}`)
        .expect(200);
      agendamentoId = list.body[0]?._id || list.body[0]?.id;
    }
    const res = await request(app)
      .get(`/agendamento/${agendamentoId}`)
      .set("Authorization", `Bearer ${global.__tokens.aluno}`)
      .expect(200);
    expect(res.body).toHaveProperty("_id");
  });
});
