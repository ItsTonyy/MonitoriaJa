import express from "express";
import Agendamento from "../models/agendamento.model";
import {
  criarNotificacaoAgendamento,
  criarNotificacaoCancelamento,
  criarNotificacaoReagendamento,
} from "../service/notificacaoService";
import autenticar from "../middleware/auth";
import adminAuth from "../middleware/adminAuth";
const router = express.Router();

/**
 * @swagger
 * /agendamento:
 *   post:
 *     summary: Cria um agendamento
 *     tags: [Agendamento]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               monitor:
 *                 type: string
 *               servico:
 *                 type: string
 *                 enum: [Aula, Exercícios]
 *               data:
 *                 type: string
 *               hora:
 *                 type: string
 *               duracao:
 *                 type: number
 *               topicos:
 *                 type: string
 *               statusPagamento:
 *                 type: string
 *                 enum: [Pendente, Pago]
 *               formaPagamento:
 *                 type: string
 *                 enum: [Cartão, Dinheiro, Pix]
 *               motivoCancelamento:
 *                 type: string
 *             required: [monitor, aluno, servico, data, hora, duracao]
 *     responses:
 *       201:
 *         description: Agendamento criado
 *       500:
 *         description: Erro ao criar agendamento
 */
// CREATE - Adiciona um novo agendamento
router.post("/", autenticar, async (req, res) => {
  const agendamento = req.body;

  try {
    const novoAgendamento: any = await Agendamento.create(agendamento);

    const agendamentoPopulado: any = await Agendamento.findById(
      novoAgendamento._id
    )
      .populate("monitor", "nome")
      .populate("aluno", "nome");

    await criarNotificacaoAgendamento(
      novoAgendamento._id.toString(),
      agendamento.monitor,
      agendamento.aluno,
      agendamento.data,
      agendamento.hora,
      agendamentoPopulado.aluno?.nome || "Aluno",
      agendamentoPopulado.monitor?.nome || "Monitor",
      agendamento.topicos
    );

    res.status(201).json({ message: "Agendamento criado com sucesso!" });
  } catch (error) {
    res.status(500).json({ erro: error });
  }
});

/**
 * @swagger
 * /agendamento:
 *   get:
 *     summary: Lista todos os agendamentos
 *     tags: [Agendamento]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de agendamentos
 *       500:
 *         description: Erro ao listar agendamentos
 */
// READ ALL - Lista todos os agendamentos (com monitor e aluno preenchidos)
router.get("/", adminAuth, async (req, res) => {
  try {
    const agendamentos = await Agendamento.find()
      .populate("monitor")
      .populate("aluno");
    res.status(200).json(agendamentos);
  } catch (error) {
    res.status(500).json({ erro: error });
  }
});

/**
 * @swagger
 * /agendamento/usuario/{usuarioId}:
 *   get:
 *     summary: Lista agendamentos do usuário (monitor ou aluno)
 *     tags: [Agendamento]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: usuarioId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de agendamentos do usuário
 *       500:
 *         description: Erro ao listar agendamentos do usuário
 */
// GET - Lista todos os agendamentos de um usuário (como monitor ou aluno)
router.get("/usuario/:usuarioId", autenticar, async (req, res) => {
  const usuarioId = req.params.usuarioId;

  try {
    const agendamentos = await Agendamento.find({
      $or: [{ monitor: usuarioId }, { aluno: usuarioId }],
    })
      .populate("monitor")
      .populate("aluno");
    res.status(200).json(agendamentos);
  } catch (error) {
    res.status(500).json({ erro: error });
  }
});

/**
 * @swagger
 * /agendamento/{id}:
 *   get:
 *     summary: Obtém um agendamento por ID
 *     tags: [Agendamento]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Agendamento encontrado
 *       404:
 *         description: Agendamento não encontrado
 *       500:
 *         description: Erro ao buscar agendamento
 */
