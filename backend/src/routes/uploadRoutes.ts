import express from "express";
import { Request, Response, NextFunction } from "express";
import multer, { StorageEngine } from "multer";

const storage: StorageEngine = multer.diskStorage({
    destination: function (_req: Request, _file: Express.Multer.File, cb: (error: Error | null, destination: string) => void): void {
        cb(null, 'public/uploads/');
    },
    filename: function (_req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void): void {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage: storage });

const router = express.Router();

router.post("/", upload.single("file"), async (req: Request, res: Response, _next: NextFunction) => {
    // Lógica para lidar com o upload de arquivos
    res.json(req.file);
});

export default router;