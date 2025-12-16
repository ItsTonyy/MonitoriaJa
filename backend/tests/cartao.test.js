const request = require("supertest");
const app = require("../dist/index.js").default;

describe("Rotas de Cartao", () => {
  let cartaoId;
  let userId;

  beforeAll(() => {
    userId = global.__users.aluno._id.toString();
  });

  test("POST /cartao/:id cria cartao do usuário", async () => {
    const res = await request(app)
      .post(`/cartao/${userId}`)
      .set("Authorization", `Bearer ${global.__tokens.aluno}`)
      .send({
        usuario: userId,
        numero: "4111111111111111",
        titular: "Aluno",
        validade: "12/2026",
        cvv: "123",
        bandeira: "Visa",
        ultimosDigitos: "1111",
      })
      .expect(201);
    expect(res.body).toHaveProperty("message");
  });

  test("GET /cartao/:id retorna cartao", async () => {
    const list = await request(app)
      .get("/usuario")
      .set("Authorization", `Bearer ${global.__tokens.admin}`)
      .expect(200);
    const created = await request(app)
      .post(`/cartao/${userId}`)
      .set("Authorization", `Bearer ${global.__tokens.aluno}`)
      .send({
        usuario: userId,
        numero: "5555444433332222",
        titular: "Aluno",
        validade: "01/2027",
        cvv: "456",
        bandeira: "Master",
        ultimosDigitos: "2222",
      })
      .expect(201);
    const cartoes =
      await require("../dist/models/cartao.model.js").default.find({
        usuario: userId,
      });
    cartaoId = cartoes[0]._id.toString();
    const res = await request(app)
      .get(`/cartao/${cartaoId}`)
      .set("Authorization", `Bearer ${global.__tokens.aluno}`)
      .expect(200);
    expect(res.body).toHaveProperty("_id", cartaoId);
  });

  test("DELETE /cartao/:id remove cartão do usuário", async () => {
    const cartao =
      await require("../dist/models/cartao.model.js").default.create({
        usuario: userId,
        numero: "1234123412341234",
        titular: "Aluno",
        validade: "10/2026",
        cvv: "999",
        bandeira: "Visa",
        ultimosDigitos: "1234",
      });
    const res = await request(app)
      .delete(`/cartao/${userId}`)
      .query({ cartaoId: cartao._id.toString() })
      .set("Authorization", `Bearer ${global.__tokens.aluno}`)
      .expect(200);
    expect(res.body).toHaveProperty("message");
  });
});