// READ ONE - Busca agendamento por id (com monitor e aluno preenchidos)
router.get("/:id", autenticar, async (req, res) => {
  const id = req.params.id;

  try {
    const agendamento = await Agendamento.findOne({ _id: id })
      .populate("monitor")
      .populate("aluno");

    if (!agendamento) {
      res.status(404).json({ message: "Agendamento não encontrado!" });
      return;
    }

    res.status(200).json(agendamento);
  } catch (error) {
    res.status(500).json({ erro: error });
  }
});

/**
 * @swagger
 * /agendamento/{id}:
 *   patch:
 *     summary: Atualiza um agendamento
 *     tags: [Agendamento]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               monitor:
 *                 type: string
 *               servico:
 *                 type: string
 *                 enum: [Aula, Exercícios]
 *               data:
 *                 type: string
 *               hora:
 *                 type: string
 *               duracao:
 *                 type: number
 *               topicos:
 *                 type: string
 *               statusPagamento:
 *                 type: string
 *                 enum: [Pendente, Pago]
 *               formaPagamento:
 *                 type: string
 *                 enum: [Cartão, Dinheiro, Pix]
 *               motivoCancelamento:
 *                 type: string
 *     responses:
 *       200:
 *         description: Agendamento atualizado
 *       404:
 *         description: Agendamento não encontrado
 *       500:
 *         description: Erro ao atualizar agendamento
 */
// UPDATE - Atualiza agendamento por id
router.patch("/:id", autenticar, async (req, res) => {
  const id = req.params.id;
  const update = req.body;

  try {
    const agendamentoAnterior: any = await Agendamento.findById(id)
      .populate("monitor", "nome")
      .populate("aluno", "nome");

    if (!agendamentoAnterior) {
      res.status(404).json({ message: "Agendamento não encontrado!" });
      return;
    }

    const updatedAgendamento = await Agendamento.updateOne({ _id: id }, update);

    if (
      update.status === "CANCELADO" &&
      agendamentoAnterior.status !== "CANCELADO"
    ) {
      await criarNotificacaoCancelamento(
        id,
        agendamentoAnterior.monitor?._id?.toString() || "",
        agendamentoAnterior.data || "",
        agendamentoAnterior.monitor?.nome || "Monitor",
        agendamentoAnterior.aluno?.nome || "Aluno",
        agendamentoAnterior.topicos,
        update.motivoCancelamento
      );
    }

    if (
      update.status === "REMARCADO" ||
      (update.data && update.data !== agendamentoAnterior.data) ||
      (update.hora && update.hora !== agendamentoAnterior.hora)
    ) {
      await criarNotificacaoReagendamento(
        id,
        agendamentoAnterior.monitor?._id?.toString() || "",
        agendamentoAnterior.aluno?._id?.toString() || "",
        update.data || agendamentoAnterior.data || "",
        update.hora || agendamentoAnterior.hora || "",
        agendamentoAnterior.monitor?.nome || "Monitor",
        agendamentoAnterior.aluno?.nome || "Aluno",
        update.topicos || agendamentoAnterior.topicos
      );
    }

    res.status(200).json(update);
  } catch (error) {
    res.status(500).json({ erro: error });
  }
});

/**
 * @swagger
 * /agendamento/{id}:
 *   delete:
 *     summary: Remove um agendamento
 *     tags: [Agendamento]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Agendamento removido com sucesso
 *       404:
 *         description: Agendamento não encontrado
 *       500:
 *         description: Erro ao remover agendamento
 */
// DELETE - Remove agendamento por id
router.delete("/:id", adminAuth, async (req, res) => {
  const id = req.params.id;

  const agendamento = await Agendamento.findOne({ _id: id });

  if (!agendamento) {
    res.status(404).json({ message: "Agendamento não encontrado!" });
    return;
  }

  try {
    await Agendamento.deleteOne({ _id: id });
    res.status(200).json({ message: "Agendamento removido com sucesso!" });
  } catch (error) {
    res.status(500).json({ erro: error });
  }
});

export default router;
