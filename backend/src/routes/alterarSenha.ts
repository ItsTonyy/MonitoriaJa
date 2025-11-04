import { Request, Response, NextFunction, Router } from "express";
import { users, monitores } from "../db-mock";
const router = require("express").Router()

router.patch("/alterarSenha/:id", (req: Request, res: Response) => {
    const { id } = req.params;
    const { senhaAnterior, novaSenha } = req.body;
    const usuario =
        users.find((u) => u.id === id) || monitores.find((m) => m.id === id);
    if (!usuario) {
        return res.status(404).json({ message: "Usuário não encontrado" });
    }
    if (usuario.password !== senhaAnterior) {
        return res.status(400).json({ message: "Senha anterior incorreta" });
    }
    usuario.password = novaSenha;
    res.status(200).json({ message: "Senha atualizada com sucesso" });
});

module.exports = router;