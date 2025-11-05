import express from "express";
import Cartao from "../models/cartao.model";

const router = express.Router();

// CREATE - Adiciona um novo cartão
router.post("/", async (req, res) => {
  const cartao = req.body;

  try {
    await Cartao.create(cartao);
    res.status(201).json({ message: "Cartão criado com sucesso!" });
  } catch (error) {
    res.status(500).json({ erro: error });
  }
});

// READ ALL - Lista todos os cartões (com usuário preenchido)
router.get("/", async (req, res) => {
  try {
    const cartoes = await Cartao.find().populate("usuario");
    res.status(200).json(cartoes);
  } catch (error) {
    res.status(500).json({ erro: error });
  }
});

// READ ONE - Busca cartão por id (com usuário preenchido)
router.get("/:id", async (req, res) => {
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

// UPDATE - Atualiza cartão por id
router.patch("/:id", async (req, res) => {
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

// DELETE - Remove cartão por id
router.delete("/:id", async (req, res) => {
  const id = req.params.id;

  const cartao = await Cartao.findOne({ _id: id });

  if (!cartao) {
    res.status(404).json({ message: "Cartão não encontrado!" });
    return;
  }

  try {
    await Cartao.deleteOne({ _id: id });
    res.status(200).json({ message: "Cartão removido com sucesso!" });
  } catch (error) {
    res.status(500).json({ erro: error });
  }
});

export default router;