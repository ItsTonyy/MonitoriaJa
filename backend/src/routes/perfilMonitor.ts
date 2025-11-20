import { Request, Response, NextFunction } from "express";
import { users, monitores } from "../db-mock";
import autenticar from "../middleware/auth";
import ownerOrAdminAuth from "../middleware/ownerOrAdminAuth";

const router = require("express").Router()

router.get("/perfilMonitor/:id", autenticar, ownerOrAdminAuth, (req: Request, res: Response) => {
    const { id } = req.params;
    const monitor = monitores.find((m) => m.id === id);
    if (!monitor) {
        return res.status(404).json({ message: "Monitor não encontrado" });
    }
    res.status(200).json({
        id: monitor.id,
        nome: monitor.nome,
        email: monitor.email,
        telefone: monitor.telefone,
        biografia: monitor.biografia,
        materia: monitor.materia || [],
        fotoUrl: monitor.foto || "",
        listaDisponibilidades: monitor.listaDisponibilidades || [],
    });
});

router.patch("/perfilMonitor/:id", autenticar, ownerOrAdminAuth, (req: Request, res: Response) => {
    const { id } = req.params;
    const monitorIndex = monitores.findIndex((m) => m.id === id);
    if (monitorIndex === -1) {
        return res.status(404).json({ message: "Monitor não encontrado" });
    }
    const {
        nome,
        email,
        telefone,
        biografia,
        materia,
        fotoUrl,
        listaDisponibilidades,
    } = req.body;
    const monitorAtual = monitores[monitorIndex];
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ message: "Email inválido" });
    }
    if (telefone && !/^\d{2}9\d{8}$/.test(telefone)) {
        return res.status(400).json({ message: "Telefone inválido" });
    }
    const monitorAtualizado = {
        ...monitorAtual,
        ...(nome && { nome }),
        ...(email && { email }),
        ...(telefone && { telefone }),
        ...(biografia && { biografia }),
        ...(materia && { materia }),
        ...(fotoUrl && { foto: fotoUrl }),
        ...(listaDisponibilidades && { listaDisponibilidades }),
    };
    monitores[monitorIndex] = monitorAtualizado;
    return res.status(200).json({
        message: "Monitor atualizado com sucesso",
        monitor: monitorAtualizado,
    });
});''

module.exports = router;