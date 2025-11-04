   import { Request, Response, NextFunction } from "express";
import { users, cartoes } from "../db-mock";
import { Cartao } from "../models/cartao.model";
const router = require("express").Router();

router.get("/usuarioId", (req: Request, res: Response) => {
    const { usuarioId } = req.params;
    if (!usuarioId) {
        return res.status(400).json({ error: "usuarioId é obrigatório" });
    }
    const cartoesUsuario = cartoes.filter((c: Cartao) => c.usuarioId === usuarioId);
    return res.json(cartoesUsuario);
});

router.post("/usuarioId", (req: Request, res: Response) => {
    const { usuarioId } = req.params;
    const { numero, titular, validade, cvv, bandeira } = req.body as Cartao;
    if (!usuarioId || !numero || !titular || !validade || !cvv || !bandeira) {
        return res.status(400).json({
            error: "Campos obrigatórios: usuarioId, numero, titular, validade, cvv, bandeira",
        });
    }
    const numeroDigits = numero.replace(/\D/g, "");
    if (numeroDigits.length < 12 || numeroDigits.length > 19) {
        return res.status(400).json({ error: "Número do cartão inválido" });
    }
    if (!/^\d{2}\/\d{2}$/.test(validade)) {
        return res.status(400).json({ error: "Validade deve estar no formato MM/YY" });
    }
    if (!/^\d{3,4}$/.test(cvv)) {
        return res.status(400).json({ error: "CVV inválido" });
    }
    const allowed = ["Visa", "MasterCard", "Elo"];
    if (!allowed.includes(bandeira)) {
        return res.status(400).json({ error: `Bandeira inválida. Use: ${allowed.join(", ")}` });
    }
    const ultimosDigitos = numeroDigits.slice(-4);
    const novoId =
    cartoes.length > 0 ? Math.max(...cartoes.map((c: Cartao) => c.id || 0)) + 1 : 1;
    const novoCartao: Cartao = {
        id: novoId,
        numero: numeroDigits,
        titular,
        validade,
        cvv,
        bandeira,
        ultimosDigitos,
        usuarioId,
    };
    cartoes.push(novoCartao);
    return res.status(201).json(novoCartao);
});

router.delete("/usuarioId/:id", (req: Request, res: Response) => {
    const { id, usuarioId } = req.params;
    if (!id || !usuarioId) {
        return res.status(400).json({ error: "id e usuarioId são obrigatórios" });
    }
    const index = cartoes.findIndex(
        (c: Cartao) => String(c.id) === String(id) && String(c.usuarioId) === String(usuarioId)
    );
    if (index === -1) {
        return res.status(404).json({ error: "Cartão não encontrado para este usuário" });
    }
    cartoes.splice(index, 1);
    return res.status(204).send();
});

module.exports = router;