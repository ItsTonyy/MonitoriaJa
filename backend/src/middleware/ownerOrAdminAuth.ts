import { Request, Response, NextFunction } from "express";

export default function ownerOrAdminAuth(req: Request, res: Response, next: NextFunction) {
    const userId = req.params.id;
    
    console.log("ownerOrAdminAuth - req.id:", req.id);
    console.log("ownerOrAdminAuth - req.role:", req.role);
    console.log("ownerOrAdminAuth - userId:", userId);
    
    if (!req.id) {
        return res.status(401).json({ message: "Usuário não autenticado!" });
    }

    if (req.role?.toLowerCase() === 'admin' || req.id === userId) {
        console.log("Acesso permitido!");
        return next();
    }
    return res.status(403).json({ message: "Acesso negado!" });
}
