import { Request, Response, NextFunction } from "express";
import { users, cartoes } from "../db-mock";
const router = require("express").Router()

export interface Cartao {
  id?: number;
  numero?: string;
  titular?: string;
  validade?: string;
  cvv?: string;
  bandeira?: string;
  ultimosDigitos?: string;
  usuarioId?: string;
}

router.get("/", (req: Request, res: Response) => {
    const { usuarioId } = req.query;
    if (!usuarioId) {
        return res.status(400).json({ error: "usuarioId é obrigatório" });
    }
    const cartoesUsuario = cartoes.filter((c: Cartao) => c.usuarioId === usuarioId);
    res.json(cartoesUsuario);
});

router.post("/", (req: Request, res: Response) => {
    const { numero, titular, validade, cvv, bandeira, usuarioId } = req.body as Cartao;
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
    const novoId = cartoes.length > 0 ? Math.max(...cartoes.map((c: Cartao) => c.id || 0)) + 1 : 1;
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
    res.status(201).json(novoCartao);
});

router.delete("/:id", (req: Request, res: Response) => {
    const { id } = req.params;
    const { usuarioId } = req.query;
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
    res.status(204).send();
});

module.exports = router;