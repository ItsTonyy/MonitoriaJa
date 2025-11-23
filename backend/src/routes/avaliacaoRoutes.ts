import express from "express";
import Avaliacao from "../models/avaliacao.model";
import { criarNotificacaoAvaliacao } from "../service/notificacaoService";
import autenticar from "../middleware/auth";
import adminAuth from "../middleware/adminAuth";

const router = express.Router();

/**
 * @swagger
 * /avaliacao:
 *   post:
 *     summary: Cria uma avaliação
 *     tags: [Avaliacao]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nota:
 *                 type: number
 *               comentario:
 *                 type: string
 *               monitor:
 *                 type: string
 *               aluno:
 *                 type: string
 *               agendamento:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [PUBLICADA, REMOVIDA]
 *               dataAvaliacao:
 *                 type: string
 *                 format: date-time
 *             required: [nota, monitor, aluno]
 *     responses:
 *       201:
 *         description: Avaliação criada
 *       500:
 *         description: Erro ao criar avaliação
 */
// CREATE - Adiciona uma nova avaliação
router.post("/", autenticar, async (req, res) => {
  const avaliacao = req.body;

  try {
    const novaAvaliacao: any = await Avaliacao.create(avaliacao);

    const avaliacaoPopulada: any = await Avaliacao.findById(novaAvaliacao._id)
      .populate("monitor", "nome")
      .populate("aluno", "nome");

    /*await criarNotificacaoAvaliacao(
      avaliacao.monitor,
      avaliacao.nota,
      avaliacao.comentario,
      avaliacaoPopulada.monitor?.nome || 'Monitor',
      avaliacaoPopulada.aluno?.nome || 'Aluno'
    );
    */
    res.status(201).json({ message: "Avaliação criada com sucesso!" });
  } catch (error) {
    res.status(500).json({ erro: error });
  }
});

/**
 * @swagger
 * /avaliacao:
 *   get:
 *     summary: Lista todas as avaliações
 *     tags: [Avaliacao]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de avaliações
 *       500:
 *         description: Erro ao listar avaliações
 */
// READ ALL - Lista todas as avaliações (com monitor, aluno e agendamento preenchidos)
router.get("/", adminAuth, async (req, res) => {
  try {
    const avaliacoes = await Avaliacao.find()
      .populate("monitor")
      .populate("aluno")
      .populate("agendamento");
    res.status(200).json(avaliacoes);
  } catch (error) {
    res.status(500).json({ erro: error });
  }
});

/**
 * @swagger
 * /avaliacao/{id}:
 *   get:
 *     summary: Obtém uma avaliação por ID
 *     tags: [Avaliacao]
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
 *         description: Avaliação encontrada
 *       404:
 *         description: Avaliação não encontrada
 *       500:
 *         description: Erro ao buscar avaliação
 */
// READ ONE - Busca avaliação por id (com monitor, aluno e agendamento preenchidos)
router.get("/:id", autenticar, async (req, res) => {
  const id = req.params.id;

  try {
    const avaliacao = await Avaliacao.findOne({ _id: id })
      .populate("monitor")
      .populate("aluno")
      .populate("agendamento");

    if (!avaliacao) {
      res.status(404).json({ message: "Avaliação não encontrada!" });
      return;
    }

    res.status(200).json(avaliacao);
  } catch (error) {
    res.status(500).json({ erro: error });
  }
});

/**
 * @swagger
 * /avaliacao/{id}:
 *   patch:
 *     summary: Atualiza uma avaliação
 *     tags: [Avaliacao]
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
 *               nota:
 *                 type: number
 *               comentario:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [PUBLICADA, REMOVIDA]
 *     responses:
 *       200:
 *         description: Avaliação atualizada
 *       404:
 *         description: Avaliação não encontrada
 *       500:
 *         description: Erro ao atualizar avaliação
 */
// UPDATE - Atualiza avaliação por id
router.patch("/:id", autenticar, async (req, res) => {
  const id = req.params.id;
  const update = req.body;

  try {
    const updatedAvaliacao = await Avaliacao.updateOne({ _id: id }, update);

    if (updatedAvaliacao.matchedCount === 0) {
      res.status(404).json({ message: "Avaliação não encontrada!" });
      return;
    }

    res.status(200).json(update);
  } catch (error) {
    res.status(500).json({ erro: error });
  }
});

/**
 * @swagger
 * /avaliacao/{id}:
 *   delete:
 *     summary: Remove uma avaliação
 *     tags: [Avaliacao]
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
 *         description: Avaliação removida com sucesso
 *       404:
 *         description: Avaliação não encontrada
 *       500:
 *         description: Erro ao remover avaliação
 */
// DELETE - Remove avaliação por id
router.delete("/:id", adminAuth, async (req, res) => {
  const id = req.params.id;

  const avaliacao = await Avaliacao.findOne({ _id: id });

  if (!avaliacao) {
    res.status(404).json({ message: "Avaliação não encontrada!" });
    return;
  }

  try {
    await Avaliacao.deleteOne({ _id: id });
    res.status(200).json({ message: "Avaliação removida com sucesso!" });
  } catch (error) {
    res.status(500).json({ erro: error });
  }
});

/**
 * @swagger
 * /avaliacao/monitor/{monitorId}:
 *   get:
 *     summary: Lista avaliações de um monitor
 *     tags: [Avaliacao]
 *     parameters:
 *       - in: path
 *         name: monitorId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de avaliações do monitor
 *       500:
 *         description: Erro ao listar avaliações do monitor
 */
// GET - Todas as avaliações de um monitor
router.get("/monitor/:monitorId", async (req, res) => {
  const monitorId = req.params.monitorId;

  try {
    const avaliacoes = await Avaliacao.find({ monitor: monitorId })
      .populate("monitor")
      .populate("aluno")
      .populate("agendamento");
    res.status(200).json(avaliacoes);
  } catch (error) {
    res.status(500).json({ erro: error });
  }
});

export default router;
