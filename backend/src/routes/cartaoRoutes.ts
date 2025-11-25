import express from "express";
import Cartao from "../models/cartao.model";
import autenticar from "../middleware/auth";
import ownerOrAdminAuth from "../middleware/ownerOrAdminAuth";
import admin from "../middleware/adminAuth";

const router = express.Router();

/**
 * @swagger
 * /cartao:
 *   post:
 *     summary: Cria um cartão
 *     tags: [Cartao]
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
 *               numero:
 *                 type: string
 *               titular:
 *                 type: string
 *               validade:
 *                 type: string
 *               cvv:
 *                 type: string
 *               bandeira:
 *                 type: string
 *               ultimosDigitos:
 *                 type: string
 *             required: [usuario, numero, titular, validade, cvv, bandeira, ultimosDigitos]
 *     responses:
 *       201:
 *         description: Cartão criado com sucesso
 *       500:
 *         description: Erro ao criar cartão
 */
// CREATE - Adiciona um novo cartão
router.post("/:id", autenticar, ownerOrAdminAuth, async (req, res) => {
  const cartao = req.body;

  try {
    await Cartao.create(cartao);
    res.status(201).json({ message: "Cartão criado com sucesso!" });
  } catch (error) {
    res.status(500).json({ erro: error });
  }
});

/**
 * @swagger
 * /cartao:
 *   get:
 *     summary: Lista todos os cartões
 *     tags: [Cartao]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de cartões retornada com sucesso
 *       500:
 *         description: Erro ao listar cartões
 */
// READ ALL - Lista todos os cartões (com usuário preenchido)
router.get("/", admin, async (req, res) => {
  try {
    const cartoes = await Cartao.find().populate("usuario");
    res.status(200).json(cartoes);
  } catch (error) {
    res.status(500).json({ erro: error });
  }
});

router.get(
  "/meus-cartoes/:id",
  autenticar,
  ownerOrAdminAuth,
  async (req, res) => {
    try {
      const cartoes = await Cartao.find({ usuario: req.id }).populate(
        "usuario"
      );
      res.status(200).json(cartoes);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao buscar cartões";
      res.status(500).json({ erro: errorMessage });
    }
  }
);

/**
 * @swagger
 * /cartao/{id}:
 *   get:
 *     summary: Obtém um cartão por ID
 *     tags: [Cartao]
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
 *         description: Cartão encontrado
 *       404:
 *         description: Cartão não encontrado
 *       500:
 *         description: Erro ao buscar cartão
 */
// READ ONE - Busca cartão por id (com usuário preenchido)
router.get("/:id", autenticar, ownerOrAdminAuth, async (req, res) => {
  const id = req.params.id;

  try {
    const cartao = await Cartao.findOne({ _id: id }).populate("usuario");

    if (!cartao) {
      res.status(404).json({ message: "Cartão não encontrado!" });
      return;
    }

    res.status(200).json(cartao);
  } catch (error) {
    res.status(500).json({ erro: error });
  }
});

/**
 * @swagger
 * /cartao/{id}:
 *   patch:
 *     summary: Atualiza um cartão
 *     tags: [Cartao]
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
 *               numero:
 *                 type: string
 *               titular:
 *                 type: string
 *               validade:
 *                 type: string
 *               cvv:
 *                 type: string
 *               bandeira:
 *                 type: string
 *               ultimosDigitos:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cartão atualizado
 *       404:
 *         description: Cartão não encontrado
 *       500:
 *         description: Erro ao atualizar cartão
 */
// UPDATE - Atualiza cartão por id
router.patch("/:id", autenticar, ownerOrAdminAuth, async (req, res) => {
  const id = req.params.id;
  const update = req.body;

  try {
    const updatedCartao = await Cartao.updateOne({ _id: id }, update);

    if (updatedCartao.matchedCount === 0) {
      res.status(404).json({ message: "Cartão não encontrado!" });
      return;
    }

    res.status(200).json(update);
  } catch (error) {
    res.status(500).json({ erro: error });
  }
});

/**
 * @swagger
 * /cartao/{id}:
 *   delete:
 *     summary: Remove um cartão
 *     tags: [Cartao]
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
 *         description: Cartão removido com sucesso
 *       404:
 *         description: Cartão não encontrado
 *       500:
 *         description: Erro ao remover cartão
 */
// DELETE - Remove cartão por id
router.delete("/:id", autenticar, ownerOrAdminAuth, async (req, res) => {
  const userId = req.params.id;
  const { cartaoId } = req.query;

  try {
    const cartao = await Cartao.findOne({ _id: cartaoId, usuario: userId });

    if (!cartao) {
      res.status(404).json({ message: "Cartão não encontrado!" });
      return;
    }

    await Cartao.deleteOne({ _id: cartaoId });
    res.status(200).json({ message: "Cartão removido com sucesso!" });
  } catch (error) {
    res.status(500).json({ erro: error });
  }
});

export default router;
