import { Request, Response, NextFunction } from "express";
import { users, monitores } from "../db-mock";
const router = require("express").Router()

router.get("/perfilMonitor/:id", (req: Request, res: Response) => {
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

router.put("/perfilMonitor/:id", (req: Request, res: Response) => {
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
        nome: nome ?? monitorAtual.nome,
        email: email ?? monitorAtual.email,
        telefone: telefone ?? monitorAtual.telefone,
        biografia: biografia ?? monitorAtual.biografia,
        materia: materia ?? monitorAtual.materia,
        foto: fotoUrl ?? monitorAtual.foto,
        listaDisponibilidades: listaDisponibilidades ?? monitorAtual.listaDisponibilidades,
    };
    monitores[monitorIndex] = monitorAtualizado;
    res.status(200).json({
        message: "Monitor atualizado com sucesso",
        monitor: monitorAtualizado,
    });
});

module.exports = router;