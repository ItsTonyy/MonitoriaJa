import express from "express";
import Disponibilidade from "../models/disponibilidade.model";
import autenticar from "../middleware/auth";
import ownerOrAdminAuth from "../middleware/ownerOrAdminAuth";
import adminAuth from "../middleware/adminAuth";

const router = express.Router();

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

// READ ALL - Lista todas as disponibilidades (com usuário preenchido)
router.get("/", adminAuth, async (req, res) => {
  try {
    const disponibilidades = await Disponibilidade.find().populate("usuario");
    res.status(200).json(disponibilidades);
  } catch (error) {
    res.status(500).json({ erro: error });
  }
});

// READ ONE - Busca disponibilidade por id (com usuário preenchido)
router.get("/:id", autenticar, async (req, res) => {
  const id = req.params.id;

  try {
    const disponibilidade = await Disponibilidade.findOne({ _id: id }).populate("usuarioId");

    if (!disponibilidade) {
      res.status(404).json({ message: "Disponibilidade não encontrada!" });
      return;
    }

    res.status(200).json(disponibilidade);
  } catch (error) {
    res.status(500).json({ erro: error });
  }
});

// UPDATE - Atualiza disponibilidade por id
router.patch("/:id", autenticar, async (req, res) => {
  const id = req.params.id;
  const update = req.body;
  try {
    const atual = await Disponibilidade.findById(id);
    if (!atual) {
      return res.status(404).json({ message: "Disponibilidade não encontrada!" });
    }
    if (!(req.role?.toLowerCase() === "admin" || String(atual.usuario) === req.id)) {
      return res.status(403).json({ message: "Acesso negado!" });
    }
    const updatedDisponibilidade = await Disponibilidade.updateOne({ _id: id }, update);
    if (updatedDisponibilidade.matchedCount === 0) {
      return res.status(404).json({ message: "Disponibilidade não encontrada!" });
    }
    res.status(200).json(update);
  } catch (error) {
    res.status(500).json({ erro: error });
  }
});

// DELETE - Remove disponibilidade por id
router.delete("/:id", autenticar, async (req, res) => {
  const id = req.params.id;
  const disponibilidade = await Disponibilidade.findOne({ _id: id });
  if (!disponibilidade) {
    return res.status(404).json({ message: "Disponibilidade não encontrada!" });
  }
  if (!(req.role?.toLowerCase() === "admin" || String(disponibilidade.usuario) === req.id)) {
    return res.status(403).json({ message: "Acesso negado!" });
  }
  try {
    await Disponibilidade.deleteOne({ _id: id });
    res.status(200).json({ message: "Disponibilidade removida com sucesso!" });
  } catch (error) {
    res.status(500).json({ erro: error });
  }
});
// GET - Busca todas as disponibilidades de um monitor 
router.get("/monitor/:monitorId", async (req, res) => {
  const monitorId = req.params.monitorId;

  try {
    const disponibilidades = await Disponibilidade.find({ usuario: monitorId}).populate("usuario");
    res.status(200).json(disponibilidades);
  } catch (error) {
    res.status(500).json({ erro: error });
  }
});

export default router;