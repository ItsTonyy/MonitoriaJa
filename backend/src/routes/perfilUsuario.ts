import { Request, Response } from "express";
import { users } from "../db-mock";
import autenticar from "../middleware/auth";
import ownerOrAdminAuth from "../middleware/ownerOrAdminAuth";
const router = require("express").Router()

/**
 * @swagger
 * /perfilUsuario/{id}:
 *   get:
 *     summary: Obtém perfil do usuário por ID
 *     tags: [Perfil]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Perfil do usuário
 *       404:
 *         description: Usuário não encontrado
 */
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

/**
 * @swagger
 * /perfilUsuario/{id}:
 *   patch:
 *     summary: Atualiza perfil do usuário
 *     tags: [Perfil]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               telefone:
 *                 type: string
 *               fotoUrl:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Usuário não encontrado
 */
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