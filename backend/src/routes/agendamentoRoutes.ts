import express from "express";
import Agendamento from "../models/agendamento.model";

const router = express.Router();

// CREATE - Adiciona um novo agendamento
router.post("/", async (req, res) => {
  const agendamento = req.body;

  try {
    await Agendamento.create(agendamento);
    res.status(201).json({ message: "Agendamento criado com sucesso!" });
  } catch (error) {
    res.status(500).json({ erro: error });
  }
});

// READ ALL - Lista todos os agendamentos (com monitor e aluno preenchidos)
router.get("/", async (req, res) => {
  try {
    const agendamentos = await Agendamento.find()
      .populate("monitor")
      .populate("aluno");
    res.status(200).json(agendamentos);
  } catch (error) {
    res.status(500).json({ erro: error });
  }
});

// READ ONE - Busca agendamento por id (com monitor e aluno preenchidos)
router.get("/:id", async (req, res) => {
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

// UPDATE - Atualiza agendamento por id
router.patch("/:id", async (req, res) => {
  const id = req.params.id;
  const update = req.body;

  try {
    const updatedAgendamento = await Agendamento.updateOne({ _id: id }, update);

    if (updatedAgendamento.matchedCount === 0) {
      res.status(404).json({ message: "Agendamento não encontrado!" });
      return;
    }

    res.status(200).json(update);
  } catch (error) {
    res.status(500).json({ erro: error });
  }
});

// DELETE - Remove agendamento por id
router.delete("/:id", async (req, res) => {
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
