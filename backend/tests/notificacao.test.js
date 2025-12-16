const request = require('supertest');
const app = require('../dist/index.js').default;

describe('Rotas de Notificacao', () => {
  let notificacaoId;

  test('POST /notificacao cria notificação', async () => {
    const res = await request(app)
      .post('/notificacao')
      .set('Authorization', `Bearer ${global.__tokens.admin}`)
      .send({
        titulo: 'Teste',
        mensagem: 'Mensagem',
        tipo: 'AGENDAMENTO',
        destinatario: global.__users.aluno._id.toString(),
        prioridade: 'ALTA'
      })
      .expect(201);
    expect(res.body).toHaveProperty('message');
  });

  test('GET /notificacao lista todas (admin)', async () => {
    const res = await request(app)
      .get('/notificacao')
      .set('Authorization', `Bearer ${global.__tokens.admin}`)
      .expect(200);
    expect(Array.isArray(res.body)).toBe(true);
    notificacaoId = res.body[0]?._id || res.body[0]?.id;
  });

  test('GET /notificacao/destinatario/ lista do destinatário autenticado', async () => {
    const res = await request(app)
      .get('/notificacao/destinatario/')
      .set('Authorization', `Bearer ${global.__tokens.aluno}`)
      .expect(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

