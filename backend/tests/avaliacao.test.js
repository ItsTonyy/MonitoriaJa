const request = require('supertest');
const app = require('../dist/index.js').default;

describe('Rotas de Avaliacao', () => {
  let avaliacaoId;

  test('POST /avaliacao cria avaliação', async () => {
    const res = await request(app)
      .post('/avaliacao')
      .set('Authorization', `Bearer ${global.__tokens.aluno}`)
      .send({
        nota: 5,
        comentario: 'Ótimo',
        monitor: global.__users.monitor._id.toString(),
        aluno: global.__users.aluno._id.toString(),
        status: 'PUBLICADA'
      })
      .expect(201);
    expect(res.body).toHaveProperty('message');
  });

  test('GET /avaliacao lista todas (admin)', async () => {
    const res = await request(app)
      .get('/avaliacao')
      .set('Authorization', `Bearer ${global.__tokens.admin}`)
      .expect(200);
    expect(Array.isArray(res.body)).toBe(true);
    avaliacaoId = res.body[0]?._id || res.body[0]?.id;
  });

  test('POST /avaliacao/:id/like bloqueia monitor', async () => {
    if (!avaliacaoId) {
      const list = await request(app)
        .get('/avaliacao')
        .set('Authorization', `Bearer ${global.__tokens.admin}`)
        .expect(200);
      avaliacaoId = list.body[0]?._id || list.body[0]?.id;
    }
    await request(app)
      .post(`/avaliacao/${avaliacaoId}/like`)
      .set('Authorization', `Bearer ${global.__tokens.monitor}`)
      .expect(403);
  });

  test('POST /avaliacao/:id/like permite aluno', async () => {
    await request(app)
      .post(`/avaliacao/${avaliacaoId}/like`)
      .set('Authorization', `Bearer ${global.__tokens.aluno}`)
      .expect(200);
  });
});

