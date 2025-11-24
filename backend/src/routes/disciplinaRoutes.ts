import express from "express";
import Disciplina from "../models/disciplina.model";
import autenticar from "../middleware/auth";
import adminAuth from "../middleware/adminAuth";
import ownerOrAdminAuth from "../middleware/ownerOrAdminAuth";

const router = express.Router();

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

// GET todas as disciplinas (nome e id)
router.get("/", async (req, res) => {
  try {
    const disciplinas = await Disciplina.find().select("nome");
    res.status(200).json(disciplinas);
  } catch (error) {
    res.status(500).json({ erro: error });
  }
});

// GET disciplina por id (apenas nome)
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

// UPDATE - Atualiza disciplina por id
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

// DELETE - Remove disciplina por id
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

// Adiciona um monitor à disciplina
router.post("/monitor", autenticar, async (req, res) => {
  const { disciplinaId, monitorId } = req.body;
  try {
    const disciplina = await Disciplina.findByIdAndUpdate(
      disciplinaId,
      { $addToSet: { listaMonitores: monitorId } }, // $addToSet evita duplicidade
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

// Remove um monitor da disciplina
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

// GET monitores de uma disciplina
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