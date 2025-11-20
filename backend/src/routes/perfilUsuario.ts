import { Request, Response } from "express";
import { users } from "../db-mock";
import autenticar from "../middleware/auth";
import ownerOrAdminAuth from "../middleware/ownerOrAdminAuth";
const router = require("express").Router()

router.get("/perfilUsuario/:id", autenticar, ownerOrAdminAuth, (req: Request, res: Response) => {
    const { id } = req.params;
    const usuario = users.find((u) => u.id === id);
    if (!usuario) {
        return res.status(404).json({ message: "Usuário não encontrado" });
    }
    res.status(200).json({
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        telefone: usuario.telefone || "",
        fotoUrl: usuario.foto || "",
        tipoUsuario: (usuario as any).tipoUsuario || "USUARIO",
    });
});

router.patch("/perfilUsuario/:id", autenticar, ownerOrAdminAuth, (req: Request, res: Response) => {
    const { id } = req.params;
    const usuarioIndex = users.findIndex((u) => u.id === id);
    if (usuarioIndex === -1) {
        return res.status(404).json({ message: "Usuário não encontrado" });
    }
    const { nome, email, telefone, fotoUrl } = req.body;
    const usuarioAtual = users[usuarioIndex];
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ message: "Email inválido" });
    }
    if (telefone && !/^\d{2}9\d{8}$/.test(telefone)) {
        return res.status(400).json({ message: "Telefone inválido" });
    }
    const usuarioAtualizado = {
        ...usuarioAtual,
        ...(nome && { nome }),
        ...(email && { email }),
        ...(telefone && { telefone }),
        ...(fotoUrl && { foto: fotoUrl }),
    };
    users[usuarioIndex] = usuarioAtualizado;
    return res.status(200).json({
        message: "Usuário atualizado com sucesso",
        usuario: usuarioAtualizado,
    });
});

module.exports = router;