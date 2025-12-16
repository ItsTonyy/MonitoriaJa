const request = require("supertest");
const app = require("../dist/index.js").default;

describe("Rotas de Login", () => {
  test("POST /login retorna token com credenciais válidas", async () => {
    const res = await request(app)
      .post("/login")
      .send({ email: "admin@test.com", password: "admin123" })
      .expect(200);
    expect(res.body).toHaveProperty("message");
    expect(typeof res.body.message).toBe("string");
  });
});
