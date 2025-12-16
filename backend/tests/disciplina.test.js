const request = require("supertest");
const app = require("../dist/index.js").default;

describe("Rotas de Disciplina", () => {
  let disciplinaId;

  test("POST /disciplina cria disciplina (admin)", async () => {
    const res = await request(app)
      .post("/disciplina")
      .set("Authorization", `Bearer ${global.__tokens.admin}`)
      .send({ nome: "Cálculo I" })
      .expect(201);
    expect(res.body).toHaveProperty("message");
  });

  test("GET /disciplina retorna lista de nomes", async () => {
    const res = await request(app).get("/disciplina").expect(200);
    expect(Array.isArray(res.body)).toBe(true);
    disciplinaId = res.body[0]?._id || res.body[0]?.id || undefined;
  });

  test("GET /disciplina/:id retorna nome", async () => {
    // Se não há id, cria e obtém novamente
    if (!disciplinaId) {
      await request(app)
        .post("/disciplina")
        .set("Authorization", `Bearer ${global.__tokens.admin}`)
        .send({ nome: "Álgebra Linear" })
        .expect(201);
      const list = await request(app).get("/disciplina").expect(200);
      disciplinaId = list.body[0]._id || list.body[0].id;
    }
    const res = await request(app)
      .get(`/disciplina/${disciplinaId}`)
      .expect(200);
    expect(res.body).toHaveProperty("nome");
  });
});
