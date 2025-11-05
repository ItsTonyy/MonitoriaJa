import express from "express";
import Notificacao from "../models/notificacao.model";

const router = express.Router();

// CREATE - Adiciona uma nova notificação
router.post("/", async (req, res) => {
  const notificacao = req.body;

  try {
    await Notificacao.create(notificacao);
    res.status(201).json({ message: "Notificação criada com sucesso!" });
  } catch (error) {
    res.status(500).json({ erro: error });
  }
});

// READ ALL - Lista todas as notificações (com destinatario e agendamento populados)
router.get("/", async (req, res) => {
  try {
    const notificacoes = await Notificacao.find()
      .populate("destinatario")
      .populate("agendamento");
    res.status(200).json(notificacoes);
  } catch (error) {
    res.status(500).json({ erro: error });
  }
});

// READ ONE - Busca notificação por id (com destinatario e agendamento populados)
router.get("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const notificacao = await Notificacao.findOne({ _id: id })
      .populate("destinatario")
      .populate("agendamento");

    if (!notificacao) {
      res.status(404).json({ message: "Notificação não encontrada!" });
      return;
    }

    res.status(200).json(notificacao);
  } catch (error) {
    res.status(500).json({ erro: error });
  }
});

// UPDATE - Atualiza notificação por id
router.patch("/:id", async (req, res) => {
  const id = req.params.id;
  const update = req.body;

  try {
    const updatedNotificacao = await Notificacao.updateOne({ _id: id }, update);

    if (updatedNotificacao.matchedCount === 0) {
      res.status(404).json({ message: "Notificação não encontrada!" });
      return;
    }

    res.status(200).json(update);
  } catch (error) {
    res.status(500).json({ erro: error });
  }
});

// DELETE - Remove notificação por id
router.delete("/:id", async (req, res) => {
  const id = req.params.id;

  const notificacao = await Notificacao.findOne({ _id: id });

  if (!notificacao) {
    res.status(404).json({ message: "Notificação não encontrada!" });
    return;
  }

  try {
    await Notificacao.deleteOne({ _id: id });
    res.status(200).json({ message: "Notificação removida com sucesso!" });
  } catch (error) {
    res.status(500).json({ erro: error });
  }
});

// GET - Todas as notificações de um destinatário específico
router.get("/destinatario/:destinatarioId", async (req, res) => {
  const destinatarioId = req.params.destinatarioId;

  try {
    const notificacoes = await Notificacao.find({ destinatario: destinatarioId })
      .populate("destinatario")
      .populate("agendamento");
    res.status(200).json(notificacoes);
  } catch (error) {
    res.status(500).json({ erro: error });
  }
});

export default router;