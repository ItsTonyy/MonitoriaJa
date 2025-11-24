import dotenv from "dotenv";
dotenv.config();
import { Request, Response, NextFunction } from "express";
const router = require("express").Router();
import User from "../models/usuario.model";
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
import sendEmail from "../config/mail";

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Autentica um usuário e retorna token JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *             required: [email, password]
 *     responses:
 *       200:
 *         description: Token gerado com sucesso
 *       401:
 *         description: Credenciais inválidas
 */
router.post(
  "/login",
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password }: { email: string; password: string } = req.body;
    const userFound = await User.findOne({ email: email });
    if (!userFound) {
      return res.status(401).json({ message: "Email ou senha incorretos." });
    }
    const senhaComparada = await bcrypt.compare(password, userFound.password);
    if (!senhaComparada) {
      return res.status(401).json({ message: "Email ou senha incorretos." });
    }
    const payload = {
      id: userFound._id,
      role: userFound.tipoUsuario,
    };
    const token = jwt.sign(payload, process.env.JWT_KEY, { expiresIn: "24h" });
    res.status(200).json({ message: token });
  }
);

/**
 * @swagger
 * /recuperar-senha:
 *   post:
 *     summary: Inicia recuperação de senha e envia email com token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *             required: [email]
 *     responses:
 *       200:
 *         description: Email de recuperação enviado
 *       400:
 *         description: Email é obrigatório
 */
router.post(
  "/recuperar-senha",
  async (req: Request, res: Response, next: NextFunction) => {
    const { email }: { email: string } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email é obrigatório." });
    }
    const userFound = await User.findOne({ email: email });
    const payload = {
      id: userFound?._id,
    };
    const token = jwt.sign(payload, process.env.JWT_RESET_KEY, {
      expiresIn: "15m",
    });
    sendEmail(email, token);
    return res
      .status(200)
      .json({
        message:
          "Um email de recuperação de senha foi enviado para o seu email.",
      });
  }
);

/**
 * @swagger
 * /redefinir-senha:
 *   put:
 *     summary: Redefine a senha usando token de recuperação
 *     tags: [Auth]
 *     parameters:
 *       - in: query
 *         name: token
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
 *               newPassword1:
 *                 type: string
 *               newPassword2:
 *                 type: string
 *             required: [newPassword1, newPassword2]
 *     responses:
 *       200:
 *         description: Senha redefinida com sucesso
 *       400:
 *         description: Validação de senha falhou
 *       401:
 *         description: Token ausente
 *       404:
 *         description: Usuário não encontrado
 */
router.put(
  "/redefinir-senha",
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      newPassword1,
      newPassword2,
    }: { newPassword1: string; newPassword2: string } = req.body;
    const token = req.query.token as string;
    try {
      if (!token) {
        return res
          .status(401)
          .json({ message: "Token de autenticação ausente." });
      }
      const decoded = jwt.verify(token, process.env.JWT_RESET_KEY) as {
        id: string;
      };
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado." });
      }
      if (!newPassword1 || !newPassword2) {
        return res
          .status(400)
          .json({ message: "Ambas as senhas são obrigatórias." });
      }
      if (newPassword1 !== newPassword2) {
        return res.status(400).json({ message: "As senhas não coincidem." });
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword1, salt);
      user.password = hashedPassword;
      await user.save();
      return res.status(200).json({ message: "Senha redefinida com sucesso." });
    } catch (err) {
      const error = err as Error;
      return res.status(500).json({ message: error.message });
    }
  }
);
export default router;
