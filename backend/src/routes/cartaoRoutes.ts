import express from "express";
import Cartao from "../models/cartao.model";
import autenticar from "../middleware/auth";
import ownerOrAdminAuth from "../middleware/ownerOrAdminAuth";
import admin from "../middleware/adminAuth";

const router = express.Router();

// CREATE - Adiciona um novo cartão
router.post("/", autenticar, async (req, res) => {
  const cartao = req.body;

  try {
    await Cartao.create(cartao);
    res.status(201).json({ message: "Cartão criado com sucesso!" });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Erro ao criar cartão";
    res.status(500).json({ erro: errorMessage });
  }
});

// READ ALL - Lista todos os cartões (apenas admin)
router.get("/", admin, async (req, res) => {
  try {
    const cartoes = await Cartao.find().populate("usuario");
    res.status(200).json(cartoes);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Erro ao buscar cartões";
    res.status(500).json({ erro: errorMessage });
  }
});

// READ BY USUARIO - Lista cartões do usuário logado (ROTA QUE FUNCIONOU)
router.get("/meus-cartoes", autenticar, async (req, res) => {
  try {
    const cartoes = await Cartao.find({ usuario: req.id }).populate("usuario");
    res.status(200).json(cartoes);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Erro ao buscar cartões";
    res.status(500).json({ erro: errorMessage });
  }
});

// READ ONE - Busca cartão por id
router.get("/:id", autenticar, async (req, res) => {
  const id = req.params.id;

  try {
    const cartao = await Cartao.findOne({ _id: id }).populate("usuario");

    if (!cartao) {
      res.status(404).json({ message: "Cartão não encontrado!" });
      return;
    }

    res.status(200).json(cartao);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Erro ao buscar cartão";
    res.status(500).json({ erro: errorMessage });
  }
});

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
    const errorMessage = error instanceof Error ? error.message : "Erro ao atualizar cartão";
    res.status(500).json({ erro: errorMessage });
  }
});

// DELETE - Remove cartão por id
router.delete("/:id", autenticar, ownerOrAdminAuth, async (req, res) => {
  const id = req.params.id;

  try {
    const cartao = await Cartao.findOne({ _id: id });

    if (!cartao) {
      res.status(404).json({ message: "Cartão não encontrado!" });
      return;
    }

    await Cartao.deleteOne({ _id: id });
    res.status(200).json({ message: "Cartão removido com sucesso!" });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Erro ao remover cartão";
    res.status(500).json({ erro: errorMessage });
  }
});

export default router;