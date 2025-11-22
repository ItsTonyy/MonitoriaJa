import express from "express";
import Disciplina from "../models/disciplina.model";
import autenticar from "../middleware/auth";
import adminAuth from "../middleware/adminAuth";
import ownerOrAdminAuth from "../middleware/ownerOrAdminAuth";

const router = express.Router();

/**
 * @swagger
 * /disciplina:
 *   post:
 *     summary: adiciona uma disciplina
 *     tags: [Disciplina]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Disciplina inserida com sucesso
 *       500:
 *         description: Erro ao inserir disciplina
 */

// CREATE - Adiciona uma nova disciplina
router.post("/", adminAuth, async (req, res) => {
  const disciplina = req.body;

  try {
    await Disciplina.create(disciplina);
    res.status(201).json({ message: "Disciplina inserida com sucesso!" });
  } catch (error) {
    res.status(500).json({ erro: error });
  }
});

/**
 * @swagger
 * /disciplina:
 *   get:
 *     summary: Retorna todas as disciplinas
 *     tags: [Disciplina]
 *     responses:
 *       200:
 *         description: Disciplinas retornadas com sucesso
 *       500:
 *         description: Erro ao retornar disciplinas
 */

// GET todas as disciplinas (apenas nomes)
router.get("/", async (req, res) => {
  try {
    const disciplinas = await Disciplina.find().select("nome -_id");
    res.status(200).json(disciplinas.map((d) => d.nome));
  } catch (error) {
    res.status(500).json({ erro: error });
  }
});

/**
 * @swagger
 * /disciplina/{id}:
 *   get:
 *     summary: Obtém nome da disciplina por ID
 *     tags: [Disciplina]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Nome da disciplina
 *       404:
 *         description: Disciplina não encontrada
 */
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const disciplina = await Disciplina.findById(id).select("nome -_id");
    if (!disciplina) {
      return res.status(404).json({ message: "Disciplina não encontrada!" });
    }
    res.status(200).json({ nome: disciplina.nome });
  } catch (error) {
    res.status(500).json({ erro: error });
  }
});
/**
 * @swagger
 * /disciplina/{id}:
 *   patch:
 *     summary: Atualiza uma disciplina por ID
 *     tags: [Disciplina]
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
 *               nome:
 *                 type: string
 *     responses:
 *       200:
 *         description: Disciplina atualizada
 *       404:
 *         description: Disciplina não encontrada
 *       500:
 *         description: Erro ao atualizar disciplina
 */
router.patch("/:id", adminAuth, async (req, res) => {
  const id = req.params.id;
  const disciplina = req.body;
  try {
    const updatedDisciplina = await Disciplina.updateOne(
      { _id: id },
      disciplina
    );

    if (updatedDisciplina.matchedCount === 0) {
      res.status(404).json({ message: "Disciplina não encontrada!" });
      return;
    }

    res.status(200).json(disciplina);
  } catch (error) {
    res.status(500).json({ erro: error });
  }
});

/**
 * @swagger
 * /disciplina/{id}:
 *   delete:
 *     summary: Remove uma disciplina por ID
 *     tags: [Disciplina]
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
 *         description: Disciplina removida com sucesso
 *       404:
 *         description: Disciplina não encontrada
 *       500:
 *         description: Erro ao remover disciplina
 */
router.delete("/:id", adminAuth, async (req, res) => {
  const id = req.params.id;

  const disciplina = await Disciplina.findOne({ _id: id });

  if (!disciplina) {
    res.status(404).json({ message: "Disciplina não encontrada!" });
    return;
  }

  try {
    await Disciplina.deleteOne({ _id: id });
    res.status(200).json({ message: "Disciplina removida com sucesso!" });
  } catch (error) {
    res.status(500).json({ erro: error });
  }
});

/**
 * @swagger
 * /disciplina/monitor:
 *   post:
 *     summary: Adiciona um monitor à uma disciplina
 *     tags: [Disciplina]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               disciplinaId:
 *                 type: string
 *               monitorId:
 *                 type: string
 *             required:
 *               - disciplinaId
 *               - monitorId
 *     responses:
 *       200:
 *         description: Monitor adicionado à disciplina
 *       404:
 *         description: Disciplina não encontrada
 *       500:
 *         description: Erro ao adicionar monitor à disciplina
 */
router.post("/monitor", autenticar, async (req, res) => {
  const { disciplinaId, monitorId } = req.body;
  try {
    const disciplina = await Disciplina.findByIdAndUpdate(
      disciplinaId,
      { $addToSet: { listaMonitores: monitorId } },
      { new: true }
    );
    if (!disciplina) {
      return res.status(404).json({ message: "Disciplina não encontrada!" });
    }
    res.status(200).json({ message: "Monitor adicionado à disciplina!" });
  } catch (error) {
    res.status(500).json({ erro: error });
  }
});

/**
 * @swagger
 * /disciplina/monitor:
 *   delete:
 *     summary: Remove um monitor de uma disciplina
 *     tags: [Disciplina]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               disciplinaId:
 *                 type: string
 *               monitorId:
 *                 type: string
 *             required:
 *               - disciplinaId
 *               - monitorId
 *     responses:
 *       200:
 *         description: Monitor removido da disciplina
 *       404:
 *         description: Disciplina não encontrada
 *       500:
 *         description: Erro ao remover monitor da disciplina
 */
router.delete("/monitor", autenticar, async (req, res) => {
  const { disciplinaId, monitorId } = req.body;
  try {
    const disciplina = await Disciplina.findByIdAndUpdate(
      disciplinaId,
      { $pull: { listaMonitores: monitorId } },
      { new: true }
    );
    if (!disciplina) {
      return res.status(404).json({ message: "Disciplina não encontrada!" });
    }
    res.status(200).json({ message: "Monitor removido da disciplina!" });
  } catch (error) {
    res.status(500).json({ erro: error });
  }
});

/**
 * @swagger
 * /disciplina/monitor/{disciplinaId}:
 *   get:
 *     summary: Lista monitores de uma disciplina
 *     tags: [Disciplina]
 *     parameters:
 *       - in: path
 *         name: disciplinaId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de monitores por ID
 *       404:
 *         description: Disciplina não encontrada
 *       500:
 *         description: Erro ao listar monitores por ID da disciplina
 */

router.get("/monitor/:disciplinaId", async (req, res) => {
  const disciplinaId = req.params.disciplinaId;
  try {
    const disciplina = await Disciplina.findById(disciplinaId).populate(
      "listaMonitores"
    );
    if (!disciplina) {
      return res.status(404).json({ message: "Disciplina não encontrada!" });
    }
    res.status(200).json(disciplina.listaMonitores);
  } catch (error) {
    res.status(500).json({ erro: error });
  }
});

export default router;
