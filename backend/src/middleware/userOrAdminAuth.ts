import { Request, Response, NextFunction } from "express";

export default function ownerOrAdminAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.id) {
    return res.status(401).json({ message: "Usuário não autenticado!" });
  }

  if (req.role?.toLowerCase() === "monitor") {
    return res.status(403).json({ message: "Acesso negado!" });
  }

  console.log("Acesso permitido!");
  return next();
}
