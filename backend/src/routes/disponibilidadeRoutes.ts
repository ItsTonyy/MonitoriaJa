import express from "express";
import Disponibilidade from "../models/disponibilidade.model";
import autenticar from "../middleware/auth";
import ownerOrAdminAuth from "../middleware/ownerOrAdminAuth";
import adminAuth from "../middleware/adminAuth";

const router = express.Router();

/**
 * @swagger
 * /disponibilidade:
 *   post:
 *     summary: Cria uma disponibilidade
 *     tags: [Disponibilidade]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               usuario:
 *                 type: string
 *               day:
 *                 type: string
 *               times:
 *                 type: array
 *                 items:
 *                   type: string
 *             required: [usuario, day, times]
 *     responses:
 *       201:
 *         description: Disponibilidade criada
 *       500:
 *         description: Erro ao criar disponibilidade
 */
// CREATE - Adiciona uma nova disponibilidade
router.post("/", autenticar, async (req, res) => {
  const disponibilidade = req.body;
  const usuarioId = disponibilidade?.usuario;
  if (!usuarioId) {
    return res.status(400).json({ message: "Campo 'usuario' é obrigatório" });
  }
  if (!(req.role?.toLowerCase() === "admin" || req.id === String(usuarioId))) {
    return res.status(403).json({ message: "Acesso negado!" });
  }
  try {
    await Disponibilidade.create(disponibilidade);
    res.status(201).json({ message: "Disponibilidade criada com sucesso!" });
  } catch (error) {
    res.status(500).json({ erro: error });
  }
});

/**
 * @swagger
 * /disponibilidade:
 *   get:
 *     summary: Lista todas as disponibilidades
 *     tags: [Disponibilidade]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de disponibilidades
 *       500:
 *         description: Erro ao listar disponibilidades
 */
// READ ALL - Lista todas as disponibilidades (com usuário preenchido)
router.get("/", adminAuth, async (req, res) => {
  try {
    const disponibilidades = await Disponibilidade.find().populate("usuario");
    res.status(200).json(disponibilidades);
  } catch (error) {
    res.status(500).json({ erro: error });
  }
});

/**
 * @swagger
 * /disponibilidade/{id}:
 *   get:
 *     summary: Obtém uma disponibilidade por ID
 *     tags: [Disponibilidade]
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
 *         description: Disponibilidade encontrada
 *       404:
 *         description: Disponibilidade não encontrada
 *       500:
 *         description: Erro ao buscar disponibilidade
 */
// READ ONE - Busca disponibilidade por id (com usuário preenchido)
router.get("/:id", autenticar, async (req, res) => {
  const id = req.params.id;

  try {
    const disponibilidade = await Disponibilidade.findOne({ _id: id }).populate(
      "usuarioId"
    );

    if (!disponibilidade) {
      res.status(404).json({ message: "Disponibilidade não encontrada!" });
      return;
    }

    res.status(200).json(disponibilidade);
  } catch (error) {
    res.status(500).json({ erro: error });
  }
});

/**
 * @swagger
 * /disponibilidade/{id}:
 *   patch:
 *     summary: Atualiza uma disponibilidade
 *     tags: [Disponibilidade]
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
 *               day:
 *                 type: string
 *               times:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Disponibilidade atualizada
 *       404:
 *         description: Disponibilidade não encontrada
 *       500:
 *         description: Erro ao atualizar disponibilidade
 */
// UPDATE - Atualiza disponibilidade por id
router.patch("/:id", autenticar, async (req, res) => {
  const id = req.params.id;
  const update = req.body;
  try {
    const atual = await Disponibilidade.findById(id);
    if (!atual) {
      return res
        .status(404)
        .json({ message: "Disponibilidade não encontrada!" });
    }
    if (
      !(req.role?.toLowerCase() === "admin" || String(atual.usuario) === req.id)
    ) {
      return res.status(403).json({ message: "Acesso negado!" });
    }
    const updatedDisponibilidade = await Disponibilidade.updateOne(
      { _id: id },
      update
    );
    if (updatedDisponibilidade.matchedCount === 0) {
      return res
        .status(404)
        .json({ message: "Disponibilidade não encontrada!" });
    }
    res.status(200).json(update);
  } catch (error) {
    res.status(500).json({ erro: error });
  }
});

/**
 * @swagger
 * /disponibilidade/{id}:
 *   delete:
 *     summary: Remove uma disponibilidade
 *     tags: [Disponibilidade]
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
 *         description: Disponibilidade removida com sucesso
 *       404:
 *         description: Disponibilidade não encontrada
 *       500:
 *         description: Erro ao remover disponibilidade
 */
// DELETE - Remove disponibilidade por id
router.delete("/:id", autenticar, async (req, res) => {
  const id = req.params.id;
  const disponibilidade = await Disponibilidade.findOne({ _id: id });
  if (!disponibilidade) {
    return res.status(404).json({ message: "Disponibilidade não encontrada!" });
  }
  if (
    !(
      req.role?.toLowerCase() === "admin" ||
      String(disponibilidade.usuario) === req.id
    )
  ) {
    return res.status(403).json({ message: "Acesso negado!" });
  }
  try {
    await Disponibilidade.deleteOne({ _id: id });
    res.status(200).json({ message: "Disponibilidade removida com sucesso!" });
  } catch (error) {
    res.status(500).json({ erro: error });
  }
});
/**
 * @swagger
 * /disponibilidade/monitor/{monitorId}:
 *   get:
 *     summary: Lista disponibilidades de um monitor
 *     tags: [Disponibilidade]
 *     parameters:
 *       - in: path
 *         name: monitorId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de disponibilidades do monitor
 *       500:
 *         description: Erro ao listar disponibilidades do monitor
 */
// GET - Busca todas as disponibilidades de um monitor
router.get("/monitor/:monitorId", async (req, res) => {
  const monitorId = req.params.monitorId;

  try {
    const disponibilidades = await Disponibilidade.find({
      usuario: monitorId,
    }).populate("usuario");
    res.status(200).json(disponibilidades);
  } catch (error) {
    res.status(500).json({ erro: error });
  }
});

export default router;
