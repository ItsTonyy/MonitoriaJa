import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
export default function autenticar(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Token não encontrado!" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_KEY as string) as { id: string; role: string; };
        req.id = decoded.id;
        req.role = decoded.role;

        next();
    } catch (err) {
        res.status(401).json({ message: "Token inválido!" });
    }
}